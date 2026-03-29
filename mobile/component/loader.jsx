import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import COLORS from '../constants/colors'


const Loader = ({ size = "large" }) => {
    return (
        <View style=
            {{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <ActivityIndicator size={size} color={COLORS.primary} />
        </View>
    )
}

export default Loader