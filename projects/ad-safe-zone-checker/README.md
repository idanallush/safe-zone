# Ad Safe Zone Checker

כלי מקצועי לבדיקת Safe Zones במודעות דיגיטליות — Facebook, Instagram ו-Google Display Network.

**Live:** https://ad-safe-zone-checker.vercel.app

## מה הכלי עושה

מאפשר למעצבים ומנהלי קמפיינים להעלות קריאטיבים ולראות בדיוק איך הם ייראו בכל מיקום פרסום, עם שכבות Safe Zone שמראות אילו אזורים מוסתרים על ידי ממשק הפלטפורמה (כפתורי CTA, פרופיל, ניווט).

## פיצ'רים

### Facebook & Instagram
- **תמונה בודדת 9:16** — סטורי ורילס עם מוקאפ מינימלי של ממשק FB/IG
- **תמונה/וידאו 4:5** — פוסט פיד עם מוקאפ IG/FB feed
- **קרוסלה 9:16** — עד 10 תמונות, ניווט בין שקופיות
- **קרוסלה 1:1** — קרוסלת פיד עם מוקאפ Facebook/Instagram feed
- **Safe Zones** — שכבות ויזואליות צהובות עם מידות באחוזים ובפיקסלים
- **תוויות חיצוניות** — מידות Safe Zone מוצגות מחוץ למוקאפ עם קווי חיבור, לא על התמונה
- **Toggle Safe Zones** — הפעלה/כיבוי מיידי (כולל תוויות חיצוניות)

### Safe Zone Specs (Meta 2026, בסיס: 1440x2560)

| פורמט | למעלה | למטה | צדדים |
|-------|-------|------|-------|
| Stories (IG + FB) | 14% (358px) | 14% (358px) | ללא |
| Reels (IG + FB) | 14% (358px) | 35% (896px) | 6% (86px) |
| Feed (4:5, 1:1) | ללא | ללא | ללא |

### מיקומי פרסום (12 מוקאפים)

**שורה 1 — סטוריז ורילס (9:16):**
- IG Story, FB Story, IG Reels, FB Reels
- IG Story Carousel, FB Story Carousel, IG Reels Carousel, FB Reels Carousel

**שורה 2 — פיד (4:5):**
- IG Feed Post, FB Feed Post

**שורה 3 — קרוסלה פיד (1:1):**
- IG Feed Carousel, FB Feed Carousel

### Google Display Network
- **17 גדלי באנר** — Medium Rectangle, Leaderboard, Skyscraper, Mobile ועוד
- **זיהוי אוטומטי** — לפי רזולוציה או שם קובץ
- **מוקאפ אתרים ישראליים** — ynet, mako, walla!, N12, Sport5
- **פילטרים** — Rectangle, Leaderboard, Skyscraper, Mobile

### מוקאפים (Meta-style — ללא מסגרת טלפון)
- **מסך פשוט** — מלבן מעוגל 9:16 עם רקע שחור, ללא bezel/status bar/nav bar
- **IG Story** — progress bar + פרופיל Bright + Sponsored + CTA pill + Ad
- **FB Story** — 3 סגמנטים progress + פרופיל Bright Agency + Sponsored + CTA pill + Ad
- **IG Reels** — אייקוני heart/comment/send (ללא ספירות) + פרופיל + caption + CTA + Ad
- **FB Reels** — "Reels" header + אייקוני like/comment/share + פרופיל + CTA + Sponsored
- **IG Feed (4:5)** — header + תמונה 4:5 + אייקוני פעולה + caption
- **FB Feed (4:5)** — header + תמונה 4:5 + Like/Comment/Share
- **Feed Carousel** — header + track + ניווט + dots

### ייצוא
- **PDF** — ייצוא נקי עם רקע מוצק (מחליף glass effects בזמן הצילום)
- **כל הכרטיסים** — ב-PDF כל המוקאפים מוצגים (לא רק הנראים במסך)

### עיצוב
- **Dark Glassmorphism** — כרטיסים שקופים עם backdrop-blur מעל תמונת רקע מטושטשת
- **צבע Safe Zone צהוב** — אוברליי, קווים מקווקווים, ותוויות בגוון זהב/צהוב
- **RTL מלא** — עברית, כולל scroll hints מותאמי RTL
- **רספונסיב** — מותאם למובייל (375px) ועד דסקטופ
- **Scroll hints** — חיצים עם pulse animation שמנחים לגלילה
- **מיתוג Bright** — לוגו ושם Bright Agency בכל המוקאפים

## טכנולוגיות

| טכנולוגיה | שימוש |
|-----------|-------|
| HTML/CSS/JS | Single-file application |
| Tailwind CSS (CDN) | Utility-first styling |
| html2canvas | צילום DOM ל-canvas |
| jsPDF | יצירת PDF מ-canvas |
| Vercel | Hosting + Deploy |

## נגישות

- `prefers-reduced-motion` — מבטל אנימציות למי שמעדיף
- `cursor-pointer` — על כל אלמנט אינטראקטיבי
- `aria-label` — על כפתורים ו-toggle
- `role="switch"` — על Safe Zones toggle
- Focus visible — outline כחול על Tab navigation
- Keyboard support — Enter/Space על toggle

## פיתוח מקומי

```bash
npx serve ad-safe-zone-checker -l 8091
```

ופתח http://localhost:8091

## מבנה

```
ad-safe-zone-checker/
├── index.html                                              # כל האפליקציה (~1620 שורות)
├── 220829521_102123092143924_6403435025276078538_n.jpg      # לוגו Bright Agency
├── README.md
├── .gitignore
└── .vercel/                                                 # הגדרות Vercel
```

## רישיון

פרויקט פנימי — Bright Agency.
