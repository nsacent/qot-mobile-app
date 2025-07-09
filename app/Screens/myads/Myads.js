import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Animated,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';
import MyadsSheet from '../../components/BottomSheet/MyadsSheet';
import { getCityName, preloadCities } from '../../../src/services/cityService';

const API_BASE_URL = 'https://qot.ug/api';

const Myads = ({ navigation }) => {
    const { userToken, userData } = useContext(AuthContext);
    const theme = useTheme();
    const { colors } = theme;

    // Refs
    const scrollRef = useRef();
    const moresheet = useRef();
    const scrollX = useRef(new Animated.Value(0)).current;

    // States
    const [currentIndex, setCurrentIndex] = useState(0);
    const [ads, setAds] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [citiesLoaded, setCitiesLoaded] = useState(false);

    // Slide indicator animation
    const slideIndicator = scrollX.interpolate({
        inputRange: [0, SIZES.width > SIZES.container ? SIZES.container : SIZES.width],
        outputRange: [0, (SIZES.width - 30) / 2],
        extrapolate: 'clamp',
    });

    // Preload cities on mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Preload known cities first
                await preloadCities(userToken);

                // Then fetch both ads and favorites in parallel
                const [adsResponse, favoritesResponse] = await Promise.all([
                    fetchAdsData(),
                    fetchFavoritesData()
                ]);

                // Process both datasets with city information
                const [processedAds, processedFavorites] = await Promise.all([
                    processItemsWithCities(adsResponse?.data?.result?.data || [], userToken),
                    processItemsWithCities(favoritesResponse?.data?.result?.data || [], userToken)
                ]);

                setAds(processedAds);
                setFavourites(processedFavorites);

            } catch (error) {
                console.error('Initialization error:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
                setCitiesLoaded(true);
                console.log('FAVSSSSSSSSSSSSSFFFAFAF:',favourites);
                console.log('FAVSSSSSSSSSSSSSFFFAFAF:',ads);
            }
        };

        loadInitialData();
    }, [userToken]);

    const getHeaders = () => ({
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
    });

    // Format price with currency
    const formatPrice = (price, currencyCode) => {
        const amount = parseFloat(price || 0);
        if (currencyCode === 'UGX') {
            return `${amount.toLocaleString()} UGX`;
        }
        return `$${amount.toLocaleString()}`;
    };

    // Fetch user ads with city names
    // Modified fetchAds to handle city loading more gracefully
    // Helper function to fetch raw ads data
    const fetchAdsData = async () => {
        const headers = getHeaders();
        return axios.get(`${API_BASE_URL}/posts?belongLoggedUser=1&embed=pictures`, {
            headers,
            timeout: 10000
        });
    };


    // Helper function to fetch raw favorites data
    const fetchFavoritesData = async () => {
        const headers = getHeaders();
        return axios.get(`${API_BASE_URL}/savedPosts?embed=pictures`, {
            headers,
            timeout: 10000
        });
    };

    // Helper function to process items with city information
    const processItemsWithCities = async (items, userToken) => {
        return Promise.all(
            items.map(async (item) => {
                const cityName = await getCityName(item.city_id, userToken);
                return {
                    ...item,
                    id: item.id.toString(),
                    cityName,
                    priceFormatted: formatPrice(item.price, item.currency_code),
                    pictures: item.pictures || [],
                    views_count: item.visits || 0,
                };
            })
        );
    };

    // Handle tab switch
    const onPressTouch = (index) => {
        setCurrentIndex(index);
        scrollRef.current?.scrollTo({ x: SIZES.width * index, animated: true });
    };

    // Handle delete ad
    const handleDelete = async (adId) => {
        try {
            const headers = getHeaders();
            await axios.delete(`${API_BASE_URL}/user/posts/${adId}`, { headers });
            setAds(prev => prev.filter(item => item.id !== adId));
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete ad. Please try again.');
        }
    };


    // Safe image handling
    const getImageSource = (pictures) => {
        if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
            return IMAGES.car1;
        }

        const firstPicture = pictures[0];
        if (!firstPicture?.url?.medium) {
            return IMAGES.car1;
        }

        return { uri: firstPicture.url.medium };
    };

    // Render ad item
    const renderAdItem = (data) => (
        <TouchableOpacity
            key={data.id}
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
            onPress={() => navigation.navigate('ItemDetails', { id: data.id })}
        >
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10 }}>
                <Image
                    style={{ height: 70, width: 70, borderRadius: 6 }}
                    source={getImageSource(data.pictures)}
                    resizeMode="cover"
                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                />
                <View style={{ marginLeft: 10 }}>
                    <Text numberOfLines={1} style={{ ...FONTS.fontSm, ...FONTS.fontSemiBold, color: colors.title, paddingRight: 150 }}>{data.title}</Text>
                    <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, marginTop: 2 }}>{data.priceFormatted}</Text>
                    <View style={{ backgroundColor: COLORS.primary, width: 100, borderRadius: 20, alignItems: 'center', padding: 2, marginTop: 5 }}>
                        <Text style={{ ...FONTS.fontSm, color: colors.card }}>ACTIVE</Text>
                    </View>
                    <TouchableOpacity
                        style={{ position: 'absolute', right: 50, margin: 10, marginTop: 5 }}
                        onPress={() => moresheet.current?.openSheet(data.id)}
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
                        <Text style={{ ...FONTS.fontXs, color: colors.title }}>{data.views_count}</Text>
                    </View>
                    <View style={{ height: 15, width: 1, backgroundColor: colors.borderColor }}></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Image
                            style={{ width: 15, height: 15, resizeMode: 'contain' }}
                            source={IMAGES.like}
                        />
                        <Text style={{ ...FONTS.fontXs, color: colors.text }}>Likes :</Text>
                        <Text style={{ ...FONTS.fontXs, color: colors.title }}>{data.likes_count}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[GlobalStyleSheet.background, { marginRight: 5, height: 40, width: 40, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)' }]}
                    onPress={() => handleDelete(data.id)}
                >
                    <Image
                        style={{ height: 20, width: 20, tintColor: colors.title }}
                        source={IMAGES.delete}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ width: 5, height: 150, backgroundColor: COLORS.primary, position: 'absolute', left: -1, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}></View>
        </TouchableOpacity>
    );

    // Render favorite item
    const renderFavoriteItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={[
                GlobalStyleSheet.shadow2,
                {
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    padding: 10,
                    marginBottom: 20
                }
            ]}
            onPress={() => navigation.navigate('ItemDetails', { id: item.id })}
        >
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Image
                        style={{ width: 70, height: 70, borderRadius: 6 }}
                        source={getImageSource(item.pictures)}
                        resizeMode="cover"
                        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: colors.title, fontSize: 16 }}>{item.priceFormatted}</Text>
                        <Text numberOfLines={1} style={{ ...FONTS.fontSm, ...FONTS.fontSemiBold, color: colors.title, paddingRight: 150, marginTop: 2 }}>{item.title}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <FeatherIcon size={12} color={colors.text} name={'map-pin'} />
                            <Text style={[FONTS.fontXs, { fontSize: 11, color: colors.text, marginLeft: 4 }]}>{item.cityName}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity>
                    <View style={{ marginRight: 10 }}>
                        <Image
                            style={{ width: 25, height: 25, resizeMode: 'contain' }}
                            source={IMAGES.like}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title="My Ads"
                leftIcon={'back'}
                titleLeft
                onPressLeft={() => navigation.goBack()}
            />

            {!citiesLoaded && (
                <View style={{ padding: 20 }}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
            )}

            <View style={[GlobalStyleSheet.container, { paddingTop: 10, paddingHorizontal: 10, padding: 0 }]}>
                <View style={{ flexDirection: 'row', marginTop: 0, marginBottom: 0 }}>
                    <TouchableOpacity
                        onPress={() => onPressTouch(0)}
                        style={GlobalStyleSheet.TouchableOpacity2}>
                        <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77' }, currentIndex == 0 && { color: COLORS.primary }]}>Ads</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onPressTouch(1)}
                        style={GlobalStyleSheet.TouchableOpacity2}>
                        <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: '#475A77' }, currentIndex == 1 && { color: COLORS.primary }]}>Favourites</Text>
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
                        }}
                    />
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
                            setCurrentIndex(1)
                        } else if (e.nativeEvent.contentOffset.x.toFixed(0) == 0) {
                            setCurrentIndex(0)
                        } else {
                            setCurrentIndex(0)
                        }
                    }}
                >
                    {/* Ads Tab */}
                    <View style={{
                        marginTop: 20, width: SIZES.width > SIZES.container ? SIZES.container : SIZES.width, flex: 1, paddingBottom: 20 // Add padding at the bottom
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                            paddingHorizontal: 10,
                            paddingBottom: 80 // Increased bottom padding
                        }}>
                            <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: 80 }}>
                                {loading ? (
                                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
                                ) : error ? (
                                    <Text style={{ ...FONTS.fontRegular, color: colors.text, textAlign: 'center', marginTop: 20 }}>
                                        {error}
                                    </Text>
                                ) : ads.length > 0 ? (
                                    ads.map(renderAdItem)
                                ) : (
                                    <Text style={{ ...FONTS.fontRegular, color: colors.text, textAlign: 'center', marginTop: 20 }}>
                                        You haven't posted any ads yet.
                                    </Text>
                                )}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Favorites Tab */}
                    <View style={{
                        marginTop: 20, width: SIZES.width > SIZES.container ? SIZES.container : SIZES.width, flex: 1, paddingBottom: 20
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                            paddingHorizontal: 10,
                            paddingBottom: 80
                        }}>
                            <View style={{ paddingHorizontal: 10, flex: 1, paddingBottom: 80 }}>
                                {favourites.length > 0 ? (
                                    favourites.map(renderFavoriteItem)
                                ) : (
                                    <Text style={{ ...FONTS.fontRegular, color: colors.text, textAlign: 'center', marginTop: 20 }}>
                                        No favorites yet.
                                    </Text>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>

            <MyadsSheet
                ref={moresheet}
                onDelete={handleDelete}
            />
        </SafeAreaView>
    )
}

export default Myads;