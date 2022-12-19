import React, { useRef, useState, useEffect, useContext } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, AppState, Text, View, PermissionsAndroid, ToastAndroid, Alert, TouchableOpacity, Linking } from 'react-native'

import { EventRegister } from 'react-native-event-listeners'
import LinearGradient from 'react-native-linear-gradient';
import SwitchComponent from '../components/SwitchComponent';
// import CallDetectorManager from "react-native-call-detection";
// import Torch from 'react-native-torch';
// import BackgroundTimer from 'react-native-background-timer';
import Modal from 'react-native-modal';
import Slider from 'react-native-slider';

import themeContext from '../config/themeContext'
import SettingsContext from './SettingsContext';
import StorageHelper from './../Helpers/StorageHelper';
// import BackgroundService from 'react-native-background-actions';


const { height, width } = Dimensions.get('window')

const Settings = () => {
    const theme = useContext(themeContext)
    const { settingsContext, setSettingsContext } = useContext(SettingsContext);
    // const [callDetector, setCallDetector] = useState(null);
    const appState = useRef(AppState.currentState);
    const [powerModal, setPowerModal] = useState(false)
    const [sliderValue, setSliderValue] = useState(settingsContext.powerControlPercentage)



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
            console.error(err);
        }
    };

    const askSmsPermission = async () => {
        try {
            let permissions = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS)
            console.log(permissions)
            if (permissions === 'granted') {
                return true
            }
            else {
                Alert.alert('Permission denied!')
                return false
            }
        } catch (e) {
            console.error(e)
        }
    }

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
                else { return }
            })
        } else {
            let updateSettings = { ...settingsContext, incomingCalls: value }
            setSettingsContext(updateSettings)
            StorageHelper.save('Settings', JSON.stringify(updateSettings))
        }
        ToastAndroid.show('Please close Flash Alerts to apply settings', 500)
    }

    const incomingSmsOnChange = (value) => {
        if (value) {
            askSmsPermission().then(checkStatus => {
                if (checkStatus) {
                    let updateSettings = { ...settingsContext, incomingSms: value }
                    setSettingsContext(updateSettings)
                    StorageHelper.save('Settings', JSON.stringify(updateSettings))
                }
                else { return }
            })
        } else {
            let updateSettings = { ...settingsContext, incomingSms: value }
            setSettingsContext(updateSettings)
            StorageHelper.save('Settings', JSON.stringify(updateSettings))
        }
    }

    const powerControlOnChange = (value) => {
        let updateSettings = { ...settingsContext, powerControl: value }
        setSettingsContext(updateSettings)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
    }

    const onThemeChange = (value) => {
        let updateSettings = { ...settingsContext, theme: value }
        setSettingsContext(updateSettings)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
        EventRegister.emit("ChangeTheme", value)
    }

    const powerControlPercentageOnChange = () => {
        let value = (parseInt(sliderValue * 100) / 100)
        let updateSettings = { ...settingsContext, powerControlPercentage: value }
        setSettingsContext(updateSettings)
        StorageHelper.save('Settings', JSON.stringify(updateSettings))
        setPowerModal(false)
    }

    return (
        <LinearGradient colors={theme.background} style={[styles.container, { backgroundColor: 'grey' }]} >
            <Text style={[styles.headingText, { color: theme.color }]} >Flash Alerts</Text>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={[styles.groupContainer, { backgroundColor: theme.groupContainer }]} >
                    <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/powerLightIcon.png')}
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
                                    source={require('../assets/torchLightIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Flashlight Stay On</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Stay on when screen is locked</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.flashlightStayOn} onChange={flashlightStayOnChange} />
                    </View>
                    {/* <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/callLightIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Incoming Call's</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Flash alerts on incoming call</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.incomingCalls} onChange={incomingCallsOnChange} />
                    </View> */}
                    {/* <View style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/smsLightIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Incoming SMS</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Flash alerts on incoming SMS</Text>
                            </View>
                        </View>
                        <SwitchComponent value={settingsContext.incomingSms} onChange={incomingSmsOnChange} />
                    </View> */}
                </View>
                <View style={[styles.groupContainer, { backgroundColor: theme.groupContainer }]} >
                    <TouchableOpacity activeOpacity={1} onPress={() => setPowerModal(true)} style={styles.group} >
                        <View style={styles.rightGroup} >
                            <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                <Image
                                    source={require('../assets/batteryLightIcon.png')}
                                />
                            </View>
                            <View >
                                <Text style={[styles.text, { color: theme.color }]}>Power Control</Text>
                                <Text style={[styles.text, { color: theme.falseColor }]}>Low battery warning below {parseInt(settingsContext.powerControlPercentage * 100)}%</Text>
                            </View>
                        </View>
                        <Text style={{ paddingRight: 15, color: theme.color }}>{settingsContext.powerControl ? 'ON' : 'OFF'}</Text>
                    </TouchableOpacity>
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
                <View style={[styles.groupContainer, { backgroundColor: theme.groupContainer }]} >
                    <TouchableOpacity activeOpacity={0.8} style={styles.group} onPress={() => Linking.openURL("market://details?id=com.flashalerts")} >
                        <View style={styles.rightGroup}>
                            <>
                                <View style={[styles.iconContainer, { backgroundColor: theme.primaryGrey }]}>
                                    <Image
                                        source={require('../assets/shareIcon.png')}
                                    />
                                </View>
                                <Text style={[styles.text, { color: theme.color }]}>Share</Text>
                            </>
                        </View>
                    </TouchableOpacity>
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
                <View style={styles.footer} >
                    <Text style={[styles.footerText, { color: theme.color }]} >APP VERSION: 1.0</Text>
                </View>

                {powerModal && (
                    <Modal isVisible={true} onBackdropPress={() => setPowerModal(false)} >
                        <View style={styles.modalContainer} >
                            <View style={styles.modalHeaderContainer} >
                                <Text style={{ color: 'black', fontSize: width * 0.04 }}>Power Control</Text>
                                <SwitchComponent value={settingsContext.powerControl} onChange={powerControlOnChange} />
                            </View>
                            {settingsContext.powerControl && (
                                <View >
                                    <View style={{ paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20, }} >
                                        <Slider
                                            style={{ width: '85%', }}
                                            maximumTrackTintColor='#E5E5E5'
                                            minimumTrackTintColor='#00B4E0'
                                            thumbTintColor='#00CBC3'
                                            value={sliderValue}
                                            onValueChange={(value) => setSliderValue(value)} />
                                        <Text style={{ width: '18%', fontSize: width * 0.04, textAlign: 'right', color: 'black' }} >{parseInt(sliderValue * 100)}%</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10 }} >
                                        <Text onPress={() => setPowerModal(false)} style={{ color: 'grey' }} >Cancel</Text>
                                        <Text onPress={() => powerControlPercentageOnChange()} style={{ paddingHorizontal: 10, paddingLeft: 40, color: 'black' }} >Ok</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </Modal>
                )}
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
        elevation: 5
    },
    modalContainer: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'white'
    },
    modalHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        paddingVertical: 10
    },
    footer: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerText: {
        fontSize: width * 0.035,
    },
})