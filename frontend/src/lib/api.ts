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
}

export interface ExportRequest {
  contentData: any;
  templateStyle: string;
  format: 'pptx' | 'docx' | 'pdf';
  presentation_id?: string;
}

const apiService = {
  // Generate presentation from prompt and/or document
  generatePresentation: async (data: GenerateRequest) => {
    const formData = new FormData();
    
    if (data.prompt) {
      formData.append('prompt', data.prompt);
    }
    
    if (data.document) {
      formData.append('document', data.document);
    }
    
    formData.append('template_style', data.templateStyle);
    
    if (data.slideCount) {
      formData.append('slide_count', data.slideCount.toString());
    }
    
    const response = await api.post('/api/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Get available templates
  getTemplates: async () => {
    const response = await api.get('/api/templates');
    return response.data;
  },
  
  // Export presentation to specified format
  exportPresentation: async (data: ExportRequest) => {
    // If the contentData includes presentation_id at the root level, extract it
    if (data.contentData && data.contentData.presentation_id && !data.presentation_id) {
      data.presentation_id = data.contentData.presentation_id;
    }
    
    const response = await api.post('/api/export', data, {
      responseType: 'blob',
    });
    
    // Create a download link for the file
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'presentation';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Add the appropriate extension if not already present
    if (!filename.includes('.')) {
      filename += `.${data.format}`;
    }
    
    // Create a URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return { success: true, filename };
  },
};

export default apiService; 