export enum BloodType {
  A = 'A',
  B = 'B',
  AB = 'AB',
  O = 'O',
}

export enum RhFactor {
  Positive = '+',
  Negative = '-',
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    typePoints: { [key in BloodType]: number };
  }[];
}

export interface GeneticResult {
  possible: BloodType[];
  impossible: BloodType[];
}

export type TabView = 'genetics' | 'quiz' | 'ai-consult';
