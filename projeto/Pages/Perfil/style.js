import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffd6d6",
    justifyContent: "space-between",
  },

  perfilContainer: {
    alignItems: "center",
    marginTop: 25,
  },

  nome: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: "bold",
    color: "#333",
  },

   statusBox: {
    backgroundColor: "#ffd6d6", 
    padding: 15,
    borderRadius: 12,
    alignItems: "center", 
    width: 100, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, 
     marginHorizontal: 8,
     marginTop: 10,
  },

    statusText: {
    marginTop: 5,
    fontSize: 15,
    color: "#600",
  },

  statusNumber: {
    fontWeight: "600",
    fontSize: 18,
    marginTop: 8,
    color: "#600",
  },
 
  generoBox: {
  backgroundColor: "#ffd6d6", 
  borderRadius: 12,
  padding: 15,
  alignItems: "center",
  marginTop: 20,
  flexDirection: "column",
  width: "90%", 
  alignSelf: "center",
},

generoTitulo: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#600", 
  marginBottom: 5,
},

generoTituloRow: {
    flexDirection: "row",
    alignItems: "center",
  },

generoNome: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#600",
},

autorBox: {
    backgroundColor: "#ffd6d6", 
  borderRadius: 12,
  padding: 15,
  alignItems: "center",
  marginTop: 20,
  flexDirection: "column",
  width: "90%", 
  alignSelf: "center",
  },

  autorRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  autorTitulo: {
    fontSize: 16,
  fontWeight: "bold",
  color: "#600", 
  marginBottom: 5,
  },

  autorNome: {
    fontSize: 18,
  fontWeight: "bold",
  color: "#600",
  },

   addMetaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffd6d6", 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },

  addMetaButtonText: {
    color: "#600",
    fontWeight: "bold",
    width: "90%",
    fontSize: 16,
    marginLeft: 10,
  },

   modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },

  input: {
    width: "100%",
    backgroundColor: "#ffd6d6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    
  },

   botoesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },

  botaoSalvar: {
    flex: 1,
    backgroundColor: "#600",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
  },

  botaoSalvarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  botaoCancelar: {
    flex: 1,
    backgroundColor: "#600", 
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: "center",
  },

  botaoCancelarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  email: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },

  botaoLogout: {
   position: "absolute",
  top: 40,        
  right: 20,     
  zIndex: 10,    
},


  navegacaoInferior: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#600",
    paddingVertical: 8,
    backgroundColor: "#ffd6d6",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  itemNavegacao: {
    flex: 1,
    alignItems: "center",
  },

  separador: {
    width: 1,
    backgroundColor: "#600",
    height: "100%",
  },
});
