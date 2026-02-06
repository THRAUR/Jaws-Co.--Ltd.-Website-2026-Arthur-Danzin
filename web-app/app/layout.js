import { Playfair_Display, Manrope } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
})

const manrope = Manrope({
    subsets: ['latin'],
    variable: '--font-manrope',
    display: 'swap',
})

export const metadata = {
    title: 'Jaws Co., Ltd. | Precision Connectors',
    description: 'Leading manufacturer of FFC/FPC and Wire-to-Board connectors based in Taiwan.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${manrope.variable} ${playfair.variable}`}>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    )
}
