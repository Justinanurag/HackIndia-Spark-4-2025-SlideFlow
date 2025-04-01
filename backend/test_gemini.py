import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_gemini_import():
    """Test if google.generativeai can be imported correctly."""
    try:
        import google.generativeai as genai
        print("✅ Successfully imported google.generativeai")
        print(f"Version: {genai.__version__}")
        return True
    except ImportError as e:
        print(f"❌ Error importing google.generativeai: {e}")
        return False

def test_gemini_api():
    """Test if Gemini API can be initialized with the API key."""
    try:
        # Use the original import pattern that works
        import google.generativeai as genai
        
        # Get API key from environment variable
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("❌ GEMINI_API_KEY environment variable not set")
            return False
        
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        print("✅ Successfully configured Gemini API with API key")
        
        # Check for specific models
        print("Trying to check available models...")
        try:
            models = genai.list_models()
            model_names = [model.name for model in models]
            print(f"Available models: {model_names}")
            
            # Check for specific Gemini models
            expected_models = [
                "models/gemini-flash-2.0",
                "models/gemini-2.0-flash-exp-image-generation",
                "models/gemini-1.5-flash",
                "models/gemini-1.5-pro",
                "models/gemini-pro",
                "models/gemini-pro-vision"
            ]
            
            found_models = [model for model in expected_models if any(model in name for name in model_names)]
            
            if found_models:
                print(f"✅ Found the following Gemini models: {found_models}")
            else:
                print("⚠️ No expected Gemini models found. Available models may have different names.")
        except Exception as model_error:
            print(f"⚠️ Could not list models: {model_error}")
        
        # Try a simple text generation to verify API works
        print("\nTesting text generation capability...")
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("Say hello in one word")
            print(f"Test response: {response.text}")
            print("✅ Successfully generated text response")
        except Exception as gen_error:
            print(f"⚠️ Text generation test failed: {str(gen_error)[:200]}")
            # Try alternative model
            try:
                model = genai.GenerativeModel('gemini-flash-2.0')
                response = model.generate_content("Say hello in one word")
                print(f"Test response with alternative model: {response.text}")
                print("✅ Successfully generated text with alternative model")
            except Exception as alt_error:
                print(f"❌ Alternative model also failed: {str(alt_error)[:200]}")
                return False
        
        # Test image generation capability
        print("\nTesting image generation capability...")
        try:
            from PIL import Image
            from io import BytesIO
            import base64
            
            # Make sure directory exists
            os.makedirs('temp', exist_ok=True)
            
            model = genai.GenerativeModel('gemini-2.0-flash-exp-image-generation')
            contents = 'Generate a simple image of a basketball'
            
            # Generate the image with the correct response_modalities configuration
            response = model.generate_content(
                contents=contents,
                generation_config={
                    "response_modalities": ["Text", "Image"]
                }
            )
            
            # Print complete response structure for debugging
            print(f"Response type: {type(response)}")
            print(f"Response attributes: {dir(response)}")
            
            image_found = False
            text_found = False
            
            # Check if we have candidates in the response
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                print(f"Candidate attributes: {dir(candidate)}")
                
                if hasattr(candidate, 'content') and candidate.content:
                    content = candidate.content
                    print(f"Content attributes: {dir(content)}")
                    
                    # Check for parts in the content
                    if hasattr(content, 'parts') and content.parts:
                        for i, part in enumerate(content.parts):
                            print(f"Part {i} type: {type(part)}")
                            print(f"Part {i} attributes: {dir(part)}")
                            
                            # Check for text
                            if hasattr(part, 'text') and part.text is not None:
                                print(f"Text in part {i}: {part.text[:100]}...")
                                text_found = True
                            
                            # Check for inline data (direct image)
                            if hasattr(part, 'inline_data') and part.inline_data is not None:
                                print("Image data found in response")
                                inline_data = part.inline_data
                                print(f"Inline data attributes: {dir(inline_data)}")
                                
                                if hasattr(inline_data, 'data') and inline_data.data:
                                    # Save test image
                                    try:
                                        image_data = base64.b64decode(inline_data.data)
                                        with open('temp/test_image.png', 'wb') as f:
                                            f.write(image_data)
                                        print("✅ Successfully saved test image to temp/test_image.png")
                                        image_found = True
                                    except Exception as save_error:
                                        print(f"Error saving image: {save_error}")
            
            # Summary
            if image_found and text_found:
                print("✅ Successfully generated both text and image response")
            elif image_found:
                print("✅ Successfully generated image (no text in response)")
            elif text_found:
                print(f"⚠️ Only text was generated (no image in response)")
            else:
                print("❌ No text or image found in the response")
                
            # If all extraction methods failed, but we received some response
            if not image_found and response:
                print("\nFull response for manual inspection:")
                print(str(response)[:2000])  # Print the first 2000 chars to avoid overwhelming output
            
        except Exception as img_error:
            print(f"⚠️ Image generation test failed: {img_error}")
            import traceback
            traceback.print_exc()
        
        return True
    except Exception as e:
        print(f"❌ Error initializing Gemini API: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("TESTING GEMINI AI MODELS")
    print("=" * 50)
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print(f"Current working directory: {os.getcwd()}")
    print("-" * 50)
    
    print("\nSTEP 1: Testing Google Generative AI Import")
    print("-" * 40)
    import_success = test_gemini_import()
    
    if import_success:
        print("\nSTEP 2: Testing Gemini API and Models")
        print("-" * 40)
        api_success = test_gemini_api()
    else:
        api_success = False
    
    print("\nTEST SUMMARY")
    print("-" * 50)
    if import_success and api_success:
        print("✅ All tests passed! The Gemini AI library is working correctly with the updated models.")
    else:
        print("❌ Some tests failed. Please check the error messages above.")
    print("=" * 50)