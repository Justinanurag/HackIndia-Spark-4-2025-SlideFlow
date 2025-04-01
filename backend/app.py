from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional, List, Dict, Any
import os
import tempfile
import shutil
import uvicorn
from dotenv import load_dotenv
import json
import uuid
import time

# Import our modules
from utils.document_processor import extract_text_from_document
from utils.gemini_integration import generate_presentation_content
from utils.presentation_builder import create_presentation, export_to_docx, export_to_pdf

# Load environment variables
load_dotenv()

app = FastAPI(title="Slideflow API", 
              description="API for generating presentations from text prompts and documents",
              version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure temp directory exists
os.makedirs("temp", exist_ok=True)

# Templates data
templates = [
    {
        "id": "corporate",
        "name": "Corporate",
        "description": "Professional design for business presentations",
        "primary_color": "#0F62FE",
        "secondary_color": "#6F6F6F",
        "accent_color": "#4589FF",
    },
    {
        "id": "creative",
        "name": "Creative",
        "description": "Vibrant design for creative presentations",
        "primary_color": "#FF3366",
        "secondary_color": "#9C27B0",
        "accent_color": "#FFCC00",
    },
    {
        "id": "academic",
        "name": "Academic",
        "description": "Structured design for educational content",
        "primary_color": "#006064",
        "secondary_color": "#00897B",
        "accent_color": "#4DD0E1",
    },
    {
        "id": "marketing",
        "name": "Marketing",
        "description": "Persuasive design for sales pitches",
        "primary_color": "#FF5722",
        "secondary_color": "#FF9800",
        "accent_color": "#FFC107",
    },
    {
        "id": "minimalist",
        "name": "Minimalist",
        "description": "Clean, typography-focused design",
        "primary_color": "#212121",
        "secondary_color": "#757575",
        "accent_color": "#BDBDBD",
    },
]

@app.get("/")
async def root():
    return {"message": "Welcome to Slideflow API. Visit /docs for API documentation."}

@app.get("/api/templates")
async def get_templates():
    """Get the list of available presentation templates."""
    return templates

@app.post("/api/generate")
async def generate_presentation(
    template_style: str = Form(...),
    prompt: Optional[str] = Form(None),
    document: Optional[UploadFile] = File(None),
    slide_count: Optional[int] = Form(None),
):
    """Generate presentation content from prompt and/or document."""
    
    # Validate input
    if not prompt and not document:
        raise HTTPException(status_code=400, detail="Either prompt or document is required")
    
    document_text = None
    
    # Process uploaded document if provided
    if document:
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(document.filename)[1]) as temp_file:
                # Write the uploaded file to the temporary file
                shutil.copyfileobj(document.file, temp_file)
                temp_file_path = temp_file.name
            
            # Extract text from the document
            document_text = await extract_text_from_document(temp_file_path)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
    
    try:
        # Generate presentation content
        presentation_data = await generate_presentation_content(prompt, document_text, template_style, slide_count)
        
        # Store a copy of the full data with image prompts in the backend (for later use)
        # We'll store this in a temporary file with a unique ID
        
        # Create a unique ID for this presentation
        presentation_id = str(uuid.uuid4())
        timestamp = int(time.time())
        
        # Create a temp file to store the complete data (with image prompts)
        os.makedirs("temp/presentations", exist_ok=True)
        complete_data_path = f"temp/presentations/{presentation_id}_{timestamp}.json"
        
        with open(complete_data_path, "w") as f:
            json.dump(presentation_data, f)
        
        # Create a version to return to frontend with image_prompts removed
        frontend_data = presentation_data.copy()
        if "slides" in frontend_data:
            for slide in frontend_data["slides"]:
                if "image_prompt" in slide:
                    # Remove the image_prompt field
                    del slide["image_prompt"]
        
        # Add the presentation_id to the frontend data for future reference
        frontend_data["presentation_id"] = presentation_id
        
        return frontend_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate presentation: {str(e)}")

@app.post("/api/export")
async def export_presentation(data: Dict[str, Any]):
    """Export presentation in various formats (PPTX, DOCX, PDF)."""
    
    content_data = data.get("contentData")
    template_style = data.get("templateStyle", "corporate")
    export_format = data.get("format", "pptx")
    presentation_id = data.get("presentation_id")
    background_images = data.get("backgroundImages", True)  # Default to True for backward compatibility
    image_placement = data.get("imagePlacement", "background")  # Default to background
    
    if not content_data:
        raise HTTPException(status_code=400, detail="Content data is required")
    
    try:
        # If we have a presentation_id, try to retrieve the complete data with image prompts
        complete_data = None
        if presentation_id:
            try:
                # Find the corresponding JSON file in temp/presentations
                import glob
                presentation_files = glob.glob(f"temp/presentations/{presentation_id}_*.json")
                if presentation_files:
                    # Use the most recent file if multiple exist
                    most_recent_file = max(presentation_files, key=os.path.getctime)
                    with open(most_recent_file, "r") as f:
                        complete_data = json.load(f)
            except Exception as e:
                # If we can't load the complete data, we'll continue with the provided content_data
                print(f"Failed to load complete presentation data: {str(e)}")
        
        # Use the complete data (with image prompts) if available, otherwise use the content_data
        export_data = complete_data if complete_data else content_data
        
        # Create a unique filename for this export
        timestamp = int(time.time())
        filename_base = f"presentation_{timestamp}"
        
        if export_format == "pptx":
            # Create PowerPoint
            pptx_path = f"temp/{filename_base}.pptx"
            await create_presentation(
                export_data, 
                template_style, 
                pptx_path, 
                use_background_images=background_images,
                image_placement=image_placement
            )
            return FileResponse(
                pptx_path, 
                media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
                filename=f"{export_data.get('title', 'presentation')}.pptx"
            )
        
        elif export_format == "docx":
            # Create Word document
            docx_path = f"temp/{filename_base}.docx"
            await export_to_docx(export_data, docx_path)
            return FileResponse(
                docx_path,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                filename=f"{export_data.get('title', 'presentation')}.docx"
            )
        
        elif export_format == "pdf":
            # Create PDF
            pdf_path = f"temp/{filename_base}.pdf"
            # For PDF, we also use the background_images setting
            # First create a PowerPoint with/without background images
            with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as tmp_pptx:
                pptx_path = tmp_pptx.name
            await create_presentation(
                export_data, 
                template_style, 
                pptx_path, 
                use_background_images=background_images,
                image_placement=image_placement
            )
            # Then convert to PDF
            await export_to_pdf(export_data, template_style, pdf_path, pptx_path=pptx_path)
            return FileResponse(
                pdf_path, 
                media_type="application/pdf",
                filename=f"{export_data.get('title', 'presentation')}.pdf"
            )
        
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported export format: {export_format}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export presentation: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 