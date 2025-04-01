import React from 'react';
import { usePresentation, Slide, TemplateType } from '@/context/PresentationContext';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Move } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const SlidePreview = () => {
  const { presentation } = usePresentation();
  const { slides, selectedTemplate } = presentation;

  // Helper function to get template colors
  const getTemplateColors = (templateId: TemplateType) => {
    const templates = {
      corporate: {
        primary: '#0F62FE',
        secondary: '#6F6F6F',
        accent: '#4589FF',
        background: '#F4F4F4',
        text: '#161616',
      },
      creative: {
        primary: '#FF3366',
        secondary: '#9C27B0',
        accent: '#FFCC00',
        background: '#FFFFFF',
        text: '#212121',
      },
      academic: {
        primary: '#006064',
        secondary: '#00897B',
        accent: '#4DD0E1',
        background: '#FFFFFF',
        text: '#263238',
      },
      marketing: {
        primary: '#FF5722',
        secondary: '#FF9800',
        accent: '#FFC107',
        background: '#FFFFFF',
        text: '#212121',
      },
      minimalist: {
        primary: '#212121',
        secondary: '#757575',
        accent: '#BDBDBD',
        background: '#FFFFFF',
        text: '#000000',
      },
      techStartup: {
        primary: '#00A8E8',
        secondary: '#1E1E1E',
        accent: '#2ECC71',
        background: '#1E1E1E',
        text: '#00A8E8',
      },
      businessPitch: {
        primary: '#001F3F',
        secondary: '#444444',
        accent: '#102A43',
        background: '#FFFFFF',
        text: '#001F3F',
      },
      futuristic: {
        primary: '#00FFFF',
        secondary: '#00E5FF',
        accent: '#240046',
        background: '#000000',
        text: '#00FFFF',
      },
      elegant: {
        primary: '#D4AF37',
        secondary: '#4A0D37',
        accent: '#1B1B2F',
        background: '#000000',
        text: '#D4AF37',
      },
      healthcare: {
        primary: '#007BFF',
        secondary: '#00897B',
        accent: '#E3F2FD',
        background: '#FFFFFF',
        text: '#007BFF',
      },
      finance: {
        primary: '#004B23',
        secondary: '#2A3D66',
        accent: '#F4F4F4',
        background: '#FFFFFF',
        text: '#004B23',
      },
      event: {
        primary: '#E63946',
        secondary: '#007BFF',
        accent: '#4B0082',
        background: 'linear-gradient(135deg, #000033 0%, #4B0082 100%)',
        text: '#E63946',
      },
      elearning: {
        primary: '#004D40',
        secondary: '#333333',
        accent: '#FFF8E1',
        background: '#FFFFFF',
        text: '#004D40',
      },
      travel: {
        primary: '#1E90FF',
        secondary: '#8B4513',
        accent: '#F4E1C6',
        background: '#87CEFA',
        text: '#1E90FF',
      },
    };
    
    return templates[templateId];
  };

  const templateColors = getTemplateColors(selectedTemplate);

  const renderSlideContent = (slide: Slide) => {
    switch (slide.type) {
      case 'title':
        return (
          <div 
            className="flex flex-col items-center justify-center h-full text-center p-4"
            style={{ color: templateColors.text }}
          >
            <h1 
              className="text-lg font-bold mb-2"
              style={{ color: templateColors.primary }}
            >
              {slide.title || 'Title Slide'}
            </h1>
            <p className="text-xs">{slide.content || 'Subtitle or additional context'}</p>
          </div>
        );
        
      case 'content':
        return (
          <div className="flex flex-col h-full p-4">
            <h2 
              className="text-sm font-bold mb-1"
              style={{ color: templateColors.primary }}
            >
              {slide.title || 'Content Slide'}
            </h2>
            <div 
              className="text-xs overflow-hidden"
              style={{ color: templateColors.text }}
            >
              {slide.content || 'Slide content goes here'}
            </div>
          </div>
        );
        
      case 'bullets':
        return (
          <div className="flex flex-col h-full p-4">
            <h2 
              className="text-sm font-bold mb-1"
              style={{ color: templateColors.primary }}
            >
              {slide.title || 'Bullet Points'}
            </h2>
            <ul className="text-xs list-disc pl-4 space-y-1">
              {slide.bullets?.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              )) || <li>Bullet point content</li>}
            </ul>
          </div>
        );
        
      case 'image':
        return (
          <div className="flex flex-col h-full p-4">
            <h2 
              className="text-sm font-bold mb-1"
              style={{ color: templateColors.primary }}
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
              <p className="text-xs mt-1">{slide.content}</p>
            )}
          </div>
        );
        
      case 'quote':
        return (
          <div 
            className="flex flex-col items-center justify-center h-full text-center p-4"
            style={{ color: templateColors.text }}
          >
            <blockquote 
              className="text-xs italic mb-2"
              style={{ color: templateColors.secondary }}
            >
              "{slide.quote || 'Quote goes here'}"
            </blockquote>
            {slide.author && (
              <cite className="text-xs font-medium">— {slide.author}</cite>
            )}
          </div>
        );
        
      case 'two-column':
        return (
          <div className="flex flex-col h-full p-4">
            <h2 
              className="text-sm font-bold mb-1"
              style={{ color: templateColors.primary }}
            >
              {slide.title || 'Two Column Layout'}
            </h2>
            <div className="flex flex-1 gap-2">
              <div className="flex-1 text-xs overflow-hidden border-r pr-2">
                {slide.leftContent || 'Left column content'}
              </div>
              <div className="flex-1 text-xs overflow-hidden pl-2">
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
                      className="slide-card"
                      style={{ 
                        backgroundColor: templateColors.background,
                        borderColor: `${templateColors.primary}20`
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
            <div className="space-y-4">
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
                        <h3 className="font-medium text-sm mb-1">
                          {slide.title || `${slide.type.charAt(0).toUpperCase() + slide.type.slice(1)} Slide`}
                        </h3>
                        
                        {slide.type === 'bullets' && slide.bullets && (
                          <ul className="text-xs list-disc pl-4 text-muted-foreground">
                            {slide.bullets.map((bullet, idx) => (
                              <li key={idx} className="truncate">{bullet}</li>
                            ))}
                          </ul>
                        )}
                        
                        {slide.content && (
                          <p className="text-xs text-muted-foreground truncate">{slide.content}</p>
                        )}
                        
                        {slide.quote && (
                          <p className="text-xs text-muted-foreground italic truncate">"{slide.quote}"</p>
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
