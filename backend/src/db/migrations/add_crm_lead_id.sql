-- Add CRM lead ID column to contact_submissions table
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS crm_lead_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_submissions_crm_lead_id 
ON contact_submissions(crm_lead_id);

-- Add comment to document the field
COMMENT ON COLUMN contact_submissions.crm_lead_id IS 'Lofty CRM lead ID for tracking submissions in external CRM';