import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .icon {
    font-size: 2rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  .email {
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  .welcome {
    font-size: 0.8rem;
    opacity: 0.7;
  }
`;

const AuthButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Header: React.FC = () => {
    const { user, signOut } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleAuthAction = () => {
        if (user) {
            signOut();
        } else {
            setShowAuthModal(true);
        }
    };

    return (
        <>
            <HeaderContainer>
                <HeaderContent>
                    <Logo>
                        <span className="icon">🌤️</span>
                        Weather Dashboard
                    </Logo>

                    <UserSection>
                        {user && (
                            <UserInfo>
                                <div className="email">{user.email}</div>
                                <div className="welcome">Welcome back!</div>
                            </UserInfo>
                        )}
                        <AuthButton onClick={handleAuthAction}>
                            {user ? 'Sign Out' : 'Sign In'}
                        </AuthButton>
                    </UserSection>
                </HeaderContent>
            </HeaderContainer>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </>
    );
};

export default Header;