import React, { useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { useWeather } from '../contexts/WeatherContext';
import { useAuth } from '../contexts/AuthContext';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SearchInputField = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #6c757d;
  }
  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0056b3, #004085);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const UnitToggle = styled.button`
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  &:active:not(:disabled) {
    background: #dee2e6;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const AuthRequiredMessage = styled.div`
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }
`;

const SearchInput: React.FC = () => {
    const [city, setCity] = useState('');
    const { searchWeather, isLoading, temperatureUnit, toggleTemperatureUnit } = useWeather();
    const { user } = useAuth();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (city.trim() && user) {
            searchWeather(city.trim());
        }
    };

    const isDisabled = !user || isLoading;

    if (!user) {
        return (
            <SearchContainer>
                <AuthRequiredMessage>
                    <h4>🔐 Authentication Required</h4>
                    <p>Please sign in to search for weather data and access all features</p>
                </AuthRequiredMessage>
                <SearchForm onSubmit={handleSubmit}>
                    <SearchInputField
                        type="text"
                        value=""
                        placeholder="Sign in to search for cities..."
                        disabled={true}
                        readOnly
                    />
                    <SearchButton type="submit" disabled={true}>
                        Search
                    </SearchButton>
                    <UnitToggle type="button" disabled={true}>
                        °C
                    </UnitToggle>
                </SearchForm>
            </SearchContainer>
        );
    }

    return (
        <SearchContainer>
            <SearchForm onSubmit={handleSubmit}>
                <SearchInputField
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name (e.g., London, New York)"
                    disabled={isDisabled}
                />
                <SearchButton type="submit" disabled={isDisabled || !city.trim()}>
                    {isLoading ? 'Searching...' : 'Search'}
                </SearchButton>
                <UnitToggle type="button" onClick={toggleTemperatureUnit} disabled={isLoading}>
                    {temperatureUnit === 'celsius' ? '°C' : '°F'}
                </UnitToggle>
            </SearchForm>
        </SearchContainer>
    );
};

export default SearchInput;