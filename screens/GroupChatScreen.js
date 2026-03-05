import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { ref, onValue, push, update } from 'firebase/database';

export default function GroupChatScreen({ route, navigation }) {
  const { groupId, groupName } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: groupName });
    // Obtener usuario actual (puedes ajustar esto según tu auth)
    // Aquí se asume que el username está en navigation params o contexto global
    if (route.params?.currentUser) setCurrentUser(route.params.currentUser);
    // Escuchar mensajes del grupo
    const groupRef = ref(db, `groups/${groupId}/mensajes`);
    onValue(groupRef, snapshot => {
      const data = snapshot.val() || {};
      const arr = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(arr);
    });
  }, [groupId, groupName, navigation, route.params]);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería');
      return false;
    }
    return true;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const groupRef = ref(db, `groups/${groupId}/mensajes`);
    push(groupRef, {
      texto: input,
      usuario: currentUser,
      timestamp: Date.now()
    });
    setInput('');
  };

  const sendImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        const data = new FormData();
        data.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'upload.jpg'
        });
        data.append('upload_preset', 'powercar_chat');
        const res = await fetch('https://api.cloudinary.com/v1_1/dunbqlyaz/image/upload', {
          method: 'POST',
          body: data
        });
        const json = await res.json();
        if (json.secure_url) {
          const groupRefDb = ref(db, `groups/${groupId}/mensajes`);
          push(groupRefDb, { usuario: currentUser, imagen: json.secure_url, timestamp: Date.now() });
        }
      }
    } catch (e) {
      console.log('Error al seleccionar o subir imagen:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.msgBox, item.usuario === currentUser && styles.myMsg]}>
            <Text style={styles.msgUser}>{item.usuario}</Text>
            {item.texto && <Text style={styles.msgText}>{item.texto}</Text>}
            {item.imagen && typeof item.imagen === 'string' && item.imagen.startsWith('http') && (
              <Image
                source={{ uri: item.imagen }}
                style={{ width: 140, height: 140, borderRadius: 12, marginTop: 8, borderWidth: 2, borderColor: '#007bff', backgroundColor: '#eee' }}
                resizeMode="cover"
              />
            )}
          </View>
        )}
        keyExtractor={(_, idx) => idx.toString()}
        style={styles.list}
      />
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={sendImage}>
          <Text style={styles.sendText}>Foto</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginBottom: 8 },
  list: { flex: 1, marginBottom: 10 },
  msgBox: { backgroundColor: '#e6f7ff', padding: 8, borderRadius: 8, marginVertical: 4 },
  myMsg: { backgroundColor: '#d1ffd6', alignSelf: 'flex-end' },
  msgUser: { fontWeight: 'bold', color: '#007bff' },
  msgText: { color: '#333' },
  inputBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10 },
  sendBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginLeft: 8 },
  sendText: { color: '#fff', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, alignSelf: 'center', marginTop: 10 },
  backText: { color: '#333' }
});
