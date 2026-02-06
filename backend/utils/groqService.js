const Groq = require('groq-sdk');

class GroqResumeAnalyzer {
  constructor() {
    this.groq = null;
  }

  getGroqClient() {
    if (!this.groq) {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not configured. Please add it to your .env file.');
      }
      this.groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
    }
    return this.groq;
  }

  async analyzeResume(resumeText) {
    try {
      const groq = this.getGroqClient();
      
      const prompt = `You are a professional resume analyzer. Extract and analyze the following resume data.
Return ONLY valid JSON in this exact format. If a field is not found, use null.

Resume text:
${resumeText}

JSON Response (must be valid JSON):
{
  "name": "extracted full name or null",
  "email": "extracted email or null",
  "phone": "extracted phone number or null",
  "role": "job title/position or null",
  "summary": "professional summary or key highlights or null",
  "education": "highest education or degree or null"
}`;

      const message = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = message.choices[0].message.content;
      console.log('🤖 Groq raw response:', content);

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Groq response');
      }

      const extractedData = JSON.parse(jsonMatch[0]);
      
      console.log('✅ Groq extracted:', {
        name: extractedData.name || 'missing',
        email: extractedData.email || 'missing',
        education: extractedData.education || 'missing'
      });

      return {
        success: true,
        data: extractedData
      };

    } catch (error) {
      console.error('❌ Groq API Error:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
}

module.exports = new GroqResumeAnalyzer();
