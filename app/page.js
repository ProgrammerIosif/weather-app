import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <div className='flex flex-col items-center justify-around gap-10 h-[100vh] bg-neutral text-neutral-content'>
        <div className="card w-96 bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="text-5xl text-center font-bold">WEATHER</h2>

            

            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
