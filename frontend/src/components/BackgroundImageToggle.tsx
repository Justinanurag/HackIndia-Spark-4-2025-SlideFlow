import React from 'react';
import { usePresentation } from '@/context/PresentationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const BackgroundImageToggle = () => {
  const { presentation, setUseBackgroundImages } = usePresentation();
  
  const handleToggleChange = (checked: boolean) => {
    setUseBackgroundImages(checked);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Background Images</CardTitle>
        <CardDescription>
          Use AI-generated images as slide backgrounds
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Label htmlFor="background-images" className="flex flex-col space-y-1">
            <span>Use as backgrounds</span>
            <span className="text-sm text-muted-foreground">
              Images will cover the entire slide
            </span>
          </Label>
          <Switch
            id="background-images"
            checked={presentation.useBackgroundImages}
            onCheckedChange={handleToggleChange}
            disabled={presentation.isGenerating}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundImageToggle; 