import './globals.css'

export const metadata = {
  title: 'Weather',
  description: 'Weater App using the OpenWeatherMap API'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="luxury">
      <body>{children}</body>
    </html>
  )
}
