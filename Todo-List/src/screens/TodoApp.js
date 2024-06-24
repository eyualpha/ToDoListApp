import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Header from "../components/Header";
import Modal from "react-native-modal";
import styles from "../components/Style";
import Colors from "../components/Colors";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [editId, setEditId] = useState(null);
  const [modelVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTodos();
    loadTheme();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "This app needs notification permissions to remind you about your tasks.",
        [{ text: "OK" }]
      );
    }
  };

  const scheduleNotification = async (title, body, time) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        seconds: Math.max(
          (new Date(time).getTime() - new Date().getTime()) / 1000,
          1
        ),
        repeats: false,
      },
    });
  };

  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem("todos");
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveTodos = async (todos) => {
    try {
      await AsyncStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme !== null) {
        setIsDarkMode(JSON.parse(storedTheme));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveTheme = async (theme) => {
    try {
      await AsyncStorage.setItem("theme", JSON.stringify(theme));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddOrUpdateTodo = async () => {
    if (title.length === 0) {
      Alert.alert(
        "Warning",
        "Please provide some information about your todo."
      );
    } else {
      setModalVisible(false);
      if (editId) {
        const updatedTodos = todos.map((todo) =>
          todo.id === editId
            ? {
                id: editId,
                title,
                description,
                time,
                completed: todo.completed,
              }
            : todo
        );
        setTodos(updatedTodos);
        saveTodos(updatedTodos);
        await scheduleNotification(title, description, time);
        setEditId(null);
      } else {
        const newTodo = {
          id: Date.now().toString(),
          title,
          description,
          time,
          completed: false,
        };
        const newTodos = [...todos, newTodo];
        setTodos(newTodos);
        saveTodos(newTodos);
        await scheduleNotification(
          newTodo.title,
          newTodo.description,
          newTodo.time
        );
      }
      setTitle("");
      setDescription("");
      setTime(new Date());
    }
  };

  const handleEditTodo = (todo) => {
    setModalVisible(true);
    setTitle(todo.title);
    setDescription(todo.description);
    setTime(new Date(todo.time));
    setEditId(todo.id);
  };

  const handleDeleteTodo = async (id) => {
    Alert.alert("Are you sure?", "Your task will be permanently deleted", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => remover(id) },
    ]);
    async function remover(id) {
      const filteredTodos = todos.filter((todo) => todo.id !== id);
      setTodos(filteredTodos);
      saveTodos(filteredTodos);
      await cancelAllNotifications();
    }
  };

  const toggleCompleteTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const helper = (data) => {
    setVisible(data);
  };

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    saveTheme(newTheme);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.dark.background
            : Colors.light.background,
        },
      ]}
    >
      <Header helper={helper} />
      <Modal
        isVisible={visible}
        animationIn={"slideInLeft"}
        animationOut={"slideOutLeft"}
        onBackButtonPress={() => setVisible(false)}
        onBackdropPress={() => setVisible(false)}
      >
        <View
          style={[
            styles.optionStyle,
            {
              backgroundColor: isDarkMode
                ? Colors.dark.modalBackground
                : Colors.light.modalBackground,
            },
          ]}
        >
          <AntDesign
            name="close"
            size={24}
            color={isDarkMode ? Colors.dark.modalText : Colors.light.modalText}
            style={styles.modalCloseBtn}
            onPress={() => setVisible(false)}
            onBackButtonPress={() => setVisible(false)}
            onBackdropPress={() => setVisible(false)}
          />
          <View style={styles.optionContainer}>
            <Text
              style={[
                styles.optionTitle,
                {
                  color: isDarkMode
                    ? Colors.dark.modalText
                    : Colors.light.modalText,
                },
              ]}
            >
              Setting
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={[
                  {
                    color: isDarkMode
                      ? Colors.dark.modalText
                      : Colors.light.modalText,
                    marginRight: 10,
                  },
                ]}
              >
                Dark Mode
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleDarkMode}
                value={isDarkMode}
              />
            </View>
          </View>
          <View style={styles.versionContainer}>
            <Text style={styles.versionStyle}>Version 1.0.0</Text>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={modelVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        transparent={true}
        backdropOpacity={0.6}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: isDarkMode
                  ? Colors.dark.modalBackground
                  : Colors.light.modalBackground,
              },
            ]}
          >
            <AntDesign
              name="close"
              size={24}
              color={
                isDarkMode ? Colors.dark.modalText : Colors.light.modalText
              }
              style={styles.modalCloseBtn}
              onPress={() => {
                setModalVisible(false);
                setTitle("");
                setDescription("");
                setEditId(null);
              }}
            />
            <TextInput
              placeholder="Title"
              placeholderTextColor={"gray"}
              multiline={true}
              value={title}
              onChangeText={setTitle}
              style={[
                styles.Textinput,
                {
                  color: isDarkMode
                    ? Colors.dark.modalText
                    : Colors.light.modalText,
                },
              ]}
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor={"gray"}
              multiline={true}
              value={description}
              onChangeText={setDescription}
              style={[
                styles.Textinput,
                {
                  color: isDarkMode
                    ? Colors.dark.modalText
                    : Colors.light.modalText,
                },
              ]}
            />
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.timePicker}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: isDarkMode
                    ? Colors.dark.modalText
                    : Colors.light.modalText,
                }}
              >
                <AntDesign
                  name="clockcircle"
                  size={20}
                  color={
                    isDarkMode
                      ? Colors.dark.themeColor
                      : Colors.light.themeColor
                  }
                />
                {"  Notify at  "}
                {time.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                  const currentTime = selectedTime || time;
                  if (currentTime < new Date()) {
                    Alert.alert("Invalid Time", "Please select a future time.");
                    return;
                  }
                  setShowPicker(false);
                  setTime(currentTime);
                }}
              />
            )}

            <View>
              <TouchableOpacity
                onPress={handleAddOrUpdateTodo}
                style={[
                  styles.addUpdateBtn,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.dark.themeColor
                      : Colors.light.themeColor,
                  },
                ]}
              >
                <Text style={styles.addBtnText}>
                  {editId ? "Update Todo" : "Add Todo"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.item,
              { backgroundColor: isDarkMode ? "#333" : "#FFF" },
            ]}
          >
            <Text
              style={[
                item.completed ? styles.completedTitle : styles.title,
                { color: isDarkMode ? Colors.dark.text : Colors.light.text },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }}
            >
              {item.description}
            </Text>
            <Text
              style={{
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }}
            >
              {"Time:  "}
              {new Date(item.time).toLocaleTimeString()}
            </Text>
            <View style={styles.editDeleteBtn}>
              <TouchableOpacity onPress={() => toggleCompleteTodo(item.id)}>
                <AntDesign
                  name={item.completed ? "checkcircle" : "checkcircleo"}
                  size={24}
                  color={
                    isDarkMode
                      ? Colors.dark.themeColor
                      : Colors.light.themeColor
                  }
                />
              </TouchableOpacity>
              <AntDesign
                name="edit"
                size={24}
                color={
                  isDarkMode ? Colors.dark.themeColor : Colors.light.themeColor
                }
                onPress={() => handleEditTodo(item)}
              />
              <AntDesign
                name="delete"
                size={24}
                color={
                  isDarkMode ? Colors.dark.themeColor : Colors.light.themeColor
                }
                onPress={() => handleDeleteTodo(item.id)}
              />
            </View>
          </View>
        )}
      />
      <AntDesign
        name="pluscircle"
        size={60}
        color={isDarkMode ? Colors.dark.themeColor : Colors.light.themeColor}
        onPress={() => setModalVisible(true)}
        style={{ alignSelf: "flex-end", paddingVertical: 10, paddingRight: 15 }}
      />
    </View>
  );
};

export default TodoApp;
