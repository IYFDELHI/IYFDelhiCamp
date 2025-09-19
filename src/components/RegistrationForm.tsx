"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FormData {
  name: string;
  email: string;
  facilitator: string;
  area: string;
  level: string;
  medicalNotes: string;
  accommodation: string;
}

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const facilitators = [
  "HG Vilasa Padmanabha Prabhu",
  "HG Upanand Gopa Prabhu",
  "HG Sachisuta Sevak Prabhu",
  "HG Natvargopinath Prabhu",
  "HG Gokulendra Kanhai Prabhu",
  "HG Aravindaksh Madhav Prabhu",
  "HG Sikhi Mahiti Prabhu",
  "HG Adigopa Nimai Prabhu",
  "HG Saumya Chaitanya Prabhu",
  "HG Mahanand Gopa Prabhu",
  "HG Mukund Bandhu Prabhu",
  "HG Dashrath Pran Prabhu",
  "HG Adbhut Gaur Prabhu",
  "HG Yogesh Giridhari Prabhu",
  "HG Abhay Vishnu Prabhu",
  "Rohit Garg Prabhu",
  "HG Vanmali Balaram Prabhu",
  "HG Kishor Mohan Prabhu",
  "HG Kundal Keshav Prabhu",
  "HG Aryan Yudhistra Prabhu",
  "Neeraj Prabhu",
  "Suraj Prabhu",
  "Deepak Raghav Prabhu"
];

const areas = [
  "IYF-Delhi",
  "YMCA",
  "DU",
  "Laxmi Nagar",
  "IIT-Delhi",
  "IYF-Mahipapalpur"
];

const levels = [
  "Vedic Level-2",
  "Vedic Level-3",
  "SPS-1",
  "SPS-2",
  "SPS-Online",
  "DPS",
  "BVS"
];

const accommodationOptions = [
  { value: "room", label: "Room", price: 2500 },
  { value: "dormitory", label: "Dormitory", price: 2000 }
];

export default function RegistrationForm({ isOpen, onClose }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    facilitator: '',
    area: '',
    level: '',
    medicalNotes: '',
    accommodation: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.facilitator) {
      newErrors.facilitator = 'Please select a facilitator';
    }

    if (!formData.area) {
      newErrors.area = 'Please select an area';
    }

    if (!formData.level) {
      newErrors.level = 'Please select a level';
    }

    if (!formData.accommodation) {
      newErrors.accommodation = 'Please select accommodation type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Registration submitted successfully!');
      // Reset form and close popup
      setFormData({
        name: '',
        email: '',
        facilitator: '',
        area: '',
        level: '',
        medicalNotes: '',
        accommodation: ''
      });
      onClose();
    } catch {
      alert('Error submitting registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccommodationPrice = () => {
    const selected = accommodationOptions.find(opt => opt.value === formData.accommodation);
    return selected ? selected.price : 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
              Kartik Braj Camp 2025
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Complete your registration for the spiritual journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`h-12 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-emerald-500'}`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-emerald-500'}`}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Facilitator Field */}
              <div className="space-y-2">
                <Label htmlFor="facilitator" className="text-sm font-semibold text-gray-700">
                  Facilitator Name <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.facilitator} onValueChange={(value) => setFormData(prev => ({ ...prev, facilitator: value }))}>
                  <SelectTrigger className={`h-12 ${errors.facilitator ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select your facilitator" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {facilitators.map((facilitator) => (
                      <SelectItem key={facilitator} value={facilitator} className="py-3">
                        {facilitator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.facilitator && <p className="text-sm text-red-500">{errors.facilitator}</p>}
              </div>

              {/* Area Field */}
              <div className="space-y-2">
                <Label htmlFor="area" className="text-sm font-semibold text-gray-700">
                  Area <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.area} onValueChange={(value) => setFormData(prev => ({ ...prev, area: value }))}>
                  <SelectTrigger className={`h-12 ${errors.area ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select your area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area} className="py-3">
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
              </div>

              {/* Level Field */}
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-semibold text-gray-700">
                  Level <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger className={`h-12 ${errors.level ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level} className="py-3">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.level && <p className="text-sm text-red-500">{errors.level}</p>}
              </div>

              {/* Medical Notes Field */}
              <div className="space-y-2">
                <Label htmlFor="medicalNotes" className="text-sm font-semibold text-gray-700">
                  Medical Issues / Special Requirements
                  <span className="text-gray-500 text-xs ml-2">(Optional)</span>
                </Label>
                <Textarea
                  id="medicalNotes"
                  placeholder="Please mention any medical conditions, allergies, or special dietary requirements..."
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalNotes: e.target.value }))}
                  className="min-h-[100px] border-gray-300 focus:border-emerald-500"
                />
              </div>

              {/* Accommodation Field */}
              <div className="space-y-3">
                <Label htmlFor="accommodation" className="text-sm font-semibold text-gray-700">
                  Accommodation <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accommodationOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        formData.accommodation === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, accommodation: option.value }))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{option.label}</h3>
                          <p className="text-2xl font-bold text-emerald-600">₹{option.price}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.accommodation === option.value
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.accommodation === option.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.accommodation && <p className="text-sm text-red-500">{errors.accommodation}</p>}
              </div>

              {/* Price Summary */}
              {formData.accommodation && (
                <div className="bg-gradient-to-r from-emerald-50 to-orange-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                    <Badge variant="secondary" className="text-xl font-bold bg-emerald-100 text-emerald-800 px-4 py-2">
                      ₹{getAccommodationPrice()}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-orange-600 hover:from-emerald-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Registration...</span>
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}