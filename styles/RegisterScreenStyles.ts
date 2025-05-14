import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  logoArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  loginContainer: {
    flex: 1,
  },
  loginField: {
    borderRadius: 10,
    width: "78%",
    marginBottom: 10,
    height: 45,
    alignSelf: "center",
    paddingLeft: 10,
    fontSize: 15,
  },
  passwordContainer: {
    width: "78%",
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    borderRadius: 10,
    alignSelf: "center",
    paddingLeft: 10,
    marginBottom: 10,
  },
  signUpButton: {
    width: "78%",
    height: 45,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    width: "78%",
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
});