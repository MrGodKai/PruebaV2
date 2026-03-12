import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const services = [
{
title:'Mantenimiento General',
description:'Cambio de aceite y filtros, revisión de motor y fluidos, chequeo preventivo completo.',
price:'Desde ₡25.000',
icon:require('../assets/services/mantenimiento.png')
},
{
title:'Frenos y Suspensión',
description:'Inspección y cambio de pastillas y discos, alineación y balanceo.',
price:'Desde ₡18.000',
icon:require('../assets/services/frenos.png')
},
{
title:'Sistema Eléctrico',
description:'Diagnóstico de batería y alternador, reparación de cableado.',
price:'Desde ₡15.000',
icon:require('../assets/services/electrico.png')
},
{
title:'Diagnóstico Computarizado',
description:'Escaneo de errores, revisión de sensores y ECU.',
price:'Desde ₡12.000',
icon:require('../assets/services/diagnostico.jpg')
},
{
title:'Transmisión',
description:'Mantenimiento de caja y reparación de embrague.',
price:'Desde ₡30.000',
icon:require('../assets/services/transmision.png')
},
{
title:'Climatización',
description:'Recarga de aire acondicionado y limpieza de ductos.',
price:'Desde ₡25.000',
icon:require('../assets/services/climatizacion.jpg')
},
{
title:'Alineación',
description:'Alineación de ruedas y revisión de suspensión.',
price:'Desde ₡22.000',
icon:require('../assets/services/alineacion.png')
},
{
title:'Reparación de Motor',
description:'Revisión de válvulas, correas y fugas del motor.',
price:'Desde ₡40.000',
icon:require('../assets/services/motor.jpg')
},
{
title:'Cambio de Fluidos',
description:'Cambio de aceite, líquido de frenos y refrigerante.',
price:'Desde ₡20.000',
icon:require('../assets/services/fluidos.png')
}
];

export default function ServicesScreen({ navigation }) {

return(

<SafeAreaView style={{flex:1,backgroundColor:'#0f172a'}}>

<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:45}}
>

<View style={styles.header}>

<TouchableOpacity
onPress={()=>navigation.navigate('Home')}
style={styles.backBtn}
>
<Ionicons name="arrow-back" size={22} color="#fff"/>
</TouchableOpacity>

<Text style={styles.headerText}>Servicios</Text>

</View>

<Text style={styles.title}>Nuestros Servicios</Text>

{services.map((service,index)=>(

<View key={index} style={styles.serviceCard}>

<View style={styles.serviceTop}>

<View style={styles.iconContainer}>
<Image
source={service.icon}
style={styles.serviceIcon}
/>
</View>

<View style={styles.serviceInfo}>
<Text style={styles.serviceTitle}>{service.title}</Text>
<Text style={styles.servicePrice}>{service.price}</Text>
</View>

</View>

<Text style={styles.description}>{service.description}</Text>

</View>

))}

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
color:'#fff',
marginLeft:10
},

title:{
fontSize:28,
fontWeight:'bold',
color:'#fff',
marginBottom:20
},

serviceCard:{
backgroundColor:'#1e293b',
padding:18,
borderRadius:16,
marginBottom:20
},

serviceTop:{
flexDirection:'row',
alignItems:'center',
marginBottom:10
},

iconContainer:{
backgroundColor:'#fff',
width:50,
height:50,
borderRadius:12,
alignItems:'center',
justifyContent:'center',
marginRight:15
},

serviceIcon:{
width:30,
height:30,
resizeMode:'contain'
},

serviceInfo:{
flex:1
},

serviceTitle:{
fontSize:18,
fontWeight:'bold',
color:'#fff'
},

servicePrice:{
color:'#ff3b30',
fontWeight:'bold',
marginTop:4
},

description:{
color:'#cbd5f5',
lineHeight:20
}

});