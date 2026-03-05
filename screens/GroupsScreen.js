import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { ref, push, onValue, remove, update } from 'firebase/database';

export default function GroupsScreen({ currentUser, goToGroupChat, goBack }) {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [creating, setCreating] = useState(false);
  const [addMemberGroup, setAddMemberGroup] = useState(null);
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    const groupsRef = ref(db, 'groups');
    onValue(groupsRef, snapshot => {
      const data = snapshot.val() || {};
      // Solo mostrar grupos donde el usuario es miembro
      const groupArr = Object.entries(data)
        .filter(([_, g]) => g.miembros && g.miembros.includes(currentUser))
        .map(([key, g]) => ({ ...g, key }));
      setGroups(groupArr);
    });
  }, [currentUser]);

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    const groupsRef = ref(db, 'groups');
    push(groupsRef, {
      nombre: groupName.trim(),
      miembros: [currentUser],
      mensajes: {}
    });
    setGroupName('');
    setCreating(false);
  };

  const handleDeleteGroup = (groupId) => {
    remove(ref(db, `groups/${groupId}`));
  };

  const handleAddMember = (groupId) => {
    if (!newMember.trim()) return;
    const groupRef = ref(db, `groups/${groupId}/miembros`);
    // Leer miembros actuales y añadir el nuevo
    update(ref(db, `groups/${groupId}`), {
      miembros: groups.find(g => g.key === groupId).miembros.concat(newMember.trim())
    });
    setNewMember('');
    setAddMemberGroup(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupos</Text>
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <View style={styles.groupBtn}>
            <TouchableOpacity style={{flex:1}} onPress={() => goToGroupChat(item.key, item.nombre)}>
              <Text style={styles.groupText}>{item.nombre}</Text>
              <Text style={{fontSize:12, color:'#555'}}>Miembros: {item.miembros?.join(', ')}</Text>
            </TouchableOpacity>
            <View style={{flexDirection:'row', marginTop:4}}>
              <TouchableOpacity style={[styles.createBtn, {backgroundColor:'#dc3545'}]} onPress={() => handleDeleteGroup(item.key)}>
                <Text style={styles.createText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.createBtn, {backgroundColor:'#28a745', marginLeft:8}]} onPress={() => setAddMemberGroup(item.key)}>
                <Text style={styles.createText}>Añadir miembro</Text>
              </TouchableOpacity>
            </View>
            {addMemberGroup === item.key && (
              <View style={{flexDirection:'row', marginTop:4}}>
                <TextInput
                  style={[styles.input, {flex:1}]}
                  placeholder="Usuario a añadir"
                  value={newMember}
                  onChangeText={setNewMember}
                />
                <TouchableOpacity style={[styles.createBtn, {backgroundColor:'#28a745', marginLeft:8}]} onPress={() => handleAddMember(item.key)}>
                  <Text style={styles.createText}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.createBtn, {backgroundColor:'#ccc', marginLeft:8}]} onPress={() => setAddMemberGroup(null)}>
                  <Text style={[styles.createText, {color:'#333'}]}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        keyExtractor={item => item.key}
        style={styles.list}
      />
      {creating ? (
        <View style={styles.createBox}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del grupo"
            value={groupName}
            onChangeText={setGroupName}
          />
          <TouchableOpacity style={styles.createBtn} onPress={handleCreateGroup}>
            <Text style={styles.createText}>Crear</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.createBtn} onPress={() => setCreating(true)}>
          <Text style={styles.createText}>Crear grupo</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, alignSelf: 'center' },
  list: { flex: 1, marginBottom: 10 },
  groupBtn: { backgroundColor: '#e6f7ff', padding: 10, borderRadius: 8, marginVertical: 4 },
  groupText: { color: '#333', fontWeight: 'bold' },
  createBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10 },
  createBtn: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, marginLeft: 8 },
  createText: { color: '#fff', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#ccc', padding: 10, borderRadius: 8, alignSelf: 'center', marginTop: 10 },
  backText: { color: '#333' }
});
