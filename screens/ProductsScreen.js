import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../CartContext';

const products = [
{
id: 1,
title: 'Aceite para Motor',
description: 'Aceite sintético premium que protege el motor y mejora el rendimiento.',
price: '₡7.500 - ₡12.500',
icon: require('../assets/products/aceite.png')
},
{
id: 2,
title: 'Filtro de Aire',
description: 'Filtro de aire de alto rendimiento que mejora la eficiencia del combustible.',
price: '₡5.000 - ₡10.000',
icon: require('../assets/products/filtro.png')
},
{
id: 3,
title: 'Batería',
description: 'Batería automotriz confiable con excelente potencia de arranque.',
price: '₡40.000 - ₡75.000',
icon: require('../assets/products/bateria.png')
},
{
id: 4,
title: 'Pastillas de Freno',
description: 'Pastillas de freno de alto desempeño y gran seguridad.',
price: '₡10.000 - ₡20.000',
icon: require('../assets/products/pastillas.jpg')
},
{
id: 5,
title: 'Llantas',
description: 'Llantas resistentes con gran tracción y durabilidad.',
price: '₡35.000 - ₡70.000',
icon: require('../assets/products/llantas.png')
},
{
id: 6,
title: 'Correas',
description: 'Correas de distribución de alta resistencia.',
price: '₡12.000 - ₡25.000',
icon: require('../assets/products/correas.jpg')
}
];

export default function ProductsScreen({ navigation }) {

const { cart, addToCart } = useContext(CartContext);

const handleAddToCart = (product) => {
addToCart(product);
Alert.alert('Producto agregado', `${product.title} fue añadido al carrito`);
};

return (

<SafeAreaView style={{flex:1, backgroundColor:'#0f172a'}}>

<ScrollView
style={styles.container}
showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:45}}
>

<View style={styles.header}>

<TouchableOpacity
onPress={() => navigation.navigate('Home')}
style={styles.backBtn}
>
<Ionicons name="arrow-back" size={22} color="#fff"/>
</TouchableOpacity>

<Text style={styles.headerText}>Productos</Text>

<TouchableOpacity
onPress={() => navigation.navigate('Cart')}
style={styles.cartContainer}
>
<Ionicons name="cart" size={24} color="#fff"/>

{cart.length > 0 && (
<View style={styles.cartBadge}>
<Text style={styles.cartBadgeText}>{cart.length}</Text>
</View>
)}

</TouchableOpacity>

</View>

<Text style={styles.title}>Catálogo de Productos</Text>

<Text style={styles.subtitle}>
Explora nuestra selección de repuestos y accesorios automotrices de alta calidad diseñados
para mantener tu vehículo funcionando en perfectas condiciones.
</Text>

{products.map((product) => (

<View key={product.id} style={styles.productCard}>

<View style={styles.productTop}>

<View style={styles.iconContainer}>
<Image
source={product.icon}
style={styles.productIcon}
/>
</View>

<View style={styles.productInfo}>
<Text style={styles.productTitle}>{product.title}</Text>
<Text style={styles.productPrice}>{product.price}</Text>
</View>

</View>

<Text style={styles.description}>{product.description}</Text>

<TouchableOpacity
style={styles.cartBtn}
onPress={() => handleAddToCart(product)}
>

<Ionicons name="cart-outline" size={20} color="#fff"/>
<Text style={styles.cartBtnText}>Agregar al carrito</Text>

</TouchableOpacity>

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

cartContainer:{
position:'relative',
backgroundColor:'#1e293b',
padding:10,
borderRadius:10
},

cartBadge:{
position:'absolute',
top:-6,
right:-6,
backgroundColor:'#ff3b30',
width:18,
height:18,
borderRadius:9,
alignItems:'center',
justifyContent:'center'
},

cartBadgeText:{
color:'#fff',
fontSize:11,
fontWeight:'bold'
},

title:{
fontSize:28,
fontWeight:'bold',
color:'#fff',
marginBottom:8
},

subtitle:{
color:'#cbd5f5',
marginBottom:25,
lineHeight:20
},

productCard:{
backgroundColor:'#1e293b',
padding:18,
borderRadius:16,
marginBottom:20,
elevation:6
},

productTop:{
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

productIcon:{
width:30,
height:30,
resizeMode:'contain'
},

productInfo:{
flex:1
},

productTitle:{
fontSize:18,
fontWeight:'bold',
color:'#fff'
},

productPrice:{
color:'#ff3b30',
fontWeight:'bold',
marginTop:4
},

description:{
color:'#cbd5f5',
marginBottom:15,
lineHeight:20
},

cartBtn:{
backgroundColor:'#ff3b30',
padding:12,
borderRadius:12,
flexDirection:'row',
alignItems:'center',
justifyContent:'center'
},

cartBtnText:{
color:'#fff',
fontWeight:'bold',
marginLeft:8
}

});