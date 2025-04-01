
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
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
    // Create a map of existing answers by question ID to prevent duplicates
    const existingAnswersMap = new Map();
    
    // Group existing answers by questionId
    answers.forEach(answer => {
      if (!existingAnswersMap.has(answer.questionId)) {
        existingAnswersMap.set(answer.questionId, []);
      }
      existingAnswersMap.get(answer.questionId).push(answer);
    });
    
    // Filter out imported answers that already exist (based on questionId and text)
    const newAnswers = importedAnswers.filter(imported => {
      const existingForThisQuestion = existingAnswersMap.get(imported.questionId) || [];
      return !existingForThisQuestion.some(existing => 
        existing.text.trim() === imported.text.trim()
      );
    });
    
    // Combine existing answers with new ones
    const combinedAnswers = [...answers, ...newAnswers];
    
    // Update state with combined answers
    setAnswers(combinedAnswers);
    
    // Find the highest question ID that has been answered
    const maxQuestionId = Math.max(...combinedAnswers.map(a => a.questionId), 0);
    
    // Find the index of the next question to answer
    const nextQuestionIndex = questions.findIndex(q => q.id > maxQuestionId);
    
    // If we found a next question, set the index to that, otherwise set to the highest answered + 1
    if (nextQuestionIndex !== -1) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Get the index of the max question ID
      const maxQuestionIndex = questions.findIndex(q => q.id === maxQuestionId);
      // If it's not the last question, go to the next one
      if (maxQuestionIndex !== -1 && maxQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(maxQuestionIndex + 1);
      } else {
        // Otherwise, stay at the last question
        setCurrentQuestionIndex(questions.length - 1);
      }
    }
    
    console.log('ImportedAnswers:', importedAnswers);
    console.log('Combined answers after import:', combinedAnswers);
    console.log('Next question index:', nextQuestionIndex !== -1 ? nextQuestionIndex : 'not found');
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
        <HashRouter>
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
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
