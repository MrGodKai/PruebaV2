import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AppointmentScreen({ navigation, currentUsername }) {

  const [appointments, setAppointments] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      setForm({ ...form, time: formatTime(selectedTime) });
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAppointments(apps.filter(app => app.email === currentUsername));
  };

  const handleSubmit = async () => {

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

    await addDoc(collection(db, 'appointments'), {
      ...form,
      status: 'Pendiente'
    });

    Alert.alert('Éxito', 'Cita agendada correctamente.');

    setForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      vehicle: '',
      plate: ''
    });

    loadAppointments();
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

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          placeholder="Tu Email"
          keyboardType="email-address"
          onChangeText={(text) => setForm({ ...form, email: text })}
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
        <TextInput
          style={styles.input}
          value={form.vehicle}
          placeholder="Marca / Modelo"
          onChangeText={(text) => setForm({ ...form, vehicle: text })}
        />

        <Text style={styles.label}>Placa</Text>
        <TextInput
          style={styles.input}
          value={form.plate}
          placeholder="Placa"
          onChangeText={(text) => setForm({ ...form, plate: text })}
        />

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
  }

});