import React from 'react';
import {
    MaleHairLoss1, MaleHairLoss2, MaleHairLoss3, MaleHairLoss4,
    MaleHairLoss5, MaleHairLoss6, MaleHairLossCoinPatch, MaleHairLossHeavyFall
} from './Icons';

interface ImageRadioOption {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type Question = {
  question: string;
  key: string;
} & (
  | {
      type: 'single' | 'multiple';
      options: string[];
      imageOptions?: never;
    }
  | {
      type: 'image-radio';
      options?: never;
      imageOptions: ImageRadioOption[];
    }
);


export const maleQuestions: Question[] = [
    {
        question: "How much hair do you lose on an average day?",
        key: 'hairfallAmountMale',
        type: 'single',
        options: ["Less than 50 strands", "50-100 strands", "100-200 strands", "More than 200 strands / In clumps"],
    },
    {
        question: "Which image best describes your hair loss?",
        key: 'hairlossImageMale',
        type: 'image-radio',
        imageOptions: [
            { label: "Stage - 1", icon: MaleHairLoss1 },
            { label: "Stage - 2", icon: MaleHairLoss2 },
            { label: "Stage - 3", icon: MaleHairLoss3 },
            { label: "Stage - 4", icon: MaleHairLoss4 },
            { label: "Stage - 5", icon: MaleHairLoss5 },
            { label: "Stage - 6", icon: MaleHairLoss6 },
            { label: "Coin Size Patch", icon: MaleHairLossCoinPatch },
            { label: "Heavy Hair Fall", icon: MaleHairLossHeavyFall },
        ],
    },
    {
        question: "Where are you primarily experiencing hair loss?",
        key: 'hairlossLocationMale',
        type: 'single',
        options: ["Hairline/Temples", "Crown/Top of head", "Overall thinning", "All of the above"],
    },
    {
        question: "Do you have a family history of baldness (from either parent's side)?",
        key: 'familyHistory',
        type: 'single',
        options: ["Yes", "No", "I'm not sure"],
    },
    {
        question: "Do you experience dandruff?",
        key: 'dandruff',
        type: 'single',
        options: ["Never", "Occasionally", "Frequently (visible flakes)"],
    },
    {
        question: "How would you describe your scalp?",
        key: 'scalpType',
        type: 'single',
        options: ["Oily (gets greasy within a day)", "Dry and flaky", "Normal (balanced)", "Itchy or irritated"],
    },
    {
        question: "How would you rate your current stress levels?",
        key: 'stressLevel',
        type: 'single',
        options: ["Low", "Moderate", "High", "Very High"],
    },
    {
        question: "Have you experienced any of the following recently?",
        key: 'medicalConditions',
        type: 'multiple',
        options: ["Major illness or surgery", "Significant weight loss or gain", "Started or stopped new medication", "None of the above"],
    },
    {
        question: "What is your typical diet like?",
        key: 'proteinIntake',
        type: 'single',
        options: ["Rich in protein (meat, fish, eggs, legumes)", "Balanced diet", "Mostly vegetarian/vegan", "High in processed/junk food"],
    },
    {
        question: "How often do you wash your hair?",
        key: 'hairwashFrequency',
        type: 'single',
        options: ["Daily", "Every 2-3 days", "Once a week", "Less than once a week"],
    },
];

export const femaleQuestions: Question[] = [
    {
        question: "How much hair do you lose on an average day?",
        key: 'hairfallAmountFemale',
        type: 'single',
        options: ["Less than 50 strands", "50-100 strands", "100-200 strands", "More than 200 strands / In clumps"],
    },
    {
        question: "How long have you been experiencing hair fall?",
        key: 'hairfallDuration',
        type: 'single',
        options: ["Less than a month", "1-3 months", "3-6 months", "More than 6 months"],
    },
    {
        question: "How has the volume of your hair changed?",
        key: 'hairVolume',
        type: 'single',
        options: ["No significant change", "Slightly less volume", "Noticeably thinner", "Drastically reduced volume"],
    },
    {
        question: "Do you have any known hormonal issues?",
        key: 'hormonalIssues',
        type: 'multiple',
        options: ["PCOS/PCOD", "Thyroid issues", "Menopause-related changes", "None of the above", "I'm not sure"],
    },
    {
        question: "Which of these life stages applies to you currently?",
        key: 'lifeStages',
        type: 'single',
        options: ["Trying to conceive", "Currently Pregnant", "Post-partum (within 1 year of delivery)", "Menopausal/Perimenopausal", "None of the above"],
    },
    {
        question: "Have you experienced any of the following recently (in the last 3-6 months)?",
        key: 'recentChanges',
        type: 'multiple',
        options: ["Major illness or surgery", "High fever (like COVID-19, Dengue)", "Significant weight change", "High stress event", "Started or stopped medication (including birth control)", "None of the above"],
    },
    {
        question: "How would you describe your scalp?",
        key: 'scalpDryness',
        type: 'single',
        options: ["Oily (gets greasy within a day)", "Dry, tight, or flaky", "Normal (balanced)", "Itchy, irritated, or has buildup"],
    },
    {
        question: "How would you rate your current stress levels?",
        key: 'stressLevelFemale',
        type: 'single',
        options: ["Low", "Moderate", "High", "Very High"],
    },
    {
        question: "How is your sleep quality?",
        key: 'sleepQualityFemale',
        type: 'single',
        options: ["Good (7-9 hours, restful)", "Fair (wake up occasionally)", "Poor (difficulty sleeping, feel tired)"],
    },
    {
        question: "Have you had any chemical or heat treatments on your hair recently?",
        key: 'hairTreatmentsFemale',
        type: 'multiple',
        options: ["Coloring/Bleaching", "Straightening/Perming", "Keratin/Smoothing Treatment", "Regular heat styling (straightener, curling iron)", "None"],
    },
];