import { useAuth } from '../../../contexts/AuthContext';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="employee-dashboard">
      <h1>Welcome, {currentUser?.name}!</h1>
      <p>Employee at {currentUser?.businessName}</p>
      {/* Individual stats within company context */}
    </div>
  );
};

export default EmployeeDashboard;