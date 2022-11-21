import React, { useContext, useState, useEffect, useRef } from 'react'
import { Alert, AppState, DeviceEventEmitter, Dimensions, Image, NativeModules, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { EventRegister } from 'react-native-event-listeners'
import LinearGradient from 'react-native-linear-gradient';
import Torch from 'react-native-torch';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ScreenBrightness from 'react-native-screen-brightness';
import CallDetectorManager from "react-native-call-detection";
import BackgroundTimer from 'react-native-background-timer';

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

    const [callDetector, setCallDetector] = useState(null);

    const [incoming, setIncoming] = useState(false);
    const [offhook, setOffhook] = useState(false);
    const [disconnected, setDisconnected] = useState(false);
    const [missed, setMissed] = useState(false);

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

    const startListening = () => {
        console.log(`just STARTED listening calls\n\t feature is`);
        setCallDetector(
            new CallDetectorManager(
                (event, number) => {
                    console.log({ event })
                    if (event === 'Disconnected') {
                        setDisconnected(true);
                        setToggleSos(false)
                    } else if (event === 'Incoming') {
                        setIncoming(true);
                        setToggleSos(true)
                    } else if (event === 'Offhook') {
                        setOffhook(true);
                        setToggleSos(false)
                    } else if (event === 'Missed') {
                        setMissed(true);
                        setToggleSos(false)
                    }
                },
                true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
                () => { }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
                {
                    title: 'Phone State Permission',
                    message:
                        'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
                },
            ))
    };

    if (incoming && missed) {
        console.log('------- Incoming Missed Call');
        setIncoming(false);
        setMissed(false);
        setToggleSos(false)
    }

    if (incoming && offhook & disconnected) {
        console.log('------- Incoming call Answered');
        setIncoming(false);
        setOffhook(false);
        setDisconnected(false);
        setToggleSos(false)
    }

    const stopListening = () => {
        console.log(`just STOPED listening calls\n\t feature is`);
        callDetector && callDetector?.dispose();
    };



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
        if (!callDetector) {
            if (settingsContext['incomingCalls']) {
                console.log('here')
                startListening()
            } else if (!settingsContext['incomingCalls']) {
                console.log('here1')
                stopListening()
            }
        }
    }, [settingsContext['incomingCalls']])


    useEffect(() => {
        console.log({ toggleSos })
        if (toggleSos) {
            let torch = false;
            const interval = BackgroundTimer.setInterval(() => {
                Torch.switchState(!torch)
                torch = !torch;
            }, 500);
            return (() => {
                Torch.switchState(false);
                BackgroundTimer.clearInterval(interval);
            })
        }
    }, [toggleSos, incoming, offhook, disconnected]);


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

    Torch.switchState(toggleTorch)

    return (
        <LinearGradient colors={theme.background} style={[styles.container, { backgroundColor: 'grey' }]} >
            <View style={styles.topContainer} >
                <View style={styles.buttonsContainer} >
                    <TouchableHighlight
                        onPress={() => { setToggleTorch(false); setToggleSos((toggleSos) => !toggleSos) }}
                        style={[styles.topButtons, { elevation: toggleSos ? 10 : 0 }]}
                    >
                        <Image
                            source={require('../assets/sos.png')}
                            style={toggleSos && { tintColor: theme.primaryColor, }}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => handleBrightness()}
                        style={[styles.topButtons, { elevation: brightness ? 10 : 0  }]}
                    >
                        <Image
                            source={require('../assets/brightness.png')}
                            style={brightness && { tintColor: 'orange' }}
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
                <TouchableHighlight onPress={() => powerControl()} style={styles.powerOuter} >
                    <LinearGradient
                        colors={toggleTorch && !toggleSos ? theme.primaryGradient : theme.falseGradient}
                        style={styles.powerMiddle}
                    >
                        <View style={styles.powerInner} >
                            <FontAwesome
                                name='power-off'
                                size={width * 0.1}
                                color={toggleTorch && !toggleSos ? theme.primaryColor : theme.falseColor}
                            />
                        </View>
                    </LinearGradient>
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
        padding: 5,
    },
    topButtons: {
        height: width * 0.13,
        width: width * 0.13,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 20,
        elevation: 10,
        backgroundColor: '#242424'
    },
    bottomContainer: {
        flex: 1,
        width: width,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    batteryView: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    powerOuter: {
        height: width * 0.32,
        width: width * 0.32,
        backgroundColor: 'black',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10
    },
    powerMiddle: {
        height: width * 0.25,
        width: width * 0.25,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 15
    },
    powerInner: {
        height: width * 0.2,
        width: width * 0.2,
        backgroundColor: 'black',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 20
    },
})