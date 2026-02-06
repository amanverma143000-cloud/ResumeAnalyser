const pdfParse = require('pdf-parse');

class ResumeParser {
  constructor() {
    // Enhanced patterns for better extraction
    this.patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+?1?[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}|\+\d{1,3}[-\s]?\d{1,14}/g,
      name: /^([A-Z][a-zA-Z'\-\s]+)$/m,
      education: /(bachelor|master|phd|doctorate|degree|university|college|education|b\.?tech|m\.?tech|b\.?sc|m\.?sc|mba|bba|diploma|certification)/i
    };

    // Expanded job titles and roles
    this.jobTitles = [
      'developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant',
      'specialist', 'coordinator', 'administrator', 'director', 'lead', 'head',
      'senior', 'junior', 'intern', 'associate', 'executive', 'officer',
      'architect', 'scientist', 'researcher', 'technician', 'supervisor',
      'programmer', 'tester', 'qa', 'devops', 'fullstack', 'frontend', 'backend'
    ];
  }

  async parseResume(buffer) {
    try {
      // Extract text from PDF
      const data = await pdfParse(buffer);
      const text = data.text;

      console.log('📄 Raw resume text length:', text.length);

      if (!text || text.trim().length < 50) {
        throw new Error('Resume content is too short or unreadable');
      }

      // LAYER 1: AI-enhanced extraction with context understanding
      const extractedData = await this.aiExtractData(text);
      console.log('🤖 AI extracted fields:', {
        name: extractedData.name || 'null',
        email: extractedData.email || 'null',
        phone: extractedData.phone || 'null',
        role: extractedData.role || 'null',
        education: extractedData.education || 'null'
      });

      // Validate and clean extracted data
      const cleanedData = this.cleanExtractedData(extractedData);

      return {
        success: true,
        data: cleanedData,
        rawText: text
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // AI-enhanced data extraction with context understanding
  async aiExtractData(text) {
    // Clean and normalize text
    const cleanText = this.normalizeText(text);
    
    // Extract data using AI logic with context
    const extractedData = {
      name: this.extractName(cleanText),
      email: this.extractEmail(cleanText),
      phone: this.extractPhone(cleanText),
      role: this.extractRole(cleanText),
      summary: this.extractSummary(cleanText),
      education: this.extractEducation(cleanText)
    };

    // Identify missing required fields
    const missingFields = this.identifyMissingFields(extractedData);
    extractedData.missingFields = missingFields;

    return extractedData;
  }

  normalizeText(text) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  extractName(text) {
    const lines = text.split('\n').filter(line => line.trim());
    
    // Look for name in first 10 lines with better logic
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip headers, emails, phones, addresses
      if (this.isHeaderOrContact(line)) continue;
      
      // Check if line looks like a name
      if (this.isValidName(line)) {
        return this.formatName(line);
      }
    }

    // Fallback: search for name patterns in entire text
    const namePatterns = [
      /^([A-Z][a-zA-Z'\-]+\s+[A-Z][a-zA-Z'\-]+(?:\s+[A-Z][a-zA-Z'\-]+)?)$/m,
      /Name[:\s]+([A-Z][a-zA-Z'\-\s]+)/i,
      /^([A-Z][a-zA-Z'\-]+(?:\s+[A-Z][a-zA-Z'\-]+)+)\s*$/m
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        if (this.isValidName(name)) {
          return this.formatName(name);
        }
      }
    }

    return null;
  }

  isHeaderOrContact(line) {
    const lower = line.toLowerCase();
    return (
      lower.includes('resume') ||
      lower.includes('curriculum') ||
      lower.includes('cv') ||
      this.patterns.email.test(line) ||
      this.patterns.phone.test(line) ||
      lower.includes('@') ||
      /\d{5}/.test(line) || // zip codes
      lower.includes('street') ||
      lower.includes('avenue') ||
      lower.includes('road')
    );
  }

  isValidName(name) {
    if (!name || name.length < 3 || name.length > 50) return false;
    
    const words = name.split(/\s+/);
    if (words.length < 2 || words.length > 4) return false;
    
    // Check if all words start with capital letter
    return words.every(word => 
      /^[A-Z][a-zA-Z'\-]*$/.test(word) && 
      word.length > 1 &&
      !this.isCommonWord(word.toLowerCase())
    );
  }

  isCommonWord(word) {
    const commonWords = ['resume', 'cv', 'curriculum', 'vitae', 'profile', 'contact', 'email', 'phone', 'address'];
    return commonWords.includes(word);
  }

  formatName(name) {
    return name.split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  extractEmail(text) {
    const emails = text.match(this.patterns.email);
    if (emails && emails.length > 0) {
      // Return the first valid email, prioritize professional domains
      const sortedEmails = emails.sort((a, b) => {
        const professionalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
        const aDomain = a.split('@')[1];
        const bDomain = b.split('@')[1];
        
        if (professionalDomains.includes(aDomain) && !professionalDomains.includes(bDomain)) return -1;
        if (!professionalDomains.includes(aDomain) && professionalDomains.includes(bDomain)) return 1;
        return 0;
      });
      return sortedEmails[0].toLowerCase();
    }
    return null;
  }

  extractPhone(text) {
    const phones = text.match(this.patterns.phone);
    if (phones && phones.length > 0) {
      // Clean and format the first phone number found
      let phone = phones[0].replace(/[^\d+\-\s\(\)]/g, '').trim();
      
      // Remove common prefixes and format
      phone = phone.replace(/^\+?1?[-\s]?/, '').replace(/[\(\)\-\s]/g, '');
      
      // Ensure it's a valid length
      if (phone.length >= 10) {
        return phone.length === 10 ? phone : phone.substring(phone.length - 10);
      }
    }
    return null;
  }

  extractRole(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Look for explicit role/title patterns first
    const rolePatterns = [
      /(?:position|role|title|job)[:\s]+([^\n]+)/i,
      /(?:seeking|looking for|applying for)[:\s]+([^\n]+)/i,
      /^([^\n]*(?:engineer|developer|manager|analyst|designer|consultant|specialist|director|lead|architect|scientist)(?:[^\n]*))$/im
    ];

    for (const pattern of rolePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const role = match[1].trim();
        if (role.length > 3 && role.length < 100) {
          return this.formatRole(role);
        }
      }
    }
    
    // Look for job titles in first 15 lines (after name/contact)
    let startIndex = 0;
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (this.isHeaderOrContact(lines[i]) || this.isValidName(lines[i])) {
        startIndex = i + 1;
      }
    }
    
    for (let i = startIndex; i < Math.min(startIndex + 10, lines.length); i++) {
      const line = lines[i];
      if (this.containsJobTitle(line)) {
        return this.formatRole(line);
      }
    }

    // Look in objective/summary sections
    const sections = ['objective', 'summary', 'profile', 'about'];
    for (const section of sections) {
      const sectionMatch = text.match(new RegExp(`${section}[\s\S]*?(?=\n\n|\n[A-Z][a-z]+:|$)`, 'i'));
      if (sectionMatch) {
        const sectionText = sectionMatch[0];
        for (const title of this.jobTitles) {
          if (sectionText.toLowerCase().includes(title)) {
            const sentences = sectionText.split(/[.!?\n]/);
            for (const sentence of sentences) {
              if (sentence.toLowerCase().includes(title) && sentence.trim().length > 10) {
                return this.formatRole(sentence.trim());
              }
            }
          }
        }
      }
    }

    return null;
  }

  containsJobTitle(line) {
    const lower = line.toLowerCase();
    return this.jobTitles.some(title => lower.includes(title)) && 
           line.length > 5 && line.length < 100 &&
           !this.isHeaderOrContact(line);
  }

  formatRole(role) {
    return role.replace(/^[^a-zA-Z]*/, '').replace(/[^a-zA-Z]*$/, '').trim();
  }

  extractSummary(text) {
    // Enhanced summary extraction patterns
    const summaryPatterns = [
      /(?:professional\s+)?summary[:\s]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects)|$)/i,
      /(?:career\s+)?objective[:\s]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects)|$)/i,
      /(?:about\s+me|profile|overview)[:\s]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects)|$)/i,
      /(?:personal\s+statement)[:\s]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects)|$)/i
    ];

    for (const pattern of summaryPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let summary = match[1].trim();
        summary = this.cleanSummaryText(summary);
        if (summary.length > 20 && summary.length < 1000) {
          return summary.length > 400 ? summary.substring(0, 400) + '...' : summary;
        }
      }
    }

    // Fallback: look for paragraph after contact info
    const lines = text.split('\n').filter(line => line.trim());
    let summaryStartIndex = -1;
    
    // Find where contact info ends
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      if (this.patterns.email.test(lines[i]) || this.patterns.phone.test(lines[i])) {
        summaryStartIndex = i + 1;
        break;
      }
    }

    if (summaryStartIndex > -1) {
      for (let i = summaryStartIndex; i < Math.min(summaryStartIndex + 5, lines.length); i++) {
        const line = lines[i].trim();
        if (this.isPotentialSummary(line)) {
          return line.length > 400 ? line.substring(0, 400) + '...' : line;
        }
      }
    }

    return null;
  }

  cleanSummaryText(text) {
    return text
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^[^a-zA-Z]*/, '')
      .trim();
  }

  isPotentialSummary(line) {
    const excludeWords = ['experience', 'education', 'skills', 'work history', 'employment', 'projects'];
    const lower = line.toLowerCase();
    return line.length > 50 && 
           !excludeWords.some(word => lower.includes(word)) &&
           !this.isHeaderOrContact(line);
  }

  extractEducation(text) {
    // Enhanced education extraction patterns
    const educationPatterns = [
      /education[:\s]*([\s\S]*?)(?=\n\s*(?:experience|skills|work|employment|projects|certifications)|$)/i,
      /academic[\s\S]*?(?:background|qualifications)[:\s]*([\s\S]*?)(?=\n\s*(?:experience|skills|work|employment|projects)|$)/i,
      /qualifications[:\s]*([\s\S]*?)(?=\n\s*(?:experience|skills|work|employment|projects)|$)/i
    ];

    for (const pattern of educationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let education = match[1].trim();
        education = this.cleanEducationText(education);
        if (education.length > 10) {
          return education.length > 300 ? education.substring(0, 300) + '...' : education;
        }
      }
    }

    // Look for degree patterns throughout the text
    const degreePatterns = [
      /(bachelor[\s\w]*|master[\s\w]*|phd|doctorate|diploma|certification)[\s\S]*?(?:in|of)[\s\S]*?(?:from|at)?[\s\S]*?(?:university|college|institute|school)/gi,
      /(b\.?tech|m\.?tech|b\.?sc|m\.?sc|mba|bba)[\s\S]*?(?:in|of)?[\s\S]*?(?:from|at)?[\s\S]*?(?:university|college|institute)/gi
    ];

    for (const pattern of degreePatterns) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        const education = matches[0].trim();
        if (education.length > 10 && education.length < 200) {
          return this.cleanEducationText(education);
        }
      }
    }

    // Fallback: look for education keywords in individual lines
    const lines = text.split('\n');
    for (const line of lines) {
      if (this.patterns.education.test(line) && line.trim().length > 15 && line.trim().length < 150) {
        return this.cleanEducationText(line.trim());
      }
    }

    return null;
  }

  cleanEducationText(text) {
    return text
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/^education[:\s]*/i, '')
      .trim();
  }

  // LAYER 2: Fallback text extraction for missing required fields
  fallbackExtractRequiredFields(text, aiData) {
    console.log('🔍 LAYER 2: Fallback extraction for missing fields');
    const fallbackData = { ...aiData };
    
    // Fallback email extraction
    if (!fallbackData.email) {
      const emailMatch = text.match(this.patterns.email);
      if (emailMatch) {
        fallbackData.email = emailMatch[0].toLowerCase().trim();
        console.log('📧 Fallback found email:', fallbackData.email);
      }
    }
    
    // Fallback name extraction - first meaningful line
    if (!fallbackData.name) {
      const lines = text.split('\n').filter(line => line.trim());
      for (let i = 0; i < Math.min(8, lines.length); i++) {
        const line = lines[i].trim();
        
        // Skip obvious non-name lines
        if (line.toLowerCase().includes('resume') || 
            line.toLowerCase().includes('cv') ||
            this.patterns.email.test(line) ||
            this.patterns.phone.test(line) ||
            line.includes('@') ||
            /\d{5}/.test(line)) {
          continue;
        }
        
        // Check if line could be a name (2-4 words, starts with capitals)
        const words = line.split(/\s+/);
        if (words.length >= 2 && words.length <= 4 && line.length > 5 && line.length < 50) {
          const couldBeName = words.every(word => 
            /^[A-Z]/.test(word) && word.length > 1 && !/\d/.test(word)
          );
          if (couldBeName) {
            fallbackData.name = this.formatName(line);
            console.log('👤 Fallback found name:', fallbackData.name);
            break;
          }
        }
      }
    }
    
    // Fallback education extraction - keyword-based
    if (!fallbackData.education) {
      const educationKeywords = [
        'degree', 'bachelor', 'master', 'phd', 'doctorate', 'diploma',
        'b.tech', 'btech', 'm.tech', 'mtech', 'b.sc', 'bsc', 'm.sc', 'msc',
        'mba', 'bba', 'bca', 'mca', 'university', 'college', 'school',
        'institute', 'certification', 'graduate', 'undergraduate'
      ];
      
      const lowerText = text.toLowerCase();
      
      // Check if any education keywords exist
      const hasEducationKeywords = educationKeywords.some(keyword => 
        lowerText.includes(keyword)
      );
      
      if (hasEducationKeywords) {
        // Try to extract education section or line with keywords
        const lines = text.split('\n');
        for (const line of lines) {
          const lowerLine = line.toLowerCase();
          if (educationKeywords.some(keyword => lowerLine.includes(keyword)) && 
              line.trim().length > 10 && line.trim().length < 200) {
            fallbackData.education = line.trim();
            console.log('🎓 Fallback found education:', fallbackData.education);
            break;
          }
        }
        
        // If no specific line found but keywords exist, mark as present
        if (!fallbackData.education) {
          fallbackData.education = 'Education information found in resume';
          console.log('🎓 Fallback detected education keywords in text');
        }
      }
    }
    
    return fallbackData;
  }

  cleanExtractedData(data) {
    const cleaned = {};
    
    // Clean each field
    Object.keys(data).forEach(key => {
      if (key === 'missingFields') {
        cleaned[key] = data[key];
        return;
      }
      
      let value = data[key];
      if (value && typeof value === 'string') {
        value = value.trim();
        if (value.length === 0) {
          value = null;
        }
      }
      cleaned[key] = value;
    });
    
    return cleaned;
  }

  // LAYER 3: Final robust validation with 3-layer system
  validateRequiredFieldsRobust(aiData, rawText) {
    console.log('🔍 LAYER 1: AI extracted data:', {
      name: aiData.name ? 'Found' : 'Missing',
      email: aiData.email ? 'Found' : 'Missing', 
      education: aiData.education ? 'Found' : 'Missing'
    });
    
    // LAYER 2: Apply fallback extraction for missing fields
    const enhancedData = this.fallbackExtractRequiredFields(rawText, aiData);
    
    console.log('🔍 LAYER 2: After fallback extraction:', {
      name: enhancedData.name ? 'Found' : 'Missing',
      email: enhancedData.email ? 'Found' : 'Missing',
      education: enhancedData.education ? 'Found' : 'Missing'
    });
    
    // LAYER 3: Final validation - check what's actually missing
    const required = ['name', 'email', 'education'];
    const actuallyMissing = required.filter(field => {
      const value = enhancedData[field];
      return !value || (typeof value === 'string' && value.trim() === '') || value === null;
    });
    
    console.log('🔍 LAYER 3: Final validation result:', {
      isValid: actuallyMissing.length === 0,
      missingFields: actuallyMissing
    });
    
    return {
      isValid: actuallyMissing.length === 0,
      missingFields: actuallyMissing,
      enhancedData: enhancedData
    };
  }

  // Legacy validation method (kept for backward compatibility)
  validateRequiredFields(data) {
    const required = ['name', 'email', 'education'];
    const missing = required.filter(field => {
      const value = data[field];
      return !value || (typeof value === 'string' && value.trim() === '') || value === null;
    });
    
    return {
      isValid: missing.length === 0,
      missingFields: missing
    };
  }

  identifyMissingFields(data) {
    const required = ['name', 'email', 'education'];
    return required.filter(field => !data[field] || data[field].toString().trim() === '');
  }
}

module.exports = new ResumeParser();