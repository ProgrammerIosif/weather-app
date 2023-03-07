import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <div className='flex flex-col items-center justify-around gap-10 h-[100vh] bg-base-100 text-neutral-content'>
        <div className="card w-96 bg-neutral text-neutral-content">
          <div className="card-body">
            <h1 className="text-5xl text-center font-bold mb-10">WEATHER</h1>


            {/* language */}
            <p className=' text-2xl'> LANGUAGE</p>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="language" className="radio" checked />
                <span className="label-text text-2xl">English</span> 
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="language" className="radio" checked />
                <span className="label-text text-2xl">Romana</span> 
              </label>
            </div>

            {/* temperature */}
            <p className=' text-2xl'>TEMPERATURE IN</p>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="unit" className="radio" checked />
                <span className="label-text text-2xl">Celcius</span> 
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <input type="radio" name="unit" className="radio" checked />
                <span className="label-text text-2xl">Fahrenheit</span> 
              </label>
            </div>

            {/* location */}
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text text-2xl">LOCATION</span>
              </label>
              <div className='flex gap-4'>
                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs bg-neutral" />
                <button className="btn btn-outline">ENTER</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
