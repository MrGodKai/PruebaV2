import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../firebaseConfig';
import { ref, onValue, push, update } from 'firebase/database';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CLOSED_STATUSES = ['Cerrado', 'Cerrado por cliente', 'Finalizado'];

export default function GroupChatScreen({ route, navigation }) {
  const { groupId, groupName } = route.params;
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [currentRole, setCurrentRole] = useState('user');
  const [followStatus, setFollowStatus] = useState('Recibido');
  const [estimatedTime, setEstimatedTime] = useState('Pendiente por definir');
  const [tempStatus, setTempStatus] = useState('');
  const [tempTime, setTempTime] = useState('');
  const isFollowUpClosed = CLOSED_STATUSES.includes(followStatus);

  useEffect(() => {
    navigation.setOptions({ title: groupName });
    if (route.params?.currentUser) setCurrentUser(route.params.currentUser);
    if (route.params?.currentRole) setCurrentRole(route.params.currentRole);

    const groupMetaRef = ref(db, `groups/${groupId}/seguimiento`);
    onValue(groupMetaRef, snapshot => {
      const meta = snapshot.val() || {};
      setFollowStatus(meta.estado || 'Recibido');
      setEstimatedTime(meta.tiempoEstimado || 'Pendiente por definir');
      setTempStatus(meta.estado || 'Recibido');
      setTempTime(meta.tiempoEstimado || 'Pendiente por definir');
    });

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

  const updateFollowUp = () => {
    if (currentRole !== 'mechanic' && currentRole !== 'admin') return;

    update(ref(db, `groups/${groupId}/seguimiento`), {
      estado: tempStatus.trim() || 'Recibido',
      tiempoEstimado: tempTime.trim() || 'Pendiente por definir',
      actualizadoPor: currentUser,
      actualizadoEn: Date.now()
    });
  };

  const sendMessage = () => {
    if (isFollowUpClosed) return;
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
    if (isFollowUpClosed) return;
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
    <SafeAreaView style={styles.safeArea}>
    <View style={[styles.container, { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 10 }]}>
      <Text style={styles.title}>{groupName}</Text>

      <View style={styles.followBox}>
        <Text style={styles.followTitle}>Seguimiento del vehículo</Text>
        <Text style={styles.followText}>Estado actual: {followStatus}</Text>
        <Text style={styles.followText}>Tiempo estimado: {estimatedTime}</Text>

        {(currentRole === 'mechanic' || currentRole === 'admin') ? (
          <View style={styles.editorBox}>
            <TextInput
              style={styles.metaInput}
              value={tempStatus}
              onChangeText={setTempStatus}
              placeholder="Estado (ej: En reparación)"
            />
            <TextInput
              style={styles.metaInput}
              value={tempTime}
              onChangeText={setTempTime}
              placeholder="Tiempo estimado (ej: 2 horas)"
            />
            <TouchableOpacity style={styles.updateBtn} onPress={updateFollowUp}>
              <Text style={styles.updateText}>Actualizar seguimiento</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {isFollowUpClosed ? (
        <View style={styles.closedBanner}>
          <Text style={styles.closedBannerText}>Este seguimiento está cerrado. No se pueden enviar mensajes.</Text>
        </View>
      ) : null}

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
          placeholder={isFollowUpClosed ? 'Seguimiento cerrado' : 'Escribe un mensaje...'}
          editable={!isFollowUpClosed}
        />
        <TouchableOpacity style={[styles.sendBtn, isFollowUpClosed && styles.sendBtnDisabled]} onPress={sendMessage} disabled={isFollowUpClosed}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sendBtn, isFollowUpClosed && styles.sendBtnDisabled]} onPress={sendImage} disabled={isFollowUpClosed}>
          <Text style={styles.sendText}>Foto</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginBottom: 8 },
  followBox: { backgroundColor: '#f0f7ff', borderWidth: 1, borderColor: '#d3e8ff', borderRadius: 10, padding: 10, marginBottom: 8 },
  followTitle: { fontWeight: 'bold', color: '#1d466f', marginBottom: 4 },
  followText: { color: '#2f597f', fontSize: 12, marginBottom: 2 },
  editorBox: { marginTop: 8 },
  metaInput: { height: 40, borderWidth: 1, borderColor: '#b7d4f0', borderRadius: 8, backgroundColor: '#fff', paddingHorizontal: 10, marginBottom: 8 },
  updateBtn: { backgroundColor: '#2a9d8f', padding: 10, borderRadius: 8, alignItems: 'center' },
  updateText: { color: '#fff', fontWeight: 'bold' },
  list: { flex: 1, marginBottom: 10 },
  msgBox: { backgroundColor: '#e6f7ff', padding: 8, borderRadius: 8, marginVertical: 4 },
  myMsg: { backgroundColor: '#d1ffd6', alignSelf: 'flex-end' },
  msgUser: { fontWeight: 'bold', color: '#007bff' },
  msgText: { color: '#333' },
  inputBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10 },
  sendBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginLeft: 8 },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: '#fff', fontWeight: 'bold' },
  closedBanner: { backgroundColor: '#fff3cd', borderWidth: 1, borderColor: '#ffe08a', borderRadius: 8, padding: 10, marginBottom: 8 },
  closedBannerText: { color: '#6f4e00', fontWeight: '600', fontSize: 12 },
  backBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, alignSelf: 'center', marginTop: 10 },
  backText: { color: '#333' }
});
