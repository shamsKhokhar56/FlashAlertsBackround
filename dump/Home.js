import React, { useContext, useState, useEffect, useRef } from 'react'
import { Alert, AppState, DeviceEventEmitter, Dimensions, Image, NativeModules, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { EventRegister } from 'react-native-event-listeners'
import LinearGradient from 'react-native-linear-gradient';
import Torch from 'react-native-torch';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScreenBrightness from 'react-native-screen-brightness';

const BatteryManager = NativeModules.BatteryManager;

import themeContext from '../config/themeContext'
import SettingsContext from './SettingsContext';

const { height, width } = Dimensions.get('window')

const HomeScreen = () => {
    const theme = useContext(themeContext)
    const { settingsContext, setSettingsContext } = useContext(SettingsContext)

    const [toggleTorch, setToggleTorch] = useState(settingsContext.automaticOn)
    const [toggleSos, setToggleSos] = useState(false)
    const [brightness, setBrightness] = useState(false)
    const [batteryLevel, setBatteryLevel] = useState(0)

    useEffect(() => {
        const appStateListener = AppState.addEventListener('change',
            nextAppState => {
                console.log(toggleTorch)
                setToggleTorch(toggleTorch ? settingsContext.flashlightStayOn : false)
            },
        );
        return () => {
            appStateListener?.remove()
        };
    }, [settingsContext.flashlightStayOn, toggleTorch]);

    const myInterval = useRef();

    useEffect(() => {
        BatteryManager.updateBatteryLevel((info) => {
            setBatteryLevel(info.level);
        });

        const e = DeviceEventEmitter.addListener('BatteryStatus', ({ level }) => {
            setBatteryLevel(level);
        });
        return () => { e.remove(); clearInterval(myInterval.current); }
    }, []);

    useEffect(() => {
        if (toggleSos) {
            myInterval.current = setInterval(() => {
                setToggleTorch(current => !current)
            }, 500);
        } else {
            clearInterval(myInterval.current);
            myInterval.current = null;
        }
    }, [toggleSos]);

    const handleBrightness = async () => {
        let hasPerm = await ScreenBrightness.hasPermission()
        if (!hasPerm) {
            ScreenBrightness.requestPermission()
            return
        }
        let check = !brightness
        let value = check ? 1 : 0
        ScreenBrightness.setBrightness(value)
        setBrightness(check)
    }

    const powerControl = () => {
        if (settingsContext.powerControl && batteryLevel <= 10) {
            Alert.alert('Your battery level is less than 10%')
            return
        }
        setToggleTorch(!toggleTorch)
    }

    const getIcon = () => {
        if (batteryLevel > 90 && batteryLevel <= 100)
            return 'battery'
        else if (batteryLevel > 60 && batteryLevel <= 90)
            return 'battery-3'
        else if (batteryLevel > 40 && batteryLevel <= 60)
            return 'battery-2'
        else if (batteryLevel > 15 && batteryLevel <= 40)
            return 'battery-1'
        else
            return 'battery-0'
    }

    // Torch.switchState(toggleTorch)

    return (
        <LinearGradient colors={theme.background} style={[styles.container, { backgroundColor: 'grey' }]} >
            <View style={styles.topContainer} >
                <View style={styles.buttonsContainer} >
                    <TouchableHighlight
                        underlayColor={'none'}
                        onPress={() => { setToggleTorch(false); setToggleSos((toggleSos) => !toggleSos) }}
                    >
                        <Image
                            resizeMode='cover'
                            source={toggleSos ? require('../assets/sosActive.png') : require('../assets/sosInactive.png')}
                            style={{ height: 63, width: 69 }}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        underlayColor={'none'}
                        onPress={() => handleBrightness()}
                    >
                        <Image
                            resizeMode='cover'
                            source={brightness ? require('../assets/brightnessActive.png') : require('../assets/brightnessInactive.png')}
                            style={{ height: 63, width: 69 }}
                        />
                    </TouchableHighlight>
                </View>
                <View style={styles.batteryView} >
                    <FontAwesome
                        name={getIcon()}
                        color={batteryLevel > 20 ? theme.primaryColor : 'red'}
                        size={24}
                    />
                    <Text style={{ color: theme.textGrey, fontStyle: 'italic', fontSize: width * 0.03 }} >
                        {batteryLevel} %
                    </Text>
                </View>
            </View>
            <View style={styles.bottomContainer} >
                <TouchableHighlight underlayColor={'none'} onPress={() => powerControl()}>
                    <Image style={{ justifyContent: 'center' }}
                        source={toggleTorch && !toggleSos
                            ? require('../assets/PowerActive.png')
                            : require('../assets/PowerInactive.png')}
                    />
                </TouchableHighlight>
            </View>
        </LinearGradient>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topContainer: {
        flex: 1,
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: width * 0.4,
        // backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    // topButtons: {
    //     height: width * 0.13,
    //     width: width * 0.13,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderRadius: 10,
    //     marginHorizontal: 20,
    //     elevation: 10,
    // },
    batteryView: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        flex: 1,
        width: width,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
})