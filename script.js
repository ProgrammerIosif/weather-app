const dictionary = {
    en:{
        title: 'Weather in',
        temp: 'Temperature',
        feel: 'Feels like',
        rain: 'Rain',
        cor: 'Chance of rain',
        cloud: 'Cloudiness',
        wSpeed: 'Wind Speed',
        wGust: 'Wind Gust',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        day:[
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ]
    },
    ro:{
        title: 'Vremea în',
        temp: 'Temperatură',
        feel: 'Resimțită',
        rain: 'Cantitate precipitații',
        cor: 'Probabilitate precipitații',
        cloud: 'Acoperire cu nori',
        wSpeed: 'Viteza vântului',
        wGust: 'Viteza la rafală',
        sunrise: 'Răsărit de soare',
        sunset: 'Apus de soare',
        day:[
            'Duminică',
            'Luni',
            'Marți',
            'Miercuri',
            'Joi',
            'Vineri',
            'Sambătă'
        ]
    }
}

async function getWeatherData (cityName,unit) {
    const key = '701331af26f890a05517e29d2a156378';
    //getting data from the openweathermap API
    try {
        const url1 = `https://api.openweathermap.org/data/2.5/forecast?units=${unit==='C' ? 'metric' : 'imperial'}&q=${cityName}&APPID=${key}`;
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
        form.elements[5].disabled = true;
        let unit;
        if(form.elements[2].checked)
            unit = 'C';
        else
            unit = 'F';
        let lang;
        if(form.elements[0].checked)
            lang = 'en';
        else 
            lang = 'ro';
        getWeatherData(form.elements[4].value,unit)
            .then((data) => {
                document.getElementById("error-message").innerHTML="";
                displayTables(useData(data),form.elements[4].value,unit,lang);
                form.elements[5].disabled = false;})
            .catch((err) => {
                document.getElementById("error-message").innerHTML="Location not found!";
                form.elements[5].disabled = false;});
    })

const hour = (data,timezone) => {
    const newDate = new Date((data.dt - 7200 + timezone) * 1000);
    const dayName = newDate.getDay();
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
    return {date,dayName,time,temp,feelsLike,rain,pop,cloudiness,windSpeed,windGust,iconCode};
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
    const days = [];
    let dayCount = 0;
    days[dayCount] = day(data);
    days[dayCount].addHourInfo(hour(data.list[0],data.city.timezone));
    let hourCount = 1;
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

const displayTables = (days,city,unit,lang) => {
    const container = document.querySelector("#container");
    container.innerHTML = '';
    
    const title = document.createElement("h1");
    title.textContent = `${dictionary[lang].title} ${city[0].toUpperCase() + city.substr(1)}`;
    container.appendChild(title);

    const form = document.querySelector("form");

    const toggleButton = document.createElement("button");
    toggleButton.textContent = '←';
    toggleButton.addEventListener("click", () => {
        container.innerHTML = '';
        form.classList.remove("hidden");
    });
    container.appendChild(toggleButton);
    form.classList.add("hidden");

    for (const day of days) {
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");
        
        const dayInfo = document.createElement("div");
        dayInfo.classList.add("day-info");

        const sunriseLabel = document.createElement("div");
        sunriseLabel.classList.add("sunrise-label");
        sunriseLabel.textContent = `${dictionary[lang].sunrise}: ${day.sunrise}`;
        dayInfo.appendChild(sunriseLabel);

        const sunsetLabel = document.createElement("div");
        sunsetLabel.classList.add("sunset-label");
        sunsetLabel.textContent = `${dictionary[lang].sunset}: ${day.sunset}`;
        dayInfo.appendChild(sunsetLabel);

        const table = document.createElement("table");
        const iconRow = document.createElement("tr");
        iconRow.innerHTML = `<td style="text-align:center;font-weight:bold;font-size:1.2rem">${dictionary[lang].day[day.hourlyInfo[0].dayName]}</td>`;
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
        tempRow.innerHTML = `<th>${dictionary[lang].temp}</th>`;
        for (const hour of day.hourlyInfo) {
            const tempCell = document.createElement("td");
            let temp = Math.round(hour.temp);
            tempCell.textContent = `${temp}°${unit}`;
            if(unit == 'F')
                temp = Math.round((temp-32)/1.8);
            switch (true) {
                case temp == 0:
                    tempCell.classList.add("white");
                    break;
                case temp < 0:
                    tempCell.classList.add("blue");
                    break;
                case temp > 0 && temp <= 10:
                    tempCell.classList.add("green");
                    break;
                case temp > 10 && temp <= 20:
                    tempCell.classList.add("yellow");
                    break;
                case temp > 20 && temp <= 30:
                    tempCell.classList.add("orange");
                    break;
                case temp > 30:
                    tempCell.classList.add("red");
            }
            tempRow.appendChild(tempCell);
        }
        table.appendChild(tempRow);

        const feelsLikeRow = document.createElement("tr");
        feelsLikeRow.innerHTML = `<th>${dictionary[lang].feel}</th>`;
        for (const hour of day.hourlyInfo) {
            const feelsLikeCell = document.createElement("td");
            let temp = Math.round(hour.feelsLike);
            feelsLikeCell.textContent = `${temp}°${unit}`;
            if(unit == 'F')
                temp = Math.round((temp-32)/1.8);
            switch (true) {
                case temp == 0:
                    feelsLikeCell.classList.add("white");
                    break;
                case temp < 0:
                    feelsLikeCell.classList.add("blue");
                    break;
                case temp > 0 && temp <= 10:
                    feelsLikeCell.classList.add("green");
                    break;
                case temp > 10 && temp <= 20:
                    feelsLikeCell.classList.add("yellow");
                    break;
                case temp > 20 && temp <= 30:
                    feelsLikeCell.classList.add("orange");
                    break;
                case temp > 30:
                    feelsLikeCell.classList.add("red");
            }
            feelsLikeRow.appendChild(feelsLikeCell);
        }
        table.appendChild(feelsLikeRow);

        const rainRow = document.createElement("tr");
        rainRow.innerHTML = `<th>${dictionary[lang].rain}</th>`;
        for (const hour of day.hourlyInfo) {
            const rainCell = document.createElement("td");
            rainCell.textContent = `${hour.rain} mm`;
            rainRow.appendChild(rainCell);
        }
        table.appendChild(rainRow);

        const popRow = document.createElement("tr");
        popRow.innerHTML = `<th>${dictionary[lang].cor}</th>`;
        for (const hour of day.hourlyInfo) {
            const popCell = document.createElement("td");
            popCell.textContent = `${Math.round(hour.pop*100)}%`;
            popRow.appendChild(popCell);
        }
        table.appendChild(popRow);

        const cloudinessRow = document.createElement("tr");
        cloudinessRow.innerHTML = `<th>${dictionary[lang].cloud}</th>`;
        for (const hour of day.hourlyInfo) {
            const cloudinessCell = document.createElement("td");
            cloudinessCell.textContent = `${hour.cloudiness}%`;
            cloudinessRow.appendChild(cloudinessCell);
        }
        table.appendChild(cloudinessRow);

        const windSpeedRow = document.createElement("tr");
        windSpeedRow.innerHTML = `<th>${dictionary[lang].wSpeed}</th>`;
        for (const hour of day.hourlyInfo) {
            const windSpeedCell = document.createElement("td");
            windSpeedCell.textContent = `${Math.round(hour.windSpeed*3.6)} km/h`;
            windSpeedRow.appendChild(windSpeedCell);
        }
        table.appendChild(windSpeedRow);

        const windGustRow = document.createElement("tr");
        windGustRow.innerHTML = `<th>${dictionary[lang].wGust}</th>`;
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