import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, SafeAreaView, TouchableOpacity, Image, ScrollView, Text, ActivityIndicator, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import SearchBar from '../../components/SearchBar';
import { COLORS, FONTS, IMAGES, SIZES } from '../../constants/theme';
import CardStyle1 from '../../components/Card/CardStyle1';
import FilterSheet from '../../components/BottomSheet/FilterSheet';
import ShortfilterSheet from '../../components/BottomSheet/ShortfilterSheet';
import SortbySheet from '../../components/BottomSheet/SortbySheet';
import postsService from '../../../src/services/postsService';
import { formatPrice } from '../../../src/services/utils';
import { AuthContext} from '../../contexts/AuthProvider';

const Items = ({ route, navigation }) => {
    const { cat } = route.params || {};
    const { colors } = useTheme();
    const { userToken } = useContext(AuthContext);

    const [layout, setLayout] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const sheetRef = useRef();
    const moreRef = useRef();
    const openRef = useRef();

    const fetchItems = async (pageNum = 1, refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
                setPage(1);
            } else {
                setLoading(true);
            }
            
            setError(null);

            const response = await postsService.posts.getAll({
                category_id: cat.id,
                perPage: 12,
                sort: 'created_at',
                embed: 'pictures,city',
                page: pageNum
            });

            const newItems = response.data?.result?.data || [];
            
            if (refresh) {
                setItems(newItems);
            } else {
                setItems(prevItems => [...prevItems, ...newItems]);
            }

            // Check if there are more pages
            setHasMore(pageNum < response.data?.result?.meta?.last_page);
        } catch (err) {
            console.error('Failed to fetch items:', err);
            setError(err.message || 'Failed to load items');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        fetchItems(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => {
                const nextPage = prevPage + 1;
                fetchItems(nextPage);
                return nextPage;
            });
        }
    };

    useEffect(() => {
        if (cat?.id) {
            fetchItems();
        }
    }, [cat]);

    const handleLayout = (val) => {
        setLayout(val);
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    };

    if (loading && !items.length) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (error && !items.length) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.title }}>{error}</Text>
                <TouchableOpacity 
                    style={{ marginTop: 10, padding: 10, backgroundColor: COLORS.primary, borderRadius: 5 }}
                    onPress={onRefresh}
                >
                    <Text style={{ color: 'white' }}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={[GlobalStyleSheet.container, { paddingBottom: 5 }]}>
                {/* Header with Search and Filter */}
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <SearchBar />
                    </View>
                    <TouchableOpacity
                        style={{ padding: 14, marginLeft: 5 }}
                        onPress={() => sheetRef.current.openSheet()}
                    >
                        <Image
                            style={{
                                height: 20,
                                width: 20,
                                resizeMode: 'contain',
                                tintColor: colors.title,
                            }}
                            source={IMAGES.filter}
                        />
                    </TouchableOpacity>
                </View>

                {/* Sorting and Layout Options */}
                <View style={{
                    backgroundColor: colors.card,
                    marginHorizontal: -15,
                    flexDirection: 'row',
                    marginTop: 10,
                    height: 54,
                    alignItems: 'center',
                }}>
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 15 }}
                        >
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    borderWidth: 1,
                                    borderColor: colors.borderColor,
                                    borderRadius: SIZES.radius,
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    marginRight: 8,
                                }}
                                onPress={() => openRef.current.openSheet()}
                            >
                                <Octicons size={16} color={colors.textLight} style={{ marginRight: 6 }} name='sort-desc' />
                                <Text style={[FONTS.fontSm, { color: colors.title, marginRight: 4 }]}>Sort By</Text>
                                <FeatherIcon color={colors.text} size={18} name="chevron-down" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignSelf: 'center',
                                    borderWidth: 1,
                                    borderColor: colors.borderColor,
                                    borderRadius: SIZES.radius,
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    marginRight: 8,
                                }}
                                onPress={() => moreRef.current.openSheet()}
                            >
                                <Text style={[FONTS.fontSm, { color: colors.title, marginRight: 4 }]}>Year</Text>
                                <FeatherIcon color={colors.text} size={18} name="chevron-down" />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => handleLayout('grid')}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={{
                                    height: 22,
                                    width: 22,
                                    resizeMode: 'contain',
                                    tintColor: layout === 'grid' ? COLORS.primary : '#BEB9CD',
                                }}
                                source={IMAGES.grid}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleLayout('list')}
                            style={{ padding: 10 }}
                        >
                            <Image
                                style={{
                                    height: 22,
                                    width: 22,
                                    resizeMode: 'contain',
                                    tintColor: layout === 'list' ? COLORS.primary : '#BEB9CD',
                                }}
                                source={IMAGES.grid2}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Items List */}
            <FlatList
                data={items}
                key={layout} // Force re-render when layout changes
                keyExtractor={(item) => item.id.toString()}
                numColumns={layout === 'grid' ? 2 : 1}
                contentContainerStyle={[
                    GlobalStyleSheet.container,
                    {
                        padding: 0,
                        paddingHorizontal: 10
                    }
                ]}
                renderItem={({ item }) => (
                    <View
                        style={[
                            { marginBottom: 10 }, 
                            layout === 'grid' && [GlobalStyleSheet.col50, { marginBottom: 15 }]
                        ]}
                    >
                        <CardStyle1
                            list={layout === 'list'}
                            item={{
                                id: item.id,
                                image: item.picture?.url?.medium || IMAGES.placeholder,
                                title: item.title || 'No title',
                                price: formatPrice(item.price, item.currency_code) || 'N/A',
                                location: 'Unknown location',
                                //location: item.city?.name || 'Unknown location',
                                trending: item.featured || false
                            }}
                            onPress={() => navigation.navigate('AdDetails', { id: item.id })}
                        />
                    </View>
                )}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            />

            {/* Bottom Sheets */}
            <FilterSheet
                ref={sheetRef}
                height={false}
            />
            <ShortfilterSheet
                ref={moreRef}
            />
            <SortbySheet
                ref={openRef}
            />
        </SafeAreaView>
    );
};

export default Items;