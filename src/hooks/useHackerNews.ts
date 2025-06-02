
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface HackerNewsPost {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
}

// Enhanced negative keywords to filter out questions and non-tech content
const NEGATIVE_KEYWORDS = [
  'help',
  'how do you',
  'how to',
  'can someone',
  'need help',
  'please help',
  'question',
  'eli5',
  'explain like',
  'what is',
  'why is',
  'where is',
  'when is',
  'which is',
  'ask hn',
  'show hn: help',
  'looking for',
  'recommendations',
  'advice',
  'should i',
  'anyone know',
  'does anyone',
  'has anyone',
  'thoughts on',
  'opinions on',
  'what do you think',
  'am i the only one',
  'is it just me'
];

// Tech-focused positive keywords to boost relevance
const TECH_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
  'programming', 'software', 'developer', 'coding', 'code',
  'startup', 'tech', 'technology', 'algorithm', 'data',
  'web', 'app', 'application', 'platform', 'framework',
  'open source', 'github', 'api', 'database', 'cloud',
  'security', 'blockchain', 'cryptocurrency', 'crypto',
  'mobile', 'ios', 'android', 'react', 'javascript',
  'python', 'rust', 'go', 'java', 'typescript',
  'devops', 'infrastructure', 'server', 'backend',
  'frontend', 'ui', 'ux', 'design', 'product',
  'saas', 'b2b', 'venture capital', 'funding', 'ipo',
  'innovation', 'disruption', 'digital', 'internet'
];

// Known tech domains to prioritize
const TECH_DOMAINS = [
  'github.com', 'stackoverflow.com', 'techcrunch.com', 'wired.com',
  'arstechnica.com', 'theverge.com', 'engadget.com', 'venturebeat.com',
  'recode.net', 'medium.com', 'dev.to', 'hackernoon.com',
  'blogs.microsoft.com', 'blog.google', 'engineering.fb.com',
  'blog.twitter.com', 'aws.amazon.com', 'blog.cloudflare.com',
  'research.google.com', 'openai.com', 'anthropic.com'
];

const containsNegativeKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return NEGATIVE_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

const containsQuestionMark = (text: string): boolean => {
  return text.includes('?');
};

const isAskOrHelpPost = (title: string): boolean => {
  const lowerTitle = title.toLowerCase();
  return lowerTitle.startsWith('ask hn') || 
         (lowerTitle.startsWith('show hn') && lowerTitle.includes('help'));
};

const calculateTechRelevance = (post: HackerNewsPost): number => {
  let score = 0;
  const titleLower = post.title.toLowerCase();
  
  // Boost for tech keywords in title
  TECH_KEYWORDS.forEach(keyword => {
    if (titleLower.includes(keyword)) {
      score += 1;
    }
  });
  
  // Boost for having external URL (actual articles vs discussions)
  if (post.url && !post.url.includes('news.ycombinator.com')) {
    score += 2;
  }
  
  // Boost for known tech domains
  if (post.url) {
    const domain = new URL(post.url).hostname.toLowerCase();
    if (TECH_DOMAINS.some(techDomain => domain.includes(techDomain))) {
      score += 3;
    }
  }
  
  // Penalty for discussion-heavy posts without URLs
  if (!post.url) {
    score -= 1;
  }
  
  return score;
};

const fetchHackerNewsStories = async (): Promise<HackerNewsPost[]> => {
  try {
    // Fetch top stories IDs (HackerNews provides up to 500 top stories)
    const topStoriesResponse = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    
    const storyIds = topStoriesResponse.data;
    console.log(`HN: Fetching ${storyIds.length} top stories from HackerNews`);
    
    // Fetch individual stories in batches to avoid overwhelming the API
    const batchSize = 50;
    const allStories = [];
    
    for (let i = 0; i < storyIds.length; i += batchSize) {
      const batch = storyIds.slice(i, i + batchSize);
      const storyPromises = batch.map(async (id: number) => {
        const storyResponse = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return storyResponse.data;
      });
      
      const batchStories = await Promise.all(storyPromises);
      allStories.push(...batchStories);
      
      console.log(`HN: Fetched batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(storyIds.length / batchSize)}`);
    }
    
    // Enhanced filtering for tech content only
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
    
    const filteredStories = allStories.filter(story => {
      if (!story || !story.title) return false;
      
      const isRecent = story.time >= twentyFourHoursAgo;
      const hasMinUpvotes = (story.score || 0) >= 1;
      const hasNegativeKeywords = containsNegativeKeywords(story.title);
      const hasQuestionMark = containsQuestionMark(story.title);
      const isAskOrHelp = isAskOrHelpPost(story.title);
      const techRelevance = calculateTechRelevance(story);
      
      // Require minimum tech relevance score
      const hasTechRelevance = techRelevance >= 1;
      
      const included = isRecent && hasMinUpvotes && !hasNegativeKeywords && 
                      !hasQuestionMark && !isAskOrHelp && hasTechRelevance;
      
      if (!included) {
        const reason = !isRecent ? 'too old' : 
                      !hasMinUpvotes ? 'insufficient upvotes' : 
                      hasNegativeKeywords ? 'contains negative keywords' : 
                      hasQuestionMark ? 'contains question mark' :
                      isAskOrHelp ? 'ask/help post' :
                      !hasTechRelevance ? 'low tech relevance' : 'unknown';
        console.log(`HN: Filtered out "${story.title.substring(0, 50)}..." - ${reason} (tech score: ${techRelevance})`);
      }
      
      return included;
    });
    
    console.log(`HN: Filtered ${filteredStories.length} tech-focused stories from last 24 hours out of ${allStories.length} total stories`);
    
    // Sort by a combination of score and tech relevance
    return filteredStories.sort((a, b) => {
      const aRelevance = calculateTechRelevance(a);
      const bRelevance = calculateTechRelevance(b);
      
      // If relevance scores are different, prioritize higher relevance
      if (aRelevance !== bRelevance) {
        return bRelevance - aRelevance;
      }
      
      // If relevance is the same, sort by score
      return (b.score || 0) - (a.score || 0);
    });
  } catch (error) {
    console.error('Error fetching Hacker News stories:', error);
    throw new Error('Failed to fetch Hacker News stories');
  }
};

export const useHackerNews = () => {
  return useQuery({
    queryKey: ['hackerNews'],
    queryFn: fetchHackerNewsStories,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
};
