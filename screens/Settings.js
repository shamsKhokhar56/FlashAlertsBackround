import React, { useRef, useState, useEffect, useContext } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, AppState, Text, View, PermissionsAndroid, ToastAndroid, Alert } from 'react-native'

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

    const askPermissions = async () => {
        try {
            const permissions = await PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
                    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
                ]);
            if (permissions['android.permission.READ_CALL_LOG'] === 'granted' && permissions['android.permission.READ_PHONE_STATE'] === 'granted') {
                return true
            }
            else {
                Alert.alert('Permission denied!')
                return false
            }
        } catch (err) {
            console.warn(err);
        }
    };

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

    const incomingCallsOnChange = async (value) => {
        if (value) {
            askPermissions().then(checkStatus => {
                if (checkStatus) {
                    let updateSettings = { ...settingsContext, incomingCalls: value }
                    setSettingsContext(updateSettings)
                    StorageHelper.save('Settings', JSON.stringify(updateSettings))

                }
            })
        } else {
            let updateSettings = { ...settingsContext, incomingCalls: value }
            setSettingsContext(updateSettings)
            StorageHelper.save('Settings', JSON.stringify(updateSettings))
            ToastAndroid.show('Close Flash Alerts to reset service.', 500)
        }
    }

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