# MoodPath MD Screening Decision Flow

## Overview
The screening system uses a **fail-fast evaluation pattern** - it checks for disqualifying conditions in order of severity and immediately rejects if any critical condition is met.

## Decision Tree

```
START
  │
  ▼
Q1: Safety Risk? ──Yes──→ [REJECT: Crisis Resources]
  │ No
  ▼
Q2: Complex Diagnosis? ──Yes──→ [REJECT: Specialized Psychiatry]
  │ No (or "None")
  ▼
Q3: Treatment Resistant? ──Yes──→ [REJECT: Psychiatry Referral]
  │ No
  ▼
Q4: Medical Issues? ──Yes──→ [REJECT: Medical Consultation]
  │ No (or "None")
  ▼
Q5: Has Requirements? ──No──→ [CONDITIONAL: Need Emergency Contact]
  │ Yes
  ▼
Q6: Age 18-75? ──No──→ [REJECT: Age Inappropriate]
  │ Yes
  ▼
Q6: Licensed State? ──No──→ [REJECT: Not Available in State]
  │ Yes
  ▼
Q7: Chief Concern
  │
  ▼
[APPROVED: Welcome to MoodPath MD]
```

## Evaluation Logic (JavaScript Implementation)

### Priority Order:
1. **Safety** - Immediate danger overrides everything
2. **Psychiatric Complexity** - Complex conditions need specialized care
3. **Treatment History** - Treatment-resistant cases need psychiatry
4. **Medical Complications** - Medical issues require coordination
5. **Logistical Requirements** - Safety infrastructure needed
6. **Demographics** - Age and location requirements
7. **Presenting Concern** - Information gathering only

## Rejection Categories & Responses

### 1. SAFETY RISK
- **Trigger**: Suicidal/self-harm thoughts
- **Message**: "Your Safety is Our Priority"
- **Action**: Call 988 immediately
- **Button**: Links to crisis hotline

### 2. PSYCHIATRIC COMPLEXITY
- **Trigger**: Bipolar, Schizophrenia, Borderline, Schizoaffective
- **Message**: "Specialized Care Recommended"
- **Action**: Find a psychiatrist
- **Button**: Links to Psychology Today

### 3. TREATMENT COMPLEXITY
- **Trigger**: 3+ antidepressants tried OR seeing psychiatrist
- **Message**: "Your treatment history suggests specialized care"
- **Action**: Psychiatric referral
- **Button**: Links to Psychology Today

### 4. MEDICAL COMPLEXITY
- **Trigger**: Pregnancy, substance use, seizures, organ disease, eating disorders
- **Message**: "Medical Consultation Needed"
- **Action**: Consult primary care
- **Button**: Links to ZocDoc

### 5. AGE RESTRICTIONS
- **Trigger**: Age < 18 or > 75
- **Message**: Age-specific messaging
- **Action**: Find age-appropriate care
- **Button**: Links to Psychology Today

### 6. GEOGRAPHIC RESTRICTIONS
- **Trigger**: State not in: CA, NY, TX, FL, IL, PA, AZ
- **Message**: "Not Available in Your State"
- **Action**: Find local providers
- **Button**: Links to Psychology Today

## Approval Path

### Requirements for Approval:
✓ No safety concerns
✓ No complex psychiatric conditions
✓ Not treatment-resistant
✓ No medical complications
✓ Has emergency contact
✓ Age 18-75
✓ In licensed state
✓ Any presenting concern

### Approved Response:
- **Title**: "You're a Good Fit!"
- **Message**: Personalized welcome
- **Shows**: Practice email (scheduling@moodpathmd.com)
- **Button**: "View Pricing" → pricing.html
- **Data**: Stored in sessionStorage for intake

## Data Collection

### Form Data Structure:
```javascript
{
  safety: 'yes/no',
  diagnosis: ['bipolar', 'schizophrenia', ...],
  medications: 'none/therapy/1-2/3+/psychiatrist',
  medical: ['pregnant', 'substance', ...],
  requirements: ['contact', 'pcp', 'space', 'internet'],
  age: number,
  state: 'CA/NY/TX/...',
  concern: 'work-stress/depression/anxiety/...'
}
```

### Evaluation Metadata:
- Timestamp
- Evaluation status (APPROVED/REJECTED/CONDITIONAL)
- Rejection reason (if applicable)
- User agent
- Referrer source

## Integration Points

### 1. Google Sheets (Optional)
- Configure `CONFIG.googleScriptUrl`
- Sends all form data + evaluation result
- Non-blocking (uses no-cors mode)

### 2. Session Storage
- Stores approved screening data
- Used for intake form pre-population
- Keys: `screening_passed`, `screening_responses`

### 3. Future SimplePractice Integration
- Ready for API integration
- Structured data format
- HIPAA considerations in place

## Business Logic Rationale

### Why This Flow?

1. **Safety First**: Legal and ethical obligation
2. **Scope of Practice**: MD can handle mild-moderate cases
3. **Medical Safety**: Avoid drug interactions/complications
4. **Geographic Licensing**: Legal requirement
5. **Age Limits**: Insurance and expertise boundaries

### Target Patient Profile:
- Adults 18-75
- Mild to moderate depression/anxiety
- First-time or early treatment
- No complex comorbidities
- Has support system
- In licensed states

This screening effectively filters for patients who can be safely and effectively treated via telepsychiatry with medication management.