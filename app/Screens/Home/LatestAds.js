import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import CardStyle1 from '../../components/Card/CardStyle1';
import { useTheme } from '@react-navigation/native';
import postsService from '../../../src/services/postsService';
import getImageSource,{ formatPrice } from '../../../src/services/utils';
import { getCityName } from '../../../src/services/cityService';
import { AuthContext } from '../../contexts/AuthProvider';

const LatestAds = () => {
    const theme = useTheme();
    const colors = theme.colors;
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userToken } = useContext(AuthContext);

    const getName = async (cityId) => {
        try {
            const city = await getCityName(cityId, userToken);
            return city || 'Unknown Location';
        } catch (error) {
            console.error('Error fetching city name:', error);
            return 'Unknown Location';
        }
    };

    useEffect(() => {
        const fetchLatestAds = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch latest ads from API
                const response = await postsService.posts.getAll({
                    perPage: 5,
                    sort: 'newest',
                    embed: 'pictures'
                });

                // Transform API data
                console.log('Latest Ads Response:', response);

                const formattedAds = (response?.data?.result?.data || []).map(item => ({
                    id: item.id?.toString() || Math.random().toString(),
                    image: getImageSource(item.pictures, 'medium'),
                    title: item.title || 'No title',
                    price: formatPrice(item.price, item.currency_code),
                    location: getName(item.city_id) || 'Location not specified',
                    trending: true || false
                }));

                setAds(formattedAds);
            } catch (err) {
                console.error('Failed to fetch latest ads:', err);
                setError(err.message || 'Failed to load ads');
                setAds([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestAds();
    }, []);

    if (loading && ads.length === 0) {
        return (
            <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    }

    if (error && ads.length === 0) {
        return (
            <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.text, marginBottom: 10 }}>{error}</Text>
                <TouchableOpacity
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                        useEffect(() => { }, []); // Retry fetch
                    }}
                    style={{
                        padding: 8,
                        backgroundColor: colors.primary,
                        borderRadius: 4
                    }}
                >
                    <Text style={{ color: 'white' }}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ marginHorizontal: -15, backgroundColor: colors.card }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingLeft: 15,
                    paddingBottom: 15,
                    paddingTop: 10,
                }}
            >
                {ads.map((item, index) => (
                    <View
                        key={`${item.id}-${index}`}
                        style={{
                            marginRight: 10,
                            width: 160,
                        }}
                    >
                        <CardStyle1 item={item} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default React.memo(LatestAds);