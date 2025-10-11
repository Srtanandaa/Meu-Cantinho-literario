import React, { useEffect, useState } from "react"; 
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Modal, TextInput, Button } from "react-native";
import styles from "./style";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [livrosContagem, setLivrosContagem] = useState({ lidos: 0, lendo: 0, queroLer: 0 });
  const [generoMaisLido, setGeneroMaisLido] = useState("");
  const [autorMaisLido, setAutorMaisLido] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [metaLivros, setMetaLivros] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("");

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

          if (status === "lido" && livro.genero) {
            if (generosCount[livro.genero]) generosCount[livro.genero] += 1;
            else generosCount[livro.genero] = 1;
          }

          if (status === "lido" && livro.autor) {
            if (autoresCount[livro.autor]) autoresCount[livro.autor] += 1;
            else autoresCount[livro.autor] = 1;
          }
        });

        setLivrosContagem(contagem);

        const sortedGeneros = Object.entries(generosCount).sort((a, b) => b[1] - a[1]);
        if (sortedGeneros.length > 0) setGeneroMaisLido(sortedGeneros[0][0]);

        const sortedAutores = Object.entries(autoresCount).sort((a, b) => b[1] - a[1]);
        if (sortedAutores.length > 0) setAutorMaisLido(sortedAutores[0][0]);
      } else {
        console.log("Documento do usuário não existe");
      }
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
    }
  };

  fetchUser();
}, []);


  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.navigate("Meu cantinho literário"))
      .catch((error) => Alert.alert("Erro ao sair", error.message));
  };

  return (
  <View style={styles.container}>
    <View style={styles.topo} />

    <View style={styles.perfilContainer}>
      <Ionicons name="person-circle" size={100} color="#600" />
      <Text style={styles.nome}>
        {userData?.nome} {userData?.sobrenome}
      </Text>
      <Text style={styles.email}>E-mail: {userData?.email}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
        <TouchableOpacity
          style={styles.statusBox}
          onPress={() => navigation.navigate("Home", { filtro: "lendo" })}
        >
          <MaterialCommunityIcons name="book-open-page-variant" size={30} color="#600" />
          <Text style={styles.statusText}>Lendo</Text>
          <Text style={styles.statusNumber}>{livrosContagem.lendo}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statusBox}
          onPress={() => navigation.navigate("Home", { filtro: "lido" })}
        >
          <MaterialCommunityIcons name="book-open-variant" size={30} color="#600" />
          <Text style={styles.statusText}>Lidos</Text>
          <Text style={styles.statusNumber}>{livrosContagem.lidos}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statusBox}
          onPress={() => navigation.navigate("Home", { filtro: "Quero Ler" })}
        >
          <MaterialCommunityIcons name="book-plus-multiple" size={30} color="#600" />
          <Text style={styles.statusText}>Quero Ler</Text>
          <Text style={styles.statusNumber}>{livrosContagem.queroLer}</Text>
        </TouchableOpacity>
      </View>
    </View>


        {autorMaisLido ? (
          <View style={styles.autorBox}>
            <View style={styles.autorRow}>
              <MaterialCommunityIcons name="star" size={24} color="#600" style={{ marginRight: 5 }} />
              <Text style={styles.autorTitulo}>Autor favorito:</Text>
            </View>
            <Text style={styles.autorNome}>{autorMaisLido}</Text>
          </View>
        ) : null}

      {generoMaisLido ? (
  <View style={styles.generoBox}>
    <View style={styles.generoTituloRow}>
      <MaterialCommunityIcons name="crown" size={24} color="#600" style={{ marginRight: 5 }} />
      <Text style={styles.generoTitulo}>Gênero mais lido:</Text>
    </View>
    <Text style={styles.generoNome}>{generoMaisLido}</Text>
  </View>
) : null}

<TouchableOpacity style={styles.addMetaButton} onPress={() => setModalVisible(true)}>
  <MaterialCommunityIcons name="calendar-plus" size={24} color="#600" />
  <Text style={styles.addMetaButtonText}>Adicionar Meta</Text>
</TouchableOpacity>


<Modal visible={modalVisible} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitulo}>Nova Meta</Text>

    <TextInput
      placeholder="Número de livros"
      keyboardType="numeric"
      value={metaLivros}
      onChangeText={setMetaLivros}
      style={styles.input}
    />

    <TextInput
      placeholder="Prazo (meses)"
      keyboardType="numeric"
      value={prazoMeses}
      onChangeText={setPrazoMeses}
      style={styles.input}
    />

    <View style={styles.botoesContainer}>
      <TouchableOpacity
        style={styles.botaoSalvar}
        onPress={() => {
          
          setModalVisible(false);
        }}
      >
        <Text style={styles.botaoSalvarTexto}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoCancelar}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={32} color="#600" />
      </TouchableOpacity>

      <View style={styles.navegacaoInferior}>
        <TouchableOpacity
          style={styles.itemNavegacao}
          onPress={() => navigation.navigate("Home")}
        >
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
