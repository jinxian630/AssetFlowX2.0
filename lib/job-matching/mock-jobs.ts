// ============================================================================
// AssetFlowX - Mock Job Positions
// Sample job positions for testing the matching system
// ============================================================================

import type { JobPosition } from "@/types/job-matching"

export const mockJobPositions: JobPosition[] = [
  {
    id: "job_web3_dev_001",
    title: "Senior Web3 Developer",
    company: "AssetFlowX",
    companyLogo: "🏢",
    description: "We are looking for an experienced Web3 developer to build and maintain our blockchain-based credential and escrow platform. You will work on smart contracts, integrate with multiple chains, and ensure security and compliance.",
    requirements: [
      "5+ years of software development experience",
      "2+ years of Web3/blockchain development experience",
      "Strong knowledge of Solidity and smart contract security",
      "Experience with DeFi protocols and NFT standards",
      "Familiarity with multiple blockchain networks (Ethereum, Polygon, Base, etc.)",
    ],
    skills: [
      "Solidity",
      "JavaScript/TypeScript",
      "Smart Contracts",
      "Web3.js/Ethers.js",
      "DeFi",
      "NFT",
      "Security Auditing",
    ],
    experience: "5+ years",
    location: "Remote",
    salary: "$120k - $180k",
    companyDocuments: [
      "Web3 Development Standards",
      "Security Best Practices Guide",
      "Company Technical Onboarding",
    ],
  },
  {
    id: "job_frontend_dev_002",
    title: "Frontend Developer (React/Next.js)",
    company: "AssetFlowX",
    companyLogo: "🏢",
    description: "Join our team to build beautiful and intuitive user interfaces for our digital asset platform. You'll work with modern React, Next.js, and TypeScript to create seamless user experiences.",
    requirements: [
      "3+ years of frontend development experience",
      "Strong proficiency in React and TypeScript",
      "Experience with Next.js or similar frameworks",
      "Knowledge of modern UI/UX principles",
      "Experience with state management and API integration",
    ],
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "State Management",
      "API Integration",
      "UI/UX",
    ],
    experience: "3-5 years",
    location: "Remote",
    salary: "$80k - $120k",
    companyDocuments: [
      "Frontend Architecture Guide",
      "Design System Documentation",
      "Code Standards and Best Practices",
    ],
  },
  {
    id: "job_ai_engineer_003",
    title: "AI/ML Engineer - Risk Scoring",
    company: "AssetFlowX",
    companyLogo: "🏢",
    description: "Develop and maintain our AI-powered risk scoring and assessment system. You'll work with LLMs, prompt engineering, and machine learning models to provide intelligent risk analysis.",
    requirements: [
      "4+ years of AI/ML engineering experience",
      "Strong background in NLP and LLM integration",
      "Experience with prompt engineering",
      "Knowledge of risk assessment methodologies",
      "Python and TypeScript proficiency",
    ],
    skills: [
      "Machine Learning",
      "NLP",
      "LLM Integration",
      "Prompt Engineering",
      "Python",
      "TypeScript",
      "Risk Analysis",
    ],
    experience: "4+ years",
    location: "Remote",
    salary: "$100k - $150k",
    companyDocuments: [
      "AI Model Architecture",
      "Prompt Engineering Guidelines",
      "Risk Scoring Standards",
    ],
  },
  {
    id: "job_product_manager_004",
    title: "Product Manager - Digital Assets",
    company: "AssetFlowX",
    companyLogo: "🏢",
    description: "Lead product strategy and development for our Web3 financial platform. You'll work closely with engineering, design, and business teams to deliver innovative features for digital asset management.",
    requirements: [
      "5+ years of product management experience",
      "Experience with FinTech or Web3 products",
      "Strong analytical and strategic thinking",
      "Excellent communication and leadership skills",
      "Technical background preferred",
    ],
    skills: [
      "Product Management",
      "FinTech",
      "Web3",
      "Agile/Scrum",
      "Analytics",
      "Strategy",
      "Leadership",
    ],
    experience: "5+ years",
    location: "Remote",
    salary: "$110k - $160k",
    companyDocuments: [
      "Product Strategy Overview",
      "Company Vision and Roadmap",
      "Business Model Documentation",
    ],
  },
]

export function getJobById(id: string): JobPosition | undefined {
  return mockJobPositions.find(job => job.id === id)
}

export function getAllJobs(): JobPosition[] {
  return mockJobPositions
}

