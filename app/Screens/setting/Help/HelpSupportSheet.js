import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../../constants/theme';
import { useTheme } from '@react-navigation/native';

const HelpSupportSheet = ({ onSelect }) => {
    const { colors } = useTheme();

    const options = [
        'Account Issues',
        'Contact Admin',
        'Report a User',
        'Support',
        'Other',
    ];

    return (
        <View>
            <Text style={{ ...FONTS.fontLg, ...FONTS.fontMedium, color: colors.title, marginBottom: 15 }}>
                Select an issue
            </Text>
            {options.map((label, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => onSelect(label)}
                    style={{
                        backgroundColor: COLORS.primary,
                        paddingVertical: 12,
                        borderRadius: 8,
                        marginBottom: 10,
                    }}
                >
                    <Text style={{ ...FONTS.fontLg, ...FONTS.fontMedium, color: '#fff', textAlign: 'center' }}>
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default HelpSupportSheet;