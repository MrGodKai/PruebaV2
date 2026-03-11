import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, push, onValue, update } from 'firebase/database';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE_STATUSES = ['Recibido', 'Pendiente', 'En revision', 'En reparación', 'En reparacion'];

export default function GroupsScreen({ currentUser, currentRole, goToGroupChat, goBack }) {
  const insets = useSafeAreaInsets();
  const [groups, setGroups] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [subject, setSubject] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [creating, setCreating] = useState(false);
  const [userVehicle, setUserVehicle] = useState(null);

  useEffect(() => {
    const groupsRef = ref(db, 'groups');
    onValue(groupsRef, snapshot => {
      const data = snapshot.val() || {};
      const groupArr = Object.entries(data)
        .filter(([_, g]) => g.miembros && g.miembros.includes(currentUser))
        .map(([key, g]) => ({ ...g, key }));
      setGroups(groupArr);
    });
  }, [currentUser]);

  useEffect(() => {
    const usersRef = ref(db, 'registeredUsers');
    onValue(usersRef, snapshot => {
      const data = snapshot.val() || {};
      const mechanicUsers = Object.values(data)
        .filter(user => user.role === 'mechanic')
        .map(user => user.username)
        .filter(Boolean);

      if (!mechanicUsers.includes('mecanico')) {
        mechanicUsers.unshift('mecanico');
      }

      setMechanics([...new Set(mechanicUsers)]);
    });
  }, []);

  useEffect(() => {
    const onlineRef = ref(db, 'onlineUsers');
    onValue(onlineRef, snapshot => {
      setOnlineUsers(snapshot.val() || {});
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const vRef = ref(db, `registeredUsers/${currentUser}/vehiculo`);
    const unsub = onValue(vRef, snapshot => {
      setUserVehicle(snapshot.val() || null);
    });
    return () => unsub();
  }, [currentUser]);

  const formatVehicle = (v) => {
    if (!v) return '';
    return [v.marca, v.modelo, v.anno].filter(Boolean).join(' ');
  };

  const isActiveFollowUpStatus = (status) => ACTIVE_STATUSES.includes(status || 'Recibido');

  const closeFollowUp = (group) => {
    Alert.alert(
      'Cerrar seguimiento',
      '¿Deseas cerrar este seguimiento? Podrás abrir uno nuevo después.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar',
          style: 'destructive',
          onPress: async () => {
            try {
              await update(ref(db, `groups/${group.key}/seguimiento`), {
                estado: 'Cerrado por cliente',
                tiempoEstimado: 'Cerrado manualmente por el cliente',
                actualizadoPor: currentUser,
                actualizadoEn: Date.now()
              });
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar el seguimiento. Inténtalo de nuevo.');
            }
          }
        }
      ]
    );
  };

  const getAutoAssignedMechanic = () => {
    const onlineMechanics = mechanics.filter((username) => {
      const onlineData = onlineUsers[username];
      return onlineData && onlineData.online;
    });

    if (onlineMechanics.length > 0) {
      const index = Date.now() % onlineMechanics.length;
      return onlineMechanics[index];
    }

    if (mechanics.length > 0) {
      const index = Date.now() % mechanics.length;
      return mechanics[index];
    }

    return 'mecanico';
  };

  const handleCreateFollowUp = () => {
    const cleanSubject = subject.trim() || 'Consulta general';
    const cleanVehicle = vehicle.trim() || 'Vehiculo no especificado';
    const assignedMechanic = getAutoAssignedMechanic();

    const activeFollowUps = groups.filter((group) => {
      const status = group?.seguimiento?.estado || 'Recibido';
      return group.cliente === currentUser && isActiveFollowUpStatus(status);
    });

    if (activeFollowUps.length > 0) {
      const activeGroup = activeFollowUps.reduce((latest, group) => {
        const latestTime = latest?.seguimiento?.actualizadoEn || 0;
        const currentTime = group?.seguimiento?.actualizadoEn || 0;
        return currentTime > latestTime ? group : latest;
      }, activeFollowUps[0]);

      Alert.alert(
        'Consulta activa',
        'Ya tienes una consulta en proceso. Te redirigimos a tu chat activo.'
      );

      setCreating(false);
      goToGroupChat(activeGroup.key, activeGroup.nombre || 'Seguimiento activo');
      return;
    }

    const newGroupRef = push(ref(db, 'groups'), {
      nombre: `Seguimiento: ${cleanVehicle}`,
      asunto: cleanSubject,
      vehiculo: cleanVehicle,
      vehiculoInfo: userVehicle || null,
      cliente: currentUser,
      mecanico: assignedMechanic,
      miembros: [currentUser, assignedMechanic],
      seguimiento: {
        estado: 'Recibido',
        tiempoEstimado: 'Pendiente por definir',
        actualizadoPor: currentUser,
        actualizadoEn: Date.now()
      },
      mensajes: {}
    });

    setSubject('');
    setVehicle('');
    setCreating(false);

    goToGroupChat(newGroupRef.key, `Seguimiento: ${cleanVehicle}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <Text style={styles.title}>Seguimiento Cliente-Mecánico</Text>
      <Text style={styles.subtitle}>Cuando solicitas información, se asigna un mecánico automáticamente y se abre el chat de seguimiento.</Text>

      {currentRole !== 'mechanic' ? (
        creating ? (
          <View style={styles.createCard}>
            <Text style={styles.cardTitle}>Nuevo seguimiento</Text>
            <Text style={styles.fieldLabel}>Motivo de la consulta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: ruido en frenos, cambio de aceite, revisión general"
              value={subject}
              onChangeText={setSubject}
            />
            <Text style={styles.fieldLabel}>Vehículo</Text>
            <TextInput
              style={styles.input}
              placeholder="Vehículo (ej: Toyota Corolla 2018)"
              value={vehicle}
              onChangeText={setVehicle}
            />
            {userVehicle && (
              <Text style={{ fontSize: 11, color: '#2a9d8f', marginBottom: 6, marginTop: -4 }}>
                Pre-cargado desde tu perfil. Puedes editar.
              </Text>
            )}

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreateFollowUp}>
                <Text style={styles.createText}>Solicitar información</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setCreating(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.createBtn} onPress={() => {
            setSubject('Consulta general');
            if (userVehicle) setVehicle(formatVehicle(userVehicle));
            setCreating(true);
          }}>
            <Text style={styles.createText}>Nueva consulta con mecánico</Text>
          </TouchableOpacity>
        )
      ) : null}

      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <View style={styles.groupBtn}>
            <TouchableOpacity style={{flex:1}} onPress={() => goToGroupChat(item.key, item.nombre)}>
              <Text style={styles.groupText}>{item.nombre}</Text>
              <Text style={styles.metaText}>Cliente: {item.cliente || 'N/A'}</Text>
              <Text style={styles.metaText}>Mecánico: {item.mecanico || 'N/A'}</Text>
              <Text style={styles.metaText}>Estado: {item.seguimiento?.estado || 'Recibido'}</Text>
              <Text style={styles.metaText}>Tiempo estimado: {item.seguimiento?.tiempoEstimado || 'Pendiente por definir'}</Text>
            </TouchableOpacity>
            {(currentRole !== 'mechanic' && item.cliente === currentUser && isActiveFollowUpStatus(item?.seguimiento?.estado)) ? (
              <TouchableOpacity style={styles.closeBtn} onPress={() => closeFollowUp(item)}>
                <Text style={styles.closeBtnText}>Cerrar seguimiento</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        keyExtractor={item => item.key}
        style={styles.list}
      />

      {goBack ? (
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, alignSelf: 'center', color: '#12343b' },
  subtitle: { fontSize: 13, color: '#4d666c', textAlign: 'center', marginBottom: 12 },
  list: { flex: 1, marginBottom: 10 },
  groupBtn: { backgroundColor: '#e6f7ff', padding: 12, borderRadius: 10, marginVertical: 6, borderWidth: 1, borderColor: '#cde5ee' },
  groupText: { color: '#1b4048', fontWeight: 'bold', marginBottom: 5 },
  metaText: { fontSize: 12, color: '#45636b', marginBottom: 2 },
  createCard: { backgroundColor: '#f3f8fa', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#d8e8ee' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#204651', marginBottom: 8 },
  fieldLabel: { fontSize: 12, color: '#45636b', fontWeight: '700', marginBottom: 6 },
  input: { width: '100%', height: 42, borderWidth: 1, borderColor: '#d0dbe0', borderRadius: 8, paddingHorizontal: 10, marginBottom: 10, backgroundColor: '#fff' },
  createBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8 },
  createText: { color: '#fff', fontWeight: 'bold' },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  cancelBtn: { backgroundColor: '#dfe5e7', padding: 10, borderRadius: 8, marginLeft: 8 },
  cancelText: { color: '#314246', fontWeight: 'bold' },
  closeBtn: { marginTop: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#f5c2c7', alignItems: 'center' },
  closeBtnText: { color: '#b02a37', fontWeight: '700', fontSize: 12 },
  backBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, alignSelf: 'center', marginTop: 10 },
  backText: { color: '#333' }
});
