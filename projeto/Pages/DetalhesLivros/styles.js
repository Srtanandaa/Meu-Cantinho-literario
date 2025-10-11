import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  capa: {
    width: width * 0.5,
    height: width * 0.7,
    borderRadius: 12,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  placeholder: {
    width: width * 0.5,
    height: width * 0.7,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#661414",
    marginBottom: 5,
  },
  autor: {
    fontSize: 18,
    textAlign: "center",
    color: "#661414",
    marginBottom: 20,
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginBottom: 25,
  },
  infoBox: {
    backgroundColor: "#ffd6d6",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    width: width * 0.28,
    elevation: 2,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#661414",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },

  avaliacaoBox: {
    backgroundColor: "#ffd6d6",
    padding: 15,
    borderRadius: 20,
    width: width * 0.9,
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  stars: {
    flexDirection: "row",
    marginVertical: 8,
  },
  opiniao: {
    fontSize: 15,
    color: "#661414",
    marginTop: 5,
    textAlign: "justify",
  },

  button: {
    backgroundColor: "#ffd6d6",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 40,
    marginBottom: 40,
  },
  buttonText: {
    color: "#661414",
    fontSize: 18,
    fontWeight: "bold",
  },
  opiniao2:{
    fontSize: 15,
    color: "#661414",
    marginTop: 5,
    textAlign: "justify",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: "100%",
  }
});

export default styles;
