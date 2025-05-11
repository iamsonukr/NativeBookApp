import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import styles from '../../assets/styles/home.styles'
import {API_URL} from '../../constants/api.js'
import { FlatList } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/authStore'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '@/constants/colors'
import Loader from '../../components/Loader'

export const sleep =(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));

export default function Home() {
  const {token} =useAuthStore()
  const [books,setBooks]=useState([]);
  const [loading,setLoading]=useState(true)
  const [refreshing,setRefreshing]=useState(false)
  const [page,setPage]=useState(1)
  const [hasMore,setHasMore]=useState(true)


  const fetchBooks =async(pageNum=1,refresh=false)=>{
    try {
      if(refresh)setRefreshing(true);
      else if(pageNum===1)setLoading(true);
    
      // const response =await fetch(`${API_URL}/books?page=${pageNum}&limit=5`,{
      const response =await fetch(`https://nativebookapp.onrender.com/api/books?page=${pageNum}&limit=5`,{
        method:"get",
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      const data=await response.json();
      if(!response.ok) throw new Error(data.message || "failed to fetch books");
      
      // setBooks((prevBook)=>[...prevBook,...data.books])
      setBooks(data.books);

      const uniqueBooks = refresh || pageNum === 1
        ? data.books
        : Array.from(new Set([...books, ...data.books].map((book) => book._id)))
            .map((id) => [...books, ...data.books].find((book) => book._id === id));
      
      setBooks(uniqueBooks);
      setHasMore(pageNum < data.totalPages);

    } catch (error) {
      console.log("Error fetching books ",error)
    }finally{
      if(refresh)setRefreshing(false);
      else setLoading(false)
    }
  }

  useEffect(()=>{
    fetchBooks()
  },[]);


  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
          <Ionicons
            key={i}
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
            style={{marginRight:2}}
          />
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  }

  const handleLoadMore=async()=>{
    if(hasMore && !loading && !refreshing){
      await fetchBooks(page+1)
    }
  }

  if(loading){
    return(
      <Loader size={"large"}/>
    )
  }

  const renderItem=({item})=>(
    <View style={styles.bookCard} >
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image source ={{uri:item.user.profileImage}} style={styles.avatar} />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      
      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage}/>
      </View>

      <View style={styles.bookImageContainer}>
        <Image source={item.image} style={styles.bookImage} contentFit="cover" />
      </View>

      <View style={styles.bookDetails} >
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer} >{renderRatingStars(item.rating)}</View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Text style={styles.date}>Shared on {formatPublishDate(item.createdAt)}</Text>
      </View>
    </View>
  )



  return (
    <View style={styles.container} >
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item)=>item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header} >
            <Text style={styles.headerTitle} >Bookworm</Text>
            <Text style={styles.headerSubtitle} >Bookworm</Text>

          </View>
        }

        ListEmptyComponent={
          <View>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}>No recommandation yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a book</Text>
          </View>
        }

        ListFooterComponent={
          hasMore && books.length>0?(
            <ActivityIndicator style={styles.footerLoader} size="small" color={COLORS.primary}/>
          ):null
        }
      />
    </View>
  )
}