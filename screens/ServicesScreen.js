import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const services = [
  { icon: 'car', title: 'Mantenimiento General', description: 'Cambio de aceite y filtros, Revisión de motor y fluidos, Chequeo preventivo completo', price: 'Desde $50' },
  { icon: 'construct', title: 'Frenos y Suspensión', description: 'Inspección y cambio de pastillas/discos, Alineación y balanceo, Reparación de amortiguadores', price: 'Desde $35' },
  { icon: 'flash', title: 'Sistema Eléctrico', description: 'Diagnóstico de batería y alternador, Reparación de cableado y luces, Instalación de accesorios eléctricos', price: 'Desde $30' },
  { icon: 'settings', title: 'Diagnóstico Computarizado', description: 'Escaneo de errores y sensores, Consultas de ECU, Informe detallado al cliente', price: 'Desde $25' },
  { icon: 'cog', title: 'Transmisión', description: 'Mantenimiento de caja, Cambio de aceite de transmisión, Reparación de embrague', price: 'Desde $60' },
  { icon: 'snow', title: 'Climatización', description: 'Recarga de A/C, Reparación de compresores, Limpieza de ductos', price: 'Desde $50' },
  { icon: 'swap-horizontal', title: 'Alineación y Balanceo', description: 'Alineación de ruedas (4 puntos), Balanceo dinámico y estático, Inspección de suspensión', price: 'Desde $45' },
  { icon: 'water', title: 'Cambio de Fluidos', description: 'Cambio de aceite motor, Cambio de líquido de frenos, Cambio de refrigerante', price: 'Desde $40' },
  { icon: 'hammer', title: 'Reparación de Motor', description: 'Reparación de fugas, Revisión de válvulas, Cambio de correas', price: 'Desde $80' }
];

export default function ServicesScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}>
            <Ionicons name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Servicios</Text>
        </View>

        <Text style={styles.title}>Nuestros Servicios</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué Ofrecemos?</Text>
          <Text style={styles.text}>
            Ofrecemos una amplia gama de servicios automotrices con calidad garantizada y precios competitivos. Cada trabajo se realiza con atención al detalle por profesionales certificados y con las mejores herramientas disponibles.
          </Text>
        </View>

        {services.map((service, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.serviceHeader}>
              <Ionicons name={service.icon} size={32} color="#ff4500" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </View>
            </View>
            <Text style={styles.text}>{service.description}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.contactBtn} onPress={() => navigation.navigate('Appointment')}>
          <Text style={styles.contactText}>Agendar Cita</Text>
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
    marginBottom: 20,
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

  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },

  servicePrice: {
    fontSize: 16,
    color: '#ff4500',
    fontWeight: 'bold',
    marginTop: 4
  },

  text: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24
  },

  contactBtn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },

  contactText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});