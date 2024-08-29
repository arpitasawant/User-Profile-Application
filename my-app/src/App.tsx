import './App.css'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInForm from './components/SignInForm'; 
import SignupForm from './components/SignupForm';
import OtpValidationPage from './components/OtpValidation';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/otp-validation" element={<OtpValidationPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
