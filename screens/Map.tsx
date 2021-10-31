import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { io } from "socket.io-client";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

interface MarkersType {
    string: Users;
}
interface Users {
    user: string;
    location: Location;
}
interface Location {
    latitude: number;
    longitude: number;
    rotation: number | undefined;
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const [markers, setMarkers] = React.useState<MarkersType| any>([]);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [token, setToken] = React.useState("");
    React.useEffect(() => {
        AsyncStorage.getItem('@token').then((res) => {
            if (res) {
                setToken(res)
            }
        })
    })
    React.useEffect(() => {
        if (token) {
        let markersSave: any = []
        const socket = io("http://edu.project.etherial.fr/");
        socket.on("connect", () => {
            socket.emit("auth", token);
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({ accuracy: 1 });
                socket.emit("update_position", {
                    point_lat: location.coords.latitude,
                    point_lon: location.coords.longitude
                });
            })();
        });
        socket.on("positions", (data) => {
            markersSave = data.data
        });
        let result: any[] = []
        setInterval(() => {            
            for (let key in markersSave) {
                let value = markersSave[key];
                value.user = key
                result.push(value)
            }
            setMarkers(result)
        }, 3000);
        }
    }, [token])
    return (
        <View style={styles.container}>
        <MapView style={styles.map}>
            {
            markers.length > 0 ?
                markers.map((marker: Users, index: number) => {
                if (Object.keys(marker).length > 1) {
                    return (
                    <Marker
                        key={index}
                        coordinate={{
                        latitude: marker.location.latitude,
                        longitude: marker.location.longitude,
                        }}
                        title={marker.user}
                    />
                    )
                }
                })
            : null
            }
        </MapView>
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
  map: {
    width: "100%",
    height: "100%",
  },
});
function el(el: any, arg1: (Users: any) => void) {
  throw new Error('Function not implemented.');
}

