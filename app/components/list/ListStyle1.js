import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';

const ListStyle1 = (props) => {
    
    const {colors} = useTheme();

    return (
        <>
            <TouchableOpacity 
                onPress={() => props.onPress && props.onPress()}
                style={[styles.listStyle,{borderColor:colors.border}]}>
                {props.icon &&
                    <View
                        style={{
                            height:30,
                            width:30,
                            backgroundColor:COLORS.primary,
                            borderRadius:30,
                            marginRight:10,
                            alignItems:'center',
                            justifyContent:'center',
                        }} 
                    >
                        { props.icon}
                    </View>
                }
                {props.image && 
                    <Image
                        style={{
                            height:30,
                            width:30,
                            borderRadius:30,
                            marginRight:10,
                        }}
                        source={props.image}
                    />
                }
                <Text style={{...FONTS.font,...FONTS.fontPoppins,color:colors.title,flex:1}}>{props.title}</Text>
                {props.arrowDown && 
                    <FontAwesome name={'angle-down'} color={colors.title} size={18}/>
                }
                {props.arrowRight && 
                    <FontAwesome name={'angle-right'} color={colors.title} size={18}/>
                }
            </TouchableOpacity>
        </>
    );
};


const styles = StyleSheet.create({
    listStyle:{
        borderBottomWidth:1,
        paddingVertical:16,
        flexDirection:'row',
        alignItems:'center',
    }
})


export default ListStyle1;