import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { firestoreDb, db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
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
      setForm({ ...form, date: formatDate(selectedDate) });
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
      setForm(prev => ({ ...prev, time: formatTime(selectedTime) }));
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    if (!currentUsername) return;
    setForm(prev => ({ ...prev, email: currentUsername }));
    const vRef = ref(db, `registeredUsers/${currentUsername}/vehiculo`);
    const unsub = onValue(vRef, snapshot => {
      const v = snapshot.val();
      setProfileVehicle(v || null);
      if (v) {
        const vehicleStr = [v.marca, v.modelo, v.anno, v.tipo].filter(Boolean).join(' ');
        setForm(prev => ({ ...prev, vehicle: vehicleStr, plate: v.placa || '' }));
      }
    });
    return () => unsub();
  }, [currentUsername]);

  const loadAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestoreDb, 'appointments'));
      const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(apps.filter(app => app.email === currentUsername));
    } catch (error) {
      console.error('Error cargando citas:', error);
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

    const exists = appointments.some(
      app => app.date === form.date && app.time === form.time
    );

    if (exists) {
      Alert.alert('Error', 'Ya hay una cita en esa fecha y hora.');
      return;
    }

    try {
      await addDoc(collection(firestoreDb, 'appointments'), {
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
      console.error('Error al agendar cita:', error);
      Alert.alert('Error', `No se pudo agendar la cita. Verifica tu conexión.\n\nDetalle: ${error.message}`);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente': return styles.pending;
      case 'En revisión': return styles.inReview;
      case 'Listo': return styles.ready;
      default: return styles.pending;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}>
            <Ionicons name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Citas</Text>
        </View>

        <Text style={styles.subtitle}>
          A continuación verás el estado de tus citas y datos registrados.
        </Text>

        <ScrollView horizontal>

          <View style={styles.table}>

            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Nombre</Text>
              <Text style={styles.tableHeaderText}>Email</Text>
              <Text style={styles.tableHeaderText}>Fecha</Text>
              <Text style={styles.tableHeaderText}>Hora</Text>
              <Text style={styles.tableHeaderText}>Vehículo</Text>
              <Text style={styles.tableHeaderText}>Placa</Text>
              <Text style={styles.tableHeaderText}>Estado</Text>
            </View>

            {appointments.map(app => (
              <View key={app.id} style={styles.tableRow}>

                <Text style={styles.tableCell}>{app.name}</Text>
                <Text style={styles.tableCell}>{app.email}</Text>
                <Text style={styles.tableCell}>{app.date}</Text>
                <Text style={styles.tableCell}>{app.time}</Text>
                <Text style={styles.tableCell}>{app.vehicle}</Text>
                <Text style={styles.tableCell}>{app.plate}</Text>

                <Text style={[styles.tableCell, getStatusClass(app.status)]}>
                  {app.status}
                </Text>

              </View>
            ))}

          </View>

        </ScrollView>

        <Text style={styles.sectionTitle}>Agendar Cita</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          placeholder="Tu Nombre"
          onChangeText={(text) => setForm({ ...form, name: text })}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          placeholder="Tu Teléfono"
          keyboardType="phone-pad"
          onChangeText={(text) => setForm({ ...form, phone: text })}
        />

        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={form.date ? styles.inputText : styles.placeholderText}>
            {form.date || 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.date ? new Date(`${form.date}T00:00:00`) : new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text style={form.time ? styles.inputText : styles.placeholderText}>
            {form.time || 'Seleccionar hora'}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={(() => {
              if (form.time) {
                const [h, m] = form.time.split(':');
                const d = new Date();
                d.setHours(parseInt(h), parseInt(m), 0, 0);
                return d;
              }
              return new Date();
            })()}
            mode="time"
            display="default"
            is24Hour={true}
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>Vehículo</Text>
        {profileVehicle ? (
          <View style={styles.vehicleInfoCard}>
            <Ionicons name="car" size={16} color="#2a9d8f" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleInfoText}>
                {[profileVehicle.marca, profileVehicle.modelo, profileVehicle.anno, profileVehicle.tipo].filter(Boolean).join(' ')}
              </Text>
              {profileVehicle.placa ? (
                <Text style={styles.vehiclePlateText}>Placa: {profileVehicle.placa}</Text>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.vehicleInfoCard}>
            <Ionicons name="alert-circle-outline" size={16} color="#e76f51" style={{ marginRight: 8 }} />
            <Text style={styles.vehicleNoData}>No tienes vehículo registrado. Agrégalo en Mi Cuenta.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Enviar Solicitud</Text>
        </TouchableOpacity>

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

  contentContainer: {
    paddingBottom: 100
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },

  table: {
    marginBottom: 20
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10
  },

  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },

  tableCell: {
    flex: 1,
    textAlign: 'center'
  },

  pending: { color: 'orange' },
  inReview: { color: 'blue' },
  ready: { color: 'green' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center'
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10
  },

  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },

  inputText: {
    color: '#000'
  },

  placeholderText: {
    color: '#999'
  },

  btn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  vehicleInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f8fa',
    borderWidth: 1,
    borderColor: '#d8e8ee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15
  },
  vehicleInfoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#12343b'
  },
  vehiclePlateText: {
    fontSize: 12,
    color: '#4d666c',
    marginTop: 2
  },
  vehicleNoData: {
    fontSize: 13,
    color: '#e76f51',
    flex: 1
  }

});