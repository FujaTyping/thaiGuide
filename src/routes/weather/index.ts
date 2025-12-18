import type { ElysiaApp } from "../../index";
import axios from "axios";
import { t } from "elysia";
// const apiKey = process.env.ACCUWEATHER_API;

// const GetByIdBodySchema = t.Object({
//     province: t.String()
// });

// const getIdInfoHandler = async ({ body, set }: { body: typeof GetByIdBodySchema.static, set: { status: number | string } }) => {
//     const { province } = body;

//     try {
//         if (!apiKey) {
//             set.status = 500;
//             return { error: "AccuWeather API key is not configured." };
//         }

//         const response = await axios.get("http://dataservice.accuweather.com/locations/v1/cities/search", {
//             params: {
//                 apikey: apiKey,
//                 q: province
//             }
//         });

//         if (!response.data || response.data.length === 0) {
//             set.status = 404;
//             return { error: `No location found for province: ${province}` };
//         }
//         const provinceKey = response.data[0].Key;

//         const weatherDataResponse = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${provinceKey}`, {
//             params: {
//                 apikey: apiKey,
//                 metric: true
//             }
//         });

//         const originalForecasts = weatherDataResponse.data;

//         const enhancedDailyForecasts = originalForecasts.DailyForecasts.map((dailyForecast: any) => {
//             const dayIcon = String(dailyForecast.Day.Icon).padStart(2, '0');
//             const nightIcon = String(dailyForecast.Night.Icon).padStart(2, '0');
//             return {
//                 ...dailyForecast,
//                 Day: {
//                     ...dailyForecast.Day,
//                     IconUrl: `https://developer.accuweather.com/sites/default/files/${dayIcon}-s.png`
//                 },
//                 Night: {
//                     ...dailyForecast.Night,
//                     IconUrl: `https://developer.accuweather.com/sites/default/files/${nightIcon}-s.png`
//                 }
//             };
//         });

//         set.status = 200;
//         return {
//             Headline: originalForecasts.Headline,
//             DailyForecasts: enhancedDa bodyilyForecasts,
//             ProvinceKey: provinceKey
//         };
//     } catch (error) {
//         set.status = 500;
//         console.error(error);
//         return { error: "An error occurred while fetching the document." };
//     }
// };

export default (app: ElysiaApp) => app
    .get("/accu/:province", ({ set }: { set: { status: number } }) => { set.status = 410; return "Deprecated" }); //  getIdInfoHandler , {   body: GetByIdBodySchema}