# Profile Manager with Temporal Workflow
This is a full-stack web application that allows users to authenticate using OIDC (Auth0), edit their profile, and trigger a Temporal workflow that saves the data to a database after a 10-second delay.

## Tech Stack

- **Frontend:** React, TypeScript, Auth0, CSS
- **Backend:** Node.js (Express) or .NET Core Web API
- **Workflow Orchestration:** [Temporal.io](https://temporal.io)
- **Database:** SQL Server
## Features

-  Secure login using OIDC (Auth0)
-  Editable profile fields:
  - First Name
  - Last Name
  - Phone Number
  - City
  - Pincode
-  Temporal workflow triggered on profile submission
  - 10-second delay before proceeding
  - Save profile to database

## workflow 
temporal server start-dev

##  Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd client
## Install dependecies 
npm install
# Run the frontend:
npm run dev
# Create a .env file in the root of client and add:
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_API_BASE_URL=http://localhost:5000/api

## Backend Setup 
cd server
dotnet restore
dotnet run
Update appsettings.json or use launchSettings.json

