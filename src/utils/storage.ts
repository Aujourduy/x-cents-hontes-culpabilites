
import { Answer, AppState } from "../types";

const APP_STATE_KEY = "introspectionAppState";

export const saveAppState = (state: AppState): void => {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
};

export const loadAppState = (): AppState | null => {
  const saved = localStorage.getItem(APP_STATE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as AppState;
    } catch (e) {
      console.error("Failed to parse saved app state:", e);
      return null;
    }
  }
  return null;
};

export const clearAppState = (): void => {
  localStorage.removeItem(APP_STATE_KEY);
};

// CSV export/import functions
export const exportToCSV = (answers: Answer[], questions: any[]): string => {
  // Create header row
  const headers = ["Question ID", "Question", "Answer", "Timestamp"];
  
  // Map each answer to a CSV row
  const rows = answers.map(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    const questionText = question ? question.text : "Unknown question";
    
    // Double escape quotes in both question and answer text
    const escapedQuestionText = questionText.replace(/"/g, '""');
    const escapedAnswerText = answer.text.replace(/"/g, '""');
    
    return [
      answer.questionId,
      `"${escapedQuestionText}"`,
      `"${escapedAnswerText}"`,
      answer.timestamp
    ].join(',');
  });
  
  // Join all together
  return [headers.join(','), ...rows].join('\n');
};

export const importFromCSV = (csvContent: string): Answer[] | null => {
  try {
    // Skip header row
    const rows = csvContent.split('\n').slice(1);
    const answers: Answer[] = [];
    
    for (const row of rows) {
      if (!row.trim()) continue; // Skip empty rows
      
      // Handle CSV parsing more robustly with regex pattern matching
      // This regex looks for: questionId,"question text","answer text",timestamp
      const regex = /^(\d+),"([^"]*)","([^"]*)",(.*)$/;
      const match = row.match(regex);
      
      if (match) {
        answers.push({
          questionId: parseInt(match[1], 10),
          text: match[3].replace(/""/g, '"'),
          timestamp: match[4]
        });
      } else {
        console.error(`Skipping invalid CSV row: ${row}`);
      }
    }
    
    return answers.length > 0 ? answers : null;
  } catch (e) {
    console.error("Failed to parse CSV:", e);
    return null;
  }
};
