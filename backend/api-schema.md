# MoodPath MD - Backend API Schema & Database Design

## Database Schema

### 1. Screening Submissions
```sql
CREATE TABLE screening_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Screening Data
    responses JSONB NOT NULL,
    result VARCHAR(50) NOT NULL, -- 'success', 'crisis', 'refer', 'conditional'
    referral_reason VARCHAR(100),
    
    -- Contact Info (if provided)
    email VARCHAR(255),
    age INTEGER,
    state VARCHAR(2),
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Tracking
    session_id VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    INDEX idx_email (email),
    INDEX idx_result (result),
    INDEX idx_created (created_at)
);
```

### 2. Users/Patients
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mfa_secret VARCHAR(255),
    
    -- Personal Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20) NOT NULL,
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10),
    
    -- Medical Info
    pcp_name VARCHAR(255),
    pcp_phone VARCHAR(20),
    pcp_fax VARCHAR(20),
    pharmacy_name VARCHAR(255),
    pharmacy_phone VARCHAR(20),
    insurance_provider VARCHAR(100),
    insurance_member_id VARCHAR(100),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    emergency_contact_relationship VARCHAR(50),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, inactive, terminated
    eligibility_verified BOOLEAN DEFAULT FALSE,
    consent_signed_at TIMESTAMP,
    
    -- Subscription
    subscription_type VARCHAR(50), -- 'membership', 'per_visit'
    subscription_status VARCHAR(50), -- 'active', 'cancelled', 'past_due'
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status)
);
```

### 3. Medical Intake
```sql
CREATE TABLE medical_intake (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    
    -- Current Symptoms
    chief_complaint TEXT,
    symptom_duration VARCHAR(50),
    symptom_severity INTEGER, -- 1-10 scale
    
    -- Medical History
    medical_conditions JSONB, -- Array of conditions
    current_medications JSONB, -- Array of {name, dose, frequency}
    medication_allergies JSONB,
    previous_hospitalizations JSONB,
    
    -- Psychiatric History
    previous_diagnoses JSONB,
    previous_medications JSONB, -- Antidepressants tried
    previous_therapy BOOLEAN,
    family_psychiatric_history TEXT,
    substance_use JSONB,
    
    -- Assessment Scores
    phq9_score INTEGER,
    phq9_responses JSONB,
    gad7_score INTEGER,
    gad7_responses JSONB,
    
    -- Lifestyle
    sleep_hours_average DECIMAL(3,1),
    exercise_frequency VARCHAR(50),
    alcohol_use VARCHAR(50),
    caffeine_intake VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Lab Orders & Results
```sql
CREATE TABLE lab_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    
    -- Order Info
    order_date DATE NOT NULL,
    lab_facility VARCHAR(50), -- 'quest', 'labcorp'
    order_code VARCHAR(50),
    tests_ordered JSONB,
    
    -- Status
    status VARCHAR(50) DEFAULT 'ordered', -- ordered, completed, reviewed
    completed_date DATE,
    reviewed_date DATE,
    reviewed_by UUID,
    
    -- Results
    results JSONB,
    abnormal_flags JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Appointments
```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    
    -- Scheduling
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    appointment_type VARCHAR(50), -- 'initial', 'follow_up', 'check_in'
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    
    -- Video Link
    video_room_url VARCHAR(255),
    video_room_id VARCHAR(100),
    
    -- Notes
    pre_appointment_notes TEXT,
    post_appointment_notes TEXT,
    
    -- Billing
    amount DECIMAL(10,2),
    payment_status VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Genetic Testing
```sql
CREATE TABLE genetic_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    
    -- Test Info
    test_provider VARCHAR(50), -- 'genesight', 'genomind'
    test_ordered_date DATE,
    test_completed_date DATE,
    
    -- Results
    raw_results JSONB,
    medication_recommendations JSONB,
    
    -- Interpretations
    green_bin_meds JSONB, -- Use as directed
    yellow_bin_meds JSONB, -- Use with caution
    red_bin_meds JSONB, -- Use with increased caution
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Screening Endpoints

```yaml
POST /api/screening/validate
  Description: Validate screening responses in real-time
  Request:
    responses: object
    currentQuestion: number
  Response:
    eligible: boolean
    reason?: string
    nextAction?: string

POST /api/screening/submit
  Description: Submit completed screening
  Request:
    responses: object
    email?: string
    age?: number
    state?: string
  Response:
    result: string
    referralResources?: array
    registrationToken?: string

GET /api/screening/check-eligibility/:email
  Description: Check if email has passed screening
  Response:
    eligible: boolean
    screeningDate?: date
    expiresAt?: date
```

### Registration Endpoints

```yaml
POST /api/auth/register
  Description: Create new patient account
  Request:
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    dateOfBirth: date
    state: string
    emergencyContact: object
    screeningToken: string
  Response:
    userId: string
    accessToken: string
    refreshToken: string
    nextStep: string

POST /api/auth/login
  Request:
    email: string
    password: string
  Response:
    accessToken: string
    refreshToken: string
    user: object

POST /api/auth/refresh
  Request:
    refreshToken: string
  Response:
    accessToken: string
    refreshToken: string

POST /api/auth/forgot-password
  Request:
    email: string

POST /api/auth/reset-password
  Request:
    token: string
    newPassword: string
```

### Medical Intake Endpoints

```yaml
POST /api/intake/medical-history
  Description: Submit medical history
  Auth: Required
  Request:
    medicalConditions: array
    currentMedications: array
    allergies: array
    previousHospitalizations: array

POST /api/intake/psychiatric-history
  Request:
    previousDiagnoses: array
    previousMedications: array
    familyHistory: string
    substanceUse: object

POST /api/intake/assessments
  Request:
    phq9Responses: array
    gad7Responses?: array
  Response:
    phq9Score: number
    phq9Severity: string
    gad7Score?: number
    gad7Severity?: string

GET /api/intake/status
  Response:
    completedSections: array
    pendingSections: array
    readyToSchedule: boolean
```

### Lab Management Endpoints

```yaml
POST /api/labs/order
  Description: Generate lab order
  Auth: Required (Admin)
  Request:
    patientId: string
    tests: array
    facility: string

GET /api/labs/locations
  Description: Find nearby lab locations
  Request:
    zipCode: string
    radius?: number
  Response:
    locations: array

POST /api/labs/results
  Description: Upload lab results
  Auth: Required (Admin)
  Request:
    orderId: string
    results: object

GET /api/labs/patient/:patientId
  Description: Get patient's lab history
  Response:
    orders: array
```

### Appointment Endpoints

```yaml
GET /api/appointments/availability
  Description: Get available appointment slots
  Request:
    startDate: date
    endDate: date
    appointmentType: string
  Response:
    availableSlots: array

POST /api/appointments/book
  Auth: Required
  Request:
    date: date
    time: time
    appointmentType: string
  Response:
    appointmentId: string
    confirmationCode: string
    videoLink: string

PUT /api/appointments/:id/reschedule
  Request:
    newDate: date
    newTime: time

DELETE /api/appointments/:id/cancel
  Request:
    reason?: string

GET /api/appointments/upcoming
  Response:
    appointments: array
```

### Payment Endpoints

```yaml
POST /api/payments/create-intent
  Description: Create Stripe payment intent
  Auth: Required
  Request:
    amount: number
    appointmentId?: string
    paymentType: string
  Response:
    clientSecret: string
    paymentIntentId: string

POST /api/payments/confirm
  Request:
    paymentIntentId: string
  Response:
    status: string
    receiptUrl: string

POST /api/subscriptions/create
  Request:
    plan: string // 'monthly_membership'
    paymentMethodId: string
  Response:
    subscriptionId: string
    status: string

DELETE /api/subscriptions/:id/cancel
  Request:
    reason?: string
    immediate?: boolean
```

### Genetic Testing Endpoints

```yaml
POST /api/genetics/order
  Description: Order genetic test kit
  Auth: Required
  Request:
    patientId: string
    testProvider: string

POST /api/genetics/results
  Description: Upload genetic test results
  Auth: Required (Admin)
  Request:
    patientId: string
    results: object

GET /api/genetics/recommendations/:patientId
  Description: Get medication recommendations
  Response:
    recommendations: object
    lastUpdated: date
```

## Security Considerations

### Authentication
- JWT tokens with 15-minute access token expiry
- Refresh tokens with 7-day expiry
- Rate limiting: 100 requests per minute per IP
- MFA optional but recommended

### Data Protection
- All PII encrypted at rest (AES-256)
- TLS 1.3 for all connections
- HIPAA-compliant audit logging
- Regular security scans

### Compliance
- HIPAA Business Associate Agreements with all vendors
- Data retention: 7 years per medical record requirements
- Patient data export available on request
- Right to deletion (where legally permissible)

## Integration Points

### External Services
```yaml
Stripe:
  - Payment processing
  - Subscription management
  - Invoice generation

SendGrid/Postmark:
  - Transactional emails
  - Appointment reminders
  - Lab result notifications

Twilio:
  - SMS reminders
  - Two-factor authentication
  - Emergency notifications

Zoom/Doxy.me:
  - Video consultation platform
  - HIPAA-compliant video rooms
  - Recording capabilities (with consent)

Quest/LabCorp APIs:
  - Lab order submission
  - Result retrieval
  - Location services

GeneSight/Genomind:
  - Test kit ordering
  - Result retrieval
  - Medication interaction data
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_xyz123"
}
```

### Error Codes
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/expired token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 409: Conflict (duplicate resource)
- 422: Unprocessable Entity (business logic error)
- 429: Too Many Requests (rate limited)
- 500: Internal Server Error
- 503: Service Unavailable (maintenance mode)

## Monitoring & Analytics

### Key Metrics to Track
- Screening completion rate
- Screening to registration conversion
- Time to first appointment
- Lab completion rate
- PHQ-9 score improvements
- Subscription retention rate
- Payment success rate
- Video call quality metrics