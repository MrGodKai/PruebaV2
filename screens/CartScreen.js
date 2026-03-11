import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../CartContext';
import { firestoreDb } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function CartScreen({ navigation, currentUsername }) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useContext(CartContext);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Carrito Vacío', 'Añade productos antes de hacer pedido');
      return;
    }

    try {
      setIsSavingOrder(true);
      const subtotal = parseFloat(getTotalPrice());
      const tax = parseFloat((subtotal * 0.13).toFixed(2));
      const total = parseFloat((subtotal + tax).toFixed(2));

      await addDoc(collection(firestoreDb, 'cartOrders'), {
        username: currentUsername || 'anonimo',
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        tax,
        total,
        status: 'Pendiente',
        createdAt: new Date().toISOString()
      });

      Alert.alert('Pedido Confirmado', `Total: $${total.toFixed(2)}\nTu pedido será procesado pronto.`);
      clearCart();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el pedido. Intenta de nuevo.');
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Carrito</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.title}>Mi Carrito de Compras</Text>

        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={80} color="#ddd" />
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            <Text style={styles.emptySubtext}>Agrega productos desde la sección de Productos</Text>
            <TouchableOpacity 
              style={styles.continueShopping}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.continueText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Ionicons name={item.icon} size={32} color="#ff4500" />
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </View>
                </View>

                <View style={styles.quantityControl}>
                  <TouchableOpacity 
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={20} color="#fff" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.removeBtn}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${getTotalPrice()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Impuesto (13%):</Text>
                <Text style={styles.summaryValue}>${(parseFloat(getTotalPrice()) * 0.13).toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${(parseFloat(getTotalPrice()) * 1.13).toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.checkoutBtn, isSavingOrder && styles.disabledBtn]} onPress={handleCheckout} disabled={isSavingOrder}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.checkoutText}>{isSavingOrder ? 'Guardando pedido...' : 'Confirmar Pedido'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.continueShopping}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.continueText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </>
        )}

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
    fontWeight: 'bold'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 30
  },

  emptyCart: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80
  },

  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20
  },

  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 30
  },

  cartItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4500'
  },

  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff'
  },

  itemPrice: {
    fontSize: 14,
    color: '#ff4500',
    fontWeight: 'bold',
    marginTop: 4
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10
  },

  quantityBtn: {
    backgroundColor: '#007bff',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },

  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center'
  },

  removeBtn: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },

  summary: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  summaryLabel: {
    fontSize: 16,
    color: '#333'
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },

  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 10
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff'
  },

  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4500'
  },

  checkoutBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10
  },

  disabledBtn: {
    opacity: 0.7
  },

  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  continueShopping: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },

  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
