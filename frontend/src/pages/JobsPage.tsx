import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobSearch } from '../components/jobs/JobSearch';
import { JobPosting } from '../components/jobs/JobPosting';
import { Job, jobAPI } from '../services/jobAPI';
import { 
  Plus, 
  Search, 
  Briefcase,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Calendar,
  X,
  Building,
  MapPin,
  DollarSign
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'search' | 'post' | 'manage'>('search');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobPosting, setShowJobPosting] = useState(false);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';
  const isJobSeeker = user?.role === 'job_seeker';

  const loadMyJobs = async () => {
    if (!isRecruiter) return;
    
    setLoading(true);
    try {
      const response = await jobAPI.getJobsByRecruiter(user.id);
      setMyJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'manage') {
      loadMyJobs();
    }
  }, [activeTab, user]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleJobPostSuccess = (job: Job) => {
    setMyJobs(prev => [job, ...prev]);
    setShowJobPosting(false);
    setActiveTab('manage');
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await jobAPI.deleteJob(jobId);
      setMyJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (job: Job) => {
    const { min, max, currency, period } = job.salary;
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
    
    const periodText = period === 'yearly' ? 'year' : period === 'monthly' ? 'month' : 'hour';
    return `${formatCurrency(min)} - ${formatCurrency(max)} per ${periodText}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const JobDetailModal = ({ job, onClose }: { job: Job; onClose: () => void }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Building className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-lg font-medium text-gray-900">{job.company.name}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span>{job.location.city}, {job.location.state}</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
              <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center">
              <span className="capitalize">{job.workMode}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span>{formatDate(job.postedAt)}</span>
            </div>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-lg font-medium text-gray-900">{formatSalary(job)}</span>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Job Description</h4>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {job.requirements.skills && job.requirements.skills.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.requirements.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill.name} ({skill.level})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Eye className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <div className="font-medium text-gray-900">{job.analytics.views}</div>
              <div className="text-gray-500">Views</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <div className="font-medium text-gray-900">{job.analytics.applications}</div>
              <div className="text-gray-500">Applications</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-500 mx-auto mb-1" />
              <div className="font-medium text-gray-900">{job.analytics.saves}</div>
              <div className="text-gray-500">Saves</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-500 mx-auto mb-1" />
              <div className="font-medium text-gray-900">{job.analytics.shares}</div>
              <div className="text-gray-500">Shares</div>
            </div>
          </div>

          {isJobSeeker && (
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Apply Now
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Save Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
                <p className="text-gray-600">
                  {isJobSeeker ? 'Find your next opportunity' : 'Manage your job postings'}
                </p>
              </div>
              {isRecruiter && (
                <button
                  onClick={() => setShowJobPosting(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post New Job
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'search'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Search className="h-4 w-4 inline mr-2" />
                  Search Jobs
                </button>
                {isRecruiter && (
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'manage'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Briefcase className="h-4 w-4 inline mr-2" />
                    My Jobs
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'search' && (
            <JobSearch onJobSelect={handleJobSelect} />
          )}

          {activeTab === 'manage' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">My Job Postings</h2>
                <p className="text-gray-600">Manage and track your job postings</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : myJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings yet</h3>
                  <p className="text-gray-600 mb-4">Create your first job posting to get started</p>
                  <button
                    onClick={() => setShowJobPosting(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myJobs.map(job => (
                    <div key={job._id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{job.location.city}, {job.location.state}</span>
                            <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                            <span className="capitalize">{job.workMode}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatSalary(job)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Posted {formatDate(job.postedAt)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{job.analytics.views}</div>
                          <div className="text-xs text-gray-500">Views</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{job.analytics.applications}</div>
                          <div className="text-xs text-gray-500">Applications</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900">{job.analytics.saves}</div>
                          <div className="text-xs text-gray-500">Saves</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleJobSelect(job)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="px-3 py-2 border border-red-300 text-red-700 rounded text-sm hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      {showJobPosting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <JobPosting
              onClose={() => setShowJobPosting(false)}
              onSuccess={handleJobPostSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};