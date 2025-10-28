import React, { useState, useEffect } from 'react';
import { User } from '../../services/api';
import { 
  Users, 
  Briefcase, 
  Building, 
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalCompanies: number;
  systemHealth: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    systemHealth: 'Healthy'
  });

  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<any>({});

  useEffect(() => {
    // Mock data - will be replaced with actual API calls
    setRecentUsers([
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        role: 'job_seeker',
        status: 'active',
        joinDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'recruiter',
        status: 'active',
        joinDate: '2024-01-14'
      }
    ]);

    setSystemMetrics({
      uptime: '99.9%',
      responseTime: '128ms',
      activeSessions: 42,
      databaseSize: '2.3GB'
    });
  }, []);

  const StatCard = ({ icon: Icon, label, value, description }: any) => (
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
              {description && (
                <dd className="text-sm text-gray-500">{description}</dd>
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
                Admin Dashboard ⚙️
              </h1>
              <p className="mt-2 text-gray-600">
                System overview and management tools.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                System Settings
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                View Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          description="Across all roles"
        />
        <StatCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.totalJobs}
          description="Posted this month"
        />
        <StatCard
          icon={Building}
          label="Companies"
          value={stats.totalCompanies}
          description="Registered recruiters"
        />
        <StatCard
          icon={Activity}
          label="System Health"
          value={stats.systemHealth}
          description="All systems operational"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.map((user) => (
              <div key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{user.joinDate}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Profile
                  </button>
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Message
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Metrics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="text-sm font-medium text-gray-900">Uptime</h4>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.uptime}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="text-sm font-medium text-gray-900">Response Time</h4>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.responseTime}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.activeSessions}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h4 className="text-sm font-medium text-gray-900">Database Size</h4>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.databaseSize}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
