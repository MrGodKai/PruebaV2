import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {

const features = [
{ icon: 'construct', text: 'Herramientas Avanzadas' },
{ icon: 'time', text: 'Servicio Rápido' },
{ icon: 'shield-checkmark', text: 'Garantía de Calidad' }
];

const services = [
{ icon:'car', title:'Mantenimiento General'},
{ icon:'speedometer', title:'Diagnóstico Computarizado'},
{ icon:'water', title:'Cambio de Aceite'},
{ icon:'build', title:'Reparación de Motor'}
];

const benefits = [
'Más de 15 años de experiencia',
'Mecánicos certificados',
'Equipos de diagnóstico modernos',
'Garantía en todos los servicios'
];

return (

<SafeAreaView style={{flex:1}}>
<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
contentContainerStyle={{ paddingBottom: 45 }}
>

<View style={styles.headerContainer}>
<Image
source={require('../assets/BannerPowerCar.png')}
style={styles.logo}
resizeMode="cover"
/>
</View>

<View style={styles.hero}>

<Text style={styles.title}>
Mantenimiento <Text style={styles.brand}>Profesional</Text>
</Text>

<Text style={styles.subtitle}>
Expertos en reparación, mantenimiento y diagnóstico automotriz.
Utilizamos tecnología moderna y mecánicos especializados para
garantizar el mejor rendimiento y seguridad de tu vehículo.
</Text>

<View style={styles.features}>

{features.map((feature,index)=>(
<View key={index} style={styles.featureCard}>
<Ionicons name={feature.icon} size={30} color="#ff3b30"/>
<Text style={styles.featureText}>{feature.text}</Text>
</View>
))}

</View>

<TouchableOpacity
style={styles.primaryBtn}
onPress={()=>navigation.navigate('Services')}
>
<Text style={styles.primaryBtnText}>Nuestros Servicios</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.secondaryBtn}
onPress={()=>navigation.navigate('Appointment')}
>
<Text style={styles.secondaryBtnText}>Agendar Cita</Text>
</TouchableOpacity>

</View>

<View style={styles.section}>

<Text style={styles.sectionTitle}>Servicios Destacados</Text>

<View style={styles.serviceGrid}>

{services.map((service,index)=>(
<View key={index} style={styles.serviceCard}>
<Ionicons name={service.icon} size={32} color="#ff3b30"/>
<Text style={styles.serviceText}>{service.title}</Text>
</View>
))}

</View>

</View>

<View style={styles.section}>

<Text style={styles.sectionTitle}>¿Por qué elegirnos?</Text>

{benefits.map((item,index)=>(
<View key={index} style={styles.benefitRow}>

<Image
source={require('../assets/check.png')}
style={styles.checkIcon}
/>

<Text style={styles.benefitText}>{item}</Text>

</View>
))}

</View>

<View style={styles.footer}>

<Text style={styles.footerTitle}>Power<Text style={styles.brandCar}>CAR</Text> Taller Automotriz</Text>

<Text style={styles.footerDescription}>
Brindamos soluciones automotrices completas con tecnología moderna y un equipo altamente capacitado.
Nuestra prioridad es la seguridad y el rendimiento de tu vehículo.
</Text>

<View style={styles.divider}/>

<View style={styles.contactRow}>
<Ionicons name="call-outline" size={18} color="#ff3b30"/>
<Text style={styles.footerText}>8888-8888</Text>
</View>

<View style={styles.contactRow}>
<Ionicons name="mail-outline" size={18} color="#ff3b30"/>
<Text style={styles.footerText}>taller@powercar.com</Text>
</View>

<View style={styles.contactRow}>
<Ionicons name="location-outline" size={18} color="#ff3b30"/>
<Text style={styles.footerText}>Costa Rica</Text>
</View>

<View style={styles.divider}/>

<View style={styles.socialContainer}>

<TouchableOpacity style={styles.socialBtn}>
<Ionicons name="logo-facebook" size={22} color="#3b82f6"/>
</TouchableOpacity>

<TouchableOpacity style={styles.socialBtn}>
<Ionicons name="logo-instagram" size={22} color="#e1306c"/>
</TouchableOpacity>

<TouchableOpacity style={styles.socialBtn}>
<Ionicons name="logo-whatsapp" size={22} color="#22c55e"/>
</TouchableOpacity>

</View>

<View style={styles.divider}/>

<Text style={styles.copy}>
© 2026 Power<Text style={styles.brandCar}>CAR</Text> - Todos los derechos reservados
</Text>

</View>

</ScrollView>
</SafeAreaView>

);
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:'#0f172a'
},

headerContainer:{
margin:15,
borderRadius:22,
overflow:'hidden'
},

logo:{
width:'100%',
height:210,
borderRadius:22
},

hero:{
paddingHorizontal:25,
alignItems:'center'
},

title:{
fontSize:30,
fontWeight:'bold',
color:'#fff',
textAlign:'center'
},

brand:{
color:'#ff3b30'
},

subtitle:{
fontSize:16,
color:'#cbd5f5',
textAlign:'center',
marginTop:10,
lineHeight:22
},

features:{
flexDirection:'row',
marginTop:30
},

featureCard:{
backgroundColor:'#1e293b',
flex:1,
marginHorizontal:6,
padding:18,
borderRadius:16,
alignItems:'center',
shadowColor:'#000',
shadowOpacity:0.4,
shadowRadius:5,
elevation:6
},

featureText:{
color:'#e2e8f0',
marginTop:8,
fontSize:13,
textAlign:'center'
},

primaryBtn:{
backgroundColor:'#ff3b30',
paddingVertical:16,
paddingHorizontal:45,
borderRadius:16,
marginTop:28
},

primaryBtnText:{
color:'#fff',
fontWeight:'bold',
fontSize:16
},

secondaryBtn:{
borderColor:'#ff3b30',
borderWidth:2,
paddingVertical:15,
paddingHorizontal:45,
borderRadius:16,
marginTop:15
},

secondaryBtnText:{
color:'#ff3b30',
fontWeight:'bold',
fontSize:16
},

section:{
marginTop:40,
paddingHorizontal:25
},

sectionTitle:{
fontSize:22,
fontWeight:'bold',
color:'#fff',
marginBottom:18
},

serviceGrid:{
flexDirection:'row',
flexWrap:'wrap',
justifyContent:'space-between'
},

serviceCard:{
backgroundColor:'#1e293b',
width:'48%',
padding:20,
borderRadius:16,
marginBottom:15,
alignItems:'center'
},

serviceText:{
color:'#fff',
marginTop:10,
textAlign:'center'
},

benefitRow:{
flexDirection:'row',
alignItems:'center',
marginBottom:12
},

checkIcon:{
width:18,
height:18,
marginRight:10,
resizeMode:'contain'
},

benefitText:{
color:'#e2e8f0'
},

footer:{
marginTop:50,
padding:30,
backgroundColor:'#1e293b',
borderTopLeftRadius:30,
borderTopRightRadius:30
},

footerTitle:{
color:'#fff',
fontSize:20,
fontWeight:'bold',
textAlign:'center'
},

brandCar:{
color:'#ff3b30'
},

footerDescription:{
color:'#cbd5f5',
textAlign:'center',
marginTop:10,
fontSize:14,
lineHeight:20
},

divider:{
height:1,
backgroundColor:'#334155',
marginVertical:16
},

contactRow:{
flexDirection:'row',
alignItems:'center',
marginVertical:4
},

footerText:{
color:'#cbd5f5',
marginLeft:8
},

socialContainer:{
flexDirection:'row',
justifyContent:'center',
gap:20
},

socialBtn:{
backgroundColor:'#0f172a',
padding:12,
borderRadius:50
},

copy:{
textAlign:'center',
color:'#64748b',
fontSize:12
}

});