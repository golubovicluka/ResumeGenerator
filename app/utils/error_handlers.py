import logging
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from weasyprint.urls import URLFetchingError

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ResumeGenerationError(Exception):
    """Custom exception for resume generation errors"""
    pass

async def validation_exception_handler(request: Request, exc: ValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Invalid resume data",
            "errors": exc.errors()
        }
    )

async def pdf_generation_exception_handler(request: Request, exc: ResumeGenerationError):
    logger.error(f"PDF generation error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Failed to generate PDF",
            "error": str(exc)
        }
    )

async def url_fetching_exception_handler(request: Request, exc: URLFetchingError):
    logger.error(f"URL fetching error: {str(exc)}")
    return JSONResponse(
        status_code=400,
        content={
            "detail": "Failed to fetch external resource",
            "error": str(exc)
        }
    )