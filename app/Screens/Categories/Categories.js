import React, { useState, useEffect } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { FONTS, IMAGES, SIZES } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { ApiService } from '../../../src/services/api';

const Categories = ({ navigation }) => {
    const { colors } = useTheme();
    const [layout, setLayout] = useState('grid');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await ApiService.getCategories();
            const formattedCategories = response.data.result.data
                .map(category => ({
                    id: category.id.toString(),
                    icon: { uri: category.image_url || IMAGES.placeholder },
                    name: category.name || 'Category',
                    navigate: category.slug || 'Items'
                }))
                .reverse();

            setCategories(formattedCategories);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError(err.message || 'Failed to load categories');
            setCategories(getDefaultCategories());
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getDefaultCategories = () => [

        { id: '1', icon: IMAGES.cat1, name: 'Cars', navigate: 'CarHome' },
        { id: '2', icon: IMAGES.cat2, name: 'Mobiles', navigate: 'Mobile' },
        { id: '3', icon: IMAGES.cat3, name: 'Properties', navigate: 'Properties' },
        { id: '4', icon: IMAGES.cat4, name: 'Jobs', navigate: 'Jobs' },
        { id: '5', icon: IMAGES.cat5, name: 'Bikes', navigate: 'Bike' },
        { id: '6', icon: IMAGES.cat6, name: 'Electronics & Appliances', navigate: 'Electronics' },
        { id: '7', icon: IMAGES.cat7, name: 'Furniture', navigate: 'Furniture' },
        { id: '8', icon: IMAGES.cat8, name: 'Fashion', navigate: 'Fashion' },
        { id: '9', icon: IMAGES.cat9, name: 'Pets', navigate: 'Pets' },
        { id: '10', icon: IMAGES.cat10, name: 'Books, Sports & Hobbies', navigate: 'Books' },
        { id: '11', icon: IMAGES.cat11, name: 'Services', navigate: 'Service' },
    ];

    const handleLayout = (val) => {
        setLayout(val);
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCategories();
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const renderItem = ({ item }) => (
        <View style={[layout === 'grid' && {
            width: '33.33%',
            height: 110,
            paddingHorizontal: 5,
            marginBottom: 10,
        }]}>
            <TouchableOpacity
                onPress={() => item.navigate === 'CarHome'
                    ? navigation.navigate('CarHome')
                    : navigation.navigate('Items', { cat: item.navigate })}
                activeOpacity={.8}
                style={[layout === 'grid' ? {
                    alignItems: 'center',
                    backgroundColor: colors.card,
                    flex: 1,
                    borderRadius: SIZES.radius,
                    paddingHorizontal: 10,
                    shadowColor: "rgba(0,0,0,.5)",
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 10,
                } : {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 18,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }]}
            >
                <Image
                    style={[layout === 'grid' ? {
                        height: 42,
                        width: 42,
                        resizeMode: 'contain',
                        marginTop: 15,
                    } : {
                        height: 24,
                        width: 24,
                        resizeMode: 'contain',
                        marginRight: 13,
                    }]}
                    source={typeof item.icon === 'string' ? { uri: item.icon } : item.icon}
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[layout === 'grid' ? {
                        ...FONTS.fontSm,
                        color: colors.title,
                        textAlign: 'center',
                    } : {
                        ...FONTS.font,
                        fontSize: 16,
                        color: colors.title,
                    }]}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    if (loading && categories.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <Header
                    leftIcon={'back'}
                    title={'Categories'}
                    titleLeft
                    grid={true}
                    handleLayout={handleLayout}
                    layout={layout}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (error && categories.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <Header
                    leftIcon={'back'}
                    title={'Categories'}
                    titleLeft
                    grid={true}
                    handleLayout={handleLayout}
                    layout={layout}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: colors.text, marginBottom: 10 }}>{error}</Text>
                    <TouchableOpacity
                        onPress={fetchCategories}
                        style={{
                            padding: 10,
                            backgroundColor: colors.primary,
                            borderRadius: 5
                        }}
                    >
                        <Text style={{ color: 'white' }}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Header
                leftIcon={'back'}
                title={'Categories'}
                titleLeft
                grid={true}
                handleLayout={handleLayout}
                layout={layout}
            />

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                key={layout}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]} // Android
                        tintColor={colors.primary} // iOS
                    />
                }
                contentContainerStyle={[GlobalStyleSheet.container, {
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                }]}
                numColumns={layout === 'grid' ? 3 : 1}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
};

export default Categories;