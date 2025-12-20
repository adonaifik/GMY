import { BloodType, GeneticResult } from '../types';

export const calculateChildBloodTypes = (parent1: BloodType, parent2: BloodType): GeneticResult => {
    const p1 = parent1;
    const p2 = parent2;
    const allTypes = [BloodType.A, BloodType.B, BloodType.AB, BloodType.O];
    let possible: BloodType[] = [];

    if (p1 === BloodType.O && p2 === BloodType.O) possible = [BloodType.O];
    else if ((p1 === BloodType.A && p2 === BloodType.O) || (p1 === BloodType.O && p2 === BloodType.A)) possible = [BloodType.A, BloodType.O];
    else if ((p1 === BloodType.B && p2 === BloodType.O) || (p1 === BloodType.O && p2 === BloodType.B)) possible = [BloodType.B, BloodType.O];
    else if (p1 === BloodType.A && p2 === BloodType.A) possible = [BloodType.A, BloodType.O];
    else if (p1 === BloodType.B && p2 === BloodType.B) possible = [BloodType.B, BloodType.O];
    else if ((p1 === BloodType.A && p2 === BloodType.B) || (p1 === BloodType.B && p2 === BloodType.A)) possible = [BloodType.A, BloodType.B, BloodType.AB, BloodType.O];
    else if ((p1 === BloodType.AB && p2 === BloodType.O) || (p1 === BloodType.O && p2 === BloodType.AB)) possible = [BloodType.A, BloodType.B];
    else if ((p1 === BloodType.AB && p2 === BloodType.A) || (p1 === BloodType.A && p2 === BloodType.AB)) possible = [BloodType.A, BloodType.B, BloodType.AB];
    else if ((p1 === BloodType.AB && p2 === BloodType.B) || (p1 === BloodType.B && p2 === BloodType.AB)) possible = [BloodType.A, BloodType.B, BloodType.AB];
    else if (p1 === BloodType.AB && p2 === BloodType.AB) possible = [BloodType.A, BloodType.B, BloodType.AB];

    const impossible = allTypes.filter(t => !possible.includes(t));
    return { possible, impossible };
};

export const quizQuestions = [
    {
        id: 1,
        question: "How do you handle a tight deadline?",
        options: [
            { text: "I plan everything meticulously in advance.", typePoints: { A: 3, B: 0, AB: 1, O: 1 } },
            { text: "I focus intensely at the last minute.", typePoints: { A: 0, B: 3, AB: 1, O: 1 } },
            { text: "I try to negotiate the deadline.", typePoints: { A: 1, B: 1, AB: 3, O: 0 } },
            { text: "I rally the team to help me.", typePoints: { A: 1, B: 0, AB: 0, O: 3 } }
        ]
    },
    {
        id: 2,
        question: "What's your role in a group of friends?",
        options: [
            { text: "The listener and mediator.", typePoints: { A: 3, B: 0, AB: 2, O: 1 } },
            { text: "The creative idea generator.", typePoints: { A: 0, B: 3, AB: 1, O: 0 } },
            { text: "The mysterious or quirky one.", typePoints: { A: 0, B: 1, AB: 3, O: 0 } },
            { text: "The leader and organizer.", typePoints: { A: 1, B: 1, AB: 0, O: 3 } }
        ]
    },
     {
        id: 3,
        question: "Choose a vacation style:",
        options: [
            { text: "A quiet cabin with books.", typePoints: { A: 3, B: 0, AB: 1, O: 0 } },
            { text: "A spontaneous road trip.", typePoints: { A: 0, B: 3, AB: 0, O: 1 } },
            { text: "A cultural city tour with art museums.", typePoints: { A: 1, B: 1, AB: 3, O: 0 } },
            { text: "A competitive sports camp.", typePoints: { A: 0, B: 1, AB: 0, O: 3 } }
        ]
    }
];

export const codeSnippets = [
    {
        language: 'SQL',
        title: 'Supabase Table Setup',
        code: `CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  gender text NOT NULL,
  email text NOT NULL,
  blood_type text NOT NULL,
  rh_factor text NOT NULL,
  registered_at text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS and add public access policy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON users FOR ALL USING (true);`,
        description: "Run this in your Supabase SQL Editor to create the required table and permissions."
    },
    {
        language: 'python',
        title: 'Blood Type Compatibility Check',
        code: `def check_compatibility(donor, recipient):
    compatibility = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    }
    return recipient in compatibility.get(donor, [])`,
        description: "Python dictionary lookup for donor-recipient compatibility logic."
    },
    {
        language: 'java',
        title: 'Patient Class Structure',
        code: `public class Patient {
    private String name;
    private BloodType bloodType;
    private boolean rhFactor;

    public boolean canDonateTo(Patient recipient) {
        // Logic implementation
        return CompatibilityService.check(this, recipient);
    }
}`,
        description: "Java object-oriented representation of a patient record."
    }
];