interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  icon,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <div className='relative'>
        {icon && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            {icon}
          </div>
        )}
        <input
          className={`
            block w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${
              error
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }
            ${icon ? "pl-10" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className='text-sm text-red-600'>{error}</p>}
      {helper && !error && <p className='text-sm text-gray-500'>{helper}</p>}
    </div>
  );
};
