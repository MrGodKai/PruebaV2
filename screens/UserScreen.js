import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

export default function UserScreen({ setRole, goToOnline, goToGroups, navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const menuOptions = [
    { title: 'Inicio', screen: 'Home' },
    { title: 'Servicios', screen: 'Services' },
    { title: 'Nuestra Historia', screen: 'About' },
    { title: 'Productos', screen: 'Products' }
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate(item.screen); }}>
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
        <Text style={styles.menuBtnText}>Menú</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Bienvenido, Usuario</Text>
      <TouchableOpacity style={styles.appointmentBtn} onPress={() => navigation.navigate('Appointment')}>
        <Text style={styles.appointmentText}>Agendar Cita</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatBtn} onPress={goToOnline}>
        <Text style={styles.chatText}>Ver usuarios conectados</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.groupsBtn} onPress={goToGroups}>
        <Text style={styles.groupsText}>Grupos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => setRole(null)}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
      <Modal visible={menuVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Navegación</Text>
            <FlatList
              data={menuOptions}
              renderItem={renderMenuItem}
              keyExtractor={(item) => item.screen}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setMenuVisible(false)}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  menuBtn: { position: 'absolute', top: 20, right: 20, backgroundColor: '#3498db', padding: 10, borderRadius: 5 },
  menuBtnText: { color: '#fff', fontWeight: 'bold' },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  appointmentBtn: { backgroundColor: '#9b59b6', padding: 15, borderRadius: 10, marginBottom: 15, width: '80%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5 },
  appointmentText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  chatBtn: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, marginBottom: 15, width: '80%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5 },
  chatText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  groupsBtn: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, marginBottom: 15, width: '80%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5 },
  groupsText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 5 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  menuContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  menuTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  menuItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  menuText: { fontSize: 16 },
  closeBtn: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  closeText: { color: '#fff', fontWeight: 'bold' }
});
