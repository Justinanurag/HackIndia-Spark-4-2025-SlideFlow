import React from 'react';
import { usePresentation } from '@/context/PresentationContext';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const SlideCountInput = () => {
  const { presentation, setSlideCount } = usePresentation();
  
  const handleSlideCountChange = (value: number[]) => {
    setSlideCount(value[0]);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="slide-count">Slide Count: {presentation.slideCount}</Label>
        <span className="text-sm text-muted-foreground">
          (Min: 3, Max: 20)
        </span>
      </div>
      <Slider
        id="slide-count"
        defaultValue={[presentation.slideCount]}
        max={20}
        min={3}
        step={1}
        onValueChange={handleSlideCountChange}
        disabled={presentation.isGenerating}
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>Brief</span>
        <span>Comprehensive</span>
      </div>
    </div>
  );
};

export default SlideCountInput; 