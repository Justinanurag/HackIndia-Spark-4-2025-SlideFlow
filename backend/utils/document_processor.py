import os
import asyncio
from typing import Optional

async def extract_text_from_document(file_path: str) -> Optional[str]:
    """
    Extract text from various document formats.
    
    Args:
        file_path: Path to the uploaded document
        
    Returns:
        Extracted text or None if extraction fails
    """
    file_ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if file_ext == '.pdf':
            return await extract_from_pdf(file_path)
        elif file_ext in ['.docx', '.doc']:
            return await extract_from_word(file_path)
        elif file_ext == '.txt':
            return await extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_ext}")
    except Exception as e:
        print(f"Error extracting text from {file_path}: {str(e)}")
        return None

async def extract_from_pdf(file_path: str) -> str:
    """Extract text from PDF files."""
    try:
        import PyPDF2
        
        text = []
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text.append(page.extract_text())
        
        return "\n".join(text)
    except ImportError:
        print("PyPDF2 library not installed. Install it with: pip install PyPDF2")
        raise

async def extract_from_word(file_path: str) -> str:
    """Extract text from Word documents."""
    try:
        import docx
        
        doc = docx.Document(file_path)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])
    except ImportError:
        print("python-docx library not installed. Install it with: pip install python-docx")
        raise

async def extract_from_txt(file_path: str) -> str:
    """Extract text from plain text files."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

# Example processing function to clean and prepare text
async def preprocess_text(text: str) -> str:
    """
    Clean and preprocess extracted text.
    
    Args:
        text: The raw extracted text
        
    Returns:
        Cleaned and preprocessed text
    """
    if not text:
        return ""
    
    # Remove extra whitespace
    text = " ".join(text.split())
    
    # Basic text cleaning
    text = text.replace('\t', ' ').strip()
    
    return text 