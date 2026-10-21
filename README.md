# Muscle Forest Gym 💪

A full-stack gym website built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

## About the Project

Muscle Forest Gym is a gym website project designed to present gym programs, membership plans, and contact information. It includes an enquiry form connected to a backend API and an admin dashboard for managing enquiries.

## Features

* Responsive gym website design
* Home, About, Programs, and Membership sections
* Interactive program details
* Membership plan selection
* Enquiry form with server-side validation
* MongoDB database integration for storing enquiries
* Admin login and protected enquiry dashboard
* Session-based authentication
* MongoDB-backed session storage
* Rate limiting for login and enquiry endpoints

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication & Sessions:** express-session, connect-mongo
* **Configuration:** dotenv

## Getting Started

### Prerequisites

* Node.js and npm
* A MongoDB database, local or MongoDB Atlas

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/adityagtm2407-cloud/muscle-forest-gym.git
   ```

2. Open the project folder:

   ```bash
   cd muscle-forest-gym
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and configure the required environment variables:

   ```env
   MONGO_URL=your_mongodb_connection_string
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_strong_admin_password
   SESSION_SECRET=your_long_random_secret
   ```

5. Start the server:

   ```bash
   node server.js
   ```

6. Open `http://localhost:3000` in your browser.

## Security Notes

* Never commit the `.env` file or expose database credentials.
* Use strong admin credentials and a unique session secret.
* Configure secure cookies and HTTPS for production deployment.
* Review environment variables and database access permissions before deploying.

## Project Status

The website and backend have been tested locally. Production deployment and final live-environment testing are still pending.

## Author

Aditya Gautam

GitHub: [@adityagtm2407-cloud](https://github.com/adityagtm2407-cloud)
