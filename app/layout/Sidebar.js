import React, { useContext, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Modal } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import ThemeBtn from '../components/ThemeBtn';
import CustomButton from '../components/CustomButton';
import { COLORS, FONTS, IMAGES } from '../constants/theme';
import { AuthContext } from '../contexts/AuthProvider';

const Sidebar = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const { signOut, userData } = useContext(AuthContext);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Optional: Show an error alert here if you want
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      icon: 'grid',
      name: 'Components',
      navigate: 'Components',
    },
    {
      icon: 'repeat',
      name: 'My Orders',
      navigate: 'Myorders',
    },
    {
      icon: 'user',
      name: 'Profile',
      navigate: 'Profile',
    },
    {
      icon: 'log-out',
      name: 'Logout',
      action: handleLogout,
    },
  ];

  const handleItemPress = (item, index) => {
    setActiveItem(index);
    if (item.action) {
      item.action();
    } else {
      item.navigate && navigation.navigate(item.navigate);
      navigation.closeDrawer();
    }
    setTimeout(() => setActiveItem(null), 300);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.card }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View
          style={{
            paddingTop: 25,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderColor: colors.borderColor,
            paddingBottom: 20,
            marginBottom: 15,
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'flex-start', flex: 1 }}>
              <View>
                <Image
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 35,
                    marginBottom: 10,
                    backgroundColor: colors.input,
                  }}
                  source={userData?.photo_url ? { uri: userData.photo_url } : IMAGES.Small5}
                  defaultSource={IMAGES.Small5}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('EditProfile');
                    navigation.closeDrawer();
                  }}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                    backgroundColor: COLORS.secondary,
                    position: 'absolute',
                    bottom: 6,
                    right: -2,
                    borderWidth: 2,
                    borderColor: colors.card,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.7}
                >
                  <FeatherIcon color={COLORS.white} name="edit" size={14} />
                </TouchableOpacity>
              </View>
            </View>
            <View onStartShouldSetResponder={() => true}>
              <ThemeBtn />
            </View>
          </View>

          <View>
            <Text style={{ ...FONTS.h5, color: colors.title, marginBottom: 4 }}>
              {userData?.name || 'Anonymous User'}
            </Text>
            <Text style={{ ...FONTS.font, color: colors.textLight, opacity: 0.9, marginBottom: 2 }}>
              {userData?.email || userData?.username || 'No username'}
            </Text>

            {/* Online Status */}
            {/*userData?.p_is_online !== undefined && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: userData.p_is_online ? COLORS.success : COLORS.gray,
                    marginRight: 6,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.fontSm,
                    color: userData.p_is_online ? COLORS.success : colors.textLight,
                  }}
                >
                  {userData.p_is_online ? 'Online' : 'Offline'}
                </Text>
              </View>
            )*/}
          </View>
        </View>

        {/* Navigation Items */}
        <View style={{ flex: 1 }}>
          {navItems.map((data, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleItemPress(data, index)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 14,
                backgroundColor:
                  activeItem === index
                    ? theme.dark
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.05)'
                    : 'transparent',
              }}
            >
              <View style={{ marginRight: 15 }}>
                {data.name === 'Logout' && isLoggingOut ? (
                  <ActivityIndicator size="small" color={colors.textLight} />
                ) : (
                  <FeatherIcon
                    name={data.icon}
                    color={data.name === 'Logout' ? COLORS.danger : colors.textLight}
                    size={20}
                  />
                )}
              </View>
              <Text
                style={{
                  ...FONTS.fontTitle,
                  fontSize: 14,
                  color: data.name === 'Logout' ? COLORS.danger : colors.title,
                  flex: 1,
                }}
              >
                {data.name}
              </Text>
              {data.navigate && !isLoggingOut && (
                <FeatherIcon size={16} color={colors.textLight} name="chevron-right" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 30,
            marginTop: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ ...FONTS.h6, ...FONTS.fontTitle, color: colors.title, marginBottom: 4 }}>
            QOT
          </Text>
          <Text style={{ ...FONTS.fontSm, color: colors.textLight }}>App Version 1.0</Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        onDismiss={() => setShowLogoutModal(false)}
        contentContainerStyle={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background for modal overlay
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <View
            style={{
            backgroundColor: colors.card,
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 8,
            width: '90%',
            maxWidth: 400,
            alignItems: 'center',
            // add some shadow for elevation (Android) and iOS
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            }}
        >      <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 15,
              marginTop: 10,
            }}
          >
            <View
              style={{
                height: 80,
                width: 80,
                opacity: 0.2,
                backgroundColor: COLORS.warning,
                borderRadius: 80,
              }}
            />
            <View
              style={{
                height: 65,
                width: 65,
                backgroundColor: COLORS.warning,
                borderRadius: 65,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FeatherIcon size={32} color={COLORS.white} name="log-out" />
            </View>
          </View>

          <Text style={{ ...FONTS.h4, color: colors.title, marginBottom: 8 }}>
            Confirm Logout
          </Text>
          <Text
            style={{
              ...FONTS.font,
              color: colors.text,
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Are you sure you want to sign out?
          </Text>

          <CustomButton
            onPress={handleConfirmLogout}
            title={isLoggingOut ? 'Signing out...' : 'Yes, Sign Out'}
            color={COLORS.danger}
            style={{ width: '100%', marginBottom: 10 }}
            disabled={isLoggingOut}
          />
          <CustomButton
            onPress={() => setShowLogoutModal(false)}
            title="Cancel"
            color={COLORS.primary}
            style={{ width: '100%' }}
            disabled={isLoggingOut}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Sidebar;