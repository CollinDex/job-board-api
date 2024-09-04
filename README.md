# Job Listing Platform

## Overview
The **Job Listing Platform** is a web-based application designed to connect job seekers and employers. It allows employers to post jobs and search for potential candidates, while job seekers can search for jobs, apply for listings, and manage their profiles.

## Features

### Job Seeker Features:
- **Job Search:** Search for jobs based on location, keywords, and job type.
- **Job Application:** Apply for jobs directly from the platform.
- **Profile Management:** Create and update user profiles with relevant experience, skills, and education.
- **Save Jobs:** Save jobs to a personal list for future reference.
- **Notifications:** Receive realtime notifications for job matches and updates.

### Employer Features:
- **Post Jobs:** Create and post new job listings, specifying job title, location, description, and qualifications.
- **Manage Jobs:** View and manage all posted jobs, including updating job details or closing listings.

### General Features:
- **User Authentication:** Secure user registration and login system (OAuth supported).
- **Admin Dashboard:** Admin control over job postings, user management, and platform moderation.
- **Search Filters:** Powerful filtering options to narrow down job searches.

## Tech Stack

- **Frontend:**
  - React.js with Tailwind CSS for styling
  - React Router for routing
  - Axios for API calls

- **Backend:**
  - Node.js with Express.js
  - MongoDB with Mongoose (NoSQL database)
  - JWT for authentication
  - Cloudinary for media storage (for profile pictures and resumes)

## Installation and Setup

### Prerequisites
- **Node.js** (v14.x or above)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** (package managers)
