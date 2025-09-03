
import React from 'react';

const Input = ({ 
  title, 
  name, 
  type = 'text',
  containerClassName = '',
  labelClassName = '',
  inputclassName = '',
  value = '', 
  setValue = () => {}, 
  ...props
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label htmlFor={name} className={`block font-medium ${labelClassName}`}>
        {title}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={` ${inputclassName} block w-full rounded border border-indigo-200 focus:border-indigo-500 px-3 py-2 outline-none transition`}
        value={value || ''}
        onChange={e => setValue(e.target.value, name)}
        {...props}
      />
    </div>
  );
}


export default Input;