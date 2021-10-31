import * as React from 'react';
import { StyleSheet, TextInput, Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function SignUp({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [firstName, setFirstName] = React.useState("");
    const [lastname, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [verifPassword, setVerifPassword] = React.useState("");

    const submit = () => {
        fetch('http://edu.project.etherial.fr/users', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                firstname: firstName,
                lastname: lastname,
                email: email,
                password: password,
                password_verif: verifPassword,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 201) {
                    navigation.goBack()
                }
            })
            .catch((error) => console.error(error))
    }
    return (
        <View style={styles.container}>
            <View style={styles.back}>
                <Button
                    title="< Back"
                    onPress={() => navigation.goBack()}
                />
            </View>
            <Text style={styles.title}>SignUp</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="First Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                onChangeText={setLastName}
                value={lastname}
                placeholder="Last Name"
                placeholderTextColor="rgba(255,255,255,0.5)"
            />
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
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                onChangeText={setVerifPassword}
                value={verifPassword}
                placeholder="Confirm password"
                placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <View style={styles.submit}>
                <Button
                    title="Create account"
                    onPress={submit}
                />
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
    back: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
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
        marginBottom: 20
    },
    label: {
        width: "65%",
    },
    submit: {
        marginTop: 20,
    }
});
