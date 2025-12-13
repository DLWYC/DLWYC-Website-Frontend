
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import React, { useState, useMemo } from 'react';
import { User, Mail, Lock, Phone, Users, Church, Calendar, Image, Eye, EyeOff } from 'lucide-react';
import Churches from '../data/churches';
import axios from 'axios';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/usersignup')({
  component: SignUpForm,
})


const SignUpForm = () => {
     const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'Male',
    archdeaconry: '',
    parish: '',
    age: '',
    profilePicture: '',
  });

     const [showPassword, setShowPassword] = useState(false);
     const [errors, setErrors] = useState({});
     const [imagePreview, setImagePreview] = useState(null);
     const navigate = useNavigate()
     const [isSubmitting, setIsSubmitting] = useState(false);



  // Get available parishes based on selected archdeaconry
  const availableParishes = useMemo(() => {
    if (!formData.archdeaconry) return [];
    const selected = Churches.find(c => c.archdeaconry === formData.archdeaconry);
    return selected ? selected.churches : [];
  }, [formData.archdeaconry]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset parish when archdeaconry changes
      ...(name === 'archdeaconry' && { parish: '' })
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePicture: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePicture: 'Image size should not exceed 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
        setErrors(prev => ({ ...prev, profilePicture: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.archdeaconry) {
      newErrors.archdeaconry = 'Please select an archdeaconry';
    }

    if (!formData.parish) {
      newErrors.parish = 'Please select a parish';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
 const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Replace this with your actual backend URL
        const response = await axios.post(`${backendUrl}/api/userRegistration`, formData);

        const data = await response?.data;
        console.log("User data", data)

        if (data?.message === "Registration Successful") {
          toast.success('Account created successfully!');
          navigate({to: '/userlogin'})
          // Reset form
          setFormData({
            fullName: '',
            email: '',
            password: '',
            phoneNumber: '',
            gender: 'Male',
            archdeaconry: '',
            parish: '',
            age: '',
            profilePicture: '',
          });
          setImagePreview(null);
        } else {
          toast.error(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error?.response?.data?.error?.error, error);
        toast.error(error?.response?.data?.error?.error || 'An error occurred. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
     <div className="flex items-center justify-center lg:px-[90px] px-[40px] py-[80px] font-rubik">
          <div className="w-full">

        <div className="grid lg:grid-cols-2 bg-white rounded-2xl border border-gray-300 overflow-hidden">
          {/* Header */}
          <div className=" bg-cover bg-center bg-no-repeat " style={{backgroundImage: `url("/bg.jpg")`}}>
            {/* <h2 className="text-3xl font-bold text-white text-center">Create Account</h2> */}
            {/* <p className="text-blue-100 text-center mt-2">Join our community today</p> */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className=" p-4 space-y-4 ">
            {/* Full Name */}
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`text-[14px] w-full pl-11 pr-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-[15px] text-red-500">{errors.fullName}</p>}
            </div>


     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Email */}
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`text-[14px] w-full pl-11 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-[15px] text-red-500">{errors.email}</p>}
            </div>

     {/* Phone Number */}
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`text-[14px] w-full pl-11 pr-4 py-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phoneNumber && <p className="mt-1 text-[15px] text-red-500">{errors.phoneNumber}</p>}
            </div>
     </div>
            


            {/* Password */}
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`text-[14px] w-full pl-11 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[15px] text-red-500">{errors.password}</p>}
            </div>

            

            {/* Gender and Age Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <div>
                <label className="block text-[15px] font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-[15px] font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`text-[14px] w-full pl-11 pr-4 py-3 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </div>
                {errors.age && <p className="mt-1 text-[15px] text-red-500">{errors.age}</p>}
              </div>
            </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
            {/* Archdeaconry */}
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">
                Archdeaconry <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Church className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="archdeaconry"
                  value={formData.archdeaconry}
                  onChange={handleChange}
                  className={`text-[14px] w-full pl-11 pr-4 py-3 border ${errors.archdeaconry ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white`}
                >
                  <option value="">Select Archdeaconry</option>
                  {Churches.map((church) => (
                    <option key={church.id} value={church.archdeaconry}>
                      {church.archdeaconry}
                    </option>
                  ))}
                </select>
              </div>
              {errors.archdeaconry && <p className="mt-1 text-[15px] text-red-500">{errors.archdeaconry}</p>}
            </div>

            {/* Parish */}
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">
                Parish <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Church className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="parish"
                  value={formData.parish}
                  onChange={handleChange}
                  disabled={!formData.archdeaconry}
                  className={`text-[14px] w-full pl-11 pr-4 py-3 border ${errors.parish ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {formData.archdeaconry ? 'Select Parish' : 'Select Archdeaconry First'}
                  </option>
                  {availableParishes.map((parish) => (
                    <option key={parish.id} value={parish.name}>
                      {parish.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.parish && <p className="mt-1 text-[15px] text-red-500">{errors.parish}</p>}
            </div>
               </div>


            {/* Profile Picture */}
            <div>
              <label className="block text-[15px] font-medium text-gray-700 mb-2">
                Profile Picture <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-[15px] font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                  >
                    Choose Image
                  </label>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  {errors.profilePicture && (
                    <p className="mt-1 text-[15px] text-red-500">{errors.profilePicture}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
              <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-main text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <p className="text-center text-[15px] text-gray-600">
              Already have an account?{' '}
              <Link to={'/userlogin'} className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

     </div>
  );
};

