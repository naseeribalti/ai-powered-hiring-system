import React, { useState, useEffect } from 'react';
import { User } from '../../services/api';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp,
  Plus,
  MessageSquare
} from 'lucide-react';

interface RecruiterDashboardProps {
  user: User;
}

interface RecruiterStats {
  activeJobs: number;
  totalApplications: number;
  candidatesReviewed: number;
  interviewRate: number;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<RecruiterStats>({
    activeJobs: 0,
    totalApplications: 0,
    candidatesReviewed: 0,
    interviewRate: 0
  });

  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - will be replaced with actual API calls
    setRecentApplications([
      {
        id: 1,
        candidate: 'John Smith',
        position: 'Frontend Developer',
        status: 'New',
        date: '2024-01-15',
        match: 85
      },
      {
        id: 2,
        candidate: 'Sarah Johnson',
        position: 'Full Stack Engineer',
        status: 'Reviewed',
        date: '2024-01-14',
        match: 92
      }
    ]);

    setActiveJobs([
      {
        id: 1,
        title: 'Senior React Developer',
        applications: 24,
        views: 156,
        status: 'Active',
        date: '2024-01-10'
      },
      {
        id: 2,
        title: 'Backend Node.js Engineer',
        applications: 18,
        views: 89,
        status: 'Active',
        date: '2024-01-08'
      }
    ]);
  }, []);

  const StatCard = ({ icon: Icon, label, value, change }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
              {change && (
                <dd className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change > 0 ? '+' : ''}{change}% from last week
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Recruiter Dashboard 🎯
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your job postings and candidate pipeline.
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.activeJobs}
          change={12}
        />
        <StatCard
          icon={FileText}
          label="Applications"
          value={stats.totalApplications}
          change={8}
        />
        <StatCard
          icon={Users}
          label="Candidates Reviewed"
          value={stats.candidatesReviewed}
          change={15}
        />
        <StatCard
          icon={TrendingUp}
          label="Interview Rate"
          value={`${stats.interviewRate}%`}
          change={5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentApplications.map((application) => (
              <div key={application.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {application.candidate}
                    </h4>
                    <p className="text-sm text-gray-500">{application.position}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-600">{application.match}% Match</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'New' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {application.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{application.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Profile
                  </button>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Job Postings</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activeJobs.map((job) => (
              <div key={job.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{job.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{job.applications} applications</span>
                      <span>{job.views} views</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{job.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Applicants
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
