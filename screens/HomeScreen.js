import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const features = [
    { icon: 'construct', text: 'Herramientas Avanzadas' },
    { icon: 'time', text: 'Servicio Rápido' },
    { icon: 'shield-checkmark', text: 'Garantía de Calidad' }
  ];

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="car" size={30} color="#000000" />
        <Text style={styles.headerText}>Power<Text style={{color: 'red'}}>CAR</Text></Text>
      </View>
      <View style={styles.home}>
        <View style={styles.overlay}></View>
        <View style={styles.content}>
          <Text style={styles.title}>Mantenimiento <Text style={styles.span}>Profesional</Text></Text>
          <Text style={styles.subtitle}>Expertos en reparación y mantenimiento automotriz. Confía en nosotros para cuidar tu vehículo con la mejor tecnología y atención personalizada.</Text>
          <View style={styles.features}>
            {features.map((feature, index) => (
              <View key={index} style={styles.feature}>
                <Ionicons name={feature.icon} size={24} color="#fff" />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Services')}>
            <Text style={styles.btnText}>Nuestros Servicios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Appointment')}>
            <Text style={styles.btnTextSecondary}>Agendar Cita</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('About')}>
          <Ionicons name="information-circle" size={40} color="#000000" />
          <Text style={styles.menuText}>Nuestra Historia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Products')}>
          <Ionicons name="bag" size={40} color="#000000" />
          <Text style={styles.menuText}>Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Services')}>
          <Ionicons name="build" size={40} color="#000000" />
          <Text style={styles.menuText}>Servicios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Appointment')}>
          <Ionicons name="calendar" size={40} color="#000000" />
          <Text style={styles.menuText}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Contact')}>
          <Ionicons name="call" size={40} color="#000000" />
          <Text style={styles.menuText}>Contacto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Redes Sociales</Text>
        <View style={styles.social}>
          <Ionicons name="logo-facebook" size={24} color="#000000" />
          <Ionicons name="logo-instagram" size={24} color="#000000" />
          <Ionicons name="logo-whatsapp" size={24} color="#000000" />
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
  header: { backgroundColor: '#fff', padding: 10, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000000' },
  home: { height: 400, backgroundColor: '#333333', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  content: { alignItems: 'center', padding: 20 },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  span: { color: '#fff' },
  subtitle: { fontSize: 16, color: '#fff', textAlign: 'center', marginVertical: 10 },
  features: { flexDirection: 'row', marginVertical: 20, flexWrap: 'wrap', justifyContent: 'center' },
  feature: { alignItems: 'center', marginHorizontal: 5 },
  featureText: { color: '#fff', marginTop: 5 },
  btn: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  btnText: { color: '#007bff', fontWeight: 'bold' },
  btnSecondary: { backgroundColor: '#28a745', padding: 10, borderRadius: 8 },
  btnTextSecondary: { color: '#fff', fontWeight: 'bold' },
  menu: { padding: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  menuBtn: { flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0', padding: 20, borderRadius: 12, margin: 10, width: '40%', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  menuText: { fontSize: 14, marginTop: 10, color: '#000000', textAlign: 'center', fontWeight: 'bold' },
  footer: { padding: 20, alignItems: 'center' },
  footerText: { fontSize: 14, marginVertical: 5 },
  social: { flexDirection: 'row', justifyContent: 'space-around', width: 100 },
});