import React from 'react';
import styled from 'styled-components';
import { WeatherService } from '../services/weatherService';

interface WeatherIconProps {
    iconCode: string;
    description: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const IconContainer = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  display: inline-block;
  
  img {
    width: ${props => {
        switch (props.size) {
            case 'small': return '40px';
            case 'medium': return '60px';
            case 'large': return '80px';
            default: return '60px';
        }
    }};
    height: ${props => {
        switch (props.size) {
            case 'small': return '40px';
            case 'medium': return '60px';
            case 'large': return '80px';
            default: return '60px';
        }
    }};
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
`;

const WeatherIcon: React.FC<WeatherIconProps> = ({
    iconCode,
    description,
    size = 'medium',
    className
}) => {
    return (
        <IconContainer size={size} className={className}>
            <img
                src={WeatherService.getWeatherIconUrl(iconCode)}
                alt={description}
                loading="lazy"
            />
        </IconContainer>
    );
};

export default WeatherIcon;