import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 25,
    borderRadius: 8,
    margin: 15,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    marginTop: 5,
  },
  itemCard: {
    flexDirection: 'row',
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
    elevation: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    resizeMode: 'contain',
    backgroundColor: '#eee',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});