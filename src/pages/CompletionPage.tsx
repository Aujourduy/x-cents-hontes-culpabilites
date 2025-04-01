
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToCSV } from '../utils/storage';
import { Question, Answer } from '../types';
import { Download, Home } from 'lucide-react';

interface CompletionPageProps {
  questions: Question[];
  answers: Answer[];
}

const CompletionPage: React.FC<CompletionPageProps> = ({ questions, answers }) => {
  const navigate = useNavigate();

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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="fireplace-container max-w-2xl w-full p-8 bg-white/70 rounded-xl shadow-lg">
        <div className="fireplace-glow"></div>
        
        <h1 className="text-3xl font-serif font-bold text-warmBrown mb-6 text-center">
          Félicitations !
        </h1>
        
        <p className="text-xl text-center mb-8">
          Vous avez complété les 84 questions d'introspection.
          Ce voyage personnel vous a permis d'explorer différentes dimensions de vos émotions
          à travers plusieurs périodes et domaines de votre vie.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button 
            onClick={handleExport}
            className="btn-warm flex items-center space-x-2 w-full sm:w-auto"
          >
            <Download className="w-5 h-5" />
            <span>Exporter vos réponses</span>
          </button>
          
          <button 
            onClick={() => navigate('/responses')}
            className="btn-warm bg-warmBrown hover:bg-warmBrown/80 flex items-center space-x-2 w-full sm:w-auto"
          >
            <span>Voir toutes vos réponses</span>
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center text-primary hover:underline"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Retour à l'accueil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionPage;
