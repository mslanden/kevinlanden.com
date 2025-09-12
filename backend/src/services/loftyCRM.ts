import axios from 'axios';

interface LoftyLeadData {
  firstName: string;
  lastName?: string;
  emails?: string[];
  phones?: string[];
  leadTypes?: number[];
  source?: string;
  content?: string;
  inquiry?: {
    locations?: Array<{
      stateCode?: string;
      city?: string;
      zipCode?: string;
      description?: string;
    }>;
  };
  tags?: string[];
  stage?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  leadType?: string;
}

export class LoftyCRMService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.LOFTY_API_URL || 'https://api.lofty.com/v1.0';
    this.apiKey = process.env.LOFTY_API_KEY || '';
  }

  /**
   * Convert contact form data to Lofty CRM lead format
   */
  private formatContactToLead(contactData: ContactFormData): LoftyLeadData {
    // Split name into first and last name
    const nameParts = contactData.name.trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Map lead type from form to Lofty CRM ID
    const leadTypeMap: { [key: string]: number } = {
      'buyer': 2,
      'seller': 1,
      'renter': 5,
      'investor': 6,
      'general': -1 // Other
    };

    const loftyLeadType = leadTypeMap[contactData.leadType || 'buyer'] || 2;
    const leadTypeLabel = contactData.leadType || 'buyer';

    // Build the lead data
    const leadData: LoftyLeadData = {
      firstName: firstName.substring(0, 30), // Max 30 chars per API spec
      lastName: lastName.substring(0, 30), // Max 30 chars per API spec
      emails: contactData.email ? [contactData.email] : [],
      phones: contactData.phone ? [contactData.phone.substring(0, 20)] : [], // Max 20 chars per phone
      leadTypes: [loftyLeadType],
      source: 'Website Contact Form',
      content: `Subject: ${contactData.subject}\n\nMessage: ${contactData.message}`,
      stage: 'New Lead',
      tags: ['Website Inquiry', 'Contact Form', `${leadTypeLabel.charAt(0).toUpperCase() + leadTypeLabel.slice(1)} Lead`],
      inquiry: {
        locations: [
          {
            stateCode: 'CA',
            city: 'Anza', // Default to Anza, could be parsed from message if needed
            description: 'Website contact form submission'
          }
        ]
      }
    };

    return leadData;
  }

  /**
   * Send a lead to Lofty CRM
   */
  async createLead(contactData: ContactFormData): Promise<{ success: boolean; leadId?: string; error?: string }> {
    try {
      if (!this.apiKey) {
        console.warn('Lofty API key not configured, skipping CRM integration');
        return { success: false, error: 'API key not configured' };
      }

      const leadData = this.formatContactToLead(contactData);

      const response = await axios.post(
        `${this.apiUrl}/leads`,
        leadData,
        {
          headers: {
            'Authorization': `token ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data && response.data.leadId) {
        console.log('Successfully created lead in Lofty CRM:', response.data.leadId);
        return { 
          success: true, 
          leadId: response.data.leadId 
        };
      }

      return { 
        success: false, 
        error: 'No lead ID returned from Lofty' 
      };

    } catch (error: any) {
      console.error('Error creating lead in Lofty CRM:', error.response?.data || error.message);
      
      // Don't throw - we don't want CRM errors to break contact form submission
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Unknown error' 
      };
    }
  }

  /**
   * Test the Lofty CRM connection
   */
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('Lofty API key not configured');
        return false;
      }

      // Test with a minimal request to check auth
      const response = await axios.get(
        `${this.apiUrl}/users/me`, // Assuming there's a user endpoint
        {
          headers: {
            'Authorization': `token ${this.apiKey}`
          },
          timeout: 5000
        }
      );

      return response.status === 200;
    } catch (error) {
      console.error('Lofty CRM connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const loftyCRM = new LoftyCRMService();