import React, { useContext } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import themeContext from './../config/themeContext';

const Loading = () => {
    const theme = useContext(themeContext);
    return (
        <View style={[styles.container, { backgroundColor: theme.theme }]}>
            <ActivityIndicator size={'large'} color={theme.primaryColor} />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})