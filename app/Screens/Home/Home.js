import React, { useState, useEffect, useContext } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SearchBar from '../../components/SearchBar';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES, FONTS, COLORS } from '../../constants/theme';
import CategoryList from './CategoryList';
import LatestAds from './LatestAds';
import CardStyle1 from '../../components/Card/CardStyle1';
import postsService from '../../../src/services/postsService';
import getImageSource,{formatPrice} from '../../../src/services/utils';
import { AuthContext } from '../../contexts/AuthProvider';
import { getCityName } from '../../../src/services/cityService';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [latestAds, setLatestAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { userToken } = useContext(AuthContext);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch latest ads
      const latestResponse = await postsService.posts.getAll({
        perPage: 4,
        sort: 'newest'
      });
      setLatestAds(latestResponse.data?.result?.data || []); // Fallback to empty array

      // Fetch recommendations
      const recommendationsResponse = await postsService.posts.getAll({
        sort: 'newest',
        detailed:1
      });
      const reversedRecomendations = recommendationsResponse.data?.result?.data.reverse() || [];
      setRecommendations(reversedRecomendations); // Limit to 4 recommendations
     // setRecommendations(recommendationsResponse.data?.result?.data || []); // Fallback to empty array
      console.log('Recommendations:', recommendationsResponse.data?.result?.data);
      console.log('AuthTOKEN:', userToken);


    } catch (err) {
      console.error('Failed to fetch home data:', err);
      setError(err.message || 'Failed to load data');
      setRecommendations([]); // Reset to empty array on error
      setLatestAds([]); // Reset to empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (loading && !recommendations.length && !latestAds.length) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (error && !recommendations.length && !latestAds.length) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.title }}>{error}</Text>
        <TouchableOpacity 
          style={{ marginTop: 10, padding: 10, backgroundColor: COLORS.primary, borderRadius: 5 }}
          onPress={fetchHomeData}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getName= async(cityId) => {
    try {
      const city = await getCityName(cityId, userToken);
      return city || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching city name:', error);
      return 'Unknown Location';
    }
  };

  // Safe rendering of recommendations
  const renderRecommendations = () => {
    if (!Array.isArray(recommendations)) {
      return null;
    }

    return (
      <View style={[GlobalStyleSheet.row]}>
        {recommendations.map((item, index) => (
          <View key={`${item.id}-${index}`} style={[GlobalStyleSheet.col50, { marginBottom: 15 }]}>
            <CardStyle1 
              item={{
                id: item.id?.toString() || index.toString(),
                image: getImageSource(item.pictures),
                title: item.title || 'No title',
                price: formatPrice(item.price, item.currency_code),
                location: getName(item.city_id) || 'Location not specified',
                //location:'Kampala, Uganda',
                trending: item.trending || false
              }} 
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header and SearchBar */}
      <View style={[GlobalStyleSheet.container, { paddingBottom: 5 }]}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <SearchBar />
          </View>
          <TouchableOpacity
            style={{ padding: 14, marginLeft: 5 }}
            onPress={() => navigation.openDrawer()}
          >
            <Image
              style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: colors.title }}
              source={IMAGES.hamburger}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={[GlobalStyleSheet.container, { paddingTop: 10, flex: 1 }]}>
          {/* Categories Section */}
          <View>
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <Text style={{ ...FONTS.font, ...FONTS.fontTitle, color: colors.title, flex: 1 }}>
                Categories
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Categories')}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Text style={[FONTS.fontSm, { color: COLORS.primary }]}>View all</Text>
                <FeatherIcon size={16} color={COLORS.primary} name={'chevron-right'} />
              </TouchableOpacity>
            </View>
            <CategoryList />
          </View>

          {/* Ads Section */}
          <View style={{ marginHorizontal: -15, marginTop: 20, flex: 1 }}>
            <View style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              flex: 1,
              paddingHorizontal: 15,
              paddingVertical: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            }}>
              <Text style={[FONTS.h6, { color: colors.title }]}>Latest Ads</Text>
              <LatestAds data={latestAds} />

              <Text style={[FONTS.h6, { color: colors.title, marginTop: 8, marginBottom: 10 }]}>
                Recommendations
              </Text>
              
              {renderRecommendations()}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;