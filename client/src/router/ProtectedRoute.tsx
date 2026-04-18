import { Navigate } from 'react-router-dom';
import { tokenStore } from '../api/http';

type ProtectedRouteProps = {
	children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const isAuthenticated = Boolean(tokenStore.getAccess());
	return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}
