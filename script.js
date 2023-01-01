async function getWeatherData (cityName) {
    const key = '701331af26f890a05517e29d2a156378';
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

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.elements[1].disabled = true;
        getWeatherData(form.elements[0].value)
            .then((data) => {
                displayData(useData(data))
                form.elements[1].disabled = false;});
    })

const hour = (data,timezone) => {
    const time = `${new Date((data.dt - 7200 + timezone) * 1000).getHours()}:00`;
    this.temp = data.main.temp;
    this.feelsLike = data.main.feels_like;
    this.rain = data.rain === undefined ? 0 : data.rain['3h'];
    this.pop = data.pop;
    this.cloudiness = data.clouds.all;
    this.windSpeed = data.wind.speed;
    this.windGust = data.wind.gust;
    return {time,temp,feelsLike,rain,pop,cloudiness,windSpeed,windGust};
}

const day = (data) => {
    const hourlyInfo = [];
    this.sunrise = new Date((data.city.sunrise - 7200 + data.city.timezone) * 1000);
    this.sunrise = `${this.sunrise.getHours() > 10 ? this.sunrise.getHours() : '0' +this.sunrise.getHours()}:${this.sunrise.getMinutes() > 10 ? this.sunrise.getMinutes() : '0' + this.sunrise.getMinutes()}`;
    this.sunset = new Date((data.city.sunset - 7200 + data.city.timezone) * 1000);
    this.sunset = `${this.sunset.getHours() > 10 ? this.sunset.getHours() : '0' +this.sunset.getHours()}:${this.sunset.getMinutes() > 10 ? this.sunset.getMinutes() : '0' + this.sunset.getMinutes()}`;
    const addHourInfo = (hour) => {
        hourlyInfo.push(hour);
    }
    const getInfo = () => {
        return {hourlyInfo,sunrise,sunset};
    }
    return {addHourInfo,getInfo,hourlyInfo,sunrise,sunset};
}

const useData = (data) => {
    // console.log(data);
    // console.log(hour(data.list[0],data.city.timezone).time);
    const days = [];
    let dayCount = 0;
    days[dayCount] = day(data);
    days[dayCount].addHourInfo(hour(data.list[0],data.city.timezone));
    let hourCount = 1;
    while(true){
        if(new Date((data.list[hourCount].dt - 7200 + data.city.timezone) * 1000).getHours() <
           new Date((data.list[hourCount-1].dt - 7200 + data.city.timezone) * 1000).getHours()){
                if(dayCount == 4)
                    break;
                dayCount++;
                days[dayCount] = day(data);
                days[dayCount].addHourInfo(hour(data.list[hourCount],data.city.timezone));
            }
        else{
            days[dayCount].addHourInfo(hour(data.list[hourCount],data.city.timezone));
        }
        hourCount++; 
    }
    return days;
}

const displayData = (days) => {
    const container = document.querySelector("#container");
    container.innerHTML = '';

    for (const day of days) {
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");

        const dayLabel = document.createElement("div");
        dayLabel.classList.add("day-label");
        dayLabel.textContent = `Day ${day.index + 1}`;
        
        const dayInfo = document.createElement("div");
        dayInfo.classList.add("day-info");

        const sunriseLabel = document.createElement("div");
        sunriseLabel.classList.add("sunrise-label");
        sunriseLabel.textContent = `Sunrise: ${day.sunrise}`;
        dayInfo.appendChild(sunriseLabel);

        const sunsetLabel = document.createElement("div");
        sunsetLabel.classList.add("sunset-label");
        sunsetLabel.textContent = `Sunset: ${day.sunset}`;
        dayInfo.appendChild(sunsetLabel);

        const table = document.createElement("table");
        table.classList.add("hourly-table");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `<th></th>`;
        for (const hour of day.hourlyInfo) {
        const hourCell = document.createElement("th");
        hourCell.textContent = hour.time;
        headerRow.appendChild(hourCell);
        }
        table.appendChild(headerRow);

        const tempRow = document.createElement("tr");
        tempRow.innerHTML = `<th>Temperature</th>`;
        for (const hour of day.hourlyInfo) {
        const tempCell = document.createElement("td");
        tempCell.textContent = hour.temp;
        tempRow.appendChild(tempCell);
        }
        table.appendChild(tempRow);

        const feelsLikeRow = document.createElement("tr");
        feelsLikeRow.innerHTML = `<th>Feels like</th>`;
        for (const hour of day.hourlyInfo) {
        const feelsLikeCell = document.createElement("td");
        feelsLikeCell.textContent = hour.feelsLike;
        feelsLikeRow.appendChild(feelsLikeCell);
        }
        table.appendChild(feelsLikeRow);

        const rainRow = document.createElement("tr");
        rainRow.innerHTML = `<th>Rain</th>`;
        for (const hour of day.hourlyInfo) {
        const rainCell = document.createElement("td");
        rainCell.textContent = hour.rain;
        rainRow.appendChild(rainCell);
        }
        table.appendChild(rainRow);

        const popRow = document.createElement("tr");
        popRow.innerHTML = `<th>Chance of rain</th>`;
        for (const hour of day.hourlyInfo) {
            const popCell = document.createElement("td");
            popCell.textContent = hour.pop;
            popRow.appendChild(popCell);
        }
        table.appendChild(popRow);

        const cloudinessRow = document.createElement("tr");
        cloudinessRow.innerHTML = `<th>Cloudiness</th>`;
        for (const hour of day.hourlyInfo) {
            const cloudinessCell = document.createElement("td");
            cloudinessCell.textContent = hour.cloudiness;
            cloudinessRow.appendChild(cloudinessCell);
        }
        table.appendChild(cloudinessRow);

        const windSpeedRow = document.createElement("tr");
        windSpeedRow.innerHTML = `<th>Wind speed</th>`;
        for (const hour of day.hourlyInfo) {
            const windSpeedCell = document.createElement("td");
            windSpeedCell.textContent = hour.windSpeed;
            windSpeedRow.appendChild(windSpeedCell);
        }
        table.appendChild(windSpeedRow);

        const windGustRow = document.createElement("tr");
        windGustRow.innerHTML = `<th>Wind gust</th>`;
        for (const hour of day.hourlyInfo) {
            const windGustCell = document.createElement("td");
            windGustCell.textContent = hour.windGust;
            windGustRow.appendChild(windGustCell);
        }
        table.appendChild(windGustRow);

        dayContainer.appendChild(dayLabel);
        dayContainer.appendChild(table);
        dayContainer.appendChild(dayInfo);

        container.appendChild(dayContainer);
    }
}