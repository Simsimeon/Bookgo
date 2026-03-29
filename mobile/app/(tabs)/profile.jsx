import { FlatList, View, Text } from 'react-native'
import { useAuthstore } from '../../Store/authStore'
import { useRouter } from 'expo-router'
import { API_URL } from '../../constants/api'
import { useEffect } from 'react'
import { useState } from 'react'
import { Alert } from 'react-native'
import styles from '../../assets/styles/profile.styles'
import ProfileHeader from '../../component/ProfileHeader'
import LogoutButton from '../../component/LogoutButton'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { ActivityIndicator } from 'react-native'
import { RefreshControl } from 'react-native'




const Profile = () => {
  const [loading, setIsLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [deletedBookId, setDeletedBookId] = useState(null)
  const { user, token, deleteBook } = useAuthstore()
  const router = useRouter()
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user books");

      setBooks(data);
    } catch (error) {
    
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRating(item.rating)}
        </View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.cation}
        </Text>
        <Text style={styles.bookDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deletedBookId === item._id ?
          <ActivityIndicator size="small" color={COLORS.primary} /> :
          <Ionicons name="trash-outline" size={24} color={COLORS.primary} />}
      </TouchableOpacity>
    </View>
  )
  const renderRating = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={24}
          color={i < rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      )
    }
    return stars
  }
  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteBook(id),
          style: "destructive",
        },
      ]
    )
  }
  const handleDeleteBook = async (id) => {
    try {
      setDeletedBookId(id)
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to delete book")
      setBooks(books.filter((book) => book._id !== id))
      Alert.alert("Success", "Book deleted successfully")
    } catch (error) {
       Alert.alert("Error", "Failed to delete book.");
    } finally {
      setDeletedBookId(null)
    }
  }
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }
  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}> Your Recommendation </Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No books recommended yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
              <Text style={styles.addButtonText}>Recommend a Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}

export default Profile