"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ErrorBoundary from './ErrorBoundary';

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const accommodationOptions = [
  { value: "dormitory", label: "Dormitory", price: 2000 },
  { value: "room", label: "Room", price: 2500 }
] as const;

// Memoized accommodation option component
const AccommodationOption = React.memo<{
  option: (typeof accommodationOptions)[number];
  isSelected: boolean;
  onSelect: (value: string) => void;
}>(({ option, isSelected, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [option.value, onSelect]);

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${option.label} accommodation for ₹${option.price}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{option.label}</h3>
          <p className="text-2xl font-bold text-emerald-600">₹{option.price}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 ${
          isSelected
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white scale-50"></div>
          )}
        </div>
      </div>
    </div>
  );
});

AccommodationOption.displayName = 'AccommodationOption';

const RegistrationForm = React.memo<RegistrationFormProps>(({ isOpen, onClose }) => {
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  // Reset form state when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAccommodation('');
      setError(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleAccommodationSelect = useCallback((value: string) => {
    if (!mountedRef.current || isProcessing) return;
    
    try {
      setSelectedAccommodation(value);
      setError(null);
    } catch (err) {
      console.error('Error selecting accommodation:', err);
      setError('Failed to select accommodation. Please try again.');
    }
  }, [isProcessing]);

  const handleMoreDetails = useCallback(async () => {
    if (!mountedRef.current || isProcessing) return;

    if (!selectedAccommodation) {
      setError('Please select an accommodation option first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Add processing timeout to prevent hanging
      processingTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setIsProcessing(false);
          setError('Request timed out. Please try again.');
        }
      }, 10000);

      // Get payment URL based on selection
      const paymentUrl = selectedAccommodation === 'dormitory' 
        ? process.env.NEXT_PUBLIC_DORMITORY_PAYMENT_PAGE
        : process.env.NEXT_PUBLIC_ROOM_PAYMENT_PAGE;

      if (!paymentUrl) {
        throw new Error(`${selectedAccommodation === 'dormitory' ? 'Dormitory' : 'Room'} payment link not configured`);
      }

      // Validate URL format
      try {
        new URL(paymentUrl);
      } catch {
        throw new Error('Invalid payment URL configuration');
      }

      // Clear timeout before redirect
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }

      // Use window.open for better error handling and user experience
      const newWindow = window.open(paymentUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        // Fallback to location.href if popup blocked
        window.location.href = paymentUrl;
      } else {
        // Close the registration popup after successful redirect
        onClose();
      }

    } catch (err) {
      console.error('Payment redirect error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      if (mountedRef.current) {
        setError(`${errorMessage}. Please contact admin for assistance.`);
      }
    } finally {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
      
      if (mountedRef.current) {
        setIsProcessing(false);
      }
    }
  }, [selectedAccommodation, isProcessing, onClose]);

  const handleClose = useCallback(() => {
    if (isProcessing) return;
    onClose();
  }, [onClose, isProcessing]);

  // Memoized accommodation options to prevent re-renders
  const accommodationElements = useMemo(() => 
    accommodationOptions.map((option) => (
      <AccommodationOption
        key={option.value}
        option={option}
        isSelected={selectedAccommodation === option.value}
        onSelect={handleAccommodationSelect}
      />
    )), [selectedAccommodation, handleAccommodationSelect]
  );

  if (!isOpen) return null;

  return (
    <ErrorBoundary fallback={<div className="p-4 text-center text-red-600">Registration form encountered an error</div>}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-6 relative">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close registration form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Choose Accommodation
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pb-6">
              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Accommodation Options */}
              <div className="space-y-3" role="radiogroup" aria-label="Accommodation options">
                {accommodationElements}
              </div>

              {/* More Details Button */}
              <Button
                onClick={handleMoreDetails}
                className="w-full bg-gradient-to-r from-emerald-600 to-orange-600 hover:from-emerald-700 hover:to-orange-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!selectedAccommodation || isProcessing}
                aria-label={`Proceed with ${selectedAccommodation} accommodation`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'More Details'
                )}
              </Button>

              {/* Processing indicator */}
              {isProcessing && (
                <div className="text-center text-sm text-gray-600">
                  Please wait while we redirect you to the payment page...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
});

RegistrationForm.displayName = 'RegistrationForm';

export default RegistrationForm;