import os
import json
import asyncio
import re
from typing import Optional, Dict, Any

async def generate_presentation_content(
    prompt: Optional[str], 
    document_text: Optional[str], 
    template_style: str = "corporate",
    slide_count: Optional[int] = None
) -> Dict[str, Any]:
    """
    Generate structured presentation content using Google's Gemini LLM.
    
    Args:
        prompt: Text prompt describing the presentation content
        document_text: Text extracted from uploaded document
        template_style: The chosen presentation template style
        slide_count: The number of slides to generate (optional)
        
    Returns:
        Structured presentation data as a dictionary
    """
    try:
        try:
            # Try importing with specific version-compatible way
            import google.generativeai as genai
        except ImportError as e:
            print(f"ImportError: {e}")
            print("Trying alternative import methods...")
            # If the first import fails, try to import directly
            import sys
            print(f"Python path: {sys.path}")
            print("Attempting pip install...")
            import subprocess
            subprocess.check_call([sys.executable, "-m", "pip", "install", "google-generativeai==0.7.1"])
            print("Installation completed, retrying import...")
            import google.generativeai as genai
        
        # Get API key from environment variable
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        
        # Create the model instance with the latest gemini model for text generation
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # Default slide count if not provided
        slide_count_text = ""
        if slide_count:
            total_slides = max(3, min(slide_count, 20))  # Limit between 3 and 20 slides
            slide_count_text = f"\nCreate a presentation with approximately {total_slides} slides in total."
        
        # Create a structured prompt for the LLM
        structure_prompt = f"""
        Create a professional presentation based on the following information:
        
        {"INPUT TEXT: " + prompt if prompt else ""}
        {"DOCUMENT CONTENT: " + document_text if document_text else ""}
        
        The presentation should follow the {template_style} style and be structured as follows:
        
        1. Title slide with an engaging headline
        2. Introduction slides (1-2)
        3. Main content slides (3-6)
        4. Summary/conclusion slide{slide_count_text}
        
        For each slide, provide:
        - A concise title
        - 3-5 bullet points of content (except for title slide)
        - A dedicated image_prompt field with a detailed description for AI image generation (10-20 words)
        
        IMPORTANT REQUIREMENTS:
        1. ALWAYS include a detailed "image_prompt" field for EVERY slide
        2. The image_prompt should describe a relevant, high-quality image that complements the slide content
        3. Make image_prompt detailed enough for AI image generation (what to show, style, mood, colors)
        4. It is CRITICAL that you include bullet points for each content slide
        
        Format your response STRICTLY as a JSON object with the following structure:
        {{
          "slides": [
            {{
              "type": "title",
              "title": "Slide Title Here",
              "subtitle": "Optional Subtitle Here",
              "image_prompt": "Detailed image description for generation"
            }},
            {{
              "type": "content",
              "title": "Slide Title Here",
              "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
              "image_prompt": "Detailed image description for generation"
            }},
            // Additional slides...
          ]
        }}

        Make sure:
        - Every slide has the "image_prompt" field with a detailed visual description
        - Every content slide has the "bullets" field with an array of bullet points
        - The image prompts are descriptive and specific for high-quality generation
        """
        
        # Wrap in asyncio loop to make it async-compatible
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, lambda: model.generate_content(structure_prompt))
        
        # Extract and parse the JSON response
        try:
            # Find JSON in the response text
            response_text = response.text
            print("Raw response from Gemini:", response_text[:300] + "...")
            
            # Parse the JSON structure from the response
            json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                json_str = response_text
            
            print("Extracted JSON string:", json_str[:300] + "...")
            
            presentation_data = json.loads(json_str)
            
            # Debug: Print the structure of the presentation data
            print("Parsed presentation data structure:")
            for i, slide in enumerate(presentation_data.get("slides", [])):
                print(f"Slide {i+1} - Type: {slide.get('type')}, Title: {slide.get('title')}")
                if "image_prompt" in slide:
                    print(f"  Image Prompt: {slide['image_prompt']}")
                if "bullets" in slide:
                    print(f"  Bullets: {len(slide['bullets'])} items")
                    for bullet in slide["bullets"]:
                        print(f"    - {bullet[:30]}..." if len(bullet) > 30 else f"    - {bullet}")
                else:
                    print("  No bullets found")
            
            # Add a title to the presentation data if it doesn't exist
            if "title" not in presentation_data and "slides" in presentation_data and len(presentation_data["slides"]) > 0:
                if presentation_data["slides"][0]["type"] == "title":
                    presentation_data["title"] = presentation_data["slides"][0]["title"]
                    
            # Ensure each content slide has bullets
            if "slides" in presentation_data:
                for slide in presentation_data["slides"]:
                    # Ensure image prompt exists for every slide
                    if "image_prompt" not in slide:
                        slide["image_prompt"] = f"Professional {template_style} style image related to {slide.get('title', 'presentation topic')}"
                    
                    if slide.get("type") in ["content", "bullets"] and "bullets" not in slide:
                        # Create default bullets from content if available
                        if "content" in slide and slide["content"]:
                            # Split content by newlines or sentences to create bullets
                            content = slide["content"]
                            sentences = re.split(r'(?<=[.!?])\s+', content)
                            slide["bullets"] = [s.strip() for s in sentences if s.strip()]
                        else:
                            # Create placeholder bullets
                            slide["bullets"] = [
                                f"Key point about {slide.get('title', 'this topic')}",
                                "Additional information",
                                "Further details"
                            ]
                            
            return presentation_data
        except Exception as e:
            print(f"Failed to parse LLM response: {str(e)}")
            print(f"Response text was: {response_text[:500]}...")
            raise Exception(f"Failed to parse LLM response: {str(e)}")
    
    except Exception as e:
        print(f"Error generating presentation content: {str(e)}")
        raise

def get_style_keywords(template_style: str) -> str:
    """Get style-specific keywords for image generation prompts."""
    style_keywords = {
        "corporate": "professional, business, corporate, clean design, blue tones, formal",
        "creative": "vibrant, colorful, artistic, creative, innovative, playful",
        "academic": "educational, scholarly, structured, clean, organized, formal",
        "marketing": "persuasive, bold, attention-grabbing, action-oriented, sales focused",
        "minimalist": "minimal, clean, high contrast, typography focused, elegant, simple"
    }
    
    return style_keywords.get(template_style, "professional, clean") 