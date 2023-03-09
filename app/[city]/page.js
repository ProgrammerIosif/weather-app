'use client';

import Link from "next/link";

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
            'Sâmbătă'
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
      <h1 className="text-center text-5xl font-extrabold p-10">{dictionary[lang].title} {city[0].toUpperCase() + city.substr(1)}</h1>
      <div className="lg:flex lg:items-center lg:flex-col">
      {days.map((day) => {
        return( 
          <div className="border border-neutral-content rounded-2xl my-10 mx-2 p-4 pl-0 bg-neutral w-max">
            <table className="table text-xl">
              <tr className=" border-b border-neutral-content">
                <td className="font-bold border-r border-neutral-content">{dictionary[lang].day[day.hourlyInfo[0].dayName]}</td>
                {day.hourlyInfo.map((hour) => {
                    return (
                      <td className="p-0"><img src={`http://openweathermap.org/img/wn/${hour.iconCode}@2x.png`} alt="" /></td>
                    )
                  })}
              </tr>
              <tr className="">
                <td className="font-bold border-r border-neutral-content">{day.hourlyInfo[0].date}</td>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <th>{hour.time}</th>
                  )
                  })}
              </tr>
              <tr>
                <td className="font-bold border-r border-neutral-content">{dictionary[lang].temp}</td>
                {day.hourlyInfo.map((hour) => {
                  let temp = Math.round(hour.temp);
                  const displayTemp = temp;
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
                      tempClass = 'bg-yellow-200';
                      break;
                    case temp > 20 && temp <= 30:
                      tempClass = 'bg-orange-400';
                      break;
                    case temp > 30:
                      tempClass = 'bg-red-600';
                      break;
                    default:
                      tempClass = '';
                  }
                  return (
                    <td className={tempClass+' text-black'}>{`${displayTemp}°${unit}`}</td>
                  )
                })}
              </tr>
              <tr>
                <td className="font-bold border-r border-neutral-content" >{dictionary[lang].feel}</td>
                {day.hourlyInfo.map((hour) => {
                  let feelsLike = Math.round(hour.feelsLike);
                  const displayTemp = feelsLike;
                  let feelsLikeClass = '';
                  if (unit === 'F') {
                    feelsLike = Math.round((feelsLike - 32) / 1.8);
                  }
                  switch (true) {
                    case feelsLike === 0:
                      feelsLikeClass = 'bg-white';
                      break;
                    case feelsLike < 0:
                      feelsLikeClass = 'bg-blue-300';
                      break;
                    case feelsLike > 0 && feelsLike <= 10:
                      feelsLikeClass = 'bg-green-900';
                      break;
                    case feelsLike > 10 && feelsLike <= 20:
                      feelsLikeClass = 'bg-yellow-200';
                      break;
                    case feelsLike > 20 && feelsLike <= 30:
                      feelsLikeClass = 'bg-orange-400';
                      break;
                    case feelsLike > 30:
                      feelsLikeClass = 'bg-red-600';
                      break;
                    default:
                      feelsLikeClass = '';
                  }
                  return (
                    <td className={feelsLikeClass + ' text-black'}>{`${displayTemp}°${unit}`}</td>
                  )
                })}
              </tr>
              <tr>
                <td className="font-bold border-r border-neutral-content">{dictionary[lang].rain}</td>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <td>{`${hour.rain} mm`}</td>
                  )
                })}
              </tr>
              <tr>
                <td className="font-bold border-r border-neutral-content">{dictionary[lang].cor}</td>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <td>{`${Math.round(hour.pop * 100)}%`}</td>
                  )
                })}
              </tr>
              <tr>
                <td className="font-bold border-r border-neutral-content">{dictionary[lang].cloud}</td>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <td>{hour.cloudiness}%</td>
                  )
                })}
              </tr>

              <tr>
                <td className="font-bold border-r border-neutral-content">{dictionary[lang].wSpeed}</td>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <td>{Math.round(hour.windSpeed*3.6)} km/h</td>
                  )
                })}
              </tr>
              <tr>
                <td className="font-bold border-r border-neutral-content">{dictionary[lang].wGust}</td>
                {day.hourlyInfo.map((hour) => {
                  return (
                    <td>{Math.round(hour.windGust*3.6)} km/h</td>
                  )
                })}
              </tr>
            </table>
          </div>
        )})}
      </div>
      <Link href="/">
        <button className="btn btn-circle btn-outline float-left fixed bottom-12 left-14 h-16 w-16 text-4xl pb-1">
            ←
        </button>
      </Link>
    </>
  )

}