import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const HeroSection = styled.section`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl} 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, #1e40af 100%);
  color: white;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: ${props => props.theme.spacing.xl};
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: white;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: 600;
  text-decoration: none;
  font-size: 1.1rem;
  
  &:hover {
    background: #f8fafc;
    transform: translateY(-2px);
    transition: all 0.2s;
  }
`;

const FeaturesSection = styled.section`
  padding: ${props => props.theme.spacing.xxl} 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.text};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
`;

const FeatureCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>AI-Powered Hiring Made Simple</HeroTitle>
        <HeroSubtitle>
          Find the perfect match between candidates and jobs using advanced AI technology.
          Streamline your hiring process and discover top talent effortlessly.
        </HeroSubtitle>
        <CTAButton to="/register">Get Started Today</CTAButton>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Our Platform?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI-Powered Matching</FeatureTitle>
            <FeatureDescription>
              Our advanced algorithms analyze resumes and job descriptions to find the perfect matches,
              saving you time and improving hiring quality.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📄</FeatureIcon>
            <FeatureTitle>Smart Resume Parsing</FeatureTitle>
            <FeatureDescription>
              Automatically extract skills, experience, and qualifications from resumes in various formats
              including PDF, Word, and text files.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>Analytics Dashboard</FeatureTitle>
            <FeatureDescription>
              Get insights into your hiring process with comprehensive analytics and reporting tools
              to optimize your recruitment strategy.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure & Compliant</FeatureTitle>
            <FeatureDescription>
              Your data is protected with enterprise-grade security and compliance with hiring regulations
              to ensure safe and legal recruitment practices.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Fast & Efficient</FeatureTitle>
            <FeatureDescription>
              Reduce time-to-hire with automated processes and instant candidate matching,
              allowing you to focus on what matters most.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureTitle>Multi-Role Support</FeatureTitle>
            <FeatureDescription>
              Designed for job seekers, recruiters, and administrators with tailored interfaces
              and features for each user type.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default HomePage;
