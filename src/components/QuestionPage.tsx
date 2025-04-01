
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question as QuestionType, Answer } from '../types';
import Question from './Question';
import Timer from './Timer';
import AnswerForm from './AnswerForm';
import { saveAppState } from '../utils/storage';
import { toast } from '@/hooks/use-toast';

interface QuestionPageProps {
  questions: QuestionType[];
  currentQuestionIndex: number;
  answers: Answer[];
  timerDuration: number;
  onTimerDurationChange: (duration: number) => void;
  onNext: () => void;
  onAnswerAdd: (answer: Answer) => void;
  onAnswerEdit: (index: number, newText: string) => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  timerDuration,
  onTimerDurationChange,
  onNext,
  onAnswerAdd,
  onAnswerEdit
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];

  // Reset timer when moving to a new question
  useEffect(() => {
    setTimerKey(prev => prev + 1);
  }, [currentQuestionIndex]);

  // Save state to localStorage whenever something changes
  useEffect(() => {
    saveAppState({
      currentQuestionIndex,
      answers,
      timerDuration
    });
  }, [currentQuestionIndex, answers, timerDuration]);

  const handleAddAnswer = (text: string) => {
    const answer: Answer = {
      questionId: currentQuestion.id,
      text: text,
      timestamp: new Date().toISOString()
    };
    
    onAnswerAdd(answer);
    
    // Reset timer after adding an answer
    setTimerKey(prev => prev + 1);
    
    toast({
      title: "Réponse enregistrée",
      description: "Votre réponse a été enregistrée avec succès",
    });
  };

  const handleEditAnswer = (index: number, newText: string) => {
    onAnswerEdit(index, newText);
    
    toast({
      title: "Réponse modifiée",
      description: "Votre réponse a été mise à jour avec succès",
    });
  };

  const handleTimeoutCompleted = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      onNext();
    } else {
      // All questions answered
      navigate('/responses');
    }
  }, [currentQuestionIndex, questions.length, onNext, navigate]);

  // Show completion message when all questions are answered
  useEffect(() => {
    if (currentQuestionIndex === questions.length - 1) {
      const questionAnswers = answers.filter(a => a.questionId === currentQuestion.id);
      if (questionAnswers.length > 0) {
        toast({
          title: "Félicitations !",
          description: "Vous avez complété toutes les questions. Vous pouvez maintenant voir vos réponses.",
          action: (
            <button 
              onClick={() => navigate('/responses')}
              className="bg-ember text-white px-3 py-1 rounded-md text-sm"
            >
              Voir mes réponses
            </button>
          ),
        });
      }
    }
  }, [currentQuestionIndex, questions.length, answers, currentQuestion, navigate]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-warmBrown">
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm flex items-center">
              <span>Durée du timer:</span>
              <select 
                value={timerDuration}
                onChange={(e) => onTimerDurationChange(Number(e.target.value))}
                className="ml-2 bg-cream border border-warmBrown/30 rounded px-2 py-1 text-sm"
              >
                <option value={30}>30s</option>
                <option value={60}>60s</option>
                <option value={90}>90s</option>
                <option value={120}>120s</option>
              </select>
            </label>
            
            <button
              onClick={() => navigate('/responses')}
              className="text-sm text-primary hover:underline"
            >
              Voir toutes les réponses
            </button>
          </div>
        </div>
        
        <Timer 
          key={timerKey}
          duration={timerDuration} 
          onTimeout={handleTimeoutCompleted} 
          isPaused={isPaused}
          onReset={() => {}}
        />

        <div className="fireplace-container">
          <div className="fireplace-glow"></div>
          <Question question={currentQuestion} />
        </div>
      </div>

      <AnswerForm 
        questionId={currentQuestion.id}
        onSubmit={handleAddAnswer}
        onNext={handleTimeoutCompleted}
        answers={answers}
        onEditAnswer={handleEditAnswer}
      />
    </div>
  );
};

export default QuestionPage;
