import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';

export default function RegisterScreen({ onRegister, goBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // El rol siempre será 'user' por defecto
  const role = 'user';
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setSuccess('');
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Usuario y contraseña requeridos');
      return;
    }
    // Validar que el usuario no exista en Firebase
    try {
      const userRef = ref(db, `registeredUsers/${cleanUsername}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setError('Ese nombre de usuario ya está registrado');
        return;
      }
      setError('');
      setSuccess('Registro exitoso, ahora puedes iniciar sesión');
      setUsername('');
      setPassword('');
      onRegister({ username: cleanUsername, password, role });
    } catch (e) {
      setError('Error de conexión, intenta de nuevo');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Registro de Usuario</Text>
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
      {/* Opción de rol eliminada, todos los registros serán usuario normal */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={{ color: 'green', marginBottom: 10 }}>{success}</Text> : null}
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
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
  registerBtn: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, marginBottom: 10 },
  registerText: { color: '#fff', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8 },
  backText: { color: '#333' }
});
