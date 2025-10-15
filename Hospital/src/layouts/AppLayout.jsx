import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  Activity,
  Bell,
  BellRing,
  User as UserIcon,
  BarChart2,
  LogOut,
  MessageSquare,
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Toaster } from 'sonner';

const navigationItems = [
  {
    title: "Appointments",
    url: "/dashboard",
    icon: Calendar,
  },
  {
    title: "Doctors",
    url: "/doctor-management",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/document-review",
    icon: FileText,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: UserIcon,
  },
];

const communicationItems = [
  {
    title: "Broadcast",
    url: "/broadcast",
    icon: BellRing,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
];

const settingsItems = [
  {
    title: "Insights",
    url: "/insights",
    icon: BarChart2,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Settings,
  },
];

const topNavItems = [
  {
    title: "Appointments",
    url: "/dashboard",
    match: (location) => location.pathname === "/dashboard",
  },
  {
    title: "Doctors",
    url: "/doctor-management",
    match: (location) => location.pathname === "/doctor-management",
  },
  {
    title: "Reports",
    url: "/document-review",
    match: (location) => location.pathname === "/document-review",
  },
  {
    title: "Patients",
    url: "/dashboard#patients",
    match: (location) => location.pathname === "/dashboard" && location.hash === "#patients",
  },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Appointments");

  const showExpandedSidebar = isSidebarOpen || isMobileSidebarOpen;
  const sidebarWidthClass = isMobileSidebarOpen ? 'w-72' : isSidebarOpen ? 'w-64' : 'w-20';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.hospitalName) {
          setCurrentUser({
            hospital_name: storedUser.hospitalName,
            email: storedUser.email
          });
        }

        // Then try to fetch from API
        const user = await base44.auth.me();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error fetching user", error);
        // Use localStorage user if API fails
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.hospitalName) {
          setCurrentUser({
            hospital_name: storedUser.hospitalName,
            email: storedUser.email
          });
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (itemUrl) => {
    if (itemUrl.includes('#')) {
      return location.pathname + location.hash === itemUrl;
    }
    return location.pathname === itemUrl;
  };

  const handleNavClick = (item) => {
    setActiveSection(item.title);
    setIsMobileSidebarOpen(false);
    navigate(item.url);
  };

  return (
    <>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-['Inter',sans-serif]">
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        bg-white/90 backdrop-blur-xl shadow-2xl border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${sidebarWidthClass}
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
          <div className={`flex items-center gap-3 transition-all duration-300 ${!showExpandedSidebar && 'lg:justify-center lg:w-full'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
            {showExpandedSidebar && (
              <div className="overflow-hidden">
                <h1 className="text-sm font-semibold text-indigo-700 whitespace-nowrap">
                  {currentUser?.hospital_name || currentUser?.hospitalName || 'Hospital'}
                </h1>
                <p className="text-xs text-gray-500 whitespace-nowrap">Dashboard</p>
              </div>
            )}
          </div>
          
          {/* Mobile Close Button */}
          {isMobileSidebarOpen && (
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Desktop Toggle Button */}
        <div className="hidden lg:block absolute -right-3 top-20 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 flex items-center justify-center border-2 border-white"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8">
          {/* Main Navigation */}
          <div>
            {!showExpandedSidebar && <div className="h-2" />}
            {showExpandedSidebar && (
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main Menu
              </p>
            )}
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105' 
                        : 'text-gray-700 hover:bg-indigo-50 hover:scale-105 hover:text-indigo-600'
                      }
                      ${!showExpandedSidebar && 'justify-center'}
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'animate-pulse' : ''}`} />
                    {showExpandedSidebar && (
                      <span className="font-medium whitespace-nowrap">{item.title}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Communication */}
          <div>
            {showExpandedSidebar && (
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Communication
              </p>
            )}
            <div className="space-y-2">
              {communicationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105' 
                        : 'text-gray-700 hover:bg-indigo-50 hover:scale-105 hover:text-indigo-600'
                      }
                      ${!showExpandedSidebar && 'justify-center'}
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'animate-pulse' : ''}`} />
                    {showExpandedSidebar && (
                      <span className="font-medium whitespace-nowrap">{item.title}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings */}
          <div>
            {showExpandedSidebar && (
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Settings
              </p>
            )}
            <div className="space-y-2">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavClick(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105' 
                        : 'text-gray-700 hover:bg-indigo-50 hover:scale-105 hover:text-indigo-600'
                      }
                      ${!showExpandedSidebar && 'justify-center'}
                    `}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'animate-pulse' : ''}`} />
                    {showExpandedSidebar && (
                      <span className="font-medium whitespace-nowrap">{item.title}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gradient-to-br from-gray-50 to-white">
          <div className={`flex items-center gap-3 mb-3 ${!showExpandedSidebar && 'justify-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {(currentUser?.hospital_name || currentUser?.hospitalName || 'H').charAt(0)}
              </span>
            </div>
            {showExpandedSidebar && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {currentUser?.hospital_name || currentUser?.hospitalName || 'Hospital'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || 'admin@hospital.com'}
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-lg
              text-red-600 hover:text-red-700 hover:bg-red-50
              border border-red-200 hover:border-red-300
              transition-all duration-200 font-medium text-sm
              ${!showExpandedSidebar && 'justify-center'}
            `}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {showExpandedSidebar && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="sticky top-0 z-30 shadow-lg">
          <div className="backdrop-blur-lg bg-gradient-to-r from-sky-500/95 via-indigo-500/95 to-purple-500/95 text-white">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                {/* Beautiful Mobile Sidebar Toggle */}
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden group relative h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95 border border-white/20 shadow-lg flex items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Menu className="w-5 h-5 relative z-10" />
                </button>
                
                {/* Activity Icon */}
                <Link to="/dashboard" className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 shadow-inner hover:bg-white/25 transition-all duration-300 hover:scale-105">
                  <Activity className="h-6 w-6" />
                </Link>

                {/* Hospital Name - Only show hospital name from login */}
                <div>
                  <h1 className="text-lg sm:text-xl font-bold leading-tight">
                    {currentUser?.hospital_name || currentUser?.hospitalName || 'Hospital Dashboard'}
                  </h1>
                </div>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white shadow-lg text-lg font-bold border-2 border-white/30 transition-all duration-300 hover:scale-110 hover:bg-white/30">
                  {currentUser?.hospital_name?.charAt(0) || 'H'}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-white via-slate-100 to-slate-200">
          <Outlet />
        </div>
      </main>
    </div>
    <Toaster richColors position="top-right" />
    </>
  );
}
