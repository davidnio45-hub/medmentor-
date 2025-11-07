import type { Hub } from './types';
import { 
    AcademicCapIcon, HeartIcon, UsersIcon, GlobeAltIcon, EyeIcon, ChartBarIcon, MapIcon, ShieldCheckIcon, DocumentTextIcon, LockClosedIcon, 
    SparklesIcon, QuestionMarkCircleIcon, ClipboardDocumentListIcon, BeakerIcon, CpuChipIcon, HomeIcon, LightBulbIcon
} from './components/common/icons';

// Page Components
import { ChooseYourPath } from './pages/ChooseYourPath';
import { FlashcardGenerator } from './pages/FlashcardGenerator';
import { QuizCreator } from './pages/QuizCreator';
import { ExamGenerator } from './pages/ExamGenerator';
import { StaticContentPage } from './pages/StaticContentPage';
import { ClinicalCaseSimulator } from './pages/ClinicalCaseSimulator';
import { CommunityPage } from './pages/CommunityPage';
import { DiseaseAnalysis } from './pages/DiseaseAnalysis';
import { DrugInfo } from './pages/DrugInfo';
import { AnatomyViewer } from './pages/AnatomyViewer';
import { StudyGuidance } from './pages/StudyGuidance';
import { LegalScreen } from './pages/LegalScreen';
import { StudyPackGenerator } from './pages/StudyPackGenerator';
import { HumanPhysiology } from './pages/HumanPhysiology';

export const HUBS: Hub[] = [
    {
        id: 'orientation',
        title: 'Orientation',
        icon: MapIcon,
        pages: [
            {
                id: 'choose-path',
                title: 'Choose Your Path',
                icon: HomeIcon,
                description: 'Select your current stage for a tailored experience.',
                component: ChooseYourPath,
            },
        ],
    },
    {
        id: 'study',
        title: 'Study Tools Hub',
        icon: AcademicCapIcon,
        pages: [
            {
                id: 'study-pack-generator',
                title: 'Module & Topic Generator',
                prompt: "Generate study materials for this medical topic: {userInput}. Include a concise summary, flashcards (question/answer), quiz questions (question, 4 options, correct answer, explanation), and a brief clinical case study.",
                icon: SparklesIcon,
                description: "Enter a topic to generate a complete study pack.",
                component: StudyPackGenerator,
            },
            {
                id: 'human-physiology',
                title: 'Human Physiology',
                prompt: "Explain the normal human physiology of the {userInput} system. Include key concepts, functions, and regulatory mechanisms. Use clear, concise language for medical students.",
                icon: HeartIcon,
                description: "Get an overview of major human physiological systems.",
                component: HumanPhysiology,
            },
        ],
    },
    {
        id: 'clinical',
        title: 'Clinical Practice',
        icon: HeartIcon,
        pages: [
            {
                id: 'clinical-orientation',
                title: 'Clinical Orientation',
                prompt: "Provide a comprehensive guide for a medical student starting clinical orientation. Include key tips on ward behavior, effective documentation (e.g., SOAP notes), patient interaction etiquette, and common pitfalls to avoid.",
                icon: ClipboardDocumentListIcon,
                description: "Tips, checklists, and etiquette for clinical rotations.",
                component: StaticContentPage,
            },
            {
                id: 'internship-support',
                title: 'Internship Support',
                prompt: "Offer detailed advice and practical tools for a medical intern. Cover topics like managing rotation schedules, coping with stress and long hours, and provide a daily checklist for common tasks.",
                icon: CpuChipIcon,
                description: "Rotation planner, stress tips, and daily checklists.",
                component: StaticContentPage,
            },
            {
                id: 'case-simulator',
                title: 'Case Simulator',
                prompt: "Simulate a realistic patient case for a medical student based on this topic: {userInput}. Include patient history, symptoms, physical exam findings, and lab results. Then, ask the user to provide a differential diagnosis and suggest a management plan. Wait for the user's response before revealing the correct diagnosis and plan.",
                icon: ClipboardDocumentListIcon,
                description: "Simulate patient cases to practice clinical reasoning.",
                component: ClinicalCaseSimulator,
            },
        ],
    },
    {
        id: 'community',
        title: 'Community & Discussion',
        icon: UsersIcon,
        pages: [
            { id: 'discussion-forum', title: 'Discussion Forum', icon: UsersIcon, description: "Post questions, share answers, and learn with peers.", component: CommunityPage, props: { type: 'Forum' } },
        ],
    },
    {
        id: 'intelligence',
        title: 'Disease & Drug Intelligence',
        icon: GlobeAltIcon,
        pages: [
            {
                id: 'disease-analysis',
                title: 'Disease Analysis',
                prompt: "Explain the pathophysiology of {userInput}. Include causes, progression, and clinical signs in a clear, structured format suitable for a medical student.",
                icon: CpuChipIcon,
                description: "Get a summary of a disease's pathophysiology.",
                component: DiseaseAnalysis,
            },
            {
                id: 'drug-info',
                title: 'Drug Info Screen',
                prompt: "Describe the drug '{userInput}'. Include its mechanism of action, indications, contraindications, common side effects, and standard dosage guidelines.",
                icon: BeakerIcon,
                description: "Look up a drug's mechanism, dosage, and side effects.",
                component: DrugInfo,
            },
        ],
    },
    {
        id: 'anatomy',
        title: 'Anatomy Atlas',
        icon: EyeIcon,
        pages: [
            {
                id: 'anatomy-viewer',
                title: 'Anatomy Viewer',
                prompt: "Generate a medically accurate, clearly labeled diagram of the {userInput}. Include brief descriptions for each key structure shown.",
                icon: EyeIcon,
                description: "View labeled images and descriptions of body systems.",
                component: AnatomyViewer,
            },
        ],
    },
    {
        id: 'performance',
        title: 'Performance Advisor',
        icon: ChartBarIcon,
        pages: [
            {
                id: 'study-guidance',
                title: 'Study Guidance',
                prompt: "Based on the following performance data, analyze the student's strengths and weaknesses. Suggest personalized study strategies, recommend specific topics to focus on, and provide actionable advice for improvement.",
                icon: ChartBarIcon,
                description: "Get personalized advice by uploading grades or progress.",
                component: StudyGuidance,
            },
        ],
    },
    {
        id: 'legal',
        title: 'Privacy & Copyright',
        icon: ShieldCheckIcon,
        pages: [
            { id: 'privacy', title: 'Privacy', icon: LockClosedIcon, description: "Our commitment to your data privacy.", component: LegalScreen, props: { type: 'Privacy' } },
            { id: 'copyright', title: 'Copyright', icon: LockClosedIcon, description: "Content usage and copyright information.", component: LegalScreen, props: { type: 'Copyright' } },
        ]
    }
];

export const findPageById = (id: string) => {
    for (const hub of HUBS) {
        const page = hub.pages.find(p => p.id === id);
        if (page) return page;
    }
    return null;
}