import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ProfileCard = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const ProfileField = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const FieldLabel = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const FieldValue = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  padding: ${props => props.theme.spacing.md};
  background: #f8fafc;
  border-radius: ${props => props.theme.borderRadius.md};
`;

const EditButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  
  &:hover {
    background: #2563eb;
  }
`;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProfileContainer>
      <PageTitle>My Profile</PageTitle>
      
      <ProfileCard>
        <ProfileField>
          <FieldLabel>Name</FieldLabel>
          <FieldValue>{user?.name}</FieldValue>
        </ProfileField>

        <ProfileField>
          <FieldLabel>Email</FieldLabel>
          <FieldValue>{user?.email}</FieldValue>
        </ProfileField>

        <ProfileField>
          <FieldLabel>Role</FieldLabel>
          <FieldValue>
            {user?.role === 'job_seeker' ? 'Job Seeker' : 
             user?.role === 'recruiter' ? 'Recruiter' : 'Admin'}
          </FieldValue>
        </ProfileField>

        <ProfileField>
          <FieldLabel>Member Since</FieldLabel>
          <FieldValue>January 2024</FieldValue>
        </ProfileField>

        <EditButton>Edit Profile</EditButton>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfilePage;
