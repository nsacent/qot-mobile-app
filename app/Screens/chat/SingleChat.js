import React, { useState, useEffect, useContext, useRef } from 'react';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES } from '../../constants/theme';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useRoute, useTheme, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';
import { parse, formatDistanceToNow } from 'date-fns'


const API_BASE_URL = 'https://qot.ug/api';
const API_TOKEN = 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=';

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

    try {
      //setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_BASE_URL}/threads/${threadId}/messages?embed=&sort=-created_at&order=desc`,
        { headers, timeout: 10000 }
      );

      console.log('Response Data:', response.data);

      // ✅ Correct extraction
      setMessages(response.data?.result?.data || []);
      console.log('Messages set:', response.data?.result?.data);


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
      const interval = setInterval(fetchThread, 5000);
      return () => clearInterval(interval);
    }
  }, [threadId, userToken]);

  // Render message item
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.user_id === userData?.id;
    console.log('Rendering message:', item);


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
    <>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={{ flex: 1, padding: 15 }}>
            {messages.map((item, index) => {
              const isCurrentUser = item.user_id === userData?.id;
              return (
                <View key={index}>
                  <View style={[{
                    width: '75%',
                    marginBottom: 10,
                  }, isCurrentUser
                    ? { marginLeft: 'auto', alignItems: 'flex-end' }
                    : { marginRight: 'auto', alignItems: 'flex-start' }
                  ]}>
                    <View style={[
                      isCurrentUser
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
                    ]}>
                      <Text style={{
                        ...FONTS.font,
                        ...FONTS.fontRegular,
                        color: isCurrentUser ? COLORS.white : COLORS.title,
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                      }}>
                        {item.body}
                      </Text>
                    </View>
                    <Text style={{
                      ...FONTS.fontXs,
                      ...FONTS.fontRegular,
                      color: theme.colors.title,
                      opacity: 0.4,
                      marginTop: 3
                    }}>
                      {formatDistanceToNow(parse(item.created_at_formatted.replace(/(\d+)(st|nd|rd|th)/, '$1'), "MMM d, yyyy 'at' HH:mm", new Date()), { addSuffix: true })}

                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>


        {/* Message Input */}
        <View
          style={{
            backgroundColor: theme.colors.card,
            paddingHorizontal: 10,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border
          }}
        >
          <View>
            <TouchableOpacity style={{
              position: 'absolute',
              top: 13,
              left: 0,
              zIndex: 1,
            }}>
              <Image
                source={IMAGES.happy}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: theme.colors.text
                }}
              />
            </TouchableOpacity>

            <TextInput
              placeholder="Send your message..."
              placeholderTextColor={theme.dark ? 'rgba(255,255,255,.6)' : 'rgba(18,9,46,.50)'}
              multiline
              value={messageInput}
              onChangeText={setMessageInput}
              style={[
                GlobalStyleSheet.inputBox,
                {
                  paddingLeft: 30,
                  paddingRight: 70,
                  paddingTop: 8,
                  marginBottom: 0,
                  color: theme.colors.title
                }
              ]}
            />

            <TouchableOpacity style={{
              position: 'absolute',
              top: 13,
              right: 40,
              zIndex: 1,
            }}>
              <Image
                source={IMAGES.camera}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: theme.colors.text,
                  opacity: 0.5
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sendMessage}
              disabled={!messageInput.trim() || sending}
              style={{
                position: 'absolute',
                top: 13,
                right: 0,
                zIndex: 1,
              }}
            >
              <Image
                source={IMAGES.send}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: COLORS.primary,
                  opacity: messageInput.trim() ? 1 : 0.5,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>




      {/*


      <SafeAreaView style={[{ padding: 0, flex: 1, backgroundColor: theme.dark ? '#000' : '#eee' }, Platform.OS === 'web' && GlobalStyleSheet.container, { padding: 0 }]}>
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

        <View
          style={{
            backgroundColor: colors.card,
            paddingHorizontal: 10,
            borderTopWidth: 1,
            margin: 0,
            borderTopColor: colors.borderColor
          }}
        >
          <View>
            <TouchableOpacity
              style={{
                zIndex: 0,
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
                zIndex: 0,
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
                zIndex: 0,
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
      </SafeAreaView>*/}

    </>
  );
};

export default SingleChat;