import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, PanResponder, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminScreen from './screens/AdminScreen';
import MechanicScreen from './screens/MechanicScreen';
import UserScreen from './screens/UserScreen';
import ChatScreen from './screens/ChatScreen';
import OnlineUsersScreen from './screens/OnlineUsersScreen';
import GroupsScreen from './screens/GroupsScreen';
import GroupChatScreen from './screens/GroupChatScreen';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import ProductsScreen from './screens/ProductsScreen';
import CartScreen from './screens/CartScreen';
import ServicesScreen from './screens/ServicesScreen';
import ContactScreen from './screens/ContactScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import AccountScreen from './screens/AccountScreen';
import MechanicAppointmentsScreen from './screens/MechanicAppointmentsScreen';
import { CartProvider } from './CartContext';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ALLOWED_ROLES = ['admin', 'mechanic', 'user'];

function UserTabs({ currentUsername, currentRole, rootNavigation, onLogout }) {
  const [fabVisible, setFabVisible] = useState(false);
  const [tabMenuVisible, setTabMenuVisible] = useState(false);
  
  // Draggable FAB - solo movimiento vertical
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#007bff',
          tabBarInactiveTintColor: '#666',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 3
          },
          tabBarItemStyle: {
            paddingHorizontal: 2
          },
          tabBarStyle: {
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 14,
            height: 66,
            paddingBottom: 6,
            paddingTop: 6,
            borderRadius: 14,
            display: tabMenuVisible ? 'flex' : 'none'
          },
          tabBarIcon: ({ color, size }) => {
            let iconName = 'ellipse';

            if (route.name === 'Home') iconName = 'home';
            if (route.name === 'About') iconName = 'information-circle';
            if (route.name === 'Products') iconName = 'cart';
            if (route.name === 'Services') iconName = 'build';
            if (route.name === 'Appointment') iconName = 'calendar';
            if (route.name === 'Contact') iconName = 'call';
            if (route.name === 'Account') iconName = 'person-circle';

            return <Ionicons name={iconName} size={22} color={color} />;
          }
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
        <Tab.Screen name="Products" component={ProductsScreen} options={{ tabBarLabel: 'Productos' }} />
        <Tab.Screen name="Services" component={ServicesScreen} options={{ tabBarLabel: 'Servicios' }} />
        <Tab.Screen name="Appointment" options={{ tabBarLabel: 'Citas' }}>
          {props => <AppointmentScreen {...props} currentUsername={currentUsername} />}
        </Tab.Screen>
        <Tab.Screen name="Contact" component={ContactScreen} options={{ tabBarLabel: 'Contacto' }} />
        <Tab.Screen name="Account" options={{ tabBarLabel: 'Cuenta' }}>
          {props => (
            <AccountScreen
              {...props}
              currentUsername={currentUsername}
              currentRole={currentRole}
              onLogout={onLogout}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="About" component={AboutScreen} options={{ tabBarLabel: 'Historia' }} />
      </Tab.Navigator>

      <TouchableOpacity
        onPress={() => setTabMenuVisible(prev => !prev)}
        style={{
          position: 'absolute',
          right: 14,
          bottom: tabMenuVisible ? 90 : 18,
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e293b',
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <Ionicons name={tabMenuVisible ? 'chevron-down' : 'grid'} size={20} color="#fff" />
      </TouchableOpacity>

      {fabVisible ? (
        <Animated.View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 80,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#2a9d8f',
            borderTopLeftRadius: 14,
            borderBottomLeftRadius: 14,
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 5,
            shadowOffset: { width: 0, height: 2 },
            transform: [{ translateY: pan.y }],
          }}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            onPress={() => rootNavigation.navigate('Groups')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingLeft: 12,
              paddingRight: 8,
            }}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13, marginLeft: 7 }}>
              Seguimiento
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFabVisible(false)}
            style={{
              paddingVertical: 12,
              paddingLeft: 4,
              paddingRight: 10,
            }}
          >
            <Ionicons name="close" size={16} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 80,
            transform: [{ translateY: pan.y }],
          }}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            onPress={() => setFabVisible(true)}
            style={{
              position: 'relative',
              backgroundColor: '#2a9d8f',
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
              paddingVertical: 10,
              paddingLeft: 10,
              paddingRight: 8,
              elevation: 8,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 }
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

export default function App() {
  const [role, setRole] = useState(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [users, setUsers] = useState([
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'mecanico', password: 'mecanico', role: 'mechanic' },
    { username: 'usuario', password: 'usuario', role: 'user' }
  ]);

  return (
    <CartProvider>
      <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role && !showRegister ? (
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                setRole={nextRole => {
                  setRole(ALLOWED_ROLES.includes(nextRole) ? nextRole : null);
                }}
                goToRegister={() => setShowRegister(true)}
                users={users}
                goBack={null}
                setCurrentUsername={setCurrentUsername}
              />
            )}
          </Stack.Screen>
        ) : !role && showRegister ? (
          <Stack.Screen name="Register">
            {props => (
              <RegisterScreen
                {...props}
                onRegister={async user => {
                  setUsers([...users, user]);
                  // Guardar usuario en Firebase
                  try {
                    const { db } = require('./firebaseConfig');
                    const { ref, set } = require('firebase/database');
                    await set(ref(db, `registeredUsers/${user.username}`), user);
                  } catch (e) {
                    console.log('Error guardando usuario en Firebase:', e);
                  }
                  setShowRegister(false);
                }}
                goBack={() => setShowRegister(false)}
              />
            )}
          </Stack.Screen>
        ) : ( // Para cualquier rol (admin, mechanic, user)
          <>
            <Stack.Screen name="Main">
              {props => {
                // Pantalla principal según rol
                if (role === 'admin') return <AdminScreen {...props} setRole={setRole} currentRole={role} goToOnline={() => props.navigation.navigate('OnlineUsers')} />;
                if (role === 'mechanic') {
                  return (
                    <MechanicScreen
                      {...props}
                      setRole={setRole}
                      goToGroups={() => props.navigation.navigate('Groups')}
                      goToAppointments={() => props.navigation.navigate('MechanicAppointments')}
                    />
                  );
                }
                return (
                  <UserTabs
                    currentUsername={currentUsername}
                    currentRole={role}
                    rootNavigation={props.navigation}
                    onLogout={() => {
                      setRole(null);
                      setCurrentUsername('');
                    }}
                  />
                );
              }}
            </Stack.Screen>
            <Stack.Screen name="Groups">
              {props => (
                <GroupsScreen
                  {...props}
                  currentUser={currentUsername}
                  currentRole={role}
                  goToGroupChat={(groupId, groupName) => props.navigation.navigate('GroupChat', { groupId, groupName })}
                  goBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="GroupChat">
              {props => (
                <GroupChatScreen
                  {...props}
                  route={{...props.route, params: { ...props.route.params, currentUser: currentUsername, currentRole: role }}}
                />
              )}
            </Stack.Screen>
            {role === 'admin' ? (
              <Stack.Screen name="OnlineUsers">
                {props => (
                  <OnlineUsersScreen
                    {...props}
                    currentUser={currentUsername}
                    currentRole={role}
                    goBack={() => props.navigation.goBack()}
                  />
                )}
              </Stack.Screen>
            ) : null}
            {role === 'mechanic' ? (
              <Stack.Screen name="MechanicAppointments">
                {props => (
                  <MechanicAppointmentsScreen
                    {...props}
                    currentUsername={currentUsername}
                    goBack={() => props.navigation.goBack()}
                  />
                )}
              </Stack.Screen>
            ) : null}
            <Stack.Screen name="Chat">
              {props => {
                const otherUser = props.route.params?.otherUser || '';
                return <ChatScreen {...props} user={currentUsername} mechanic={otherUser} goBack={() => props.navigation.goBack()} />;
              }}
            </Stack.Screen>
            <Stack.Screen name="Cart">
              {props => <CartScreen {...props} currentUsername={currentUsername} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  );
}
