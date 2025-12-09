import { useState } from 'react';
import {  Mail,  Users, AlertCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  guestName: string;
  email: string;
  staffEmail: string;
}

interface RegistrationFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export function RegistrationForm({ onSubmit, isLoading }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    guestName: '',
    email: '',
    staffEmail: '',
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
      {/* Important Notice */}
      <div className="flex items-start gap-3 p-4 border-2 border-yellow-400 rounded-lg bg-yellow-50">
        <AlertCircle className="flex-shrink-0 mt-0.5 text-yellow-600" size={20} />
        <div>
          <p className="text-sm font-semibold text-yellow-800">
            Important Notice for Associates
          </p>
          <p className="text-sm text-yellow-700">
            Each associate is restricted to invite only one guest using your KO email address.
          </p>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Associate Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="email"
            name="staffEmail"
            value={formData.staffEmail}
            onChange={handleChange}
            required
            pattern="[A-Za-z0-9._%+\-]+@coca-cola\.com"
            title="Please enter a valid Coca-Cola email address (e.g., name@coca-cola.com)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F40009] focus:border-transparent outline-none transition"
            placeholder="name@coca-cola.com"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Must be a valid Coca-Cola email address (@coca-cola.com)
        </p>
      </div>

       <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Your Full Name *
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
            placeholder="Enter your full name"
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
            placeholder="Enter guest email address"
          />
        </div>
      </div>

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