import React from 'react';
import { usePresentation } from '@/context/PresentationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const SlideCountInput = () => {
  const { presentation, setSlideCount } = usePresentation();
  
  const handleSlideCountChange = (value: number[]) => {
    setSlideCount(value[0]);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Number of Slides</CardTitle>
        <CardDescription>
          Select how many slides you want in your presentation
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
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
      </CardContent>
    </Card>
  );
};

export default SlideCountInput; 