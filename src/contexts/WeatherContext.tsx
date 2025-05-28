/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { WeatherState, WeatherContextType, WeatherData, ForecastDay } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import { LocalStorageService } from '../utils/localStorage';
import { useAuth } from './AuthContext';

type WeatherAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_WEATHER'; payload: { weather: WeatherData; forecast: ForecastDay[] } }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_LAST_SEARCHED_CITY'; payload: string }
    | { type: 'TOGGLE_TEMPERATURE_UNIT' }
    | { type: 'RESET_STATE' };

const initialState: WeatherState = {
    currentWeather: null,
    forecast: [],
    isLoading: false,
    error: null,
    lastSearchedCity: '',
    temperatureUnit: LocalStorageService.getTemperatureUnit(),
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload, error: null };
        case 'SET_WEATHER':
            return {
                ...state,
                currentWeather: action.payload.weather,
                forecast: action.payload.forecast,
                isLoading: false,
                error: null,
            };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'SET_LAST_SEARCHED_CITY':
            return { ...state, lastSearchedCity: action.payload };
        case 'TOGGLE_TEMPERATURE_UNIT': {
            const newUnit = state.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
            LocalStorageService.setTemperatureUnit(newUnit);
            return { ...state, temperatureUnit: newUnit };
        }
        case 'RESET_STATE':
            return { ...initialState, temperatureUnit: state.temperatureUnit };
        default:
            return state;
    }
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(weatherReducer, initialState);
    const { user, profile } = useAuth();

    const searchWeather = useCallback(async (city: string) => {
        // Require authentication for weather search
        if (!user) {
            dispatch({
                type: 'SET_ERROR',
                payload: 'Please sign in to search for weather data'
            });
            return;
        }

        if (!city.trim()) {
            dispatch({ type: 'SET_ERROR', payload: 'Please enter a city name' });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const [weather, forecast] = await Promise.all([
                WeatherService.getCurrentWeather(city),
                WeatherService.getForecast(city),
            ]);

            dispatch({ type: 'SET_WEATHER', payload: { weather, forecast } });
            dispatch({ type: 'SET_LAST_SEARCHED_CITY', payload: city });

            // Save to user's profile if available
            if (profile) {
                LocalStorageService.setLastSearchedCity(city);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    }, [user, profile]);
    const toggleTemperatureUnit = useCallback(() => {
        dispatch({ type: 'TOGGLE_TEMPERATURE_UNIT' });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    // Reset state when user logs out
    useEffect(() => {
        if (!user) {
            dispatch({ type: 'RESET_STATE' });
        }
    }, [user]);

    // Auto-refresh weather data every 30 seconds (only for authenticated users)
    useEffect(() => {
        if (!user || !state.currentWeather) return;

        const interval = setInterval(() => {
            if (state.lastSearchedCity) {
                searchWeather(state.lastSearchedCity);
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [state.currentWeather, state.lastSearchedCity, searchWeather, user]);

    // Load last searched city on mount (only for authenticated users)
    useEffect(() => {
        if (user && profile && !state.currentWeather) {
            const lastCity = profile.favorite_cities?.[0] || LocalStorageService.getLastSearchedCity();
            if (lastCity) {
                searchWeather(lastCity);
            }
        }
    }, [user, profile, state.currentWeather, searchWeather]);

    const contextValue: WeatherContextType = {
        ...state,
        searchWeather,
        toggleTemperatureUnit,
        clearError,
    };

    return (
        <WeatherContext.Provider value={contextValue}>
            {children}
        </WeatherContext.Provider>
    );
}

export function useWeather() {
    const context = useContext(WeatherContext);
    if (context === undefined) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
}