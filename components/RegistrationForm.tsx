import { useState } from 'react';
import {  Mail,  Users } from 'lucide-react';

interface FormData {
  // firstName: string;
  // lastName: string;
  fullName: string;
  guestName: string;
  // phoneNumber: string;
  email: string;
}

interface RegistrationFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export function RegistrationForm({ onSubmit, isLoading }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    // firstName: '',
    // lastName: '',
    fullName: '',
    guestName: '',
    // phoneNumber: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F40009] focus:border-transparent outline-none transition"
              placeholder="Enter first name"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F40009] focus:border-transparent outline-none transition"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </div> */}

       <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Full Name*
        </label>
        <div className="relative">
          <Users className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F40009] focus:border-transparent outline-none transition"
            placeholder="Enter full name"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Name of Guest *
        </label>
        <div className="relative">
          <Users className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F40009] focus:border-transparent outline-none transition"
            placeholder="Enter guest name"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Guest Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F40009] focus:border-transparent outline-none transition"
            placeholder="Enter email address"
          />
        </div>
      </div>

      {/* <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F40009] focus:border-transparent outline-none transition"
            placeholder="Enter phone number (optional)"
          />
        </div>
      </div> */}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#F40009] text-white py-4 rounded-lg font-semibold hover:bg-[#D00008] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Downloading your invite...' : 'Download your invite'}
      </button>
    </form>
  );
}
