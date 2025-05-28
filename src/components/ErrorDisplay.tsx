import React from 'react';
import styled from 'styled-components';
import { useWeather } from '../contexts/WeatherContext';

const ErrorContainer = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const ErrorIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
    line-height: 1.4;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ErrorDisplay: React.FC = () => {
    const { error, clearError } = useWeather();

    if (!error) return null;

    const getErrorTitle = (errorMessage: string): string => {
        if (errorMessage.includes('not found')) return 'City Not Found';
        if (errorMessage.includes('API key')) return 'Configuration Error';
        if (errorMessage.includes('network') || errorMessage.includes('internet')) return 'Connection Error';
        if (errorMessage.includes('temporarily unavailable')) return 'Service Unavailable';
        return 'Error';
    };

    const getErrorSuggestion = (errorMessage: string): string => {
        if (errorMessage.includes('not found')) {
            return 'Please check the spelling and try again. Make sure to enter a valid city name.';
        }
        if (errorMessage.includes('API key')) {
            return 'Please check your API configuration and try again.';
        }
        if (errorMessage.includes('network') || errorMessage.includes('internet')) {
            return 'Please check your internet connection and try again.';
        }
        if (errorMessage.includes('temporarily unavailable')) {
            return 'The weather service is experiencing issues. Please try again in a few minutes.';
        }
        return 'Please try again or contact support if the problem persists.';
    };

    return (
        <ErrorContainer>
            <ErrorContent>
                <ErrorIcon>⚠️</ErrorIcon>
                <ErrorMessage>
                    <h4>{getErrorTitle(error)}</h4>
                    <p>{getErrorSuggestion(error)}</p>
                </ErrorMessage>
            </ErrorContent>
            <CloseButton onClick={clearError} aria-label="Close error message">
                ✕
            </CloseButton>
        </ErrorContainer>
    );
};

export default ErrorDisplay;