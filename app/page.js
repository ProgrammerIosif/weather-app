'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();
  const [route, setRoute] = useState();

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
  
  const submitForm = (e) => {
    e.preventDefault();
    const form = e.target;
    const city = form.elements[4].value;
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
    getWeatherData(city,unit)
      .then((data) => {
        sessionStorage.setItem('data',JSON.stringify(data))
        const settings = {unit:unit, lang:lang, city:city}
        sessionStorage.setItem('settings', JSON.stringify(settings));
        form.elements[5].disabled = false;
        router.push("/" + data.city.name);
        })
      .catch((err) => {
        form.elements[5].disabled = false;});
  }
  
  return (
    <main>
      <div className='flex flex-col items-center justify-around gap-10 h-[100vh] bg-base-100 text-neutral-content'>
        <div className="card w-96 bg-neutral text-neutral-content">
          <form className="card-body" onSubmit={submitForm}>
            <h1 className="text-5xl text-center font-bold mb-10">WEATHER</h1>


            {/* language */}
            <p className=' text-2xl'> LANGUAGE</p>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="language" className="radio"/>
                <span className="label-text text-2xl">English</span> 
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="language" className="radio"  />
                <span className="label-text text-2xl">Romana</span> 
              </label>
            </div>

            {/* temperature */}
            <p className=' text-2xl'>TEMPERATURE IN</p>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="unit" className="radio"  />
                <span className="label-text text-2xl">Celcius</span> 
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="unit" className="radio"  />
                <span className="label-text text-2xl">Fahrenheit</span> 
              </label>
            </div>

            {/* location */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-2xl">LOCATION</span>
              </label>
              <div className='flex gap-4'>
                <input type="text" placeholder="" className="input input-bordered w-full max-w-xs bg-neutral" />
                <button className="btn btn-outline">ENTER</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}
