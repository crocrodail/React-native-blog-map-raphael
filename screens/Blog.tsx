import * as React from 'react';
import { StyleSheet, Button, NativeSyntheticEvent, NativeTouchEvent, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment2 from 'moment';
import moment from 'moment-timezone';
import 'moment/locale/fr';
import { RootTabScreenProps } from '../types';


import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
moment.locale('fr')

interface Categories {
  name: string;
  id: number;
}

interface Article {
  title: string;
  content: string;
  article_category_id: number;
  User: User;
  created_at: Date;
}

interface User {
  firstname: string;
  lastname: string;
}

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [token, setToken] = React.useState("");
  const [categories, setCategory] = React.useState<Categories | any>([]);
  const [articles, setArticle] = React.useState<Article | any>([]);
  const [idCategory, setIdCategory] = React.useState(0);
  React.useEffect(() => {
    AsyncStorage.getItem('@token').then((res) => {
      if (res){
        setToken(res)
      }
    })
    if (token){
      fetch('http://edu.project.etherial.fr/articles/categories', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.status === 200) {
            setCategory(json.data)
          }
        })
        .catch((error) => console.error(error))
    }
  }, [token])

  React.useEffect(()=>{
    if (token && idCategory !== 0) {      
      fetch('http://edu.project.etherial.fr/articles/', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.status === 200) {
            setArticle(json.data)
          }
        })
        .catch((error) => console.error(error))
    }
  }, [idCategory])

  React.useEffect(()=>{
    navigation.addListener('focus', () => {
      if (token && idCategory !== 0) {
        fetch('http://edu.project.etherial.fr/articles/', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "GET",
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.status === 200) {
              setArticle(json.data)
            }
          })
          .catch((error) => console.error(error))
      }
    });
  },[])

  const backToCategory = () => {
    setIdCategory(0)
  }

  const newPost = () => {
    navigation.navigate('Modal', {
      id: idCategory,
      token: token
    });
  }


  return (
    <View style={styles.container}>
      {
        idCategory === 0 ?
          <Text style={styles.title}>Catégories</Text>
        : null
      }
      { 
        idCategory === 0 ?
          categories.map((category: Categories, index: number) => {
            return (
              <Text style={styles.cat} key={index} onPress={() => {
                setIdCategory(category.id)
              }}>
                {category.name}
              </Text>
            )
          })
        : 
          <>
            <View style={styles.back}>
              <Button
                title="Back to Category"
                onPress={backToCategory}
              />
            </View>
            <View style={styles.new}>
              <Button
                title="New post"
                onPress={newPost}
              />
            </View>
            <ScrollView style={styles.articleContent}>
              {
                articles.map((article: Article, index: number) => {
                  if (article.article_category_id === idCategory){
                    return (
                      <View style={styles.article} key={index}>
                        <Text>
                          title: {article.title}
                        </Text>
                        <Text>
                          content: {article.content}
                        </Text>
                        <Text>
                          author: {article.User.firstname} {article.User.lastname}
                        </Text>
                        <Text>
                          {moment(article.created_at).tz('Europe/Paris').format("dddd, MMMM Do YYYY, H[h]mm[ et ]ss[s]")}
                        </Text>
                      </View>
                    )
                  }
                })
              }
            </ScrollView>
          </>

      }
        
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
  cat: {
    fontSize: 30,
    borderWidth: 1,
    borderColor: 'white',
    width: '80%',
    textAlign: 'center',
    margin: 20,
    height: 80,
    borderRadius: 20,
    paddingTop: 15
  },
  back: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: "42%"
  },
  articleContent: {
    marginTop: 100,
    width: '100%',
  },
  article: {
    borderWidth: 1,
    borderColor: 'white',
    width: '80%',
    marginLeft: "10%",
    marginBottom: "10%",
    borderRadius: 20,
    padding: 10
  },
  new: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: "42%"
  }
});
