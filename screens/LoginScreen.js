import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';

const ALLOWED_ROLES = ['admin', 'mechanic', 'user'];

export default function LoginScreen({ setRole, goToRegister, users, goBack, setCurrentUsername }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Usuario y contraseña requeridos');
      return;
    }

    try {
      const userRef = ref(db, `registeredUsers/${cleanUsername}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const user = snapshot.val();
        const userRole = ALLOWED_ROLES.includes(user.role) ? user.role : 'user';
        if (user.password === password) {
          setRole(userRole);
          setCurrentUsername(cleanUsername);
          setError('');
          return;
        }
      }

      const localUser = users.find(u => u.username === cleanUsername && u.password === password);
      if (localUser) {
        const localRole = ALLOWED_ROLES.includes(localUser.role) ? localUser.role : 'user';
        setRole(localRole);
        setCurrentUsername(cleanUsername);
        setError('');
        return;
      }

      setError('Usuario o contraseña incorrectos');
    } catch (e) {
      const localUser = users.find(u => u.username === cleanUsername && u.password === password);
      if (localUser) {
        const localRole = ALLOWED_ROLES.includes(localUser.role) ? localUser.role : 'user';
        setRole(localRole);
        setCurrentUsername(cleanUsername);
        setError('');
      } else {
        setError('Error de conexión');
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('../assets/user-icon.png')}
            style={{ width: 100, height: 100, marginBottom: 10 }}
          />
        </View>

        <Text style={styles.title}>PowerCar Login</Text>

        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
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
  label: {
    width: '100%',
    maxWidth: 300,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
    marginTop: 5
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
  loginBtn: { 
    backgroundColor: '#3498db', 
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
  loginText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  registerBtn: { 
    backgroundColor: '#2ecc71', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    width: '100%', 
    maxWidth: 300, 
    alignItems: 'center' 
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
    marginTop: 20, 
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