import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function AdminScreen({ setRole }) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      loadAppointments();
      loadProducts();
    }
  }, [isLoggedIn]);

  const loadAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(apps);
  };

  const loadProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(prods);
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const changeStatus = async (id, newStatus) => {
    await updateDoc(doc(db, 'appointments', id), { status: newStatus });
    loadAppointments();
  };

  const deleteAppointment = async (id) => {
    await deleteDoc(doc(db, 'appointments', id));
    loadAppointments();
  };

  const changeProductStatus = async (id, newStatus) => {
    await updateDoc(doc(db, 'products', id), { status: newStatus });
    loadProducts();
  };

  const updateProduct = async () => {
    Alert.alert('Info', 'Función de actualizar producto no implementada');
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Ionicons name="shield-checkmark" size={60} color="#007bff" />
        <Text style={styles.title}>Área de Administración</Text>
        <Text style={styles.subtitle}>Introduce tus credenciales para acceder al panel administrativo.</Text>

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

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Ionicons name="car" size={30} color="#007bff" />
        <Text style={styles.headerText}>Panel Administrativo</Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => { setIsLoggedIn(false); setRole(null); }}
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Gestión de Citas</Text>

      <ScrollView horizontal>
        <View style={styles.table}>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Nombre</Text>
            <Text style={styles.tableHeaderText}>Email</Text>
            <Text style={styles.tableHeaderText}>Fecha</Text>
            <Text style={styles.tableHeaderText}>Hora</Text>
            <Text style={styles.tableHeaderText}>Estado</Text>
            <Text style={styles.tableHeaderText}>Acciones</Text>
          </View>

          {appointments.map(app => (
            <View key={app.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{app.name}</Text>
              <Text style={styles.tableCell}>{app.email}</Text>
              <Text style={styles.tableCell}>{app.date}</Text>
              <Text style={styles.tableCell}>{app.time}</Text>
              <Text style={styles.tableCell}>{app.status}</Text>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => changeStatus(app.id, 'En revisión')}>
                  <Text style={styles.actionText}>Revisar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeStatus(app.id, 'Listo')}>
                  <Text style={styles.actionText}>Listo</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteAppointment(app.id)}>
                  <Text style={styles.actionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Gestión de Productos</Text>

      <ScrollView horizontal>
        <View style={styles.table}>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Nombre</Text>
            <Text style={styles.tableHeaderText}>Estado</Text>
            <Text style={styles.tableHeaderText}>Acciones</Text>
          </View>

          {products.map(prod => (
            <View key={prod.id} style={styles.tableRow}>

              <Text style={styles.tableCell}>{prod.name}</Text>
              <Text style={styles.tableCell}>{prod.status}</Text>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => changeProductStatus(prod.id, 'Disponible')}>
                  <Text style={styles.actionText}>Disponible</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeProductStatus(prod.id, 'Agotado')}>
                  <Text style={styles.actionText}>Agotado</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => updateProduct()}>
                  <Text style={styles.actionText}>Actualizar</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}

        </View>
      </ScrollView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },

  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10
  },

  loginBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },

  loginText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  logoutBtn: {
    backgroundColor: '#ccc',
    padding: 8,
    borderRadius: 8
  },

  logoutText: {
    color: '#333'
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },

  table: {
    marginBottom: 20
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10
  },

  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },

  tableCell: {
    flex: 1,
    textAlign: 'center'
  },

  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  actionText: {
    color: '#007bff',
    fontSize: 12
  }

});