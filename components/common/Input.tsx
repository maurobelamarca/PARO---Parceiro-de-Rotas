
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  // FIX: Changed JSX.Element to React.ReactNode to resolve namespace issue.
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, icon, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          id={id}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150 ease-in-out ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
};
