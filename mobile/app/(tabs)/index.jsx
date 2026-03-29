import { View, Text } from 'react-native'
import React from 'react'
import { useAuthstore } from '../../Store/authStore'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { useEffect } from 'react'
import styles from '../../assets/styles/home.styles'
import { FlatList } from 'react-native'
import { Image } from 'expo-image'
import { API_URL } from '../../constants/api'
import { Ionicons } from '@expo/vector-icons'
import Loader from '../../component/loader'
import COLORS from '../../constants/colors'
import { formatPublishDate } from '../../lib/utilis'
import { ActivityIndicator } from 'react-native'
import { RefreshControl } from 'react-native'

const Index = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { token, logout } = useAuthstore()
  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);
      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "something went wrong")
    

      // const uniqueBooks =
      //   refresh || pageNum === 1
      //     ? data.books
      //     : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map((id) =>
      //       [...books, ...data.books].find((book) => book._id === id)
      //     );
      // setBooks(uniqueBooks)
    

      setBooks((prevBooks) => {
        const allFetched = refresh || pageNum === 1
          ? data.books
          : [...prevBooks, ...data.books];

        // Efficient deduplication using a Map (O(n) instead of O(n^2))
        return Array.from(new Map(allFetched.map(b => [b._id, b])).values());
      });
      setHasMore(pageNum < data.totalPages)
      setPage(pageNum)
    

    } catch (error) {
    
    } finally {
      if (refresh) return setRefreshing(false)
      else setLoading(false)
    }
  }
  const handleRefresh = async () => {
    if (hasMore && !loading && !refreshing) {
      await fetchBooks(page, true)
    }



  }
  useEffect(() => {
    fetchBooks()
  }, [])
  const renderItem = ({ item }) => (
    
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} contentFit='cover' />

      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingPicker(item.rating)}
        </View>
        <Text style={styles.caption}>{item.cation}</Text>
        <Text style={styles.date}> Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  )
  const renderRatingPicker = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++)
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? "star" : "star-outline"}
          size={24}
          color={i < rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />

      )

    return stars
  }
  const handleLoadMore = () => {
    // Only fetch if we have more pages and aren't already loading
    if (hasMore && !loading && !refreshing) {
      const nextPage = page + 1;
      fetchBooks(nextPage); // This will append the next 5 books
    }
  };


  if (loading) {
    return <Loader />
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookGO</Text>
            <Text style={styles.headerSubtitle}>Share your book moments</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendation yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a book</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary} />
          ) : null
        }
      />

    </View>
  )
}

export default Index
