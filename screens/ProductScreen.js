import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { firestoreDb } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ProductScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const querySnapshot = await getDocs(collection(firestoreDb, 'products'));
    const prods = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(prods);
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Disponible': return styles.available;
      case 'Nuevo': return styles.new;
      case 'Agotado': return styles.outOfStock;
      default: return styles.available;
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Productos</Text>
      </View>
      <View style={styles.header}>
        <Ionicons name="construct" size={30} color="#007bff" />
        <Text style={styles.headerText}>Nuestros Productos</Text>
      </View>

      <View style={styles.grid}>
        {products.map(prod => (
          <View key={prod.id} style={styles.card}>
            <View style={[styles.badge, getBadgeStyle(prod.status)]}>
              <Text style={styles.badgeText}>{prod.status}</Text>
            </View>
            <Image source={{ uri: prod.image || 'https://via.placeholder.com/150' }} style={styles.image} />
            <Text style={styles.title}>{prod.name}</Text>
            <Text style={styles.description}>{prod.description}</Text>
            <Text style={styles.price}>{prod.price}</Text>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Ver Producto</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold', marginLeft: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 10, marginBottom: 20, alignItems: 'center' },
  badge: { position: 'absolute', top: 5, right: 5, padding: 5, borderRadius: 4 },
  available: { backgroundColor: 'green' },
  new: { backgroundColor: 'blue' },
  outOfStock: { backgroundColor: 'red' },
  badgeText: { color: '#fff', fontSize: 10 },
  image: { width: 100, height: 100, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 12, textAlign: 'center', marginBottom: 5 },
  price: { fontSize: 14, color: '#007bff', marginBottom: 10 },
  btn: { backgroundColor: '#007bff', padding: 8, borderRadius: 4 },
  btnText: { color: '#fff', fontSize: 12 },
  footer: { marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 14, marginVertical: 5 },
  social: { flexDirection: 'row', justifyContent: 'space-around', width: 100 },
});