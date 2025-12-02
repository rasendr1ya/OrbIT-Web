import React, { useState, useRef, useEffect } from 'react';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  className = '',
  error = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 text-left bg-white border rounded-lg
          flex items-center justify-between gap-2
          transition-all duration-200
          ${disabled
            ? 'bg-gray-100 cursor-not-allowed opacity-60'
            : 'hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
          }
          ${error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300'
          }
          ${isOpen ? 'ring-2 ring-black border-transparent' : ''}
        `}
      >
        <span className={`${value ? 'text-gray-900' : 'text-gray-500'} truncate`}>
          {displayText}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-4 py-2.5 text-left flex items-center justify-between gap-2
                  transition-colors duration-150
                  ${value === option.value
                    ? 'bg-black text-white'
                    : 'text-gray-900 hover:bg-gray-100'
                  }
                  ${index !== 0 ? 'border-t border-gray-100' : ''}
                `}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
