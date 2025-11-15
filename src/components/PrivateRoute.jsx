import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  
  // Если токена нет — перенаправляем на вход
  return token ? children : <Navigate to="/signin" />;
}
