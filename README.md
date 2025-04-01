# Slideflow: AI-Powered Presentation Generator

Slideflow is a full-stack web application that generates professional presentations from user prompts and/or uploaded documents, leveraging Google's Gemini LLM for content generation and Stable Diffusion API for visual assets.

## Features

- Generate complete presentations from text prompts or document uploads
- Choose from 5 professionally designed presentation templates
- Real-time preview of generated slides
- Export to multiple formats (PowerPoint, Word, PDF)
- Edit slides before export
- Responsive design for desktop and tablet use

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn UI component library
- React Router for navigation
- React Query for API calls
- Context API for state management

### Backend
- Python with FastAPI
- Google Gemini AI for content generation
- Stable Diffusion API for image generation
- python-pptx, python-docx, and PDF libraries for file generation

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- LibreOffice (required for PDF export)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GxAditya/HackIndia-Spark-4-2025-SlideFlow.git
cd slideflow
```

2. Set up the backend:
```bash
cd backend
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Create .env file from template
cp .env.example .env
# Edit .env file with your API keys
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

### Running the Application

1. Start the backend server:
```bash
cd backend
python app.py
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to http://localhost:5173

## Usage

1. Enter a prompt describing the presentation you want to create, or upload a document
2. Select a template style from the available options
3. Click "Generate" to create your presentation
4. Preview the generated slides
5. Export to your preferred format (PPTX, DOCX, PDF)

## API Keys

You'll need to obtain API keys for:
- [Google Gemini AI](https://ai.google.dev/tutorials/setup) 
- [Stable Diffusion API](https://stablediffusionapi.com/) for image generation

Add these keys to your `.env` file in the backend directory.

## License

[MIT](LICENSE) 
