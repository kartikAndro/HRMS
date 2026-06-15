import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Building, Mail, Lock, User, Globe, ArrowLeft } from 'lucide-react';

const RegisterCompany = () => {
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onTouched'
  });

  const onSubmit = async (formData) => {
    setErrorMsg('');
    try {
      const { data } = await api.post('/auth/register-company', formData);
      localStorage.setItem('token', data.token);
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to register company. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Register Container */}
      <div className="w-full max-w-lg glass rounded-3xl p-8 shadow-2xl relative z-10 border border-slate-800/80">
        
        {/* Back Link */}
        <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition mb-6">
          <ArrowLeft size={14} /> Back to Login
        </Link>

        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-primary-600/30">
            <Building size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Company Account</h1>
          <p className="text-sm text-slate-400 mt-1">Set up your workspace and get started</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Building size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition focus:ring-1 ${
                    errors.companyName 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                      : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/30'
                  }`}
                  {...register('companyName', {
                    required: 'Company name is required',
                    minLength: { value: 2, message: 'Must be at least 2 characters' }
                  })}
                />
              </div>
              {errors.companyName && (
                <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.companyName.message}</p>
              )}
            </div>

            {/* Subdomain */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Workspace Subdomain
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Globe size={16} />
                </div>
                <input
                  type="text"
                  placeholder="acme"
                  className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition focus:ring-1 ${
                    errors.subdomain 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                      : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/30'
                  }`}
                  {...register('subdomain', {
                    required: 'Subdomain is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Only lowercase alphanumeric chars and hyphens'
                    }
                  })}
                />
              </div>
              {errors.subdomain && (
                <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.subdomain.message}</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-4 mt-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Administrator Profile
            </h3>

            <div className="space-y-4">
              {/* Admin Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition focus:ring-1 ${
                      errors.adminName 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                        : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/30'
                    }`}
                    {...register('adminName', {
                      required: 'Admin name is required',
                      minLength: { value: 2, message: 'Must be at least 2 characters' },
                      pattern: {
                        value: /^[^0-9]+$/,
                        message: 'Name cannot contain numbers'
                      }
                    })}
                  />
                </div>
                {errors.adminName && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.adminName.message}</p>
                )}
              </div>

              {/* Admin Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="admin@company.com"
                    className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition focus:ring-1 ${
                      errors.adminEmail 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                        : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/30'
                    }`}
                    {...register('adminEmail', {
                      required: 'Admin email is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                </div>
                {errors.adminEmail && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.adminEmail.message}</p>
                )}
              </div>

              {/* Admin Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full bg-slate-900/60 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none transition focus:ring-1 ${
                      errors.adminPassword 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
                        : 'border-slate-800 focus:border-primary-500 focus:ring-primary-500/30'
                    }`}
                    {...register('adminPassword', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                </div>
                {errors.adminPassword && (
                  <p className="text-red-400 text-[10px] mt-1 font-medium">{errors.adminPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-750/70 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 shadow-lg shadow-primary-600/20 transition duration-150 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Create Workspace'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have a company account?{' '}
          <Link to="/login" className="text-primary-450 hover:text-primary-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterCompany;
