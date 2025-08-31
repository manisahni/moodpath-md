// ================================================
// GOOGLE APPS SCRIPT - SCREENING BACKEND
// ================================================

// Configuration - UPDATE THESE
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Get from URL of your Google Sheet
const SHEET_NAME = 'Screenings';
const ADMIN_EMAIL = 'your-email@gmail.com';

// ================================================
// WEB APP ENDPOINTS
// ================================================

function doPost(e) {
    try {
        // Parse the incoming data
        const data = JSON.parse(e.postData.contents);
        
        // Add timestamp
        data.receivedAt = new Date().toISOString();
        
        // Save to spreadsheet
        const result = saveToSheet(data);
        
        // Send admin notification if approved
        if (data.evaluationStatus === 'APPROVED') {
            sendAdminNotification(data);
        }
        
        // Return success response
        return ContentService
            .createTextOutput(JSON.stringify({
                success: true,
                message: 'Screening saved successfully',
                id: result.id
            }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        // Log error
        console.error('Error processing screening:', error);
        
        // Return error response
        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: error.toString()
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet(e) {
    return ContentService
        .createTextOutput('MoodPath MD Screening System - Active')
        .setMimeType(ContentService.MimeType.TEXT);
}

// ================================================
// SPREADSHEET FUNCTIONS
// ================================================

function saveToSheet(data) {
    // Open the spreadsheet
    let sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
        createSheet();
        sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    }
    
    // Generate unique ID
    const id = 'SCR-' + Date.now();
    
    // Prepare row data
    const row = [
        id,
        data.receivedAt,
        data.timestamp,
        data.safety,
        data.diagnosis ? data.diagnosis.join(', ') : '',
        data.medications,
        data.medical ? data.medical.join(', ') : '',
        data.requirements ? data.requirements.join(', ') : '',
        data.age,
        data.state,
        data.concern,
        data.evaluationStatus,
        data.evaluationReason,
        data.userAgent,
        data.referrer,
        '', // Email received (manual)
        '', // Interest level (manual)
        ''  // Notes (manual)
    ];
    
    // Append to sheet
    sheet.appendRow(row);
    
    // Color code based on status
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn());
    
    if (data.evaluationStatus === 'APPROVED') {
        range.setBackground('#e8f5e9'); // Light green
    } else if (data.evaluationStatus === 'REJECTED') {
        range.setBackground('#ffebee'); // Light red
    } else {
        range.setBackground('#fff3e0'); // Light yellow
    }
    
    // Update statistics
    updateStatistics();
    
    return { id: id, row: lastRow };
}

function createSheet() {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Add headers
    const headers = [
        'ID',
        'Received At',
        'Submitted At',
        'Safety',
        'Diagnosis',
        'Medications',
        'Medical',
        'Requirements',
        'Age',
        'State',
        'Concern',
        'Status',
        'Reason',
        'User Agent',
        'Referrer',
        'Emailed Us',
        'Interest Level',
        'Notes'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
    }
    
    // Create statistics sheet too
    createStatisticsSheet();
}

function createStatisticsSheet() {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const statsSheet = spreadsheet.insertSheet('Statistics');
    
    // Add statistics template
    const stats = [
        ['SCREENING STATISTICS', ''],
        ['', ''],
        ['Total Screenings', '=COUNTA(Screenings!A:A)-1'],
        ['Approved', '=COUNTIF(Screenings!L:L,"APPROVED")'],
        ['Rejected', '=COUNTIF(Screenings!L:L,"REJECTED")'],
        ['Conditional', '=COUNTIF(Screenings!L:L,"CONDITIONAL")'],
        ['', ''],
        ['Approval Rate', '=B4/B3'],
        ['', ''],
        ['REJECTION REASONS', ''],
        ['Safety Risk', '=COUNTIF(Screenings!M:M,"Safety risk")'],
        ['Psychiatric', '=COUNTIF(Screenings!M:M,"Psychiatric complexity")'],
        ['Treatment Complex', '=COUNTIF(Screenings!M:M,"Treatment complexity")'],
        ['Medical', '=COUNTIF(Screenings!M:M,"Medical complexity")'],
        ['Age', '=COUNTIF(Screenings!M:M,"Age outside range")'],
        ['State', '=COUNTIF(Screenings!M:M,"Not licensed in state")'],
        ['', ''],
        ['DEMOGRAPHICS', ''],
        ['Average Age', '=AVERAGE(Screenings!I:I)'],
        ['', ''],
        ['Last Updated', '=NOW()']
    ];
    
    statsSheet.getRange(1, 1, stats.length, 2).setValues(stats);
    statsSheet.getRange(1, 1).setFontSize(14).setFontWeight('bold');
    statsSheet.getRange('B8').setNumberFormat('0.0%');
}

function updateStatistics() {
    // Force recalculation of statistics
    const statsSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Statistics');
    if (statsSheet) {
        statsSheet.getRange('B21').setValue(new Date());
    }
}

// ================================================
// EMAIL NOTIFICATIONS
// ================================================

function sendAdminNotification(data) {
    const subject = `New Approved Screening - ${data.state}, Age ${data.age}`;
    
    const body = `
New approved screening received!

Demographics:
- Age: ${data.age}
- State: ${data.state}
- Primary Concern: ${data.concern || 'Not specified'}

Status: APPROVED
Time: ${data.timestamp}

The patient has been instructed to email scheduling@moodpathmd.com to join the waitlist.

View all screenings:
${SpreadsheetApp.openById(SPREADSHEET_ID).getUrl()}

---
This is an automated notification from MoodPath MD Screening System
    `;
    
    try {
        MailApp.sendEmail(ADMIN_EMAIL, subject, body);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

function testConnection() {
    return 'Connection successful! Spreadsheet ID: ' + SPREADSHEET_ID;
}

function getStatistics() {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    let approved = 0, rejected = 0, conditional = 0;
    
    // Skip header
    for (let i = 1; i < data.length; i++) {
        const status = data[i][11]; // Status column
        if (status === 'APPROVED') approved++;
        else if (status === 'REJECTED') rejected++;
        else if (status === 'CONDITIONAL') conditional++;
    }
    
    return {
        total: data.length - 1,
        approved: approved,
        rejected: rejected,
        conditional: conditional,
        approvalRate: ((approved / (data.length - 1)) * 100).toFixed(1)
    };
}

// ================================================
// SCHEDULED FUNCTIONS (Optional)
// ================================================

function sendDailySummary() {
    const stats = getStatistics();
    
    const subject = `Daily Screening Summary - ${new Date().toDateString()}`;
    const body = `
Daily Screening Statistics:

Total Screenings: ${stats.total}
Approved: ${stats.approved}
Rejected: ${stats.rejected}
Conditional: ${stats.conditional}
Approval Rate: ${stats.approvalRate}%

View details:
${SpreadsheetApp.openById(SPREADSHEET_ID).getUrl()}
    `;
    
    MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

// To set up daily summary:
// 1. In Apps Script, click clock icon (Triggers)
// 2. Add Trigger
// 3. Choose sendDailySummary
// 4. Time-driven, Day timer, 5pm-6pm
