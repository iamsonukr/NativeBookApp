import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '@/constants/colors'
import Loader from '../../components/Loader'
import { API_URL } from '../../constants/api.js'
import styles from '../../assets/styles/profile.styles.js'
import ProfileHeader from '../../components/ProfileHeader.jsx'
import LogoutButton from '../../components/LogoutButton.jsx'


export default function Profile() {

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deletedBookId,setDeletedBoolId]=useState(null)

  const { token } = useAuthStore();
  const router = useRouter();

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setIsLoading(true);

      // const response =await fetch(`${API_URL}/books?page=${pageNum}&limit=5`,{
      const response = await fetch(`https://nativebookapp.onrender.com/api/books?page=${pageNum}&limit=5`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "failed to fetch books");

      // setBooks((prevBook)=>[...prevBook,...data.books])
      setBooks(data.books);

      const uniqueBooks = refresh || pageNum === 1
        ? data.books
        : Array.from(new Set([...books, ...data.books].map((book) => book._id)))
          .map((id) => [...books, ...data.books].find((book) => book._id === id));

      setBooks(uniqueBooks);
      setHasMore(pageNum < data.totalPages);

    } catch (error) {
      console.log("Error fetching books ", error)
    } finally {
      if (refresh) setRefreshing(false);
      else setIsLoading(false)
    }
  }



  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem} >
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo} >
        <Text style={styles.bookTitle} >{item.title}</Text>
        <View style={styles.ratingContainer} >{renderRatingStars(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)} >
        {/* <Ionicons name='trash-outline' size={20} color={COLORS.primary} /> */}
        {
          deletedBookId===item._id?(
            <ActivityIndicator size="small" color={COLORS.primary}/>
          ):(
            <Ionicons name='trash-outline' size={20} color={COLORS.primary} />
          )        }
      </TouchableOpacity>
    </View>
  )

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={32}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  }
const handleDeleteBooks=async(bookId)=>{
  setDeletedBoolId(bookId)
  try {
    const response=await fetch (`${API_URL}/books/${bookId}`,{
      method: 'DELETE',
      headers: {
        Authorization:`Bearer ${token}`,
        'Content-Type': 'application/json',
        },
    })
    const data=await response.json();
    if(!response.ok) throw new Error(data.message || "Failed to delete books") 
    setBooks(books.filter((book)=>book._id !== bookId ))
    Alert.alert("Success", "Recommendation deleted successfully");
  } catch (error) {
    Alert.alert("Error", error.message || "Recommendation deletion failed");
    
  } finally{
    setDeletedBoolId(null)
  }
}

  const confirmDelete=(bookId)=>{
    Alert.alert("Delete Recommendation","Are you sure you want to delete this recommendations ?",
      [
        {text:"Cancel",style:"cancel"},
        {text:"Delete",style:"destructive", onPress:()=>handleDeleteBooks(bookId)}
      ]
    )
  }

  const handleRefresh=async()=>{
    setRefreshing(true)
    await sleep(500)
    await fetchBooks()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  if(isLoading && !refreshing) return <Loader/>

  return (
    <View style={styles.container} >
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader} >
        <Text style={styles.bookTitle}>Your Recommandation</Text>
        <Text style={styles.booksCount}>{books.length} Books</Text>
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
          <View>
            <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText} >No Recommandations yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText} >Add your first book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}