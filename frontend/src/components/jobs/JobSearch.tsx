import React, { useState, useEffect } from 'react';
import { jobAPI, Job, JobSearchFilters } from '../../services/jobAPI';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter,
  SortAsc,
  SortDesc,
  X,
  Clock,
  Users,
  Building
} from 'lucide-react';

interface JobSearchProps {
  onJobSelect?: (job: Job) => void;
  showFilters?: boolean;
}

export const JobSearch: React.FC<JobSearchProps> = ({ onJobSelect, showFilters = true }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false
  });

  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    jobType: '',
    workMode: '',
    minSalary: undefined,
    maxSalary: undefined,
    experienceLevel: '',
    skills: [],
    page: 1,
    limit: 10,
    sortBy: 'postedAt',
    sortOrder: 'desc'
  });

  const [sortOptions] = useState([
    { value: 'postedAt', label: 'Date Posted' },
    { value: 'salary.min', label: 'Salary (Low to High)' },
    { value: 'salary.max', label: 'Salary (High to Low)' },
    { value: 'title', label: 'Job Title' },
    { value: 'company', label: 'Company' }
  ]);

  const [jobTypes] = useState([
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ]);

  const [workModes] = useState([
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ]);

  const [experienceLevels] = useState([
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ]);

  // Load jobs on component mount and when filters change
  useEffect(() => {
    loadJobs();
  }, [filters.page, filters.sortBy, filters.sortOrder]);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await jobAPI.getAllJobs(filters);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setFilters(prev => ({ ...prev, page: 1 }));
    await loadJobs();
  };

  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: '',
      jobType: '',
      workMode: '',
      minSalary: undefined,
      maxSalary: undefined,
      experienceLevel: '',
      skills: [],
      page: 1,
      limit: 10,
      sortBy: 'postedAt',
      sortOrder: 'desc'
    });
    setShowAdvancedFilters(false);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const JobCard = ({ job }: { job: Job }) => (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onJobSelect?.(job)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Building className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">{job.company.name}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location.city}, {job.location.state}</span>
            <span className="mx-2">•</span>
            <Briefcase className="h-4 w-4 mr-1" />
            <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{job.workMode}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            <Clock className="h-4 w-4 inline mr-1" />
            {formatDate(job.postedAt)}
          </div>
          <div className="text-sm font-medium text-gray-900">
            {job.analytics.views} views
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description.substring(0, 150)}...
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-sm font-medium text-gray-900">
            {formatSalary(job)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>{job.analytics.applications} applications</span>
        </div>
      </div>
      
      {job.requirements.skills && job.requirements.skills.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-1">
            {job.requirements.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skill.name}
              </span>
            ))}
            {job.requirements.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{job.requirements.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
        <p className="text-gray-600">Discover opportunities that match your skills and career goals</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={filters.query || ''}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="City, state, or remote"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={filters.jobType || ''}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Job Types</option>
            {jobTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <select
            value={filters.workMode || ''}
            onChange={(e) => handleFilterChange('workMode', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Work Modes</option>
            {workModes.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>

          <select
            value={filters.experienceLevel || ''}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience Levels</option>
            {experienceLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            Advanced Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 50000"
                  value={filters.minSalary || ''}
                  onChange={(e) => handleFilterChange('minSalary', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  placeholder="e.g., 100000"
                  value={filters.maxSalary || ''}
                  onChange={(e) => handleFilterChange('maxSalary', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all filters
              </button>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  {filters.sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {pagination.totalJobs} jobs found
          </h2>
          {loading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading...
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}

        <div className="space-y-4">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      page === pagination.currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
