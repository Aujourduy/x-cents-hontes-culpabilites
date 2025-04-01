
export type FeelingType = "honte" | "culpabilité";
export type PeriodType = "0-10 ans" | "10-20 ans" | "20-30 ans" | "30-40 ans" | "40-50 ans" | "50 ans et plus";
export type DomainType = "spiritualité" | "mental/psychologie" | "professionnel" | "financier" | "social" | "familial et couple" | "santé et physique";

export interface Question {
  id: number;
  feeling: FeelingType;
  period: PeriodType;
  domain: DomainType;
  text: string;
}

export interface Answer {
  questionId: number;
  text: string;
  timestamp: string;
}

export interface AnswerGroup {
  question: Question;
  answers: Answer[];
}

export interface AppState {
  currentQuestionIndex: number;
  answers: Answer[];
  timerDuration: number;
}
