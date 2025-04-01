import React from 'react';
import { usePresentation, TemplateType } from '@/context/PresentationContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Import the getTemplateStyles function to get styling details
const getTemplateStyles = (templateId: TemplateType) => {
  const templateStyling = {
    techStartup: {
      fontFamily: 'Exo, Ubuntu, Roboto, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    businessPitch: {
      fontFamily: 'Lato, system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    futuristic: {
      fontFamily: '"Rajdhani", system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'uppercase',
    },
    elegant: {
      fontFamily: '"Playfair Display", serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleFontStyle: 'italic',
      titleTextTransform: 'none',
    },
    healthcare: {
      fontFamily: 'Nunito, "Open Sans", system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    finance: {
      fontFamily: '"Source Sans Pro", system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    event: {
      fontFamily: 'Oswald, Raleway, system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    elearning: {
      fontFamily: 'Merriweather, "Open Sans", system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    travel: {
      fontFamily: 'Raleway, system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '600',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    corporate: {
      fontFamily: 'Arial, Helvetica, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    creative: {
      fontFamily: 'Montserrat, Poppins, system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    academic: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    marketing: {
      fontFamily: 'Raleway, "Open Sans", system-ui, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
    minimalist: {
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      titleFontSize: '1rem',
      contentFontSize: '0.75rem',
      titleFontWeight: '700',
      contentFontWeight: '400',
      titleTextTransform: 'none',
    },
  };

  return templateStyling[templateId] || templateStyling.corporate;
};

// Get background styling based on template type
const getTemplateBackground = (template) => {
  const gradientTemplates = {
    techStartup: 'linear-gradient(45deg, #004e92 0%, #8a2be2 100%)',
    creative: 'linear-gradient(45deg, #FF3366 0%, #9C27B0 100%)',
    futuristic: 'linear-gradient(45deg, #000000 0%, #240046 100%)',
    event: 'linear-gradient(45deg, #000033 0%, #4B0082 100%)'
  };

  // If template has gradient, use it, otherwise use primary color
  return gradientTemplates[template.id] || template.primaryColor;
}

const TemplateSelector = () => {
  const { availableTemplates, presentation, setSelectedTemplate } = usePresentation();

  return (
    <div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {availableTemplates.map((template) => {
            const isSelected = presentation.selectedTemplate === template.id;
            const templateStyles = getTemplateStyles(template.id as TemplateType);
            const backgroundStyle = getTemplateBackground(template);

            return (
              <div
                key={template.id}
                className="w-[220px] flex-shrink-0"
                onClick={() => setSelectedTemplate(template.id as TemplateType)}
              >
                <Card className={`template-card h-full cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-primary shadow-md scale-[1.02]' : 'hover:shadow-md hover:scale-[1.01]'}`}>
                  <div
                    className="h-32 bg-cover bg-center relative"
                    style={{
                      background: typeof backgroundStyle === 'string' ? backgroundStyle : `linear-gradient(45deg, ${template.primaryColor}, ${template.secondaryColor})`,
                    }}
                  >
                    {/* Sample slide preview */}
                    <div
                      className="absolute inset-4 rounded bg-white bg-opacity-10 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center text-white p-2"
                      style={{
                        fontFamily: templateStyles.fontFamily
                      }}
                    >
                      <h3
                        className="text-center text-xs font-bold mb-1"
                        style={{
                          fontWeight: templateStyles.titleFontWeight,
                          textTransform: templateStyles.titleTextTransform || 'none',
                          fontStyle: templateStyles.titleFontStyle || 'normal'
                        }}
                      >
                        Sample Title
                      </h3>
                      <div
                        className="text-center text-[8px] opacity-80"
                        style={{
                          fontWeight: templateStyles.contentFontWeight
                        }}
                      >
                        Preview text
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm flex items-center justify-between group">
                      {template.name}
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs truncate">{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TemplateSelector;
