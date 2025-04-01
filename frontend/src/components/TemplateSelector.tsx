
import React from 'react';
import { usePresentation, TemplateType } from '@/context/PresentationContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const TemplateSelector = () => {
  const { availableTemplates, presentation, setSelectedTemplate } = usePresentation();

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold mb-3">Choose a Template</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {availableTemplates.map((template) => (
            <div
              key={template.id}
              className="w-[220px] flex-shrink-0"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <Card className={`template-card ${presentation.selectedTemplate === template.id ? 'active' : ''}`}>
                <div
                  className="h-32 bg-cover bg-center"
                  style={{
                    backgroundColor: template.primaryColor,
                    backgroundImage: `linear-gradient(45deg, ${template.primaryColor}, ${template.secondaryColor})`,
                  }}
                />
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center justify-between group">
                    {template.name}
                    {presentation.selectedTemplate === template.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs truncate">{template.description}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TemplateSelector;
