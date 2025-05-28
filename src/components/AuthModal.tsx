/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  animation: ${slideUp} 0.4s ease-out;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #f8f9fa;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    color: #495057;
    transform: rotate(90deg);
  }
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    margin: 0;
    color: #6c757d;
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const GoogleButton = styled.button<{ isLoading: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  background: white;
  color: #333;
  border: 2px solid #e1e5e9;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover:not(:disabled) {
    border-color: #4285f4;
    box-shadow: 
      0 8px 25px rgba(66, 133, 244, 0.15),
      0 0 0 3px rgba(66, 133, 244, 0.1);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    
    .loading-spinner {
      animation: ${pulse} 1.5s ease-in-out infinite;
    }
  }
  
  .google-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border: 1px solid #f5c6cb;
  border-radius: 12px;
  text-align: center;
  animation: ${slideUp} 0.3s ease-out;
`;

const FeaturesList = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  border: 1px solid #e9ecef;
  
  h4 {
    margin: 0 0 1rem 0;
    color: #495057;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }
  
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    
    li {
      margin-bottom: 0.75rem;
      color: #6c757d;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      &::before {
        content: '✨';
        font-size: 0.8rem;
        flex-shrink: 0;
      }
    }
  }
`;

const SecurityNote = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(23, 162, 184, 0.1);
  border: 1px solid rgba(23, 162, 184, 0.2);
  border-radius: 12px;
  text-align: center;
  
  .icon {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  p {
    margin: 0;
    color: #0c5460;
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = useAuth();
  const loginWithGoogle = auth?.loginWithGoogle;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
        onClose();
      } else {
        setError('Google login is not available at the moment. Please try again later.');
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose} aria-label="Close modal">
          ×
        </CloseButton>

        <WelcomeSection>
          <span className="icon">🌤️</span>
          <h2>Welcome to Weather Dashboard</h2>
          <p>Sign in to access personalized weather features and save your favorite cities</p>
        </WelcomeSection>

        <GoogleButton
          onClick={handleGoogleLogin}
          disabled={isLoading}
          isLoading={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="loading-spinner" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
            </>
          )}
        </GoogleButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FeaturesList>
          <h4>🚀 What you'll get:</h4>
          <ul>
            <li>Search weather for any city worldwide</li>
            <li>5-day detailed weather forecasts</li>
            <li>Save and manage favorite cities</li>
            <li>Auto-refresh weather data</li>
            <li>Sync across all your devices</li>
          </ul>
        </FeaturesList>

        <SecurityNote>
          <span className="icon">🔒</span>
          <p>
            Your data is secure and private. We only use your Google account for authentication
            and don't access any personal information beyond your email address.
          </p>
        </SecurityNote>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AuthModal;