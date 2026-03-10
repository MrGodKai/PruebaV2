import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';

const roles = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Mecánico', value: 'mechanic' },
  { label: 'Usuario', value: 'user' }
];

export default function LoginScreen({ setRole, goToRegister, users, goBack, setCurrentUsername }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userRef = ref(db, `registeredUsers/${username}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const user = snapshot.val();
        if (user.password === password) {
          setRole(user.role);
          setCurrentUsername(username);
          setError('');
          return;
        }
      }
      setError('Usuario o contraseña incorrectos');
    } catch (e) {
      setError('Error de conexión');
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <Image
          source={require('../assets/user-icon.png')}
          style={{width: 100, height: 100, marginBottom: 10}}
        />
      </View>
      <Text style={styles.title}>PowerCar Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerBtn} onPress={goToRegister}>
        <Text style={styles.registerText}>Registrarse</Text>
      </TouchableOpacity>
      {goBack && (
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  input: { width: 250, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, paddingHorizontal: 10 },
  roles: { flexDirection: 'row', marginBottom: 20 },
  roleBtn: { padding: 10, marginHorizontal: 5, borderRadius: 8, borderWidth: 1, borderColor: '#888' },
  selectedRole: { backgroundColor: '#007bff', borderColor: '#007bff' },
  roleText: { color: '#333' },
  loginBtn: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, marginBottom: 10 },
  loginText: { color: '#fff', fontWeight: 'bold' },
  registerBtn: { backgroundColor: '#28a745', padding: 10, borderRadius: 8 },
  registerText: { color: '#fff', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 10 },
  backBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, marginTop: 10 },
  backText: { color: '#333' }
});
