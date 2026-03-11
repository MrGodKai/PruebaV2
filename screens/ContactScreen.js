import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = () => {
    // Placeholder for sending message
    Alert.alert('Éxito', 'Mensaje enviado correctamente.');
    setForm({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Contacto</Text>
      </View>
      <Text style={styles.subtitle}>¿Tienes alguna pregunta o necesitas nuestros servicios? ¡Estamos aquí para ayudarte!</Text>

      <TextInput
        style={styles.input}
        placeholder="Tu Nombre"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Tu Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Tu Teléfono"
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Tu Mensaje"
        value={form.message}
        onChangeText={(text) => setForm({ ...form, message: text })}
        multiline
      />
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Enviar Mensaje</Text>
      </TouchableOpacity>

      <View style={styles.contactInfo}>
        <Text style={styles.infoTitle}>Información de Contacto</Text>
        <Text style={styles.infoText}>Dirección: Calle Principal 123, Ciudad, País</Text>
        <Text style={styles.infoText}>Teléfono: +123 456 7890</Text>
        <Text style={styles.infoText}>Email: info@tallerautomotriz.com</Text>
        <Text style={styles.infoText}>Horarios: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 9:00 AM - 2:00 PM</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Redes Sociales</Text>
        <View style={styles.social}>
          <Ionicons name="logo-facebook" size={24} color="#007bff" />
          <Ionicons name="logo-instagram" size={24} color="#007bff" />
          <Ionicons name="logo-whatsapp" size={24} color="#007bff" />
        </View>
        <Text style={styles.footerText}>Contacto: Tel: 8888-8888 | Email: taller@email.com</Text>
        <Text style={styles.footerText}>Ubicación: Costa Rica</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  input: { width: '100%', height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, paddingHorizontal: 10 },
  btn: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  contactInfo: { marginBottom: 20 },
  infoTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  infoText: { fontSize: 14, marginBottom: 5 },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 14, marginVertical: 5 },
  social: { flexDirection: 'row', justifyContent: 'space-around', width: 100 },
});