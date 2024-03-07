import React, { useEffect, useState } from 'react'

const api = {
    key: process.env.EXPO_PUBLIC_API_KEY,
    url: process.env.EXPO_PUBLIC_GEO_API_URL
}

/*const API_KEY = '703d2615e82828f52edf64eaa43c49a4'
const API_URL = 'http://api.openweathermap.org/geo/1.0/reverse?'*/

export default function ApiCaller({ latitude, longitude, onLocationReceived }) {


    const [coordinatesChanged, setCoordinatesChanged] = useState(false)

    useEffect(() => {
        if (coordinatesChanged === true) {
            const url = api.url +
                'lat=' + latitude +
                '&lon=' + longitude +
                '&appid=' + api.key


            fetch(url)
                .then((response) => response.json())
                .then((json) => {

                    onLocationReceived(json[0].name)
                })
                .catch((error) => {
                    console.error(error)
                })
            setCoordinatesChanged(false)
        }
    }, [coordinatesChanged])

    useEffect(() => {
        setCoordinatesChanged(true)
    }, [latitude, longitude])

    return null;
}