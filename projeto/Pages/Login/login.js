import React, { useState } from "react";
import { 
  Alert, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import styles from '../Login/styles'; 
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function isValidEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  async function handleLogin() {
    if (!isValidEmail(email)) {
      Alert.alert("E-mail inválido");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Senha curta", "Sua senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigation.replace("Home");

    } catch (error) {

      let mensagem = "";
      switch(error.code){
        case "auth/user-not-found":
          mensagem = "Usuário não encontrado.";
          break;
        case "auth/wrong-password":
          mensagem = "Senha incorreta.";
          break;
        case "auth/invalid-email":
          mensagem = "E-mail inválido.";
          break;
        default:
          mensagem = "Falha no login. Tente novamente.";
      }
      Alert.alert("Erro no login", mensagem);
    } finally {
      setLoading(false);
    }
  }

return (
  <ImageBackground
    source={require("../../assets/fundo2.png")} 
    style={styles.background}
    resizeMode="cover" 
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.content}        
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.subtitle}>Conecte-se com suas histórias favoritas</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email..."
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input} 
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconButton}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#661414"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, loading && { opacity: 0.7 }]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Cadastro")}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.registerText}>
            Não tem acesso? Clique aqui para se cadastrar!
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  </ImageBackground>
);
}
