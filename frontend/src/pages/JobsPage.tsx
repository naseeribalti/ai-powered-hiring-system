import React from 'react';
import styled from 'styled-components';

const JobsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`;

const JobCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const JobTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CompanyName = styled.p`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const JobDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.6;
`;

const ApplyButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  
  &:hover {
    background: #2563eb;
  }
`;

const JobsPage: React.FC = () => {
  // Placeholder data - will be replaced with real data
  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      description: 'We are looking for a senior software engineer to join our team...',
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Inc',
      description: 'Lead product development and work with cross-functional teams...',
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      description: 'Create amazing user experiences for our digital products...',
    },
  ];

  return (
    <JobsContainer>
      <PageTitle>Available Jobs</PageTitle>
      
      <JobsGrid>
        {jobs.map((job) => (
          <JobCard key={job.id}>
            <JobTitle>{job.title}</JobTitle>
            <CompanyName>{job.company}</CompanyName>
            <JobDescription>{job.description}</JobDescription>
            <ApplyButton>Apply Now</ApplyButton>
          </JobCard>
        ))}
      </JobsGrid>
    </JobsContainer>
  );
};

export default JobsPage;
