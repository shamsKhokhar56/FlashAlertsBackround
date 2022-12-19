import * as React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';


const getValueFor = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e)
    }
}

const save = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log(e)
    }
}

const removeToken = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (e) {
        console.log("Error Deleting", e.message);
    }
}

const StorageHelper = {
    getValueFor,
    save,
    removeToken
}

export default StorageHelper