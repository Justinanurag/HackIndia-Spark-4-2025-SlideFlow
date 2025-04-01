import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { usePresentation } from '@/context/PresentationContext';

interface ExportButtonProps {
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ className }) => {
  const { exportPresentation, presentation } = usePresentation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);

  // Disable export if there are no slides or if the presentation is being generated
  const isDisabled = presentation.slides.length <= 1 || presentation.isGenerating || isExporting;

  const handleExport = async (format: 'pptx' | 'docx' | 'pdf') => {
    try {
      setIsExporting(true);
      setExportFormat(format);
      await exportPresentation(format);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className={className}
          disabled={isDisabled}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {`Exporting as ${exportFormat?.toUpperCase()}...`}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pptx')}>
          PowerPoint (.pptx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('docx')}>
          Word Document (.docx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          PDF Document (.pdf)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton; 