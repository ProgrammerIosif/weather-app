'use client';

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
  let sunrise = new Date((data.city.sunrise - 7200 + data.city.timezone) * 1000);
  let sunset = new Date((data.city.sunset - 7200 + data.city.timezone) * 1000);

  //extract the usefull information
  sunrise = `${sunrise.getHours() > 10 ? sunrise.getHours() : '0' + sunrise.getHours()}:${sunrise.getMinutes() > 10 ? sunrise.getMinutes() : '0' + sunrise.getMinutes()}`;
  sunset = `${sunset.getHours() > 10 ? sunset.getHours() : '0' + sunset.getHours()}:${sunset.getMinutes() > 10 ? sunset.getMinutes() : '0' + sunset.getMinutes()}`;

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

export default function City() {
  const data = JSON.parse(sessionStorage.getItem('data'));
  const {unit,lang,city} = JSON.parse(sessionStorage.getItem('settings'));
  const days = useData(data);
  console.log(days);
  return (
    <>
      <h1>{dictionary[lang].title} {city[0].toUpperCase() + city.substr(1)}</h1>
      {days.map((day) => {
        return( 
          <div>
            <table className="table table-zebra w-2/3">
              <tr>
                <th>{dictionary[lang].day[day.hourlyInfo[0].dayName]}</th>
                {day.hourlyInfo.map((hour) => {
                    return (
                      <td><img src={`http://openweathermap.org/img/wn/${hour.iconCode}@2x.png`} alt="" /></td>
                    )
                  })}
              </tr>
              <tr className="">
                <th>{day.hourlyInfo[0].date}</th>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <th>{hour.time}</th>
                  )
                  })}
              </tr>
              <tr>
                <th>{dictionary[lang].temp}</th>
                {day.hourlyInfo.map((hour) => {
                  let temp = Math.round(hour.temp);
                  let tempClass = '';
                  if (unit === 'F') {
                    temp = Math.round((temp - 32) / 1.8);
                  }
                  switch (true) {
                    case temp === 0:
                      tempClass = 'bg-white';
                      break;
                    case temp < 0:
                      tempClass = 'bg-blue-300';
                      break;
                    case temp > 0 && temp <= 10:
                      tempClass = 'bg-green-900';
                      break;
                    case temp > 10 && temp <= 20:
                      tempClass = 'bg-yellow-300';
                      break;
                    case temp > 20 && temp <= 30:
                      tempClass = 'orange';
                      break;
                    case temp > 30:
                      tempClass = 'red';
                      break;
                    default:
                      tempClass = '';
                  }
                  return (
                    <td className={tempClass+' text-black'}>{`${temp}°${unit}`}</td>
                  )
                })}
              </tr>
              <tr>
                <th>{dictionary[lang].feel}</th>
                {day.hourlyInfo.map((hour) => {
                  let feelsLike = Math.round(hour.feelsLike);
                  let feelsLikeClass = '';
                  if (unit === 'F') {
                    feelsLike = Math.round((feelsLike - 32) / 1.8);
                  }
                  switch (true) {
                    case feelsLike === 0:
                      feelsLikeClass = 'white';
                      break;
                    case feelsLike < 0:
                      feelsLikeClass = 'blue';
                      break;
                    case feelsLike > 0 && feelsLike <= 10:
                      feelsLikeClass = 'green';
                      break;
                    case feelsLike > 10 && feelsLike <= 20:
                      feelsLikeClass = 'yellow';
                      break;
                    case feelsLike > 20 && feelsLike <= 30:
                      feelsLikeClass = 'orange';
                      break;
                    case feelsLike > 30:
                      feelsLikeClass = 'red';
                      break;
                    default:
                      feelsLikeClass = '';
                  }
                  return (
                    <td className={feelsLikeClass}>{`${feelsLike}°${unit}`}</td>
                  )
                })}
              </tr>
              <tr>
                <th>{dictionary[lang].rain}</th>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <td>{`${hour.rain} mm`}</td>
                  )
                })}
              </tr>
              <tr>
                <th>{dictionary[lang].cor}</th>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <td>{`${Math.round(hour.pop * 100)}%`}</td>
                  )
                })}
              </tr>
              </table>
            </div>
        )})}
    </>
  )

}