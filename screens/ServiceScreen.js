import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceScreen({ navigation }) {
  const services = [
    {
      title: 'Mantenimiento General',
      icon: 'construct',
      items: ['Cambio de aceite y filtros', 'Revisión de motor y fluidos', 'Chequeo preventivo completo'],
      price: 'Desde $50'
    },
    {
      title: 'Frenos y Suspensión',
      icon: 'car-sport',
      items: ['Inspección y cambio de pastillas/discos', 'Alineación y balanceo', 'Reparación de amortiguadores'],
      price: 'Desde $35'
    },
    {
      title: 'Sistema Eléctrico',
      icon: 'flash',
      items: ['Diagnóstico de batería y alternador', 'Reparación de cableado y luces', 'Instalación de accesorios eléctricos'],
      price: 'Desde $30'
    },
    {
      title: 'Diagnóstico Computarizado',
      icon: 'hardware-chip',
      items: ['Escaneo de errores y sensores', 'Consultas de ECU', 'Informe detallado al cliente'],
      price: 'Desde $25'
    },
    {
      title: 'Transmisión',
      icon: 'cog',
      items: ['Mantenimiento de caja', 'Cambio de aceite de transmisión', 'Reparación de embrague'],
      price: 'Desde $60'
    },
    {
      title: 'Climatización',
      icon: 'snow',
      items: ['Recarga de A/C', 'Reparación de compresores', 'Limpieza de ductos'],
      price: 'Desde $50'
    },
    {
      title: 'Alineación y Balanceo',
      icon: 'car',
      items: ['Alineación de ruedas (4 puntos)', 'Balanceo dinámico y estático', 'Inspección de suspensión'],
      price: 'Desde $45'
    },
    {
      title: 'Cambio de Fluidos',
      icon: 'water',
      items: ['Cambio de aceite motor', 'Cambio de líquido de frenos', 'Cambio de refrigerante'],
      price: 'Desde $40'
    },
    {
      title: 'Reparación de Motor',
      icon: 'build',
      items: ['Reparación de fugas', 'Revisión de válvulas', 'Cambio de correas'],
      price: 'Desde $80'
    }
  ];

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Servicios</Text>
      </View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Servicios <Text style={styles.heroSpan}>Profesionales</Text></Text>
        <Text style={styles.heroSubtitle}>Reparación y mantenimiento automotriz con garantía de calidad</Text>
        <TouchableOpacity style={styles.heroBtn}>
          <Text style={styles.heroBtnText}>Agendar Cita</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
      <Text style={styles.intro}>Ofrecemos una amplia gama de servicios automotrices con calidad garantizada y precios competitivos. Cada trabajo se realiza con atención al detalle por profesionales certificados.</Text>

      <View style={styles.grid}>
        {services.map((service, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{service.badge || 'Popular'}</Text>
            </View>
            <Ionicons name={service.icon} size={40} color="#007bff" />
            <Text style={styles.cardTitle}>{service.title}</Text>
            <View style={styles.list}>
              {service.items.map((item, i) => (
                <Text key={i} style={styles.listItem}>• {item}</Text>
              ))}
            </View>
            <Text style={styles.price}>{service.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>¿Necesitas un Servicio?</Text>
        <Text style={styles.ctaSubtitle}>Contacta con nosotros hoy y obtén un diagnóstico gratuito</Text>
        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={styles.ctaBtnText}>Agendar Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaBtnSecondary}>
          <Text style={styles.ctaBtnTextSecondary}>Contactar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Taller Automotriz</Text>
        <Text style={styles.footerText}>Ofrecemos servicios profesionales de reparación y mantenimiento para todo tipo de vehículos.</Text>
        <Text style={styles.footerText}>Enlaces: Inicio | Nuestra Historia | Productos | Servicios | Contacto</Text>
        <View style={styles.social}>
          <Ionicons name="logo-facebook" size={24} color="#007bff" />
          <Ionicons name="logo-instagram" size={24} color="#007bff" />
          <Ionicons name="logo-twitter" size={24} color="#007bff" />
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  hero: { backgroundColor: '#007bff', padding: 20, alignItems: 'center' },
  heroTitle: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  heroSpan: { color: '#fff' },
  heroSubtitle: { fontSize: 16, color: '#fff', marginVertical: 10, textAlign: 'center' },
  heroBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  heroBtnText: { color: '#007bff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  intro: { fontSize: 16, textAlign: 'center', marginHorizontal: 20, marginBottom: 20 },
  grid: { paddingHorizontal: 20 },
  card: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 15, marginBottom: 20, alignItems: 'center' },
  badge: { backgroundColor: '#28a745', padding: 5, borderRadius: 4, marginBottom: 10 },
  badgeText: { color: '#fff', fontSize: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  list: { alignSelf: 'stretch' },
  listItem: { fontSize: 14, marginBottom: 5 },
  price: { fontSize: 16, color: '#007bff', marginTop: 10 },
  cta: { backgroundColor: '#f0f0f0', padding: 20, alignItems: 'center' },
  ctaTitle: { fontSize: 20, fontWeight: 'bold' },
  ctaSubtitle: { fontSize: 16, marginVertical: 10, textAlign: 'center' },
  ctaBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginBottom: 10 },
  ctaBtnText: { color: '#fff', fontWeight: 'bold' },
  ctaBtnSecondary: { backgroundColor: '#28a745', padding: 10, borderRadius: 8 },
  ctaBtnTextSecondary: { color: '#fff', fontWeight: 'bold' },
  footer: { padding: 20, alignItems: 'center' },
  footerText: { fontSize: 14, marginVertical: 5, textAlign: 'center' },
  social: { flexDirection: 'row', justifyContent: 'space-around', width: 100 },
});