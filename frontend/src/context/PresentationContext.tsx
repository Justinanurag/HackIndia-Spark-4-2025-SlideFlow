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

      // Find the selected template object
      const selectedTemplateObj = availableTemplates.find(
        template => template.id === presentation.selectedTemplate
      );

      // Get additional template styling information based on templateId
      const templateStyles = getTemplateStyles(presentation.selectedTemplate);
      
      // Extract specific styling properties for direct use
      const { 
        backgroundColor, 
        textColor, 
        primaryColor, 
        secondaryColor, 
        accentColor,
        fontFamily,
        titleFontSize,
        contentFontSize
      } = templateStyles;

      // Call the API to generate presentation with enhanced styling information
      const response = await apiService.generatePresentation({
        prompt: presentation.promptText,
        document: presentation.uploadedDocument || undefined,
        templateStyle: presentation.selectedTemplate,
        slideCount: presentation.slideCount,
        // Include specific styling properties at the root level
        backgroundColor,
        textColor,
        primaryColor,
        secondaryColor,
        accentColor,
        fontFamily,
        titleFontSize,
        contentFontSize,
        // Include detailed template information
        templateDetails: {
          ...selectedTemplateObj,
          ...templateStyles,
          // Provide both camelCase and snake_case for maximum compatibility
          background_color: backgroundColor,
          text_color: textColor,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          accent_color: accentColor,
          font_family: fontFamily,
          title_font_size: titleFontSize,
          content_font_size: contentFontSize
        }
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
      
      // Log export attempt with details
      console.log(`Attempting to export presentation in ${format} format with styling`);
      console.log(`Template: ${presentation.selectedTemplate}`);
      console.log(`Slide count: ${presentation.slides.length}`);
      
      // Get full template style details
      const templateStyles = getTemplateStyles(presentation.selectedTemplate);
      console.log("Template styles:", templateStyles);
      
      // Find the selected template object from available templates
      const selectedTemplateObj = availableTemplates.find(
        template => template.id === presentation.selectedTemplate
      ) || availableTemplates[0];
      
      // Create content structure for export that preserves all slide content
      const contentData = {
        title: presentation.title || "Untitled Presentation",
        slides: presentation.slides.map(slide => {
          // Create a complete slide object with all relevant properties
          const completeSlide: any = {
            type: slide.type,
            title: slide.title || "",
          };
          
          // Add content based on slide type
          if (slide.content) {
            completeSlide.content = slide.content;
          }
          
          // For bullet slides, make sure to include bullets array
          if (slide.bullets && slide.bullets.length > 0) {
            completeSlide.bullets = slide.bullets;
          }
          
          // For quote slides, include quote and author
          if (slide.quote) {
            completeSlide.quote = slide.quote;
            if (slide.author) {
              completeSlide.author = slide.author;
            }
          }
          
          // For image slides, include image URL if available
          if (slide.imageUrl) {
            completeSlide.image_url = slide.imageUrl;
          }
          
          // For two-column slides, include column content
          if (slide.leftContent) {
            completeSlide.left_content = slide.leftContent;
          }
          
          if (slide.rightContent) {
            completeSlide.right_content = slide.rightContent;
          }
          
          return completeSlide;
        })
      };
      
      try {
        // Attempt the export with complete styling data
        const response = await apiService.exportPresentation({
          contentData: contentData,
          templateStyle: presentation.selectedTemplate,
          format: format,
          // Include complete template details with both the styles and template object
          templateDetails: {
            ...templateStyles,
            ...selectedTemplateObj,
            // Ensure these critical properties are explicitly set
            template_id: presentation.selectedTemplate,
            template_name: selectedTemplateObj.name,
            template_style: presentation.selectedTemplate,
            // Ensure both camelCase and snake_case versions are included
            primaryColor: selectedTemplateObj.primaryColor,
            primary_color: selectedTemplateObj.primaryColor,
            secondaryColor: selectedTemplateObj.secondaryColor,
            secondary_color: selectedTemplateObj.secondaryColor,
            accentColor: selectedTemplateObj.accentColor,
            accent_color: selectedTemplateObj.accentColor,
            backgroundColor: templateStyles.backgroundColor,
            background_color: templateStyles.backgroundColor,
            textColor: templateStyles.textColor,
            text_color: templateStyles.textColor
          }
        });
        
        toast({
          title: "Export Successful",
          description: `Your presentation has been exported as ${format.toUpperCase()}.`,
        });
      } catch (error) {
        console.error("Export error:", error);
        
        let errorMessage = "There was an error exporting your presentation.";
        
        // If error contains a specific message, display it to the user
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        }
        
        toast({
          title: "Export Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Try a direct debug export as a fallback
        console.log("Attempting direct debug export as fallback...");
        const debugResult = await apiService.debugExportPresentation(format);
        
        if (debugResult.success) {
          toast({
            title: "Direct Export Succeeded",
            description: "Used simplified format. Check console for details.",
          });
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to get detailed styling information for each template
  const getTemplateStyles = (templateId: TemplateType) => {
    // Find the template object to get color values
    const templateObj = availableTemplates.find(t => t.id === templateId) || availableTemplates[0];
    
    const templateStyling = {
      corporate: {
        fontFamily: 'Roboto, Arial, sans-serif', // Modern & professional
        titleFontSize: '44pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#002B5B',  // Navy Blue
        backgroundColor: '#FFFFFF',  // White
        accentColor: '#4589FF',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      creative: {
        fontFamily: 'Lobster, Montserrat, sans-serif', // Playful & artistic
        titleFontSize: '48pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#5A189A',  // Deep Purple
        backgroundColor: '#F5F5F5',  // Light Gray
        accentColor: '#FFCC00',
        gradient: 'linear-gradient(135deg, #FF3366 0%, #9C27B0 100%)',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      minimalist: {
        fontFamily: 'Futura, Helvetica Neue, Arial, sans-serif', // Clean & geometric
        titleFontSize: '42pt',
        contentFontSize: '26pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#444444',  // Dark Gray
        backgroundColor: '#FFFFFF',  // White
        accentColor: '#BDBDBD',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      academic: {
        fontFamily: 'Times New Roman, Georgia, serif', // Traditional & scholarly
        titleFontSize: '44pt',
        contentFontSize: '26pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#1C3D6E',  // Dark Blue
        backgroundColor: '#FAF3E0',  // Light Beige
        accentColor: '#4DD0E1',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      marketing: {
        fontFamily: 'Impact, Raleway, sans-serif', // Bold & attention-grabbing
        titleFontSize: '46pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#E63946',  // Bright Red
        backgroundColor: '#FFFFFF',  // White
        accentColor: '#FFC107',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      techStartup: {
        fontFamily: 'Orbitron, Exo, Ubuntu, sans-serif', // Futuristic & digital
        titleFontSize: '48pt',
        contentFontSize: '28pt',
        titleFontWeight: 'semi-bold',
        contentFontWeight: 'regular',
        textColor: '#00A8E8',  // Electric Blue
        backgroundColor: '#1E1E1E',  // Dark Gray
        accentColor: '#2ECC71',
        gradient: 'linear-gradient(135deg, #004e92 0%, #8a2be2 100%)',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      businessPitch: {
        fontFamily: 'Baskerville, Proxima Nova, Lato, serif', // Classic & high-end
        titleFontSize: '46pt',
        contentFontSize: '30pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#001F3F',  // Dark Navy
        backgroundColor: '#FFFFFF',  // White
        accentColor: '#444444',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      futuristic: {
        fontFamily: 'Audiowide, Orbitron, Rajdhani, sans-serif', // Sci-fi & techy
        titleFontSize: '50pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        titleTextTransform: 'uppercase',
        contentFontWeight: 'regular',
        textColor: '#00FFFF',  // Neon Blue
        backgroundColor: '#000000',  // Black
        accentColor: '#00E5FF',
        gradient: 'linear-gradient(135deg, #000000 0%, #240046 100%)',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      elegant: {
        fontFamily: 'Playfair Display, Cormorant, Cinzel, serif', // Sophisticated & stylish
        titleFontSize: '50pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        titleFontStyle: 'italic',
        textColor: '#D4AF37',  // Gold
        backgroundColor: '#000000',  // Black
        accentColor: '#4A0D37',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      healthcare: {
        fontFamily: 'Verdana, Nunito, Open Sans, sans-serif', // Clean & readable
        titleFontSize: '44pt',
        contentFontSize: '26pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#007BFF',  // Medical Blue
        backgroundColor: '#FFFFFF',  // White
        accentColor: '#00897B',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      finance: {
        fontFamily: 'Garamond, Franklin Gothic, Source Sans Pro, serif', // Trustworthy & elegant
        titleFontSize: '46pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#004B23',  // Deep Green
        backgroundColor: '#F4F4F4',  // Light Gray
        accentColor: '#2A3D66',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      event: {
        fontFamily: 'Oswald, Abril Fatface, Raleway, sans-serif', // Strong & modern
        titleFontSize: '52pt',
        contentFontSize: '30pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#E63946',  // Vibrant Red
        backgroundColor: '#FFFFFF',  // White
        accentColor: '#007BFF',
        gradient: 'linear-gradient(135deg, #000033 0%, #4B0082 100%)',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      elearning: {
        fontFamily: '"Comic Sans MS", Merriweather, Quicksand, sans-serif', // Casual & friendly
        titleFontSize: '42pt',
        contentFontSize: '26pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#004D40',  // Dark Green
        backgroundColor: '#FFFFFF',  // White
        accentColor: '#333333',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      },
      travel: {
        fontFamily: 'Pacifico, Lobster, Raleway, sans-serif', // Fun & adventurous
        titleFontSize: '48pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        textColor: '#1E90FF',  // Ocean Blue
        backgroundColor: '#87CEFA',  // Light Sky Blue
        accentColor: '#8B4513',
        gradient: 'none',
        primaryColor: templateObj.primaryColor,
        secondaryColor: templateObj.secondaryColor
      }
    };

    // Create style object with the template-specific styles
    const templateSpecificStyles = templateStyling[templateId] || templateStyling.corporate;
    
    // Ensure all color properties are properly set and aligned
    return {
      ...templateSpecificStyles,
      // Ensure we have both camelCase and snake_case versions for compatibility
      primaryColor: templateObj.primaryColor,
      primary_color: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
      secondary_color: templateObj.secondaryColor,
      accentColor: templateObj.accentColor,
      accent_color: templateObj.accentColor,
      backgroundColor: templateSpecificStyles.backgroundColor,
      background_color: templateSpecificStyles.backgroundColor,
      textColor: templateSpecificStyles.textColor,
      text_color: templateSpecificStyles.textColor,
    };
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
