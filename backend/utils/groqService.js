// Defensive Groq wrapper: avoid crashing the app when the SDK or API key
// is unavailable or when provider models are deprecated. Returns a
// structured object that the parser can use to fallback to local logic.

class GroqResumeAnalyzer {
  constructor() {
    this.groq = null;
    this.sdkAvailable = false;
    this._initAttempted = false;
  }

  _safeRequireSdk() {
    if (this._initAttempted) return;
    this._initAttempted = true;
    try {
      // require lazily so a missing env or provider-side behavior at
      // module-load time doesn't crash the process.
      // Some versions of `groq-sdk` may throw during import; guard it.
      // eslint-disable-next-line global-require
      const Groq = require('groq-sdk');
      this.Groq = Groq;
      this.sdkAvailable = true;
    } catch (err) {
      this.sdkAvailable = false;
      this.Groq = null;
      console.warn('groq-sdk not available or failed to load:', err && err.message);
    }
  }

  _getClient() {
    this._safeRequireSdk();
    if (!this.sdkAvailable) return null;

    if (this.groq) return this.groq;

    // Prefer explicit apiKey option to avoid relying on env during SDK init
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return null;
    }

    try {
      this.groq = new this.Groq({ apiKey });
      return this.groq;
    } catch (err) {
      console.warn('Failed to instantiate Groq client:', err && err.message);
      this.groq = null;
      return null;
    }
  }

  async analyzeResume(resumeText) {
    try {
      const groq = this._getClient();

      if (!groq) {
        return {
          success: false,
          error: 'Groq SDK or API key unavailable',
          data: null
        };
      }

      const prompt = `You are a professional resume analyzer. Extract and analyze the following resume data.\nReturn ONLY valid JSON in this exact format. If a field is not found, use null.\n\nResume text:\n${resumeText}\n\nJSON Response (must be valid JSON):\n{\n  "name": "extracted full name or null",\n  "email": "extracted email or null",\n  "phone": "extracted phone number or null",\n  "role": "job title/position or null",\n  "summary": "professional summary or key highlights or null",\n  "education": "highest education or degree or null"\n}`;

      // Provider SDKs may expose different shapes. Try the common one,
      // but guard against undefined properties.
      let message;
      if (groq.chat && groq.chat.completions && typeof groq.chat.completions.create === 'function') {
        message = await groq.chat.completions.create({
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        });
      } else if (typeof groq.createChatCompletion === 'function') {
        // Older/newer SDK shapes - try a fallback call
        message = await groq.createChatCompletion({ model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }] });
      } else {
        return {
          success: false,
          error: 'Groq client does not expose a supported completion method',
          data: null
        };
      }

      const content = (message?.choices?.[0]?.message?.content) || (message?.choices?.[0]?.text) || '';
      console.log('🤖 Groq raw response length:', content.length || 0);

      // Try extract JSON block from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          success: false,
          error: 'No JSON found in Groq response',
          data: null
        };
      }

      const extractedData = JSON.parse(jsonMatch[0]);
      return { success: true, data: extractedData };

    } catch (error) {
      console.error('Groq API Error:', error && (error.message || JSON.stringify(error)));
      return { success: false, error: error && (error.message || String(error)), data: null };
    }
  }
}

module.exports = new GroqResumeAnalyzer();
