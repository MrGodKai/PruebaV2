import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const roleLabels = {
  admin: 'Administrador',
  mechanic: 'Mecanico',
  user: 'Usuario'
};

export default function AccountScreen({ currentUsername, currentRole, onLogout }) {
  const insets = useSafeAreaInsets();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ marca: '', modelo: '', anno: '', placa: '', tipo: '' });
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
    if (accountData?.vehiculo) {
      setVehicleForm({
        marca: accountData.vehiculo.marca || '',
        modelo: accountData.vehiculo.modelo || '',
        anno: accountData.vehiculo.anno || '',
        placa: accountData.vehiculo.placa || '',
        tipo: accountData.vehiculo.tipo || ''
      });
    }
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
          <Ionicons name="person-circle" size={64} color="#0f4c5c" />
          <Text style={styles.title}>Mi Cuenta</Text>
          <Text style={styles.subtitle}>Consulta tus datos y gestiona tu sesion.</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#0f4c5c" />
            <Text style={styles.loadingText}>Cargando datos de cuenta...</Text>
          </View>
        ) : (
          <>
            <View style={styles.infoCard}>
              <View style={styles.row}>
                <Text style={styles.label}>Usuario</Text>
                <Text style={styles.value}>{currentUsername || 'No disponible'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Rol</Text>
                <Text style={styles.value}>{roleLabels[currentRole] || currentRole || 'No disponible'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cuenta registrada</Text>
                <Text style={styles.value}>{accountData ? 'Si' : 'No'}</Text>
              </View>
            </View>

            {editingVehicle ? (
              <View style={[styles.infoCard, { marginTop: 12 }]}>
                <Text style={styles.sectionTitle}>Editar vehículo</Text>

                <Text style={styles.fieldLabel}>Marca</Text>
                <TextInput style={styles.input} placeholder="ej: Toyota" value={vehicleForm.marca} onChangeText={v => setVehicleForm(p => ({ ...p, marca: v }))} />

                <Text style={styles.fieldLabel}>Modelo</Text>
                <TextInput style={styles.input} placeholder="ej: Corolla" value={vehicleForm.modelo} onChangeText={v => setVehicleForm(p => ({ ...p, modelo: v }))} />

                <Text style={styles.fieldLabel}>Año</Text>
                <TextInput style={styles.input} placeholder="ej: 2020" value={vehicleForm.anno} onChangeText={v => setVehicleForm(p => ({ ...p, anno: v }))} keyboardType="numeric" />

                <Text style={styles.fieldLabel}>Placa</Text>
                <TextInput style={styles.input} placeholder="ej: ABC123" value={vehicleForm.placa} onChangeText={v => setVehicleForm(p => ({ ...p, placa: v }))} autoCapitalize="characters" />

                <Text style={styles.fieldLabel}>Tipo de vehículo</Text>
                <TextInput style={styles.input} placeholder="ej: Sedan, SUV, Pick-up, Moto..." value={vehicleForm.tipo} onChangeText={v => setVehicleForm(p => ({ ...p, tipo: v }))} />
                <TouchableOpacity style={styles.saveBtn} onPress={saveVehicle} disabled={savingVehicle}>
                  <Text style={styles.saveBtnText}>{savingVehicle ? 'Guardando...' : 'Guardar vehículo'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelEditBtn} onPress={() => setEditingVehicle(false)}>
                  <Text style={styles.cancelEditText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.infoCard, { marginTop: 12 }]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Mi Vehículo</Text>
                  <TouchableOpacity onPress={() => setEditingVehicle(true)}>
                    <Ionicons name="create-outline" size={20} color="#007bff" />
                  </TouchableOpacity>
                </View>
                {accountData?.vehiculo?.marca ? (
                  <>
                    <View style={styles.row}><Text style={styles.label}>Marca</Text><Text style={styles.value}>{accountData.vehiculo.marca}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Modelo</Text><Text style={styles.value}>{accountData.vehiculo.modelo}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Año</Text><Text style={styles.value}>{accountData.vehiculo.anno}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Placa</Text><Text style={styles.value}>{accountData.vehiculo.placa}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Tipo</Text><Text style={styles.value}>{accountData.vehiculo.tipo}</Text></View>
                  </>
                ) : (
                  <TouchableOpacity onPress={() => setEditingVehicle(true)} style={styles.addVehicleBtn}>
                    <Ionicons name="car-outline" size={18} color="#007bff" />
                    <Text style={styles.addVehicleText}>Agregar vehículo</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}

        <TouchableOpacity style={[styles.logoutBtn, { marginTop: 16 }]} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesion</Text>
        </TouchableOpacity>
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
    padding: 16
  },
  headerCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8e8ee',
    borderRadius: 14,
    alignItems: 'center',
    padding: 16,
    marginBottom: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#12343b',
    marginTop: 4
  },
  subtitle: {
    fontSize: 13,
    color: '#4d666c',
    marginTop: 6
  },
  infoCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8e8ee',
    borderRadius: 14,
    padding: 14
  },
  row: {
    marginBottom: 10
  },
  label: {
    fontSize: 12,
    color: '#5e777d',
    marginBottom: 2
  },
  value: {
    fontSize: 16,
    color: '#12343b',
    fontWeight: '700'
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d8e8ee',
    borderRadius: 14
  },
  loadingText: {
    marginTop: 8,
    color: '#4d666c'
  },
  logoutBtn: {
    marginTop: 6,
    backgroundColor: '#d64550',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#12343b', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#dce8ee', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontSize: 14, color: '#12343b', backgroundColor: '#f9fbfc' },
  saveBtn: { backgroundColor: '#0f4c5c', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cancelEditBtn: { borderWidth: 1, borderColor: '#dce8ee', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  cancelEditText: { color: '#5e777d', fontWeight: '600' },
  addVehicleBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  addVehicleText: { color: '#007bff', marginLeft: 8, fontWeight: '600', fontSize: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#4d666c', marginBottom: 4 },
});
