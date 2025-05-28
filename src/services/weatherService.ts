/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type {
  ApiWeatherResponse,
  ApiForecastResponse,
  WeatherData,
  ForecastDay,
} from "../types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

if (!API_KEY) {
  throw new Error(
    "OpenWeatherMap API key is required. Please set REACT_APP_OPENWEATHER_API_KEY in your environment variables."
  );
}

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: "metric",
  },
});

export class WeatherService {
  static async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await weatherApi.get<ApiWeatherResponse>("/weather", {
        params: { q: city },
      });

      const data = response.data;

      return {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        visibility: data.visibility,
        pressure: data.main.pressure,
        timestamp: Date.now(),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(
            "City not found. Please check the spelling and try again."
          );
        }
        if (error.response?.status === 401) {
          throw new Error("Invalid API key. Please check your configuration.");
        }
        if (error.response && typeof error.response.status === "number" && error.response.status >= 500) {
          throw new Error(
            "Weather service is temporarily unavailable. Please try again later."
          );
        }
      }
      throw new Error(
        "Failed to fetch weather data. Please check your internet connection."
      );
    }
  }

  static async getForecast(city: string): Promise<ForecastDay[]> {
    try {
      const response = await weatherApi.get<ApiForecastResponse>("/forecast", {
        params: { q: city },
      });

      const data = response.data;

      // Group forecast data by date and get daily summaries
      const dailyForecasts = new Map<string, any[]>();

      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyForecasts.has(date)) {
          dailyForecasts.set(date, []);
        }
        dailyForecasts.get(date)!.push(item);
      });

      const forecast: ForecastDay[] = [];
      let count = 0;

      for (const [date, items] of dailyForecasts) {
        if (count >= 5) break;

        const temps = items.map((item) => item.main.temp);
        const minTemp = Math.round(Math.min(...temps));
        const maxTemp = Math.round(Math.max(...temps));

        // Get the most common weather condition for the day
        const weatherCounts = new Map<string, number>();
        items.forEach((item) => {
          const weather = item.weather[0];
          const key = `${weather.description}|${weather.icon}`;
          weatherCounts.set(key, (weatherCounts.get(key) || 0) + 1);
        });

        const mostCommon = Array.from(weatherCounts.entries()).sort(
          (a, b) => b[1] - a[1]
        )[0][0];
        const [description, icon] = mostCommon.split("|");

        const avgHumidity = Math.round(
          items.reduce((sum, item) => sum + item.main.humidity, 0) /
            items.length
        );

        forecast.push({
          date,
          temperature: { min: minTemp, max: maxTemp },
          description,
          icon,
          humidity: avgHumidity,
        });

        count++;
      }

      return forecast;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("City not found for forecast data.");
        }
      }
      throw new Error("Failed to fetch forecast data.");
    }
  }

  static getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}
