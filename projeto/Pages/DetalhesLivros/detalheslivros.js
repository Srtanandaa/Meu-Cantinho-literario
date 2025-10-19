import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView, 
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";


export default function DetalhesLivros({ route }) {
  const navigation = useNavigation();
  const { livro } = route.params;
  const [status, setStatus] = useState(livro.status);
  const [avaliacao, setAvaliacao] = useState(livro.avaliacao || 0);
  const [avaliacaoEscrita, setAvaliacaoEscrita] = useState(
    livro.avaliacaoEscrita || ""
  );
  const [editando, setEditando] = useState(false);
  const [paginasLidas, setPaginasLidas] = useState(livro.paginasLidas || 0);
  const [menuVisible, setMenuVisible] = useState(false);

  const livroRef = doc(db, "usuarios", livro.userId, "livros", livro.id);

const [modalProgressoVisible, setModalProgressoVisible] = useState(false);
const [novoProgresso, setNovoProgresso] = useState(paginasLidas);

  useEffect(() => {
    const carregarLivro = async () => {
      try {
        const docSnap = await getDoc(livroRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStatus(data.status);
          setAvaliacao(data.avaliacao || 0);
          setAvaliacaoEscrita(data.avaliacaoEscrita || "");
          setPaginasLidas(data.paginasLidas || 0);
        }
      } catch (error) {
        console.log(error);
      }
    };
    carregarLivro();
  }, []);

  const atualizarCampo = async (campos) => {
    try {
      await updateDoc(livroRef, campos);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o livro.");
    }
  };

  const marcarComoLido = () => {
    setStatus("Lido");
    setEditando(true);
    atualizarCampo({ status: "Lido" });
  };

  const salvarAvaliacao = () => {
    setEditando(false);
    atualizarCampo({ avaliacao, avaliacaoEscrita });
  };

  const handleAtualizarPaginas = async () => {
    if (!paginasLidas || isNaN(paginasLidas)) {
      Alert.alert("Atenção", "Digite um valor válido.");
      return;
    }
    const lidas = parseInt(paginasLidas);
    const novoProgresso = livro.numPaginas ? lidas / livro.numPaginas : 0;
    await atualizarCampo({ paginasLidas: lidas });
  };

  const renderEstrelas = () =>
    [1, 2, 3, 4, 5].map((num) => (
      <TouchableOpacity key={num} onPress={() => setAvaliacao(num)}>
        <Ionicons
          name={num <= avaliacao ? "star" : "star-outline"}
          size={30}
          color="#b22222"
        />
      </TouchableOpacity>
    ));

  const iniciarLeitura = () => {
    setStatus("Lendo");
    atualizarCampo({ status: "Lendo" });
  };

  const apagarLivro = async () => {
    Alert.alert(
      "Confirmação",
      "Deseja realmente apagar este livro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(livroRef);
              Alert.alert("Sucesso", "Livro apagado com sucesso.");
              navigation.goBack();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível apagar o livro.");
            }
          },
        },
      ]
    );
  };

  const editarLivro = () => {
   navigation.navigate("Cadastrar livro", { livroParaEditar: livro });
  };

   return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff0f0" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
         
          <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 10 }}>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={25} color="#b22222" />
            </TouchableOpacity>
          </View>

       
          <Modal
            transparent
            visible={menuVisible}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}>
                <View
                  style={{
                    position: "absolute",
                    top: 50,
                    right: 20,
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    padding: 10,
                    elevation: 5,
                  }}
                >
                  <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => { setMenuVisible(false); editarLivro(); }}>
                    <Text>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => { setMenuVisible(false); apagarLivro(); }}>
                    <Text style={{ color: "red" }}>Apagar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

      
          {livro.imagem ? (
            <Image source={{ uri: livro.imagem }} style={styles.capa} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ fontSize: 50 }}>📖</Text>
            </View>
          )}

          <Text style={styles.titulo}>{livro.titulo || "Sem título"}</Text>
          <Text style={styles.autor}>{livro.autor || "Autor desconhecido"}</Text>

        
          <View style={styles.infoContainer}>
            {[
              { icone: "calendar-outline", label: "Data", valor: livro.dataLancamento || "—" },
              { icone: "checkmark-circle-outline", label: "Status", valor: status },
              { icone: "book-outline", label: "Gênero", valor: livro.genero || "—" },
            ].map((info, i) => (
              <View key={i} style={styles.infoBox}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                  <Ionicons name={info.icone} size={20} color="#b22222" />
                  <Text style={[styles.infoLabel, { marginLeft: 6 }]}>{info.label}</Text>
                </View>
                <Text style={styles.infoText}>{info.valor}</Text>
              </View>
            ))}
          </View>

           {status === "Quero Ler" && (
          <TouchableOpacity style={styles.button} onPress={iniciarLeitura}>
            <Text style={styles.buttonText}>Começar a ler</Text>
          </TouchableOpacity>
        )}

         {status === "Lendo" && (
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
      Progresso de leitura
    </Text>

    <Text style={{ fontSize: 14, marginBottom: 8 }}>
      {`${paginasLidas}/${livro.numPaginas} páginas`}
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
        width: `${(paginasLidas / livro.numPaginas) * 100}%`,
        backgroundColor: '#600',
        borderRadius: 5,
      }} />
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 10 }}>
      <TouchableOpacity
        style={{ flex: 1, marginRight: 5, paddingVertical: 10, backgroundColor: '#ffd6d6', borderRadius: 8, alignItems: 'center' }}
        onPress={() => setModalProgressoVisible(true)}
      >
        <Text style={{ color: '#600', fontWeight: 'bold' }}>Atualizar Progresso</Text>
      </TouchableOpacity>

      {paginasLidas === livro.numPaginas && (
        <TouchableOpacity
          style={{ flex: 1, marginLeft: 5, paddingVertical: 10, backgroundColor: '#ffd6d6', borderRadius: 8, alignItems: 'center' }}
          onPress={marcarComoLido}
        >
          <Text style={{ color: '#600', fontWeight: 'bold' }}>Concluir</Text>
        </TouchableOpacity>
      )}
    </View>
    
    <Modal
      transparent
      visible={modalProgressoVisible}
      animationType="fade"
      onRequestClose={() => setModalProgressoVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalProgressoVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
          <View style={{ width: 300, backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Atualizar páginas lidas</Text>
            <TextInput
              keyboardType="numeric"
              value={novoProgresso.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                setNovoProgresso(num > livro.numPaginas ? livro.numPaginas : num);
              }}
              style={{ borderWidth: 1, borderColor: "#b22222", borderRadius: 8, padding: 10, marginBottom: 15 }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => setModalProgressoVisible(false)}
              >
                <Text style={{ color: "#b22222", fontWeight: "bold" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPaginasLidas(novoProgresso);
                  atualizarCampo({ paginasLidas: novoProgresso });
                  setModalProgressoVisible(false);
                }}
              >
                <Text style={{ color: "#b22222", fontWeight: "bold" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  </View>
)}             

          {status === "Lido" && (
          <View style={styles.avaliacaoBox}>
            <Text style={styles.infoLabel}>Avaliação</Text>
            <View style={styles.stars}>{renderEstrelas()}</View>

            {editando ? (
              <>
                <TextInput
                  style={styles.opiniao2}
                  multiline
                  placeholder="Escreva sua opinião..."
                  value={avaliacaoEscrita}
                  onChangeText={setAvaliacaoEscrita}
                />
                <TouchableOpacity
                  style={[styles.button, { marginTop: 10, marginBottom: 0 }]}
                  onPress={salvarAvaliacao}
                >
                  <Text style={styles.buttonText}>Salvar Avaliação</Text>
                </TouchableOpacity>
              </>
            ) : avaliacaoEscrita ? (
              <Text style={styles.opiniao}>{avaliacaoEscrita}</Text>
            ) : null}
          </View>
        )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}