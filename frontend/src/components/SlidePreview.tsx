import React, { useMemo } from 'react';
import { usePresentation, Slide, TemplateType } from '@/context/PresentationContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Move } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define interfaces for template styles (aligned with new context)
interface TemplateStyle {
  fontFamily: string;
  titleFontSize: string;
  contentFontSize: string;
  titleFontWeight: string;
  contentFontWeight: string;
  textColor: string;
  backgroundColor: string;
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  titleFontStyle?: string;
  titleTextTransform?: string;
  gradient?: string;
}

// Get template styles (aligned with new context's getTemplateStyles)
const getTemplateStyles = (templateId: TemplateType): TemplateStyle => {
  const { availableTemplates } = usePresentation();
  const templateObj = availableTemplates.find(t => t.id === templateId) || availableTemplates[0];

  const templateStyling: Record<TemplateType, TemplateStyle> = {
    corporate: {
      fontFamily: 'Roboto, Arial, sans-serif',
      titleFontSize: '44pt',
      contentFontSize: '28pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#002B5B',
      backgroundColor: '#FFFFFF',
      accentColor: '#4589FF',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    creative: {
      fontFamily: 'Lobster, Montserrat, sans-serif',
      titleFontSize: '48pt',
      contentFontSize: '28pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#5A189A',
      backgroundColor: '#F5F5F5',
      accentColor: '#FFCC00',
      gradient: 'linear-gradient(135deg, #FF3366 0%, #9C27B0 100%)',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    academic: {
      fontFamily: 'Times New Roman, Georgia, serif',
      titleFontSize: '44pt',
      contentFontSize: '26pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#1C3D6E',
      backgroundColor: '#FAF3E0',
      accentColor: '#4DD0E1',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    marketing: {
      fontFamily: 'Impact, Raleway, sans-serif',
      titleFontSize: '46pt',
      contentFontSize: '28pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#E63946',
      backgroundColor: '#FFFFFF',
      accentColor: '#FFC107',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    minimalist: {
      fontFamily: 'Futura, Helvetica Neue, Arial, sans-serif',
      titleFontSize: '42pt',
      contentFontSize: '26pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#444444',
      backgroundColor: '#FFFFFF',
      accentColor: '#BDBDBD',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    techStartup: {
      fontFamily: 'Orbitron, Exo, Ubuntu, sans-serif',
      titleFontSize: '48pt',
      contentFontSize: '28pt',
      titleFontWeight: 'semi-bold',
      contentFontWeight: 'regular',
      textColor: '#00A8E8',
      backgroundColor: '#1E1E1E',
      accentColor: '#2ECC71',
      gradient: 'linear-gradient(135deg, #004e92 0%, #8a2be2 100%)',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    businessPitch: {
      fontFamily: 'Baskerville, Proxima Nova, Lato, serif',
      titleFontSize: '46pt',
      contentFontSize: '30pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#001F3F',
      backgroundColor: '#FFFFFF',
      accentColor: '#444444',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    futuristic: {
      fontFamily: 'Audiowide, Orbitron, Rajdhani, sans-serif',
      titleFontSize: '50pt',
      contentFontSize: '28pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      titleTextTransform: 'uppercase',
      textColor: '#00FFFF',
      backgroundColor: '#000000',
      accentColor: '#00E5FF',
      gradient: 'linear-gradient(135deg, #000000 0%, #240046 100%)',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    elegant: {
      fontFamily: 'Playfair Display, Cormorant, Cinzel, serif',
      titleFontSize: '50pt',
      contentFontSize: '28pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      titleFontStyle: 'italic',
      textColor: '#D4AF37',
      backgroundColor: '#000000',
      accentColor: '#4A0D37',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    healthcare: {
      fontFamily: 'Verdana, Nunito, Open Sans, sans-serif',
      titleFontSize: '44pt',
      contentFontSize: '26pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#007BFF',
      backgroundColor: '#FFFFFF',
      accentColor: '#00897B',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    finance: {
      fontFamily: 'Garamond, Franklin Gothic, Source Sans Pro, serif',
      titleFontSize: '46pt',
      contentFontSize: '28pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#004B23',
      backgroundColor: '#F4F4F4',
      accentColor: '#2A3D66',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    event: {
      fontFamily: 'Oswald, Abril Fatface, Raleway, sans-serif',
      titleFontSize: '52pt',
      contentFontSize: '30pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#E63946',
      backgroundColor: '#FFFFFF',
      accentColor: '#007BFF',
      gradient: 'linear-gradient(135deg, #000033 0%, #4B0082 100%)',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    elearning: {
      fontFamily: '"Comic Sans MS", Merriweather, Quicksand, sans-serif',
      titleFontSize: '42pt',
      contentFontSize: '26pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#004D40',
      backgroundColor: '#FFFFFF',
      accentColor: '#333333',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
    travel: {
      fontFamily: 'Pacifico, Lobster, Raleway, sans-serif',
      titleFontSize: '48pt',
      contentFontSize: '28pt',
      titleFontWeight: 'bold',
      contentFontWeight: 'regular',
      textColor: '#1E90FF',
      backgroundColor: '#87CEFA',
      accentColor: '#8B4513',
      primaryColor: templateObj.primaryColor,
      secondaryColor: templateObj.secondaryColor,
    },
  };

  return templateStyling[templateId] || templateStyling.corporate;
};

const SlidePreview: React.FC = () => {
  const { presentation, reorderSlides } = usePresentation();
  const { slides, selectedTemplate } = presentation;

  // Memoize template styles
  const templateStyles = useMemo(() => getTemplateStyles(selectedTemplate), [selectedTemplate]);

  // Common styles
  const titleStyle = useMemo(() => ({
    color: templateStyles.primaryColor,
    fontFamily: templateStyles.fontFamily,
    fontSize: templateStyles.titleFontSize,
    fontWeight: templateStyles.titleFontWeight,
    fontStyle: templateStyles.titleFontStyle || 'normal',
    textTransform: templateStyles.titleTextTransform || 'none',
  }), [templateStyles]);

  const contentStyle = useMemo(() => ({
    color: templateStyles.textColor,
    fontFamily: templateStyles.fontFamily,
    fontSize: templateStyles.contentFontSize,
    fontWeight: templateStyles.contentFontWeight,
  }), [templateStyles]);

  // Render slide content based on type
  const renderSlideContent = (slide: Slide) => {
    switch (slide.type) {
      case 'title':
        return (
          <div 
            className="flex flex-col items-center justify-center h-full text-center p-4"
            style={{ color: templateStyles.textColor, fontFamily: templateStyles.fontFamily }}
            role="region"
            aria-label="Title slide"
          >
            <h1 
              className="font-bold mb-2"
              style={titleStyle}
            >
              {slide.title || 'Title Slide'}
            </h1>
            <p 
              className="text-sm"
              style={contentStyle}
            >
              {slide.content || 'Subtitle or additional context'}
            </p>
          </div>
        );

      case 'content':
        return (
          <div 
            className="flex flex-col h-full p-4"
            style={{ fontFamily: templateStyles.fontFamily }}
            role="region"
            aria-label="Content slide"
          >
            <h2 
              className="font-bold mb-1"
              style={titleStyle}
            >
              {slide.title || 'Content Slide'}
            </h2>
            <div 
              className="text-md overflow-hidden"
              style={contentStyle}
            >
              {slide.bullets || 'Slide content goes here'}
            </div>
          </div>
        );

      case 'bullets':
        return (
          <div 
            className="flex flex-col h-full p-4"
            style={{ fontFamily: templateStyles.fontFamily }}
            role="region"
            aria-label="Bullet points slide"
          >
            <h2 
              className="font-bold mb-1"
              style={titleStyle}
            >
              {slide.title || 'Bullet Points'}
            </h2>
            <ul 
              className="text-sm list-disc pl-4 space-y-1"
              style={contentStyle}
            >
              {slide.bullets?.map((bullet, idx) => (
                <li key={`bullet-${slide.id}-${idx}`}>{bullet}</li>
              )) || <li>Bullet point content</li>}
            </ul>
          </div>
        );

      case 'image':
        return (
          <div 
            className="flex flex-col h-full p-4"
            style={{ fontFamily: templateStyles.fontFamily }}
            role="region"
            aria-label="Image slide"
          >
            <h2 
              className="font-bold mb-1"
              style={titleStyle}
            >
              {slide.title || 'Image Slide'}
            </h2>
            <div className="flex-1 flex items-center justify-center bg-muted/30 rounded">
              {slide.imageUrl ? (
                <img 
                  src={slide.imageUrl} 
                  alt={slide.title || 'Slide image'} 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-sm text-muted-foreground" aria-label="Image placeholder">
                  Image placeholder
                </div>
              )}
            </div>
            {slide.content && (
              <p 
                className="text-sm mt-1"
                style={contentStyle}
              >
                {slide.content}
              </p>
            )}
          </div>
        );

      case 'quote':
        return (
          <div 
            className="flex flex-col items-center justify-center h-full text-center p-4"
            style={{ color: templateStyles.textColor, fontFamily: templateStyles.fontFamily }}
            role="region"
            aria-label="Quote slide"
          >
            <blockquote 
              className="text-sm italic mb-2"
              style={{ 
                color: templateStyles.secondaryColor,
                fontFamily: templateStyles.fontFamily,
                fontSize: templateStyles.contentFontSize
              }}
            >
              "{slide.quote || 'Quote goes here'}"
            </blockquote>
            {slide.author && (
              <cite 
                className="text-sm font-medium"
                style={contentStyle}
              >
                — {slide.author}
              </cite>
            )}
          </div>
        );

      case 'two-column':
        return (
          <div 
            className="flex flex-col h-full p-4"
            style={{ fontFamily: templateStyles.fontFamily }}
            role="region"
            aria-label="Two column slide"
          >
            <h2 
              className="font-bold mb-1"
              style={titleStyle}
            >
              {slide.title || 'Two Column Layout'}
            </h2>
            <div className="flex flex-1 gap-2">
              <div 
                className="flex-1 text-sm overflow-hidden border-r pr-2"
                style={contentStyle}
              >
                {slide.leftContent || 'Left column content'}
              </div>
              <div 
                className="flex-1 text-sm overflow-hidden pl-2"
                style={contentStyle}
              >
                {slide.rightContent || 'Right column content'}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div 
            className="p-4 text-sm"
            role="region"
            aria-label="Default slide"
          >
            Slide content
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col" role="main" aria-label="Slide preview section">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Preview</h2>
          <TabsList>
            <TabsTrigger value="preview" aria-label="View slides">Slides</TabsTrigger>
            <TabsTrigger value="outline" aria-label="View outline">Outline</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="mt-4 flex-1">
          {slides.length === 0 ? (
            <div 
              className="flex items-center justify-center h-96 border rounded-lg bg-muted/30"
              role="alert"
              aria-label="No slides message"
            >
              <div className="text-center text-muted-foreground">
                <p className="mb-2">No slides generated yet</p>
                <p className="text-sm">Enter a prompt and click "Generate Presentation"</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
              <div className="space-y-6">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="group">
                    <div className="flex items-center justify-between mb-2 text-xs">
                      <span className="text-muted-foreground">
                        Slide {index + 1}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Move 
                          className="h-4 w-4 cursor-move text-muted-foreground" 
                          aria-label="Drag to reorder slide"
                          onClick={() => reorderSlides(index, index)} // Placeholder for drag-and-drop
                        />
                      </div>
                    </div>
                    <Card 
                      className="slide-card overflow-hidden"
                      style={{ 
                        backgroundColor: templateStyles.backgroundColor,
                        borderColor: `${templateStyles.primaryColor}20`,
                        backgroundImage: templateStyles.gradient || 'none'
                      }}
                      role="group"
                      aria-label={`Slide ${index + 1}`}
                    >
                      {renderSlideContent(slide)}
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
        
        <TabsContent value="outline" className="mt-4">
          <ScrollArea className="h-[calc(100vh-280px)] pr-4">
            <div 
              className="space-y-4"
              style={{ fontFamily: templateStyles.fontFamily }}
              role="list"
              aria-label="Slide outline"
            >
              {slides.length === 0 ? (
                <div 
                  className="flex items-center justify-center h-96 border rounded-lg bg-muted/30"
                  role="alert"
                  aria-label="No slides message"
                >
                  <div className="text-center text-muted-foreground">
                    <p className="mb-2">No slides generated yet</p>
                    <p className="text-sm">Enter a prompt and click "Generate Presentation"</p>
                  </div>
                </div>
              ) : (
                slides.map((slide, index) => (
                  <Card key={slide.id} className="p-4" role="listitem">
                    <div className="flex items-start gap-3">
                      <div 
                        className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: templateStyles.primaryColor,
                          color: '#ffffff'
                        }}
                        aria-label={`Slide number ${index + 1}`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 
                          className="font-medium text-sm mb-1"
                          style={{
                            color: templateStyles.primaryColor,
                            fontWeight: templateStyles.titleFontWeight,
                            fontStyle: templateStyles.titleFontStyle || 'normal',
                            textTransform: templateStyles.titleTextTransform || 'none'
                          }}
                        >
                          {slide.title || `${slide.type.charAt(0).toUpperCase() + slide.type.slice(1)} Slide`}
                        </h3>
                        
                        {slide.type === 'bullets' && slide.bullets && (
                          <ul 
                            className="text-xs list-disc pl-4 text-muted-foreground"
                            style={{
                              fontWeight: templateStyles.contentFontWeight
                            }}
                            role="list"
                          >
                            {slide.bullets.map((bullet, idx) => (
                              <li key={`bullet-outline-${slide.id}-${idx}`} className="truncate">{bullet}</li>
                            ))}
                          </ul>
                        )}
                        
                        {slide.content && (
                          <p 
                            className="text-xs text-muted-foreground truncate"
                            style={{
                              fontWeight: templateStyles.contentFontWeight
                            }}
                          >
                            {slide.content}
                          </p>
                        )}
                        
                        {slide.quote && (
                          <p 
                            className="text-xs text-muted-foreground italic truncate"
                            style={{
                              fontWeight: templateStyles.contentFontWeight
                            }}
                          >
                            "{slide.quote}"
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default React.memo(SlidePreview);