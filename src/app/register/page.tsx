'use client';

import { useState } from 'react';
import Layout from '@/components/Layout/Layout';

// Define the Razorpay options type
interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open: () => void;
      };
    };
  }
}

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    campDate: ''
  });

  const handlePayment = async () => {
    // In a real implementation, you would validate form data first
    if (!formData.name || !formData.email || !formData.phone || !formData.age || !formData.campDate) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Create order on backend
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 250000, // ₹2500 in paise
          currency: 'INR'
        })
      });

      const order = await response.json();

      if (!order.id) {
        throw new Error('Failed to create order');
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ISKON Youth Forum',
        description: 'Braj Camp Registration',
        order_id: order.id,
        handler: async function (response: { 
          razorpay_order_id: string; 
          razorpay_payment_id: string; 
          razorpay_signature: string; 
        }) {
          // Verify payment on backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          });
          
          const verification = await verifyResponse.json();
          
          if (verification.success) {
            alert('Payment successful! Registration completed.');
            // Here you would typically save the user data to your database
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#2e7d6c'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong with the payment. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-emerald-900 mb-4">Register for Braj Camp</h1>
          <p className="text-emerald-700">Join us for a transformative experience in the sacred lands of Braj</p>
        </div>
        
        <div className="premium-card glass border border-emerald-100/30">
          <div className="form-group">
            <label className="block text-emerald-900 mb-2 font-medium">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-control w-full"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="block text-emerald-900 mb-2 font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="form-control w-full"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="block text-emerald-900 mb-2 font-medium">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="form-control w-full"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="block text-emerald-900 mb-2 font-medium">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="form-control w-full"
                required
                min="10"
                max="35"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-emerald-900 mb-2 font-medium">Camp Date</label>
              <input
                type="date"
                value={formData.campDate}
                onChange={(e) => setFormData({...formData, campDate: e.target.value})}
                className="form-control w-full"
                required
              />
            </div>
          </div>
          
          <div className="neumorphic-inset p-4 rounded-xl my-6">
            <h3 className="font-bold text-lg text-emerald-900 mb-2">Payment Details</h3>
            <p className="mb-2 text-emerald-800">Registration Fee: <span className="font-bold text-emerald-700">₹2500.00</span></p>
            <p className="text-sm text-emerald-700">Note: This includes accommodation, meals, and all camp activities.</p>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={handlePayment}
              className="premium-btn w-full py-4 text-lg font-semibold"
            >
              Pay ₹2500.00 & Register
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}