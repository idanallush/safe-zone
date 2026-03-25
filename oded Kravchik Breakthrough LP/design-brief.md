# בריף עיצוב — דף נחיתה "שוברים תקרות"

## מותג
- שם: ד"ר עודד קרבצ'יק / שיטת FTC (Freedom To Choose)
- לוגו: FTC_LOGO_NEW-03.png (שחור), FTC_LOGO_NEW-04_White.png (לבן)
- אתר קיים: oded-kravtchik.co.il
- אינסטגרם: @oded_kravtchik

## פלטת צבעים
### ראשי
- רקע: #0D0D0D (שחור עמוק)
- טקסט ראשי: #FFFFFF
- אקסנט: #D4A843 (זהב חם)

### משני
- טקסט משני: #B0B0B0
- אקסנט בהיר: #F5C842 (hover/כפתורים)
- רקע סקשנים מתחלפים: #141414
- רקע כרטיסים: #1A1A1A
- גבולות: #2A2A2A

## טיפוגרפיה
- פונט: Heebo (Google Fonts)
- כותרות: 900 (Black) — גדולות, בולטות
- תת-כותרות: 700 (Bold)
- טקסט גוף: 300-400 (Light/Regular), line-height: 1.7
- גדלים: H1=48-64px, H2=32-40px, body=16-18px

## אלמנטים עיצוביים

### כפתורי CTA
- רקע: #D4A843
- טקסט: #0D0D0D
- border-radius: 6px
- padding: 16px 40px
- font-weight: 700
- hover: #F5C842 + subtle scale(1.02)
- transition: all 0.3s ease

### כרטיסים (cards)
- רקע: #1A1A1A
- border: 1px solid #2A2A2A
- border-radius: 12px
- padding: 32px
- hover: border-color #D4A843 (subtle)

### Dividers בין סקשנים
- אין קווים ישרים. הפרדה דרך שינוי צבע רקע (0D0D0D ↔ 141414)
- padding גדול בין סקשנים (80-120px)

### אייקונים
- שימוש ב-SVG inline פשוטים
- צבע: #D4A843 (זהב)
- גודל: 40-48px
- סגנון: מינימלי, קווי (line icons), לא מלאים

## Layout

### Desktop (1200px+)
- max-width: 1200px, מרכזי
- Hero: full-width, padding גדול
- כרטיסים: grid 3 בשורה או 2 בשורה
- עדויות: grid 2x2
- טופס: max-width 600px, מרכזי

### Tablet (768px-1199px)
- כרטיסים: grid 2 בשורה
- עדויות: 2 בשורה
- padding מצומצם יותר

### Mobile (עד 767px)
- הכל אנכי, עמודה אחת
- כותרות קטנות יותר (H1=32-40px)
- padding: 20px
- כפתורים: full-width

## השראה מדפים קיימים
מדפי הנחיתה הקיימים של עודד (oded-kravtchik.co.il):
- סגנון כהה עם אקסנטים בצהוב/זהב
- Hero גדול עם כותרת דרמטית
- מספרים בולטים בשורת אייקונים
- סקשנים מופרדים ברורות
- עדויות וידאו מיוטיוב
- טופס נקי בתחתית
- כותרות צהובות/זהב על רקע כהה

## מה לא לעשות
- אין גרדיאנטים צעקניים (linear-gradient עם ורוד-סגול וכדומה)
- אין particles/confetti/animations כבדות
- אין parallax מוגזם
- אין stock photos
- אין צבעים בהירים/לבנים ברקע — הדף צריך להישאר כהה
- אין עיגולים גדולים / blobs / shapes אקראיים
- אין פונטים מעוצבים מדי — Heebo ומספיק
