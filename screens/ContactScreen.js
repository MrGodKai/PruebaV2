import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactScreen({ navigation }) {

const [form, setForm] = useState({
name:'',
email:'',
phone:'',
message:''
});

const handleSubmit = () => {

Alert.alert('Mensaje enviado','Tu mensaje fue enviado correctamente.');

setForm({
name:'',
email:'',
phone:'',
message:''
});

};

return(

<SafeAreaView style={{flex:1, backgroundColor:'#0f172a'}}>

<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:45}}
>

<View style={styles.header}>

<TouchableOpacity
style={styles.backBtn}
onPress={()=> navigation.navigate('Home')}
>
<Ionicons name="arrow-back" size={22} color="#fff"/>
</TouchableOpacity>

<Text style={styles.headerText}>Contacto</Text>

<View style={{width:40}}/>

</View>

<Text style={styles.title}>Contáctanos</Text>

<Text style={styles.subtitle}>
¿Tienes alguna consulta sobre nuestros servicios o productos? Nuestro equipo está listo para ayudarte y brindarte la mejor atención.
</Text>

<View style={styles.formCard}>

<View style={styles.inputGroup}>
<Ionicons name="person-outline" size={20} color="#94a3b8"/>
<TextInput
style={styles.input}
placeholder="Tu Nombre"
placeholderTextColor="#94a3b8"
value={form.name}
onChangeText={(text)=> setForm({...form,name:text})}
/>
</View>

<View style={styles.inputGroup}>
<Ionicons name="mail-outline" size={20} color="#94a3b8"/>
<TextInput
style={styles.input}
placeholder="Tu Email"
placeholderTextColor="#94a3b8"
keyboardType="email-address"
value={form.email}
onChangeText={(text)=> setForm({...form,email:text})}
/>
</View>

<View style={styles.inputGroup}>
<Ionicons name="call-outline" size={20} color="#94a3b8"/>
<TextInput
style={styles.input}
placeholder="Tu Teléfono"
placeholderTextColor="#94a3b8"
keyboardType="phone-pad"
value={form.phone}
onChangeText={(text)=> setForm({...form,phone:text})}
/>
</View>

<View style={[styles.inputGroup,{alignItems:'flex-start'}]}>
<Ionicons name="chatbubble-outline" size={20} color="#94a3b8"/>
<TextInput
style={[styles.input,{height:90}]}
placeholder="Tu Mensaje"
placeholderTextColor="#94a3b8"
multiline
value={form.message}
onChangeText={(text)=> setForm({...form,message:text})}
/>
</View>

<TouchableOpacity
style={styles.sendBtn}
onPress={handleSubmit}
>

<Ionicons name="send-outline" size={20} color="#fff"/>

<Text style={styles.sendText}>
Enviar Mensaje
</Text>

</TouchableOpacity>

</View>

<View style={styles.infoCard}>

<Text style={styles.infoTitle}>Información de Contacto</Text>

<View style={styles.infoRow}>
<Ionicons name="location-outline" size={20} color="#ff3b30"/>
<Text style={styles.infoText}>Calle Principal, Costa Rica</Text>
</View>

<View style={styles.infoRow}>
<Ionicons name="call-outline" size={20} color="#ff3b30"/>
<Text style={styles.infoText}>+506 8888-8888</Text>
</View>

<View style={styles.infoRow}>
<Ionicons name="mail-outline" size={20} color="#ff3b30"/>
<Text style={styles.infoText}>info@powercar.com</Text>
</View>

<View style={styles.infoRow}>
<Ionicons name="time-outline" size={20} color="#ff3b30"/>
<Text style={styles.infoText}>Lunes - Viernes 8AM a 6PM</Text>
</View>

</View>

<View style={styles.socialCard}>

<Text style={styles.infoTitle}>Síguenos</Text>

<View style={styles.socialIcons}>

<Ionicons name="logo-facebook" size={28} color="#1877F2"/>

<Ionicons name="logo-instagram" size={28} color="#E1306C"/>

<Ionicons name="logo-whatsapp" size={28} color="#25D366"/>

</View>

</View>

</ScrollView>

</SafeAreaView>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20
},

header:{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
marginBottom:20
},

backBtn:{
backgroundColor:'#1e293b',
padding:10,
borderRadius:10
},

headerText:{
fontSize:22,
fontWeight:'bold',
color:'#fff'
},

title:{
fontSize:28,
fontWeight:'bold',
color:'#fff',
marginBottom:10
},

subtitle:{
color:'#cbd5f5',
marginBottom:25,
lineHeight:20
},

formCard:{
backgroundColor:'#1e293b',
padding:18,
borderRadius:16,
marginBottom:20
},

inputGroup:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'#0f172a',
borderRadius:10,
paddingHorizontal:10,
marginBottom:15
},

input:{
flex:1,
color:'#fff',
padding:10
},

sendBtn:{
backgroundColor:'#ff3b30',
padding:14,
borderRadius:12,
flexDirection:'row',
alignItems:'center',
justifyContent:'center'
},

sendText:{
color:'#fff',
fontWeight:'bold',
marginLeft:8
},

infoCard:{
backgroundColor:'#1e293b',
padding:18,
borderRadius:16,
marginBottom:20
},

infoTitle:{
color:'#fff',
fontSize:18,
fontWeight:'bold',
marginBottom:10
},

infoRow:{
flexDirection:'row',
alignItems:'center',
marginBottom:8
},

infoText:{
color:'#cbd5f5',
marginLeft:8
},

socialCard:{
backgroundColor:'#1e293b',
padding:18,
borderRadius:16,
marginBottom:20,
alignItems:'center'
},

socialIcons:{
flexDirection:'row',
justifyContent:'space-around',
width:120,
marginTop:10
}

});