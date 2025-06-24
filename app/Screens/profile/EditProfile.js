import React, { useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';

import { AuthContext } from '../../contexts/AuthProvider';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { SIZES, FONTS, IMAGES, COLORS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import api from '../../../src/services/api';

const genderMap = { 1: 'male', 2: 'female' };
const reverseGenderMap = { male: 1, female: 2 };

const EditProfile = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const { userData, userToken, updateUserData } = useContext(AuthContext);
  const userId = userData?.id;
  const scrollViewRef = useRef();

  const [formData, setFormData] = useState({
    name: userData?.name || '',
    username: userData?.username || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
    gender: genderMap[userData?.gender_id] || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    phone: '',
    gender: '',
    general: '',
  });

  const [loading, setLoading] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  // Snackbar state
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackText, setSnackText] = useState('');

  const onDismissSnackBar = () => setSnackVisible(false);
  const showSnackbar = (text) => {
    setSnackText(text);
    setSnackVisible(true);
  };

  const validateField = (field) => {
    let error = '';
    const value = formData[field]?.trim();

    switch (field) {
      case 'name':
        if (!value) error = 'Name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'username':
        if (!value) error = 'Username is required';
        else if (value.length < 3) error = 'Username must be at least 3 characters';
        break;
      case 'phone':
        if (value && !/^\+?[0-9]{7,15}$/.test(value)) error = 'Invalid phone number';
        break;
      case 'gender':
        if (!value) error = 'Please select a gender';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === '';
  };

  const validateForm = () => {
    let valid = true;
    ['name', 'username', 'phone', 'gender'].forEach((field) => {
      if (!validateField(field)) valid = false;
    });
    return valid;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleUpdateProfile = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      showSnackbar('Please fix the errors before submitting.');
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        phone_country: 'UG',
        gender_id: reverseGenderMap[formData.gender] || '',
      };

      const response = await api.put(`/users/${userId}`, payload, {
        headers: {
          Authorization: userToken.startsWith('Bearer ') ? userToken : `Bearer ${userToken}`,
          Accept: 'application/json',
          'Content-Language': 'en',
          'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
          'X-AppType': 'docs',
        },
      });

      if (response.data && response.data.success) {
        updateUserData(response.data.result);
        showSnackbar('Profile updated successfully!');
        //navigation.goBack();
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while updating your profile.';
      setErrors((prev) => ({ ...prev, general: message }));
      showSnackbar(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGender = (selectedGender) => {
    handleChange('gender', selectedGender);
    setGenderModalVisible(false);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Edit Profile" leftIcon="back" titleLeft />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Photo */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 30 }}>
          <Image
            style={{ width: 100, height: 100, borderRadius: 100 }}
            source={formData.photo_url || IMAGES.Small5}
          />
        </View>

        {/* Name Field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: 0.6, marginBottom: 8 }}>
            Name
          </Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            onBlur={() => validateField('name')}
            placeholder="Enter your name"
            style={[
              GlobalStyleSheet.shadow2,
              {
                borderColor: errors.name ? COLORS.danger : colors.border,
                padding: 10,
                backgroundColor: colors.card,
                color: colors.title,
                height: 48,
              },
            ]}
            placeholderTextColor={colors.textLight}
          />
          {errors.name && <Text style={{ color: COLORS.danger }}>{errors.name}</Text>}
        </View>

        {/* Username */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: 0.6, marginBottom: 8 }}>
            Username
          </Text>
          <TextInput
            value={formData.username}
            onChangeText={(text) => handleChange('username', text)}
            onBlur={() => validateField('username')}
            placeholder="Enter your username"
            style={[
              GlobalStyleSheet.shadow2,
              {
                borderColor: errors.username ? COLORS.danger : colors.border,
                padding: 10,
                backgroundColor: colors.card,
                color: colors.title,
                height: 48,
              },
            ]}
            placeholderTextColor={colors.textLight}
          />
          {errors.username && <Text style={{ color: COLORS.danger }}>{errors.username}</Text>}
        </View>

        {/* Phone */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: 0.6, marginBottom: 8 }}>
            Phone
          </Text>
          <TextInput
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            onBlur={() => validateField('phone')}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            style={[
              GlobalStyleSheet.shadow2,
              {
                borderColor: errors.phone ? COLORS.danger : colors.border,
                padding: 10,
                backgroundColor: colors.card,
                color: colors.title,
                height: 48,
              },
            ]}
            placeholderTextColor={colors.textLight}
          />
          {errors.phone && <Text style={{ color: COLORS.danger }}>{errors.phone}</Text>}
        </View>

        {/* Email (read-only) */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: 0.6, marginBottom: 8 }}>
            Email
          </Text>
          <TextInput
            value={formData.email}
            editable={false}
            style={[
              GlobalStyleSheet.shadow2,
              {
                borderColor: colors.border,
                padding: 10,
                backgroundColor: colors.card,
                color: colors.title,
                height: 48,
                opacity: 0.6,
              },
            ]}
          />
        </View>

        {/* Gender Selector */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: 0.6, marginBottom: 8 }}>
            Gender
          </Text>
          <TouchableOpacity
            onPress={() => setGenderModalVisible(true)}
            style={[
              GlobalStyleSheet.shadow2,
              {
                backgroundColor: colors.card,
                borderColor: errors.gender ? COLORS.danger : colors.border,
                height: 48,
                justifyContent: 'center',
                paddingHorizontal: 15,
                borderRadius: 8,
              },
            ]}
          >
            <Text style={{ color: formData.gender ? colors.title : colors.textLight, fontSize: 14 }}>
              {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Select gender'}
            </Text>
          </TouchableOpacity>
          {errors.gender && <Text style={{ color: COLORS.danger }}>{errors.gender}</Text>}
        </View>

        <Button
          onPress={handleUpdateProfile}
          title={loading ? 'Updating...' : 'Update'}
          disabled={loading}
        />
      </ScrollView>

      {/* Gender Modal */}
      <Modal
        visible={genderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setGenderModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingBottom: Platform.OS === 'ios' ? 30 : 20,
              paddingTop: 20,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ ...FONTS.h6, color: colors.title, marginBottom: 15, textAlign: 'center' }}>
              Select Gender
            </Text>
            {['male', 'female'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelectGender(option)}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 8,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  marginBottom: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{ ...FONTS.fontMedium, color: '#fff', fontSize: 16 }}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setGenderModalVisible(false)}
              style={{ alignItems: 'center', marginTop: 10, paddingVertical: 12 }}
            >
              <Text style={{ ...FONTS.font, color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        visible={snackVisible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={{ backgroundColor: COLORS.primary, margin: 16 }}
      >
        {snackText}
      </Snackbar>
    </SafeAreaView>
  );
};

export default EditProfile;
