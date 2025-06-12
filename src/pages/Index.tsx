
import React from 'react';
import { CompactDashboardLayout } from '@/components/layout/CompactDashboardLayout';

const Index = () => {
  return (
    <div className="bg-slate-800 relative">
      {/* Main content */}
      <main className="relative z-10">
        <CompactDashboardLayout />
      </main>
    </div>
  );
};

export default Index;
