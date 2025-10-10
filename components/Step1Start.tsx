import React, { useState, useEffect } from 'react';
import { HairProfileData } from '../types';

interface Step1StartProps {
  onNext: () => void;
  setHairProfileData: React.Dispatch<React.SetStateAction<Partial<HairProfileData>>>;
}

const Step1Start: React.FC<Step1StartProps> = ({ onNext, setHairProfileData }) => {
  const [gender, setGender] = useState<string | null>(null);

  useEffect(() => {
    if (gender) {
      setHairProfileData(prev => ({ ...prev, gender }));
      // Removed timeout for instant navigation
      onNext();
    }
  }, [gender, onNext, setHairProfileData]);

  const handleSelect = (selectedGender: 'Male' | 'Female') => {
    setGender(selectedGender);
  };

  return (
    <div className="animate-fade-in-up flex flex-col w-full h-full items-center justify-center p-4">
        <div className="text-center mb-8">
            <h2 className="text-lg font-medium text-slate-600">Please select a concern to begin.</h2>
        </div>
      <div className="w-full max-w-md lg:max-w-lg mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center">
          {/* Male Card */}
          <div
            onClick={() => handleSelect('Male')}
            className={`
              rounded-2xl p-4 cursor-pointer transition-all duration-300 w-full sm:w-60
              border-2 
              ${gender === 'Male'
                ? 'border-blue-500 bg-white shadow-interactive-hover scale-105'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-lifted'
              }
            `}
          >
            <div className="relative flex flex-col items-center">
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${gender === 'Male' ? 'border-blue-500 bg-white' : 'border-slate-400 bg-white'}
              ">
                {gender === 'Male' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
              </div>
              <div className="w-36 h-36 my-2">
                  <img src="/male-illustration.png" alt="Male illustration" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Male</h3>
            </div>
          </div>

          {/* Female Card */}
          <div
            onClick={() => handleSelect('Female')}
            className={`
              rounded-2xl p-4 cursor-pointer transition-all duration-300 w-full sm:w-60
              border-2 
              ${gender === 'Female'
                ? 'border-blue-500 bg-white shadow-interactive-hover scale-105'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-lifted'
              }
            `}
          >
            <div className="relative flex flex-col items-center">
              <div className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${gender === 'Female' ? 'border-blue-500 bg-white' : 'border-slate-400 bg-white'}
              ">
                {gender === 'Female' && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
              </div>
              <div className="w-36 h-36 my-2">
                  <img src="/female-illustration.png" alt="Female illustration" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Female</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Start;
