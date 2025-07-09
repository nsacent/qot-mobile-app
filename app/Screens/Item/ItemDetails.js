 

import React, { useState, useEffect, useContext } from 'react';
import { View, SafeAreaView, ScrollView, Image, TouchableOpacity, Text, Share, StyleSheet, Platform, ActivityIndicator, Linking } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Swiper from 'react-native-swiper';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonLight from '../../components/Button/ButtonLight';
import LatestAds from '../Home/LatestAds';
import ButtonOutline from '../../components/Button/ButtonOutline';
import Button from '../../components/Button/Button';
import Anotherprofile from '../profile/Anotherprofile';
import { AuthContext } from '../../contexts/AuthProvider';
import axios from 'axios';

const API_BASE_URL = 'https://qot.ug/api';

const ItemDetails = ({ navigation, route }) => {
    const { itemId } = route.params;
    const { userToken } = useContext(AuthContext);
    const theme = useTheme();
    const { colors } = theme;
    
    // States
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [similarItems, setSimilarItems] = useState([]);

    // Fetch item details
    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                setLoading(true);
                const headers = {
                    'Authorization': `Bearer ${userToken}`,
                    'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                };

                // Fetch item details with embedded relationships
                const itemResponse = await axios.get(
                    `${API_BASE_URL}/posts/${itemId}?embed=user,postType,city,pictures,savedByLoggedUser,category,fieldsValues`,
                    { headers }
                );
                
                const itemData = itemResponse.data.result;
                
                setItem({
                    ...itemData,
                    priceFormatted: itemData.price_formatted || formatPrice(itemData.price, itemData.currency_code),
                    createdDate: new Date(itemData.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })
                });

                // Set liked status
                setIsLiked(itemData.savedByLoggedUser || false);

                // Fetch similar items from same category
                if (itemData.category_id) {
                    const similarResponse = await axios.get(
                        `${API_BASE_URL}/posts?category=${itemData.category_id}&perPage=4&embed=pictures`,
                        { headers }
                    );
                    setSimilarItems(similarResponse.data.result.data.map(item => ({
                        ...item,
                        priceFormatted: item.price_formatted || formatPrice(item.price, item.currency_code)
                    })));
                }
            } catch (error) {
                console.error('Error fetching item details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [itemId, userToken]);


    const formatPrice = (price, currencyCode) => {
        const amount = parseFloat(price || 0);
        if (currencyCode === 'UGX') {
            return `${amount.toLocaleString()} UGX`;
        }
        return `$${amount.toLocaleString()}`;
    };

    const onShare = async () => {
        try {
            setIsProcessing(true);
            const result = await Share.share({
                message: `Check out this item: ${item.title} - ${item.price_formatted}`,
                url: item.url || `https://qot.ug/items/${itemId}`,
            });
        } catch (error) {
            console.error('Share error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleLike = async () => {
        try {
            setIsProcessing(true);
            const headers = {
                'Authorization': `Bearer ${userToken}`,
                'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
                'Content-Type': 'application/json'
            };

            if (isLiked) {
                await axios.delete(`${API_BASE_URL}/savedPosts/${itemId}`, { headers });
            } else {
                await axios.post(`${API_BASE_URL}/savedPosts`, { post_id: itemId }, { headers });
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Like error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReport = async () => {
        try {
            setIsProcessing(true);
            const headers = {
                'Authorization': `Bearer ${userToken}`,
                'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
                'Content-Type': 'application/json'
            };
            
            await axios.post(`${API_BASE_URL}/reports`, {
                post_id: itemId,
                report_type: 'spam',
                message: 'I want to report this item'
            }, { headers });
            
            alert('Item reported successfully');
        } catch (error) {
            console.error('Report error:', error);
            alert('Failed to report item');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMakeOffer = () => {
        navigation.navigate('MakeOffer', { 
            itemId,
            sellerId: item.user_id,
            itemTitle: item.title,
            itemPrice: item.price
        });
    };

    const handleChat = () => {
        navigation.navigate('Chat', { 
            recipientId: item.user_id,
            itemId,
            itemTitle: item.title,
            itemPrice: item.price_formatted
        });
    };

    const handleCall = () => {
        if (item.phone) {
            Linking.openURL(`tel:${item.phone}`);
        }
    };

    const handleViewProfile = () => {
        navigation.navigate('Anotherprofile', { userId: item.user_id });
    };

    if (loading || !item) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    // Get images for swiper - use pictures array if available, otherwise use main picture
    const itemImages = item.pictures && item.pictures.length > 0 
        ? item.pictures.map(pic => ({ uri: pic.url.large }))
        : item.picture 
            ? [{ uri: item.picture.url.large }] 
            : [IMAGES.detail1];

    // Render car specifications from fieldsValues
    const renderSpecifications = () => {
        if (!item.extra?.fieldsValues) return null;
        
        const specs = [];
        for (const key in item.extra.fieldsValues) {
            const field = item.extra.fieldsValues[key];
            specs.push(
                <View key={field.id} style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={[FONTS.fontXs, { color: colors.title, fontWeight: 'bold', width: 150 }]}>
                        {field.name}:
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        {field.value}
                    </Text>
                </View>
            );
        }
        
        return (
            <View style={{ marginTop: 15 }}>
                <Text style={[FONTS.fontSm, FONTS.fontMedium, { color: colors.title, marginBottom: 8 }]}>
                    Specifications
                </Text>
                {specs}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {/* Image Swiper */}
                    <View style={{ height: Platform.OS === 'web' ? SIZES.height / 3.5 : SIZES.height / 2.8 }}>
                        <Swiper
                            loop={false}
                            paginationStyle={{ bottom: 12 }}
                            dotStyle={{
                                height: 6,
                                width: 6,
                                backgroundColor: 'rgba(255,255,255,.2)',
                            }}
                            activeDotStyle={{
                                height: 8,
                                width: 8,
                                backgroundColor: COLORS.white,
                            }}
                        >
                            {itemImages.map((image, index) => (
                                <View key={index}>
                                    <Image
                                        style={{ height: '100%', width: '100%' }}
                                        source={image}
                                        resizeMode="cover"
                                    />
                                    <LinearGradient
                                        colors={["rgba(0,0,0,.5)", "rgba(0,0,0,0)"]}
                                        style={{
                                            position: 'absolute',
                                            height: 100,
                                            width: '100%'
                                        }}
                                    />
                                    <LinearGradient
                                        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]}
                                        style={{
                                            position: 'absolute',
                                            height: 40,
                                            width: '100%',
                                            bottom: 0,
                                        }}
                                    />
                                </View>
                            ))}
                        </Swiper>
                        
                        {/* Header Actions */}
                        <View style={[GlobalStyleSheet.container, {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            flexDirection: 'row'
                        }]}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={{
                                        height: 38,
                                        width: 38,
                                        borderRadius: 38,
                                        backgroundColor: 'rgba(255,255,255,.2)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <FeatherIcon size={20} color={COLORS.white} name="chevron-left" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={{
                                    height: 38,
                                    width: 38,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 8,
                                }}
                                onPress={onShare}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <FeatherIcon size={20} color={COLORS.white} name="share-2" />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    height: 38,
                                    width: 38,
                                    borderRadius: 38,
                                    backgroundColor: 'rgba(255,255,255,.2)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={toggleLike}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <FeatherIcon 
                                        size={20} 
                                        color={isLiked ? COLORS.primary : COLORS.white} 
                                        name={isLiked ? "heart" : "heart-o"} 
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Item Details Section */}
                    <View style={GlobalStyleSheet.container}>
                        <Text style={[FONTS.h6, FONTS.fontMedium, { color: colors.title, marginBottom: 4 }]}>
                            {item.title}
                        </Text>
                        {item.excerpt && (
                            <Text style={[FONTS.fontXs, { color: colors.text, marginBottom: 10 }]}>
                                {item.excerpt}
                            </Text>
                        )}
                        <Text style={[FONTS.h5, { color: colors.title, marginBottom: 10 }]}>
                            {item.price_formatted}
                        </Text>
                        
                        {/* Basic Info */}
                        <View style={{ width: '100%', borderWidth: 1, borderRadius: 10, borderColor: colors.borderColor, padding: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                {item.visits && (
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <FeatherIcon name="eye" size={14} color={colors.title} style={{ opacity: 0.5 }} />
                                            <Text style={[FONTS.fontXs, { color: colors.title }]}>Views</Text>
                                        </View>
                                        <Text style={[FONTS.fontXs, { color: colors.title }]}>{item.visits}</Text>
                                    </View>
                                )}
                                {item.city?.name && (
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <FeatherIcon name="map-pin" size={14} color={colors.title} style={{ opacity: 0.5 }} />
                                            <Text style={[FONTS.fontXs, { color: colors.title }]}>Location</Text>
                                        </View>
                                        <Text style={[FONTS.fontXs, { color: colors.title }]}>{item.city.name}</Text>
                                    </View>
                                )}
                                {item.created_at_formatted && (
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <FeatherIcon name="clock" size={14} color={colors.title} style={{ opacity: 0.5 }} />
                                            <Text style={[FONTS.fontXs, { color: colors.title }]}>Posted</Text>
                                        </View>
                                        <Text style={[FONTS.fontXs, { color: colors.title }]}>{item.created_at_formatted}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Description */}
                        <Text style={[FONTS.fontSm, FONTS.fontMedium, { color: colors.title, marginBottom: 8, marginTop: 20 }]}>
                            Description
                        </Text>
                        <View style={{
                            backgroundColor: 'rgba(0,0,0,.05)',
                            borderRadius: SIZES.radius,
                            paddingHorizontal: 15,
                            paddingVertical: 10,
                            marginBottom: 15
                        }}>
                            <Text style={[FONTS.fontXs, { color: colors.title, lineHeight: 20 }]}>
                                {item.description || 'No description provided'}
                            </Text>
                        </View>

                        {/* Specifications */}
                        {renderSpecifications()}
                    </View>

                    {/* Seller Info */}
                    <View style={GlobalStyleSheet.container}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                            paddingBottom: 20
                        }}>
                            <View>
                                <Image
                                    style={{ height: 75, width: 75, borderRadius: 15 }}
                                    source={{ uri: item.user?.photo_url || IMAGES.Small5 }}
                                />
                            </View>
                            <View style={{ marginLeft: 10, alignItems: 'flex-start', flex: 1 }}>
                                <Text style={[FONTS.fontXs, { color: colors.text, marginTop: 5 }]}>Posted by</Text>
                                <Text style={[FONTS.font, { color: colors.title, marginTop: 5 }]}>
                                    {item.user?.name || 'Unknown'}
                                </Text>
                                {item.created_at_formatted && (
                                    <Text style={[FONTS.fontXs, FONTS.fontMedium, { color: colors.text, marginTop: 5 }]}>
                                        Posted: {item.created_at_formatted}
                                    </Text>
                                )}
                                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                                    <ButtonLight
                                        onPress={handleViewProfile}
                                        size={'sm'}
                                        title="See Profile"
                                    />
                                    {item.phone && (
                                        <ButtonLight
                                            onPress={handleCall}
                                            size={'sm'}
                                            title="Call"
                                            icon="phone"
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Location and Report */}
                    <View style={GlobalStyleSheet.container}>
                        <View style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                            paddingBottom: 20,
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <View style={{ alignItems: 'flex-start' }}>
                                {item.city?.name && (
                                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 30 }}>
                                        <FeatherIcon name="map-pin" size={20} color={colors.title} />
                                        <Text style={[FONTS.font, { color: colors.title }]}>{item.city.name}</Text>
                                    </View>
                                )}
                                <View>
                                    <Text style={[FONTS.font, { color: colors.title }]}>Ad ID: {item.id}</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <ButtonLight
                                        onPress={handleReport}
                                        size={'sm'}
                                        title="Report Ad"
                                        color={COLORS.danger}
                                        loading={isProcessing}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Similar Items */}
                    <View style={GlobalStyleSheet.container}>
                        <Text style={[FONTS.h6, { color: colors.title, marginBottom: 10 }]}>Similar Ads</Text>
                        <LatestAds items={similarItems} />
                    </View>
                </ScrollView>

                {/* Bottom Buttons */}
                <View style={[GlobalStyleSheet.container, { marginTop: 10, marginBottom: Platform.OS === 'ios' ? 20 : 10 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                        <View style={{ flex: 1 }}>
                            <ButtonOutline
                                onPress={handleChat}
                                title="Chat"
                                loading={isProcessing}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button
                                onPress={handleMakeOffer}
                                title="Make Offer"
                                loading={isProcessing}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ItemDetails;