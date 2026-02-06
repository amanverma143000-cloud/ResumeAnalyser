const pdfParse = require('pdf-parse');
const groqService = require('./groqService');

class ResumeParser {
  async parseResume(buffer) {
    try {
      // Extract text from PDF
      const data = await pdfParse(buffer);
      const text = data.text;

      console.log('📄 Raw resume text length:', text.length);

      if (!text || text.trim().length < 50) {
        throw new Error('Resume content is too short or unreadable');
      }

      // Use Groq AI to extract resume data
      const groqResult = await groqService.analyzeResume(text);
      
      if (!groqResult.success) {
        throw new Error('Failed to analyze resume with AI: ' + groqResult.error);
      }

      const extractedData = groqResult.data;

      // Validate required fields
      const validation = this.validateRequiredFields(extractedData);
      
      if (!validation.isValid) {
        const missingFields = validation.missingFields.map(f => {
          const names = { 'name': 'Name', 'email': 'Email', 'education': 'Education' };
          return names[f] || f;
        }).join(', ');

        return {
          success: false,
          error: `Missing required fields: ${missingFields}`,
          missingFields: validation.missingFields,
          rawText: text
        };
      }

      // Clean and format data
      const cleanedData = this.cleanExtractedData(extractedData);

      return {
        success: true,
        data: cleanedData,
        rawText: text,
        missingFields: []
      };

    } catch (error) {
      console.error('Parse error:', error);
      return {
        success: false,
        error: error.message,
        rawText: null
      };
    }
  }

  validateRequiredFields(data) {
    const missingFields = [];
    
    if (!data.name || data.name === 'null' || data.name === null) {
      missingFields.push('name');
    }
    if (!data.email || data.email === 'null' || data.email === null) {
      missingFields.push('email');
    }
    if (!data.education || data.education === 'null' || data.education === null) {
      missingFields.push('education');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  cleanExtractedData(data) {
    return {
      name: (data.name && data.name !== 'null') ? data.name.trim() : null,
      email: (data.email && data.email !== 'null') ? data.email.trim().toLowerCase() : null,
      phone: (data.phone && data.phone !== 'null') ? data.phone.trim() : null,
      role: (data.role && data.role !== 'null') ? data.role.trim() : null,
      summary: (data.summary && data.summary !== 'null') ? data.summary.trim() : null,
      education: (data.education && data.education !== 'null') ? data.education.trim() : null
    };
  }
}

module.exports = new ResumeParser();
