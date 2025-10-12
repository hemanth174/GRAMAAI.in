
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
  BarChart2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Appointments",
    url: createPageUrl("Dashboard"),
    icon: Calendar,
  },
  {
    title: "Insights",
    url: createPageUrl("Insights"),
    icon: BarChart2,
  },
  {
    title: "Doctors",
    url: createPageUrl("DoctorManagement"),
    icon: Users,
  },
  {
    title: "Documents",
    url: createPageUrl("DocumentReview"),
    icon: FileText,
  },
];

const communicationItems = [
  {
    title: "Broadcast",
    url: createPageUrl("Broadcast"),
    icon: BellRing,
  },
];

const settingsItems = [
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: UserIcon,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (error) {
        console.error("Not authenticated", error);
        // Optionally handle unauthenticated state, e.g., redirect to login
      }
    };
    fetchUser();
  }, []);

  const NavMenu = ({ items }) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton 
            asChild 
            className={`mb-1 rounded-xl transition-all duration-200 ${
              location.pathname === item.url 
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-blue: #0066CC;
          --primary-blue-dark: #004C99;
          --success-green: #10B981;
          --warning-amber: #F59E0B;
          --danger-red: #DC2626;
          --bg-light: #F8FAFC;
          --bg-lighter: #F1F5F9;
          --text-dark: #1E293B;
          --text-medium: #475569;
          --border-light: #E2E8F0;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Sidebar className="border-r border-gray-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">{currentUser?.hospital_name || 'GRAMAAI'}</h2>
                <p className="text-xs text-gray-500">Hospital Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <NavMenu items={navigationItems} />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Communication
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <NavMenu items={communicationItems} />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Settings
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <NavMenu items={settingsItems} />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Pending</span>
                    <Badge className="bg-blue-600 text-white">0</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Confirmed</span>
                    <Badge className="bg-green-600 text-white">0</Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {currentUser?.hospital_name?.charAt(0) || 'H'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{currentUser?.full_name || 'Hospital Staff'}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.hospital_name || 'Staff Portal'}</p>
              </div>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors" />
              <h1 className="text-xl font-bold text-gray-900">{currentUser?.hospital_name || 'GRAMAAI'}</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
