# Ad Safe Zone Checker

כלי מקצועי לבדיקת Safe Zones במודעות דיגיטליות — Facebook, Instagram ו-Google Display Network.

**Live:** https://ad-safe-zone-checker.vercel.app

## מה הכלי עושה

מאפשר למעצבים ומנהלי קמפיינים להעלות קריאטיבים ולראות בדיוק איך הם ייראו בכל מיקום פרסום, עם שכבות Safe Zone שמראות אילו אזורים מוסתרים על ידי ממשק הפלטפורמה (כפתורי CTA, פרופיל, ניווט).

## פיצ'רים

### Facebook & Instagram
- **תמונה בודדת 9:16** — סטורי ורילס עם מוקאפ מלא של ממשק FB/IG
- **קרוסלה 9:16** — עד 10 תמונות, ניווט בין שקופיות
- **קרוסלה 1:1** — קרוסלת פיד עם מוקאפ Facebook/Instagram feed
- **Safe Zones** — שכבות ויזואליות עם מידות בפיקסלים (Meta 2026 guidelines)
- **Toggle Safe Zones** — הפעלה/כיבוי מיידי

### Google Display Network
- **17 גדלי באנר** — Medium Rectangle, Leaderboard, Skyscraper, Mobile ועוד
- **זיהוי אוטומטי** — לפי רזולוציה או שם קובץ
- **מוקאפ אתרים ישראליים** — ynet, mako, walla!, N12, Sport5
- **פילטרים** — Rectangle, Leaderboard, Skyscraper, Mobile

### מוקאפים (Pixel-Perfect)
- **FB Story** — progress bar מחולק, פרופיל + Sponsored, CTA צף "LEARN MORE" עם אייקון לינק כחול, social proof
- **IG Story** — progress bar, פרופיל, CTA "Learn more" צף, בר "Ad" + אייקוני heart/comment/send
- **FB Reels** — hamburger + "Reels" header, אייקוני like/comment/share/bookmark, "Sign up" CTA, "Sponsored" + "Explore more", bottom nav 6 טאבים
- **IG Reels** — ללא header (edge-to-edge), gradient story ring, "Follow", caption, "Ad", music thumbnail, bottom nav 5 אייקונים
- **Feed Carousel** — FB ו-IG, כולל reactions, like/comment/share

### ייצוא
- **PDF** — ייצוא נקי עם רקע מוצק (מחליף glass effects בזמן הצילום)
- **כל הכרטיסים** — ב-PDF כל המוקאפים מוצגים (לא רק הנראים במסך)

### עיצוב
- **Dark Glassmorphism** — כרטיסים שקופים עם backdrop-blur מעל תמונת רקע מטושטשת
- **RTL מלא** — עברית, כולל scroll hints מותאמי RTL
- **רספונסיב** — מותאם למובייל (375px) ועד דסקטופ
- **Scroll hints** — חיצים עם pulse animation שמנחים לגלילה

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
├── index.html    # כל האפליקציה (1714 שורות)
├── .gitignore
└── .vercel/      # הגדרות Vercel
```

## רישיון

פרויקט פנימי.
