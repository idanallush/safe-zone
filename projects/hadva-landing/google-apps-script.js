/**
 * ============================================================
 *  Google Apps Script - שליחת לידים מדף נחיתה לגוגל שיטס
 * ============================================================
 *
 *  הוראות התקנה:
 *
 *  1. פתח את הגוגל שיטס:
 *     https://docs.google.com/spreadsheets/d/1mGTMuaoOe2LVJ8bCJTlwbieYOVpm1zKLbud7WXLmy60
 *
 *  2. בתפריט העליון לחץ על: תוספים > Apps Script
 *     (Extensions > Apps Script)
 *
 *  3. מחק את כל הקוד שיש שם והדבק את הקוד הזה במקום
 *
 *  4. לחץ שמירה (Ctrl+S)
 *
 *  5. לחץ על "פריסה" > "פריסה חדשה"
 *     (Deploy > New deployment)
 *
 *  6. בחר סוג: "אפליקציית אינטרנט" (Web app)
 *     - תיאור: "Lead Form Handler"
 *     - ביצוע כ: "אני" (Me)
 *     - גישה: "כל אחד" (Anyone)
 *
 *  7. לחץ "פריסה" (Deploy)
 *
 *  8. אשר את ההרשאות (תצטרך לאשר דרך חשבון גוגל)
 *
 *  9. העתק את ה-URL שמופיע (נראה ככה:)
 *     https://script.google.com/macros/s/XXXXXXXXX/exec
 *
 *  10. הדבק את ה-URL בקובץ index.html במקום:
 *      REPLACE_WITH_YOUR_APPS_SCRIPT_URL
 *
 * ============================================================
 */

// שם הגיליון בגוגל שיטס
const SHEET_NAME = 'דף נחיתה חדש';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      // אם הגיליון לא קיים, צור אותו
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const newSheet = ss.insertSheet(SHEET_NAME);
      newSheet.appendRow(['תאריך', 'שם מלא', 'טלפון', 'אימייל', 'נושא', 'מקור', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'landing_url']);

      // עיצוב שורת הכותרת
      const headerRange = newSheet.getRange(1, 1, 1, 14);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#E96A7E');
      headerRange.setFontColor('#FFFFFF');

      return processData(e, newSheet);
    }

    return processData(e, sheet);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function processData(e, sheet) {
  let data;

  // Parse the incoming data
  if (e.postData) {
    data = JSON.parse(e.postData.contents);
  } else {
    data = e.parameter;
  }

  // Add row to sheet
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('he-IL'),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.topic || '',
    data.source || 'landing-page',
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
    data.utm_content || '',
    data.utm_term || '',
    data.fbclid || '',
    data.gclid || '',
    data.landing_url || ''
  ]);

  // Return success response
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success', message: 'Lead saved successfully' })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success', message: 'Lead form handler is active' })
  ).setMimeType(ContentService.MimeType.JSON);
}
