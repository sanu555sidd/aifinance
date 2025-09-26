'use client';

import { useState } from 'react';
// Using built-in SVG icons instead of lucide-react

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'gold' | 'diamond' | null>(null);

  if (!isOpen) return null;

  const goldFeatures = [
    'AI-Powered Expense Insights',
    'Advanced Category Suggestions',
    'Monthly Spending Reports',
    'Custom Budget Alerts',
    'Export Data (CSV)',
    '24/7 Email Support',
  ];

  const diamondFeatures = [
    'Everything in Gold',
    'Predictive Spending Analysis',
    'Investment Recommendations',
    'Multi-Currency Support',
    'Real-time Financial Dashboard',
    'Advanced Analytics & Charts',
    'Priority Support',
    'Personal Finance Advisor',
    'Unlimited Export Options',
  ];

  const handleUpgrade = (plan: 'gold' | 'diamond') => {
    // Here you would integrate with your payment processor
    console.log(`Upgrading to ${plan} plan`);
    alert(`Upgrading to ${plan.toUpperCase()} plan! (Payment integration would go here)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upgrade Your Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Unlock advanced AI features and get more insights
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Plans */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gold Plan */}
              <div className={`relative rounded-2xl border-2 transition-all duration-300 ${
                selectedPlan === 'gold' 
                  ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-yellow-400'
              }`}>
                <div className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16L3 21l5.25-1.5L12 21l3.75-1.5L21 21l-2-5H5zm2.25-4.5L12 6l4.75 5.5H7.25z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Gold Membership
                    </h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-yellow-600">$9</span>
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Perfect for personal finance management
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {goldFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      setSelectedPlan('gold');
                      handleUpgrade('gold');
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Upgrade to Gold
                  </button>
                </div>

                {/* Popular Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Popular
                  </div>
                </div>
              </div>

              {/* Diamond Plan */}
              <div className={`relative rounded-2xl border-2 transition-all duration-300 ${
                selectedPlan === 'diamond' 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}>
                <div className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 3h12l4 6-8 10-8-10 4-6z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Diamond Membership
                    </h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-blue-600">$19</span>
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Complete financial management suite
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {diamondFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      setSelectedPlan('diamond');
                      handleUpgrade('diamond');
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Upgrade to Diamond
                  </button>
                </div>

                {/* Premium Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 3h12l4 6-8 10-8-10 4-6z"/>
                    </svg>
                    Premium
                  </div>
                </div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="text-center mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💰 <strong>30-day money-back guarantee</strong> • Cancel anytime • No hidden fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}