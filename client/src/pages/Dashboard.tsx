import React from 'react';
import { useUser } from '../context/UserContext.js';
import { Zap, BookOpen, Calendar, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const { user, courses, events } = useUser();

  const stats = [
    {
      label: 'Enrolled Courses',
      value: user?.enrolledCourses.length || 0,
      icon: <BookOpen className="text-[#469CA4]" />,
    },
    {
      label: 'Upcoming Events',
      value: events.length,
      icon: <Calendar className="text-[#469CA4]" />,
    },
    {
      label: 'Tasks Today',
      value: user?.plannerEntries.filter(p => {
        const today = new Date().toDateString();
        return new Date(p.createdAt || new Date()).toDateString() === today;
      }).length || 0,
      icon: <Zap className="text-[#469CA4]" />,
    },
    {
      label: 'Mood Check-ins',
      value: user?.emotionalCheckins.length || 0,
      icon: <TrendingUp className="text-[#469CA4]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#30506C] mb-2">Welcome back!</h1>
          <p className="text-[#263A47]">Here's your productivity overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#469CA4]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#263A47] text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#30506C] mt-2">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {user?.emotionalCheckins.slice(-5).reverse().map((checkin, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-[#EFE3DF]">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#469CA4] rounded-full"></div>
                    <div>
                      <p className="font-medium text-[#30506C]">Mood Check-in</p>
                      <p className="text-sm text-[#263A47]">
                        Feeling {checkin.checkinMood}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-[#263A47]">
                    {new Date(checkin.checkinDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {!user?.emotionalCheckins.length && (
                <p className="text-[#263A47] text-center py-4">No check-ins yet. Start tracking your mood!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4">Quick Links</h2>
            <div className="space-y-2">
              <a
                href="/productivity"
                className="block p-3 bg-[#D7E9ED] hover:bg-[#469CA4] hover:text-white rounded-lg transition"
              >
                <p className="font-medium text-[#30506C]">Productivity Tools</p>
                <p className="text-xs text-[#263A47] hover:text-white">Manage habits & tasks</p>
              </a>
              <a
                href="/courses"
                className="block p-3 bg-[#D7E9ED] hover:bg-[#469CA4] hover:text-white rounded-lg transition"
              >
                <p className="font-medium text-[#30506C]">Browse Courses</p>
                <p className="text-xs text-[#263A47] hover:text-white">Continue learning</p>
              </a>
              <a
                href="/events"
                className="block p-3 bg-[#D7E9ED] hover:bg-[#469CA4] hover:text-white rounded-lg transition"
              >
                <p className="font-medium text-[#30506C]">Upcoming Events</p>
                <p className="text-xs text-[#263A47] hover:text-white">Join the community</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
