import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import styles from "./styles";

export default function DetalhesLivros({ route }) {
  const { livro } = route.params;
  const [status, setStatus] = useState(livro.status);
  const [avaliacao, setAvaliacao] = useState(livro.avaliacao || 0);
  const [avaliacaoEscrita, setAvaliacaoEscrita] = useState(livro.avaliacaoEscrita || "");
  const [editando, setEditando] = useState(false);

  const livroRef = doc(db, "usuarios", livro.userId, "livros", livro.id);

  useEffect(() => {
    const carregarLivro = async () => {
      try {
        const docSnap = await getDoc(livroRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStatus(data.status);
          setAvaliacao(data.avaliacao || 0);
          setAvaliacaoEscrita(data.avaliacaoEscrita || "");
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

  const renderEstrelas = () =>
    [1, 2, 3, 4, 5].map((num) => (
      <TouchableOpacity key={num} onPress={() => setAvaliacao(num)}>
        <Ionicons name={num <= avaliacao ? "star" : "star-outline"} size={30} color="#b22222" />
      </TouchableOpacity>
    ));

  return (
    <ScrollView style={{ backgroundColor: "#fff0f0" }}>
      <View>
        {livro.imagem ? (
          <Image source={{ uri: livro.imagem }} style={styles.capa} />
        ) : (
          <View style={styles.placeholder}><Text style={{ fontSize: 50 }}>📖</Text></View>
        )}

        <Text style={styles.titulo}>{livro.titulo || "Sem título"}</Text>
        <Text style={styles.autor}>{livro.autor || "Autor desconhecido"}</Text>

        <View style={styles.infoContainer}>
          {[
            { label: "📅 Data", valor: livro.dataLancamento || "—" },
            { label: "✅ Status", valor: status },
            { label: "📚 Gênero", valor: livro.genero || "—" },
          ].map((info, i) => (
            <View key={i} style={styles.infoBox}>
              <Text style={styles.infoLabel}>{info.label}</Text>
              <Text style={styles.infoText}>{info.valor}</Text>
            </View>
          ))}
        </View>

        {status === "Lido" && (
          <View style={styles.avaliacaoBox}>
            <Text style={styles.infoLabel}>Avaliação</Text>
            <View style={styles.stars}>{renderEstrelas()}</View>
            {editando ? (
              <TextInput style={styles.opiniao2}
                multiline
                placeholder="Escreva sua opinião..."
                value={avaliacaoEscrita}
                onChangeText={setAvaliacaoEscrita}
              />
            ) : avaliacaoEscrita ? (
              <Text style={styles.opiniao}>{avaliacaoEscrita}</Text>
            ) : null}
            {editando && (
              <TouchableOpacity style={[styles.button, { marginTop: 10, marginBottom: 0 }]} onPress={salvarAvaliacao}>
                <Text style={styles.buttonText}>Salvar Avaliação</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {status !== "Lido" && (
          <TouchableOpacity style={styles.button} onPress={marcarComoLido}>
            <Text style={styles.buttonText}>Marcar como concluído</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
