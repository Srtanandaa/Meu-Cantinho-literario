import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import styles from './styles';

const HomeScreen = ({ navigation }) => {
  
  const fadeBackground = useRef(new Animated.Value(0)).current;
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeLogin = useRef(new Animated.Value(0)).current;
  const fadeText = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
    Animated.sequence([
    
      Animated.timing(fadeBackground, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

      
      Animated.timing(fadeTitle, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      
      Animated.timing(fadeLogin, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

    
      Animated.timing(fadeText, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeBackground }}>
      <ImageBackground
        source={require('../../assets/fundo.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
         
          <Animated.Text style={[styles.title, { opacity: fadeTitle }]}>
            Bem-vindo ao
          </Animated.Text>

          <Animated.View style={{ opacity: fadeLogin }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>


          <Animated.View style={{ opacity: fadeText }}>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.cadastrar}>
                Não tem cadastro? Clique aqui
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
  );
};

export default HomeScreen;
