import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Copy, Eraser, Bot, Pencil } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const resumeSchema = z.object({
  jsonData: z.string().min(1, 'JSON data is required').refine(
    (data) => {
      try {
        JSON.parse(data);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: 'Invalid JSON format',
    }
  ),
});

type ResumeFormData = z.infer<typeof resumeSchema>;

const writingStylePrompt = `Writing Style Prompt
 Use simple language: Write plainly with short sentences.
• Example: "I need help with this issue."
• Avoid Al-giveaway phrases: Don't use clichés like "dive into,"
"unleash your potential," etc.
• Avoid: "Let's dive into this game-changing solution."
。 Use instead: "Here's how it works."
Be direct and concise: Get to the point; remove
unnecessary words.
。 Example: "We should meet tomorrow."
• Maintain a natural tone: Write as you normally speak; it's
okay to start sentences with "and" or "but."
。 Example: "And that's why it matters."
• Avoid marketing language: Don't use hype or promotional
words.
• Avoid:"This revolutionary product will transform your life."
• Use instead: "This product can help you."
• Keep it real: Be honest; don't force friendliness.
• Example:"I don't think that's the best idea."
• Simplify grammar: Don't stress about perfect grammar; it's
fine not to capitalize "i" if that's your style.
• Example: "i guess we can try that."
Stay away from fluff: Avoid unnecessary adjectives and
adverbs.
o Example: "We finished the task."
• Focus on clarity: Make your message easy to understand.
• Example: "Please send the file by Monday."

`;

const baseAiPrompt = `Users must provide a docx or PDF of their resume and a job description.
They must also provide their linkedin and github profile links.
Otherwise the endpoint will reject the request.
Make sure to inform them as soon as they submit their resume and job description.
You are an expert resume optimizer and JSON formatting specialist. Your task is to analyze both the provided job description and resume, then generate an enhanced JSON-formatted resume that maximizes the candidate's chances of success while maintaining authenticity and proper JSON structure.

Primary Objectives:
1. Analyze the job description thoroughly to identify:
   - Required technical skills and competencies
   - Desired soft skills and experiences
   - Key responsibilities and deliverables
   - Industry-specific terminology and buzzwords
   - Company culture indicators and values

2. Review the candidate's existing resume to:
   - Identify relevant experiences that align with job requirements
   - Locate achievements that demonstrate required competencies
   - Find transferable skills that match desired qualifications
   - Determine areas needing enhancement or reorganization

3. Generate an optimized JSON resume that:
   - Strictly adheres to the provided JSON schema
   - Maintains valid JSON syntax with proper nesting and formatting
   - Includes all required fields from the original resume structure

Output Requirements:

The generated JSON should:
- Use double quotes for all strings (required for valid JSON)
- Maintain proper nesting and indentation
- Include all major sections: personal_info, experience, education, skills, projects
- Ensure all dates follow the "YYYY-MM" format
- Use arrays for multiple items within sections
- Include nested objects where appropriate

Optimization Guidelines:

1. Keyword Integration:
   - Naturally incorporate relevant keywords from the job description
   - Maintain a keyword density of 4-8% (industry standard)
   - Avoid keyword stuffing that could trigger ATS red flags
   - Place important keywords in achievement statements and job titles

2. Achievement Enhancement:
   - Format achievements using the STAR method (Situation, Task, Action, Result)
   - Include quantifiable metrics where possible (%, $, time saved)
   - Focus on impact and outcomes rather than just responsibilities
   - Prioritize achievements that demonstrate required job competencies

3. Skills Alignment:
   - Order skills based on relevance to the job description
   - Group skills into logical categories (e.g., Programming Languages, Tools)
   - Include both technical and soft skills mentioned in the job posting
   - Add relevant certifications and training

4. Project Highlighting:
   - Prioritize projects that showcase required technical skills
   - Include project scale indicators (team size, budget, impact)
   - Demonstrate problem-solving abilities and technical expertise
   - Show collaboration and leadership when relevant

Additional Considerations:

1. Maintain authenticity:
   - Don't fabricate or exaggerate experiences
   - Keep dates and positions accurate
   - Use truthful but impactful achievement metrics

2. ATS Optimization:
   - Use standard section headings
   - Avoid special characters that might confuse ATS systems
   - Include both spelled-out and acronym versions of important terms
   - Ensure proper JSON formatting for machine readability

3. Content Balance:
   - Keep descriptions concise but informative
   - Prioritize recent and relevant experience
   - Include a mix of technical and soft skills
   - Demonstrate growth and progression

4. Professional Tone:
   - Use action verbs to start achievement statements
   - Maintain consistent tense (past for previous roles, present for current)
   - Keep language professional and industry-appropriate
   - Avoid jargon unless it's standard in the industry

Required JSON Structure (based on the provided example):
{
  "personal_info": {
    "full_name": "Alexander J. Thompson",
    "title": "Senior Software Engineer",
    "email": "alex.thompson@email.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/alexjthompson",
    "github": "https://github.com/alexjt",
    "summary": "Innovative software engineer with 8+ years of experience in full-stack development, cloud architecture, and team leadership. Passionate about creating scalable solutions and mentoring junior developers. Proven track record of delivering high-impact projects in fast-paced environments."
  },
  "experience": [
    {
      "company": "TechCorp Solutions",
      "position": "Senior Software Engineer",
      "start_date": "2020-03",
      "end_date": "Present",
      "location": "San Francisco, CA",
      "achievements": [
        "Led a team of 6 engineers in developing a microservices-based platform that reduced system latency by 40%",
        "Implemented CI/CD pipelines that decreased deployment time by 65% and reduced deployment-related incidents by 80%",
        "Architected and deployed cloud-native solutions handling 1M+ daily active users",
        "Mentored 4 junior developers who were promoted to mid-level positions within 18 months"
      ]
    }
  ],
  "education": [
    {
      "institution": "University of California, Berkeley",
      "degree": "Master of Science",
      "field": "Computer Science",
      "start_date": "2015-08",
      "end_date": "2017-05",
      "location": "Berkeley, CA",
      "description": [
        "Specialization in Distributed Systems and Machine Learning",
        "Graduate Research Assistant in Cloud Computing Lab",
        "GPA: 3.92/4.0"
      ]
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "items": [
        "Python",
        "JavaScript",
        "Java",
        "Go",
        "TypeScript",
        "C++"
      ]
    }
  ],
  "projects": [
    {
      "name": "CloudScale Analytics Platform",
      "description": "Developed a distributed analytics platform capable of processing and analyzing large-scale data in real-time",
      "technologies": [
        "Python",
        "Apache Kafka",
        "Elasticsearch",
        "Docker",
        "Kubernetes",
        "React"
      ],
      "achievements": [
        "Processed 1TB+ of data daily with sub-second query response times",
        "Reduced infrastructure costs by 45% through efficient resource utilization",
        "Implemented real-time anomaly detection with 99.9% accuracy"
      ]
    }
  ]
}

Please process the provided resume and job description according to these guidelines and generate an optimized JSON resume that maximizes the candidate's chances of success while maintaining proper JSON formatting and authenticity.
`

const exampleJson = {
  "personal_info": {
    "full_name": "Alexander J. Thompson",
    "title": "Senior Software Engineer",
    "email": "alex.thompson@email.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "linkedin": "https://linkedin.com/in/alexjthompson",
    "github": "https://github.com/alexjt",
    "summary": "Innovative software engineer with 8+ years of experience in full-stack development, cloud architecture, and team leadership. Passionate about creating scalable solutions and mentoring junior developers. Proven track record of delivering high-impact projects in fast-paced environments."
  },
  "experience": [
    {
      "company": "TechCorp Solutions",
      "position": "Senior Software Engineer",
      "start_date": "2020-03",
      "end_date": "Present",
      "location": "San Francisco, CA",
      "achievements": [
        "Led a team of 6 engineers in developing a microservices-based platform that reduced system latency by 40%",
        "Implemented CI/CD pipelines that decreased deployment time by 65% and reduced deployment-related incidents by 80%",
        "Architected and deployed cloud-native solutions handling 1M+ daily active users",
        "Mentored 4 junior developers who were promoted to mid-level positions within 18 months"
      ]
    },
    {
      "company": "InnovateSoft Inc.",
      "position": "Software Engineer",
      "start_date": "2017-06",
      "end_date": "2020-02",
      "location": "Seattle, WA",
      "achievements": [
        "Developed and maintained RESTful APIs serving 500K+ daily requests",
        "Optimized database queries resulting in 30% improvement in application performance",
        "Collaborated with product team to implement new features used by 100K+ users",
        "Received 'Engineer of the Quarter' award for exceptional problem-solving skills"
      ]
    }
  ],
  "education": [
    {
      "institution": "University of California, Berkeley",
      "degree": "Master of Science",
      "field": "Computer Science",
      "start_date": "2015-08",
      "end_date": "2017-05",
      "location": "Berkeley, CA",
      "description": [
        "Specialization in Distributed Systems and Machine Learning",
        "Graduate Research Assistant in Cloud Computing Lab",
        "GPA: 3.92/4.0"
      ]
    },
    {
      "institution": "University of Washington",
      "degree": "Bachelor of Science",
      "field": "Computer Engineering",
      "start_date": "2011-09",
      "end_date": "2015-06",
      "location": "Seattle, WA",
      "description": [
        "Minor in Mathematics",
        "Dean's List all semesters",
        "President of Computer Science Club"
      ]
    }
  ],
  "skills": [
    {
      "category": "Programming Languages",
      "items": [
        "Python",
        "JavaScript",
        "Java",
        "Go",
        "TypeScript",
        "C++"
      ]
    },
    {
      "category": "Web Technologies",
      "items": [
        "React",
        "Node.js",
        "Angular",
        "Express.js",
        "HTML5",
        "CSS3",
        "GraphQL"
      ]
    },
    {
      "category": "Cloud & DevOps",
      "items": [
        "AWS",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "Terraform",
        "GitHub Actions"
      ]
    },
    {
      "category": "Databases",
      "items": [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Elasticsearch",
        "DynamoDB"
      ]
    }
  ],
  "projects": [
    {
      "name": "CloudScale Analytics Platform",
      "description": "Developed a distributed analytics platform capable of processing and analyzing large-scale data in real-time",
      "technologies": [
        "Python",
        "Apache Kafka",
        "Elasticsearch",
        "Docker",
        "Kubernetes",
        "React"
      ],
      "achievements": [
        "Processed 1TB+ of data daily with sub-second query response times",
        "Reduced infrastructure costs by 45% through efficient resource utilization",
        "Implemented real-time anomaly detection with 99.9% accuracy"
      ]
    },
    {
      "name": "Smart Inventory Management System",
      "description": "Built an AI-powered inventory management system for retail businesses",
      "technologies": [
        "Python",
        "TensorFlow",
        "React",
        "Node.js",
        "PostgreSQL",
        "Docker"
      ],
      "achievements": [
        "Reduced inventory forecasting errors by 35%",
        "Automated reordering process saving 20+ hours per week",
        "Integrated with 5 major e-commerce platforms"
      ]
    }
  ]
};

export function JsonPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [useHumanStyle, setUseHumanStyle] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema)
  });

  const onSubmit = async (data: ResumeFormData) => {
    try {
      setIsLoading(true);
      setShowConfetti(false);

      const jsonData = JSON.parse(data.jsonData);

      const response = await axios.post('http://localhost:8000/generate-resume/', jsonData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        }
      });

      if (response.status === 200) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
      let errorMessage = 'Error generating PDF. Please try again.';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          errorMessage = 'Invalid JSON data format. Please check your input.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-2 sm:p-4 md:p-6">
      {showConfetti && <ReactConfetti />}
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-card-foreground mb-4 sm:mb-6 md:mb-8 text-center">Resume Generator</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2 sm:gap-4">
              <label htmlFor="jsonData" className="text-base sm:text-lg font-medium text-card-foreground">
                JSON Input
              </label>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(useHumanStyle ? writingStylePrompt + baseAiPrompt : baseAiPrompt)
                      .then(() => {
                        const button = document.getElementById('copyAiButton');
                        if (button) {
                          button.textContent = 'Copied!';
                          setTimeout(() => {
                            button.innerHTML = '<svg class="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"></path><path d="M19 11v4a7 7 0 0 1-14 0v-4"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>Copy AI Prompt';
                          }, 3000);
                        }
                      })
                      .catch((err) => {
                        console.error('Failed to copy:', err);
                        const button = document.getElementById('copyAiButton');
                        if (button) {
                          button.textContent = 'Failed to copy';
                          setTimeout(() => {
                            button.innerHTML = '<svg class="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"></path><path d="M19 11v4a7 7 0 0 1-14 0v-4"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>Copy AI Prompt';
                          }, 3000);
                        }
                      });
                  }}
                  className="flex-1 sm:flex-none text-sm"
                  id="copyAiButton"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Copy AI Prompt
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = JSON.stringify(exampleJson, null, 2);
                    navigator.clipboard.writeText(text)
                      .then(() => {
                        const button = document.getElementById('copyButton');
                        if (button) {
                          button.textContent = 'Copied!';
                          setTimeout(() => {
                            button.innerHTML = '<svg class="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy valid JSON example';
                          }, 3000);
                        }
                      })
                      .catch((err) => {
                        console.error('Failed to copy:', err);
                        const button = document.getElementById('copyButton');
                        if (button) {
                          button.textContent = 'Failed to copy';
                          setTimeout(() => {
                            button.innerHTML = '<svg class="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy valid JSON example';
                          }, 3000);
                        }
                      });
                  }}
                  className="flex-1 sm:flex-none text-sm"
                  id="copyButton"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy valid JSON example
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none text-sm"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Writing Style: {useHumanStyle ? 'Human' : 'Default'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setUseHumanStyle(false)}>
                      Default
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUseHumanStyle(true)}>
                      Human Writer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('jsonData', '')}
                  className="flex-1 sm:flex-none text-sm"
                >
                  <Eraser className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              {...register('jsonData')}
              id="jsonData"
              rows={12}
              className="font-mono resize-none w-full"
              placeholder="Paste your JSON data here..."
            />
            {errors.jsonData && (
              <p className="text-sm text-destructive text-center mt-2">{errors.jsonData.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full text-base sm:text-lg py-6"
          >
            <DocumentArrowDownIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            {isLoading ? 'Generating PDF...' : 'Generate PDF'}
          </Button>
        </form>
      </div>
    </div>
  );
}
