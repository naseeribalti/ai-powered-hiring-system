import React from 'react';
import { useAuth } from '../context/AuthContext';
import { JobSeekerDashboard } from '../components/dashboard/JobSeekerDashboard';
import { RecruiterDashboard } from '../components/dashboard/RecruiterDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to view your dashboard</h1>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (user.role) {
      case 'job_seeker':
        return <JobSeekerDashboard user={user} />;
      case 'recruiter':
        return <RecruiterDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
