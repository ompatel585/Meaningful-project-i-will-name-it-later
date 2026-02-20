import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">
            Role: <span className="font-medium capitalize">{user?.role?.replace('_', ' ')}</span>
          </p>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* For all users */}
          <Link
            to="/restaurants"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Browse Restaurants</h3>
            <p className="text-gray-600 text-sm">Find and explore restaurants near you</p>
          </Link>

          <Link
            to="/my-reservations"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">My Reservations</h3>
            <p className="text-gray-600 text-sm">View and manage your reservations</p>
          </Link>

          {/* Restaurant Manager specific */}
          {user?.role === 'restaurant_manager' && (
            <Link
              to="/manage-restaurant"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Manage Restaurant</h3>
              <p className="text-gray-600 text-sm">Update your restaurant details</p>
            </Link>
          )}

          {/* Super Admin specific */}
          {user?.role === 'super_admin' && (
            <Link
              to="/admin/users"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Manage Users</h3>
              <p className="text-gray-600 text-sm">View and manage all users</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
