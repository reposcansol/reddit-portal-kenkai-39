
import React from 'react';
import { CompactDashboardLayout } from '@/components/layout/CompactDashboardLayout';
import { HighlightControls } from '@/components/ui/HighlightControls';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/10 relative overflow-hidden">
      {/* Background texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065f46' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 border-b border-green-400/30 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-sm flex items-center justify-center">
                <span className="text-black font-bold text-sm font-mono">[A]</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-400 tracking-tight font-mono">
                  [AI_NEWS_TERMINAL]
                </h1>
                <p className="text-gray-400 text-xs font-mono">
                  &gt; monitoring_feeds...
                </p>
              </div>
            </div>
            <HighlightControls />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        <CompactDashboardLayout />
      </main>
    </div>
  );
};

export default Index;
