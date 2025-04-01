import React from 'react';
import { usePresentation, Slide, TemplateType } from '@/context/PresentationContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Move } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import function to get full template styles
const getTemplateStyles = (templateId: TemplateType) => {
  const templateStyling = {
    corporate: {
      fontFamily: 'Roboto, Arial, sans-serif', // Modern & professional
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#002B5B', // Navy Blue
      backgroundColor: '#FFFFFF', // White
      accentColor: '#4589FF',
    },
    creative: {
      fontFamily: 'Lobster, Montserrat, sans-serif', // Playful & artistic 
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#5A189A', // Deep Purple
      backgroundColor: '#F5F5F5', // Light Gray
      accentColor: '#FFCC00',
    },
    academic: {
      fontFamily: '"Times New Roman", Georgia, serif', // Traditional & scholarly
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#1C3D6E', // Dark Blue
      backgroundColor: '#FAF3E0', // Light Beige
      accentColor: '#4DD0E1',
    },
    marketing: {
      fontFamily: 'Impact, Raleway, sans-serif', // Bold & attention-grabbing
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#E63946', // Bright Red
      backgroundColor: '#FFFFFF', // White
      accentColor: '#FFC107',
    },
    minimalist: {
      fontFamily: 'Futura, "Helvetica Neue", Arial, sans-serif', // Clean & geometric
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#444444', // Dark Gray
      backgroundColor: '#FFFFFF', // White
      accentColor: '#BDBDBD',
    },
    techStartup: {
      fontFamily: 'Orbitron, Exo, system-ui, sans-serif', // Futuristic & digital
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      textColor: '#00A8E8', // Electric Blue
      backgroundColor: '#1E1E1E', // Dark Gray
      accentColor: '#2ECC71',
    },
    businessPitch: {
      fontFamily: 'Baskerville, Lato, system-ui, serif', // Classic & high-end
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#001F3F', // Dark Navy
      backgroundColor: '#FFFFFF', // White
      accentColor: '#444444',
    },
    futuristic: {
      fontFamily: 'Audiowide, Orbitron, system-ui, sans-serif', // Sci-fi & techy
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'uppercase',
      textColor: '#00FFFF', // Neon Blue
      backgroundColor: '#000000', // Black
      accentColor: '#00E5FF',
    },
    elegant: {
      fontFamily: '"Playfair Display", serif', // Sophisticated & stylish
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleFontStyle: 'italic',
      textColor: '#D4AF37', // Gold
      backgroundColor: '#000000', // Black
      accentColor: '#4A0D37',
    },
    healthcare: {
      fontFamily: 'Verdana, Nunito, "Open Sans", sans-serif', // Clean & readable
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      textColor: '#007BFF', // Medical Blue
      backgroundColor: '#FFFFFF', // White
      accentColor: '#00897B',
    },
    finance: {
      fontFamily: 'Garamond, "Source Sans Pro", system-ui, serif', // Trustworthy & elegant
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#004B23', // Deep Green
      backgroundColor: '#F4F4F4', // Light Gray
      accentColor: '#2A3D66',
    },
    event: {
      fontFamily: 'Oswald, Raleway, system-ui, sans-serif', // Strong & modern
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      textColor: '#E63946', // Vibrant Red
      backgroundColor: '#FFFFFF', // White
      accentColor: '#007BFF',
    },
    elearning: {
      fontFamily: '"Comic Sans MS", Merriweather, "Open Sans", sans-serif', // Casual & friendly
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      textColor: '#004D40', // Dark Green
      backgroundColor: '#FFFFFF', // White
      accentColor: '#333333',
    },
    travel: {
      fontFamily: 'Pacifico, Raleway, system-ui, sans-serif', // Fun & adventurous
      titleFontSize: '1.25rem',
      contentFontSize: '0.875rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      textColor: '#1E90FF', // Ocean Blue
      backgroundColor: '#87CEFA', // Light Sky Blue
      accentColor: '#8B4513',
    },
  };

  return templateStyling[templateId] || templateStyling.corporate;
};

const SlidePreview = () => {
  const { presentation } = usePresentation();
  const { slides, selectedTemplate } = presentation;

  // Helper function to get template colors
  const getTemplateColors = (templateId: TemplateType) => {
    const templates = {
      corporate: {
        primary: '#002B5B',  // Navy Blue
        secondary: '#6F6F6F',
        accent: '#4589FF',
        background: '#FFFFFF',  // White
        text: '#002B5B',  // Navy Blue
      },
      creative: {
        primary: '#5A189A',  // Deep Purple
        secondary: '#9C27B0',
        accent: '#FFCC00',
        background: '#F5F5F5',  // Light Gray
        text: '#5A189A',  // Deep Purple
      },
      academic: {
        primary: '#1C3D6E',  // Dark Blue
        secondary: '#00897B',
        accent: '#4DD0E1',
        background: '#FAF3E0',  // Light Beige
        text: '#1C3D6E',  // Dark Blue
      },
      marketing: {
        primary: '#E63946',  // Bright Red
        secondary: '#FF9800',
        accent: '#FFC107',
        background: '#FFFFFF',  // White
        text: '#E63946',  // Bright Red
      },
      minimalist: {
        primary: '#444444',  // Dark Gray
        secondary: '#757575',
        accent: '#BDBDBD',
        background: '#FFFFFF',  // White
        text: '#444444',  // Dark Gray
      },
      techStartup: {
        primary: '#00A8E8',  // Electric Blue
        secondary: '#1E1E1E',
        accent: '#2ECC71',
        background: '#1E1E1E',  // Dark Gray
        text: '#00A8E8',  // Electric Blue
      },
      businessPitch: {
        primary: '#001F3F',  // Dark Navy
        secondary: '#444444',
        accent: '#102A43',
        background: '#FFFFFF',  // White
        text: '#001F3F',  // Dark Navy
      },
      futuristic: {
        primary: '#00FFFF',  // Neon Blue
        secondary: '#00E5FF',
        accent: '#240046',
        background: '#000000',  // Black
        text: '#00FFFF',  // Neon Blue
      },
      elegant: {
        primary: '#D4AF37',  // Gold
        secondary: '#4A0D37',
        accent: '#1B1B2F',
        background: '#000000',  // Black
        text: '#D4AF37',  // Gold
      },
      healthcare: {
        primary: '#007BFF',  // Medical Blue
        secondary: '#00897B',
        accent: '#E3F2FD',
        background: '#FFFFFF',  // White
        text: '#007BFF',  // Medical Blue
      },
      finance: {
        primary: '#004B23',  // Deep Green
        secondary: '#2A3D66',
        accent: '#F4F4F4',
        background: '#F4F4F4',  // Light Gray
        text: '#004B23',  // Deep Green
      },
      event: {
        primary: '#E63946',  // Vibrant Red
        secondary: '#007BFF',
        accent: '#4B0082',
        background: '#FFFFFF',  // White
        text: '#E63946',  // Vibrant Red
      },
      elearning: {
        primary: '#004D40',  // Dark Green
        secondary: '#333333',
        accent: '#FFF8E1',
        background: '#FFFFFF',  // White
        text: '#004D40',  // Dark Green
      },
      travel: {
        primary: '#1E90FF',  // Ocean Blue
        secondary: '#8B4513',
        accent: '#F4E1C6',
        background: '#87CEFA',  // Light Sky Blue
        text: '#1E90FF',  // Ocean Blue
      },
    };
    
    return templates[templateId];
  };

  // Get all template color properties
  const templateColors = getTemplateColors(selectedTemplate);
  
  // Get complete template styling
  const templateStyles = getTemplateStyles(selectedTemplate);

  const renderSlideContent = (slide: Slide) => {
    // Define common title styling
    const titleStyle = {
      color: templateColors.primary,
      fontFamily: templateStyles.fontFamily,
      fontSize: templateStyles.titleFontSize,
      fontWeight: templateStyles.titleFontWeight,
      fontStyle: templateStyles.titleFontStyle || 'normal',
      textTransform: templateStyles.titleTextTransform || 'none',
    };
    
    // Define common content styling
    const contentStyle = {
      color: templateColors.text,
      fontFamily: templateStyles.fontFamily,
      fontSize: templateStyles.contentFontSize,
      fontWeight: templateStyles.contentFontWeight,
    };

    switch (slide.type) {
      case 'title':
        return (
          <div 
            className="flex flex-col items-center justify-center h-full text-center p-4"
            style={{ color: templateColors.text, fontFamily: templateStyles.fontFamily }}
          >
            <h1 
              className="text-lg font-bold mb-2"
              style={titleStyle}
            >
              {slide.title || 'Title Slide'}
            </h1>
            <p 
              className="text-xs"
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
          >
            <h2 
              className="text-sm font-bold mb-1"
              style={titleStyle}
            >
              {slide.title || 'Content Slide'}
            </h2>
            <div 
              className="text-xs overflow-hidden"
              style={contentStyle}
            >
              {slide.content || 'Slide content goes here'}
            </div>
          </div>
        );
        
      case 'bullets':
        return (
          <div 
            className="flex flex-col h-full p-4"
            style={{ fontFamily: templateStyles.fontFamily }}
          >
            <h2 
              className="text-sm font-bold mb-1"
              style={titleStyle}
            >
              {slide.title || 'Bullet Points'}
            </h2>
            <ul 
              className="text-xs list-disc pl-4 space-y-1"
              style={contentStyle}
            >
              {slide.bullets?.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              )) || <li>Bullet point content</li>}
            </ul>
          </div>
        );
        
      case 'image':
        return (
          <div 
            className="flex flex-col h-full p-4"
            style={{ fontFamily: templateStyles.fontFamily }}
          >
            <h2 
              className="text-sm font-bold mb-1"
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
                <div className="text-xs text-muted-foreground">Image placeholder</div>
              )}
            </div>
            {slide.content && (
              <p 
                className="text-xs mt-1"
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
            style={{ color: templateColors.text, fontFamily: templateStyles.fontFamily }}
          >
            <blockquote 
              className="text-xs italic mb-2"
              style={{ 
                color: templateColors.secondary,
                fontFamily: templateStyles.fontFamily,
                fontSize: templateStyles.contentFontSize
              }}
            >
              "{slide.quote || 'Quote goes here'}"
            </blockquote>
            {slide.author && (
              <cite 
                className="text-xs font-medium"
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
          >
            <h2 
              className="text-sm font-bold mb-1"
              style={titleStyle}
            >
              {slide.title || 'Two Column Layout'}
            </h2>
            <div className="flex flex-1 gap-2">
              <div 
                className="flex-1 text-xs overflow-hidden border-r pr-2"
                style={contentStyle}
              >
                {slide.leftContent || 'Left column content'}
              </div>
              <div 
                className="flex-1 text-xs overflow-hidden pl-2"
                style={contentStyle}
              >
                {slide.rightContent || 'Right column content'}
              </div>
            </div>
          </div>
        );
        
      default:
        return <div className="p-4 text-xs">Slide content</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Preview</h2>
          <TabsList>
            <TabsTrigger value="preview">Slides</TabsTrigger>
            <TabsTrigger value="outline">Outline</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="preview" className="mt-4 flex-1">
          {slides.length === 0 ? (
            <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/30">
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
                        <Move className="h-4 w-4 cursor-move text-muted-foreground" />
                      </div>
                    </div>
                    <Card 
                      className="slide-card overflow-hidden"
                      style={{ 
                        backgroundColor: templateColors.background,
                        borderColor: `${templateColors.primary}20`,
                        backgroundImage: templateStyles.gradient !== 'none' ? templateStyles.gradient : 'none'
                      }}
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
            >
              {slides.length === 0 ? (
                <div className="flex items-center justify-center h-96 border rounded-lg bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <p className="mb-2">No slides generated yet</p>
                    <p className="text-sm">Enter a prompt and click "Generate Presentation"</p>
                  </div>
                </div>
              ) : (
                slides.map((slide, index) => (
                  <Card key={slide.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div 
                        className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: templateColors.primary,
                          color: '#ffffff'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 
                          className="font-medium text-sm mb-1"
                          style={{
                            color: templateColors.primary,
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
                          >
                            {slide.bullets.map((bullet, idx) => (
                              <li key={idx} className="truncate">{bullet}</li>
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

export default SlidePreview;
