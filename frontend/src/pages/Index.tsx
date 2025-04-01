import React from 'react';
import { PresentationProvider } from '@/context/PresentationContext';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import DocumentUpload from '@/components/DocumentUpload';
import TemplateSelector from '@/components/TemplateSelector';
import SlidePreview from '@/components/SlidePreview';
import SlideCountInput from '@/components/SlideCountInput';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import apiService from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Index = () => {
  // Add a diagnostic function to inspect the API
  const runApiDiagnostics = async () => {
    try {
      console.log("Running API diagnostics...");
      toast({
        title: "API Diagnostics",
        description: "Checking API requirements, see console for details",
      });
      
      // First, check if the API is reachable at all
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/health`, {
          method: 'GET',
        });
        console.log("API Health Check:", response.status, response.statusText);
      } catch (error) {
        console.error("API Health Check Failed:", error);
      }
      
      // Try to inspect the export endpoint
      const exportInfo = await apiService.inspectApiEndpoint('/api/export');
      console.log("Export API info:", exportInfo);
      
      // Try a minimal POST to see error details
      try {
        const minimalPayload = {
          format: 'pptx',
          title: 'Test Presentation',
          slides: [{ type: 'title', title: 'Test Slide' }]
        };
        
        // Send with text response type to see error message
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/export`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(minimalPayload)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", response.status, response.statusText);
          console.error("Error Details:", errorText);
          
          toast({
            title: "API Diagnostics Complete",
            description: `Found error: ${response.status} ${response.statusText}. Check console for details.`,
            variant: "destructive"
          });
        } else {
          console.log("Minimal export succeeded!");
          toast({
            title: "API Diagnostics Complete",
            description: "Test export succeeded! Check console for details.",
          });
        }
      } catch (error) {
        console.error("Diagnostic POST failed:", error);
        toast({
          title: "API Diagnostics Failed",
          description: "Could not complete diagnostics. See console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("API Diagnostics Error:", error);
    }
  };
  
  const testTemplateExport = async (template: string) => {
    try {
      toast({
        title: `Testing Template: ${template}`,
        description: "Generating test presentation...",
      });
      
      const result = await apiService.debugExportPresentation('pptx', template);
      
      if (result.success) {
        toast({
          title: "Test Export Successful",
          description: `Template "${template}" exported successfully!`,
        });
      } else {
        toast({
          title: "Test Export Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Test export error:", error);
      toast({
        title: "Test Export Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  return (
    <PresentationProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container px-4 md:px-8 lg:px-12 pt-4 md:pt-8 lg:pt-12 pb-8 md:pb-12 lg:pb-16">
          <div className="space-y-6 md:space-y-8 lg:space-y-12">
            <div className="mb-6 md:mb-8 lg:mb-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                Create your AI-powered presentation
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mt-2 md:mt-3">
                Enter a description or upload a document to generate professional slides in seconds.
              </p>
              
              {/* Diagnostic button for developers */}
              <div className="mt-4 flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={runApiDiagnostics}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                >
                  🔍 Debug API Export
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toast({
                      title: "Direct Debug Export",
                      description: "Attempting minimal export request..."
                    });
                    apiService.debugExportPresentation('pptx')
                      .then(result => {
                        if (result.success) {
                          toast({
                            title: "Debug Export Successful",
                            description: "Check console for details and downloads"
                          });
                        } else {
                          toast({
                            title: "Debug Export Failed",
                            description: `Error: ${result.status || 'Unknown'}. Check console.`,
                            variant: "destructive"
                          });
                        }
                      });
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                >
                  📤 Direct Debug Export
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - 2/3 width on desktop */}
              <div className="md:col-span-2 space-y-8">
                {/* Prompt Input Section */}
                <div className="bg-card rounded-lg border shadow-sm p-5">
                  <h2 className="text-lg font-semibold mb-4">Describe your presentation</h2>
                  <PromptInput />
                </div>
                
                {/* Template Selector Section */}
                <div className="bg-card rounded-lg border shadow-sm p-5">
                  <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
                  <TemplateSelector />
                </div>
              </div>
              
              {/* Right Column - 1/3 width on desktop */}
              <div className="space-y-8">
                {/* Slide Count Section */}
                <div className="bg-card rounded-lg border shadow-sm p-5">
                  <h2 className="text-lg font-semibold mb-4">Number of Slides</h2>
                  <SlideCountInput />
                </div>
                
                {/* Document Upload Section */}
                <div className="bg-card rounded-lg border shadow-sm p-5">
                  <h2 className="text-lg font-semibold mb-4">Upload a Document (Optional)</h2>
                  <DocumentUpload />
                </div>
              </div>
            </div>
          </div>
          
          {/* Slides Preview Section */}
          <div className="mt-12">
            <div className="relative h-[400px] md:h-[500px]">
              <SlidePreview />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-100 rounded-md">
            <h3 className="text-lg font-semibold mb-3">Template Style Test Tools</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => testTemplateExport('corporate')} variant="outline" size="sm">
                Test Corporate
              </Button>
              <Button onClick={() => testTemplateExport('creative')} variant="outline" size="sm">
                Test Creative
              </Button>
              <Button onClick={() => testTemplateExport('minimalist')} variant="outline" size="sm">
                Test Minimalist
              </Button>
              <Button onClick={() => testTemplateExport('academic')} variant="outline" size="sm">
                Test Academic
              </Button>
              <Button onClick={() => testTemplateExport('marketing')} variant="outline" size="sm">
                Test Marketing
              </Button>
            </div>
          </div>
        </main>
      </div>
    </PresentationProvider>
  );
};

export default Index;
