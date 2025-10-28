import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.text};
  color: white;
  padding: ${props => props.theme.spacing.xl} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  text-align: center;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; 2024 AI Hiring System. All rights reserved.</p>
        <p>Powered by AI and Machine Learning</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
