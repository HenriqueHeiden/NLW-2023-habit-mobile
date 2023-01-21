import { ActivityIndicator, Text, View } from "react-native";

export function  Loading(){
    return (
        <View style={{flex:1, justifyContent:'center', alignItems: 'center', backgroundColor: '#09090A'}}>
            <Text style={{color:"#fff"}}>Carregando</Text>
            <ActivityIndicator color="#7C3AED"/>
        </View>
    );
}