/*import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS, IMAGES, SIZES } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/StyleSheet';

const Help = () => {

    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
            <Header
                title="Help & Support"
                leftIcon={'back'}
                titleLeft
            />
            <View style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        paddingBottom: 10,
                        marginBottom: 20,
                    }}
                //onPress={() => navigation.navigate('Changepassword')}
                >
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, fontSize: 15, color: colors.title }}>Help Center</Text>
                    </View>
                    <Image
                        style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: colors.title }}
                        source={IMAGES.rightarrow}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        paddingBottom: 10,
                        marginBottom: 20,
                    }}
                //onPress={() => navigation.navigate('Changepassword')}
                >
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ ...FONTS.fontSm, ...FONTS.fontMedium, fontSize: 15, color: colors.title }}>Rate Us</Text>
                    </View>
                    <Image
                        style={{ height: 15, width: 15, resizeMode: 'contain', tintColor: colors.title }}
                        source={IMAGES.rightarrow}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Help;*/




import React, { useRef, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, IMAGES } from '../../../constants/theme';
import Header from '../../../layout/Header';
import { GlobalStyleSheet } from '../../../constants/StyleSheet';
import HelpSupportSheet from './HelpSupportSheet';

const Help = () => {
    const { colors } = useTheme();
    const refRBSheet = useRef();
    const [activeSheet, setActiveSheet] = useState('');

    const openHelpSheet = () => {
        setActiveSheet('support');
        refRBSheet.current.open();
    };

    const handleSupportSelect = (option) => {
        refRBSheet.current.close();
        Alert.alert('You selected:', option);
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }}>
                <Header title="Help & Support" leftIcon={'back'} titleLeft />

                <View style={[GlobalStyleSheet.container, { marginTop: 10 }]}>
                    <TouchableOpacity
                        style={styles.row(colors)}
                        onPress={openHelpSheet}
                    >
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.label(colors)}>Help Center</Text>
                        </View>
                        <Image
                            style={styles.icon(colors)}
                            source={IMAGES.rightarrow}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.row(colors)}
                        onPress={() => Alert.alert('Thank you!', 'We appreciate your feedback.')}
                    >
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.label(colors)}>Rate Us</Text>
                        </View>
                        <Image
                            style={styles.icon(colors)}
                            source={IMAGES.rightarrow}
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                height={320}
                openDuration={250}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: colors.card,
                        padding: 20,
                    },
                    draggableIcon: {
                        backgroundColor: colors.border,
                    },
                }}
            >
                {activeSheet === 'support' && (
                    <HelpSupportSheet onSelect={handleSupportSelect} />
                )}
            </RBSheet>
        </>
    );
};

const styles = {
    row: (colors) => ({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 10,
        marginBottom: 20,
    }),
    label: (colors) => ({
        ...FONTS.fontSm,
        ...FONTS.fontMedium,
        fontSize: 15,
        color: colors.title,
    }),
    icon: (colors) => ({
        height: 15,
        width: 15,
        resizeMode: 'contain',
        tintColor: colors.title,
    }),
};

export default Help;

