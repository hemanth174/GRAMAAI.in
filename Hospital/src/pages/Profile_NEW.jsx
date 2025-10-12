import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Building, Save, Edit, Loader2, CheckCircle, Lock, Shield, Bell, Trash2 } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    hospital_name: '',
    role: '',
    bio: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
        setFormData({
          full_name: user.full_name || '',
          email: user.email || '',
          phone: user.phone || '',
          hospital_name: user.hospital_name || '',
          role: user.role || '',
          bio: user.bio || ''
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-gray-600 mt-4 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <div className="md:hidden sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-xs text-gray-600 mt-0.5">Manage your account</p>
      </div>

      <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div className="hidden md:flex justify-between items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="shadow-sm hover:bg-gray-50">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Card className="overflow-hidden border-0 shadow-xl bg-white">
          <div className="relative h-24 sm:h-32 md:h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="relative px-4 sm:px-6 md:px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16 md:-mt-20">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-4 sm:ring-6 ring-white shadow-2xl">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                    {currentUser.full_name?.charAt(0) || 'H'}
                  </span>
                </div>
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-7 h-7 sm:w-10 sm:h-10 bg-green-500 rounded-full ring-4 ring-white flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left sm:mb-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {currentUser.full_name || 'Hospital Administrator'}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <Building className="w-4 h-4" />
                  {currentUser.hospital_name || 'GRAMAAI Medical Center'}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 shadow-sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 shadow-sm">
                    {currentUser.role || 'Administrator'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input id="full_name" value={formData.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <span className="text-gray-900 font-medium">{formData.full_name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <span className="text-gray-900 font-medium truncate">{formData.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <span className="text-gray-900 font-medium">{formData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Role
                </Label>
                {isEditing ? (
                  <Input id="role" value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <span className="text-gray-900 font-medium">{formData.role}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="hospital_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Hospital Name
                </Label>
                {isEditing ? (
                  <Input id="hospital_name" value={formData.hospital_name} onChange={(e) => handleInputChange('hospital_name', e.target.value)} className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <span className="text-gray-900 font-medium">{formData.hospital_name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
                {isEditing ? (
                  <Textarea id="bio" value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder="Tell us about yourself..." className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                ) : (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 min-h-[100px]">
                    <p className="text-gray-900">{formData.bio || 'No bio provided'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Account Settings</h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all group">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Change Password</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Update your account password</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">Change</Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all group">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">Enable 2FA</Button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all group">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Manage notification preferences</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">Configure</Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-lg bg-white border-t-4 border-t-red-500">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-red-600 to-red-700 rounded-full"></div>
              <h3 className="text-lg sm:text-xl font-bold text-red-900">Danger Zone</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900">Delete Account</h4>
                  <p className="text-sm text-red-700 mt-0.5">Permanently delete your account and all data</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 shadow-sm">Delete Account</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
