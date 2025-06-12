
import React from 'react';
import { CompactDashboardLayout } from '@/components/layout/CompactDashboardLayout';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-800 relative overflow-hidden">
      {/* Main content */}
      <main className="relative z-10">
        <CompactDashboardLayout />
      </main>
    </div>
  );
};

export default Index;
