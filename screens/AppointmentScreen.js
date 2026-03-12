import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, onValue, get, push } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AppointmentScreen({ navigation, currentUsername }) {
  const [appointments, setAppointments] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [profileVehicle, setProfileVehicle] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    vehicle: '',
    plate: ''
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm((prev) => ({ ...prev, date: formatDate(selectedDate) }));
    }
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setForm((prev) => ({ ...prev, time: formatTime(selectedTime) }));
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    if (!currentUsername) return;

    setForm((prev) => ({ ...prev, email: currentUsername }));

    const vRef = ref(db, `registeredUsers/${currentUsername}/vehiculo`);

    const unsub = onValue(vRef, (snapshot) => {
      const v = snapshot.val();
      setProfileVehicle(v || null);

      if (v) {
        const vehicleStr = [v.marca, v.modelo, v.anno, v.tipo].filter(Boolean).join(' ');
        setForm((prev) => ({ ...prev, vehicle: vehicleStr, plate: v.placa || '' }));
      }
    });

    return () => unsub();
  }, [currentUsername]);

  const loadAppointments = async () => {
    try {
      const snapshot = await get(ref(db, 'appointments'));
      const data = snapshot.val() || {};
      const apps = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      setAppointments(apps.filter((app) => app.email === currentUsername));
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las citas.');
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'El nombre es requerido.');
      return;
    }

    if (!form.date) {
      Alert.alert('Error', 'Debes seleccionar una fecha.');
      return;
    }

    if (!form.time) {
      Alert.alert('Error', 'Debes seleccionar una hora.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (form.date < today) {
      Alert.alert('Error', 'La fecha no puede ser en el pasado.');
      return;
    }

    if (form.time < '08:00' || form.time > '17:00') {
      Alert.alert('Error', 'La hora debe estar entre 08:00 y 17:00.');
      return;
    }

    const exists = appointments.some((app) => app.date === form.date && app.time === form.time);

    if (exists) {
      Alert.alert('Error', 'Ya hay una cita en esa fecha y hora.');
      return;
    }

    try {
      await push(ref(db, 'appointments'), {
        ...form,
        email: currentUsername,
        status: 'Pendiente'
      });

      Alert.alert('Éxito', 'Cita agendada correctamente.');

      const vehicleStr = profileVehicle
        ? [profileVehicle.marca, profileVehicle.modelo, profileVehicle.anno, profileVehicle.tipo].filter(Boolean).join(' ')
        : '';

      setForm({
        name: '',
        email: currentUsername,
        phone: '',
        date: '',
        time: '',
        vehicle: vehicleStr,
        plate: profileVehicle?.placa || ''
      });

      loadAppointments();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agendar la cita.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return styles.pending;
      case 'En revision':
      case 'En revisión':
        return styles.inReview;
      case 'Listo':
        return styles.ready;
      default:
        return styles.pending;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Citas</Text>
        </View>

        <Text style={styles.subtitle}>
          Consulta el estado de tus citas y agenda nuevos servicios para tu vehículo.
        </Text>

        <View style={styles.tableCard}>
          <ScrollView horizontal>
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Nombre</Text>
                <Text style={styles.tableHeaderText}>Fecha</Text>
                <Text style={styles.tableHeaderText}>Hora</Text>
                <Text style={styles.tableHeaderText}>Vehículo</Text>
                <Text style={styles.tableHeaderText}>Estado</Text>
              </View>

              {appointments.map((app) => (
                <View key={app.id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{app.name}</Text>
                  <Text style={styles.tableCell}>{app.date}</Text>
                  <Text style={styles.tableCell}>{app.time}</Text>
                  <Text style={styles.tableCell}>{app.vehicle}</Text>

                  <Text style={[styles.tableCell, getStatusClass(app.status)]}>{app.status}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Agendar Cita</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          placeholder="Tu Nombre"
          placeholderTextColor="#94a3b8"
          onChangeText={(text) => setForm({ ...form, name: text })}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          placeholder="Tu Teléfono"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          onChangeText={(text) => setForm({ ...form, phone: text })}
        />

        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={form.date ? styles.inputText : styles.placeholderText}>{form.date || 'Seleccionar fecha'}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.date ? new Date(`${form.date}T00:00:00`) : new Date()}
            mode="date"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Hora</Text>

        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text style={form.time ? styles.inputText : styles.placeholderText}>{form.time || 'Seleccionar hora'}</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>Vehículo</Text>

        {profileVehicle ? (
          <View style={styles.vehicleCard}>
            <Ionicons name="car" size={18} color="#ff3b30" />

            <View style={{ marginLeft: 10 }}>
              <Text style={styles.vehicleText}>
                {[profileVehicle.marca, profileVehicle.modelo, profileVehicle.anno, profileVehicle.tipo].filter(Boolean).join(' ')}
              </Text>

              <Text style={styles.vehiclePlate}>Placa: {profileVehicle.placa}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.vehicleCard}>
            <Ionicons name="alert-circle" size={18} color="#f87171" />

            <Text style={styles.vehicleNoData}>No tienes vehículo registrado.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Agendar Cita</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20
  },

  contentContainer: {
    paddingBottom: 120
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },

  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10
  },

  subtitle: {
    color: '#cbd5f5',
    textAlign: 'center',
    marginBottom: 20
  },

  tableCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 10,
    marginBottom: 30
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8
  },

  tableHeaderText: {
    flex: 1,
    color: '#94a3b8',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155'
  },

  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#e2e8f0',
    fontSize: 12
  },

  pending: { color: '#f59e0b' },
  inReview: { color: '#3b82f6' },
  ready: { color: '#22c55e' },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center'
  },

  label: {
    color: '#cbd5f5',
    marginBottom: 5
  },

  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
    justifyContent: 'center',
    marginBottom: 15,
    color: '#fff'
  },

  inputText: { color: '#fff' },
  placeholderText: { color: '#94a3b8' },

  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15
  },

  vehicleText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  vehiclePlate: {
    color: '#94a3b8',
    fontSize: 12
  },

  vehicleNoData: {
    color: '#f87171',
    marginLeft: 8
  },

  btn: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center'
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});