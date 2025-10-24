import React, { useState } from 'react';
import { Check, Wifi, Smartphone, User, Users } from 'lucide-react';


  const devices = [
    {
      id: 'single',
      title: 'Single',
      description: 'You are paying for yourself alone ',
      icon: User,
    },
    {
      id: 'multiple',
      title: 'Multiple',
      description: 'You are paying for yourself and others',
      icon: Users,
    }
  ];


const RadioCard = ({ id, title, description, price, icon: Icon, isSelected, onSelect, badge }) => {
  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 transform ${
        isSelected
          ? 'ring-2 ring-primary-main shadow-lg bg-primary-main border-primary-main'
          : 'hover:shadow-md border-gray-200 bg-white hover:border-gray-300'
      } border rounded-xl p-6 group`}
      onClick={() => onSelect(id)}
    >
      {/* Radio Button */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-primary-main bg-primary-main'
              : 'border-gray-300 group-hover:border-gray-400'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`mb-4 ${badge ? 'mt-6' : ''}`}>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
            isSelected
              ? 'bg-white text-primary-main'
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3
          className={`text-lg font-semibold transition-colors ${
            isSelected ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-[15px] transition-colors ${
            isSelected ? 'text-white' : 'text-gray-600'
          }`}
        >
          {description}
        </p>
        
      </div>

      {/* Selection Overlay */}
      <div
        className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
          isSelected
            ? 'bg-[#091e545f] opacity-[0.03]'
            : 'bg-transparent'
        }`}
      />
    </div>
  );
};

const PaymentSelection = ({ selectedOption, setSelectedOption }) => {

  return (
    <div className=" w-full py-2">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Payment Type</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2  gap-4">
          {devices.map((device) => (
            <RadioCard
              key={device.id}
              id={device.id}
              title={device.title}
              description={device.description}
              icon={device.icon}
              isSelected={selectedOption === device.id}
              onSelect={setSelectedOption}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default PaymentSelection;