
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
        title: 'Blood Group Analysis Logic',
        code: `class BloodAnalyzer:
    def __init__(self, phenotype):
        self.phenotype = phenotype
        self.genotype_map = {
            'A': ['AA', 'AO'],
            'B': ['BB', 'BO'],
            'AB': ['AB'],
            'O': ['OO']
        }

    def get_possible_gametes(self):
        # Calculate possible alleles based on the quiz result
        return list(set("".join(self.genotype_map.get(self.phenotype, []))))

# Usage: analyzer = BloodAnalyzer('A')`,
        description: "Python class for mapping medical phenotypes to genetic alleles."
    },
    {
        language: 'java',
        title: 'Punnett Square Heredity Model',
        code: `public class HeredityModel {
    public List<String> calculate(String p1, String p2) {
        Set<String> results = new HashSet<>();
        for (char a1 : p1.toCharArray()) {
            for (char a2 : p2.toCharArray()) {
                results.add(formatAllele(a1, a2));
            }
        }
        return new ArrayList<>(results);
    }

    private String formatAllele(char c1, char c2) {
        return c1 < c2 ? ""+c1+c2 : ""+c2+c1;
    }
}`,
        description: "Java implementation of Mendelian inheritance using Punnett square logic."
    },
    {
        language: 'css',
        title: 'Clinical Data Visualization',
        code: `/* Glassmorphism for Medical Dashboard */
.clinical-panel {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(244, 63, 94, 0.2);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    border-radius: 2rem;
}

.indicator-active {
    background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%);
    filter: drop-shadow(0 0 10px rgba(244, 63, 94, 0.4));
    animation: pulse-glow 2s infinite;
}`,
        description: "CSS styling using advanced glassmorphism and clinical glow effects."
    },
    {
        language: 'SQL',
        title: 'Patient Data Normalization',
        code: `CREATE TABLE clinical_records (
    record_id SERIAL PRIMARY KEY,
    patient_uuid UUID REFERENCES users(id),
    blood_phenotype VARCHAR(3) CHECK (blood_phenotype IN ('A', 'B', 'AB', 'O')),
    rh_factor BOOLEAN,
    observed_at TIMESTAMP DEFAULT NOW()
);`,
        description: "Relational database schema for storing verified blood determination records."
    }
];
