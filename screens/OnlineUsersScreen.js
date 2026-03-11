import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, set, onValue, update } from 'firebase/database';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ROLE_OPTIONS = [
  { key: 'user', label: 'Usuario' },
  { key: 'mechanic', label: 'Mecanico' },
  { key: 'admin', label: 'Admin' }
];

// Para depuración
const log = (...args) => { try { console.log(...args); } catch {} };

export default function OnlineUsersScreen({ currentUser, currentRole, goBack }) {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState({});

  useEffect(() => {
    // Marcar usuario como online
    const userRef = ref(db, `onlineUsers/${currentUser}`);
    set(userRef, { username: currentUser, online: true, timestamp: Date.now() })
      .then(() => log('Usuario online registrado:', currentUser))
      .catch(e => log('Error registrando usuario online:', e));
    // Escuchar usuarios online
    const onlineRef = ref(db, 'onlineUsers');
    onValue(onlineRef, snapshot => {
      const data = snapshot.val() || {};
      log('Usuarios online recibidos:', data);
      const userArr = Object.entries(data)
        .filter(([key, u]) => u.username !== currentUser && u.online)
        .map(([key, u]) => ({ ...u, key }));
      setUsers(userArr);
    });

    const usersRef = ref(db, 'registeredUsers');
    onValue(usersRef, snapshot => {
      setRegisteredUsers(snapshot.val() || {});
    });

    // Al salir, marcar offline (opcional)
    return () => set(userRef, { username: currentUser, online: false, timestamp: Date.now() })
      .then(() => log('Usuario offline:', currentUser))
      .catch(e => log('Error marcando offline:', e));
  }, [currentUser]);

  const changeUserRole = async (username, nextRole) => {
    if (currentRole !== 'admin') return;
    try {
      await update(ref(db, `registeredUsers/${username}`), { role: nextRole });
      await update(ref(db, `onlineUsers/${username}`), { role: nextRole, timestamp: Date.now() });
    } catch (e) {
      log('Error cambiando rol:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <Text style={styles.title}>Usuarios conectados</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.userBtn}>
            <Text style={styles.userText}>{item.username}</Text>
            <Text style={styles.roleText}>Rol actual: {registeredUsers[item.username]?.role || item.role || 'user'}</Text>
            {currentRole === 'admin' ? (
              <View style={styles.roleRow}>
                {ROLE_OPTIONS.map((role) => (
                  <TouchableOpacity
                    key={role.key}
                    style={[
                      styles.roleBtn,
                      (registeredUsers[item.username]?.role || 'user') === role.key && styles.roleBtnActive
                    ]}
                    onPress={() => changeUserRole(item.username, role.key)}
                  >
                    <Text
                      style={[
                        styles.roleBtnText,
                        (registeredUsers[item.username]?.role || 'user') === role.key && styles.roleBtnTextActive
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
        )}
        keyExtractor={item => item.key}
        style={styles.list}
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
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, alignSelf: 'center' },
  list: { flex: 1, marginBottom: 10 },
  userBtn: { backgroundColor: '#e6f7ff', padding: 10, borderRadius: 8, marginVertical: 4, borderWidth: 1, borderColor: '#cde5ee' },
  userText: { color: '#333', fontWeight: 'bold' },
  roleText: { color: '#45636b', fontSize: 12, marginTop: 3, marginBottom: 8 },
  roleRow: { flexDirection: 'row' },
  roleBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#bdd2d9', borderRadius: 7, paddingVertical: 6, paddingHorizontal: 8, marginRight: 8 },
  roleBtnActive: { backgroundColor: '#0f4c5c', borderColor: '#0f4c5c' },
  roleBtnText: { color: '#35565d', fontSize: 11, fontWeight: '700' },
  roleBtnTextActive: { color: '#fff' },
  backBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, alignSelf: 'center' },
  backText: { color: '#333' }
});
