import React, { useState } from 'react';
import { usePresentation } from '@/context/PresentationContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MAX_CHARS = 1000;

const PromptInput = () => {
  const { presentation, setPromptText, generatePresentation } = usePresentation();
  const [text, setText] = useState('');
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= MAX_CHARS) {
      setText(newText);
      setPromptText(newText);
    }
  };
  
  const charsRemaining = MAX_CHARS - text.length;
  const charsPercentage = (text.length / MAX_CHARS) * 100;
  
  const handleGenerate = async () => {
    await generatePresentation();
  };

  return (
    <div className="space-y-4">
      <div>
        <Textarea
          id="prompt"
          placeholder="Enter a detailed description of what you want in your presentation..."
          className="min-h-[120px] resize-none"
          value={text}
          onChange={handleTextChange}
          disabled={presentation.isGenerating}
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Character count: {text.length}</span>
          <span>{charsRemaining} characters remaining</span>
        </div>
        <Progress value={charsPercentage} className="h-1 mt-1" />
      </div>
      
      {presentation.isGenerating ? (
        <div className="space-y-3">
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating your presentation...
          </Button>
          <Progress value={presentation.generationProgress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">
            {presentation.generationProgress}% complete - Processing your content...
          </p>
        </div>
      ) : (
        <Button 
          className="w-full"
          disabled={text.length < 10 || presentation.isGenerating}
          onClick={handleGenerate}
        >
          Generate Presentation
        </Button>
      )}
    </div>
  );
};

export default PromptInput;
