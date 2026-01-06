'use client';
interface RegisterButtonProps {
    loading: boolean;
    onClick: () => void;
  }
  
  const RegisterButton: React.FC<RegisterButtonProps> = ({ loading, onClick }) => {
    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    );
  };
  
  export default RegisterButton;
  