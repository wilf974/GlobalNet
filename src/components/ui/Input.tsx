import React from 'react';
import { InputProps } from '@/types';
import { motion } from 'framer-motion';

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
  className = ''
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200';
  const errorClasses = error ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : '';
  const classes = `${baseClasses} ${errorClasses} ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={handleChange}
            className={`${classes} resize-none`}
            rows={4}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={handleChange}
            className={classes}
          />
        )}
      </motion.div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input; 