import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}>
            <Ionicons name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: '#000' }]}>Nuestra Historia</Text>
        </View>

        <Text style={[styles.title, { color: '#000' }]}>
          Sobre Power<Text style={{ color: 'red' }}>CAR</Text>
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#000' }]}>Nuestra Misión</Text>
          <Text style={[styles.text, { color: '#000' }]}>
            En PowerCAR, nos comprometemos a proporcionar servicios de reparación y mantenimiento automotriz de la más alta calidad. Nuestro equipo de profesionales certificados trabaja con las mejores tecnologías para garantizar que tu vehículo esté en perfecto estado.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#000' }]}>Nuestros Valores</Text>
          <View style={styles.valueItem}>
            <Ionicons name="shield-checkmark" size={24} color="#ff4500" />
            <Text style={[styles.valueText, { color: '#000' }]}>Calidad: Garantizamos el mejor servicio</Text>
          </View>
          <View style={styles.valueItem}>
            <Ionicons name="people" size={24} color="#ff4500" />
            <Text style={[styles.valueText, { color: '#000' }]}>Profesionalismo: Equipo capacitado y certificado</Text>
          </View>
          <View style={styles.valueItem}>
            <Ionicons name="time" size={24} color="#ff4500" />
            <Text style={[styles.valueText, { color: '#000' }]}>Puntualidad: Entrega en el tiempo acordado</Text>
          </View>
          <View style={styles.valueItem}>
            <Ionicons name="cash" size={24} color="#ff4500" />
            <Text style={[styles.valueText, { color: '#000' }]}>Precios justos: Transparencia en nuestros costos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#000' }]}>Nuestro Equipo</Text>
          <Text style={[styles.text, { color: '#000' }]}>
            Contamos con un equipo de mecánicos expertos con más de 15 años de experiencia en el ramo automotriz. Nuestros profesionales se mantienen constantemente actualizados con las últimas tecnologías y técnicas de reparación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#000' }]}>Servicios Destacados</Text>
          <View style={styles.serviceList}>
            <Text style={[styles.serviceItem, { color: '#000' }]}>✓ Mantenimiento general</Text>
            <Text style={[styles.serviceItem, { color: '#000' }]}>✓ Diagnóstico computarizado</Text>
            <Text style={[styles.serviceItem, { color: '#000' }]}>✓ Reparación de motores</Text>
            <Text style={[styles.serviceItem, { color: '#000' }]}>✓ Sistema de frenos</Text>
            <Text style={[styles.serviceItem, { color: '#000' }]}>✓ Suspensión y alineación</Text>
            <Text style={[styles.serviceItem, { color: '#000' }]}>✓ Sistema eléctrico</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#000' }]}>Ubicación y Contacto</Text>
          <Text style={[styles.text, { color: '#000' }]}>
            <Ionicons name="location" size={16} color="#ff4500" /> San José, Costa Rica
          </Text>
          <Text style={[styles.text, { color: '#000' }]}>
            <Ionicons name="call" size={16} color="#ff4500" /> Tel: 8888-8888
          </Text>
          <Text style={[styles.text, { color: '#000' }]}>
            <Ionicons name="mail" size={16} color="#ff4500" /> Email: taller@powercar.com
          </Text>
        </View>

        <TouchableOpacity style={styles.contactBtn} onPress={() => navigation.navigate('Contact')}>
          <Text style={[styles.contactText, { color: '#000' }]}>Contáctanos</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30
  },

  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10
  },

  text: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24
  },

  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8
  },

  valueText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
    flex: 1
  },

  serviceList: {
    marginTop: 10
  },

  serviceItem: {
    fontSize: 16,
    color: '#000',
    marginVertical: 6,
    lineHeight: 22
  },

  contactBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },

  contactText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  }
});
