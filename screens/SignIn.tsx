import * as React from 'react';
import { StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function SignIn({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const signin = () => {
        fetch('http://edu.project.etherial.fr/auth', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,

            }),
        })
            .then((response) => response.json())
            .then((json) => {
                AsyncStorage.setItem('@token', json.data.token).then((res)=> {
                    navigation.navigate('Root');
                })
            })
            .catch((error) => console.error(error))
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SignIn</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="email"
                placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="password"
                placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <View style={styles.signup}>
                <Button
                    title="Sign In"
                    onPress={signin}
                />
                <Text style={styles.signupText} onPress={() => navigation.navigate("SignUp")}>
                    No account ?
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        width: "65%",
        marginTop: 30,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    input: {
        color: "white",
        borderColor: "white",
        borderWidth: 1,
        width: "70%",
        height: 50,
        fontSize: 18,
        borderRadius: 10,
        paddingLeft: 15,
    },
    signup: {
        marginTop: 50,
    },
    signupText: {
        textAlign: "center",
        marginTop: 50
    }
});
