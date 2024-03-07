import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useWeatherApi } from "../components/WeatherApiCaller";
import { useState } from "react";

const api = {
    url: process.env.EXPO_PUBLIC_ICONS_URL
}

export default function Weather() {
    const route = useRoute();
    const { latitude, longitude, locationName } = route.params;
    const [dailyForecasts, setDailyForecasts] = useState([])
    const [icon, setIcon] = useState('')


    useWeatherApi(latitude, longitude, onWeatherReceived);


    function onWeatherReceived(weatherData) {
        if (!weatherData) {
            console.log("No weather data")
        } else {
            const groupedByDay = {}
            weatherData.list.forEach(forecast => {
                const date = forecast.dt_txt.split(' ')[0]
                if (!groupedByDay[date]) {
                    groupedByDay[date] = []
                }
                groupedByDay[date].push({
                    time: forecast.dt_txt.split(' ')[1].slice(0, 5),
                    temperature: forecast.main.temp,
                    description: forecast.weather[0].description,
                    icon: api.url + `${forecast.weather[0].icon}.png`
                })
            })

            const forecasts = []
            for (const date in groupedByDay) {
                forecasts.push({
                    date: date,
                    forecast: groupedByDay[date]
                })
            }
            setDailyForecasts(forecasts)
        }
    }

    function getWeekday(dateString) {
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const date = new Date(dateString)
        const weekdayIndex = date.getDay()
        return weekdays[weekdayIndex]
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Weather in {locationName}</Text>
                {dailyForecasts.map((item, index) => (
                    <View key={index} style={styles.dayContainer}>
                        <Text style={styles.dateText}>{getWeekday(item.date)} </Text>
                        <View style={styles.forecastContainer}>
                            {item.forecast.map((forecast, forecastIndex) => (
                                <View key={forecastIndex} style={styles.forecastItemContainer}>
                                    <View style={styles.forecastItem}>
                                        <Text style={styles.timeText}>{forecast.time}</Text>
                                        <Image source={{ uri: forecast.icon }} style={styles.icon} />
                                        <Text style={styles.tempText}>{forecast.temperature}&#8451;</Text>
                                        {/*<Text>{forecast.description}</Text>*/}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        marginTop: 24,
    },
    dayContainer: {
        width: '90%',
        borderRadius: 5,
        alignItems: 'center',
        padding: 16,
        marginBottom: 8,
        backgroundColor: 'olive',
        bordearWidth: 1,
        borderColor: 'lightgray',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    forecastContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    forecastItemContainer: {
        width: '25%',
        marginTop: 16,
        paddingHorizontal: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    timeText: {

        color: 'white',
    },
    forecastItem: {
        marginBottom: 4,
        alignItems: 'center',
    },
    tempText: {

        color: 'white',
    },
    icon: {
        width: 64,
        height: 64,
    }

});