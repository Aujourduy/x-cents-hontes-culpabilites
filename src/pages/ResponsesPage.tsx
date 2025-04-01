
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, Answer } from '../types';
import { exportToCSV, importFromCSV } from '../utils/storage';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Upload, Trash2 } from 'lucide-react';

interface ResponsesPageProps {
  questions: Question[];
  answers: Answer[];
  onImport: (answers: Answer[]) => void;
  onClear: () => void;
}

const ResponsesPage: React.FC<ResponsesPageProps> = ({ 
  questions, 
  answers, 
  onImport, 
  onClear 
}) => {
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Group answers by question
  const answersByQuestion = questions.map(question => {
    return {
      question,
      answers: answers.filter(a => a.questionId === question.id)
    };
  }).filter(group => group.answers.length > 0);

  const totalAnswers = answers.length;

  const handleExport = () => {
    const csv = exportToCSV(answers, questions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `introspection_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Vos réponses ont été exportées au format CSV",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const importedAnswers = importFromCSV(content);
      
      if (importedAnswers) {
        onImport(importedAnswers);
        toast({
          title: "Import réussi",
          description: `${importedAnswers.length} réponses ont été importées`,
        });
      } else {
        toast({
          title: "Erreur d'import",
          description: "Le fichier CSV n'est pas valide",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer toutes les réponses ? Cette action est irréversible.")) {
      onClear();
      toast({
        title: "Réponses effacées",
        description: "Toutes vos réponses ont été supprimées",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-warmBrown hover:text-ember transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux questions</span>
        </button>
        
        <div className="text-lg font-medium">
          {totalAnswers} réponses au total
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={handleExport}
            className="btn-warm flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
          
          <label className="btn-warm bg-warmBrown hover:bg-warmBrown/80 flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Importer CSV</span>
            <input 
              type="file"
              accept=".csv"
              onChange={handleImport} 
              className="hidden"
            />
          </label>
          
          <button 
            onClick={handleClear}
            className="btn-warm bg-destructive hover:bg-destructive/80 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Effacer tout</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {answersByQuestion.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-warmBrown mb-4">Aucune réponse pour le moment</p>
            <button 
              onClick={() => navigate('/')}
              className="btn-warm"
            >
              Commencer à répondre
            </button>
          </div>
        ) : (
          answersByQuestion.map(({ question, answers }) => (
            <div key={question.id} className="bg-white/70 rounded-lg shadow-md p-6 transition-all">
              <div 
                onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="text-lg font-medium">
                  Question {question.id}: {question.text}
                </h3>
                <div className="text-warmBrown font-medium bg-cream rounded-full px-3 py-1">
                  {answers.length} réponse{answers.length > 1 ? 's' : ''}
                </div>
              </div>
              
              {expandedQuestion === question.id && (
                <div className="mt-4 space-y-3">
                  {answers.map((answer, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-cream/50 rounded border border-warmBrown/10"
                    >
                      <p className="text-warmBrown">{answer.text}</p>
                      <div className="text-right mt-2">
                        <small className="text-muted-foreground">
                          {new Date(answer.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResponsesPage;
