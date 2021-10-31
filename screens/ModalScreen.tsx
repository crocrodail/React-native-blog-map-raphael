import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, StyleSheet, TextInput, Button } from 'react-native';
import { RootTabScreenProps } from '../types';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';



export default function ModalScreen({ route, navigation }: RootTabScreenProps<'Modal'>) {
  const { id, token }: any = route.params;
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const submit = () => {
    fetch('http://edu.project.etherial.fr/articles', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      method: "POST",
      body: JSON.stringify({
        title: title,
        content: content,
        article_category_id: id,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status === 201){
          navigation.goBack()
        }
      })
      .catch((error) => console.error(error))
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create new post</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTitle}
        value={title}
        placeholder="title"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />
      <Text style={styles.label}>Content</Text>
      <TextInput
        multiline
        style={styles.inputContent}
        onChangeText={setContent}
        value={content}
        placeholder="content"
        placeholderTextColor="rgba(255,255,255,0.5)"
      />
      <View style={styles.submit}>
        <Button
          title="Create post"
          onPress={submit}
        />
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
  inputContent: {
    color: "white",
    borderColor: "white",
    borderWidth: 1,
    width: "70%",
    height: 100,
    fontSize: 18,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    
  },
  label: {
    width: "65%",
  },
  submit: {
    marginTop: 20,
  }
});
