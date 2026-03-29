import { View, Text } from 'react-native'
import { useAuthstore } from '../Store/authStore'
import { Image } from 'expo-image'
import styles from '../assets/styles/profile.styles'
import { formatMemberSince } from '../lib/utilis'

const ProfileHeader = () => {
    const { user } = useAuthstore()
    return (
        <View style={styles.profileHeader}>
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.memberSince}>Join {formatMemberSince(user.createdAt)}</Text>
            </View>

        </View>
    )
}

export default ProfileHeader
