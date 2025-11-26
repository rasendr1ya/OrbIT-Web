import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    nrp: '',
    primaryRole: ROLES.MAHASISWA,
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // NRP is required for mahasiswa
    if (formData.primaryRole === ROLES.MAHASISWA) {
      if (!formData.nrp) {
        newErrors.nrp = 'NRP is required for mahasiswa';
      } else if (!/^\d{10}$/.test(formData.nrp)) {
        newErrors.nrp = 'NRP must be exactly 10 digits';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">OrbIT</h1>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the IT Department community
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Danar Bagus Rasendriya"
              error={errors.fullName}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@student.its.ac.id"
              error={errors.email}
              required
            />

            <div className="mb-4">
              <label htmlFor="primaryRole" className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="primaryRole"
                name="primaryRole"
                value={formData.primaryRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {Object.values(ROLES).map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>

            {formData.primaryRole === ROLES.MAHASISWA && (
              <Input
                label="NRP"
                type="text"
                name="nrp"
                value={formData.nrp}
                onChange={handleChange}
                placeholder="5027231055"
                error={errors.nrp}
                required
                maxLength={10}
              />
            )}

            <Input
              label="Phone Number (Optional)"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="08123456789"
              error={errors.phoneNumber}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
