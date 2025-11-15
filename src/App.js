import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/HeaderFooter/Header';
import Main from './components/Main/Main';
import CreateEditNote from './components/CreateEditNote/CreateEditNote';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  
  const hideHeaderRoutes = ['/signin', '/signup'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      
      <Routes>
        <Route path="/" element={<Navigate to="/main" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        <Route path="/main" element={
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        } />
        <Route path="/create" element={
          <PrivateRoute>
            <CreateEditNote />
          </PrivateRoute>
        } />
        <Route path="/edit/:id" element={
          <PrivateRoute>
            <CreateEditNote />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
