import React, { useEffect, useState } from "react"; 
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  Image, 
  Modal, 
  TextInput, 
  Platform, 
  TouchableWithoutFeedback,
  Keyboard

} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { ScrollView } from "react-native";
import styles from "./style";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [livrosContagem, setLivrosContagem] = useState({ lidos: 0, lendo: 0, queroLer: 0 });
  const [generoMaisLido, setGeneroMaisLido] = useState("");
  const [autorMaisLido, setAutorMaisLido] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [metaLivros, setMetaLivros] = useState("");
  const [prazoData, setPrazoData] = useState(null); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [metaAtiva, setMetaAtiva] = useState(null); 
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const carregarMeta = async () => {
      const metaSalva = await AsyncStorage.getItem(`meta_${auth.currentUser.uid}`);
      if (metaSalva) {
        setMetaAtiva(JSON.parse(metaSalva));
      }
    };
    carregarMeta();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);

          const savedPhoto = await AsyncStorage.getItem(`profilePic_${user.uid}`);
          if (savedPhoto) setProfilePic(savedPhoto);

          const livrosRef = collection(db, "usuarios", user.uid, "livros");
          const livrosSnapshot = await getDocs(livrosRef);

          const contagem = { lidos: 0, lendo: 0, queroLer: 0 };
          const generosCount = {};
          const autoresCount = {}; 

          livrosSnapshot.forEach((livroDoc) => {
            const livro = livroDoc.data();
            const status = livro.status?.toLowerCase();
            if (status === "lido") contagem.lidos += 1;
            else if (status === "lendo") contagem.lendo += 1;
            else if (status === "quero ler") contagem.queroLer += 1;

            if (status === "lido" && livro.genero) generosCount[livro.genero] = (generosCount[livro.genero] || 0) + 1;
            if (status === "lido" && livro.autor) autoresCount[livro.autor] = (autoresCount[livro.autor] || 0) + 1;
          });

          setLivrosContagem(contagem);

          const sortedGeneros = Object.entries(generosCount).sort((a, b) => b[1] - a[1]);
          if (sortedGeneros.length > 0) setGeneroMaisLido(sortedGeneros[0][0]);

          const sortedAutores = Object.entries(autoresCount).sort((a, b) => b[1] - a[1]);
          if (sortedAutores.length > 0) setAutorMaisLido(sortedAutores[0][0]);
        } else console.log("Usuário não encontrado");
      } catch (error) {
        console.log("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, []);

 const salvarMeta = async () => {
  if (!metaLivros || !prazoData) {
    Alert.alert("Atenção", "Preencha todos os campos!");
    return;
  }

  const lidosIniciais = livrosContagem.lidos || 0; 
  const novaMeta = {
    total: parseInt(metaLivros),
    prazo: prazoData,
    concluido: 0,
    lidosIniciais, 
  };

  await AsyncStorage.setItem(`meta_${auth.currentUser.uid}`, JSON.stringify(novaMeta));
  setMetaAtiva(novaMeta);
  setMetaLivros("");
  setPrazoData(null);
  setModalVisible(false);
};

  useEffect(() => {
   if (metaAtiva) {
  const livrosLidos = livrosContagem.lidos || 0;
  const progressoAtual = livrosLidos - (metaAtiva.lidosIniciais || 0);
  const atual = progressoAtual > metaAtiva.total ? metaAtiva.total : Math.max(progressoAtual, 0);

  setProgresso(atual);
  setMetaAtiva({ ...metaAtiva, concluido: atual });
}
  }, [livrosContagem]);


  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para selecionar uma foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePic(uri);
      const user = auth.currentUser;
      if (user?.uid) await AsyncStorage.setItem(`profilePic_${user.uid}`, uri);
    }
  };

  const handleRemovePhoto = async () => {
    const user = auth.currentUser;
    if (user?.uid) await AsyncStorage.removeItem(`profilePic_${user.uid}`);
    setProfilePic(null);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.navigate("Meu cantinho literário"))
      .catch((error) => Alert.alert("Erro ao sair", error.message));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setPrazoData(selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topo} />
      <View style={styles.perfilContainer}>
        <TouchableOpacity onPress={handlePickImage}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : (
            <Ionicons name="person-circle" size={100} color="#600" />
          )}
        </TouchableOpacity>

        {profilePic ? (
          <TouchableOpacity onPress={handleRemovePhoto}>
            <Text style={{ color: "#600", fontWeight: "bold", marginTop: 5 }}>Remover Foto</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePickImage}>
            <Text style={{ color: "#600", fontWeight: "bold", marginTop: 5 }}>Adicionar Foto</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.nome}>{userData?.nome} {userData?.sobrenome}</Text>
        <Text style={styles.email}>E-mail: {userData?.email}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
          <TouchableOpacity style={styles.statusBox} onPress={() => navigation.navigate("Home", { filtro: "lendo" })}>
            <MaterialCommunityIcons name="book-open-page-variant" size={30} color="#600" />
            <Text style={styles.statusText}>Lendo</Text>
            <Text style={styles.statusNumber}>{livrosContagem.lendo}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statusBox} onPress={() => navigation.navigate("Home", { filtro: "lido" })}>
            <MaterialCommunityIcons name="book-open-variant" size={30} color="#600" />
            <Text style={styles.statusText}>Lidos</Text>
            <Text style={styles.statusNumber}>{livrosContagem.lidos}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statusBox} onPress={() => navigation.navigate("Home", { filtro: "Quero Ler" })}>
            <MaterialCommunityIcons name="book-plus-multiple" size={30} color="#600" />
            <Text style={styles.statusText}>Quero Ler</Text>
            <Text style={styles.statusNumber}>{livrosContagem.queroLer}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {autorMaisLido && (
        <View style={styles.autorBox}>
          <View style={styles.autorRow}>
            <MaterialCommunityIcons name="star" size={24} color="#600" style={{ marginRight: 5 }} />
            <Text style={styles.autorTitulo}>Autor favorito:</Text>
          </View>
          <Text style={styles.autorNome}>{autorMaisLido}</Text>
        </View>
      )}

      {generoMaisLido && (
        <View style={styles.generoBox}>
          <View style={styles.generoTituloRow}>
            <MaterialCommunityIcons name="crown" size={24} color="#600" style={{ marginRight: 5 }} />
            <Text style={styles.generoTitulo}>Gênero mais lido:</Text>
          </View>
          <Text style={styles.generoNome}>{generoMaisLido}</Text>
        </View>
      )}

     {!metaAtiva && (
  <TouchableOpacity style={styles.addMetaButton} onPress={() => setModalVisible(true)}>
    <MaterialCommunityIcons name="calendar-plus" size={24} color="#600" />
    <Text style={styles.addMetaButtonText}>Adicionar Meta</Text>
  </TouchableOpacity>
)}

<Modal visible={modalVisible} transparent animationType="slide">
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <View style={{
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 15,
          textAlign: 'center',
          color: '#333'
        }}>
          Defina uma meta literária
        </Text>

        <TextInput
          placeholder="Quantidade de livros que pretende ler"
          placeholderTextColor="#600"
          keyboardType="numeric"
          value={metaLivros}
          onChangeText={setMetaLivros}
          style={styles.input}
        />

       <TouchableOpacity
  onPress={() => {
    Keyboard.dismiss(); 
    setShowDatePicker(true); 
  }}
  style={[styles.input, { justifyContent: "center" }]}
>
  <Text style={{ color: prazoData ? "#000" : "#600" }}>
    {prazoData ? prazoData.toLocaleDateString("pt-BR") : "Selecionar prazo"}
  </Text>
</TouchableOpacity>

        {showDatePicker && (
          <View style={{ backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' }}>
            <DateTimePicker
              value={prazoData || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "calendar"}
              onChange={handleDateChange}
            />
          </View>
        )}

        <View style={styles.botoesContainer}>
          <TouchableOpacity style={styles.botaoSalvar} onPress={salvarMeta}>
            <Text style={styles.botaoSalvarTexto}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisible(false)}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>

{metaAtiva && (
  <View style={{
    marginHorizontal: 20,
    marginTop: 15,    
    padding: 15, 
    backgroundColor: '#ffd6d6', 
    borderRadius: 10,
    alignItems: 'center',
  }}>
    <Text style={{ 
      fontWeight: 'bold', 
      fontSize: 16, 
      marginBottom: 5,
      textAlign: 'center',
      color: "#600"
    }}>
      Meta Literária
    </Text>

    <Text style={{ fontSize: 14, marginBottom: 8 }}>
      {`${progresso}/${metaAtiva.total} livros até ${new Date(metaAtiva.prazo).toLocaleDateString('pt-BR')}`}
    </Text>

    <View style={{ 
      width: '100%', 
      height: 10, 
      backgroundColor: '#fdefefff', 
      borderRadius: 5, 
      marginBottom: 10 
    }}>
      <View style={{
        height: 10,
        width: `${(progresso / metaAtiva.total) * 100}%`,
        backgroundColor: '#600',
        borderRadius: 5,
      }} />
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 10 }}>
      <TouchableOpacity
        style={{ flex: 1, marginRight: 5, paddingVertical: 10, backgroundColor: '#ffd6d6', borderRadius: 8, alignItems: 'center' }}
        onPress={() => {
          setMetaLivros(metaAtiva.total.toString());
          setPrazoData(new Date(metaAtiva.prazo));
          setModalVisible(true);
        }}
      >
        <Text style={{ color: '#600', fontWeight: 'bold' }}>Editar Meta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flex: 1, marginLeft: 5, paddingVertical: 10, backgroundColor: '#ffd6d6', borderRadius: 8, alignItems: 'center' }}
        onPress={() => {
          Alert.alert(
            "Excluir Meta",
            "Tem certeza que deseja excluir sua meta literária?",
            [
              { text: "Cancelar", style: "cancel" },
              { 
                text: "Excluir", 
                style: "destructive", 
                onPress: async () => {
                  await AsyncStorage.removeItem(`meta_${auth.currentUser.uid}`);
                  setMetaAtiva(null);
                } 
              },
            ]
          );
        }}
      >
        <Text style={{ color: '#600', fontWeight: 'bold' }}>Excluir Meta</Text>
      </TouchableOpacity>
    </View>
  </View>
)}



      <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={32} color="#600" />
      </TouchableOpacity>

      <View style={styles.navegacaoInferior}>
        <TouchableOpacity style={styles.itemNavegacao} onPress={() => navigation.navigate("Home")}>
          <MaterialCommunityIcons name="bookshelf" size={30} color="#600" />
        </TouchableOpacity>

        <View style={styles.separador} />

        <TouchableOpacity style={styles.itemNavegacao}>
          <Ionicons name="person-circle" size={30} color="#600" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
