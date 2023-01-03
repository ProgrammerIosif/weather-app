async function getWeatherData (cityName) {
    const key = '701331af26f890a05517e29d2a156378';
    //getting data from the openweathermap API
    try {
        const url1 = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${cityName}&APPID=${key}`;
        const data = await fetch(url1)
            .then(function(response) {
                    return response.json();
                }).then(function(response) {return response;});
        if(data.cod === '404')
            throw new Error('City not found');
        return data;
    } catch (error) {
        return error;
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.elements[1].disabled = true;
        getWeatherData(form.elements[0].value)
            .then((data) => {
                displayData(useData(data))
                form.elements[1].disabled = false;})
            .catch((err) => {
                form.elements[1].disabled = false;});
    })

const hour = (data,timezone) => {
    const newDate = new Date((data.dt - 7200 + timezone) * 1000);
    console.log(newDate);
    const date = `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}`;
    const time = `${new Date((data.dt - 7200 + timezone) * 1000).getHours()}:00`;
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const rain = data.rain === undefined ? 0 : data.rain['3h'];
    const pop = data.pop;
    const cloudiness = data.clouds.all;
    const windSpeed = data.wind.speed;
    const windGust = data.wind.gust;
    const iconCode = data.weather[0].icon;
    return {date,time,temp,feelsLike,rain,pop,cloudiness,windSpeed,windGust,iconCode};
}

const day = (data) => {
    const hourlyInfo = [];

    //get full date for sunrise and sunset
    this.sunrise = new Date((data.city.sunrise - 7200 + data.city.timezone) * 1000);
    this.sunset = new Date((data.city.sunset - 7200 + data.city.timezone) * 1000);

    //extract the usefull information
    this.sunrise = `${this.sunrise.getHours() > 10 ? this.sunrise.getHours() : '0' +this.sunrise.getHours()}:${this.sunrise.getMinutes() > 10 ? this.sunrise.getMinutes() : '0' + this.sunrise.getMinutes()}`;
    this.sunset = `${this.sunset.getHours() > 10 ? this.sunset.getHours() : '0' +this.sunset.getHours()}:${this.sunset.getMinutes() > 10 ? this.sunset.getMinutes() : '0' + this.sunset.getMinutes()}`;

    const addHourInfo = (hour) => {
        hourlyInfo.push(hour);
    }
    return {addHourInfo,hourlyInfo,sunrise,sunset};
}

const useData = (data) => {
    // console.log(data);
    // console.log(hour(data.list[0],data.city.timezone).time);
    console.log(data);
    const days = [];
    let dayCount = 0;
    days[dayCount] = day(data);
    days[dayCount].addHourInfo(hour(data.list[0],data.city.timezone));
    let hourCount = 1;
    console.log(data.list[hourCount]);
    while(true){
        if(data.list[hourCount] == undefined || new Date((data.list[hourCount].dt - 7200 + data.city.timezone) * 1000).getHours() <
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
    for (const day of days) {
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");
        
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
        const iconRow = document.createElement("tr");
        iconRow.innerHTML = `<td></td>`;
        for (const hour of day.hourlyInfo) {
            const iconCell = document.createElement("td");
            const iconImg = document.createElement("img");
            iconImg.src = `http://openweathermap.org/img/wn/${hour.iconCode}@2x.png`;
            iconCell.appendChild(iconImg);
            iconRow.appendChild(iconCell);
        }
        table.appendChild(iconRow)

        table.classList.add("hourly-table");
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `<th style="text-align:center">${day.hourlyInfo[0].date}</th>`;
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
            tempCell.textContent = `${Math.round(hour.temp)}°C`;
            tempRow.appendChild(tempCell);
        }
        table.appendChild(tempRow);

        const feelsLikeRow = document.createElement("tr");
        feelsLikeRow.innerHTML = `<th>Feels like</th>`;
        for (const hour of day.hourlyInfo) {
            const feelsLikeCell = document.createElement("td");
            feelsLikeCell.textContent = `${Math.round(hour.feelsLike)}°C`;
            feelsLikeRow.appendChild(feelsLikeCell);
        }
        table.appendChild(feelsLikeRow);

        const rainRow = document.createElement("tr");
        rainRow.innerHTML = `<th>Rain</th>`;
        for (const hour of day.hourlyInfo) {
            const rainCell = document.createElement("td");
            rainCell.textContent = `${hour.rain} mm`;
            rainRow.appendChild(rainCell);
        }
        table.appendChild(rainRow);

        const popRow = document.createElement("tr");
        popRow.innerHTML = `<th>Chance of rain</th>`;
        for (const hour of day.hourlyInfo) {
            const popCell = document.createElement("td");
            popCell.textContent = `${Math.round(hour.pop*100)}%`;
            popRow.appendChild(popCell);
        }
        table.appendChild(popRow);

        const cloudinessRow = document.createElement("tr");
        cloudinessRow.innerHTML = `<th>Cloudiness</th>`;
        for (const hour of day.hourlyInfo) {
            const cloudinessCell = document.createElement("td");
            cloudinessCell.textContent = `${hour.cloudiness}%`;
            cloudinessRow.appendChild(cloudinessCell);
        }
        table.appendChild(cloudinessRow);

        const windSpeedRow = document.createElement("tr");
        windSpeedRow.innerHTML = `<th>Wind speed</th>`;
        for (const hour of day.hourlyInfo) {
            const windSpeedCell = document.createElement("td");
            windSpeedCell.textContent = `${Math.round(hour.windSpeed*3.6)} km/h`;
            windSpeedRow.appendChild(windSpeedCell);
        }
        table.appendChild(windSpeedRow);

        const windGustRow = document.createElement("tr");
        windGustRow.innerHTML = `<th>Wind gust</th>`;
        for (const hour of day.hourlyInfo) {
            const windGustCell = document.createElement("td");
            windGustCell.textContent = `${Math.round(hour.windGust*3.6)} km/h`;
            windGustRow.appendChild(windGustCell);
        }
        table.appendChild(windGustRow);

        dayContainer.appendChild(table);
        dayContainer.appendChild(dayInfo);

        container.appendChild(dayContainer);
    }
}