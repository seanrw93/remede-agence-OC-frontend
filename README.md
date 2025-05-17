# Argent Bank Frontend

This folder contains the frontend application for the Argent Bank project. The frontend is built with **React** and **Vite**, and communicates with the backend API to provide a seamless user experience for managing user accounts, profiles, and transactions.

## How It Works With the Backend

The frontend relies on a separate backend API for all data operations, including authentication, user profile management, and transactions.  
**You must clone and run the backend server from its own repository for the frontend to function correctly.**

- The frontend sends HTTP requests to the backend (default: `http://localhost:3001/api/v1`).
- All authentication and data management is handled via the backend API.
- API endpoints and data models are defined in the backend's Swagger documentation.

### Setting Up the Backend

1. **Fork and clone the backend repository** from [this GitHub repo](https://github.com/OpenClassrooms-Student-Center/Project-10-Bank-API) (or your course-provided backend repo).
2. **Follow the instructions in the backend's `README.md`** to install dependencies, populate the database, and start the backend server.
3. Once running, the backend API and its documentation will be available at [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

## Features

- User authentication (login, signup)
- View and update user profile
- View accounts and transactions
- Responsive and user-friendly interface

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Backend server running (see above)

### Installation

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

Start the development server with Vite:
```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default (Vite's default port).

### API Endpoint Configuration

The frontend expects the backend API URL to be set in the code or in `vite.config.js`.  
If you need to change the backend API URL, edit the relevant value in `vite.config.js` or wherever your project reads the API base URL.

## API Reference

The frontend communicates with the backend API as defined in the Swagger documentation (see backend repo for details).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.