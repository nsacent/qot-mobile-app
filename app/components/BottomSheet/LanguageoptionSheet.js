import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES, FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import axios from 'axios';

const LanguageSheet = (props, ref) => {
    const bottomSheetRef = useRef(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const snapPoints = useMemo(() => ['50%'], []);
    const { colors } = useTheme();

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await axios.get('https://qot.ug/api/languages', {
                    headers: {
                        'X-AppApiToken': 'RFI3M0xVRmZoSDVIeWhUVGQzdXZxTzI4U3llZ0QxQVY=',
                        'X-AppType': 'docs',
                        'Content-Language': 'en',
                        'Accept': 'application/json',
                    }
                });
                const fetched = response.data?.result?.data || [];
                setLanguages(fetched);
            } catch (error) {
                console.error('Failed to fetch languages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    const handleSheetChanges = useCallback(index => {
        console.log('Sheet index:', index);
    }, []);

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    useImperativeHandle(ref, () => ({
        openSheet: () => bottomSheetRef.current?.snapToIndex(0),
    }));

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose={true}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            handleStyle={{ top: 0 }}
            handleIndicatorStyle={{ backgroundColor: colors.border, width: 92 }}
            backgroundStyle={{ backgroundColor: colors.card }}
        >
            <BottomSheetScrollView style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                {loading ? (
                    <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={colors.primary || '#6E4ED4'} />
                        <Text style={{ color: colors.text, marginTop: 10 }}>Loading languages...</Text>
                    </View>
                ) : (
                    languages.map((lang, index) => (
                        <View key={index} style={{ marginHorizontal: -15 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    props.setLanguage(lang.name); // or lang.native if you prefer
                                    bottomSheetRef.current?.close();
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    height: 48,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border,
                                    marginHorizontal: 15
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, color: colors.title, fontSize: 15, marginLeft: 10 }}>
                                        {lang.native || lang.name}
                                    </Text>
                                </View>
                                <Image
                                    style={{ height: 12, width: 12, resizeMode: 'contain', tintColor: colors.title }}
                                    source={IMAGES.rightarrow}
                                />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default forwardRef(LanguageSheet);
