
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubredditProvider } from "@/contexts/SubredditContext";
import { SubredditProvider2 } from "@/contexts/SubredditContext2";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create QueryClient outside of component to avoid context issues
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SubredditProvider>
        <SubredditProvider2>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SubredditProvider2>
      </SubredditProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
