import React, { useContext } from 'react'
import { StyleSheet, Text, View, Switch } from 'react-native'

import themeContext from '../config/themeContext'

const SwitchComponent = ({ value, onChange }) => {
    const theme = useContext(themeContext)
    return (
        <Switch
            trackColor={{ false: theme.switch[0], true: theme.switch[1] }}
            thumbColor={value ? theme.switch[2] : theme.switch[3]}
            value={value}
            onValueChange={(value) => onChange(value)}

        />
    )
}

export default SwitchComponent

const styles = StyleSheet.create({})