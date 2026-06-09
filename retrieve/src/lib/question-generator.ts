import { normalizeText } from './pdf-parser';

export interface Question {
  id: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

// ─── High-yield MCAT Predefined Question Banks ────────────────
const CONCEPT_QUESTION_BANK: {
  keywords: string[];
  questions: Omit<Question, 'id'>[];
}[] = [
  {
    keywords: ['infarction', 'myocardial', 'ischemia', 'coronary', 'cardiovascular'],
    questions: [
      {
        questionText: "Which of the following cellular changes is initiated first by the abrupt cessation of oxygen delivery during myocardial ischemia?",
        options: {
          A: "Deposition of collagen and scar tissue",
          B: "Rapid depletion of ATP reserves and switch to anaerobic glycolysis",
          C: "Intracellular alkalosis and active enzyme stimulation",
          D: "Stabilization of mitochondrial membranes"
        },
        correctAnswer: 'B',
        explanation: "Ischemia halts oxygen delivery, causing aerobic metabolism to fail. The cell immediately switches to anaerobic glycolysis, which leads to rapid ATP depletion and lactic acid accumulation."
      },
      {
        questionText: "If coronary perfusion is not restored within approximately twenty minutes, what cellular transition occurs?",
        options: {
          A: "Hypertrophy of vascular smooth muscle",
          B: "Reversible cellular swelling and recovery",
          C: "Irreversible cell injury and myocardial necrosis",
          D: "Complete restoration of glycogen stores"
        },
        correctAnswer: 'C',
        explanation: "Myocardial cells can tolerate ischemia for up to 20 minutes; beyond this threshold, irreversible cell injury starts, leading to membrane disruption, mitochondrial swelling, and necrosis."
      },
      {
        questionText: "Which of the following describes the long-term structural remodeling phase of the myocardium following necrosis?",
        options: {
          A: "Regeneration of functional contractile cardiomyocytes",
          B: "Inflammatory infiltration followed by fibrotic scar tissue formation",
          C: "Sustained high anaerobic ATP production",
          D: "Immediate calcification of the aortic valve"
        },
        correctAnswer: 'B',
        explanation: "Necrotic cardiomyocytes cannot regenerate. The healing process involves inflammatory clearance of debris by macrophages and replacement with a non-contractile collagenous fibrotic scar."
      }
    ]
  },
  {
    keywords: ['michaelis', 'menten', 'kinetics', 'enzyme', 'vmax', 'km', 'inhibition'],
    questions: [
      {
        questionText: "How does a competitive inhibitor alter the Michaelis-Menten kinetic parameters of an enzyme?",
        options: {
          A: "Increases Vmax, Km remains unchanged",
          B: "Decreases Vmax, decreases Km",
          C: "Km increases, Vmax remains unchanged",
          D: "Both Km and Vmax decrease"
        },
        correctAnswer: 'C',
        explanation: "Competitive inhibitors bind to the active site and can be overcome by high substrate concentrations. Thus, the apparent Km increases (lower affinity), but Vmax is unchanged."
      },
      {
        questionText: "What represents the Michaelis constant (Km) in enzyme kinetics?",
        options: {
          A: "The substrate concentration at which the reaction rate is half of Vmax",
          B: "The maximum initial velocity of the enzymatic reaction",
          C: "The dissociation rate of the product from the active site",
          D: "The activation energy barrier of the transition state"
        },
        correctAnswer: 'A',
        explanation: "Km is the substrate concentration at which the reaction velocity is exactly half of Vmax. It serves as a measure of the enzyme's affinity for the substrate."
      }
    ]
  },
  {
    keywords: ['nephron', 'kidney', 'henle', 'osmotic', 'filtration', 'reabsorption'],
    questions: [
      {
        questionText: "Which segment of the nephron is impermeable to water but highly active in solute reabsorption, aiding the countercurrent multiplier?",
        options: {
          A: "Descending limb of the Loop of Henle",
          B: "Thick ascending limb of the Loop of Henle",
          C: "Proximal convoluted tubule",
          D: "Bowman's capsule"
        },
        correctAnswer: 'B',
        explanation: "The thick ascending limb is impermeable to water and actively reabsorbs sodium, potassium, and chloride ions, helping establish the high medullary osmotic gradient."
      },
      {
        questionText: "What is the primary driver of filtration at the glomerulus in the renal corpuscle?",
        options: {
          A: "Active transport of water into the tubule",
          B: "Osmotic pressure of Bowman's space fluid",
          C: "Glomerular hydrostatic pressure",
          D: "Active secretion of urea"
        },
        correctAnswer: 'C',
        explanation: "Glomerular filtration is driven by hydrostatic pressure of the blood in the glomerular capillaries, which overcomes the opposing colloid osmotic and capsular hydrostatic pressures."
      }
    ]
  },
  {
    keywords: ['glycolysis', 'pfk', 'phosphofructokinase', 'atp', 'glucose'],
    questions: [
      {
        questionText: "Why is Phosphofructokinase-1 (PFK-1) considered the rate-limiting enzyme of glycolysis?",
        options: {
          A: "It produces the final pyruvate molecules",
          B: "It catalyzes the first committed step that is heavily regulated by ATP/AMP ratio",
          C: "It operates reversibly in gluconeogenesis",
          D: "It converts glucose to glucose-6-phosphate"
        },
        correctAnswer: 'B',
        explanation: "PFK-1 catalyzes the phosphorylation of Fructose-6-phosphate to Fructose-1,6-bisphosphate. This is the main committed, irreversible, and regulated step of glycolysis."
      }
    ]
  }
];

function extractKeyTerms(text: string): string[] {
  const words = text.split(/\s+/);
  const freqMap: Record<string, number> = {};
  const stopWords = new Set(['because', 'through', 'between', 'without', 'another', 'although', 'process', 'pathway', 'system', 'mechanism', 'function', 'cellular', 'membrane', 'passage', 'chapter', 'reading', 'concept']);
  for (const w of words) {
    const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (clean.length >= 6 && !stopWords.has(clean)) {
      freqMap[clean] = (freqMap[clean] || 0) + 1;
    }
  }
  const sorted = Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]);
  const fallbackTerms = ['metabolism', 'homeostasis', 'enzyme', 'pathway', 'regulation'];
  for (const term of fallbackTerms) {
    if (sorted.length >= 5) break;
    if (!sorted.includes(term)) sorted.push(term);
  }
  return sorted.slice(0, 5).map(capitalize);
}

// ─── Dynamic Fallback Question Generator ─────────────────────
function generateDynamicQuestions(text: string): Omit<Question, 'id'>[] {
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.split(/\s+/).length >= 5);

  const dynamicQuestions: Omit<Question, 'id'>[] = [];
  const usedKeywords = new Set<string>();

  // Attempt to build up to 5 fill-in-the-blank questions
  for (const sentence of sentences) {
    if (dynamicQuestions.length >= 5) break;

    const words = sentence.split(/\s+/);
    const candidates = words.filter(w => {
      const clean = w.replace(/[^a-zA-Z]/g, '');
      return clean.length >= 6 && 
             !['because', 'through', 'between', 'without', 'another', 'although'].includes(clean.toLowerCase());
    });

    if (candidates.length === 0) continue;

    let targetWord = '';
    for (const cand of candidates) {
      const clean = cand.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (!usedKeywords.has(clean)) {
        targetWord = cand;
        usedKeywords.add(clean);
        break;
      }
    }

    if (!targetWord) continue;

    const cleanTarget = targetWord.replace(/[^a-zA-Z]/g, '');
    const blankedSentence = sentence.replace(new RegExp(`\\b${cleanTarget}\\b`, 'i'), '_______');

    const distractors = ['metabolism', 'regulation', 'homeostasis', 'inhibition', 'diffusion', 'transport', 'synthesis']
      .filter(w => w.toLowerCase() !== cleanTarget.toLowerCase())
      .slice(0, 3);

    const optionsArray = [cleanTarget.toLowerCase(), ...distractors];
    optionsArray.sort(() => Math.random() - 0.5);

    const letterOptions = {
      A: capitalize(optionsArray[0]),
      B: capitalize(optionsArray[1]),
      C: capitalize(optionsArray[2]),
      D: capitalize(optionsArray[3])
    };

    const correctLetter = (Object.keys(letterOptions) as Array<'A' | 'B' | 'C' | 'D'>)
      .find(key => letterOptions[key].toLowerCase() === cleanTarget.toLowerCase()) || 'A';

    dynamicQuestions.push({
      questionText: `Based on the passage, fill in the blank: "${blankedSentence}"`,
      options: letterOptions,
      correctAnswer: correctLetter,
      explanation: `The passage states: "${sentence}". The missing key scientific term is "${cleanTarget}".`
    });
  }

  return dynamicQuestions;
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Main Generator Entrypoint ───────────────────────────────
export function generateQuestionsForPassage(passageText: string): Question[] {
  const normText = passageText.toLowerCase();
  let questionsList: Omit<Question, 'id'>[] = [];

  // 1. Check for keyword matches in predefined banks
  for (const bank of CONCEPT_QUESTION_BANK) {
    const matched = bank.keywords.some(keyword => normText.includes(keyword));
    if (matched) {
      questionsList = [...bank.questions];
      break;
    }
  }

  // 2. Generate dynamic sentences questions if we don't have enough questions
  if (questionsList.length < 5) {
    const dynamic = generateDynamicQuestions(passageText);
    for (const q of dynamic) {
      if (questionsList.length >= 5) break;
      if (!questionsList.some(item => item.questionText === q.questionText)) {
        questionsList.push(q);
      }
    }
  }

  // 3. If still fewer than 5, pad with customized general templates using key terms
  if (questionsList.length < 5) {
    const keyTerms = extractKeyTerms(passageText);
    const mainTerm = keyTerms[0] || 'the scientific concept';
    const secondaryTerm = keyTerms[1] || 'regulatory feedback';
    const tertiaryTerm = keyTerms[2] || 'homeostasis';
    const quaternaryTerm = keyTerms[3] || 'cellular metabolism';
    const quinaryTerm = keyTerms[4] || 'biochemical pathway';

    const generalTemplates = [
      {
        questionText: `Which of the following best states the primary objective of discussing ${mainTerm.toLowerCase()} in this passage?`,
        options: {
          A: `To illustrate the clinical or biological significance of ${mainTerm.toLowerCase()} in a physiological context.`,
          B: `To argue that ${mainTerm.toLowerCase()} is independent of external environmental stressors.`,
          C: `To compare the efficiency of ${mainTerm.toLowerCase()} to unrelated chemical pathways.`,
          D: `To define the chemical structure of ${mainTerm.toLowerCase()} in isolation.`
        },
        correctAnswer: 'A' as const,
        explanation: `The passage introduces and explains ${mainTerm.toLowerCase()} in relation to surrounding physiological variables, focusing on its functional significance.`
      },
      {
        questionText: `Based on the passage details, how does the presence of ${secondaryTerm.toLowerCase()} relate to ${mainTerm.toLowerCase()}?`,
        options: {
          A: `They operate in coordination to maintain metabolic balance or structural integrity.`,
          B: `${secondaryTerm.toLowerCase()} completely prevents the occurrence of ${mainTerm.toLowerCase()}.`,
          C: `${mainTerm.toLowerCase()} causes the immediate destruction of ${secondaryTerm.toLowerCase()}.`,
          D: `There is no correlation or relationship discussed in the text.`
        },
        correctAnswer: 'A' as const,
        explanation: `The passage describes how these biological elements or concepts interact to govern the overall process described.`
      },
      {
        questionText: `What is a reasonable scientific inference that can be made regarding ${tertiaryTerm.toLowerCase()} based on the passage?`,
        options: {
          A: `Alterations in ${tertiaryTerm.toLowerCase()} can influence the rate or stability of the system.`,
          B: `${tertiaryTerm.toLowerCase()} is unaffected by temperature, pH, or cellular energy levels.`,
          C: `${tertiaryTerm.toLowerCase()} acts as the sole catalyst for all metabolic functions.`,
          D: `It serves no functional role and is a metabolic byproduct.`
        },
        correctAnswer: 'A' as const,
        explanation: `The text highlights ${tertiaryTerm.toLowerCase()} as a relevant factor or byproduct within the described mechanism, suggesting that changes in it affect the outcome.`
      },
      {
        questionText: `The author mentions paragraph details in the passage to support which general claim about ${quaternaryTerm.toLowerCase()}?`,
        options: {
          A: `That the mechanism is highly dynamic and sensitive to underlying conditions.`,
          B: `That the process is purely chemical and has no physiological impact.`,
          C: `That it can only occur under artificial, in-vitro laboratory setups.`,
          D: `That scientific understanding of it remains entirely theoretical.`
        },
        correctAnswer: 'A' as const,
        explanation: `The passage details several sequential steps and environmental conditions, showing the dynamic nature of ${quaternaryTerm.toLowerCase()}.`
      },
      {
        questionText: `If a mutation or external inhibitor were to disrupt ${quinaryTerm.toLowerCase()}, what is the most likely consequence according to the passage?`,
        options: {
          A: `The efficiency of the overall pathway or homeostatic regulation would be significantly compromised.`,
          B: `The cell would immediately double its rate of oxygen consumption.`,
          C: `The entire system would revert to a state of absolute equilibrium.`,
          D: `The organism would develop immunity to all chemical stressors.`
        },
        correctAnswer: 'A' as const,
        explanation: `Disrupting an integral component like ${quinaryTerm.toLowerCase()} disrupts the balance and regulatory loop described in the passage.`
      }
    ];

    for (const template of generalTemplates) {
      if (questionsList.length >= 5) break;
      if (!questionsList.some(item => item.questionText === template.questionText)) {
        questionsList.push(template);
      }
    }
  }

  // Ensure exactly 5 questions with correct sequential IDs
  return questionsList.slice(0, 5).map((q, idx) => ({
    id: idx + 1,
    ...q
  }));
}
