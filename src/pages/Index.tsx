
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Answer } from '../types';
import { generateQuestions } from '../utils/questionGenerator';
import { loadAppState, saveAppState, clearAppState } from '../utils/storage';
import QuestionPage from '../components/QuestionPage';

const Index = () => {
  const questions = generateQuestions();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timerDuration, setTimerDuration] = useState(60);

  // Load saved state on initial render
  useEffect(() => {
    const savedState = loadAppState();
    if (savedState) {
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setAnswers(savedState.answers);
      setTimerDuration(savedState.timerDuration);
    }
  }, []);

  // Handler for moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      navigate('/completion');
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
    
    // Save the imported state
    saveAppState({
      currentQuestionIndex: newIndex !== -1 ? newIndex : 0,
      answers: importedAnswers,
      timerDuration
    });
  };

  // Handler for clearing all answers
  const handleClearAnswers = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    clearAppState();
  };

  return (
    <QuestionPage
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      answers={answers}
      timerDuration={timerDuration}
      onTimerDurationChange={setTimerDuration}
      onNext={handleNextQuestion}
      onAnswerAdd={handleAddAnswer}
      onAnswerEdit={handleEditAnswer}
    />
  );
};

export default Index;
