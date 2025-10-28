import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { jobAPI, CreateJobData } from '../../services/jobAPI';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  X, 
  Save, 
  Eye, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Users,
  GraduationCap,
  Award,
  Building
} from 'lucide-react';

interface JobPostingProps {
  onClose?: () => void;
  onSuccess?: (job: any) => void;
  editJob?: any;
}

const jobSchema = yup.object({
  title: yup.string().required('Job title is required').max(100, 'Title too long'),
  description: yup.string().required('Job description is required').min(50, 'Description too short'),
  company: yup.string().required('Company is required'),
  jobType: yup.string().required('Job type is required'),
  workMode: yup.string().required('Work mode is required'),
  'location.city': yup.string().required('City is required'),
  'location.state': yup.string().required('State is required'),
  'location.country': yup.string(),
  'salary.min': yup.number().required('Minimum salary is required').min(0, 'Salary cannot be negative'),
  'salary.max': yup.number().required('Maximum salary is required').min(0, 'Salary cannot be negative'),
  'salary.currency': yup.string(),
  'salary.period': yup.string(),
  'requirements.experience.level': yup.string().required('Experience level is required'),
  'requirements.experience.min': yup.number().min(0, 'Experience cannot be negative'),
  'requirements.experience.max': yup.number().min(0, 'Experience cannot be negative'),
  'requirements.education': yup.string(),
  status: yup.string(),
  visibility: yup.string()
});

export const JobPosting: React.FC<JobPostingProps> = ({ onClose, onSuccess, editJob }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState<Array<{name: string, level: string, required: boolean}>>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate', required: true });
  const [newBenefit, setNewBenefit] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateJobData>({
    resolver: yupResolver(jobSchema),
    defaultValues: editJob ? {
      title: editJob.title,
      description: editJob.description,
      company: editJob.company._id,
      jobType: editJob.jobType,
      workMode: editJob.workMode,
      location: {
        city: editJob.location.city,
        state: editJob.location.state,
        country: editJob.location.country
      },
      salary: {
        min: editJob.salary.min,
        max: editJob.salary.max,
        currency: editJob.salary.currency,
        period: editJob.salary.period,
        negotiable: editJob.salary.negotiable
      },
      requirements: {
        experience: {
          min: editJob.requirements.experience.min,
          max: editJob.requirements.experience.max,
          level: editJob.requirements.experience.level
        },
        education: editJob.requirements.education
      },
      status: editJob.status,
      visibility: editJob.visibility
    } : {
      salary: { currency: 'USD', period: 'yearly', negotiable: false },
      requirements: { experience: { min: 0, level: 'entry' } },
      status: 'draft',
      visibility: 'public'
    }
  });

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'onsite', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6+ years)' },
    { value: 'executive', label: 'Executive Level' }
  ];

  const educationLevels = [
    { value: 'none', label: 'No formal education required' },
    { value: 'high-school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'master', label: 'Master\'s Degree' },
    { value: 'phd', label: 'PhD' }
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const availableBenefits = [
    'health-insurance',
    'dental-insurance',
    'vision-insurance',
    'retirement-plan',
    'paid-time-off',
    'flexible-hours',
    'remote-work',
    'professional-development',
    'gym-membership',
    'stock-options',
    'bonus',
    'transportation',
    'meal-allowance',
    'childcare'
  ];

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { ...newSkill, name: newSkill.name.trim() }]);
      setNewSkill({ name: '', level: 'intermediate', required: true });
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter(b => b !== benefit));
  };

  const onSubmit = async (data: CreateJobData) => {
    setIsLoading(true);
    try {
      const jobData = {
        ...data,
        requirements: {
          ...data.requirements,
          skills
        },
        benefits
      };

      let response;
      if (editJob) {
        response = await jobAPI.updateJob(editJob._id, jobData);
      } else {
        response = await jobAPI.createJob(jobData);
      }

      onSuccess?.(response.data.job);
      onClose?.();
    } catch (error: any) {
      console.error('Job posting failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: Briefcase },
    { id: 2, title: 'Requirements', icon: Users },
    { id: 3, title: 'Compensation', icon: DollarSign },
    { id: 4, title: 'Benefits & Details', icon: Award }
  ];

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 text-gray-400'
            }`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                {...register('title')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Senior Frontend Developer"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                {...register('description')}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  {...register('jobType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select job type</option>
                  {jobTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.jobType && <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Mode *
                </label>
                <select
                  {...register('workMode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select work mode</option>
                  {workModes.map(mode => (
                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                  ))}
                </select>
                {errors.workMode && <p className="mt-1 text-sm text-red-600">{errors.workMode.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...register('location.city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., San Francisco"
                />
                {errors.location?.city && <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  {...register('location.state')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CA"
                />
                {errors.location?.state && <p className="mt-1 text-sm text-red-600">{errors.location.state.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  {...register('location.country')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., United States"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level *
                </label>
                <select
                  {...register('requirements.experience.level')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.requirements?.experience?.level && <p className="mt-1 text-sm text-red-600">{errors.requirements.experience.level.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  {...register('requirements.education')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select education level</option>
                  {educationLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Experience (years)
                </label>
                <input
                  type="number"
                  {...register('requirements.experience.min')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Experience (years)
                </label>
                <input
                  type="number"
                  {...register('requirements.experience.max')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {skillLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill.name} ({skill.level})
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary *
                </label>
                <input
                  type="number"
                  {...register('salary.min')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
                {errors.salary?.min && <p className="mt-1 text-sm text-red-600">{errors.salary.min.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary *
                </label>
                <input
                  type="number"
                  {...register('salary.max')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="80000"
                />
                {errors.salary?.max && <p className="mt-1 text-sm text-red-600">{errors.salary.max.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  {...register('salary.currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period
                </label>
                <select
                  {...register('salary.period')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="yearly">Per Year</option>
                  <option value="monthly">Per Month</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('salary.negotiable')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Salary is negotiable
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits & Perks
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a custom benefit"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableBenefits.map(benefit => (
                    <label key={benefit} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={benefits.includes(benefit)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBenefits([...benefits, benefit]);
                          } else {
                            removeBenefit(benefit);
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {benefit.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {benefits.map(benefit => (
                    <span
                      key={benefit}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {benefit.replace('-', ' ')}
                      <button
                        type="button"
                        onClick={() => removeBenefit(benefit)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  {...register('visibility')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="internal">Internal</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {editJob ? 'Edit Job Posting' : 'Create Job Posting'}
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <StepIndicator />
          
          {renderStep()}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editJob ? 'Update Job' : 'Post Job'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
