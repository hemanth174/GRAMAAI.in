import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_LOGIN_URL = 'http://localhost:5000/api/patient/login';

const initialForm = {
  identifier: '',
  password: '',
};

const PatientLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({ identifier: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error', visible: false });

  useEffect(() => {
    let timer;
    if (toast.visible) {
      timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3200);
    }
    return () => timer && clearTimeout(timer);
  }, [toast.visible]);

  const validateIdentifier = (value) => {
    if (!value.trim()) {
      return 'Please enter your email address or phone number.';
    }

    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phonePattern = /^\+?[0-9]{7,15}$/;

    if (!emailPattern.test(value) && !phonePattern.test(value)) {
      return 'Enter a valid email address or phone number.';
    }

    return '';
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      return 'Password is required to continue.';
    }

    if (value.trim().length < 6) {
      return 'Password should be at least 6 characters.';
    }

    return '';
  };

  const showToast = (message, type = 'error') => {
    setToast({ message, type, visible: true });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const identifierError = validateIdentifier(formData.identifier);
    const passwordError = validatePassword(formData.password);

    if (identifierError || passwordError) {
      setErrors({ identifier: identifierError, password: passwordError });
      showToast('Please fix the highlighted fields before continuing.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(API_LOGIN_URL, {
        identifier: formData.identifier,
        password: formData.password,
      });

      if (response?.data?.token) {
        Cookies.set('patient_auth_token', response.data.token, {
          secure: true,
          sameSite: 'strict',
          expires: 7,
        });
      }

      if (response?.data?.session) {
        Cookies.set('patient_session', JSON.stringify(response.data.session), {
          secure: true,
          sameSite: 'strict',
        });
      }

      navigate('/patient-dashboard');
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Invalid credentials. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur shadow-2xl rounded-3xl border border-blue-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-9 h-9">
                <path
                  d="M12 21c4.971 0 9-3.582 9-8 0-3.309-2.239-6.124-5.389-7.38-.262-1.324-1.646-2.335-3.35-2.335-1.69 0-3.064.999-3.342 2.305C6.13 6.916 4 9.613 4 13c0 4.418 4.029 8 8 8Z"
                  className="fill-blue-500/30"
                />
                <path
                  d="M9.5 13.5h1a2 2 0 0 1 2 2v3.5m0 0h2.5M12.5 19v-3M9 9.5h6"
                  strokeWidth="1.6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Patient Login</h1>
            <p className="text-slate-500 mt-2">
              Welcome back! Please sign in to manage appointments, records, and reminders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-600">
                Email or Phone
              </label>
              <div className={`relative group ${errors.identifier ? 'animate-shake' : ''}`}>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="you@example.com or +91 98765 43210"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.identifier ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                  } bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm`}
                />
              </div>
              {errors.identifier && (
                <p className="text-sm text-rose-500 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {errors.identifier}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-600">
                Password
              </label>
              <div className={`relative group ${errors.password ? 'animate-shake' : ''}`}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                  } bg-white focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm`}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-rose-500 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In
                  </>
                ) : (
                  <>Login</>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              type="button"
            >
              Forgot Password?
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              type="button"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>

      {toast.visible && (
        <div className={`fixed top-6 inset-x-0 flex justify-center px-4 transition-all duration-300 ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <div
            className={`max-w-md w-full bg-white shadow-2xl rounded-xl border ${
              toast.type === 'error' ? 'border-rose-200' : 'border-emerald-200'
            } px-5 py-4 flex items-start gap-3 animate-slide-down`}
          >
            <div
              className={`mt-1 w-2 h-2 rounded-full ${
                toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            <p className="text-sm text-slate-600">{toast.message}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-shake {
          animation: shake 0.28s ease-in-out;
        }
        .animate-slide-down {
          animation: slideDown 0.35s ease;
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          20%, 60% {
            transform: translateX(-4px);
          }
          40%, 80% {
            transform: translateX(4px);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PatientLogin;
