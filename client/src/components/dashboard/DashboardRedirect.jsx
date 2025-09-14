import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardRedirect = () => {
  const { userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userType === 'personal') {
      navigate('/dashboard/personal');
    } else if (userType === 'business') {
      navigate('/dashboard/business');
    } else if (userType === 'employee') {
      navigate('/dashboard/employee');
    } else {
      navigate('/');
    }
  }, [userType, navigate]);

  return (
    <div className="loading-container">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Redirecting...</span>
      </div>
    </div>
  );
};

export default DashboardRedirect;