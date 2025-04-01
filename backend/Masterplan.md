# Project Overview

Create a full-stack web application that generates professional presentations from user prompts and/or uploaded documents. The application will leverage Google's Gemini LLM for content generation and ModelLab's text-to-image API for visual assets, formatting everything into downloadable presentation files in multiple formats.

## Tech Stack

- **Frontend:** React (v18+), TypeScript
- **Backend:** Python with FastAPI or Flask
- **File Generation:** python-pptx, python-docx, and PDF libraries

## Frontend Requirements

### User Interface
- Clean, modern UI with React and TypeScript featuring:
  - Header with app name and navigation
  - Main input section with:
    - Text prompt field (with character counter)
    - Document upload area supporting PDF, DOCX, and TXT files with drag-and-drop
    - Template selection carousel showing 5-7 professionally designed options
    - Generate button with loading state
  - Preview panel showing the generated slides in real-time
  - Export section with format options (PPT, DOCX, PDF)

### Template System
- 5 base presentation templates:
  - Corporate/Business (formal, blue/gray palette)
  - Creative/Design (vibrant, flexible layout)
  - Academic/Educational (structured, clean design)
  - Sales/Marketing (persuasive, action-oriented)
  - Minimalist (high contrast, typography-focused)

### User Experience
- Show generation progress indicators
- Implement error handling with user-friendly messages
- Allow basic content editing before export
- Enable slide reordering via drag-and-drop
- Ensure responsive design for desktop and tablet use

### Technical Implementation
- Use TypeScript for type safety
- Implement state management (Redux or Context API)
- Create API service layer for backend communication
- Add form validation for user inputs
- Implement WebSocket connection for real-time updates

## Backend Requirements

### API Endpoints
Implement RESTful endpoints:
- POST /api/generate: Process text prompts and/or document files
- GET /api/templates: Return available presentation templates
- POST /api/export: Generate and return the final presentation

### Document Processing
- Implement text extraction from various formats
- Create summarization and key point extraction
- Design topic clustering to organize content into logical slides

### Gemini LLM Integration

```python
def generate_presentation_content(prompt, document_text=None, template_style="corporate"):
    import google.generativeai as genai
    import json
    
    # Configure the Gemini API
    genai.configure(api_key="YOUR_GEMINI_API_KEY")
    
    # Create the model instance
    model = genai.GenerativeModel('gemini-pro')
    
    # Create a structured prompt for the LLM
    structure_prompt = f"""
    Create a professional presentation based on the following information:
    
    {"INPUT TEXT: " + prompt if prompt else ""}
    {"DOCUMENT CONTENT: " + document_text if document_text else ""}
    
    The presentation should follow the {template_style} style and be structured as follows:
    
    1. Title slide with an engaging headline
    2. Introduction slides (1-2)
    3. Main content slides (3-6)
    4. Summary/conclusion slide
    
    For each slide, provide:
    - A concise title
    - 3-5 bullet points of content (except for title slide)
    - A brief description of an appropriate image to accompany the slide
    
    Format your response as a JSON object with the following structure:
    {{
      "slides": [
        {{
          "type": "title",
          "title": "Slide Title Here",
          "subtitle": "Optional Subtitle Here",
          "image_prompt": "Description for image generation"
        }},
        {{
          "type": "content",
          "title": "Slide Title Here",
          "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
          "notes": "Optional speaker notes",
          "image_prompt": "Description for image generation"
        }},
        // Additional slides...
      ]
    }}
    """
    
    # Generate content from Gemini
    response = model.generate_content(structure_prompt)
    
    # Extract and parse the JSON response
    try:
        # Find JSON in the response text
        response_text = response.text
        # Parse the JSON structure from the response
        import re
        json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            json_str = response_text
            
        presentation_data = json.loads(json_str)
        return presentation_data
    except Exception as e:
        raise Exception(f"Failed to parse LLM response: {str(e)}")
```

### Image Generation with ModelLab API

```python
def generate_slide_image(prompt, template_style):
    import requests
    import json
    
    # Construct image prompt based on slide content and template style
    enhanced_prompt = f"{prompt} {get_style_keywords(template_style)}"
    
    url = "https://modelslab.com/api/v6/realtime/text2img"
    payload = json.dumps({
        "key": "<YOUR_API_KEY>",
        "prompt": enhanced_prompt,
        "negative_prompt": "low quality, blurry, distorted, watermark, signature, bad proportions",
        "width": "1024",  # Presentation-friendly dimensions
        "height": "768",
        "safety_checker": True,
        "seed": None,
        "samples": 1,
        "base64": False,
        "webhook": None,
        "track_id": None
    })
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    response = requests.request("POST", url, headers=headers, data=payload)
    result = response.json()
    
    if result["status"] == "success":
        return result["output"][0]  # Return the image URL
    else:
        raise Exception("Image generation failed")
```

### Presentation Assembly Engine

```python
def create_presentation(content_data, template_style="corporate"):
    from pptx import Presentation
    from pptx.util import Inches, Pt
    import io
    import requests
    
    # Load the base template
    template_path = f"templates/{template_style}.pptx"
    prs = Presentation(template_path)
    
    # Get slide layouts
    title_layout = prs.slide_layouts[0]  # Title slide
    content_layout = prs.slide_layouts[1]  # Content slide with title and content
    
    # Create slides based on the LLM-generated content
    for slide_data in content_data["slides"]:
        if slide_data["type"] == "title":
            # Create title slide
            slide = prs.slides.add_slide(title_layout)
            slide.shapes.title.text = slide_data["title"]
            if "subtitle" in slide_data and slide_data["subtitle"]:
                slide.placeholders[1].text = slide_data["subtitle"]
            
            # Generate and add image if specified
            if "image_prompt" in slide_data and slide_data["image_prompt"]:
                image_url = generate_slide_image(slide_data["image_prompt"], template_style)
                if image_url:
                    # Download image
                    response = requests.get(image_url)
                    image_stream = io.BytesIO(response.content)
                    
                    # Add image to slide
                    slide.shapes.add_picture(image_stream, Inches(5), Inches(2), width=Inches(4))
                
        elif slide_data["type"] == "content":
            # Create content slide
            slide = prs.slides.add_slide(content_layout)
            slide.shapes.title.text = slide_data["title"]
            
            # Add bullet points
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()
            
            for bullet in slide_data["bullets"]:
                p = text_frame.add_paragraph()
                p.text = bullet
                p.level = 0
            
            # Generate and add image if specified
            if "image_prompt" in slide_data and slide_data["image_prompt"]:
                image_url = generate_slide_image(slide_data["image_prompt"], template_style)
                if image_url:
                    # Download image
                    response = requests.get(image_url)
                    image_stream = io.BytesIO(response.content)
                    
                    # Add image to slide in appropriate position based on template
                    if template_style in ["corporate", "academic"]:
                        # Right side of slide
                        slide.shapes.add_picture(image_stream, Inches(6), Inches(2), width=Inches(3))
                    else:
                        # Bottom of slide
                        slide.shapes.add_picture(image_stream, Inches(2), Inches(4), width=Inches(6))
    
    # Save to memory stream
    ppt_stream = io.BytesIO()
    prs.save(ppt_stream)
    ppt_stream.seek(0)
    
    return ppt_stream
```

### File Export Functions

```python
def export_to_pptx(content_data, template_style):
    # Create PowerPoint directly
    return create_presentation(content_data, template_style)
    
def export_to_docx(content_data):
    from docx import Document
    import io
    
    # Create a new Word document
    doc = Document()
    
    # Add content from slides
    for slide_data in content_data["slides"]:
        # Add slide title as heading
        doc.add_heading(slide_data["title"], level=1)
        
        # Add bullets if present
        if "bullets" in slide_data:
            for bullet in slide_data["bullets"]:
                doc.add_paragraph(bullet, style='List Bullet')
        
        # Add notes if present
        if "notes" in slide_data and slide_data["notes"]:
            doc.add_paragraph(slide_data["notes"], style='Intense Quote')
        
        # Add page break between slides
        doc.add_page_break()
    
    # Save to memory stream
    docx_stream = io.BytesIO()
    doc.save(docx_stream)
    docx_stream.seek(0)
    
    return docx_stream
    
def export_to_pdf(content_data, template_style):
    import tempfile
    from subprocess import call
    import os
    
    # Create PPTX first
    pptx_stream = create_presentation(content_data, template_style)
    
    # Save PPTX to temporary file
    with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as tmp_pptx:
        tmp_pptx.write(pptx_stream.getvalue())
        tmp_pptx_path = tmp_pptx.name
    
    # Convert to PDF using LibreOffice (server must have LibreOffice installed)
    pdf_path = tmp_pptx_path.replace('.pptx', '.pdf')
    call(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', 
           os.path.dirname(tmp_pptx_path), tmp_pptx_path])
    
    # Read PDF file
    with open(pdf_path, 'rb') as pdf_file:
        pdf_data = pdf_file.read()
    
    # Clean up temporary files
    os.unlink(tmp_pptx_path)
    os.unlink(pdf_path)
    
    return io.BytesIO(pdf_data)
```

## Data Flow
1. User inputs text prompt and/or uploads document
2. Backend processes document and/or prompt
3. Gemini LLM generates structured presentation content
4. ModelLab API creates relevant visuals based on contextual prompts
5. Backend assembles content and images into presentation format
6. Frontend displays preview of generated slides
7. User can make edits if needed
8. User selects export format and downloads final file

## Testing Requirements
- Frontend: Unit tests for components, integration tests for user flows
- Backend: Unit tests for core functions, integration tests for the generation pipeline
- End-to-end testing for the complete application workflow