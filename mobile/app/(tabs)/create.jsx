import { View, Text, KeyboardAvoidingView, Alert } from 'react-native'
import { Platform, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native'
import COLORS from '@/constants/colors'
import { TouchableOpacity } from 'react-native'
import { useAuthstore } from '../../Store/authStore'
import { API_URL } from '../../constants/api'
import { ActivityIndicator } from 'react-native'
import * as ImagePicker from "expo-image-picker"
import styles from "../../assets/styles/create.styles"
import { Image } from 'expo-image'
const Create = () => {
  const [title, setTitle] = useState("")
  const [cation, setCation] = useState("")
  const [rating, setRating] = useState(3)
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageBase64, setImageBase64] = useState("")
  const { token } = useAuthstore()
  const renderRatingPicker = () => {
    const stars = []
    for (let i = 0; i < 5; i++)
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i + 1)} style={styles.starButton}>
          <Ionicons
            name={i < rating ? "star" : "star-outline"}
            size={24}
            color={i < rating ? "#f4b400" : COLORS.textSecondary} />
        </TouchableOpacity>
      )

    return <View style={styles.ratingContainer}>{stars}</View>
  }

  const router = useRouter()

  const handleImagePick = async () => {
    try {
      if (Platform.OS !== "web") {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          //  granted  granted
          Alert.alert("Permission Denied",
            "We need camera roll permission to upload an image")
          return;
        }


      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: "Images",
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.5,  // lower quality for smaller base64
        base64: true,
      })
      if (!result.canceled) {
        setImage(result.assets[0].uri)
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64)
        } else {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          })
          setImageBase64(base64)

        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  }
  const handleSubmit = async () => {
    if (!title || !cation || !imageBase64 || !rating) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    setLoading(true)
    try {
      const uriParts = image.split(".")
      const fileType = uriParts[uriParts.length - 1]
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          title,
          cation,
          rating: rating.toString(),
          image: imageDataUrl,

        }),
      })
      const data = await response.json()
    
      if (!response.ok) throw new Error(data.message || "something went wrong")
      Alert.alert("Success", "Post created successfully");
      setTitle("")
      setCation("")
      setImage(null)
      setImageBase64(null)
      setRating(3)
      router.push("/")
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create post");

    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendations</Text>
            <Text style={styles.subtitle}>Share your favorite books with the community</Text>
          </View>
          <View style={styles.form}>
            {/* Book Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="book-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.placeholderText}>Pick an image</Text>
                  </View>
                )}

              </TouchableOpacity>
            </View>
            {/* Book Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your review or thought about this book..."
                placeholderTextColor={COLORS.textSecondary}
                value={cation}
                onChangeText={setCation}
                multiline
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Post Recommendation</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Create