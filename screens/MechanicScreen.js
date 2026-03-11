import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MechanicScreen({ setRole, goToGroups, goToAppointments }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido, Mecánico</Text>
      <TouchableOpacity style={styles.chatBtn} onPress={goToGroups}>
        <Text style={styles.chatText}>Ver seguimientos de clientes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.appointmentBtn} onPress={goToAppointments}>
        <Text style={styles.chatText}>Gestionar citas agendadas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={() => setRole(null)}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  chatBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginBottom: 10 },
  appointmentBtn: { backgroundColor: '#2a9d8f', padding: 10, borderRadius: 8, marginBottom: 10 },
  chatText: { color: '#fff', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8 },
  logoutText: { color: '#333', fontWeight: 'bold' }
});
