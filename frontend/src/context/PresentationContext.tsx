import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import apiService from '@/lib/api';

export type SlideType = 'title' | 'content' | 'image' | 'bullets' | 'quote' | 'two-column';

export interface Slide {
  id: string;
  type: SlideType;
  title?: string;
  content?: string;
  imageUrl?: string;
  bullets?: string[];
  quote?: string;
  author?: string;
  leftContent?: string;
  rightContent?: string;
}

export type TemplateType = 'corporate' | 'creative' | 'academic' | 'marketing' | 'minimalist' | 
  'techStartup' | 'businessPitch' | 'futuristic' | 'elegant' | 'healthcare' | 
  'finance' | 'event' | 'elearning' | 'travel';

export interface Template {
  id: TemplateType;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  previewImageUrl: string;
}

export interface PresentationState {
  title: string;
  description: string;
  slides: Slide[];
  selectedTemplate: TemplateType;
  isGenerating: boolean;
  generationProgress: number;
  promptText: string;
  uploadedDocument: File | null;
  slideCount: number;
}

interface PresentationContextType {
  presentation: PresentationState;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide) => void;
  updateSlide: (id: string, slide: Partial<Slide>) => void;
  removeSlide: (id: string) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;
  setSelectedTemplate: (template: TemplateType) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setPromptText: (text: string) => void;
  setUploadedDocument: (file: File | null) => void;
  setSlideCount: (count: number) => void;
  generatePresentation: () => Promise<void>;
  exportPresentation: (format: 'pptx' | 'docx' | 'pdf') => Promise<void>;
  availableTemplates: Template[];
}

const availableTemplates: Template[] = [
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional design for business presentations',
    primaryColor: '#0F62FE',
    secondaryColor: '#6F6F6F',
    accentColor: '#4589FF',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant design for creative presentations',
    primaryColor: '#FF3366',
    secondaryColor: '#9C27B0',
    accentColor: '#FFCC00',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Structured design for educational content',
    primaryColor: '#006064',
    secondaryColor: '#00897B',
    accentColor: '#4DD0E1',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Persuasive design for sales pitches',
    primaryColor: '#FF5722',
    secondaryColor: '#FF9800',
    accentColor: '#FFC107',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, typography-focused design',
    primaryColor: '#212121',
    secondaryColor: '#757575',
    accentColor: '#BDBDBD',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'techStartup',
    name: 'Tech/Startup',
    description: 'Modern design for innovative tech companies',
    primaryColor: '#00A8E8',
    secondaryColor: '#1E1E1E',
    accentColor: '#2ECC71',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'businessPitch',
    name: 'Business Pitch Deck',
    description: 'Professional design for impactful business pitches',
    primaryColor: '#001F3F',
    secondaryColor: '#FFFFFF',
    accentColor: '#444444',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Forward-thinking design with high-tech aesthetics',
    primaryColor: '#00FFFF',
    secondaryColor: '#000000',
    accentColor: '#240046',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'elegant',
    name: 'Elegant/Luxury',
    description: 'Sophisticated design for premium presentations',
    primaryColor: '#D4AF37',
    secondaryColor: '#000000',
    accentColor: '#4A0D37',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'healthcare',
    name: 'Healthcare/Medical',
    description: 'Professional design for medical presentations',
    primaryColor: '#007BFF',
    secondaryColor: '#FFFFFF',
    accentColor: '#00897B',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'finance',
    name: 'Finance & Investment',
    description: 'Sharp design for financial presentations',
    primaryColor: '#004B23',
    secondaryColor: '#FFFFFF',
    accentColor: '#2A3D66',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'event',
    name: 'Event/Conference',
    description: 'Eye-catching design for event presentations',
    primaryColor: '#E63946',
    secondaryColor: '#000033',
    accentColor: '#007BFF',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'elearning',
    name: 'E-learning/Educational',
    description: 'Engaging design for educational content',
    primaryColor: '#004D40',
    secondaryColor: '#FFFFFF',
    accentColor: '#FFF8E1',
    previewImageUrl: '/placeholder.svg',
  },
  {
    id: 'travel',
    name: 'Travel & Adventure',
    description: 'Vibrant design for travel-related presentations',
    primaryColor: '#1E90FF',
    secondaryColor: '#87CEFA',
    accentColor: '#8B4513',
    previewImageUrl: '/placeholder.svg',
  },
];

const defaultSlides: Slide[] = [
  {
    id: '1',
    type: 'title',
    title: 'Your Presentation Title',
    content: 'A subtitle or additional context',
  },
];

const initialState: PresentationState = {
  title: 'Untitled Presentation',
  description: '',
  slides: defaultSlides,
  selectedTemplate: 'corporate',
  isGenerating: false,
  generationProgress: 0,
  promptText: '',
  uploadedDocument: null,
  slideCount: 8,
};

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export const PresentationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [presentation, setPresentation] = useState<PresentationState>(initialState);

  const setTitle = (title: string) => {
    setPresentation((prev) => ({ ...prev, title }));
  };

  const setDescription = (description: string) => {
    setPresentation((prev) => ({ ...prev, description }));
  };

  const setSlides = (slides: Slide[]) => {
    setPresentation((prev) => ({ ...prev, slides }));
  };

  const addSlide = (slide: Slide) => {
    setPresentation((prev) => ({
      ...prev,
      slides: [...prev.slides, slide],
    }));
  };

  const updateSlide = (id: string, slideUpdates: Partial<Slide>) => {
    setPresentation((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) =>
        slide.id === id ? { ...slide, ...slideUpdates } : slide
      ),
    }));
  };

  const removeSlide = (id: string) => {
    setPresentation((prev) => ({
      ...prev,
      slides: prev.slides.filter((slide) => slide.id !== id),
    }));
  };

  const reorderSlides = (startIndex: number, endIndex: number) => {
    const result = Array.from(presentation.slides);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setPresentation((prev) => ({
      ...prev,
      slides: result,
    }));
  };

  const setSelectedTemplate = (selectedTemplate: TemplateType) => {
    setPresentation((prev) => ({ ...prev, selectedTemplate }));
  };

  const setIsGenerating = (isGenerating: boolean) => {
    setPresentation((prev) => ({ ...prev, isGenerating }));
  };

  const setGenerationProgress = (generationProgress: number) => {
    setPresentation((prev) => ({ ...prev, generationProgress }));
  };

  const setPromptText = (promptText: string) => {
    setPresentation((prev) => ({ ...prev, promptText }));
  };

  const setUploadedDocument = (uploadedDocument: File | null) => {
    setPresentation((prev) => ({ ...prev, uploadedDocument }));
  };

  const setSlideCount = (slideCount: number) => {
    setPresentation((prev) => ({ ...prev, slideCount }));
  };

  // Real implementation that calls the backend API
  const generatePresentation = async () => {
    try {
      setIsGenerating(true);
      setGenerationProgress(10); // Start progress

      // Check if we have either prompt or document
      if (!presentation.promptText && !presentation.uploadedDocument) {
        toast({
          title: "Input Required",
          description: "Please enter a prompt or upload a document to generate a presentation.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Call the API to generate presentation
      const response = await apiService.generatePresentation({
        prompt: presentation.promptText,
        document: presentation.uploadedDocument || undefined,
        templateStyle: presentation.selectedTemplate,
        slideCount: presentation.slideCount,
      });

      setGenerationProgress(100); // Complete progress

      // If the API returns slides, update the state
      if (response && response.slides) {
        // Transform backend slide format to frontend format if needed
        const transformedSlides: Slide[] = response.slides.map((slide: any, index: number) => ({
          id: String(index + 1),
          type: slide.type,
          title: slide.title,
          content: slide.content || slide.subtitle,
          imageUrl: slide.image_url,
          bullets: slide.bullets,
          quote: slide.quote,
          author: slide.author,
          leftContent: slide.left_content,
          rightContent: slide.right_content,
        }));

        setSlides(transformedSlides);

        // Update presentation title if available
        if (response.title) {
          setTitle(response.title);
        }

        toast({
          title: "Presentation Generated",
          description: "Your presentation has been successfully generated.",
        });
      } else {
        toast({
          title: "Generation Error",
          description: "Failed to generate presentation. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast({
        title: "Generation Error",
        description: "An error occurred while generating your presentation.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to export presentation
  const exportPresentation = async (format: 'pptx' | 'docx' | 'pdf') => {
    try {
      setIsGenerating(true);
      
      // Prevent export if no slides
      if (presentation.slides.length === 0) {
        toast({
          title: "No Content",
          description: "Please generate a presentation before exporting.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      const response = await apiService.exportPresentation({
        contentData: {
          title: presentation.title || "Untitled Presentation",
          description: presentation.description,
          slides: presentation.slides,
        },
        templateStyle: presentation.selectedTemplate,
        format: format,
        imagePlacement: 'none',
      });
      
      // Handle response from the export API
      if (response.download_url) {
        // Create a temporary link and click it to initiate download
        const downloadLink = document.createElement('a');
        downloadLink.href = response.download_url;
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast({
          title: "Export Successful",
          description: `Your presentation has been exported as ${format.toUpperCase()}.`,
        });
      } else {
        throw new Error("Export failed. No download URL received.");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: `There was an error exporting your presentation. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PresentationContext.Provider
      value={{
        presentation,
        setTitle,
        setDescription,
        setSlides,
        addSlide,
        updateSlide,
        removeSlide,
        reorderSlides,
        setSelectedTemplate,
        setIsGenerating,
        setGenerationProgress,
        setPromptText,
        setUploadedDocument,
        setSlideCount,
        generatePresentation,
        exportPresentation,
        availableTemplates,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};

export async function exportPresentation(
    contentData: any,
    templateStyle: string,
    format: string = 'pptx',
    presentationId?: string,
  ): Promise<string> {
    try {
      const response = await apiService.post<Blob>(
        '/api/export',
        {
          contentData,
          templateStyle,
          format,
          presentation_id: presentationId,
          imagePlacement: 'none',
        },
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'presentation.' + format;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return url;
    } catch (error) {
      console.error('Error exporting presentation:', error);
      throw error;
    }
  }
