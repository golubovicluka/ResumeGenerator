from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.utils.error_handlers import (
    validation_exception_handler,
    pdf_generation_exception_handler,
    ResumeGenerationError,
    url_fetching_exception_handler
)
from weasyprint.urls import URLFetchingError
from pydantic import ValidationError
from app.models.resume import Resume
from app.services.pdf_generator import generate_pdf
from app.utils.logger import setup_logger
import tempfile
import os

logger = setup_logger()

app = FastAPI(title="Resume Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(ValidationError, validation_exception_handler)
app.add_exception_handler(ResumeGenerationError, pdf_generation_exception_handler)
app.add_exception_handler(URLFetchingError, url_fetching_exception_handler)


@app.post("/generate-resume/", response_class=FileResponse)
async def generate_resume(resume: Resume):
    pdf_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            pdf_path = tmp.name
        
        generate_pdf(resume, pdf_path)
        
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="PDF generation failed - file not created")
        if os.path.getsize(pdf_path) == 0:
            raise HTTPException(status_code=500, detail="PDF generation failed - file is empty")
            
        return FileResponse(
            pdf_path,
            media_type='application/pdf',
            filename=f"{resume.personal_info.full_name.replace(' ', '_')}_resume.pdf",
            background=None
        )
            
    except Exception as e:
        if pdf_path and os.path.exists(pdf_path):
            try:
                os.unlink(pdf_path)
            except Exception as cleanup_error:
                logger.error(f"Failed to clean up file after error: {cleanup_error}")
        raise HTTPException(status_code=500, detail=str(e))           


@app.get("/test-template")
async def test_template(resume: Resume):
    try:
        template = env.get_template('resume.html')
        html_content = template.render(resume=resume)
        return HTMLResponse(content=html_content, media_type="text/html")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Template error: {str(e)}")
