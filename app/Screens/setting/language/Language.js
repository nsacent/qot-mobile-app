import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, SafeAreaView, TextInput,
    TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/StyleSheet';
import { IMAGES, COLORS } from '../../../constants/theme';
import LanguageoptionSheet from '../../../components/BottomSheet/LanguageoptionSheet';
import Button from '../../../components/Button/Button';

import { Snackbar } from 'react-native-paper';


const Language = () => {


    // Snackbar state
    const [snackVisible, setSnackVisible] = useState(false);
    const [snackText, setSnackText] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'

    const onDismissSnackBar = () => setSnackVisible(false);

    const showSnackbar = (text, type = 'success') => {
        setSnackText(text);
        setSnackbarType(type);
        setSnackVisible(true);
    };


    const { colors } = useTheme();
    const moresheet = useRef();

    const [language, setLanguage] = useState('English');
    const [languageList, setLanguageList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchLanguages();
        loadSavedLanguage();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await axios.get('https://qot.ug/api/languages', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Content-Language': 'en',
                    'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
                    'X-AppType': 'docs',
                },
            });

            //console.log('📦 Languages API response:', JSON.stringify(response.data, null, 2));
            const data = response.data?.result?.data || [];
            setLanguageList(data);
        } catch (error) {
            console.error('Failed to fetch languages', error);

            showSnackbar('Could not fetch languages', 'error');
            //Alert.alert('Error', 'Could not fetch languages');
        } finally {
            setLoading(false);
        }
    };

    const loadSavedLanguage = async () => {
        const saved = await AsyncStorage.getItem('appLanguage');
        if (saved) setLanguage(saved);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await AsyncStorage.setItem('appLanguage', language);
            Alert.alert('Success', 'Language saved!');
            showSnackbar('Language saved!', 'success');
        } catch (err) {
            //Alert.alert('Error', 'Failed to save language.');
            showSnackbar('Failed to save language.', 'error');

        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header title="Select Language" leftIcon="back" titleLeft />

            <View style={[GlobalStyleSheet.container, { marginTop: 15, flex: 1 }]}>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.text} />
                ) : (
                    <View>
                        <View style={[
                            GlobalStyleSheet.shadow2, {
                                borderColor: colors.border,
                                alignItems: 'center',
                                flexDirection: 'row',
                                backgroundColor: colors.card,
                                height: 48,
                                paddingLeft: 20,
                                marginBottom: 15,
                            },
                        ]}>
                            <Image
                                style={[GlobalStyleSheet.inputimage, { tintColor: colors.title, right: 15 }]}
                                source={IMAGES.downaeeowsmall}
                            />
                            <TextInput
                                editable={false}
                                style={[GlobalStyleSheet.input, { color: colors.title }]}
                                value={language}
                                placeholderTextColor={colors.border}
                            />
                        </View>
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}
                            onPress={() => moresheet.current.openSheet()}
                        />
                    </View>
                )}
            </View>

            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                <Button
                    title={saving ? 'Saving...' : 'Save'}
                    disabled={saving}
                    onPress={handleSave}
                />
            </View>


            <LanguageoptionSheet

                ref={moresheet}
                setLanguage={setLanguage}
                languageList={languageList}
            />

            {/* Snackbar */}
            <Snackbar
                visible={snackVisible}
                onDismiss={onDismissSnackBar}
                duration={3000}
                style={{
                    backgroundColor: snackbarType === 'success' ? COLORS.success : COLORS.danger,
                    margin: 16,
                    borderRadius: 8,
                }}
                action={{
                    label: 'OK',
                    onPress: () => setSnackVisible(false),
                    labelStyle: { color: '#fff', fontWeight: 'bold' },
                }}
            >
                <Text style={{ color: '#fff' }}>{snackText}</Text>
            </Snackbar>


        </SafeAreaView>
    );
};

export default Language;
