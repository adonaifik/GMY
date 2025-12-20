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
        language: 'python',
        title: 'Compatibility Algorithm',
        code: `def check_compatibility(donor, recipient):
    # Standard ABO/Rh logic
    rules = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'AB+': ['AB+']
    }
    return recipient in rules.get(donor, [])`,
        description: "Python implementation for donor-recipient matching."
    },
    {
        language: 'java',
        title: 'Medical Record Entity',
        code: `public class PatientRecord {
    private String patientId;
    private BloodType type;
    
    public synchronized void updateRegistry() {
        // Safe thread-based cloud sync logic
        CloudConnector.sync(this.patientId);
    }
}`,
        description: "Java class structure for handling patient record synchronization."
    },
    {
        language: 'css',
        title: 'Clinical UI Styling',
        code: `.blood-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 0, 0, 0.2);
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.type-indicator {
    font-weight: 900;
    color: #ef4444; /* rose-500 */
    text-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
}`,
        description: "CSS variables and glassmorphism styling for medical dashboard elements."
    },
    {
        language: 'SQL',
        title: 'Database Schema',
        code: `CREATE TABLE patients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  access_code text UNIQUE,
  blood_type text,
  registered_at timestamptz DEFAULT now()
);`,
        description: "Standard SQL definition for the patient registry table."
    }
];