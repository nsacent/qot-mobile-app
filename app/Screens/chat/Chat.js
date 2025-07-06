import React, { useEffect, useState, useContext } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, Platform, ActivityIndicator } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';
import { formatDistanceToNow } from 'date-fns'
import { fetchPostData, fetchUserData } from '../../contexts/services/userService';


const API_URL = 'https://qot.ug/api/threads';



const LiveUserData = [
  {
    id: '1',
    title: 'Deepesh',
    image: IMAGES.Small4,
  },
  {
    id: '2',
    title: 'Alex Techie',
    image: IMAGES.Small2,
  },
  {
    id: '3',
    title: 'Lily Learns',
    image: IMAGES.Small3,
  },
  {
    id: '4',
    title: 'Mia Maven',
    image: IMAGES.Small1,

  },
  {
    id: '5',
    title: 'herry Techie',
    image: IMAGES.Small5,
  },
  {
    id: '6',
    title: 'Sophia James',
    image: IMAGES.Small6,
  },
  {
    id: '5',
    title: 'herry Techie',
    image: IMAGES.Small7,
  },
  {
    id: '6',
    title: 'Sophia James',
    image: IMAGES.Small8,
  }
]


const Item = ({ item, navigation, theme }) => {

  const [post, setPostData] = useState(null);
  const [user, setUserData] = useState(null);

  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const getData = async () => {
      try {
        const postId = item?.post_id;
        const userId = item?.latest_message?.p_recipient?.user_id;


        console.log(postId);
        const postData = await fetchPostData(postId, userToken); // replace with actual values
        const userData = await fetchUserData(userId, userToken); // replace with actual values
        await setPostData(postData); // if you're storing in state
        await setUserData(userData); // if you're storing in state
        //console.log('Post-data:', postData);
        //console.log('Useer-data:', userData);

      } catch (err) {

        console.error(err.message);
        // handle error (e.g., signOut if token invalid)
      }
    };

    getData();
  }, []);

  //console.log('post', post);
  //console.log('user', user);

  const lastMessage = item.latest_message?.body || 'No message';
  const chatUserName = post?.contact_name || 'Unknown';
  const itemImage = post?.picture?.url?.small ? { uri: post.picture.url.small } : IMAGES.Small1;
  const userImage = user?.photo_url ? { uri: user.photo_url } : IMAGES.Small1;
  const chatcount = 12;
  const time = item.updated_at;
  const active = false;
  const itemName = item?.subject || "Subject";

  console.log(item);

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate('SingleChat', { threadId: item.id, post:{id:item.post_id,name:itemName} ,recipient: {id:user?.id,name:chatUserName,photo_url:userImage,item_url:itemImage}})}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginBottom: 8,
          marginHorizontal: 10,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderRadius: SIZES.radius,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 5,
        }}
      >
        <View>
          <TouchableOpacity
            style={{ marginRight: 20 }}
          >
            <View>
              <Image
                style={{ width: 50, height: 50, borderRadius: 6 }}
                source={itemImage}
              />
            </View>
            <View style={{ position: 'absolute', bottom: -10, right: -10, borderWidth: 2, borderRadius: 50, borderColor: theme.colors.card }}>
              <Image
                style={{ width: 25, height: 25, borderRadius: 50 }}
                source={userImage}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: theme.colors.title, flex: 1 }}>{chatUserName}</Text>
            <Text style={{ ...FONTS.fontSm, ...FONTS.fontRegular, color: theme.colors.title, opacity: .4 }}>
              {time ? formatDistanceToNow(new Date(time), { addSuffix: true }) : 'Sometime ago'}
            </Text>



          </View>
          <View style={{ flexDirection: 'row', paddingRight: 60 }}>
            <Text numberOfLines={1} style={{ ...FONTS.fontXs, color: theme.colors.title, flex: 1 }}>{itemName}</Text>
          </View>
          <View style={{ position: 'absolute', flexDirection: 'row', alignItems: 'center', bottom: 5, right: 5 }}>
            {chatcount &&
              <View style={{ borderRadius: 50, backgroundColor: COLORS.primary, }}>
                <Text style={{ ...FONTS.font, color: '#fff', width: 20, height: 20, alignItems: 'center', textAlign: 'center', }}>{chatcount}</Text>
              </View>
            }
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <Text style={{ ...FONTS.fontXs, color: theme.colors.text, flex: 1 }}>{lastMessage}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};




const ActiveChat = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, gap: 5 }}
      >
        {LiveUserData.map((data, index) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('SingleChat')}
              key={index}
              style={{ alignItems: 'center', marginBottom: 10, width: 65 }}
            >
              <Image
                style={{ width: 55, height: 55, borderRadius: 12 }}
                source={data.image}
              />
              <Text numberOfLines={1} style={{ ...FONTS.fontMedium, color: colors.title, fontSize: 10, marginTop: 5 }}>{data.title}</Text>
              <View style={{ backgroundColor: COLORS.success, width: 12, height: 12, borderRadius: 50, position: 'absolute', bottom: 20, right: 5, borderWidth: 2, borderColor: colors.card }}></View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, paddingHorizontal: 15, marginBottom: 10 }}>Messages</Text>
    </View>
  )
};

const Chat = ({ navigation }) => {
  const theme = useTheme();
  const { userToken } = useContext(AuthContext);
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Content-Language': 'en',
          'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY='
        }
      });
      if (response.data.success && response.data.result?.data) {
        setChatData(response.data.result.data);
      }
    } catch (error) {
      console.error('Failed to fetch threads:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.card, flex: 1 }}>
      <View style={GlobalStyleSheet.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border, marginHorizontal: -15, paddingHorizontal: 15 }}>
          <Text style={{ ...FONTS.fontSemiBold, fontSize: 18, color: theme.colors.title, flex: 1 }}>Chats</Text>
          <TouchableOpacity>
            <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: theme.colors.title }} source={IMAGES.search} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          contentContainerStyle={[{ paddingBottom: 100 }, Platform.OS === 'web' && GlobalStyleSheet.container]}
          showsVerticalScrollIndicator={false}
          data={chatData}
          renderItem={({ item }) => <Item item={item} navigation={navigation} theme={theme} />}
          ListHeaderComponent={() => <ActiveChat />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
};

export default Chat;