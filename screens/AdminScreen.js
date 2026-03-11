import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import { firestoreDb } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const initialProductForm = {
  name: '',
  price: '',
  status: 'Disponible',
  description: '',
  image: ''
};

export default function AdminScreen({ setRole, currentRole, goToOnline }) {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeSection, setActiveSection] = useState('appointments');
  const [productForm, setProductForm] = useState(initialProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dashboardWarning, setDashboardWarning] = useState('');

  useEffect(() => {
    if (currentRole === 'admin') {
      loadDashboard();
    }
  }, [currentRole]);

  const loadDashboard = async () => {
    setLoading(true);
    setDashboardWarning('');

    const results = await Promise.allSettled([
      loadAppointments(),
      loadProducts(),
      loadOrders()
    ]);

    const failedSections = [];
    if (results[0].status === 'rejected') failedSections.push('citas');
    if (results[1].status === 'rejected') failedSections.push('productos');
    if (results[2].status === 'rejected') {
      failedSections.push('pedidos');
      setOrders([]);
    }

    if (failedSections.length > 0) {
      const warning = `No se pudo cargar: ${failedSections.join(', ')}.`;
      setDashboardWarning(warning);
      Alert.alert('Carga parcial', `${warning} Revisa reglas/permisos de Firestore.`);
    }

    setLoading(false);
  };

  const loadAppointments = async () => {
    const querySnapshot = await getDocs(collection(firestoreDb, 'appointments'));
    const apps = querySnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    setAppointments(apps);
  };

  const loadProducts = async () => {
    const querySnapshot = await getDocs(collection(firestoreDb, 'products'));
    const prods = querySnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    setProducts(prods);
  };

  const loadOrders = async () => {
    const querySnapshot = await getDocs(collection(firestoreDb, 'cartOrders'));
    const loadedOrders = querySnapshot.docs.map(item => ({ id: item.id, ...item.data() }));
    loadedOrders.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    setOrders(loadedOrders);
  };

  const changeAppointmentStatus = async (id, newStatus) => {
    await updateDoc(doc(firestoreDb, 'appointments', id), { status: newStatus });
    loadAppointments();
  };

  const deleteAppointment = async (id) => {
    await deleteDoc(doc(firestoreDb, 'appointments', id));
    loadAppointments();
  };

  const changeProductStatus = async (id, newStatus) => {
    await updateDoc(doc(firestoreDb, 'products', id), { status: newStatus });
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(firestoreDb, 'products', id));
    if (editingProductId === id) {
      setEditingProductId(null);
      setProductForm(initialProductForm);
    }
    loadProducts();
  };

  const editProduct = (product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || '',
      price: product.price || '',
      status: product.status || 'Disponible',
      description: product.description || '',
      image: product.image || ''
    });
    setActiveSection('products');
  };

  const clearProductForm = () => {
    setEditingProductId(null);
    setProductForm(initialProductForm);
  };

  const saveProduct = async () => {
    const cleanName = productForm.name.trim();
    const cleanPrice = productForm.price.trim();

    if (!cleanName || !cleanPrice) {
      Alert.alert('Validacion', 'Nombre y precio son obligatorios.');
      return;
    }

    const payload = {
      name: cleanName,
      price: cleanPrice,
      status: productForm.status || 'Disponible',
      description: productForm.description.trim(),
      image: productForm.image.trim()
    };

    if (editingProductId) {
      await updateDoc(doc(firestoreDb, 'products', editingProductId), payload);
      Alert.alert('Producto actualizado', 'Los cambios fueron guardados.');
    } else {
      await addDoc(collection(firestoreDb, 'products'), payload);
      Alert.alert('Producto creado', 'El producto fue agregado correctamente.');
    }

    clearProductForm();
    loadProducts();
  };

  const changeOrderStatus = async (id, newStatus) => {
    await updateDoc(doc(firestoreDb, 'cartOrders', id), { status: newStatus });
    loadOrders();
  };

  const deleteOrder = async (id) => {
    await deleteDoc(doc(firestoreDb, 'cartOrders', id));
    loadOrders();
  };

  const getBadgeStyle = (status) => {
    if (status === 'Pendiente') return styles.badgePending;
    if (status === 'En revision') return styles.badgeReview;
    if (status === 'Listo') return styles.badgeReady;
    if (status === 'Agotado') return styles.badgeOut;
    if (status === 'Despachado') return styles.badgeReady;
    return styles.badgeNeutral;
  };

  if (currentRole !== 'admin') {
    return (
      <View style={styles.lockedContainer}>
        <Ionicons name="lock-closed" size={60} color="#d9534f" />
        <Text style={styles.lockedTitle}>Acceso restringido</Text>
        <Text style={styles.lockedSubtitle}>Este apartado solo puede verlo un administrador.</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setRole(null)}>
          <Text style={styles.logoutText}>Ir a inicio de sesion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 0 }]}
      >
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroEyebrow}>PowerCar Control Center</Text>
          <Text style={styles.heroTitle}>Panel Administrativo</Text>
          <Text style={styles.heroSubtitle}>Gestiona citas, productos y pedidos del carrito desde un solo lugar.</Text>
        </View>
        <View style={styles.heroActions}>
          {goToOnline ? (
            <TouchableOpacity style={styles.onlineBtn} onPress={goToOnline}>
              <Ionicons name="people" size={15} color="#fff" />
              <Text style={styles.onlineBtnText}>Usuarios conectados</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.logoutBtn} onPress={() => setRole(null)}>
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{appointments.length}</Text>
          <Text style={styles.statLabel}>Citas totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Productos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Pedidos carrito</Text>
        </View>
      </View>

      <View style={styles.sectionTabs}>
        <TouchableOpacity style={[styles.tabButton, activeSection === 'appointments' && styles.tabButtonActive]} onPress={() => setActiveSection('appointments')}>
          <Text style={[styles.tabText, activeSection === 'appointments' && styles.tabTextActive]}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeSection === 'products' && styles.tabButtonActive]} onPress={() => setActiveSection('products')}>
          <Text style={[styles.tabText, activeSection === 'products' && styles.tabTextActive]}>Productos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeSection === 'orders' && styles.tabButtonActive]} onPress={() => setActiveSection('orders')}>
          <Text style={[styles.tabText, activeSection === 'orders' && styles.tabTextActive]}>Pedidos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.refreshBtn} onPress={loadDashboard}>
        <Ionicons name="refresh" size={16} color="#fff" />
        <Text style={styles.refreshText}>Actualizar datos</Text>
      </TouchableOpacity>

      {dashboardWarning ? (
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={18} color="#8a5a00" />
          <Text style={styles.warningText}>{dashboardWarning}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#0f4c5c" />
          <Text style={styles.loaderText}>Cargando panel...</Text>
        </View>
      ) : null}

      {!loading && activeSection === 'appointments' ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Gestion completa de citas</Text>
          {appointments.length === 0 ? <Text style={styles.emptyText}>No hay citas registradas.</Text> : null}

          {appointments.map((app) => (
            <View key={app.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{app.name || 'Sin nombre'}</Text>
                <View style={[styles.badge, getBadgeStyle(app.status)]}>
                  <Text style={styles.badgeText}>{app.status || 'Pendiente'}</Text>
                </View>
              </View>
              <Text style={styles.itemLine}>Usuario: {app.email || 'N/A'}</Text>
              <Text style={styles.itemLine}>Telefono: {app.phone || 'N/A'}</Text>
              <Text style={styles.itemLine}>Fecha: {app.date || 'N/A'} | Hora: {app.time || 'N/A'}</Text>
              <Text style={styles.itemLine}>Vehiculo: {app.vehicle || 'N/A'} | Placa: {app.plate || 'N/A'}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => changeAppointmentStatus(app.id, 'En revision')}>
                  <Text style={styles.secondaryActionText}>En revision</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryAction} onPress={() => changeAppointmentStatus(app.id, 'Listo')}>
                  <Text style={styles.primaryActionText}>Marcar listo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerAction} onPress={() => deleteAppointment(app.id)}>
                  <Text style={styles.dangerActionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {!loading && activeSection === 'products' ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Gestion de productos del carrito</Text>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editingProductId ? 'Editar producto' : 'Nuevo producto'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={productForm.name}
              onChangeText={(value) => setProductForm(prev => ({ ...prev, name: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio (ej: $25 o $25 - $40)"
              value={productForm.price}
              onChangeText={(value) => setProductForm(prev => ({ ...prev, price: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripcion"
              value={productForm.description}
              onChangeText={(value) => setProductForm(prev => ({ ...prev, description: value }))}
            />
            <TextInput
              style={styles.input}
              placeholder="URL de imagen"
              value={productForm.image}
              onChangeText={(value) => setProductForm(prev => ({ ...prev, image: value }))}
            />

            <View style={styles.statusSelector}>
              {['Disponible', 'Nuevo', 'Agotado'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusPill, productForm.status === status && styles.statusPillActive]}
                  onPress={() => setProductForm(prev => ({ ...prev, status }))}
                >
                  <Text style={[styles.statusPillText, productForm.status === status && styles.statusPillTextActive]}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.primaryAction} onPress={saveProduct}>
                <Text style={styles.primaryActionText}>{editingProductId ? 'Guardar cambios' : 'Crear producto'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryAction} onPress={clearProductForm}>
                <Text style={styles.secondaryActionText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {products.length === 0 ? <Text style={styles.emptyText}>No hay productos registrados.</Text> : null}
          {products.map((product) => (
            <View key={product.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{product.name || 'Sin nombre'}</Text>
                <View style={[styles.badge, getBadgeStyle(product.status)]}>
                  <Text style={styles.badgeText}>{product.status || 'Disponible'}</Text>
                </View>
              </View>
              <Text style={styles.itemLine}>Precio: {product.price || 'N/A'}</Text>
              <Text style={styles.itemLine}>Descripcion: {product.description || 'Sin descripcion'}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => changeProductStatus(product.id, 'Disponible')}>
                  <Text style={styles.secondaryActionText}>Disponible</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => changeProductStatus(product.id, 'Agotado')}>
                  <Text style={styles.secondaryActionText}>Agotado</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryAction} onPress={() => editProduct(product)}>
                  <Text style={styles.primaryActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerAction} onPress={() => deleteProduct(product.id)}>
                  <Text style={styles.dangerActionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {!loading && activeSection === 'orders' ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pedidos del carrito</Text>
          {orders.length === 0 ? <Text style={styles.emptyText}>Todavia no hay pedidos confirmados.</Text> : null}

          {orders.map((order) => (
            <View key={order.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Pedido de {order.username || 'anonimo'}</Text>
                <View style={[styles.badge, getBadgeStyle(order.status)]}>
                  <Text style={styles.badgeText}>{order.status || 'Pendiente'}</Text>
                </View>
              </View>

              <Text style={styles.itemLine}>Fecha: {String(order.createdAt || 'N/A').replace('T', ' ').slice(0, 16)}</Text>
              <Text style={styles.itemLine}>Subtotal: ${Number(order.subtotal || 0).toFixed(2)}</Text>
              <Text style={styles.itemLine}>Impuesto: ${Number(order.tax || 0).toFixed(2)}</Text>
              <Text style={styles.itemLine}>Total: ${Number(order.total || 0).toFixed(2)}</Text>

              <Text style={styles.itemsTitle}>Productos del pedido:</Text>
              {(order.items || []).map((item, index) => (
                <Text key={`${order.id}-${index}`} style={styles.itemLine}>- {item.title} x{item.quantity}</Text>
              ))}

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => changeOrderStatus(order.id, 'En revision')}>
                  <Text style={styles.secondaryActionText}>En revision</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryAction} onPress={() => changeOrderStatus(order.id, 'Despachado')}>
                  <Text style={styles.primaryActionText}>Despachado</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerAction} onPress={() => deleteOrder(order.id)}>
                  <Text style={styles.dangerActionText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7f8'
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f7f8'
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100
  },
  hero: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14
  },
  heroEyebrow: {
    color: '#bfe1e8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800'
  },
  heroSubtitle: {
    color: '#e6f2f4',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 14
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  onlineBtn: {
    backgroundColor: '#000706',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  onlineBtnText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 12
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e2eaec'
  },
  statNumber: {
    fontSize: 24,
    color: '#000a0c',
    fontWeight: '800'
  },
  statLabel: {
    fontSize: 13,
    color: '#000000',
    marginTop: 4
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: '#dce9ed',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  tabButtonActive: {
    backgroundColor: '#000405'
  },
  tabText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '700'
  },
  tabTextActive: {
    color: '#fff'
  },
  refreshBtn: {
    backgroundColor: '#12942e',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8
  },
  refreshText: {
    color: '#fff',
    fontWeight: '700'
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2eaec',
    padding: 14
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#e3ebee',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fbfdfd'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    flex: 1,
    marginRight: 8
  },
  itemLine: {
    fontSize: 13,
    color: '#000000',
    marginBottom: 4
  },
  itemsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginTop: 6,
    marginBottom: 6
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  badgePending: { backgroundColor: '#f28f3b' },
  badgeReview: { backgroundColor: '#000000' },
  badgeReady: { backgroundColor: '#000000' },
  badgeOut: { backgroundColor: '#d64550' },
  badgeNeutral: { backgroundColor: '#000000' },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  primaryAction: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700'
  },
  secondaryAction: {
    backgroundColor: '#e1edf1',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8
  },
  secondaryActionText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700'
  },
  dangerAction: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8
  },
  dangerActionText: {
    color: '#b4232c',
    fontSize: 12,
    fontWeight: '700'
  },
  formCard: {
    borderWidth: 1,
    borderColor: '#d7e4e8',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f7fbfc',
    marginBottom: 12
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#d2e1e6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 8
  },
  statusSelector: {
    flexDirection: 'row',
    marginBottom: 8
  },
  statusPill: {
    backgroundColor: '#e2edf1',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8
  },
  statusPillActive: {
    backgroundColor: '#000000'
  },
  statusPillText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 12
  },
  statusPillTextActive: {
    color: '#fff'
  },
  emptyText: {
    textAlign: 'center',
    color: '#000000',
    marginVertical: 8
  },
  loaderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  loaderText: {
    marginTop: 8,
    color: '#000303'
  },
  warningBox: {
    backgroundColor: '#fff4db',
    borderWidth: 1,
    borderColor: '#ffd98f',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  warningText: {
    marginLeft: 8,
    color: '#7a4d00',
    flex: 1,
    fontSize: 12,
    fontWeight: '600'
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  lockedSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  logoutBtn: {
    backgroundColor: '#f0f3f4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  logoutText: {
    color: '#000000',
    fontWeight: '700'
  }
});