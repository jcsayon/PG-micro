import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { User, Mail, Phone, MapPin, Globe, FileText, Hash } from "lucide-react";

const user = {
  firstName: "Jack",
  lastName: "Adams",
  email: "jackadams@gmail.com",
  phone: "(213) 555-1234",
  bio: "Product Designer",
  country: "United States of America",
  cityState: "California, USA",
  postalCode: "ERT 62574",
  taxId: "AS564178969",
  location: "Los Angeles, California, USA",
  avatar: "https://randomuser.me/api/portraits/men/75.jpg"
};

const AccountInfoPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
        {/* Header with gradient background */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl h-48 w-full" />
          
          {/* Profile Card - Overlapping the gradient */}
          <div className="relative pt-8">
            <div className="bg-white shadow-lg rounded-2xl p-8 mx-4 flex flex-col md:flex-row items-center gap-8">
              {/* Avatar with border */}
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center p-1">
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="h-full w-full rounded-full object-cover border-4 border-white" 
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="sr-only">Online</span>
                </div>
              </div>
              
              {/* User info */}
              <div className="text-center md:text-left mt-4 md:mt-0">
                <h2 className="text-3xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full mt-2">
                  <FileText size={16} />
                  <p className="font-medium">{user.bio}</p>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-2">
                  <MapPin size={16} className="text-gray-400" />
                  <p>{user.location}</p>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="flex gap-3 mt-6 md:mt-0 md:ml-auto">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Message
                </button>
                <button className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - Two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
                    Edit Details
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">First Name</p>
                      <p className="font-medium text-gray-800 mt-1">{user.firstName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>
                      <p className="font-medium text-gray-800 mt-1">{user.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-indigo-600 mt-1">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-800 mt-1">{user.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 md:col-span-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-green-600" />
                    </div>
                    <div className="w-full max-w-md">
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="font-medium text-gray-800 mt-1">{user.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-xl overflow-hidden h-full">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Address</h3>
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
                    Edit Address
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Globe size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="font-medium text-gray-800 mt-1">{user.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City/State</p>
                      <p className="font-medium text-gray-800 mt-1">{user.cityState}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Postal Code</p>
                      <p className="font-medium text-gray-800 mt-1">{user.postalCode}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Hash size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">TAX ID</p>
                      <p className="font-medium text-gray-800 mt-1">{user.taxId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Section - Optional */}
        <div className="mt-6 bg-white shadow-md rounded-xl overflow-hidden">
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-center h-32 text-gray-400">
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountInfoPage;