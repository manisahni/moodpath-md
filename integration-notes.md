# MoodPath MD - SimplePractice Integration Guide

## Overview
MoodPath MD uses a lightweight screening tool that redirects eligible patients to SimplePractice (or your chosen EMR) for the actual registration, intake, and payment processing.

## Integration Flow

```
Your Website (Screening) → SimplePractice (Everything Else)
```

### What Lives Where:

**On Your Website:**
- Marketing pages (Homepage, About, Services, FAQ)
- 2-minute eligibility screening
- Success/redirect page
- Analytics tracking

**In SimplePractice:**
- Patient registration
- HIPAA-compliant intake forms
- PHQ-9 and GAD-7 assessments
- Consent forms & e-signatures
- Payment processing
- Appointment scheduling
- Video consultations
- Patient portal
- Secure messaging
- Prescription management
- Progress notes

## SimplePractice Setup Steps

### 1. Client Portal Configuration
```
Settings → Client Portal → Enable:
- ✓ Allow online booking
- ✓ Allow new clients to book
- ✓ Require intake forms before booking
- ✓ Collect payment at booking
```

### 2. Intake Forms Setup
Create these forms in SimplePractice:
- New Patient Registration
- Medical History
- PHQ-9 Assessment
- GAD-7 Assessment (optional)
- Consent to Telehealth
- Consent to Treatment
- Financial Agreement
- HIPAA Notice of Privacy Practices

### 3. Service Types & Pricing
```
Settings → Services → Add:
- Initial Consultation (90 min) - $399
- Follow-up Visit (45 min) - $199
- Brief Check-in (15 min) - $89
- Monthly Membership - $149/month
```

### 4. Availability & Scheduling
```
Settings → Availability:
- Set telehealth-only appointments
- Block time for new patient intakes (90 min)
- Enable automated reminders
```

### 5. Payment Processing
```
Settings → Payments:
- Connect Stripe or Square
- Enable credit card processing
- Set up subscription billing for membership
- Configure superbill generation
```

## Redirect Configuration

### Update the redirect URL in your code:

```javascript
// In screening-to-simplepractice.html
const EMR_CONFIG = {
    // Your actual SimplePractice URL
    portal_url: 'https://YOUR-PRACTICE.simplepractice.com/client-portal/new-client',
    
    // Or if using custom domain
    // portal_url: 'https://portal.moodpathmd.com',
};
```

## Alternative EMR Options

### IntakeQ
```javascript
portal_url: 'https://intakeq.com/new/YOUR-PRACTICE-ID/new-patient'
```

### Jane App
```javascript
portal_url: 'https://YOUR-PRACTICE.janeapp.com/online_booking'
```

### Osmind (Psychiatry-focused)
```javascript
portal_url: 'https://app.osmind.com/YOUR-PRACTICE/register'
```

### CharmHealth
```javascript
portal_url: 'https://YOUR-PRACTICE.charmhealth.com/portal/register'
```

## Tracking & Analytics

### What to Track:
1. **Screening starts** - How many begin
2. **Screening completions** - How many finish
3. **Eligibility rate** - % who pass screening
4. **Redirect clicks** - % who continue to SimplePractice
5. **Registration completions** - Track via SimplePractice reports

### SimplePractice Tracking:
SimplePractice provides analytics on:
- New client registrations
- Form completion rates
- Appointment booking rates
- No-show rates
- Revenue reports

## Lab Integration

### Option 1: Manual Orders
1. Generate lab orders in SimplePractice
2. Send PDF to patient via secure message
3. Patient takes to Quest/LabCorp

### Option 2: Direct Integration
SimplePractice integrates with:
- Rupa Health (lab ordering platform)
- Direct lab company accounts

## Genetic Testing Integration

### Manual Process:
1. Order test kit from GeneSight/Genomind
2. Ship to patient address (from SimplePractice)
3. Upload results to patient chart when received
4. Review in follow-up appointment

## Email/SMS Automation

SimplePractice handles:
- Appointment reminders
- Intake form reminders
- Payment receipts
- Secure messages

Your website handles:
- Marketing emails
- Blog/newsletter (optional)

## Security & Compliance

### Your Website:
- SSL certificate
- No PHI storage
- Cookie consent
- Privacy policy

### SimplePractice:
- HIPAA compliant
- BAA provided
- Encrypted storage
- Audit logs
- Data backup

## Cost Breakdown

### Your Website:
- Hosting: ~$20/month
- Domain: ~$15/year
- SSL: Free (Let's Encrypt)

### SimplePractice:
- Starter: $39/month
- Professional: $59/month (recommended)
- Plus telehealth: +$10/month

### Total Monthly Cost:
~$70-90/month for complete solution

## Implementation Timeline

**Week 1:**
- Set up SimplePractice account
- Configure services and pricing
- Create intake forms

**Week 2:**
- Customize client portal
- Set up payment processing
- Configure scheduling

**Week 3:**
- Deploy screening tool on website
- Test full patient flow
- Configure analytics

**Week 4:**
- Soft launch with test patients
- Refine based on feedback
- Go live

## Support Resources

**SimplePractice:**
- Help Center: support.simplepractice.com
- Setup Specialist: Available for onboarding
- API Docs: For advanced integrations

**Your Website:**
- Hosting support (varies by provider)
- Developer for customizations

## Notes

- SimplePractice free trial: 30 days
- They offer migration assistance from other EMRs
- Mobile app available for providers
- Client portal works on all devices
- Telehealth built-in (no Zoom needed)

---

This integration keeps your infrastructure simple while leveraging SimplePractice's robust, HIPAA-compliant platform for all the heavy lifting.