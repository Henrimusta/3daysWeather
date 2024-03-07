import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { onSnapshot, collection, query, firestore, locationsCollection } from '../firebase/Config';
import ApiCaller from '../components/ApiCaller';


export default function Locations({ navigation }) {
    const [ownLocations, setOwnLocations] = useState([])


    useEffect(() => {
        const q = query(collection(firestore, locationsCollection))

        const unsub = onSnapshot(q, (querySnapshot) => {
            const tempLocations = []

            querySnapshot.forEach((doc) => {
                const locationObject = {
                    id: doc.id,
                    longitude: doc.data().longitude,
                    latitude: doc.data().latitude,
                    locationName: doc.data().locationName
                }
                tempLocations.push(locationObject)
            })
            setOwnLocations(tempLocations)
        })
        return () => {
            unsub()
        }
    }, [])

    return (
        <ScrollView>
            <View style={styles.container}>
                {ownLocations.map((location, index) => {
                    console.log(location)
                    return (
                        <TouchableOpacity
                            key={location.id}
                            style={styles.pressableText}
                            onPress={() => navigation.navigate("Weather", {
                                latitude: location.latitude,
                                longitude: location.longitude,
                                locationName: location.locationName
                            })}>
                            <Text style={styles.text}>
                                Check 5 day forecast at {location.locationName}
                            </Text>
                        </TouchableOpacity>

                    )
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressableText: {
        padding: 10,
        backgroundColor: 'olive',
        margin: 5,
        borderRadius: 5,
        width: '90%',
        justifyContent: 'center',
    }, text: {
        color: 'white',
        textAlign: 'center',
    }

});
