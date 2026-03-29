
import { useAuthstore } from '../Store/authStore'
import { TouchableOpacity } from 'react-native'
import styles from '../assets/styles/profile.styles'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../constants/colors'
import { Alert } from 'react-native'

const LogoutButton = () => {
    const { logout } = useAuthstore()
    const confirmLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => logout(), style: "destructive" }
            ]
        )
    }
    return (
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={19} color={COLORS.white} />
        </TouchableOpacity>
    )
}

export default LogoutButton