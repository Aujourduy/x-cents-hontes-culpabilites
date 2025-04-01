
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Answer } from "./types";
import { generateQuestions } from "./utils/questionGenerator";
import { loadAppState, clearAppState, saveAppState } from "./utils/storage";

import Index from "./pages/Index";
import ResponsesPage from "./pages/ResponsesPage";
import CompletionPage from "./pages/CompletionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const questions = generateQuestions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timerDuration, setTimerDuration] = useState(60);

  // Load answers from localStorage on initial render
  useEffect(() => {
    const savedState = loadAppState();
    if (savedState) {
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setAnswers(savedState.answers);
      setTimerDuration(savedState.timerDuration || 60);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveAppState({
      currentQuestionIndex,
      answers,
      timerDuration
    });
  }, [currentQuestionIndex, answers, timerDuration]);

  // Handler for moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered
    }
  };

  // Handler for adding a new answer
  const handleAddAnswer = (answer: Answer) => {
    setAnswers(prev => [...prev, answer]);
  };

  // Handler for editing an existing answer
  const handleEditAnswer = (index: number, newText: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = {
        ...newAnswers[index],
        text: newText,
        timestamp: new Date().toISOString()
      };
      return newAnswers;
    });
  };

  // Handler for importing answers
  const handleImportAnswers = (importedAnswers: Answer[]) => {
    setAnswers(importedAnswers);
    
    // Find the highest question ID that has been answered
    const maxQuestionId = Math.max(...importedAnswers.map(a => a.questionId), 0);
    
    // Find the index in our questions array
    const newIndex = questions.findIndex(q => q.id === maxQuestionId);
    setCurrentQuestionIndex(newIndex !== -1 ? newIndex : 0);
  };

  // Handler for clearing all answers
  const handleClearAnswers = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
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
              <Route 
                path="/" 
                element={
                  <Index 
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    setCurrentQuestionIndex={setCurrentQuestionIndex}
                    answers={answers}
                    setAnswers={setAnswers}
                    timerDuration={timerDuration}
                    setTimerDuration={setTimerDuration}
                    onAnswerAdd={handleAddAnswer}
                    onAnswerEdit={handleEditAnswer}
                    onNextQuestion={handleNextQuestion}
                  />
                } 
              />
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
