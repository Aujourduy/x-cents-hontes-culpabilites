
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
    
    return [
      answer.questionId,
      `"${questionText.replace(/"/g, '""')}"`,
      `"${answer.text.replace(/"/g, '""')}"`,
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
    
    return rows.map(row => {
      // Handle quoted fields properly (basic implementation)
      const match = row.match(/^(\d+),"([^"]*)","([^"]*)",(.*)$/);
      if (!match) {
        throw new Error(`Invalid CSV row: ${row}`);
      }
      
      return {
        questionId: parseInt(match[1], 10),
        text: match[3].replace(/""/g, '"'),
        timestamp: match[4]
      };
    });
  } catch (e) {
    console.error("Failed to parse CSV:", e);
    return null;
  }
};
