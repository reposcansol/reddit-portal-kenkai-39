
import React from 'react';
import { SourceNavigator } from './SourceNavigator';
import { RefreshButton } from '@/components/ui/RefreshButton';

export const CompactDashboardLayout = () => {
  return (
    <div className="h-screen bg-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-700 bg-slate-800">
        <div className="w-full px-6 py-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  rScope
                </h1>
                <p className="text-slate-400 text-sm">
                  The Leading Reddit Monitoring Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Features</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Live Feeds</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
              </nav>
              <RefreshButton />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Start Tracking →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-shrink-0 bg-slate-800 py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Leading Reddit
            <br />
            <span className="text-orange-500">Monitoring Platform</span>
          </h2>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            Track trending posts, monitor subreddit activity, and analyze community engagement
            <br />
            with real-time data feeds and intelligent filtering.
          </p>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors">
            View Live Demo →
          </button>
        </div>
      </div>

      {/* Source Navigator with Content - takes remaining height */}
      <div className="flex-1 overflow-hidden">
        <SourceNavigator />
      </div>
    </div>
  );
};
