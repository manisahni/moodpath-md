# Google Form Setup for HIPAA-Compliant Safety Check

## Overview
This setup collects ONLY emails from eligible patients. No health information is stored in Google Forms.

## What Gets Collected:
- ✅ Email address (for eligible patients only)
- ✅ Timestamp
- ✅ Status ("Eligible")
- ❌ NO health information
- ❌ NO diagnostic criteria
- ❌ NO personal health data

## Step 1: Create Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new blank form
3. Title it: "MoodPath MD Registration Interest"

## Step 2: Add Fields

### Field 1: Email
- Type: Short answer
- Question: "Email"
- Required: Yes
- Validation: Email address

### Field 2: Timestamp
- Type: Short answer  
- Question: "Submission Time"
- Required: No

### Field 3: Status
- Type: Short answer
- Question: "Status"
- Required: No
- Default: "Eligible"

## Step 3: Get Form Response URL

1. Click the three dots menu → "Get pre-filled link"
2. Fill in dummy data:
   - Email: test@example.com
   - Timestamp: 2024-01-01
   - Status: Eligible
3. Click "Get link"
4. Copy the URL - it will look like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSd.../formResponse?entry.123456=test@example.com&entry.789012=...
   ```

## Step 4: Extract Entry IDs

From the URL above, note the entry IDs:
- Email field: `entry.123456` (whatever number is before =test@example.com)
- Timestamp field: `entry.789012` 
- Status field: `entry.345678`

## Step 5: Update safety-check.html

Replace these lines in the safety-check.html file:

```javascript
// Line 432-433
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_ACTUAL_FORM_ID/formResponse';
const EMAIL_FIELD_NAME = 'entry.YOUR_EMAIL_ENTRY_ID';

// Lines 518-519
formData.append('entry.YOUR_TIMESTAMP_ID', new Date().toISOString());
formData.append('entry.YOUR_STATUS_ID', 'Eligible');
```

## Step 6: Set Up Email Notifications

1. In Google Forms, click "Responses" tab
2. Click three dots → "Get email notifications for new responses"
3. This sends you an email each time someone eligible submits

## Step 7: Create Google Sheet for Responses

1. In Google Forms, click "Responses" tab
2. Click green Sheets icon to create a spreadsheet
3. This creates a Google Sheet with columns:
   - Timestamp (auto)
   - Email
   - Submission Time
   - Status

## Step 8: Set Up Automated Email Workflow

### Option A: Manual Process (Simple)
1. Check Google Sheet daily
2. Send registration links manually to new emails
3. Mark as "Sent" in a new column

### Option B: Zapier/Make Automation
1. Trigger: New row in Google Sheet
2. Filter: Status = "Eligible"
3. Action: Send email with registration link
4. Update row with "Email Sent" status

### Option C: Google Apps Script (Free)
```javascript
function sendRegistrationEmails() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const email = data[i][1]; // Email column
    const status = data[i][3]; // Status column
    const emailSent = data[i][4]; // Email Sent column
    
    if (status === 'Eligible' && !emailSent) {
      // Send email
      MailApp.sendEmail({
        to: email,
        subject: 'MoodPath MD - Complete Your Registration',
        htmlBody: `
          <p>Thank you for completing the safety check!</p>
          <p>Please complete your registration here:</p>
          <a href="YOUR_REGISTRATION_LINK">Complete Registration</a>
          <p>This link expires in 48 hours.</p>
        `
      });
      
      // Mark as sent
      sheet.getRange(i + 1, 5).setValue('Sent');
    }
  }
}

// Run every hour
function setupTrigger() {
  ScriptApp.newTrigger('sendRegistrationEmails')
    .timeBased()
    .everyHours(1)
    .create();
}
```

## Privacy & HIPAA Considerations

### What This Approach Does:
- ✅ Collects only contact info from ELIGIBLE patients
- ✅ No health data stored in Google
- ✅ Exclusion criteria shown but not recorded
- ✅ Patient self-attests without details

### What This Approach Doesn't Do:
- ❌ Doesn't store who was excluded
- ❌ Doesn't record specific health conditions
- ❌ Doesn't track failed attempts
- ❌ Doesn't store any PHI

### For Full HIPAA Compliance Later:
When you're ready for a fully compliant system, consider:
- HIPAA-compliant form services (JotForm HIPAA, Formstack)
- SimplePractice intake forms
- Custom solution with proper BAA agreements

## Testing

1. Open http://localhost:4000/safety-check.html
2. Check both boxes
3. Enter an email
4. Submit
5. Verify email appears in Google Sheet
6. Test that you receive notification email

## Important URLs to Update

After setup, update these in safety-check.html:
- `GOOGLE_FORM_URL` (line 432)
- `EMAIL_FIELD_NAME` (line 433)
- Entry IDs (lines 518-519)

This approach keeps you HIPAA-safe while building your practice!