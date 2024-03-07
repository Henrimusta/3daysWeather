import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { firestore, collection, addDoc, locationsCollection } from "../firebase/Config";
import ApiCaller from "../components/ApiCaller";


export default function Home({ navigation }) {
    const [marker, setMarker] = useState(null)
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [userLocation, setUserLocation] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })
    const [locations, setLocations] = useState([])

    useEffect(() => {
        getLocation()
    }, [])


    const saveMarker = async (coordinates, locationName) => {
        console.log("Save marker to firestore" + "latitude " + coordinates.latitude + "longitude " + coordinates.longitude + "locationName " + locationName)
        const docRef = await addDoc(collection(firestore, locationsCollection), {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            locationName: locationName,
        }).catch(error => console.log(error))
        setLocations([])
        console.log("Document written with ID: ", docRef.id);
    }

    const showMarker = (e) => {
        const coordinates = e.nativeEvent.coordinate
        setMarker(coordinates)
        console.log("show marker" + coordinates.latitude + " " + coordinates.longitude)
        console.log(coordinates)
    }

    const getLocationName = (location) => {
        console.log("Get location name" + location)
        saveMarker(marker, location)
    }




    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        console.log(status)
        try {
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setUserLocation({ ...location, "latitude": location.coords.latitude, "longitude": location.coords.longitude })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={userLocation}
                onPress={showMarker}
            >
                {marker &&
                    <Marker
                        title="This location has been saved!"
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} />}
            </MapView>

            {marker && <ApiCaller latitude={marker.latitude} longitude={marker.longitude} onLocationReceived={getLocationName} />}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Locations")}>
                <Text style={styles.buttonText}>Go to saved Locations</Text>
            </TouchableOpacity>

        </View >

    );
}

const styles = {
    container: {
        flex: 1,
    },
    button: {
        position: "absolute",
        bottom: 20,
        left: 105,
        backgroundColor: "olive",
        padding: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
};