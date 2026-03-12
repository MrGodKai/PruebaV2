import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Nuestra Historia</Text>
        </View>

        <Text style={styles.title}>Sobre Power<Text style={styles.brandRed}>CAR</Text></Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra Misión</Text>
          <Text style={styles.text}>
            En Power<Text style={styles.brandInline}>CAR</Text> nos comprometemos a brindar servicios automotrices confiables, transparentes y de alta calidad,
            apoyados por tecnología moderna y un equipo técnico especializado.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestros Valores</Text>

          <View style={styles.valueItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#ff3b30" />
            </View>
            <Text style={styles.valueText}><Text style={styles.bold}>Calidad:</Text> garantía en cada servicio.</Text>
          </View>

          <View style={styles.valueItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={24} color="#ff3b30" />
            </View>
            <Text style={styles.valueText}><Text style={styles.bold}>Profesionalismo:</Text> personal capacitado y certificado.</Text>
          </View>

          <View style={styles.valueItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={24} color="#ff3b30" />
            </View>
            <Text style={styles.valueText}><Text style={styles.bold}>Puntualidad:</Text> tiempos claros y cumplidos.</Text>
          </View>

          <View style={styles.valueItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash" size={24} color="#ff3b30" />
            </View>
            <Text style={styles.valueText}><Text style={styles.bold}>Transparencia:</Text> precios justos y comunicación directa.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Destacados</Text>

          {[
            'Mantenimiento general',
            'Diagnóstico computarizado',
            'Reparación de motores',
            'Sistema de frenos y suspensión',
            'Sistema eléctrico',
            'Cambio de fluidos'
          ].map((service, idx) => (
            <View key={idx} style={styles.serviceItem}>
              <Image source={require('../assets/check.png')} style={styles.checkIcon} />
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.contactBtn} onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.contactText}>Contáctanos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },

  backBtn: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 10
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#fff'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#fff'
  },

  brandRed: {
    color: '#ff3b30'
  },

  brandInline: {
    color: '#ff3b30',
    fontWeight: '700'
  },

  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#1e293b',
    borderRadius: 12
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#ff3b30'
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#cbd5f5'
  },

  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },

  iconContainer: {
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },

  valueText: {
    fontSize: 16,
    flex: 1,
    color: '#fff'
  },

  bold: {
    fontWeight: 'bold'
  },

  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  serviceText: {
    color: '#cbd5f5',
    fontSize: 16
  },

  checkIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: 'contain'
  },

  contactBtn: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },

  contactText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});