import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const WelcomeSection = styled.section`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const WelcomeTitle = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const WelcomeText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome back, {user?.name}!</WelcomeTitle>
        <WelcomeText>
          Here's an overview of your {user?.role === 'job_seeker' ? 'job search' : 'recruitment'} activity.
        </WelcomeText>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>
            {user?.role === 'job_seeker' ? 'Applications Sent' : 'Jobs Posted'}
          </StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>
            {user?.role === 'job_seeker' ? 'Interviews Scheduled' : 'Active Applications'}
          </StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>
            {user?.role === 'job_seeker' ? 'Job Matches' : 'Hired Candidates'}
          </StatLabel>
        </StatCard>

        <StatCard>
          <StatNumber>0</StatNumber>
          <StatLabel>
            {user?.role === 'job_seeker' ? 'Profile Views' : 'Total Views'}
          </StatLabel>
        </StatCard>
      </StatsGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
