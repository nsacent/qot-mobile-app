import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { FONTS, IMAGES } from '../../constants/theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import { ApiService } from '../../../src/services/api';

const CatItem = ({ item, theme, navigation }) => {
    const { colors } = theme;
    return (
        <View style={{ width: 80, marginRight: 5 }}>
            <TouchableOpacity
                onPress={() => item.navigate === 'CarHome' 
                    ? navigation.navigate('CarHome') 
                    : navigation.navigate('Items', { cat: item.navigate })}
                style={{ alignItems: 'center' }}
            >
                <View style={{
                    height: 64,
                    width: 64,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    backgroundColor: theme.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)',
                    marginBottom: 6,
                }}>
                    <Image
                        source={{ uri: item.icon || IMAGES.placeholder }}
                        style={{
                            height: 40,
                            width: 40,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                <Text numberOfLines={1} style={[FONTS.fontXs, { color: colors.title }]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const CategoryList = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch categories from API
                const response = await ApiService.getCategories();

                console.log('Categories Response:', response);

                // Transform API data to match component expectations
                const formattedCategories = response.data.result.data.map(category => ({
                    id: category.id.toString(),
                    icon: category.image_url || IMAGES.placeholder,
                    name: category.name || 'Category',
                    navigate: category.slug || 'Items'
                }));

                const reversedCategories = formattedCategories.reverse();
                setCategories(reversedCategories.slice(0, 10)); // Limit to 10 categories

            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError(err.message || 'Failed to load categories');
                // Fallback to default categories if API fails
                setCategories(getDefaultCategories());
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Default categories in case API fails
    

    const renderItem = ({ item }) => (
        <CatItem item={item} theme={theme} navigation={navigation} />
    );

    if (loading && categories.length === 0) {
        return (
            <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
        );
    }

    if (error && categories.length === 0) {
        return (
            <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.text, marginBottom: 10 }}>{error}</Text>
                <TouchableOpacity 
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                        useEffect(() => {}, []); // Retry fetch
                    }}
                    style={{ 
                        padding: 8,
                        backgroundColor: theme.colors.primary,
                        borderRadius: 4
                    }}
                >
                    <Text style={{ color: 'white' }}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ marginHorizontal: -15 }}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingLeft: 15 }}
            />
        </View>
    );
};

export default React.memo(CategoryList);