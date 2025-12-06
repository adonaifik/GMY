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

export interface UserProfile {
  code: string;
  name: string;
  gender: string;
  email: string;
  registeredAt: string;
  bloodType: BloodType;
  rhFactor: RhFactor;
}

export type TabView = 'genetics' | 'quiz' | 'ai-consult' | 'register' | 'results';