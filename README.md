## User Profile Management System

# Overview
This system consists of a backend API for managing user data and a React frontend for displaying user profiles. The key functionalities include user authentication and profile retrieval.

# Backend Logic

1. User Schema Design
User Model (UserSchema):
Fields:
firstName and lastName: Required strings representing the user's name.
email: Required unique string for user identification.
password: Required string for authentication.
contactMode: An object with optional fields email and mobile, which hold the user's contact information.
otp and otpExpiry: Used for OTP-based verification.
isVerified: A boolean indicating whether the user's email has been verified.
Reasoning: The schema is designed to store user details securely and support both email and mobile contact modes. Unique constraints on email and mobile prevent duplicate entries.

2. User Authentication (login function)
Process:
Extract email and password from request body.
Validate that both email and password are provided.
Check if the user exists in the database.
Verify that the user's email is verified.
Compare the provided password with the hashed password in the database.
Generate a JWT token if authentication is successful.
Reasoning: Ensures that only authenticated users with valid credentials can access the system. The JWT token facilitates secure communication between the frontend and backend.

3. Retrieve User Profile (getUserInfo function)
Process:
Extract and verify the JWT token from request headers.
Decode the token to obtain the user ID.
Fetch user details from the database based on the user ID.
Return user profile information (firstName, lastName, email, contactMode, isVerified).
Reasoning: Provides secure access to user profile information by verifying the JWT token. Ensures that users can only access their own profile information.

# Frontend Logic

1. User Profile Component (UserProfile.tsx)
Process:
Fetch user information from the backend API using the stored JWT token.
Display user details including first name, last name, email, contact mode, and verification status.
Reasoning: Allows users to view their profile information securely after logging in. The component handles loading states and displays data retrieved from the backend.
Common Issues
Error Handling:
Ensure that error messages are clear and provide feedback to users (e.g., "Loading...", "Failed to fetch user information").
Data Validation:
Validate and sanitize inputs both on the backend and frontend to prevent issues such as invalid or missing data.

### create .env file in server 

MONGO_URI=
EMAIL_USER=
EMAIL_PASS=
PORT=
JWT_SECRET=


# Summary
This system combines secure backend operations with a user-friendly frontend interface to manage user profiles. The backend ensures that user data is stored securely and accessed only through authenticated requests, while the frontend provides a clear and responsive interface for users to view their information.

