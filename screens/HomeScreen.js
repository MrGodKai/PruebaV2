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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/BannerPowerCar.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        <View style={styles.home}>
          <View style={styles.overlay}></View>

          <View style={styles.content}>
            <Text style={styles.title}>
              Mantenimiento <Text style={styles.span}>Profesional</Text>
            </Text>

            <Text style={styles.subtitle}>
              Expertos en reparación y mantenimiento automotriz. Confía en nosotros para cuidar tu vehículo con la mejor tecnología y atención personalizada.
            </Text>

            <View style={styles.features}>
              {features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Ionicons name={feature.icon} size={24} color="#fff" />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate('Services')}
            >
              <Text style={styles.btnText}>Nuestros Servicios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.navigate('Appointment')}
            >
              <Text style={styles.btnTextSecondary}>Agendar Cita</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Redes Sociales</Text>

          <View style={styles.social}>
            <Ionicons name="logo-facebook" size={24} color="#000000" />
            <Ionicons name="logo-instagram" size={24} color="#000000" />
            <Ionicons name="logo-whatsapp" size={24} color="#000000" />
          </View>

          <Text style={styles.footerText}>
            Contacto: Tel: 8888-8888 | Email: taller@email.com
          </Text>

          <Text style={styles.footerText}>
            Ubicación: Costa Rica
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#101317',
    width: '100%',
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 0,
    height: 180,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
    shadowOpacity: 0
  },

  logo: {
    width: '100%',
    height: '100%'
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000'
  },

  home: {
    height: 400,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center'
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },

  content: {
    alignItems: 'center',
    padding: 20
  },

  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },

  span: {
    color: '#fff'
  },

  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10
  },

  features: {
    flexDirection: 'row',
    marginVertical: 20,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },

  feature: {
    alignItems: 'center',
    marginHorizontal: 5
  },

  featureText: {
    color: '#fff',
    marginTop: 5
  },

  btn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },

  btnText: {
    color: '#007bff',
    fontWeight: 'bold'
  },

  btnSecondary: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8
  },

  btnTextSecondary: {
    color: '#fff',
    fontWeight: 'bold'
  },

  footer: {
    padding: 20,
    alignItems: 'center'
  },

  footerText: {
    fontSize: 14,
    marginVertical: 5
  },

  social: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100
  }
});