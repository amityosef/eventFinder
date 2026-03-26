import { Typography } from '@mui/material';
import { LegalLayout, LegalSection } from './legalLayout';

export const AccessibilityStatementPage = () => {
    return (
        <LegalLayout title="הצהרת נגישות">
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.9 }}>
                אנו ב-EventFinder רואים חשיבות עליונה בהנגשת האתר לאנשים עם מוגבלויות,
                מתוך אמונה כי לכל אדם מגיעה הזכות ליהנות מחוויית גלישה שוויונית, נוחה ועצמאית.
            </Typography>

            <LegalSection title="סטטוס נגישות">
                האתר הונגש בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013,
                ועל פי המלצות התקן הישראלי (ת"י 5568) ברמת AA, המבוסס על הנחיות WCAG 2.1.
            </LegalSection>

            <LegalSection title="התאמות שבוצעו באתר">
                ניווט מקלדת מלא (Tab, Enter וחצים),
                תאימות לקוראי מסך באמצעות מבנה סמנטי ותגיות ARIA,
                ניגודיות צבעים תקינה והגדלת טקסט,
                תיאורי Alt לתמונות משמעותיות,
                ותוויות והנחיות ברורות בטפסי החיפוש וההתחברות.
            </LegalSection>

            <LegalSection title="סייגים לנגישות">
                אנו ממשיכים לשפר את נגישות האתר באופן שוטף.
                ייתכן שחלקים מסוימים (למשל רכיבים מצדדים שלישיים כמו מפות) טרם הונגשו במלואם.
            </LegalSection>

            <LegalSection title="רכז נגישות ופניות בנושא נגישות">
                שם רכז הנגישות: עמית יוסף
                דוא"ל: eventfinder-app@gmail.com
                אנו מתחייבים לטפל בכל פנייה בנושא נגישות תוך זמן סביר.
            </LegalSection>
        </LegalLayout>
    );
};
