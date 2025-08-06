import React from 'react';
import { Loader, CheckCircle, ArrowRight } from 'lucide-react';

interface ProcessingStatusProps {
  isDarkMode: boolean;
}

export function ProcessingStatus({ isDarkMode }: ProcessingStatusProps) {
  const steps = [
    { id: 1, title: 'Processing HTML', description: 'main.py analyzing document' },
    { id: 2, title: 'Generating Insights', description: 'Creating markdown analysis' },
    { id: 3, title: 'Template Matching', description: 'firstStart.py processing' },
    { id: 4, title: 'Final Document', description: 'Ready for download' }
  ];

  return (
    <div className={`rounded-xl border shadow-sm mb-6 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Processing Document
          </h2>
        </div>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                  step.id === 1
                    ? 'border-blue-600 bg-blue-600'
                    : step.id <= 2
                      ? 'border-blue-600 bg-blue-600'
                      : isDarkMode
                        ? 'border-gray-600 bg-gray-700'
                        : 'border-gray-300 bg-gray-100'
                }`}>
                  {step.id <= 2 ? (
                    step.id === 1 ? (
                      <Loader className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )
                  ) : (
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {step.id}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className={`font-medium text-sm ${
                    step.id <= 2
                      ? 'text-blue-600'
                      : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className={`w-5 h-5 mx-2 ${
                  step.id < 2
                    ? 'text-blue-600'
                    : isDarkMode
                      ? 'text-gray-600'
                      : 'text-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}