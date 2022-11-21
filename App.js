import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, AppState } from 'react-native'

import { DefaultTheme, NavigationContainer, DarkTheme } from '@react-navigation/native'
import { EventRegister } from 'react-native-event-listeners'

import NavigationRoutes from './routes/NavigationRoutes';
import themeContext from './config/themeContext';
import SettingsContext from './screens/SettingsContext';
import theme from './config/theme';
import settings from './constants/Data';
import StorageHelper from './Helpers/StorageHelper';
import Loading from './components/Loading';

const App = () => {
	const [themeMode, setThemeMode] = useState(settings.theme)
	const [settingsContext, setSettingsContext] = useState()
	const [loading, setLoading] = useState(true)
	


	useEffect(() => {
		let eventListener = EventRegister.addEventListener("ChangeTheme", (value) => {
			setThemeMode(value)
		})
		return () => {
			EventRegister.removeEventListener(eventListener)
		}
	}, [])

	useEffect(() => {
		getData()
	}, [])

	const getData = () => {
		// StorageHelper.removeToken('Settings')
		StorageHelper.getValueFor("Settings").then((data) => {
			if (data) {
				setSettingsContext(data)
				setThemeMode(data.theme)
			} else {
				setSettingsContext(settings);
				setThemeMode(settings.theme)
				StorageHelper.save("Settings", JSON.stringify(settings))
			}
		}).then(() => setLoading(false))
	}

	return (
		<>
			{loading ? (<Loading />) : (
				<themeContext.Provider value={themeMode ? theme.dark : theme.light}>
					<SettingsContext.Provider value={{ settingsContext, setSettingsContext }} >
						<NavigationContainer theme={themeMode ? DarkTheme : DefaultTheme} >
							<NavigationRoutes />
						</NavigationContainer>
					</SettingsContext.Provider>
				</themeContext.Provider >
			)}
		</>
	)
}

export default App

const styles = StyleSheet.create({})