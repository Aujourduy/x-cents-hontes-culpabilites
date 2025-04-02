
import React, { useState, useRef, useEffect } from 'react';
import { Answer, Question } from '../types';
import { ArrowRight } from 'lucide-react';

interface AnswerFormProps {
  questionId: number;
  onSubmit: (answer: string) => void;
  onNext: () => void;
  answers: Answer[];
  onEditAnswer: (index: number, newText: string) => void;
  onInputChange?: (value: string) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  questionId,
  onSubmit,
  onNext,
  answers,
  onEditAnswer,
  onInputChange
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // When switching to edit mode, focus the input
  useEffect(() => {
    if (editIndex !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editIndex]);

  // Filter answers for the current question
  const currentAnswers = answers.filter(a => a.questionId === questionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    if (editIndex !== null) {
      // Update existing answer
      onEditAnswer(editIndex, inputValue);
      setEditIndex(null);
    } else {
      // Add new answer
      onSubmit(inputValue);
    }
    
    setInputValue('');
    if (onInputChange) onInputChange('');
  };

  const handleEdit = (index: number, text: string) => {
    setEditIndex(index);
    setInputValue(text);
    if (onInputChange) onInputChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onInputChange) onInputChange(newValue);
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputValueChange}
            onKeyDown={handleKeyDown}
            placeholder="Votre réponse ici..."
            className="input-warm w-full h-32"
            required
          />
          <div className="text-xs text-muted-foreground mt-1 italic">
            Appuyez sur <span className="font-medium">Entrée</span> pour enregistrer, <span className="font-medium">Maj+Entrée</span> pour aller à la ligne
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="btn-warm flex items-center justify-center"
          >
            {editIndex !== null ? 'Mettre à jour' : 'Enregistrer la réponse'}
          </button>
          
          <button 
            type="button" 
            onClick={onNext}
            className="btn-warm bg-warmBrown hover:bg-warmBrown/80 flex items-center space-x-2"
          >
            <span>Question suivante</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {currentAnswers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-serif mb-4">
            Vos réponses ({currentAnswers.length})
          </h3>
          <div className="space-y-4">
            {currentAnswers.map((answer, index) => (
              <div 
                key={index} 
                className="p-4 bg-white/60 rounded-lg shadow-sm border border-warmBrown/20"
              >
                <p className="text-warmBrown whitespace-pre-line">{answer.text}</p>
                <div className="flex justify-between items-center mt-2">
                  <small className="text-muted-foreground">{new Date(answer.timestamp).toLocaleString()}</small>
                  <button
                    onClick={() => handleEdit(index, answer.text)}
                    className="text-sm text-primary hover:underline"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerForm;
