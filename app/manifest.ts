import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ThaiGuide',
        short_name: 'ThaiGuide',
        id: "thaiguide",
        description: 'Experience Thailand like never before through fun travel quests, point systems, and rewards. Powered by AI and emotional design, our platform turns every trip into an adventure full of memories',
        start_url: '/@me',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#f7740a',
        orientation: "portrait",
        categories: ["travel", "navigation"],
        lang: "en",
        dir: "ltr",
        icons: [
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ],
        shortcuts: [
            {
                name: "SOS",
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
                name: "Weather",
                url: "/weather",
                icons: [
                    {
                        src: '/media/action/weather.png',
                        sizes: '192x192',
                        type: 'image/png',
                    }
                ]
            },
            {
                name: "Trip planner",
                url: "/planner",
                icons: [
                    {
                        src: '/media/action/planner.png',
                        sizes: '192x192',
                        type: 'image/png',
                    }
                ]
            }
        ],
        screenshots: [
            {
                src: "/media/screenshot/Main.png",
                sizes: "360x730",
                type: "image/png",
            },
            {
                src: "/media/screenshot/Profile.png",
                sizes: "360x730",
                type: "image/png",
            },
            {
                src: "/media/screenshot/Leaderboard.png",
                sizes: "360x730",
                type: "image/png",
            },
            {
                src: "/media/screenshot/Planner.png",
                sizes: "360x730",
                type: "image/png",
            }
        ]
    }
}