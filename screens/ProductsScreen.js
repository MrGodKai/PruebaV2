import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../CartContext';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';

const fallbackProducts = [
  { id: 1, icon: 'water', title: 'Aceite para Motor', description: 'Aceite sintético de alta calidad para mejorar el rendimiento del motor.', price: '$15 - $25' },
  { id: 2, icon: 'funnel', title: 'Filtro de Aire', description: 'Filtro de aire para mantener el motor limpio.', price: '$10 - $20' },
  { id: 3, icon: 'battery-charging', title: 'Batería', description: 'Batería de larga duración para tu auto.', price: '$80 - $150' },
  { id: 4, icon: 'shield-checkmark', title: 'Pastillas de Freno', description: 'Pastillas de freno de alta calidad y durabilidad.', price: '$20 - $40' },
  { id: 5, icon: 'flower', title: 'Llantas', description: 'Llantas resistentes para diferentes terrenos.', price: '$60 - $120' },
  { id: 6, icon: 'settings', title: 'Correas', description: 'Correas de serpentín y distribución.', price: '$25 - $50' }
];

const productIcons = ['water', 'funnel', 'battery-charging', 'shield-checkmark', 'flower', 'settings'];

export default function ProductsScreen({ navigation }) {
  const { cart, addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const mapDbProducts = (entries) => {
    return entries.map(([id, item], idx) => ({
      id,
      icon: productIcons[idx % productIcons.length],
      title: item.name || 'Producto',
      description: item.description || 'Sin descripcion',
      price: item.price || '$0'
    }));
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(db, 'products'));
      const data = snapshot.val() || {};
      const dbProducts = mapDbProducts(Object.entries(data));
      if (dbProducts.length > 0) {
        setProducts(dbProducts);
        setUsedFallback(false);
      } else {
        setProducts(fallbackProducts);
        setUsedFallback(true);
      }
    } catch (error) {
      setProducts(fallbackProducts);
      setUsedFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Éxito', `${product.title} agregado al carrito`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}>
            <Ionicons name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Productos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBadgeContainer}>
            <Ionicons name="cart" size={24} color="#007bff" />
            {cart.length > 0 && <Text style={styles.cartBadge}>{cart.length}</Text>}
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Nuestros Productos</Text>

        {loading ? <Text style={styles.infoText}>Cargando productos...</Text> : null}
        {usedFallback ? (
          <Text style={styles.warningText}>
            Mostrando catalogo local temporal. Verifica la configuracion de Realtime Database.
          </Text>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catálogo de Productos</Text>
          <Text style={styles.text}>
            Disponemos de una selección de productos de alta calidad para el mantenimiento y reparación de tu vehículo. Todos nuestros productos están garantizados y cuentan con certificación.
          </Text>
        </View>

        {products.map((product) => (
          <View key={product.id} style={styles.section}>
            <View style={styles.productHeader}>
              <Ionicons name={product.icon} size={32} color="#ff4500" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>
            </View>
            <Text style={styles.text}>{product.description}</Text>
            <TouchableOpacity 
              style={styles.addToCartBtn}
              onPress={() => handleAddToCart(product)}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addToCartText}>Agregar al Carrito</Text>
            </TouchableOpacity>
          </View>
        ))}

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
    marginBottom: 20,
    justifyContent: 'space-between'
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },

  cartBadgeContainer: {
    position: 'relative'
  },

  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4500',
    color: '#fff',
    borderRadius: 10,
    width: 18,
    height: 18,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold'
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

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000'
  },

  productPrice: {
    fontSize: 16,
    color: '#ff4500',
    fontWeight: 'bold',
    marginTop: 4
  },

  text: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
    marginBottom: 10
  },

  addToCartBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },

  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },

  infoText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 10
  },

  warningText: {
    textAlign: 'center',
    color: '#b26a00',
    marginBottom: 12,
    fontSize: 12
  }
});
