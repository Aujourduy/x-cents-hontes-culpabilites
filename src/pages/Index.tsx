
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Answer } from '../types';
import { generateQuestions } from '../utils/questionGenerator';
import QuestionPage from '../components/QuestionPage';

interface IndexProps {
  questions: ReturnType<typeof generateQuestions>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
  timerDuration: number;
  setTimerDuration: React.Dispatch<React.SetStateAction<number>>;
  onAnswerAdd: (answer: Answer) => void;
  onAnswerEdit: (index: number, newText: string) => void;
  onNextQuestion: () => void;
}

const Index: React.FC<IndexProps> = ({
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answers,
  timerDuration,
  setTimerDuration,
  onAnswerAdd,
  onAnswerEdit,
  onNextQuestion
}) => {
  const navigate = useNavigate();

  // Handler for moving to the next question
  const handleNextQuestion = () => {
    onNextQuestion();
  };

  // Handler for adding a new answer
  const handleAddAnswer = (answer: Answer) => {
    onAnswerAdd(answer);
  };

  // Handler for editing an existing answer
  const handleEditAnswer = (index: number, newText: string) => {
    onAnswerEdit(index, newText);
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
