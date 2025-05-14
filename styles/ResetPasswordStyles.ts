import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    paddingHorizontal: 20
  },
  emailField: {
    borderRadius: 10,
    width: '100%',
    marginBottom: 5,
    height: 45,
    paddingLeft: 10,
    fontSize: 15,
  },
  resetButton: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 5
  },
  successText: {
    color: 'green',
    fontSize: 14,
    width: '100%',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold'
  }
});