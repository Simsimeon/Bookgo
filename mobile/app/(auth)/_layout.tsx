import Savescreen from "@/component/Savescreen"
import { Stack } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
export default function Authlayout() {


  return (


    <Savescreen>
      <Stack screenOptions={{ headerShown: false }} />
    </Savescreen>
  )

}

