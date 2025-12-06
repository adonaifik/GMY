import { BloodType, GeneticResult } from '../types';

export const calculateChildBloodTypes = (parent1: BloodType, parent2: BloodType): GeneticResult => {
    // Simplified Punnett Square logic
    // A = AA or AO
    // B = BB or BO
    // AB = AB
    // O = OO

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
    },
    {
        language: 'css',
        title: 'Blood Cell Animation',
        code: `.blood-cell {
    width: 50px;
    height: 50px;
    background: radial-gradient(circle at 30% 30%, #ff4d4d, #cc0000);
    border-radius: 50%;
    box-shadow: inset -5px -5px 10px rgba(0,0,0,0.3);
    animation: float 3s ease-in-out infinite;
}`,
        description: "CSS styling for a 3D-looking red blood cell."
    }
];
