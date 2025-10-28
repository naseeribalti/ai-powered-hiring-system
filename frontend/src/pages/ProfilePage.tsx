import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { ResumeUpload } from '../components/profile/ResumeUpload';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Edit,
  Upload,
  Download,
  Eye,
  Calendar,
  Award,
  FileText
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  const handleResumeUpload = (file: File) => {
    console.log('Resume uploaded:', file.name);
    // Here you would typically upload to your backend
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="h-24 w-24 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Edit className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                  {user.role === 'job_seeker' && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Briefcase}
              label="Applications"
              value="12"
              color="bg-blue-500"
            />
            <StatCard
              icon={Calendar}
              label="Interviews"
              value="3"
              color="bg-green-500"
            />
            <StatCard
              icon={Award}
              label="Profile Strength"
              value="85%"
              color="bg-purple-500"
            />
            <StatCard
              icon={Eye}
              label="Profile Views"
              value="47"
              color="bg-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
              </div>
              <div className="px-6 py-4">
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Experience Level</h3>
              </div>
              <div className="px-6 py-4">
                {user.experience ? (
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 capitalize">{user.experience}</span>
                  </div>
                ) : (
                  <p className="text-gray-500">Not specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Section (for job seekers) */}
          {user.role === 'job_seeker' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Resume</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">resume.pdf</h4>
                      <p className="text-sm text-gray-500">Uploaded 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Verified
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <ProfileEdit onClose={() => setShowEditModal(false)} />
      )}
      {showUploadModal && (
        <ResumeUpload 
          onClose={() => setShowUploadModal(false)}
          onUpload={handleResumeUpload}
        />
      )}
    </div>
  );
};