import os
import logging
import asyncio
from pathlib import Path
from typing import Optional
from io import BytesIO
import base64
from PIL import Image, ImageDraw, ImageFont
import hashlib
import time
from .gemini_integration import get_style_keywords

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def generate_slide_image(prompt: str, template_style: str = "corporate") -> Optional[str]:
    """
    Generate an image for a slide using Google's Gemini API with gemini-2.0-flash-exp-image-generation model.
    
    Args:
        prompt: Text prompt describing the desired image
        template_style: Presentation template style to influence image style
        
    Returns:
        Path to the generated image, or None if generation failed
    """
    try:
        # Get the API key from environment
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY environment variable is not set")
            return get_placeholder_image(template_style)
        
        # Check if prompt is valid
        if not prompt or len(prompt.strip()) < 5:
            logger.warning(f"Invalid image prompt: '{prompt}'. Using a default prompt based on template style.")
            prompt = f"Professional {template_style} style presentation visual with abstract design"
        
        # Enhance prompt with style-specific keywords
        style_keywords = get_style_keywords(template_style)
        enhanced_prompt = f"{prompt}. {style_keywords}"
        
        logger.info(f"Generating image with prompt: '{enhanced_prompt}'")
        
        # Create a temporary directory for images if it doesn't exist
        temp_dir = Path("temp/images")
        temp_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate a unique filename based on timestamp and hash of prompt
        timestamp = int(time.time())
        prompt_hash = hashlib.md5(enhanced_prompt.encode()).hexdigest()[:8]
        image_filename = f"gemini_img_{timestamp}_{prompt_hash}.png"
        image_path = str(temp_dir / image_filename)
        
        # Import Gemini API
        try:
            import google.generativeai as genai
        except ImportError as e:
            logger.error(f"ImportError: {e}")
            logger.info("Trying alternative import methods...")
            # If the first import fails, try to import directly
            import sys
            logger.info(f"Python path: {sys.path}")
            logger.info("Attempting pip install...")
            import subprocess
            subprocess.check_call([sys.executable, "-m", "pip", "install", "google-generativeai==0.7.1"])
            logger.info("Installation completed, retrying import...")
            import google.generativeai as genai
        
        # Run image generation in an executor to keep async flow
        loop = asyncio.get_event_loop()
        
        def generate_image():
            try:
                # Configure Gemini API with API key
                genai.configure(api_key=api_key)
                
                # Use the latest Gemini model that supports image generation
                model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
                
                # Generate the image with the correct response_modalities configuration
                response = model.generate_content(
                    contents=enhanced_prompt,
                    generation_config={
                        "response_modalities": ["Text", "Image"]
                    }
                )
                
                # Extract and save the image
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        # Decode the base64 image data
                        image_data = base64.b64decode(part.inline_data.data)
                        
                        # Save the image to file
                        with open(image_path, 'wb') as f:
                            f.write(image_data)
                        
                        logger.info(f"Image saved to {image_path}")
                        return image_path
                
                logger.warning("No image data found in response, using placeholder instead")
                return get_placeholder_image(template_style)
                
            except Exception as e:
                logger.exception(f"Error generating image with Gemini: {str(e)}")
                return get_placeholder_image(template_style)
        
        # Execute in a thread pool
        result = await loop.run_in_executor(None, generate_image)
        return result
            
    except Exception as e:
        logger.exception(f"Error in image generation: {str(e)}")
        return get_placeholder_image(template_style)

def get_style_keywords(template_style: str) -> str:
    """Get style-specific keywords for image generation prompts."""
    style_keywords = {
        "corporate": "professional, business, corporate, clean design, blue tones, formal, high quality, photo-realistic",
        "creative": "vibrant, colorful, artistic, creative, innovative, playful, high quality, photo-realistic",
        "academic": "educational, scholarly, structured, clean, organized, formal, high quality, photo-realistic",
        "marketing": "persuasive, bold, attention-grabbing, action-oriented, sales focused, high quality, photo-realistic",
        "minimalist": "minimal, clean, high contrast, typography focused, elegant, simple, high quality, photo-realistic"
    }
    
    return style_keywords.get(template_style, "professional, clean, high quality, photo-realistic")

def get_placeholder_image(template_style: str) -> str:
    """Get a path to a placeholder image for the given template style."""
    # Define paths to placeholder images
    placeholder_dir = Path("static/placeholders")
    placeholder_dir.mkdir(parents=True, exist_ok=True)
    
    placeholder_images = {
        "corporate": "static/placeholders/corporate_placeholder.png",
        "creative": "static/placeholders/creative_placeholder.png",
        "academic": "static/placeholders/academic_placeholder.png",
        "marketing": "static/placeholders/marketing_placeholder.png",
        "minimalist": "static/placeholders/minimalist_placeholder.png"
    }
    
    placeholder_path = placeholder_images.get(template_style, "static/placeholders/default_placeholder.png")
    
    # Check if placeholder exists, if not create a basic one
    if not os.path.exists(placeholder_path):
        create_placeholder_image(placeholder_path, template_style)
    
    logger.info(f"Using placeholder image for '{template_style}' template: {placeholder_path}")
    return placeholder_path

def create_placeholder_image(path: str, template_style: str):
    """Create a basic placeholder image with the template name."""
    try:
        # Define colors for different template styles
        colors = {
            "corporate": (15, 98, 254),   # Blue
            "creative": (255, 51, 102),   # Pink
            "academic": (0, 96, 100),     # Teal
            "marketing": (255, 87, 34),   # Orange
            "minimalist": (33, 33, 33)    # Dark gray
        }
        
        # Get color for the template style
        color = colors.get(template_style, (128, 128, 128))  # Default gray
        
        # Create a blank image
        img = Image.new('RGB', (1024, 768), color=color)
        draw = ImageDraw.Draw(img)
        
        # Add template name text
        try:
            # Try to use a system font
            font_path = None
            if os.name == 'nt':  # Windows
                font_path = "C:\\Windows\\Fonts\\Arial.ttf"
            elif os.name == 'posix':  # Linux/Mac
                font_paths = [
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                    "/System/Library/Fonts/Helvetica.ttc"
                ]
                for p in font_paths:
                    if os.path.exists(p):
                        font_path = p
                        break
            
            if font_path and os.path.exists(font_path):
                font = ImageFont.truetype(font_path, 60)
            else:
                font = ImageFont.load_default()
                
        except Exception:
            font = ImageFont.load_default()
        
        # Draw the text
        text = f"{template_style.capitalize()} Placeholder"
        text_width, text_height = draw.textsize(text, font=font) if hasattr(draw, 'textsize') else (400, 60)
        position = ((1024 - text_width) // 2, (768 - text_height) // 2)
        
        # Add a white text for visibility
        draw.text(position, text, fill=(255, 255, 255), font=font)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Save the image
        img.save(path)
        logger.info(f"Created placeholder image at {path}")
        
    except Exception as e:
        logger.exception(f"Error creating placeholder image: {str(e)}")
        # Create an even more basic image if PIL drawing fails
        img = Image.new('RGB', (1024, 768), color=colors.get(template_style, (128, 128, 128)))
        os.makedirs(os.path.dirname(path), exist_ok=True)
        img.save(path) 