import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Dashboard from './features/dashboard/dashboard';
import Login from './features/login/login';

// TODO: https://docs.amplify.aws/react/how-amplify-works/concepts/#auth

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = React.useState(false);

  // In a real app, check Auth.currentAuthenticatedUser() to set auth state

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setAuthenticated(true)} />}
        />
        <Route
          path="/dashboard"
          element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={authenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
