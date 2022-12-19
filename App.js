import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, AppState } from 'react-native'

import { DefaultTheme, NavigationContainer, DarkTheme } from '@react-navigation/native'
import { EventRegister } from 'react-native-event-listeners'
import SystemNavigationBar from 'react-native-system-navigation-bar';
import AnimatedSplash from "react-native-animated-splash-screen";

import NavigationRoutes from './routes/NavigationRoutes';
import themeContext from './config/themeContext';
import SettingsContext from './screens/SettingsContext';
import theme from './config/theme';
import settings from './constants/Data';
import StorageHelper from './Helpers/StorageHelper';
import Loading from './components/Loading';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
	const [themeMode, setThemeMode] = useState(settings.theme)
	const [settingsContext, setSettingsContext] = useState()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let eventListener = EventRegister.addEventListener("ChangeTheme", (value) => {
			setThemeMode(value)
			value ? SystemNavigationBar.setNavigationColor('black') : SystemNavigationBar.setNavigationColor('white')
		})
		return () => {
			EventRegister.removeEventListener(eventListener)
		}
	}, [])

	useEffect(() => {
		setTimeout(() => {
			getData()
		}, 1000);
	}, [])

	const getData = () => {
		// StorageHelper.removeToken('Settings')
		StorageHelper.getValueFor("Settings").then((data) => {
			if (data) {
				setSettingsContext(data)
				setThemeMode(data.theme)
				data.theme ? SystemNavigationBar.setNavigationColor('black') : SystemNavigationBar.setNavigationColor('white')

			} else {
				setSettingsContext(settings);
				setThemeMode(settings.theme)
				StorageHelper.save("Settings", JSON.stringify(settings))
			}
		}).then(() => {
			SplashScreen.hide()
			setLoading(false)
		})
	}

	return (
		<AnimatedSplash
			logoWidth={100}
			logoHeight={100}
			isLoaded={!loading}
			backgroundColor={'#242424'}
			logoImage={require("./assets/Icons/72x72.png")}
		>
			<>
				{!loading && (
					<themeContext.Provider value={themeMode ? theme.dark : theme.light}>
						<SettingsContext.Provider value={{ settingsContext, setSettingsContext }} >
							<NavigationContainer theme={themeMode ? DarkTheme : DefaultTheme} >
								<NavigationRoutes />
							</NavigationContainer>
						</SettingsContext.Provider>
					</themeContext.Provider >
				)}
			</>
		</AnimatedSplash>
	)
}

export default App

const styles = StyleSheet.create({})