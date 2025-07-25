import React from 'react';
import { Text, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const SuccessModal = () => {

    const {colors} = useTheme();

    return (
        <>
            <View style={{
                alignItems:'center',
                paddingHorizontal:30,
                paddingVertical:20,
                paddingBottom:30,
                backgroundColor:colors.card,
                marginHorizontal:30,
                width:320,
                borderRadius:SIZES.radius,
            }}>
                <View
                    style={{
                        alignItems:'center',
                        justifyContent:'center',
                        marginBottom:15,
                        marginTop:10,
                    }}
                >
                    <View
                        style={{
                            height:80,
                            width:80,
                            opacity:.2,
                            backgroundColor:COLORS.success,
                            borderRadius:80,
                        }}
                    />
                    <View
                        style={{
                            height:65,
                            width:65,
                            backgroundColor:COLORS.success,
                            borderRadius:65,
                            position:'absolute',
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                    >
                        <FeatherIcon size={32} color={COLORS.white} name="check"/>
                    </View>
                </View>
                <Text style={{...FONTS.h5,color:colors.title,marginBottom:10}}>Congratulations!</Text>
                <Text style={{...FONTS.font,color:COLORS.text,textAlign:'center'}}>Your Order Successfully Delivered</Text>
            </View>
        </>
    );
};


export default SuccessModal;