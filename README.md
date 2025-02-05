# Resume Generator

A full-stack application for generating professional resumes with customizable templates and styling.

## Features

- Resume generation with customizable templates
- PDF export functionality
- Frontend interface with custom styling and navigation
- Robust error handling and logging
- Input validation using Pydantic models
- Multiple writing style options through AI prompts

## Tech Stack

### Backend
- Python
- Pydantic for data validation
- PDF generation capabilities
- Exception handling and logging system

### Frontend
- React
- Component-based architecture
- Integrated with backend services

## Setup

1. Install project dependencies for backend:
```bash
pip install -r requirements.txt
```

2. For frontend app:
 ```bash
   npm i
   ```
3. Run backend application - main.py
4. Run frontend application - npm run dev

## Development

The project follows a monorepo structure with both frontend and backend code in the same repository. Recent updates include:

- Integration of AI-powered writing style customization
- Improved PDF generation with error handling
- Migration of frontend code into the main repository
- Implementation of a dedicated navigation component
- Addition of resume templates and styling

## Error Handling

The application implements comprehensive error handling for:
- Input validation
- PDF generation
- Template processing
- General exceptions

---
Last updated: December 2024
