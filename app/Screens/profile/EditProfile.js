import React, { useContext, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { View, Text, TextInput, Image, TouchableOpacity, Platform ,Modal} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthProvider';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { SIZES, FONTS, IMAGES, COLORS } from '../../constants/theme';
import Button from '../../components/Button/Button';

const EditProfile = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const { userData } = useContext(AuthContext);

  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [username, setUsername] = useState(userData?.username || '');
  const [phone, setPhone] = useState(userData?.phone || '');

  const [gender, setGender] = useState(userData?.gender || '');
  const [visible, setVisible] = useState(false);

  const handleSelect = (selectedGender) => {
    setGender(selectedGender);
    setVisible(false);
  };

  

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Edit Profile" leftIcon="back" titleLeft />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <View>
          <Image
            style={{ width: 100, height: 100, borderRadius: 100 }}
            source={IMAGES.Small5}
          />
          <TouchableOpacity
            // TODO: handleImageSelect
            style={{ position: 'absolute', bottom: 0, right: 0 }}
          >
            <View style={{ backgroundColor: colors.card, width: 36, height: 36, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ backgroundColor: COLORS.primary, width: 30, height: 30, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: '#fff' }}
                  source={IMAGES.camera}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[GlobalStyleSheet.container, { marginTop: 10, flex: 1, paddingHorizontal: 20 }]}>
        {[
          { label: 'Name', value: name, setter: setName, placeholder: 'Enter your name' },
          { label: 'Username', value: username, setter: setUsername, placeholder: 'Enter your username' },
          { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Enter your phone number' }
        ].map((field, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: .6, marginBottom: 8 }}>{field.label}</Text>
            <TextInput
              value={field.value}
              placeholder={field.placeholder}
              onChangeText={field.setter}
              style={[
                GlobalStyleSheet.shadow2,
                {
                  borderColor: colors.border,
                  padding: 10,
                  backgroundColor: colors.card,
                  color: colors.title,
                  height: 48,
                }
              ]}
              placeholderTextColor={colors.textLight}
            />
          </View>
        ))}

        {/* Email Disable */}
        <View style={{ marginBottom: 20 }}>
            <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: .6, marginBottom: 8 }}>
                Email
            </Text>
            <TextInput
                value={email}
                editable={false} // 👈 disables editing
                style={[
                GlobalStyleSheet.shadow2,
                {
                    borderColor: colors.border,
                    padding: 10,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: colors.card,
                    color: colors.title,
                    height: 48,
                    opacity: 0.6, // 👈 optional: visually indicates it's disabled
                }
                ]}
            />
        </View>

        {/* Gender Dropdown */}
       <View style={{ marginBottom: 20 }}>
        <Text style={{ ...FONTS.fontSm, color: colors.title, opacity: 0.6, marginBottom: 8 }}>
          Gender
        </Text>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={[
            GlobalStyleSheet.shadow2,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              height: 48,
              justifyContent: 'center',
              paddingHorizontal: 15,
              borderRadius: 8,
            },
          ]}
        >
          <Text style={{ color: gender ? colors.title : colors.textLight, fontSize: 14 }}>
            {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Select gender'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
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

            {['male', 'female', 'other'].map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSelect(option)}
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
              onPress={() => setVisible(false)}
              style={{
                alignItems: 'center',
                marginTop: 10,
                paddingVertical: 12,
              }}
            >
              <Text style={{ ...FONTS.font, color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

        <Button
          onPress={() => {
            // TODO: Submit update to your API here
            navigation.goBack();
          }}
          title="Update"
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
