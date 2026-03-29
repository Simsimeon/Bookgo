import { View, Text } from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import React from 'react'
import COLORS from "../constants/colors"

const Savescreen = ({children}) => {
  const insert= useSafeAreaInsets()
//    useSafeAreaInsets()

  return (
    <View style={{paddingTop:insert.top,flex:1,backgroundColor:COLORS.background }}>
      {children}
    </View>
  )
}

export default Savescreen