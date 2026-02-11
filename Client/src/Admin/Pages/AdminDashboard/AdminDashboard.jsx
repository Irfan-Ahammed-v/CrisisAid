import React from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-gray-50 to-blue-50 p-5">
      
      {/* Statistics Cards Container */}
      <div className="flex flex-wrap gap-6 justify-center mb-10">
        
        {/* Total Requests */}
        <div className="w-48 h-32 bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center justify-between 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
          <AssignmentIcon className="text-blue-600" sx={{ fontSize: 36 }} />
          <div className="text-gray-700 font-medium text-center">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900">90</div>
        </div>

        {/* Total Victims */}
        <div className="w-48 h-32 bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center justify-between 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
          <ReportProblemIcon className="text-red-600" sx={{ fontSize: 36 }} />
          <div className="text-gray-700 font-medium text-center">Total Victims</div>
          <div className="text-2xl font-bold text-gray-900">90</div>
        </div>

        {/* Total Volunteers */}
        <div className="w-48 h-32 bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center justify-between 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
          <VolunteerActivismIcon className="text-green-700" sx={{ fontSize: 36 }} />
          <div className="text-gray-700 font-medium text-center">Total Volunteers</div>
          <div className="text-2xl font-bold text-gray-900">90</div>
        </div>

        {/* Pending Requests */}
        <div className="w-48 h-32 bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center justify-between 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
          <PendingActionsIcon className="text-orange-500" sx={{ fontSize: 36 }} />
          <div className="text-gray-700 font-medium text-center">Pending Requests</div>
          <div className="text-2xl font-bold text-gray-900">90</div>
        </div>

        {/* Requests Resolved */}
        <div className="w-48 h-32 bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center justify-between 
                       transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
          <TaskAltIcon className="text-green-700" sx={{ fontSize: 36 }} />
          <div className="text-gray-700 font-medium text-center">Requests Resolved</div>
          <div className="text-2xl font-bold text-gray-900">90</div>
        </div>
      </div>

      {/* Navigation Cards Container */}
      <div className="flex flex-wrap gap-6 justify-center">
        
        {/* Latest Requests */}
        <div 
          onClick={() => navigate('/Admin/Requests')}
          className="w-96 h-28 bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
        >
          <div className="bg-blue-50 p-3 rounded-xl">
            <ArrowForwardIosIcon className="text-blue-600" sx={{ fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Latest Requests</h3>
            <p className="text-sm text-gray-600 mt-1">View most recent help requests</p>
          </div>
        </div>

        {/* All Requests */}
        <div 
          onClick={() => navigate('/Admin/Requests')}
          className="w-96 h-28 bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
        >
          <div className="bg-blue-50 p-3 rounded-xl">
            <ArrowForwardIosIcon className="text-blue-600" sx={{ fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Requests</h3>
            <p className="text-sm text-gray-600 mt-1">Manage every submitted request</p>
          </div>
        </div>

        {/* Volunteers */}
        <div 
          className="w-96 h-28 bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer
                    opacity-50 cursor-not-allowed"
          // onClick={() => navigate('/volunteers')}
        >
          <div className="bg-blue-50 p-3 rounded-xl">
            <ArrowForwardIosIcon className="text-blue-600" sx={{ fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Volunteers</h3>
            <p className="text-sm text-gray-600 mt-1">View and manage volunteers</p>
          </div>
        </div>

        {/* Victims */}
        <div 
          onClick={() => navigate('/Admin/Victims')}
          className="w-96 h-28 bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
        >
          <div className="bg-blue-50 p-3 rounded-xl">
            <ArrowForwardIosIcon className="text-blue-600" sx={{ fontSize: 28 }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Victims</h3>
            <p className="text-sm text-gray-600 mt-1">View registered victims</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;