/*import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { ScrollView } from 'react-native-gesture-handler';
import ChatoptionSheet from '../../components/BottomSheet/ChatoptionSheet';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Anotherprofile from '../profile/Anotherprofile';


const ChatData = [
    {
        id: '1',
        title: 'Hi, yatin👋!',
        send: false,
    },
    {
        id: '2',
        title: 'Cna you send presentation file form Mr. Alex i lost it and cant find that 😢.',
        time: "4.40pm",
        send: false,
    },
    {
        id: '3',
        title: 'Yoo, sure Deep',
        send: true,
    },
    {
        id: '4',
        title: 'Let me find that presentation at my laptop, give me a second!',
        time: "4.50pm",
        send: true,
    },
    {
        id: '5',
        title: 'Yes sure, take your time Brian',
        time: "4.55pm",
        send: false,
    },
    {
        id: '6',
        title: 'History of animal Biolo...',
        time: "4.56pm",
        send: true,
    },
    {
        id: '7',
        title: 'Thank you for helping me! ❤ You save my life hahaha! ',
        time: "4.57pm",
        send: false,
    },
    {
        id: '8',
        title: 'You, sure Deep👍 ',
        time: "4.58pm",
        send: true,
    },
    {
        id: '1',
        title: 'Hi, yatin👋!',
        send: false,
    },
    {
        id: '2',
        title: 'Cna you send presentation file form Mr. Alex i lost it and cant find that 😢.',
        time: "4.40pm",
        send: false,
    },
    {
        id: '3',
        title: 'Yoo, sure Deep',
        send: true,
    },
    {
        id: '4',
        title: 'Let me find that presentation at my laptop, give me a second!',
        time: "4.50pm",
        send: true,
    },
    {
        id: '5',
        title: 'Yes sure, take your time Brian',
        time: "4.55pm",
        send: false,
    },
    {
        id: '6',
        title: 'History of animal Biolo...',
        time: "4.56pm",
        send: true,
    },
    {
        id: '7',
        title: 'Thank you for helping me! ❤ You save my life hahaha! ',
        time: "4.57pm",
        send: false,
    },
    {
        id: '8',
        title: 'You, sure Deep👍 ',
        time: "4.58pm",
        send: true,
    },
]

const SingleChat = ({ navigation }) => {

    const theme = useTheme();
    const { colors } = theme;

    const moresheet = React.useRef();

    return (
        <SafeAreaView style={[{padding:0,flex: 1, backgroundColor: theme.dark ? '#000' : '#eee' }, Platform.OS === 'web' && GlobalStyleSheet.container,{padding:0}]}>
            <View style={[GlobalStyleSheet.container, { backgroundColor: colors.background }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                style={{ width: 18, height: 18, tintColor: colors.title }}
                                source={IMAGES.arrowleft}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginRight: 20, marginLeft: 15 }}
                            onPress={() => navigation.navigate('ItemDetails')}
                        >
                            <View>
                                <Image
                                    style={{ width: 45, height: 45, borderRadius: 6 }}
                                    source={IMAGES.car1}
                                />
                            </View>
                            <View style={{ position: 'absolute', bottom: -8, right: -8, borderWidth: 2, borderColor: colors.card, borderRadius: 50 }}>
                                <Image
                                    style={{ width: 20, height: 20, borderRadius: 50 }}
                                    source={IMAGES.Small7}
                                />
                            </View>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(Anotherprofile)}
                            >
                                <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, marginBottom: 3 }}>Deepesh Gour</Text>
                            </TouchableOpacity>
                            <Text numberOfLines={1} style={{ ...FONTS.fontXs, color: colors.title, opacity: .7, paddingRight: 90 }}>NIKON CORPORATION, NIKON D5500</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Call')}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: colors.title }]}
                                source={IMAGES.call}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => moresheet.current.openSheet()}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: colors.title }]}
                                source={IMAGES.more}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 15 }}>
                    {ChatData.map((data, index) => {
                        return (
                            <View key={index}>
                                <View
                                    style={[{
                                        width: '75%',
                                        marginBottom: 10,
                                    },
                                    data.send == false
                                        ?
                                        {
                                            marginRight: 'auto',
                                            alignItems: 'flex-start',
                                        }
                                        :
                                        {
                                            marginLeft: 'auto',
                                            alignItems: 'flex-end',
                                        }
                                    ]}
                                >
                                    <View
                                        style={[
                                            data.send == false
                                                ?
                                                {
                                                    backgroundColor: COLORS.background,
                                                    borderTopLeftRadius: 10,
                                                    borderTopRightRadius: 10,
                                                    borderBottomRightRadius: 10,

                                                }
                                                :
                                                {
                                                    backgroundColor: COLORS.primary,

                                                    borderTopLeftRadius: 10,
                                                    borderTopRightRadius: 10,
                                                    borderBottomLeftRadius: 10,

                                                }

                                        ]}
                                    >
                                        <Text style={{ ...FONTS.font, ...FONTS.fontRegular, color: data.send ? COLORS.white : COLORS.title, paddingVertical: 10, paddingHorizontal: 10 }}>{data.title}</Text>
                                    </View>
                                    {data.time &&
                                        <Text style={{ ...FONTS.fontXs, ...FONTS.fontRegular, color: colors.title, opacity: .4, marginTop: 3 }}>{data.time}</Text>
                                    }
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>

            <View style={{ backgroundColor: colors.card, paddingHorizontal: 10, borderTopWidth: 1, margin: 0, borderTopColor: colors.borderColor }}>
                <View>
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            left: 0
                        }}
                    >
                        <Image
                            style={{
                                tintColor: colors.Text,
                                width: 20,
                                height: 20,
                                resizeMode: 'contain'
                            }}
                            source={IMAGES.happy}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Send your message...'
                        placeholderTextColor={theme.dark ? 'rgba(255,255,255,.6)' : 'rgba(18,9,46,.50)'}
                        multiline={true}
                        style={[
                            GlobalStyleSheet.inputBox, {
                                // backgroundColor: colors.input,
                                marginBottom: 0,
                                paddingLeft: 30,
                                paddingRight: 70,
                                paddingTop: 8
                            },
                        ]}
                    />
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            right: 40
                        }}
                    >
                        <Image
                            style={{
                                tintColor: colors.title,
                                opacity: .5,
                                width: 20,
                                height: 20,
                                resizeMode: 'contain'
                            }}
                            source={IMAGES.camera}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            right: 0
                        }}
                    >
                        <Image
                            style={{
                                tintColor: colors.primary,
                                width: 20,
                                height: 20,
                                resizeMode: 'contain'
                            }}
                            source={IMAGES.send}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ChatoptionSheet
                ref={moresheet}
            />
        </SafeAreaView>
    )
}

export default SingleChat;




import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useTheme, useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';
import ChatoptionSheet from '../../components/BottomSheet/ChatoptionSheet';

const API_BASE = 'https://qot.ug/api';



const SingleChat = () => {
  const { userToken } = useContext(AuthContext);
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { threadId } = route.params; // threadId must be passed via navigation

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const moresheet = useRef();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE}/threads/${threadId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Content-Language': 'en',
          'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
        },
      });

      if (response.data.success && response.data.result?.messages) {
        setMessages(response.data.result.messages);
      }
    } catch (error) {
      console.error('Fetch messages failed:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const response = await axios.post(
        `${API_BASE}/messages`,
        {
          thread_id: threadId,
          body: messageInput.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Content-Language': 'en',
            'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
          },
        }
      );

      if (response.data.success) {
        setMessageInput('');
        fetchMessages(); // Refresh after sending
      }
    } catch (error) {
      console.error('Send message failed:', error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [threadId]);

  const renderItem = ({ item }) => {
    const isMine = item.p_recipient?.user_id !== item.user_id;

    return (
      <View style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '75%', marginVertical: 5 }}>
        <View
          style={{
            backgroundColor: isMine ? COLORS.primary : theme.colors.input,
            padding: 10,
            borderRadius: 10,
            borderBottomLeftRadius: isMine ? 10 : 0,
            borderBottomRightRadius: isMine ? 0 : 10,
          }}
        >
          <Text style={{ color: isMine ? '#fff' : theme.colors.title }}>{item.body}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.card }}>
   
      <View style={[GlobalStyleSheet.container, { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <Image source={IMAGES.arrowleft} style={{ width: 18, height: 18, tintColor: theme.colors.title }} />
        </TouchableOpacity>
        <Text style={{ ...FONTS.h6, color: theme.colors.title, flex: 1 }}>Chat</Text>
        <TouchableOpacity onPress={() => moresheet.current?.openSheet()}>
          <Image source={IMAGES.more} style={{ width: 20, height: 20, tintColor: theme.colors.title }} />
        </TouchableOpacity>
      </View>

  
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          inverted
        />
      )}

   
      <View style={{ flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: theme.colors.borderColor }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: theme.colors.input,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 25,
            color: theme.colors.title,
          }}
          placeholder="Type a message..."
          value={messageInput}
          onChangeText={setMessageInput}
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10, justifyContent: 'center' }}>
          <Image source={IMAGES.send} style={{ width: 24, height: 24, tintColor: COLORS.primary }} />
        </TouchableOpacity>
      </View>

      <ChatoptionSheet ref={moresheet} />
    </SafeAreaView>
  );
};

export default SingleChat;


import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { ScrollView } from 'react-native-gesture-handler';
import ChatoptionSheet from '../../components/BottomSheet/ChatoptionSheet';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Anotherprofile from '../profile/Anotherprofile';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthProvider'; // Assuming you have an auth context

const SingleChat = ({ navigation, route }) => {
    const { user, token } = useAuth(); // Get auth token from context
    const theme = useTheme();
    const { colors } = theme;
    const moresheet = useRef();
    const scrollViewRef = useRef();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [threadId, setThreadId] = useState(route.params?.threadId || null);
    const [postId, setPostId] = useState(route.params?.postId || null);
    const [recipient, setRecipient] = useState(route.params?.recipient || null);

    // API Configuration
    const API_BASE_URL = 'https://qot.ug/api';
    const API_HEADERS = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Language': 'en',
        'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
        'X-AppType': 'docs'
    };

    // Fetch messages from API
    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            
            // If no existing thread, create a new one
            if (!threadId && postId) {
                const response = await axios.post(
                    `${API_BASE_URL}/threads/`,
                    {
                        name: user.name,
                        auth_field: 'email',
                        email: user.email,
                        body: `New conversation about post ${postId}`,
                        post_id: postId
                    },
                    { headers: API_HEADERS }
                );
                
                if (response.data.success) {
                    setThreadId(response.data.result.id);
                }
            }
            
            // Fetch messages for the thread
            if (threadId) {
                const messagesResponse = await axios.get(
                    `${API_BASE_URL}/threads/${threadId}/messages`,
                    { headers: API_HEADERS }
                );
                
                if (messagesResponse.data.success) {
                    setMessages(messagesResponse.data.result);
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            Alert.alert('Error', 'Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    // Send a new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        
        try {
            setIsSending(true);
            
            const response = await axios.put(
                `${API_BASE_URL}/threads/${threadId}`,
                { body: newMessage },
                { headers: API_HEADERS }
            );
            
            if (response.data.success) {
                setNewMessage('');
                fetchMessages(); // Refresh messages
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    // Mark thread as read
    const markAsRead = async () => {
        if (!threadId) return;
        
        try {
            await axios.post(
                `${API_BASE_URL}/threads/bulkUpdate/${threadId}?type=markAsRead`,
                {},
                { headers: API_HEADERS }
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // Delete thread
    const deleteThread = async () => {
        try {
            await axios.delete(
                `${API_BASE_URL}/threads/${threadId}`,
                { headers: API_HEADERS }
            );
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting thread:', error);
            Alert.alert('Error', 'Failed to delete conversation');
        }
    };

    // Load messages on component mount and when threadId changes
    useEffect(() => {
        fetchMessages();
        
        // Set up interval for polling new messages (every 10 seconds)
        const interval = setInterval(fetchMessages, 10000);
        
        return () => clearInterval(interval);
    }, [threadId]);

    // Mark as read when opening the chat
    useEffect(() => {
        markAsRead();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // Format message time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={[
            { padding: 0, flex: 1, backgroundColor: theme.dark ? '#000' : '#eee' },
            Platform.OS === 'web' && GlobalStyleSheet.container,
            { padding: 0 }
        ]}>
            <View style={[GlobalStyleSheet.container, { backgroundColor: colors.background }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                style={{ width: 18, height: 18, tintColor: colors.title }}
                                source={IMAGES.arrowleft}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginRight: 20, marginLeft: 15 }}
                            onPress={() => navigation.navigate('ItemDetails', { id: postId })}
                        >
                            <View>
                                <Image
                                    style={{ width: 45, height: 45, borderRadius: 6 }}
                                    source={IMAGES.car1}
                                />
                            </View>
                            <View style={{ position: 'absolute', bottom: -8, right: -8, borderWidth: 2, borderColor: colors.card, borderRadius: 50 }}>
                                <Image
                                    style={{ width: 20, height: 20, borderRadius: 50 }}
                                    source={IMAGES.Small7}
                                />
                            </View>
                        </TouchableOpacity>
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate(Anotherprofile, { userId: recipient?.id })}>
                                <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, marginBottom: 3 }}>
                                    {recipient?.name || 'Unknown User'}
                                </Text>
                            </TouchableOpacity>
                            <Text numberOfLines={1} style={{ ...FONTS.fontXs, color: colors.title, opacity: .7, paddingRight: 90 }}>
                                {postId ? `Post ID: ${postId}` : 'New Conversation'}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Call')}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: colors.title }]}
                                source={IMAGES.call}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => moresheet.current?.openSheet()}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={[GlobalStyleSheet.image, { tintColor: colors.title }]}
                                source={IMAGES.more}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView 
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    <View style={{ flex: 1, padding: 15 }}>
                        {messages.length === 0 ? (
                            <Text style={{ textAlign: 'center', color: colors.text, marginTop: 20 }}>
                                No messages yet. Start the conversation!
                            </Text>
                        ) : (
                            messages.map((message, index) => (
                                <View key={`${message.id}-${index}`}>
                                    <View
                                        style={[{
                                            width: '75%',
                                            marginBottom: 10,
                                        },
                                        message.user_id === user.id
                                            ? {
                                                marginLeft: 'auto',
                                                alignItems: 'flex-end',
                                            }
                                            : {
                                                marginRight: 'auto',
                                                alignItems: 'flex-start',
                                            }
                                        ]}
                                    >
                                        <View
                                            style={[
                                                message.user_id === user.id
                                                    ? {
                                                        backgroundColor: COLORS.primary,
                                                        borderTopLeftRadius: 10,
                                                        borderTopRightRadius: 10,
                                                        borderBottomLeftRadius: 10,
                                                    }
                                                    : {
                                                        backgroundColor: COLORS.background,
                                                        borderTopLeftRadius: 10,
                                                        borderTopRightRadius: 10,
                                                        borderBottomRightRadius: 10,
                                                    }
                                            ]}
                                        >
                                            <Text style={{ 
                                                ...FONTS.font, 
                                                ...FONTS.fontRegular, 
                                                color: message.user_id === user.id ? COLORS.white : COLORS.title, 
                                                paddingVertical: 10, 
                                                paddingHorizontal: 10 
                                            }}>
                                                {message.body}
                                            </Text>
                                        </View>
                                        <Text style={{ 
                                            ...FONTS.fontXs, 
                                            ...FONTS.fontRegular, 
                                            color: colors.title, 
                                            opacity: .4, 
                                            marginTop: 3 
                                        }}>
                                            {formatTime(message.created_at)}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            )}

            <View style={{ 
                backgroundColor: colors.card, 
                paddingHorizontal: 10, 
                borderTopWidth: 1, 
                margin: 0, 
                borderTopColor: colors.borderColor 
            }}>
                <View>
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            left: 0
                        }}
                    >
                        <Image
                            style={{
                                tintColor: colors.Text,
                                width: 20,
                                height: 20,
                                resizeMode: 'contain'
                            }}
                            source={IMAGES.happy}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Send your message...'
                        placeholderTextColor={theme.dark ? 'rgba(255,255,255,.6)' : 'rgba(18,9,46,.50)'}
                        multiline={true}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        onSubmitEditing={sendMessage}
                        editable={!isSending && threadId}
                        style={[
                            GlobalStyleSheet.inputBox, {
                                marginBottom: 0,
                                paddingLeft: 30,
                                paddingRight: 70,
                                paddingTop: 8
                            },
                        ]}
                    />
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            right: 40
                        }}
                    >
                        <Image
                            style={{
                                tintColor: colors.title,
                                opacity: .5,
                                width: 20,
                                height: 20,
                                resizeMode: 'contain'
                            }}
                            source={IMAGES.camera}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            zIndex: 1,
                            position: 'absolute',
                            top: 13,
                            right: 0
                        }}
                        onPress={sendMessage}
                        disabled={isSending || !newMessage.trim() || !threadId}
                    >
                        {isSending ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <Image
                                style={{
                                    tintColor: colors.primary,
                                    width: 20,
                                    height: 20,
                                    resizeMode: 'contain'
                                }}
                                source={IMAGES.send}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ChatoptionSheet
                ref={moresheet}
                onDelete={deleteThread}
                onMarkAsRead={markAsRead}
            />
        </SafeAreaView>
    );
};

export default SingleChat;

    Authorization: userToken.startsWith('Bearer ') ? userToken : `Bearer ${userToken}`,
*/


import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRoute, useTheme, useNavigation } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';

const API_BASE_URL = 'https://qot.ug/api';
const API_TOKEN = 'Uk1DSFlVUVhIRXpHbWt6d2pIZjlPTG15akRPN2tJTUs=';

const SingleChat = () => {
  const { userToken, userData, signOut } = useContext(AuthContext);
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { threadId } = route.params;
  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Enhanced headers with verification
  const getHeaders = () => {
    if (!userToken) {
      Alert.alert('Session Expired', 'Please login again');
      signOut();
      navigation.navigate('Login');
      return null;
    }
    
    return {
      Authorization: userToken.startsWith('Bearer ') ? userToken : `Bearer ${userToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Language': 'en',
      'X-AppApiToken': API_TOKEN,
    };
  };

  // Fetch thread with proper error handling
 const fetchThread = async () => {
  const headers = getHeaders();
  if (!headers) return;

  console.log('Fetching thread', threadId);
  console.log('Using headers:', headers);

  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(
      `${API_BASE_URL}/threads/${threadId}?embed=messages`,
      { headers, timeout: 10000 }
    );
    console.log('Response Data:',response.data.result); // check if thread 2 is listed



    if (response.data.success) {
      setMessages(response.data.result.messages || []);
    } else {
      throw new Error(response.data.message || 'Failed to load conversation');
    }
  } catch (error) {
    console.error('Fetch Thread Error:', error.response?.data || error.message);

    if (error.response?.status === 403) {
      setError('You do not have permission to view this conversation');
    } else if (error.response?.status === 401) {
      Alert.alert('Session Expired', 'Please login again', [
        { text: 'OK', onPress: () => signOut() }
      ]);
    } else {
      setError(error.message || 'Failed to load messages. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
  // Mark as read with proper endpoint
  const markAsRead = async () => {
    const headers = getHeaders();
    if (!headers) return;

    try {
      await axios.post(
        `${API_BASE_URL}/threads/bulkUpdate`,
        {
          ids: [threadId],
          type: 'markAsRead'
        },
        { headers }
      );
    } catch (error) {
      console.error('Mark as Read Error:', error);
    }
  };

  // Send message with FormData
  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const headers = getHeaders();
    if (!headers) return;

    try {
      setSending(true);

      const formData = new FormData();
      formData.append('body', messageInput.trim());
      formData.append('_method', 'PUT');

      const response = await axios.post(
        `${API_BASE_URL}/threads/${threadId}`,
        formData,
        { 
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setMessageInput('');
        await fetchThread();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (threadId) {
      fetchThread();
      const interval = setInterval(fetchThread, 10000);
      return () => clearInterval(interval);
    }
  }, [threadId, userToken]);

  // Render message item
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.user_id === userData?.id;
    
    return (
      <View style={{
        width: '80%',
        marginBottom: 10,
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start'
      }}>
        <View style={{
          backgroundColor: isCurrentUser ? COLORS.primary : theme.colors.input,
          borderRadius: 15,
          borderBottomRightRadius: isCurrentUser ? 0 : 15,
          borderBottomLeftRadius: isCurrentUser ? 15 : 0,
          padding: 12
        }}>
          <Text style={{
            color: isCurrentUser ? COLORS.white : theme.colors.title,
            ...FONTS.font
          }}>
            {item.body}
          </Text>
        </View>
        <Text style={{
          ...FONTS.fontXs,
          color: theme.colors.text,
          opacity: 0.6,
          marginTop: 4,
          alignSelf: isCurrentUser ? 'flex-end' : 'flex-start'
        }}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: COLORS.danger, ...FONTS.h5, marginBottom: 20, textAlign: 'center' }}>
          {error}
        </Text>
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: COLORS.primary,
            borderRadius: 8
          }}
          onPress={fetchThread}
        >
          <Text style={{ color: COLORS.white }}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.text }}>Loading conversation...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={[GlobalStyleSheet.container, {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={IMAGES.arrowleft}
            style={{ width: 22, height: 22, tintColor: theme.colors.title }}
          />
        </TouchableOpacity>
        <Text style={{ ...FONTS.h6, color: theme.colors.title, marginLeft: 15 }}>
          Conversation
        </Text>
      </View>

      {/* Messages List */}
      <FlatList
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 15 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: theme.colors.text, opacity: 0.7 }}>
              {messages === null ? 'Loading messages...' : 'No messages yet'}
            </Text>
          </View>
        }
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={{
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.card
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: theme.colors.input,
                borderRadius: 20,
                paddingHorizontal: 15,
                paddingVertical: Platform.OS === 'ios' ? 12 : 8,
                color: theme.colors.title,
                maxHeight: 100
              }}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.text}
              value={messageInput}
              onChangeText={setMessageInput}
              multiline
              editable={!sending}
            />
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={sendMessage}
              disabled={!messageInput.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Image
                  source={IMAGES.send}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: messageInput.trim() ? COLORS.primary : theme.colors.text,
                    opacity: messageInput.trim() ? 1 : 0.5
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SingleChat;