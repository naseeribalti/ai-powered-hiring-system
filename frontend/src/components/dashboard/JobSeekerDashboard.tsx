import React, { useState, useEffect } from 'react';
import { User } from '../../services/api';
import { 
  Briefcase, 
  User as UserIcon, 
  FileText, 
  TrendingUp,
  Bell,
  Calendar,
  MapPin
} from 'lucide-react';

interface JobSeekerDashboardProps {
  user: User;
}

interface DashboardStats {
  applications: number;
  interviews: number;
  profileStrength: number;
  savedJobs: number;
}

export const JobSeekerDashboard: React.FC<JobSeekerDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats>({
    applications: 0,
    interviews: 0,
    profileStrength: 65,
    savedJobs: 0
  });

  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - will be replaced with actual API calls
    setRecentApplications([
      {
        id: 1,
        company: 'Tech Corp',
        position: 'Frontend Developer',
        status: 'Under Review',
        date: '2024-01-15',
        logo: '/api/placeholder/40/40'
      },
      {
        id: 2,
        company: 'Startup XYZ',
        position: 'React Developer',
        status: 'Interview',
        date: '2024-01-12',
        logo: '/api/placeholder/40/40'
      }
    ]);

    setRecommendedJobs([
      {
        id: 1,
        title: 'Senior React Developer',
        company: 'Innovation Labs',
        location: 'Remote',
        salary: '$90,000 - $120,000',
        match: 85,
        skills: ['React', 'TypeScript', 'Node.js']
      },
      {
        id: 2,
        title: 'Full Stack Engineer',
        company: 'Digital Solutions',
        location: 'New York, NY',
        salary: '$85,000 - $110,000',
        match: 78,
        skills: ['JavaScript', 'Python', 'AWS']
      }
    ]);
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{label}</dt>
              <dd className="text-lg font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Here's what's happening with your job search today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Update Profile
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Applications"
          value={stats.applications}
          color="bg-blue-500"
        />
        <StatCard
          icon={Calendar}
          label="Interviews"
          value={stats.interviews}
          color="bg-green-500"
        />
        <StatCard
          icon={UserIcon}
          label="Profile Strength"
          value={`${stats.profileStrength}%`}
          color="bg-purple-500"
        />
        <StatCard
          icon={Bell}
          label="Saved Jobs"
          value={stats.savedJobs}
          color="bg-orange-500"
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
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={application.logo}
                      alt={application.company}
                    />
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {application.position}
                      </h4>
                      <p className="text-sm text-gray-500">{application.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'Interview' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {application.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{application.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recommended For You</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recommendedJobs.map((job) => (
              <div key={job.id} className="px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills.slice(0, 3).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{job.match}% Match</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{job.salary}</p>
                    <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
