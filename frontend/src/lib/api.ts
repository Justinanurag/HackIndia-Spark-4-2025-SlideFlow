import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GenerateRequest {
  prompt?: string;
  document?: File;
  templateStyle: string;
  slideCount?: number;
  templateDetails?: any;
}

export interface ExportRequest {
  contentData: any;
  templateStyle: string;
  format: 'pptx' | 'docx' | 'pdf';
  presentation_id?: string;
  imagePlacement?: string;
  templateDetails?: any;
}

// Create a simple function to inspect the API endpoint requirements
const inspectApiEndpoint = async (endpointPath: string) => {
  try {
    // First, try a simple OPTIONS request to see if we can get metadata
    const optionsResponse = await axios({
      method: 'options',
      url: `${API_BASE_URL}${endpointPath}`,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log(`API OPTIONS response for ${endpointPath}:`, optionsResponse);
    return optionsResponse.data;
  } catch (error) {
    console.error(`Failed to inspect API endpoint ${endpointPath}:`, error);
    
    // Try a simple GET request as fallback
    try {
      const getResponse = await axios({
        method: 'get',
        url: `${API_BASE_URL}${endpointPath}`,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`API GET response for ${endpointPath}:`, getResponse);
      return getResponse.data;
    } catch (secondError) {
      console.error(`Second attempt to inspect API endpoint ${endpointPath} also failed:`, secondError);
      return null;
    }
  }
};

const apiService = {
  // Check API requirements
  inspectApiEndpoint,
  
  // Generate presentation from prompt and/or document
  generatePresentation: async (data: GenerateRequest) => {
    try {
      const formData = new FormData();
      
      if (data.prompt) {
        formData.append('prompt', data.prompt);
      }
      
      if (data.document) {
        formData.append('document', data.document);
      }
      
      // Always include template style as a basic string identifier
      formData.append('template_style', data.templateStyle);
      
      if (data.slideCount) {
        formData.append('slide_count', data.slideCount.toString());
      }
      
      // Add template details as JSON string if provided, with simplified, essential properties
      if (data.templateDetails) {
        // Extract the most critical styling properties
        const {
          fontFamily, 
          titleFontSize, 
          contentFontSize,
          textColor,
          backgroundColor,
          primaryColor,
          secondaryColor,
          accentColor
        } = data.templateDetails;
        
        // Create a simplified template style object with just the essentials
        const templateStyleData = {
          // Basic template identification
          template_name: data.templateStyle,
          template_id: data.templateStyle,
          
          // Essential styling properties - using both camelCase and snake_case for compatibility
          backgroundColor,
          textColor,
          primaryColor,
          secondaryColor,
          accentColor,
          fontFamily,
          
          // Snake case versions for backend
          background_color: backgroundColor,
          text_color: textColor, 
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          accent_color: accentColor,
          font_family: fontFamily,
          title_font_size: titleFontSize,
          content_font_size: contentFontSize
        };
        
        // Add the template details as a JSON string
        formData.append('template_details', JSON.stringify(templateStyleData));
        
        // Also append the most critical individual styling properties directly
        formData.append('background_color', backgroundColor || '#FFFFFF');
        formData.append('text_color', textColor || '#000000');
        formData.append('font_family', fontFamily || 'Arial, sans-serif');
        formData.append('primary_color', primaryColor || textColor || '#000000');
      }
      
      console.log('Generating presentation with template:', data.templateStyle);
      
      const response = await api.post('/api/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw error;
    }
  },
  
  // Get available templates
  getTemplates: async () => {
    const response = await api.get('/api/templates');
    return response.data;
  },
  
  // Export presentation to specified format
  exportPresentation: async (data: ExportRequest) => {
    try {
      console.log('Attempting export with format:', data.format);
      
      // Get template information
      const templateStyle = data.templateStyle;
      const templateDetails = data.templateDetails || {};
      
      // Create a proper payload that includes all relevant slide content
      const simplePayload = {
        format: data.format,
        template_style: templateStyle,
        template_id: templateStyle, // Add explicit template_id
        template_name: templateStyle, // Add explicit template_name
        title: data.contentData.title || "Untitled Presentation",
        slides: data.contentData.slides.map(slide => {
          // Include all meaningful properties for each slide type
          const slideObj: any = {
            type: slide.type,
            title: slide.title || "",
          };
          
          if (slide.content) slideObj.content = slide.content;
          if (slide.bullets) slideObj.bullets = slide.bullets;
          if (slide.quote) slideObj.quote = slide.quote;
          if (slide.author) slideObj.author = slide.author;
          if (slide.image_url) slideObj.image_url = slide.image_url;
          if (slide.left_content) slideObj.left_content = slide.left_content;
          if (slide.right_content) slideObj.right_content = slide.right_content;
          
          return slideObj;
        }),
        // Include template styling details at the root level
        backgroundColor: templateDetails.backgroundColor || "#FFFFFF",
        textColor: templateDetails.textColor || "#000000",
        primaryColor: templateDetails.primaryColor || "#0066CC",
        secondaryColor: templateDetails.secondaryColor || "#6F6F6F",
        accentColor: templateDetails.accentColor || "#4589FF",
        fontFamily: templateDetails.fontFamily || "Arial, sans-serif",
        titleFontSize: templateDetails.titleFontSize || "44pt",
        contentFontSize: templateDetails.contentFontSize || "28pt",
        titleFontWeight: templateDetails.titleFontWeight || "bold",
        contentFontWeight: templateDetails.contentFontWeight || "regular",
        
        // Snake case versions for backend compatibility
        background_color: templateDetails.backgroundColor || "#FFFFFF",
        text_color: templateDetails.textColor || "#000000",
        primary_color: templateDetails.primaryColor || "#0066CC",
        secondary_color: templateDetails.secondaryColor || "#6F6F6F", 
        accent_color: templateDetails.accentColor || "#4589FF",
        font_family: templateDetails.fontFamily || "Arial, sans-serif",
        title_font_size: templateDetails.titleFontSize || "44pt",
        content_font_size: templateDetails.contentFontSize || "28pt",
        title_font_weight: templateDetails.titleFontWeight || "bold",
        content_font_weight: templateDetails.contentFontWeight || "regular",
        
        // Add template_details object with complete styling info
        template_details: {
          template_id: templateStyle,
          template_name: templateStyle,
          ...templateDetails,
          background_color: templateDetails.backgroundColor || "#FFFFFF",
          text_color: templateDetails.textColor || "#000000",
          primary_color: templateDetails.primaryColor || "#0066CC",
          secondary_color: templateDetails.secondaryColor || "#6F6F6F",
          accent_color: templateDetails.accentColor || "#4589FF",
          font_family: templateDetails.fontFamily || "Arial, sans-serif",
          title_font_size: templateDetails.titleFontSize || "44pt",
          content_font_size: templateDetails.contentFontSize || "28pt"
        }
      };
      
      // Debug log the exact payload we're sending
      console.log('Export payload:', JSON.stringify(simplePayload, null, 2));
      
      // Make a simpler direct request with fetch for better error handling
      try {
        const response = await fetch(`${API_BASE_URL}/api/export`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(simplePayload)
        });
        
        // If response is not ok, try to get the error text
        if (!response.ok) {
          // Clone the response so we can both read the text and still get the blob
          const responseClone = response.clone();
          const errorText = await responseClone.text();
          console.error('Error response text:', errorText);
          throw new Error(`Export failed with status ${response.status}: ${errorText}`);
        }
        
        // Process successful response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename = `presentation.${data.format}`;
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
        
        return { success: true, filename, download_url: url };
      } catch (error) {
        console.error('Export attempt failed:', error);
        throw error;
      }
    } catch (error) {
      console.error('All export attempts failed:', error);
      throw error;
    }
  },
  
  // Debug version of export function with even more minimal payload
  debugExportPresentation: async (format: 'pptx' | 'docx' | 'pdf' = 'pptx', templateId: string = 'corporate') => {
    try {
      console.log(`Debug export called with template: ${templateId}, format: ${format}`);
      
      // Map template names to their style properties
      const templateStyles: Record<string, any> = {
        corporate: {
          backgroundColor: '#FFFFFF',
          textColor: '#002B5B', 
          primaryColor: '#0F62FE',
          secondaryColor: '#6F6F6F',
          accentColor: '#4589FF',
          fontFamily: 'Roboto, Arial, sans-serif',
          templateName: 'Corporate'
        },
        creative: {
          backgroundColor: '#F5F5F5',
          textColor: '#5A189A',
          primaryColor: '#FF3366',
          secondaryColor: '#9C27B0',
          accentColor: '#FFCC00',
          fontFamily: 'Lobster, Montserrat, sans-serif',
          templateName: 'Creative'
        },
        minimalist: {
          backgroundColor: '#FFFFFF',
          textColor: '#444444',
          primaryColor: '#212121',
          secondaryColor: '#757575',
          accentColor: '#BDBDBD',
          fontFamily: 'Futura, Helvetica Neue, Arial, sans-serif',
          templateName: 'Minimalist'
        },
        academic: {
          backgroundColor: '#FAF3E0',
          textColor: '#1C3D6E',
          primaryColor: '#006064',
          secondaryColor: '#00897B',
          accentColor: '#4DD0E1',
          fontFamily: 'Times New Roman, Georgia, serif',
          templateName: 'Academic'
        },
        marketing: {
          backgroundColor: '#FFFFFF',
          textColor: '#E63946',
          primaryColor: '#FF5722',
          secondaryColor: '#FF9800',
          accentColor: '#FFC107',
          fontFamily: 'Impact, Raleway, sans-serif',
          templateName: 'Marketing'
        }
      };
      
      // Get the specific template style or default to corporate
      const templateStyle = templateStyles[templateId] || templateStyles.corporate;
      
      // Create a test presentation with diverse slide types
      const minimalPayload = {
        format: format,
        template_style: templateId,
        template_id: templateId,
        template_name: templateStyle.templateName,
        title: `Test ${templateStyle.templateName} Presentation`,
        slides: [
          {
            type: 'title',
            title: 'Test Title Slide',
            content: 'Subtitle text for a test presentation'
          },
          {
            type: 'content',
            title: 'Content Slide',
            content: 'This is a sample content slide with regular paragraph text. It demonstrates how text content appears in a standard slide.'
          },
          {
            type: 'bullets',
            title: 'Bullet Points Slide',
            bullets: [
              'First important bullet point',
              'Second bullet with key information',
              'Third bullet showing data',
              'Final summary point with conclusion'
            ]
          },
          {
            type: 'quote',
            title: 'Quote Example',
            quote: 'The best way to predict the future is to create it.',
            author: 'Peter Drucker'
          },
          {
            type: 'two-column',
            title: 'Two Column Layout',
            left_content: 'This content appears in the left column of the slide.',
            right_content: 'While this text will appear in the right column of the slide.'
          }
        ],
        // Include comprehensive styling in multiple formats
        // CamelCase versions (JavaScript style)
        backgroundColor: templateStyle.backgroundColor,
        textColor: templateStyle.textColor,
        primaryColor: templateStyle.primaryColor,
        secondaryColor: templateStyle.secondaryColor,
        accentColor: templateStyle.accentColor,
        fontFamily: templateStyle.fontFamily, 
        titleFontSize: '44pt',
        contentFontSize: '28pt',
        titleFontWeight: 'bold',
        contentFontWeight: 'regular',
        
        // Snake_case versions (Python/backend style)
        background_color: templateStyle.backgroundColor,
        text_color: templateStyle.textColor,
        primary_color: templateStyle.primaryColor,
        secondary_color: templateStyle.secondaryColor,
        accent_color: templateStyle.accentColor,
        font_family: templateStyle.fontFamily,
        title_font_size: '44pt',
        content_font_size: '28pt',
        title_font_weight: 'bold',
        content_font_weight: 'regular',
        
        // Nested template_details object with all styling properties
        template_details: {
          template_id: templateId,
          template_name: templateStyle.templateName,
          background_color: templateStyle.backgroundColor,
          text_color: templateStyle.textColor,
          primary_color: templateStyle.primaryColor,
          secondary_color: templateStyle.secondaryColor,
          accent_color: templateStyle.accentColor,
          font_family: templateStyle.fontFamily,
          title_font_size: '44pt',
          content_font_size: '28pt',
          title_font_weight: 'bold',
          content_font_weight: 'regular'
        }
      };
      
      console.log('Trying debug export with minimal payload:', JSON.stringify(minimalPayload, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(minimalPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Debug export failed:', response.status, response.statusText);
        console.error('Error details:', errorText);
        return {
          success: false,
          status: response.status,
          error: errorText
        };
      }
      
      console.log('Debug export succeeded!');
      
      // Create the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const filename = `debug_presentation.${format}`;
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
      return { success: true, filename, download_url: url };
    } catch (error) {
      console.error('Debug export failed with exception:', error);
      return { 
        success: false, 
        error: error.message
      };
    }
  },
};

export default apiService; 