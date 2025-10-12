import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const SkeletonLoader = ({ className }) => (
  <div className={`bg-gray-200 rounded-md animate-pulse ${className}`} />
);

export default function AppointmentDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <SkeletonLoader className="h-9 w-48 mb-4" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <SkeletonLoader className="h-8 w-64 mb-2" />
              <SkeletonLoader className="h-5 w-80" />
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <SkeletonLoader className="h-10 w-24" />
              <SkeletonLoader className="h-10 w-32" />
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Appointment Info Card */}
            <Card className="overflow-hidden">
              <CardHeader>
                <SkeletonLoader className="h-7 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <SkeletonLoader className="h-4 w-24" />
                    <SkeletonLoader className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLoader className="h-4 w-24" />
                    <SkeletonLoader className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLoader className="h-4 w-24" />
                    <SkeletonLoader className="h-6 w-full" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonLoader className="h-4 w-24" />
                    <SkeletonLoader className="h-6 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <SkeletonLoader className="h-4 w-24" />
                  <SkeletonLoader className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Staff Notes Card */}
            <Card>
              <CardHeader>
                <SkeletonLoader className="h-7 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <SkeletonLoader className="h-20 w-full" />
                <div className="flex justify-end">
                  <SkeletonLoader className="h-10 w-28" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Status & Actions Card */}
            <Card>
              <CardHeader>
                <SkeletonLoader className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <SkeletonLoader className="h-10 w-full" />
                <SkeletonLoader className="h-10 w-full" />
                <SkeletonLoader className="h-10 w-full" />
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card>
              <CardHeader>
                <SkeletonLoader className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <SkeletonLoader className="h-8 w-full" />
                <SkeletonLoader className="h-8 w-full" />
                <SkeletonLoader className="h-8 w-4/5" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
