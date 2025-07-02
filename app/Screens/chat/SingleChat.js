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

export default SingleChat;*/




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
      {/* Header */}
      <View style={[GlobalStyleSheet.container, { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <Image source={IMAGES.arrowleft} style={{ width: 18, height: 18, tintColor: theme.colors.title }} />
        </TouchableOpacity>
        <Text style={{ ...FONTS.h6, color: theme.colors.title, flex: 1 }}>Chat</Text>
        <TouchableOpacity onPress={() => moresheet.current?.openSheet()}>
          <Image source={IMAGES.more} style={{ width: 20, height: 20, tintColor: theme.colors.title }} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
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

      {/* Input */}
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
