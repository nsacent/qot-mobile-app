import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Share, Animated, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../contexts/AuthProvider';
import { format } from 'date-fns';
import MyadsSheet from '../../components/BottomSheet/MyadsSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pendingApproval = [
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car2,
        view: "25",
        like: "65"
    },
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1580.60",
        image: IMAGES.car3,
        view: "6",
        like: "60"
    },
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1320.10",
        image: IMAGES.car4,
        view: "12",
        like: "30"
    },
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car5,
        view: "25",
        like: "65"
    },
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car6,
        view: "25",
        like: "65"
    },
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car1,
        view: "25",
        like: "65"
    }
];

const archivedAds = [
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car1,
        location: "La Molina, Peru",
    },
    {
        id: "2",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car2,
        location: "La Molina, Peru",
    },
    {
        id: "3",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car3,
        location: "La Molina, Peru",
    },
    {
        id: "4",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car4,
        location: "La Molina, Peru",
    },
    {
        id: "5",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car5,
        location: "La Molina, Peru",
    },
    {
        id: "6",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car6,
        location: "La Molina, Peru",
    },
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car1,
        location: "La Molina, Peru",
    },
    {
        id: "2",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car2,
        location: "La Molina, Peru",
    },
    {
        id: "3",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car3,
        location: "La Molina, Peru",
    },
    {
        id: "4",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car4,
        location: "La Molina, Peru",
    },
    {
        id: "5",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car5,
        location: "La Molina, Peru",
    },
    {
        id: "6",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car6,
        location: "La Molina, Peru",
    },
];

const Profile = ({ navigation }) => {
    const { signOut, userData: contextUserData } = useContext(AuthContext);

    // Local state for user data, starts with context data as fallback
    const [userData, setUserData] = useState(contextUserData || null);

    useEffect(() => {
        // Load userData from AsyncStorage on mount
        const loadUserData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedUser) {
                    setUserData(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error('Failed to load user data from storage:', e);
            }
        };
        loadUserData();
    }, []);

    const scrollRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const slideIndicator = scrollX.interpolate({
        inputRange: [0, SIZES.width > SIZES.container ? SIZES.container : SIZES.width],
        outputRange: [0, (SIZES.width - 30) / 2 > SIZES.container ? (SIZES.container - 30) / 2 : (SIZES.width - 30) / 2],
        extrapolate: 'clamp',
    });

    const onPressTouch = (val) => {
        setCurrentIndex(val);
        scrollRef.current?.scrollTo({
            x: SIZES.width * val,
            animated: true,
        });
    };

    const moresheet = React.useRef();

    const theme = useTheme();
    const { colors } = theme;

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Share your profile link here.',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
                    <View style={[GlobalStyleSheet.container, { paddingBottom: 10 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ padding: 10 }}
                                onPress={() => navigation.goBack()}
                            >
                                <Image
                                    style={{ width: 18, height: 18, tintColor: colors.title }}
                                    source={IMAGES.arrowleft}
                                />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <TouchableOpacity style={{ padding: 10, }}
                                    onPress={onShare}
                                >
                                    <Image
                                        style={{ width: 18, height: 18, tintColor: colors.title }}
                                        source={IMAGES.share}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 10, }}
                                    onPress={() => navigation.navigate('Setting')}
                                >
                                    <Image
                                        style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: colors.title }}
                                        source={IMAGES.settings}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[GlobalStyleSheet.shadow2, { borderWidth: 0, backgroundColor: COLORS.primary, marginTop: 20, borderRadius: 20 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, margin: 10, marginBottom: 10 }}>
                                <Image
                                    style={{ height: 18, width: 18, resizeMode: 'contain', tintColor: '#fff' }}
                                    source={IMAGES.calendar}
                                />
                                <Text style={{ ...FONTS.fontRegular, fontSize: 13, color: COLORS.white }}>
                                    Member since {userData?.email_verified_at
                                        ? format(new Date(userData.email_verified_at), 'MMMM yyyy')
                                        : 'Not Verified'}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: COLORS.secondary, flex: 1, padding: 20, borderRadius: 20, alignItems: 'center', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', width: 85, height: 85, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: 80, width: 80, borderRadius: 50 }}
                                        source={userData?.photo_url ? { uri: userData.photo_url } : IMAGES.Small5}
                                    />
                                </View>
                                <Text style={[FONTS.fontLg, FONTS.fontSemiBold, { color: COLORS.white, fontSize: 18, marginTop: 10 }]}>{userData?.name ? userData.name : 'Anonymous'}</Text>
                                <Text style={[FONTS.font, { color: COLORS.white, marginTop: 5, opacity: .7 }]}>{userData?.email ? userData.email : 'anonymus@example.com'}</Text>
                                <View style={{ backgroundColor: COLORS.white, paddingTop: 5, borderRadius: 9, marginTop: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20 }}>
                                    <TouchableOpacity style={{ alignItems: 'center' }}
                                        onPress={() => navigation.navigate('FollowerFollowing')}
                                    >
                                        <Text style={{ ...FONTS.h6, ...FONTS.fontMedium, color: COLORS.title, }}>1520</Text>
                                        <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: COLORS.title, opacity: .7, lineHeight: 14 }}>Visits</Text>
                                    </TouchableOpacity>
                                    <LinearGradient colors={['rgba(0, 0, 0, 0.0)', 'rgba(18, 9, 46, 0.20)', 'rgba(0, 0, 0, 0.0)']}
                                        style={{ width: 2, height: 50 }}
                                    ></LinearGradient>
                                    <TouchableOpacity style={{ alignItems: 'center' }}
                                        onPress={() => navigation.navigate('FollowerFollowing')}
                                    >
                                        <Text style={{ ...FONTS.h6, ...FONTS.fontMedium, color: COLORS.title }}>360</Text>
                                        <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: COLORS.title, opacity: .7, lineHeight: 14 }}>Favourates</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 50, position: 'absolute', top: 10, right: 10 }}
                                    onPress={() => navigation.navigate('EditProfile')}
                                >
                                    <Image
                                        style={{ height: 18, width: 18, tintColor: '#fff' }}
                                        source={IMAGES.write}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>

                <SafeAreaView style={{ backgroundColor: colors.card }}>

                    <View style={[GlobalStyleSheet.container, { paddingTop: 10, paddingHorizontal: 10, padding: 0 }]}>
                        <View style={{ flexDirection: 'row', marginTop: 0, marginBottom: 0, }}>
                            <TouchableOpacity
                                onPress={() => onPressTouch(0)}
                                style={GlobalStyleSheet.TouchableOpacity2}>
                                <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77' }, currentIndex == 0 && { color: COLORS.primary }]}>Pending Approval</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => onPressTouch(1)}
                                style={GlobalStyleSheet.TouchableOpacity2}>
                                <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77' }, currentIndex == 1 && { color: COLORS.primary }]}>Archieved Ads</Text>
                            </TouchableOpacity>
                            <Animated.View
                                style={{
                                    backgroundColor: COLORS.primary,
                                    width: '50%',
                                    height: 3,
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    transform: [{ translateX: slideIndicator }]
                                }}>
                            </Animated.View>
                        </View>
                    </View>
                    <View style={[Platform.OS === 'web' && GlobalStyleSheet.container, { padding: 0 }]}>
                        <ScrollView
                            horizontal
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            ref={scrollRef}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: false }
                            )}
                            onMomentumScrollEnd={(e) => {
                                if (e.nativeEvent.contentOffset.x.toFixed(0) == SIZES.width.toFixed(0)) {
                                    setCurrentIndex(1);
                                } else if (e.nativeEvent.contentOffset.x.toFixed(0) == 0) {
                                    setCurrentIndex(0);
                                } else {
                                    setCurrentIndex(0);
                                }
                            }}>

                            <View style={{ marginTop: 20, width: SIZES.width > SIZES.container ? SIZES.container : SIZES.width, flex: 1 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: 80 }}>
                                        {pendingApproval.map((data, index) => {
                                            return (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[
                                                        GlobalStyleSheet.shadow2,
                                                        {
                                                            borderColor: colors.border,
                                                            backgroundColor: colors.card,
                                                            padding: 10,
                                                            paddingLeft: 20,
                                                            marginBottom: 20
                                                        }
                                                    ]}
                                                    onPress={() => navigation.navigate('ItemDetails')}
                                                >
                                                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10 }}>
                                                        <Image
                                                            style={{ height: 70, width: 70, borderRadius: 6 }}
                                                            source={data.image}
                                                        />
                                                        <View style={{ marginLeft: 10 }}>
                                                            <Text numberOfLines={1} style={{ ...FONTS.fontSm, ...FONTS.fontSemiBold, color: colors.title, paddingRight: 150 }}>{data.title}</Text>
                                                            <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, marginTop: 2 }}>{data.price}</Text>
                                                            <View style={{ backgroundColor: COLORS.primary, width: 100, borderRadius: 20, alignItems: 'center', padding: 2, marginTop: 5 }}>
                                                                <Text style={{ ...FONTS.fontSm, color: colors.card }}>ACTIVE</Text>
                                                            </View>
                                                            <TouchableOpacity style={{ position: 'absolute', right: 50, margin: 10, marginTop: 5 }}
                                                                onPress={() => moresheet.current.openSheet()}
                                                            >
                                                                <Image
                                                                    style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: colors.title }}
                                                                    source={IMAGES.more}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 0 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: colors.text }}
                                                                    source={IMAGES.eye}
                                                                />
                                                                <Text style={{ ...FONTS.fontXs, color: colors.text }}>Views :</Text>
                                                                <Text style={{ ...FONTS.fontXs, color: colors.title }}>{data.view}</Text>
                                                            </View>
                                                            <View style={{ height: 15, width: 1, backgroundColor: colors.borderColor }}></View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                                <Image
                                                                    style={{ width: 15, height: 15, resizeMode: 'contain' }}
                                                                    source={IMAGES.like}
                                                                />
                                                                <Text style={{ ...FONTS.fontXs, color: colors.text }}>Likes :</Text>
                                                                <Text style={{ ...FONTS.fontXs, color: colors.title }}>{data.like}</Text>
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity style={[GlobalStyleSheet.background, { marginRight: 5, height: 40, width: 40, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)', }]}>
                                                            <Image
                                                                style={{ height: 20, width: 20, tintColor: colors.title }}
                                                                source={IMAGES.delete}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ width: 5, height: 150, backgroundColor: COLORS.primary, position: 'absolute', left: -1, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}></View>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </ScrollView>
                            </View>

                            <View style={{ marginTop: 20, width: SIZES.width > SIZES.container ? SIZES.container : SIZES.width, flex: 1 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: 80 }}>
                                        {archivedAds.map((item, index2) => (
                                            <TouchableOpacity
                                                key={index2}
                                                style={[
                                                    GlobalStyleSheet.shadow2,
                                                    {
                                                        borderColor: colors.border,
                                                        backgroundColor: colors.card,
                                                        padding: 10,
                                                        marginBottom: 20
                                                    }
                                                ]}
                                                onPress={() => navigation.navigate('ItemDetails')}
                                            >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                                        <Image
                                                            style={{ width: 70, height: 70, borderRadius: 6 }}
                                                            source={item.image}
                                                        />
                                                        <View style={{ marginLeft: 10 }}>
                                                            <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, fontSize: 16 }}>{item.price}</Text>
                                                            <Text numberOfLines={1} style={{ ...FONTS.fontSm, ...FONTS.fontSemiBold, color: colors.title, paddingRight: 150, marginTop: 2, }}>{item.title}</Text>
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    marginTop: 5,
                                                                }}
                                                            >
                                                                <FeatherIcon size={12} color={colors.text} name={'map-pin'} />
                                                                <Text style={[FONTS.fontXs, { fontSize: 11, color: colors.text, marginLeft: 4 }]}>{item.location}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ marginRight: 10 }}>
                                                        <Image
                                                            style={{ width: 25, height: 25, resizeMode: 'contain' }}
                                                            source={IMAGES.like}
                                                        />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>

                    <MyadsSheet
                        ref={moresheet}
                    />
                </SafeAreaView>
            </ScrollView>
        </>
    );
};

export default Profile;

/*

import React, { useContext, useRef, useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, Image, TouchableOpacity,
    Share, Animated, Platform, Alert, ScrollView
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../../contexts/AuthProvider';
import { format } from 'date-fns';
import MyadsSheet from '../../components/BottomSheet/MyadsSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const archivedAds = [
    {
        id: "1",
        title: "NIKON CORPORATION, NIKON D5500",
        price: "$1288.50",
        image: IMAGES.car1,
        location: "La Molina, Peru",
    },
    {
        id: "2",
        title: "Canon EOS 5D Mark IV",
        price: "$1890.00",
        image: IMAGES.car2,
        location: "Kampala, Uganda",
    },
    {
        id: "3",
        title: "Sony Alpha a7 III",
        price: "$2200.99",
        image: IMAGES.car3,
        location: "Wakiso, Uganda",
    },
];

const Profile = ({ navigation }) => {
    const { signOut, userData: contextUserData, userToken } = useContext(AuthContext);
    const [userData, setUserData] = useState(contextUserData || null);
    const [pendingApproval, setPendingApproval] = useState([]);
    const scrollRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const moresheet = useRef();
    const theme = useTheme();
    const { colors } = theme;

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('userData');
                if (storedUser) setUserData(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to load user data from storage:', e);
            }
        };

        const fetchPendingPosts = async () => {
            try {
                const res = await axios.get('https://qot.ug/api/posts', {
                    headers: {
                        Authorization: userToken.startsWith('Bearer ') ? userToken : `Bearer ${userToken}`,
                        'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Content-Language': 'en',
                    },
                    params: {
                        belongLoggedUser: 1,
                        //pendingApproval: 1,
                        embed: 'pictures,category,city',
                        sort: 'created_at',
                    },
                });
                setPendingApproval(res.data.result.data);
            } catch (error) {
                console.error('Error fetching pending posts:', error.response?.data || error.message);
                Alert.alert('Error', 'Failed to fetch pending approval posts.');
            }
        };

        loadUserData();
        fetchPendingPosts();
    }, [userToken]);

    const onPressTouch = (val) => {
        setCurrentIndex(val);
        scrollRef.current?.scrollTo({ x: SIZES.width * val, animated: true });
    };

    const onShare = async () => {
        try {
            await Share.share({ message: 'Share your profile link here.' });
        } catch (error) {
            alert(error.message);
        }
    };

    const slideIndicator = scrollX.interpolate({
        inputRange: [0, SIZES.width > SIZES.container ? SIZES.container : SIZES.width],
        outputRange: [0, (SIZES.width - 30) / 2 > SIZES.container ? (SIZES.container - 30) / 2 : (SIZES.width - 30) / 2],
        extrapolate: 'clamp',
    });

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
                    <View style={[GlobalStyleSheet.container, { paddingBottom: 10 }]}>
                        {//* Header and profile details *}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ padding: 10 }}
                                onPress={() => navigation.goBack()}
                            >
                                <Image
                                    style={{ width: 18, height: 18, tintColor: colors.title }}
                                    source={IMAGES.arrowleft}
                                />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <TouchableOpacity style={{ padding: 10, }}
                                    onPress={onShare}
                                >
                                    <Image
                                        style={{ width: 18, height: 18, tintColor: colors.title }}
                                        source={IMAGES.share}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 10, }}
                                    onPress={() => navigation.navigate('Setting')}
                                >
                                    <Image
                                        style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: colors.title }}
                                        source={IMAGES.settings}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                         <View style={[GlobalStyleSheet.shadow2, { borderWidth: 0, backgroundColor: COLORS.primary, marginTop: 20, borderRadius: 20 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, margin: 10, marginBottom: 10 }}>
                                <Image
                                    style={{ height: 18, width: 18, resizeMode: 'contain', tintColor: '#fff' }}
                                    source={IMAGES.calendar}
                                />
                                <Text style={{ ...FONTS.fontRegular, fontSize: 13, color: COLORS.white }}>
                                    Member since {userData?.email_verified_at
                                        ? format(new Date(userData.email_verified_at), 'MMMM yyyy')
                                        : 'Not Verified'}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: COLORS.secondary, flex: 1, padding: 20, borderRadius: 20, alignItems: 'center', borderTopLeftRadius: 25, borderTopRightRadius: 25 }}>
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', width: 85, height: 85, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ height: 80, width: 80, borderRadius: 50 }}
                                        source={userData?.photo_url ? { uri: userData.photo_url } : IMAGES.Small5}
                                    />
                                </View>
                                <Text style={[FONTS.fontLg, FONTS.fontSemiBold, { color: COLORS.white, fontSize: 18, marginTop: 10 }]}>{userData?.name ? userData.name : 'Anonymous'}</Text>
                                <Text style={[FONTS.font, { color: COLORS.white, marginTop: 5, opacity: .7 }]}>{userData?.email ? userData.email : 'anonymus@example.com'}</Text>
                                <View style={{ backgroundColor: COLORS.white, paddingTop: 5, borderRadius: 9, marginTop: 15, flexDirection: 'row', gap: 20, paddingHorizontal: 20 }}>
                                    <TouchableOpacity style={{ alignItems: 'center' }}
                                        onPress={() => navigation.navigate('FollowerFollowing')}
                                    >
                                        <Text style={{ ...FONTS.h6, ...FONTS.fontMedium, color: COLORS.title, }}>1520</Text>
                                        <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: COLORS.title, opacity: .7, lineHeight: 14 }}>Visits</Text>
                                    </TouchableOpacity>
                                    <LinearGradient colors={['rgba(0, 0, 0, 0.0)', 'rgba(18, 9, 46, 0.20)', 'rgba(0, 0, 0, 0.0)']}
                                        style={{ width: 2, height: 50 }}
                                    ></LinearGradient>
                                    <TouchableOpacity style={{ alignItems: 'center' }}
                                        onPress={() => navigation.navigate('FollowerFollowing')}
                                    >
                                        <Text style={{ ...FONTS.h6, ...FONTS.fontMedium, color: COLORS.title }}>360</Text>
                                        <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: COLORS.title, opacity: .7, lineHeight: 14 }}>Favourates</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 50, position: 'absolute', top: 10, right: 10 }}
                                    onPress={() => navigation.navigate('EditProfile')}
                                >
                                    <Image
                                        style={{ height: 18, width: 18, tintColor: '#fff' }}
                                        source={IMAGES.write}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 0 }}>
                            <TouchableOpacity onPress={() => onPressTouch(0)} style={GlobalStyleSheet.TouchableOpacity2}>
                                <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77' }, currentIndex == 0 && { color: COLORS.primary }]}>
                                    Pending Approval
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onPressTouch(1)} style={GlobalStyleSheet.TouchableOpacity2}>
                                <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77' }, currentIndex == 1 && { color: COLORS.primary }]}>
                                    Archived Ads
                                </Text>
                            </TouchableOpacity>
                            <Animated.View style={{
                                backgroundColor: COLORS.primary,
                                width: '50%',
                                height: 3,
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                transform: [{ translateX: slideIndicator }]
                            }} />
                        </View>
                    </View>

                    <View style={[Platform.OS === 'web' && GlobalStyleSheet.container, { padding: 0 }]}>
                        <ScrollView
                            horizontal
                            scrollEventThrottle={16}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            ref={scrollRef}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: false }
                            )}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / SIZES.width);
                                setCurrentIndex(index);
                            }}
                        >
                            {// Pending Approval Tab }
                            <View style={{ marginTop: 20, width: SIZES.width, flex: 1 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: 80 }}>
                                        {pendingApproval.map((data, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => navigation.navigate('ItemDetails', { id: data.id })}
                                                style={[GlobalStyleSheet.shadow2, {
                                                    borderColor: colors.border,
                                                    backgroundColor: colors.card,
                                                    padding: 10,
                                                    paddingLeft: 20,
                                                    marginBottom: 20
                                                }]}
                                            >
                                                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10 }}>
                                                    <Image
                                                        style={{ height: 70, width: 70, borderRadius: 6 }}
                                                        source={{ uri: data?.pictures?.[0]?.filename || 'https://via.placeholder.com/70' }}
                                                    />
                                                    <View style={{ marginLeft: 10 }}>
                                                        <Text numberOfLines={1} style={{ ...FONTS.fontSm, ...FONTS.fontSemiBold, color: colors.title }}>{data.title}</Text>
                                                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, marginTop: 2 }}>{data.price}</Text>
                                                        <View style={{ backgroundColor: COLORS.primary, width: 100, borderRadius: 20, alignItems: 'center', padding: 2, marginTop: 5 }}>
                                                            <Text style={{ ...FONTS.fontSm, color: colors.card }}>PENDING</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {// Archived Ads Tab *}
                            <View style={{ marginTop: 20, width: SIZES.width, flex: 1 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: 80 }}>
                                        {archivedAds.map((item, index2) => (
                                            <TouchableOpacity
                                                key={index2}
                                                style={[GlobalStyleSheet.shadow2, {
                                                    borderColor: colors.border,
                                                    backgroundColor: colors.card,
                                                    padding: 10,
                                                    marginBottom: 20
                                                }]}
                                                onPress={() => navigation.navigate('ItemDetails')}
                                            >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image style={{ width: 70, height: 70, borderRadius: 6 }} source={item.image} />
                                                    <View style={{ marginLeft: 10 }}>
                                                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title }}>{item.price}</Text>
                                                        <Text numberOfLines={1} style={{ ...FONTS.fontSm, ...FONTS.fontSemiBold, color: colors.title }}>{item.title}</Text>
                                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                            <FeatherIcon size={12} color={colors.text} name="map-pin" />
                                                            <Text style={[FONTS.fontXs, { color: colors.text, marginLeft: 4 }]}>{item.location}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
                <MyadsSheet ref={moresheet} />
            </ScrollView>
        </>
    );
};

export default Profile;

*/