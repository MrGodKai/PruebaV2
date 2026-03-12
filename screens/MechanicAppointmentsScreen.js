import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../firebaseConfig';
import { ref, get, update } from 'firebase/database';

const APPOINTMENT_STATUSES = ['Pendiente', 'En revision', 'Listo'];

export default function MechanicAppointmentsScreen({ currentUsername, goBack }) {
  const insets = useSafeAreaInsets();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noteById, setNoteById] = useState({});

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const aDate = `${a.date || ''} ${a.time || ''}`;
      const bDate = `${b.date || ''} ${b.time || ''}`;
      return bDate.localeCompare(aDate);
    });
  }, [appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const snapshot = await get(ref(db, 'appointments'));
      const data = snapshot.val() || {};
      const apps = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      setAppointments(apps);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las citas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const updateAppointment = async (id, payload) => {
    try {
      await update(ref(db, `appointments/${id}`), payload);
      await loadAppointments();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cita.');
    }
  };

  const updateStatus = async (id, newStatus) => {
    await updateAppointment(id, {
      status: newStatus,
      lastUpdatedBy: currentUsername || 'mecanico',
      lastUpdatedAt: Date.now()
    });
  };

  const saveNote = async (item) => {
    const note = (noteById[item.id] || '').trim();
    if (!note) {
      Alert.alert('Nota vacia', 'Escribe una nota antes de guardar.');
      return;
    }

    await updateAppointment(item.id, {
      mechanicNote: note,
      lastUpdatedBy: currentUsername || 'mecanico',
      lastUpdatedAt: Date.now()
    });

    setNoteById((prev) => ({ ...prev, [item.id]: '' }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 14 }]}>
        <Text style={styles.title}>Registro de Citas</Text>
        <Text style={styles.subtitle}>Vista del mecanico para revisar citas, actualizar estado y guardar notas.</Text>

        <TouchableOpacity style={styles.reloadBtn} onPress={loadAppointments}>
          <Text style={styles.reloadText}>{loading ? 'Cargando...' : 'Actualizar listado'}</Text>
        </TouchableOpacity>

        <FlatList
          data={sortedAppointments}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name || 'Sin nombre'}</Text>
              <Text style={styles.line}>Cliente: {item.email || 'N/A'}</Text>
              <Text style={styles.line}>Telefono: {item.phone || 'N/A'}</Text>
              <Text style={styles.line}>Fecha: {item.date || 'N/A'} | Hora: {item.time || 'N/A'}</Text>
              <Text style={styles.line}>Vehiculo: {item.vehicle || 'N/A'} | Placa: {item.plate || 'N/A'}</Text>
              <Text style={styles.line}>Estado actual: {item.status || 'Pendiente'}</Text>
              {item.mechanicNote ? <Text style={styles.noteSaved}>Nota: {item.mechanicNote}</Text> : null}

              <View style={styles.statusRow}>
                {APPOINTMENT_STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusBtn, item.status === status && styles.statusBtnActive]}
                    onPress={() => updateStatus(item.id, status)}
                  >
                    <Text style={[styles.statusText, item.status === status && styles.statusTextActive]}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.noteInput}
                placeholder="Agregar nota de registro (diagnostico, repuesto, etc.)"
                value={noteById[item.id] ?? ''}
                onChangeText={(value) => setNoteById((prev) => ({ ...prev, [item.id]: value }))}
              />
              <TouchableOpacity style={styles.noteBtn} onPress={() => saveNote(item)}>
                <Text style={styles.noteBtnText}>Guardar nota</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 14, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '800', color: '#12343b', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 12, color: '#4d666c', textAlign: 'center', marginBottom: 10 },
  reloadBtn: { backgroundColor: '#0f4c5c', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginBottom: 10 },
  reloadText: { color: '#fff', fontWeight: '700' },
  list: { flex: 1 },
  card: { backgroundColor: '#f4f9fb', borderWidth: 1, borderColor: '#d6e8ee', borderRadius: 10, padding: 10, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '800', color: '#1a4048', marginBottom: 4 },
  line: { fontSize: 12, color: '#2f5a62', marginBottom: 2 },
  noteSaved: { marginTop: 4, color: '#1f7a5f', fontSize: 12, fontWeight: '700' },
  statusRow: { flexDirection: 'row', marginTop: 8, marginBottom: 8 },
  statusBtn: { flex: 1, borderWidth: 1, borderColor: '#bdd2d9', borderRadius: 8, paddingVertical: 7, alignItems: 'center', marginRight: 6, backgroundColor: '#fff' },
  statusBtnActive: { backgroundColor: '#2a9d8f', borderColor: '#2a9d8f' },
  statusText: { color: '#35565d', fontSize: 11, fontWeight: '700' },
  statusTextActive: { color: '#fff' },
  noteInput: { borderWidth: 1, borderColor: '#cbdde3', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9, fontSize: 13, backgroundColor: '#fff', marginBottom: 8 },
  noteBtn: { backgroundColor: '#007bff', borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  noteBtnText: { color: '#fff', fontWeight: '700' },
  backBtn: { marginTop: 10, backgroundColor: '#dfe5e7', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  backText: { color: '#314246', fontWeight: '700' }
});