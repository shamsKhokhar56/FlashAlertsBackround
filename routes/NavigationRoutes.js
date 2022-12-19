import React, { useContext } from 'react'
import { Dimensions, Image, StyleSheet } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Entypo from 'react-native-vector-icons/Entypo'

import HomeScreen from './../screens/HomeScreen';
import Settings from './../screens/Settings';
import themeContext from '../config/themeContext';
import Styles from '../constants/Styles';
import { CallDetection } from '../components/CallAlerts';

const { height, width } = Dimensions.get('window')

const Tab = createBottomTabNavigator()

const NavigationRoutes = () => {
    const theme = useContext(themeContext)

    return (
        <Tab.Navigator initialRouteName='HomeScreen'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Flash') {
                        iconName = focused ? require(`../assets/TabBarActiveTorchIcon.png`)  : require(`../assets/TabBarInactiveTorchIcon.png`) 
                    } 
                    else if (route.name === 'Settings') {
                        iconName = focused ? require(`../assets/TabBarActiveSettingsIcon.png`)  : require(`../assets/TabBarInactiveSettingsIcon.png`)
                    }
                    // return <Entypo name={iconName} size={size} color={color}
                    //     style={focused ? [Styles.shadow, { textShadowColor: theme.shadowColor }] : {}}
                    // />;
                    return <Image source={iconName} style={{ tintColor: !focused && color }} />
                },
                tabBarActiveTintColor: theme.primaryColor,
            })
            }
        >
            <Tab.Screen name='Flash' component={HomeScreen} />
            <Tab.Screen name='Settings' component={Settings} />
        </Tab.Navigator >
    )
}

export default NavigationRoutes