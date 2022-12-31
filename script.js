async function getWeatherData (cityName) {
    //getting data from the openweathermap API
    try {
        const url1 = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${cityName}&APPID=${key}`;
        const data = await fetch(url1)
            .then(function(response) {
                    return response.json();
                }).then(function(response) {return response;});
        return data;
    } catch (error) {
        return 'error';
    }
}

const hour = (data3H,timezone) => {
    // (time,temp,feelsLike,rain,pop,cloudiness,windSpeed,windGust)
    const time = `${new Date((data3H.dt - 7200 + timezone) * 1000).getHours()}:00`;
    this.temp = data3H.main.temp;
    this.feelsLike = data3H.main.feels_like;
    this.rain = data3H.rain === undefined ? 0 : data3H.rain['3h'];
    this.pop = data3H.pop;
    this.cloudiness = data3H.clouds.all;
    this.windSpeed = data3H.wind.speed;
    this.windGust = data3H.wind.gust;
    return {time,temp,feelsLike,rain,pop,cloudiness,windSpeed,windGust};
}

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.elements[1].disabled = true;
        getWeatherData(form.elements[0].value)
            .then((data) => {
                console.log(data);
                console.log(hour(data.list[0],data.city.timezone).time);
                day(data);
                form.elements[1].disabled = false;});
            
    })



const day = (data3H) => {
    const hourlyInfo = [];
    this.sunrise = new Date((data3H.city.sunrise - 7200 + data3H.city.timezone) * 1000);
    this.sunset = new Date((data3H.city.sunset - 7200 + data3H.city.timezone) * 1000);
    const addHourInfo = () => {
        hourlyInfo.push(hour());
    }
    const getInfo = () => {
        return {hourlyInfo,dailyInfo};
    }
    return {addHourInfo,getInfo};
}

// const info = () => {
//     const days  = [] 
// }