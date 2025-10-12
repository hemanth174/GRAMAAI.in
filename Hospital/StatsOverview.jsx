
import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react";

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      title: "Total Appointments",
      value: stats.total,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "from-yellow-500 to-amber-500", // Changed to yellow
      bgColor: "bg-yellow-50",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Documents Requested",
      value: stats.documents_requested,
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-white/80 backdrop-blur-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className={`mt-4 h-2 rounded-full ${stat.bgColor}`}>
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                style={{ width: `${Math.min((stat.value / stats.total) * 100, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
