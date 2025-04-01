import React from 'react';
import { Button } from '@/components/ui/button';
import { usePresentation } from '@/context/PresentationContext';
import { FileText, File } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportButton from '@/components/ExportButton';

const Header = () => {
  const { presentation, exportPresentation } = usePresentation();
  
  const handleExport = async (format: 'pptx' | 'docx' | 'pdf') => {
    try {
      await exportPresentation(format);
    } catch (error) {
      console.error("Error exporting presentation:", error);
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">SlideFlow</h1>
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            AI-Powered Presentation Generator
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Tabs defaultValue="pptx" className="hidden sm:flex">
            <TabsList>
              <TabsTrigger value="pptx" onClick={() => handleExport('pptx')}>
                <FileText className="h-4 w-4 mr-1" />
                PPTX
              </TabsTrigger>
              <TabsTrigger value="docx" onClick={() => handleExport('docx')}>
                <FileText className="h-4 w-4 mr-1" />
                DOCX
              </TabsTrigger>
              <TabsTrigger value="pdf" onClick={() => handleExport('pdf')}>
                <File className="h-4 w-4 mr-1" />
                PDF
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          
          <div className="hidden sm:block">
            <ExportButton className="min-w-[120px]" />
          </div>
          
          <div className="sm:hidden">
            <ExportButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
