
import React from 'react';
import { useHackerNews } from '@/hooks/useHackerNews';
import { useReddit } from '@/hooks/useReddit';
import { useAIFilter } from '@/hooks/useAIFilter';
import { ContentColumn } from './ContentColumn';
import { HackerNewsCard } from '@/components/news/HackerNewsCard';
import { RedditCard } from '@/components/news/RedditCard';
import { Loader2, Zap, MessageSquare } from 'lucide-react';

export const DashboardLayout = () => {
  const { data: hackerNewsData, isLoading: hnLoading, error: hnError } = useHackerNews();
  const { data: redditData, isLoading: redditLoading, error: redditError } = useReddit();
  
  const filteredHN = useAIFilter(hackerNewsData || []);
  const filteredReddit = useAIFilter(redditData || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/20 relative overflow-hidden">
      {/* Background texture overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065f46' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                AI News Portal
              </h1>
              <p className="text-slate-400 text-sm">
                Curated intelligence from across the web
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Hacker News Column */}
          <ContentColumn
            title="Hacker News"
            icon={<Zap className="w-5 h-5" />}
            isLoading={hnLoading}
            error={hnError?.message}
            count={filteredHN.length}
          >
            {filteredHN.map((post, index) => (
              <HackerNewsCard 
                key={post.id} 
                post={post} 
                index={index}
              />
            ))}
          </ContentColumn>

          {/* Reddit Column */}
          <ContentColumn
            title="Reddit AI Communities"
            icon={<MessageSquare className="w-5 h-5" />}
            isLoading={redditLoading}
            error={redditError?.message}
            count={filteredReddit.length}
          >
            {filteredReddit.map((post, index) => (
              <RedditCard 
                key={post.id} 
                post={post} 
                index={index}
              />
            ))}
          </ContentColumn>
        </div>
      </main>
    </div>
  );
};
