import React, { useRef, useState, useEffect, useContext } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, AppState, Text, View, PermissionsAndroid } from 'react-native'

import { EventRegister } from 'react-native-event-listeners'
import LinearGradient from 'react-native-linear-gradient';
import SwitchComponent from '../components/SwitchComponent';
import CallDetectorManager from "react-native-call-detection";
import Torch from 'react-native-torch';
import BackgroundTimer from 'react-native-background-timer';

import themeContext from '../config/themeContext'
import SettingsContext from './SettingsContext';
import StorageHelper from './../Helpers/StorageHelper';
import BackgroundService from 'react-native-background-actions';


const { height, width } = Dimensions.get('window')

const Settings = () => {
    const theme = useContext(themeContext)
    const { settingsContext, setSettingsContext } = useContext(SettingsContext);
    // const [callDetector, setCallDetector] = useState(null);
    const appState = useRef(AppState.currentState);



    // const [toggleSos, setToggleSos] = useState(false)
    // const [incoming, setIncoming] = useState(false);
    // const [offhook, setOffhook] = useState(false);
    // const [disconnected, setDisconnected] = useState(false);
    // const [missed, setMissed] = useState(false);
    // const [appStateVisible, setAppStateVisible] = useState(appState.current);


    useEffect(() => {
        // askPermissions()
    }, [])

    // useEffect(() => {
    //     const subscription = AppState.addEventListener("change", nextAppState => {
    //         if (
    //             appState.current.match(/inactive|background/) &&
    //             nextAppState === "active"
    //         ) {
    //             console.log("App has come to the foreground!");
    //         }

    //         appState.current = nextAppState;
    //         setAppStateVisible(appState.current);
    //         console.log("AppState", appState.current);
    //     });

    //     return () => {
    //         subscription.remove();
    //     };
    // }, []);


    const askPermissions = async () => {
        try {
            const permissions = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
                ]);
            console.log('Permissions are: ', permissions);
        } catch (err) {
            console.warn(err);
        }
    };

    // const startListening = () => {

    //     console.log(`just STARTED listening calls\n\t feature is`);
    //     setCallDetector(
    //         new CallDetectorManager(
    //             (event, number) => {
    //                 console.log({ event })
    //                 if (event === 'Disconnected') {
    //                     setDisconnected(true);
    //                     setToggleSos(false)
    //                 } else if (event === 'Incoming') {
    //                     setIncoming(true);
    //                     setToggleSos(true)
    //                 } else if (event === 'Offhook') {
    //                     setOffhook(true);
    //                     setToggleSos(false)
    //                 } else if (event === 'Missed') {
    //                     setMissed(true);
    //                     setToggleSos(false)
    //                 }
    //             },
    //             true, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
    //             () => { }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
    //             {
    //                 title: 'Phone State Permission',
    //                 message:
    //                     'This app needs access to your phone state in order to react and/or to adapt to incoming calls.',
    //             },
    //         ))
    // };


    // if (incoming && missed) {
    //     console.log('------- Incoming Missed Call');
    //     setIncoming(false);
    //     setMissed(false);
    //     setToggleSos(false)
    // }

    // if (incoming && offhook & disconnected) {
    //     console.log('------- Incoming call Answered');
    //     setIncoming(false);
    //     setOffhook(false);
    //     setDisconnected(false);
    //     setToggleSos(false)
    // }

    // const stopListening = () => {
    //     console.log(`just STOPED listening calls\n\t feature is`);
    //     callDetector && callDetector?.dispose();
    // };



    const automaticOnChange = (value) => {
        let updateSettings = { ...settingsContext, automaticOn: value }
        setSettingsContext(updateSettings)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
    }

    const flashlightStayOnChange = (value) => {
        let updateSettings = { ...settingsContext, flashlightStayOn: value }
        setSettingsContext(updateSettings)
        EventRegister.emit("FlashLightStayOn", value)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
    }

    const incomingCallsOnChange = (value) => {
        let updateSettings = { ...settingsContext, incomingCalls: value }
        setSettingsContext(updateSettings)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
    }

    // useEffect(() => {
    //     if (!callDetector) {
    //         if (settingsContext['incomingCalls']) {
    //             startListening()
    //         } else if (!settingsContext['incomingCalls']) {
    //             stopListening()
    //         }
    //     }
    // }, [settingsContext['incomingCalls']])

    const incomingSmsOnChange = (value) => {
        let updateSettings = { ...settingsContext, incomingSms: value }
        setSettingsContext(updateSettings)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
    }

    const powerControlOnChange = (value) => {
        let updateSettings = { ...settingsContext, powerControl: value }
        setSettingsContext(updateSettings)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
    }

    const onThemeChange = (value) => {
        let updateSettings = { ...settingsContext, theme: value }
        setSettingsContext(updateSettings)
        EventRegister.emit("ChangeTheme", value)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
    }

    // useEffect(() => {
    //     console.log({ toggleSos })
    //     if (toggleSos) {
    //         let torch = false;
    //         const interval = BackgroundTimer.setInterval(() => {
    //             Torch.switchState(!torch)
    //             torch = !torch;
    //         }, 500);
    //         return (() => {
    //             Torch.switchState(false);
    //             BackgroundTimer.clearInterval(interval);
    //         })
    //     }
    // }, [toggleSos, incoming, offhook, disconnected]);

    // const bgJob = () => {
    //         if (settingsContext['incomingCalls']) {
    //             startListening()
    //         } else if (!settingsContext['incomingCalls']) {
    //             stopListening()
    //         }
    // }

    // useEffect(() => {
    //     console.log({appStateVisible})
    //     appStateVisible === 'background' && BackgroundService.start(bgJob())
    //     appStateVisible !== 'background' && BackgroundService.isRunning() && BackgroundService.stop()

    // }, [appStateVisible])

    return (
        <LinearGradient colors={theme.background} style={[styles.container, { backgroundColor: 'grey' }]} >
            <Text style={[styles.headingText, { color: theme.color }]} >Flash Alerts</Text>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.groupContainer} >
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/powerIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Automatic On</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Turn on flashlight automatically</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.automaticOn} onChange={automaticOnChange} />
                    </View>
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/flashStayOnIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Flashlight Stay On</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Stay on when screen is locked</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.flashlightStayOn} onChange={flashlightStayOnChange} />
                    </View>
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/incomingCallIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Incoming Call's</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Flash alerts on incoming call</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.incomingCalls} onChange={incomingCallsOnChange} />
                    </View>
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/incomingSMSIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Incoming SMS</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Flash alerts on incoming SMS</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.incomingSms} onChange={incomingSmsOnChange} />
                    </View>
                </View>
                <View style={styles.groupContainer} >
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/powerControlIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Power Control</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Low battery warning below 10%</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.powerControl} onChange={powerControlOnChange} />
                    </View>
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/themeIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Theme Change</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>
                                    {(theme.theme).charAt(0).toUpperCase() + (theme.theme.slice(1))} theme
                                </Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.theme} onChange={onThemeChange} />
                    </View>
                </View>
                <View style={styles.groupContainer} >
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/shareIcon.png')}
                                />
                            </View>
                            <Text style={[styles.text, { color: theme.color }]}>Share</Text>
                        </View>
                    </View>
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/aboutIcon.png')}
                                />
                            </View>
                            <Text style={[styles.text, { color: theme.color }]}>About</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headingText: {
        margin: 15,
        marginHorizontal: 20,
        alignSelf: 'flex-start',
        fontSize: width * 0.05,
        fontWeight: 'bold'
    },
    groupContainer: {
        backgroundColor: '#3E3D3D4A',
        padding: 5,
        width: width,
        marginVertical: 3
    },
    group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10
    },
    rightGroup: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconContainer: {
        height: width * 0.1,
        width: width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 10
    },
})