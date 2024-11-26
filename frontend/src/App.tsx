import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileTextIcon, FormInputIcon } from 'lucide-react';
import { Copy } from 'lucide-react';
import { cn } from "@/lib/utils";
import { JsonPage } from './pages/JsonPage';
import { FormsPage } from './pages/FormsPage';

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

const exampleJson = {
  "personal_info": {
    "full_name": "Full Name",
    "title": "Job Title",
    "email": "example@domain.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "summary": "Professional summary goes here"
  },
  "experience": [
    {
      "company": "Company Name",
      "position": "Position Title",
      "start_date": "2023-01",
      "end_date": "Present",
      "location": "City, Country",
      "achievements": [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ],
  "education": [
    {
      "institution": "Institution Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "start_date": "2023",
      "end_date": "2027",
      "location": "City, Country",
      "description": ["Description of studies"]
    }
  ],
  "skills": [
    {
      "category": "Category Name",
      "items": [
        "Skill 1",
        "Skill 2"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": [
        "Technology 1",
        "Technology 2"
      ],
      "achievements": [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ]
}

function Navigation() {
  const location = useLocation();

  const buttonClasses = (isActive: boolean) => cn(
    "w-32 text-white",
    isActive
      ? "bg-primary hover:bg-primary/90"
      : "hover:bg-primary/80"
  );

  return (
    <nav className="max-w-7xl w-full mx-auto p-4 flex justify-center gap-4">
      <Link to="/">
        <Button
          variant={location.pathname === "/" ? "default" : "ghost"}
          className={buttonClasses(location.pathname === "/")}
        >
          <FileTextIcon className="h-4 w-4 mr-2" />
          JSON Input
        </Button>
      </Link>
      <Link to="/forms">
        <Button
          variant={location.pathname === "/forms" ? "default" : "ghost"}
          className={buttonClasses(location.pathname === "/forms")}
        >
          <FormInputIcon className="h-4 w-4 mr-2" />
          Form Input
        </Button>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="w-[80%] min-h-screen flex flex-col">
        <div className="w-full mx-auto flex flex-col flex-1">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Navigation />
          </header>

          <main className="flex-1 flex items-center justify-center w-full">
            <Routes>
              <Route path="/" element={<JsonPage />} />
              <Route path="/forms" element={<FormsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
