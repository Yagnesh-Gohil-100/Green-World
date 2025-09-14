import { useAuth } from '../../../contexts/AuthContext';
import './PersonalDashboard.css';

const PersonalDashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="personal-dashboard">
      <h1>Welcome, {currentUser?.name}!</h1>
      <p>Your Personal Carbon Footprint Tracker</p>
      {/* Personal carbon stats, goals, achievements */}
    </div>
  );
};

export default PersonalDashboard;