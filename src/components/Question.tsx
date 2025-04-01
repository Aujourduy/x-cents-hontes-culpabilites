
import React from 'react';
import { Question as QuestionType } from '../types';
import { getHighlightClass } from '../utils/questionGenerator';

interface QuestionProps {
  question: QuestionType;
}

const Question: React.FC<QuestionProps> = ({ question }) => {
  // Get the highlight classes for each variable
  const feelingClass = getHighlightClass("feeling", question.feeling);
  const periodClass = getHighlightClass("period", question.period);
  const domainClass = getHighlightClass("domain", question.domain);

  // Create highlighted question text
  const renderHighlightedText = () => {
    const text = question.text;
    const parts = [];

    // Check for "honte" or "culpabilité"
    const feelingMatch = text.match(new RegExp(`(${question.feeling})`, 'i'));
    
    // Check for period
    const periodMatch = text.match(new RegExp(`(${question.period.replace(/[()]/g, '\\$&')})`, 'i'));
    
    // Check for domain
    const domainMatch = text.match(new RegExp(`(${question.domain})`, 'i'));

    if (!feelingMatch || !periodMatch || !domainMatch) {
      return text; // Fallback if regex doesn't match
    }

    let lastIndex = 0;

    // Process feeling
    parts.push(text.substring(lastIndex, feelingMatch.index));
    parts.push(
      <span key="feeling" className={feelingClass}>
        {feelingMatch[0]}
      </span>
    );
    lastIndex = feelingMatch.index + feelingMatch[0].length;

    // Process period
    parts.push(text.substring(lastIndex, periodMatch.index));
    parts.push(
      <span key="period" className={periodClass}>
        {periodMatch[0]}
      </span>
    );
    lastIndex = periodMatch.index + periodMatch[0].length;

    // Process domain
    parts.push(text.substring(lastIndex, domainMatch.index));
    parts.push(
      <span key="domain" className={domainClass}>
        {domainMatch[0]}
      </span>
    );
    lastIndex = domainMatch.index + domainMatch[0].length;

    // Add remaining text
    parts.push(text.substring(lastIndex));

    return parts;
  };

  return (
    <div className="p-6 bg-cream rounded-lg shadow-md bg-opacity-70">
      <h2 className="text-2xl font-serif mb-4">Question {question.id}</h2>
      <p className="text-xl leading-relaxed">{renderHighlightedText()}</p>
    </div>
  );
};

export default Question;
