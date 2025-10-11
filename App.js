import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './projeto/Pages/Landing/landing'; 
import CadastroScreen from './projeto/Pages/Cadastro/cadastro'; 
import LoginScreen from './projeto/Pages/Login/login'; 
import HomeScreen from './projeto/Pages/Home/home';
import AddBookScreen from './projeto/Pages/AddBookScreen/addbook'
import PerfilScreen from './projeto/Pages/Perfil/perfil';
import DetalhesLivros from './projeto/Pages/DetalhesLivros/detalheslivros'


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Meu cantinho literário">
        <Stack.Screen name="Meu cantinho literário" component={Landing} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component= {HomeScreen}/>
        <Stack.Screen name="perfil" component={PerfilScreen} />
        <Stack.Screen name= "Cadastrar livro" component={AddBookScreen}/>
        <Stack.Screen name="Detalhes do livro" component={DetalhesLivros} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
