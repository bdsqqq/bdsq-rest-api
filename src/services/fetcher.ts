import fetch from 'node-fetch';
import dotenv from 'dotenv'

import '../config'

dotenv.config();

class Fetcher {
    async getWeatherData(){
        const response = await fetch(process.env.WEATHER_API_URL+process.env.WEATHER_API_KEY);
        const data = await response.json();
        console.log(data.weather[0].main)
        return data.weather[0].main
    }

    async getCorongaData(){
        const response = await fetch('https://covid2019-api.herokuapp.com/v2/country/brazil');
        const data = await response.json();
        console.log(data)
        return data
    }

    async getIssData(){
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();
        console.log(data)
        return data
    }
}

export default Fetcher