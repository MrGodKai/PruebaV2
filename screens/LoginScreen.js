import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ALLOWED_ROLES = ['admin', 'mechanic', 'user'];

export default function LoginScreen({ setRole, goToRegister, users, goBack, setCurrentUsername }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {

    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      setError('Usuario y contraseña requeridos');
      return;
    }

    try {

      const userRef = ref(db, `registeredUsers/${cleanUsername}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {

        const user = snapshot.val();
        const userRole = ALLOWED_ROLES.includes(user.role) ? user.role : 'user';

        if (user.password === password) {
          setRole(userRole);
          setCurrentUsername(cleanUsername);
          setError('');
          return;
        }

      }

      const localUser = users.find(u => u.username === cleanUsername && u.password === password);

      if (localUser) {

        const localRole = ALLOWED_ROLES.includes(localUser.role) ? localUser.role : 'user';
        setRole(localRole);
        setCurrentUsername(cleanUsername);
        setError('');
        return;

      }

      setError('Usuario o contraseña incorrectos');

    } catch (e) {

      const localUser = users.find(u => u.username === cleanUsername && u.password === password);

      if (localUser) {

        const localRole = ALLOWED_ROLES.includes(localUser.role) ? localUser.role : 'user';
        setRole(localRole);
        setCurrentUsername(cleanUsername);
        setError('');

      } else {

        setError('Error de conexión');

      }

    }

  };

  return (

<SafeAreaView style={{flex:1}}>

<View style={styles.container}>

<View style={styles.hero}>

<Image
source={require('../assets/user-icon.png')}
style={styles.logo}
/>

<Text style={styles.title}>
Power<Text style={styles.brand}>CAR</Text> App
</Text>

<Text style={styles.subtitle}>
Gestión inteligente de servicios automotrices
</Text>

</View>

<View style={styles.card}>

<View style={styles.inputContainer}>

<Ionicons name="person-outline" size={20} color="#94a3b8"/>

<TextInput
style={styles.input}
placeholder="Usuario"
placeholderTextColor="#94a3b8"
value={username}
onChangeText={setUsername}
/>

</View>

<View style={styles.inputContainer}>

<Ionicons name="lock-closed-outline" size={20} color="#94a3b8"/>

<TextInput
style={styles.input}
placeholder="Contraseña"
placeholderTextColor="#94a3b8"
value={password}
onChangeText={setPassword}
secureTextEntry
/>

</View>

{error ? <Text style={styles.error}>{error}</Text> : null}

<TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
<Text style={styles.loginText}>Ingresar</Text>
</TouchableOpacity>

<View style={styles.separator}/>

<TouchableOpacity style={styles.registerBtn} onPress={goToRegister}>
<Text style={styles.registerText}>Crear Cuenta</Text>
</TouchableOpacity>

{goBack && (
<TouchableOpacity style={styles.backBtn} onPress={goBack}>
<Text style={styles.backText}>Volver</Text>
</TouchableOpacity>
)}

</View>

<View style={styles.footer}>

<Text style={styles.footerText}>
Power<Text style={styles.brand}>CAR</Text> © 2026
</Text>

</View>

</View>

</SafeAreaView>

  );

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:'#0f172a',
justifyContent:'center',
padding:25
},

hero:{
alignItems:'center',
marginBottom:30
},

logo:{
width:90,
height:90,
borderRadius:45,
marginBottom:10
},

title:{
fontSize:30,
fontWeight:'bold',
color:'#fff'
},

brand:{
color:'#ff3b30'
},

subtitle:{
color:'#94a3b8',
marginTop:5,
fontSize:14
},

card:{
backgroundColor:'#1e293b',
borderRadius:20,
padding:25,

shadowColor:'#000',
shadowOpacity:0.4,
shadowRadius:8,
elevation:10
},

inputContainer:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'#0f172a',
borderRadius:12,
paddingHorizontal:12,
marginBottom:15
},

input:{
flex:1,
height:50,
color:'#fff',
marginLeft:10
},

error:{
color:'#ff4d4d',
textAlign:'center',
marginBottom:10
},

loginBtn:{
backgroundColor:'#ff3b30',
paddingVertical:16,
borderRadius:14,
alignItems:'center',
marginTop:10,

shadowColor:'#000',
shadowOpacity:0.4,
shadowRadius:6,
elevation:6
},

loginText:{
color:'#fff',
fontWeight:'bold',
fontSize:16
},

separator:{
height:1,
backgroundColor:'#334155',
marginVertical:20
},

registerBtn:{
borderWidth:2,
borderColor:'#ff3b30',
paddingVertical:14,
borderRadius:14,
alignItems:'center'
},

registerText:{
color:'#ff3b30',
fontWeight:'bold'
},

backBtn:{
marginTop:15,
alignItems:'center'
},

backText:{
color:'#94a3b8'
},

footer:{
alignItems:'center',
marginTop:30
},

footerText:{
color:'#64748b',
fontSize:12
}

});