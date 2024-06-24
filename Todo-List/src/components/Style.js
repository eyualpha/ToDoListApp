import { StyleSheet } from "react-native";
import Colors from "./Colors";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  Textinput: {
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    height: "auto",
    color: "#fff",
  },
  item: {
    padding: 10,
    backgroundColor: Colors.cardColor,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 2,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
  },
  timePicker: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 20,
    alignSelf: "center",
  },
  timeBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  addUpdateBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.themeColor,
    marginBottom: 12,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  plusBtnContainer: {
    alignItems: "flex-end",
    margin: 20,
  },
  editDeleteBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: Colors.cardColor,
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseBtn: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  optionStyle: {
    flex: 1,
    width: "50%",
    backgroundColor: Colors.cardColor,
    paddingTop: 10,
    paddingRight: 10,
    borderRadius: 20,
  },
  optionTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
  },
  optionContainer: {
    marginHorizontal: 15,
  },
  optionItem: {
    fontSize: 18,
    paddingBottom: 5,
  },
  versionStyle: {
    color: "gray",
    marginBottom: 20,
  },
  versionContainer: {
    justifyContent: "flex-end",
    alignSelf: "center",
    marginTop: "auto",
  },
  darkTeamTextToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "gray",
    borderBottomWidth: 1,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "gray",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default styles;
