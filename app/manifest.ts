import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ThaiGuide',
        short_name: 'ThaiGuide',
        description: 'Explore, Earn, and Enjoy',
        start_url: '/@me',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f7740a',
        icons: [
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ],
        shortcuts: [
            {
                name: "Help Needed!",
                url: "/sos",
                icons: [
                    {
                        src: '/media/action/sos.png',
                        sizes: '192x192',
                        type: 'image/png',
                    }
                ]
            },
            {
                name: "Should I Travel?",
                url: "/weather",
                icons: [
                    {
                        src: '/media/action/weather.png',
                        sizes: '192x192',
                        type: 'image/png',
                    }
                ]
            }
        ]
    }
}