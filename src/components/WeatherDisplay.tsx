import React from 'react';
import styled from 'styled-components';
import { useWeather } from '../contexts/WeatherContext';
import { useAuth } from '../contexts/AuthContext';
import { WeatherService } from '../services/weatherService';
import { formatTemperature, getTemperatureRange } from '../utils/temperature';

const WeatherContainer = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const CurrentWeatherCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const WeatherHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LocationInfo = styled.div`
  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  p {
    margin: 0.25rem 0 0 0;
    opacity: 0.9;
    font-size: 1rem;
  }
`;

const WeatherIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  img {
    width: 80px;
    height: 80px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  }
`;

const TemperatureDisplay = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  
  .main-temp {
    font-size: 4rem;
    font-weight: 300;
    margin: 0;
    line-height: 1;
  }
  
  .feels-like {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0.5rem 0 0 0;
  }
  
  .description {
    font-size: 1.2rem;
    margin: 0.5rem 0 0 0;
    text-transform: capitalize;
    font-weight: 500;
  }
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const DetailItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(5px);
  
  .label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const ForecastSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ForecastCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
  
  .date {
    font-weight: 600;
    color: #495057;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  .forecast-icon {
    width: 50px;
    height: 50px;
    margin: 0.5rem auto;
  }
  
  .forecast-temp {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0.5rem 0;
  }
  
  .forecast-desc {
    font-size: 0.9rem;
    color: #6c757d;
    text-transform: capitalize;
    margin-bottom: 0.5rem;
  }
  
  .forecast-humidity {
    font-size: 0.8rem;
    color: #6c757d;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  
  h3 {
    margin-bottom: 1rem;
    color: #495057;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const AuthRequiredState = styled.div`
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 2px dashed #dee2e6;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }
  
  h3 {
    margin-bottom: 1rem;
    color: #495057;
    font-size: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  .features {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    margin-top: 1.5rem;
    text-align: left;
    
    h4 {
      margin: 0 0 1rem 0;
      color: #495057;
      text-align: center;
    }
    
    ul {
      margin: 0;
      padding-left: 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
        color: #6c757d;
      }
    }
  }
`;

const WeatherDisplay: React.FC = () => {
    const { currentWeather, forecast, isLoading, temperatureUnit } = useWeather();
    const { user } = useAuth();

    if (!user) {
        return (
            <AuthRequiredState>
                <div className="icon">🌤️</div>
                <h3>Welcome to Weather Dashboard</h3>
                <p>Sign in to unlock the full weather experience with real-time data and personalized features.</p>

                <div className="features">
                    <h4>🚀 Features Available After Sign In:</h4>
                    <ul>
                        <li>🌍 Search weather for any city worldwide</li>
                        <li>📅 5-day detailed weather forecast</li>
                        <li>⭐ Save and manage favorite cities</li>
                        <li>🌡️ Toggle between Celsius and Fahrenheit</li>
                        <li>🔄 Auto-refresh every 30 seconds</li>
                        <li>💾 Sync data across all your devices</li>
                        <li>📱 Responsive design for mobile and desktop</li>
                    </ul>
                </div>
            </AuthRequiredState>
        );
    }

    if (isLoading) {
        return (
            <LoadingSpinner>
                <div className="spinner" />
            </LoadingSpinner>
        );
    }

    if (!currentWeather) {
        return (
            <EmptyState>
                <div className="icon">🔍</div>
                <h3>Ready to Explore Weather</h3>
                <p>Search for a city above to see current weather conditions and 5-day forecast.</p>
            </EmptyState>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <WeatherContainer>
            <CurrentWeatherCard>
                <WeatherHeader>
                    <LocationInfo>
                        <h2>{currentWeather.name}</h2>
                        <p>{currentWeather.country}</p>
                    </LocationInfo>
                    <WeatherIcon>
                        <img
                            src={WeatherService.getWeatherIconUrl(currentWeather.icon)}
                            alt={currentWeather.description}
                        />
                    </WeatherIcon>
                </WeatherHeader>

                <TemperatureDisplay>
                    <h1 className="main-temp">
                        {formatTemperature(currentWeather.temperature, temperatureUnit)}
                    </h1>
                    <p className="feels-like">
                        Feels like {formatTemperature(currentWeather.feelsLike, temperatureUnit)}
                    </p>
                    <p className="description">{currentWeather.description}</p>
                </TemperatureDisplay>

                <WeatherDetails>
                    <DetailItem>
                        <div className="label">Humidity</div>
                        <div className="value">{currentWeather.humidity}%</div>
                    </DetailItem>
                    <DetailItem>
                        <div className="label">Wind Speed</div>
                        <div className="value">{currentWeather.windSpeed} m/s</div>
                    </DetailItem>
                    <DetailItem>
                        <div className="label">Pressure</div>
                        <div className="value">{currentWeather.pressure} hPa</div>
                    </DetailItem>
                    <DetailItem>
                        <div className="label">Visibility</div>
                        <div className="value">{(currentWeather.visibility / 1000).toFixed(1)} km</div>
                    </DetailItem>
                </WeatherDetails>
            </CurrentWeatherCard>

            {forecast.length > 0 && (
                <ForecastSection>
                    <h3>5-Day Forecast</h3>
                    <ForecastGrid>
                        {forecast.map((day, index) => (
                            <ForecastCard key={day.date}>
                                <div className="date">
                                    {index === 0 ? 'Today' : formatDate(day.date)}
                                </div>
                                <img
                                    className="forecast-icon"
                                    src={WeatherService.getWeatherIconUrl(day.icon)}
                                    alt={day.description}
                                />
                                <div className="forecast-temp">
                                    {getTemperatureRange(day.temperature.min, day.temperature.max, temperatureUnit)}
                                </div>
                                <div className="forecast-desc">{day.description}</div>
                                <div className="forecast-humidity">Humidity: {day.humidity}%</div>
                            </ForecastCard>
                        ))}
                    </ForecastGrid>
                </ForecastSection>
            )}
        </WeatherContainer>
    );
};

export default WeatherDisplay;