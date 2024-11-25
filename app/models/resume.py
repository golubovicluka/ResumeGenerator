from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl
from datetime import date

class Education(BaseModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: str
    location: str
    description: Optional[List[str]] = None

class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: str
    location: str
    achievements: List[str]

class Skill(BaseModel):
    category: str
    items: List[str]

class Project(BaseModel):
    name: str
    description: str
    technologies: List[str]
    achievements: List[str]

class PersonalInfo(BaseModel):
    full_name: str
    title: str
    email: EmailStr
    phone: str
    location: str
    linkedin: HttpUrl
    github: HttpUrl
    summary: str

class Resume(BaseModel):
    personal_info: PersonalInfo
    experience: List[Experience]
    education: List[Education]
    skills: List[Skill]
    projects: List[Project]