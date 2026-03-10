import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
  const timeline = [
    { year: '2010', title: 'Fundación', description: 'Iniciamos operaciones con un pequeño taller familiar.' },
    { year: '2015', title: 'Expansión', description: 'Ampliamos nuestras instalaciones y equipo.' },
    { year: '2020', title: 'Tecnología', description: 'Incorporamos herramientas de diagnóstico avanzadas.' },
    { year: '2023', title: 'Certificación', description: 'Obtuvimos certificaciones internacionales.' },
    { year: '2024', title: 'Crecimiento', description: 'Abrimos sucursales en otras ciudades.' }
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80',
    // Add more images
  ];

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Nuestra Historia</Text>
      </View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Nuestra <Text style={styles.heroSpan}>Historia</Text></Text>
      </View>

      <View style={styles.content}>
        <View style={styles.timeline}>
          {timeline.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.marker}>
                <Text style={styles.year}>{item.year}</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.gallery}>
        <Text style={styles.galleryTitle}>Galería</Text>
        <View style={styles.grid}>
          {gallery.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
        </View>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f0f0f0' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#007bff', marginLeft: 10 },
  hero: { backgroundColor: '#007bff', padding: 20, alignItems: 'center' },
  heroTitle: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  heroSpan: { color: '#fff' },
  content: { padding: 20 },
  timeline: { position: 'relative' },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  marker: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#007bff', alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  year: { color: '#fff', fontWeight: 'bold' },
  timelineContent: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  description: { fontSize: 14, marginTop: 5 },
  gallery: { padding: 20 },
  galleryTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  image: { width: '30%', height: 100, marginBottom: 10 },
  footer: { padding: 20, alignItems: 'center' },
  footerText: { fontSize: 14, marginVertical: 5 },
  social: { flexDirection: 'row', justifyContent: 'space-around', width: 100 },
});