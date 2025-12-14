import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/HeaderFooter/Header';
import Main from './components/Main/Main';
import CreateEditNote from './components/CreateEditNote/CreateEditNote';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Error404 from './components/Error404/Error404';
import ProductsList from './components/catalog/ProductsList';
import ProductDetails from './components/catalog/ProductDetails';
import ProductForm from './components/catalog/ProductForm';
import Favorites from './components/catalog/Favorites';
import LandingPage from './components/landing/LandingPage';
import SectionsAdmin from './components/admin/SectionsAdmin';
import SectionForm from './components/admin/SectionForm';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  const hideHeaderRoutes = ['/signin', '/signup', '/404'];
  const shouldShowHeader = token && !hideHeaderRoutes.includes(location.pathname);
  
  return (
    <>
      {shouldShowHeader && <Header />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
        <Route
            path="/catalog"
            element={
              <PrivateRoute>
                <ProductsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/create"
            element={
              <PrivateRoute>
                <ProductForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <PrivateRoute>
                <ProductForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PrivateRoute>
                <ProductDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          /> 
          <Route
              path="/admin/sections"
              element={
                <PrivateRoute>
                  <SectionsAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/sections/create"
              element={
                <PrivateRoute>
                  <SectionForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/sections/edit/:id"
              element={
                <PrivateRoute>
                  <SectionForm />
                </PrivateRoute>
              }
            />
        <Route path="/404" element={<Error404 />} />
        
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

export default App;
