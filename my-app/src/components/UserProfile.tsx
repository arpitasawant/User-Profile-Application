import React, { useEffect, useState } from 'react';
 import '../styles/UserProfile.css'; 
 
 interface ContactMode {
   email?: string;
   mobile?: string;
 }
 
 interface User {
   firstName: string;
   lastName: string;
   email: string;
   contactMode: ContactMode; 
   isVerified: boolean;
 }
 
 const UserProfile: React.FC = () => {
   const [user, setUser] = useState<User | null>(null);
 
   useEffect(() => {
     const fetchUserInfo = async () => {
       try {
         const response = await fetch('http://localhost:3000/user-info', {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${localStorage.getItem('token')}`,
           },
         });
 
         if (response.ok) {
           const data: User = await response.json();
           setUser(data);
         } else {
           console.error('Failed to fetch user information');
         }
       } catch (error) {
         console.error('Error fetching user information:', error);
       }
     };
 
     fetchUserInfo();
   }, []);
 
   return (
     <div className="user-profile">
       {user ? (
         <div className="user-info">
           <h1>User Profile</h1>
           <p><strong>First Name:</strong> {user.firstName}</p>
           <p><strong>Last Name:</strong> {user.lastName}</p>
           <p><strong>Email:</strong> {user.email}</p>
           <p><strong>Contact Mode:</strong> {user.contactMode.email ? `Email: ${user.contactMode.email}` : user.contactMode.mobile ? `Mobile: ${user.contactMode.mobile}` : 'Not provided'}</p>
           <p><strong>Verified:</strong> {user.isVerified ? 'Yes' : 'No'}</p>
         </div>
       ) : (
         <p>Loading...</p>
       )}
     </div>
   );
 };
 
 export default UserProfile;
 