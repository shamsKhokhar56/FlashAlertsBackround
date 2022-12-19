import React, { useContext, useState, useEffect } from 'react'
import { Alert, AppState, DeviceEventEmitter, Dimensions, Image, NativeModules, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableOpacityBase, View } from 'react-native'

import LinearGradient from 'react-native-linear-gradient';
import Torch from 'react-native-torch';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenBrightness from 'react-native-screen-brightness';
// import CallDetectorManager from "react-native-call-detection";
import BackgroundTimer from 'react-native-background-timer';
// import VIForegroundService from '@voximplant/react-native-foreground-service';
// import SmsListener from 'react-native-android-sms-listener'
// import SmsRetriever from 'react-native-sms-retriever';
import Modal from 'react-native-modal'

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
    const [modal, setModal] = useState(false)
    const [sosModal, setSosModal] = useState(false)

    // const [callDetector, setCallDetector] = useState(null);

    // const [incoming, setIncoming] = useState(false);
    // const [offhook, setOffhook] = useState(false);
    // const [disconnected, setDisconnected] = useState(false);
    // const [missed, setMissed] = useState(false);

    const [isClosed, setIsClosed] = useState(false)
    // const [instance, setInstance] = useState(null)
    const [firstTime, setFirstTime] = useState(true)

    const [appStateVisible, setAppStateVisible] = useState();

    useEffect(() => {
        const appStateListener = AppState.addEventListener('change',
            nextAppState => {
                console.log('checking', toggleTorch)
                if (firstTime) {
                    setFirstTime(false)
                    return
                }
                else {
                    let t = toggleTorch ? settingsContext.flashlightStayOn : false
                    setToggleTorch(t)
                    Torch.switchState(t)
                }
            },
        );
        return () => {
            appStateListener?.remove()
        };
    }, [settingsContext.flashlightStayOn, toggleTorch, firstTime]);

    useEffect(() => {
        if (settingsContext.automaticOn) {
            Torch.switchState(true)
        }
    }, []);

    const startListening = () => {
        // console.log(`just STARTED listening calls\n\t feature is`);
        // let newInterval
        // setCallDetector(settingsContext.incomingCalls ?
        //     new CallDetectorManager(
        //         (event, number) => {
        //             console.log('event', { event })
        //             if (event === 'Disconnected') {
        //                 Torch.switchState(false)
        //                 BackgroundTimer.clearInterval(newInterval)
        //                 newInterval = null;
        //                 setDisconnected(true);
        //             } else if (event === 'Incoming') {
        //                 let torch = false
        //                 newInterval = BackgroundTimer.setInterval(() => {
        //                     Torch.switchState(!torch)
        //                     torch = !torch
        //                 }, 500);
        //                 setIncoming(true);
        //             } else if (event === 'Offhook') {
        //                 Torch.switchState(false)
        //                 BackgroundTimer.clearInterval(newInterval)
        //                 newInterval = null;
        //                 setOffhook(true);
        //             } else if (event === 'Missed') {
        //                 Torch.switchState(false)
        //                 BackgroundTimer.clearInterval(newInterval)
        //                 newInterval = null;
        //                 setMissed(true);
        //             }
        //         },
        //         false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
        //         () => { console.error() }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
        //         {
        //             title: 'Phone State Permission',
        //             message:
        //                 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
        //         },
        //     ) : null)
    };

    // if (incoming && missed) {
    //     console.log('------- Incoming Missed Call');
    //     setIncoming(false);
    //     setMissed(false);
    // }

    // if (incoming && offhook & disconnected) {
    //     console.log('------- Incoming call Answered');
    //     setIncoming(false);
    //     setOffhook(false);
    //     setDisconnected(false);
    // }

    // const stopListening = async () => {
    //     console.log(`just STOPED listening calls\n\t feature is`);
    //     await VIForegroundService.getInstance().stopService('12345')
    //     callDetector && callDetector?.dispose();
    //     setCallDetector(null)
    // };

    useEffect(() => {
        BatteryManager.updateBatteryLevel((info) => {
            setBatteryLevel(info.level);
        });

        const e = DeviceEventEmitter.addListener('BatteryStatus', ({ level }) => {
            setBatteryLevel(level);
        });
        return () => { e.remove() }
    }, []);

    // useEffect(() => {
    //     console.log(callDetector)
    //     if (!callDetector) {
    //         if (settingsContext['incomingCalls']) {
    //             startListening()
    //         } else if (!settingsContext['incomingCalls']) {
    //             stopListening()
    //         }
    //     }
    //     else {
    //         stopListening()
    //     }
    // }, [settingsContext['incomingCalls']])

    // useEffect(() => {
    //     let msgListener = DeviceEventEmitter.addListener('sms_onDelivery', (msg) => {
    //         console.log(msg);
    //     });

    //     return () => {
    //         msgListener.remove()
    //     }
    // }, [])

    // const jobRunner = async () => {
    //     const channelConfig = {
    //         id: '12345',
    //         name: 'flash name',
    //         description: 'Channel description',
    //         enableVibration: false,
    //     };
    //     let instanceDump = instance ? instance : await VIForegroundService.getInstance()

    //     instanceDump.createNotificationChannel(channelConfig);

    //     const notificationConfig = {
    //         channelId: '12345',
    //         id: 3456,
    //         title: 'Title',
    //         text: 'Some text',
    //         icon: 'ic_icon',
    //         button: 'Some text',
    //     };
    //     console.log(instanceDump && true)
    //     try {
    //         if (isClosed && instanceDump != null) {
    //             instanceDump.startService(notificationConfig)
    //         }
    //         else if (instance != null && !isClosed) {
    //             instanceDump.stopService('12345')
    //             setInstance(null)
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    //     if (!instance && instanceDump) {
    //         // instanceDump = JSON.parse(JSON.stringify(instanceDump))
    //         setInstance(instanceDump)
    //     }
    // }

    // useEffect(() => {
    //     if (appStateVisible === 'background' && (settingsContext.incomingCalls || settingsContext.incomingSms)) {
    //         setIsClosed(true)
    //         jobRunner()
    //     }
    //     else {
    //         setCallDetector(null)
    //         setIsClosed(false)
    //     }
    // }, [appStateVisible, isClosed])


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

    const powerControl = (value) => {
        if (toggleSos) {
            return
        }
        if (value === 'check') {
            if (!toggleTorch && settingsContext.powerControl && batteryLevel <= parseInt(settingsContext.powerControlPercentage * 100)) {
                setModal(true)
                // Alert.alert(`Your battery level is less than ${parseInt(settingsContext.powerControlPercentage * 100)}%`)
                return
            }
        }
        setModal(false)
        setToggleTorch(!toggleTorch)
        Torch.switchState(!toggleTorch)
    }

    const sosHandler = (value) => {
        if (value === 'check') {
            if (!toggleSos && settingsContext.powerControl && batteryLevel <= parseInt(settingsContext.powerControlPercentage * 100)) {
                console.log('here')
                setSosModal(true)
                return
            }
        }
        setSosModal(false)
        setToggleTorch(false);
        setToggleSos((toggleSos) => !toggleSos)
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

    useEffect(() => {
        if (toggleSos) {
            let torch = false;
            const interval = BackgroundTimer.setInterval(() => {
                console.log('here ?')
                Torch.switchState(!torch)
                torch = !torch;
            }, 500);
            return (() => {
                Torch.switchState(false);
                BackgroundTimer.clearInterval(interval);
            })
        }
    }, [toggleSos]);

    // Torch.switchState(toggleTorch)

    return (
        <LinearGradient colors={theme.background} style={[styles.container, { backgroundColor: 'grey' }]} >
            {brightness &&
                <View style={styles.brightnessScreen} >
                    <Ionicons style={{ padding: 20 }} onPress={() => handleBrightness()} name='close' size={28} color='grey' />
                </View>
            }
            <View style={styles.innerContainer} >
                <View style={styles.topContainer} >
                    <View style={styles.buttonsContainer} >
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => sosHandler('check')}
                        >
                            {toggleSos ? (
                                <Image
                                    resizeMode='cover'
                                    style={{ height: width * 0.18, width: width * 0.18 }}
                                    source={theme.theme === 'light' ? require('../assets/sosLightEnable.png') : require('../assets/sosDarkEnable.png')}
                                />
                            ) : (
                                <Image
                                    resizeMode='cover'
                                    style={{ height: width * 0.18, width: width * 0.18 }}
                                    source={theme.theme === 'light' ? require('../assets/sosLightDisable.png') : require('../assets/sosDarkDisable.png')}
                                />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => handleBrightness()}
                        >
                            {brightness ? (
                                <Image
                                    resizeMode='cover'
                                    style={{ height: width * 0.18, width: width * 0.18, }}
                                    source={theme.theme === 'light' ? require('../assets/brightnessLightEnable.png') : require('../assets/brightnessDarkEnable.png')}
                                />
                            ) : (
                                <Image
                                    resizeMode='cover'
                                    style={{ height: width * 0.18, width: width * 0.18 }}
                                    source={theme.theme === 'light' ? require('../assets/brightnessLightDisable.png') : require('../assets/brightnessDarkDisable.png')}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.batteryView} >
                    <FontAwesome
                        name={getIcon()}
                        color={batteryLevel > 20 ? theme.batteryColor : 'red'}
                        size={width * 0.08}
                    />
                    <Text style={{ color: theme.textGrey, fontStyle: 'italic', fontSize: width * 0.05 }} >
                        {batteryLevel} %
                    </Text>
                </View>
                <View style={styles.bottomContainer} >
                    <TouchableHighlight underlayColor={'none'} onPress={() => powerControl('check')}>
                        {(toggleTorch && !toggleSos) ? (
                            <Image
                                resizeMode='contain'
                                style={{ height: width * 0.6, width: width * 0.6 }}
                                source={theme.theme === 'light' ? require('../assets/powerLightEnable.png') : require('../assets/powerDarkEnable.png')}
                            />
                        ) : (
                            <Image
                                resizeMode='contain'
                                style={{ height: width * 0.6, width: width * 0.6 }}
                                source={theme.theme === 'light' ? require('../assets/powerLightDisable.png') : require('../assets/powerDarkDisable.png')}
                            />
                        )}
                    </TouchableHighlight>
                </View>
            </View>
            {modal && (
                <Modal isVisible={true} onBackdropPress={() => setModal(false)} >
                    <View style={styles.modalContainer} >
                        <Text style={{ fontSize: width * 0.04 }} >
                            Your battery level is less than {parseInt(settingsContext.powerControlPercentage * 100)}%.
                            Would you like to turn on or stay off.
                        </Text>
                        <View style={styles.modalButtons} >
                            <Text onPress={() => setModal(false)} style={{ color: 'black', fontSize: width * 0.04 }} >Stay off</Text>
                            <Text onPress={() => powerControl('pass')} style={{ fontSize: width * 0.04, paddingHorizontal: 10, paddingLeft: 40, color: 'black' }} >Turn on</Text>
                        </View>
                    </View>
                </Modal>
            )}
            {sosModal && (
                <Modal isVisible={true} onBackdropPress={() => setSosModal(false)} >
                    <View style={styles.modalContainer} >
                        <Text style={{ fontSize: width * 0.04 }} >
                            Your battery level is less than {parseInt(settingsContext.powerControlPercentage * 100)}%.
                            Would you like to turn on or stay off.
                        </Text>
                        <View style={styles.modalButtons} >
                            <Text onPress={() => setSosModal(false)} style={{ color: 'black', fontSize: width * 0.04 }} >Stay off</Text>
                            <Text onPress={() => sosHandler('pass')} style={{ fontSize: width * 0.04, paddingHorizontal: 10, paddingLeft: 40, color: 'black' }} >Turn on</Text>
                        </View>
                    </View>
                </Modal>
            )}
        </LinearGradient>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    brightnessScreen: {
        backgroundColor: 'white',
        height: height,
        width: width,
        alignItems: 'flex-end',
    },
    innerContainer: {
        height: height * 0.75,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: width,
        // backgroundColor: 'orange'
    },
    topContainer: {
        width: width * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    batteryView: {
        padding: 20,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue'
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: width * 0.6,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 5,
    },
    topButtons: {
        height: width * 0.16,
        width: width * 0.16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 20,
        elevation: 10,
        backgroundColor: '#242424'
    },
    bottomContainer: {
        width: width,
        // backgroundColor: 'yellow',
        alignItems: 'center'
    },
    modalContainer: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: 'white'
    },
    modalButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    buttonsText: {

    },
})