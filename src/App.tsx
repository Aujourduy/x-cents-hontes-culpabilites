
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Answer } from "./types";
import { generateQuestions } from "./utils/questionGenerator";
import { loadAppState, clearAppState } from "./utils/storage";

import Index from "./pages/Index";
import ResponsesPage from "./pages/ResponsesPage";
import CompletionPage from "./pages/CompletionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const questions = generateQuestions();
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Load answers from localStorage
  useEffect(() => {
    const savedState = loadAppState();
    if (savedState) {
      setAnswers(savedState.answers);
    }
  }, []);

  // Handler for importing answers
  const handleImportAnswers = (importedAnswers: Answer[]) => {
    setAnswers(importedAnswers);
  };

  // Handler for clearing all answers
  const handleClearAnswers = () => {
    setAnswers([]);
    clearAppState();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-fireplace-gradient">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/responses" 
                element={
                  <ResponsesPage 
                    questions={questions} 
                    answers={answers}
                    onImport={handleImportAnswers}
                    onClear={handleClearAnswers}
                  />
                } 
              />
              <Route 
                path="/completion" 
                element={
                  <CompletionPage 
                    questions={questions}
                    answers={answers}
                  />
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
