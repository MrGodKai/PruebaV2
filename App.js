import GroupChatScreen from './screens/GroupChatScreen';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminScreen from './screens/AdminScreen';
import MechanicScreen from './screens/MechanicScreen';
import UserScreen from './screens/UserScreen';
import ChatScreen from './screens/ChatScreen';
import OnlineUsersScreen from './screens/OnlineUsersScreen';
import GroupsScreen from './screens/GroupsScreen';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import ProductScreen from './screens/ProductScreen';
import ServiceScreen from './screens/ServiceScreen';
import ContactScreen from './screens/ContactScreen';
import AppointmentScreen from './screens/AppointmentScreen';

const Stack = createStackNavigator();

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role && !showRegister ? (
          <Stack.Screen name="Login">
            {props => (
              <LoginScreen
                {...props}
                setRole={role => {
                  setRole(role);
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
                if (role === 'admin') return <AdminScreen {...props} setRole={setRole} goToOnline={() => props.navigation.navigate('OnlineUsers')} />;
                if (role === 'mechanic') return <MechanicScreen {...props} setRole={setRole} goToOnline={() => props.navigation.navigate('OnlineUsers')} />;
                return <HomeScreen {...props} navigation={props.navigation} />;
              }}
            </Stack.Screen>
            <Stack.Screen name="Groups">
              {props => (
                <GroupsScreen
                  {...props}
                  currentUser={currentUsername}
                  goToGroupChat={(groupId, groupName) => props.navigation.navigate('GroupChat', { groupId, groupName })}
                  goBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="GroupChat">
              {props => (
                <GroupChatScreen
                  {...props}
                  route={{...props.route, params: { ...props.route.params, currentUser: currentUsername }}}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="OnlineUsers">
              {props => (
                <OnlineUsersScreen
                  {...props}
                  currentUser={currentUsername}
                  goToChat={otherUser => props.navigation.navigate('Chat', { otherUser })}
                  goBack={() => props.navigation.goBack()}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Chat">
              {props => {
                const otherUser = props.route.params?.otherUser || '';
                return <ChatScreen {...props} user={currentUsername} mechanic={otherUser} goBack={() => props.navigation.goBack()} />;
              }}
            </Stack.Screen>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Products" component={ProductScreen} />
            <Stack.Screen name="Services" component={ServiceScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="Appointment">
              {props => <AppointmentScreen {...props} currentUsername={currentUsername} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
