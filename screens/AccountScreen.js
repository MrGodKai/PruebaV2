import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const roleLabels = {
  admin: 'Administrador',
  mechanic: 'Mecánico',
  user: 'Usuario'
};

export default function AccountScreen({ currentUsername, currentRole, onLogout }) {
  const insets = useSafeAreaInsets();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    marca: '',
    modelo: '',
    anno: '',
    placa: '',
    tipo: ''
  });
  const [savingVehicle, setSavingVehicle] = useState(false);

  useEffect(() => {
    if (!currentUsername) {
      setLoading(false);
      return;
    }

    const userRef = ref(db, `registeredUsers/${currentUsername}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setAccountData(data || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUsername]);

  useEffect(() => {
    if (!accountData?.vehiculo) return;
    setVehicleForm({
      marca: accountData.vehiculo.marca || '',
      modelo: accountData.vehiculo.modelo || '',
      anno: accountData.vehiculo.anno || '',
      placa: accountData.vehiculo.placa || '',
      tipo: accountData.vehiculo.tipo || ''
    });
  }, [accountData]);

  const saveVehicle = async () => {
    setSavingVehicle(true);
    try {
      await update(ref(db, `registeredUsers/${currentUsername}/vehiculo`), vehicleForm);
      setEditingVehicle(false);
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la información del vehículo.');
    } finally {
      setSavingVehicle(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 104 }}
      >
        <View style={styles.headerCard}>
          <Image source={require('../assets/user-icon.png')} style={styles.accountIcon} />
          <Text style={styles.title}>Mi Cuenta</Text>
          <Text style={styles.subtitle}>Gestiona tus datos y tu vehículo registrado.</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#ff3b30" />
            <Text style={styles.loadingText}>Cargando datos de cuenta...</Text>
          </View>
        ) : (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Información General</Text>

              <View style={styles.row}>
                <Ionicons name="person-outline" size={18} color="#fff" />
                <Text style={styles.value}>{currentUsername || 'No disponible'}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
                <Text style={styles.value}>{roleLabels[currentRole] || currentRole || 'No disponible'}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.value}>{accountData ? 'Cuenta registrada' : 'Sin datos de cuenta'}</Text>
              </View>
            </View>

            <View style={[styles.infoCard, { marginTop: 12 }]}> 
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mi Vehículo</Text>
                {!editingVehicle ? (
                  <TouchableOpacity onPress={() => setEditingVehicle(true)}>
                    <Ionicons name="create-outline" size={20} color="#ff3b30" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {editingVehicle ? (
                <>
                  <TextInput style={styles.input} placeholder="Marca" placeholderTextColor="#94a3b8" value={vehicleForm.marca} onChangeText={(v) => setVehicleForm((p) => ({ ...p, marca: v }))} />
                  <TextInput style={styles.input} placeholder="Modelo" placeholderTextColor="#94a3b8" value={vehicleForm.modelo} onChangeText={(v) => setVehicleForm((p) => ({ ...p, modelo: v }))} />
                  <TextInput style={styles.input} placeholder="Año" placeholderTextColor="#94a3b8" keyboardType="numeric" value={vehicleForm.anno} onChangeText={(v) => setVehicleForm((p) => ({ ...p, anno: v }))} />
                  <TextInput style={styles.input} placeholder="Placa" placeholderTextColor="#94a3b8" autoCapitalize="characters" value={vehicleForm.placa} onChangeText={(v) => setVehicleForm((p) => ({ ...p, placa: v }))} />
                  <TextInput style={styles.input} placeholder="Tipo" placeholderTextColor="#94a3b8" value={vehicleForm.tipo} onChangeText={(v) => setVehicleForm((p) => ({ ...p, tipo: v }))} />

                  <TouchableOpacity style={styles.saveBtn} onPress={saveVehicle} disabled={savingVehicle}>
                    <Text style={styles.saveBtnText}>{savingVehicle ? 'Guardando...' : 'Guardar vehículo'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setEditingVehicle(false)}>
                    <Text style={styles.cancelEditText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              ) : accountData?.vehiculo?.marca ? (
                <>
                  <Text style={styles.vehicleLine}><Text style={styles.vehicleLabel}>Marca:</Text> {accountData.vehiculo.marca}</Text>
                  <Text style={styles.vehicleLine}><Text style={styles.vehicleLabel}>Modelo:</Text> {accountData.vehiculo.modelo}</Text>
                  <Text style={styles.vehicleLine}><Text style={styles.vehicleLabel}>Año:</Text> {accountData.vehiculo.anno}</Text>
                  <Text style={styles.vehicleLine}><Text style={styles.vehicleLabel}>Placa:</Text> {accountData.vehiculo.placa}</Text>
                  <Text style={styles.vehicleLine}><Text style={styles.vehicleLabel}>Tipo:</Text> {accountData.vehiculo.tipo}</Text>
                </>
              ) : (
                <TouchableOpacity onPress={() => setEditingVehicle(true)} style={styles.addVehicleBtn}>
                  <Ionicons name="car-outline" size={18} color="#ff3b30" />
                  <Text style={styles.addVehicleText}>Agregar vehículo</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },

  headerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    alignItems: 'center',
    padding: 20,
    marginBottom: 16
  },

  accountIcon: {
    width: 56,
    height: 56,
    borderRadius: 28
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginTop: 6
  },

  subtitle: {
    fontSize: 13,
    color: '#cbd5f5',
    marginTop: 6,
    textAlign: 'center'
  },

  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#fff'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff'
  },

  vehicleLine: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 6
  },

  vehicleLabel: {
    fontWeight: '700',
    color: '#fff'
  },

  loadingWrap: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 14
  },

  loadingText: {
    marginTop: 8,
    color: '#cbd5f5'
  },

  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#0f172a',
    color: '#fff'
  },

  saveBtn: {
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: '700'
  },

  cancelEditBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },

  cancelEditText: {
    color: '#cbd5f5'
  },

  addVehicleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },

  addVehicleText: {
    color: '#ff3b30',
    fontWeight: '600'
  },

  logoutBtn: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700'
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});