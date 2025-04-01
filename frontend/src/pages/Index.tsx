import React from 'react';
import { PresentationProvider } from '@/context/PresentationContext';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import DocumentUpload from '@/components/DocumentUpload';
import TemplateSelector from '@/components/TemplateSelector';
import SlidePreview from '@/components/SlidePreview';
import SlideCountInput from '@/components/SlideCountInput';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <PresentationProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container px-4 md:px-8 lg:px-12 pt-4 md:pt-8 lg:pt-12 pb-8 md:pb-12 lg:pb-16">
          <div className="space-y-6 md:space-y-8 lg:space-y-12">
            <div className="space-y-4 md:space-y-6">
              <div className="mb-6 md:mb-8 lg:mb-12">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  Create your AI-powered presentation
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-2 md:mt-3">
                  Enter a description or upload a document to generate professional slides in seconds.
                </p>
              </div>
              
              <div className="space-y-8 md:space-y-12 lg:space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <PromptInput />
                    <div className="space-y-6">
                      <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6">
                        <TemplateSelector />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <SlideCountInput />
                    <div className="bg-card rounded-lg border shadow-sm p-4 md:p-6">
                      <DocumentUpload />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 lg:mt-16">
            <div className="relative h-[400px] md:h-[500px]">
              <SlidePreview />
            </div>
          </div>
        </main>
      </div>
    </PresentationProvider>
  );
};

export default Index;
