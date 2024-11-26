from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML, CSS
from pathlib import Path
from app.models.resume import Resume
import logging
import os

logger = logging.getLogger(__name__)

def generate_pdf(resume: Resume, output_path: str) -> None:
    try:
        template_dir = Path(__file__).parent.parent.parent / 'app' / 'templates'
        css_path = Path(__file__).parent.parent.parent / 'app' / 'static' / 'styles' / 'resume.css'
        
        if not template_dir.exists():
            raise Exception(f"Template directory not found at: {template_dir}")
        if not css_path.exists():
            raise Exception(f"CSS file not found at: {css_path}")
            
        logger.info(f"Template directory: {template_dir}")
        logger.info(f"CSS path: {css_path}")
        
        env = Environment(loader=FileSystemLoader(str(template_dir)))
        template = env.get_template('resume.html')
        
        html_content = template.render(
            personal_info=resume.personal_info,
            experience=resume.experience,
            education=resume.education,
            skills=resume.skills,
            projects=resume.projects
        )
        
        debug_html_path = f"{output_path}_debug.html"
        try:
            with open(debug_html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            logger.info(f"Saved debug HTML to: {debug_html_path}")
        except Exception as e:
            logger.warning(f"Failed to save debug HTML: {e}")
        
        html = HTML(string=html_content)
        css = CSS(filename=str(css_path))
        
        html.write_pdf(
            target=output_path,
            stylesheets=[css]
        )
        
        if not os.path.exists(output_path):
            raise Exception("PDF file was not created")
        if os.path.getsize(output_path) == 0:
            raise Exception("PDF file is empty")
            
        logger.info(f"Successfully generated PDF at: {output_path}")
        
    except Exception as e:
        logger.error(f"Failed to generate PDF: {e}")
        raise