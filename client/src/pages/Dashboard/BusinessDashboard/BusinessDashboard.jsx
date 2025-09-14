import { useAuth } from '../../../contexts/AuthContext';
import './BusinessDashboard.css';

const BusinessDashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="business-dashboard">
      <h1>{currentUser?.businessName} Dashboard</h1>
      <p>Company Analytics & Employee Management</p>
      {/* Company carbon stats, employee management, reports */}
    </div>
  );
};

export default BusinessDashboard;