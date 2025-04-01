
import { Question, FeelingType, PeriodType, DomainType } from "../types";

// Define our variable sets
const feelings: FeelingType[] = ["honte", "culpabilité"];
const periods: PeriodType[] = ["0-10 ans", "10-20 ans", "20-30 ans", "30-40 ans", "40-50 ans", "50 ans et plus"];
const domains: DomainType[] = [
  "spiritualité",
  "mental/psychologie",
  "professionnel",
  "financier",
  "social",
  "familial et couple",
  "santé et physique"
];

/**
 * Generates the question text based on the feeling, period, and domain
 */
const generateQuestionText = (feeling: FeelingType, period: PeriodType, domain: DomainType): string => {
  return `Dans quelle situation as-tu ressenti de la ${feeling} durant la période ${period} de ta vie, concernant le domaine ${domain} ?`;
};

/**
 * Generates all 84 questions (2 feelings × 6 periods × 7 domains)
 * Order: by feeling, then period, then domain
 */
export const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  let id = 0;

  for (const feeling of feelings) {
    for (const period of periods) {
      for (const domain of domains) {
        id++;
        questions.push({
          id,
          feeling,
          period,
          domain,
          text: generateQuestionText(feeling, period, domain)
        });
      }
    }
  }

  return questions;
};

/**
 * Returns the CSS class for highlighting based on the type of variable
 */
export const getHighlightClass = (
  type: "feeling" | "period" | "domain",
  value: FeelingType | PeriodType | DomainType
): string => {
  if (type === "feeling") {
    switch (value as FeelingType) {
      case "honte":
        return "highlight-shame";
      case "culpabilité":
        return "highlight-guilt";
      default:
        return "";
    }
  } else if (type === "period") {
    switch (value as PeriodType) {
      case "0-10 ans":
        return "highlight-period1";
      case "10-20 ans":
        return "highlight-period2";
      case "20-30 ans":
        return "highlight-period3";
      case "30-40 ans":
        return "highlight-period4";
      case "40-50 ans":
        return "highlight-period5";
      case "50 ans et plus":
        return "highlight-period6";
      default:
        return "";
    }
  } else if (type === "domain") {
    switch (value as DomainType) {
      case "spiritualité":
        return "highlight-domain1";
      case "mental/psychologie":
        return "highlight-domain2";
      case "professionnel":
        return "highlight-domain3";
      case "financier":
        return "highlight-domain4";
      case "social":
        return "highlight-domain5";
      case "familial et couple":
        return "highlight-domain6";
      case "santé et physique":
        return "highlight-domain7";
      default:
        return "";
    }
  }
  
  return "";
};
