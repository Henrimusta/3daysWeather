import React, { useState, useEffect } from 'react';


const api = {
    key: process.env.EXPO_PUBLIC_API_KEY,
    url: process.env.EXPO_PUBLIC_API_URL
}

export function useWeatherApi(latitude, longitude, onWeatherReceived) {


    const [weatherData, setWeatherData] = useState(null)

    useEffect(() => {

        const url = api.url +
            'lat=' + latitude +
            '&lon=' + longitude +
            '&units=metric' +
            '&appid=' + api.key

        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                onWeatherReceived(json)
            })
            .catch((error) => {
                console.error(error)

            })
    }, [])

    return null;
}