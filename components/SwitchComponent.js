import React from 'react'
import { StyleSheet, Text, View, Switch } from 'react-native'

const SwitchComponent = ({ value, onChange }) => {
    return (
        // <Switch
        //     trackColor={{ false: "#939393D9", true: "#153e31" }}
        //     thumbColor={value ? '#048f7a' : "#DADADA"}
        //     value={value}
        //     onValueChange={(value) => onChange(value)}
        // />
        <Switch
            trackColor={{ false: "#939393D9", true: "#153e31" }}
            thumbColor={value ? '#048f7a' : "#DADADA"}
            value={value}
            onValueChange={(value) => onChange(value)}

        />
    )
}

export default SwitchComponent

const styles = StyleSheet.create({})