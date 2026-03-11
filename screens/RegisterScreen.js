import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
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
          <Image source={{ uri: 'https://ui-avatars.com/api/?name=User&background=cccccc&color=666666&size=150' }} style={styles.image} />
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
      {success ? <Text style={styles.success}>{success}</Text> : null}
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
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5', 
    padding: 20 
  },
  image: { 
    width: 150, 
    height: 150, 
    marginBottom: 20, 
    borderRadius: 75 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 40, 
    color: '#333', 
    textAlign: 'center' 
  },
  input: { 
    width: '100%', 
    maxWidth: 300, 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    marginBottom: 20, 
    paddingHorizontal: 15, 
    backgroundColor: '#fff', 
    fontSize: 16 
  },
  error: { 
    color: '#e74c3c', 
    marginBottom: 20, 
    fontSize: 14, 
    textAlign: 'center' 
  },
  success: { 
    color: '#27ae60', 
    marginBottom: 20, 
    fontSize: 14, 
    textAlign: 'center' 
  },
  registerBtn: { 
    backgroundColor: '#2ecc71', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    marginBottom: 15, 
    width: '100%', 
    maxWidth: 300, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
    elevation: 5 
  },
  registerText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  backBtn: { 
    backgroundColor: '#95a5a6', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    width: '100%', 
    maxWidth: 300, 
    alignItems: 'center' 
  },
  backText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});
