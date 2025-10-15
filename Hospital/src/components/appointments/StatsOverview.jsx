import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      title: "Total Appointments",
      value: stats.total,
      icon: Calendar,
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-200",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "from-yellow-500 to-amber-400",
      shadow: "shadow-yellow-200",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-400",
      shadow: "shadow-green-200",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "from-rose-500 to-pink-400",
      shadow: "shadow-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card 
          key={index} 
          className="bg-white/70 backdrop-blur-sm border-gray-200/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5"
        >
          <div className="p-5">
            <div className="flex justify-between items-center">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
