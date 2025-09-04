# 🧠 IdeaFlux - منصة التفكير البصري العربية

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/ideaflux/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Arabic Support](https://img.shields.io/badge/Arabic-100%25-green)](https://github.com/ideaflux/ideaflux)

**IdeaFlux** هي أول منصة للتفكير البصري مصممة خصيصاً للمستخدم العربي. منصة مجانية بالكامل تقدم قماشاً لانهائياً لتنظيم الأفكار والبحوث مع دعم كامل للغة العربية وميزات متقدمة تتفوق على المنافسين.

## ✨ الميزات الرئيسية

### 🆚 مقارنة مع المنافسين
| الميزة | IdeaFlux | Scrintal | Miro | Notion |
|--------|----------|----------|------|---------|
| 🆓 مجاني بالكامل | ✅ | ❌ | ❌ | ❌ |
| 🌐 دعم عربي كامل | ✅ | ❌ | 🟡 | 🟡 |
| 🤖 ذكاء اصطناعي | ✅ | 🟡 | ❌ | 🟡 |
| ♾️ قماش لانهائي | ✅ | ✅ | ✅ | ❌ |
| 👥 تعاون فوري | ✅ | ✅ | ✅ | ✅ |

### 🚀 المزايا الحصرية

- **🎯 مصمم للعرب**: واجهة عربية بالكامل مع دعم RTL
- **💰 مجاني إلى الأبد**: جميع الميزات متاحة دون قيود
- **🧠 ذكاء اصطناعي متقدم**: يفهم السياق العربي
- **⚡ أداء فائق**: تحميل سريع وتجربة سلسة
- **🔒 أمان متقدم**: تشفير شامل وحماية البيانات
- **📱 متجاوب**: يعمل على جميع الأجهزة

## 🛠️ التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Fonts**: Google Fonts (Cairo)
- **Icons**: Font Awesome 6
- **Hosting**: Netlify
- **PWA Ready**: Service Worker support

## 🚀 التشغيل المحلي

### المتطلبات الأساسية
- Node.js >= 14.0.0
- npm >= 6.0.0

### خطوات التشغيل

```bash
# استنساخ المشروع
git clone https://github.com/ideaflux/ideaflux.git
cd ideaflux

# تثبيت التبعيات
npm install

# تشغيل الخادم المحلي
npm run dev

# الموقع سيكون متاح على http://localhost:3000
```

## 📁 هيكل المشروع

```
ideaflux/
├── index.html          # الصفحة الرئيسية
├── styles.css          # ملف الأنماط الرئيسي
├── script.js           # ملف JavaScript الرئيسي
├── package.json        # إعدادات المشروع
├── netlify.toml        # إعدادات Netlify
├── README.md           # هذا الملف
└── assets/             # الملفات الثابتة (إذا وجدت)
    ├── images/
    ├── icons/
    └── fonts/
```

## 🎨 التصميم والألوان

### لوحة الألوان
- **اللون الأساسي**: `#6366f1` (Indigo)
- **اللون الثانوي**: `#f59e0b` (Amber)
- **النجاح**: `#10b981` (Emerald)
- **الخطر**: `#ef4444` (Red)
- **النص**: `#111827` (Gray-900)

### الخطوط
- **الخط الأساسي**: Cairo (Google Fonts)
- **الأوزان**: 300, 400, 500, 600, 700

## 🌐 النشر على Netlify

### النشر التلقائي
المشروع مهيأ للنشر التلقائي على Netlify:

1. ادفع التغييرات إلى GitHub
2. Netlify ستقوم بالبناء والنشر تلقائياً
3. الموقع متاح على: `https://ideaflux.netlify.app`

### النشر اليدوي
```bash
# بناء المشروع
npm run build

# النشر إلى Netlify
npm run deploy
```

## 🔧 التخصيص

### إضافة ميزات جديدة
1. أضف HTML في `index.html`
2. أضف الأنماط في `styles.css`
3. أضف الوظائف في `script.js`

### تخصيص الألوان
عدّل المتغيرات CSS في بداية ملف `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #f59e0b;
    /* ... باقي المتغيرات */
}
```

## 📊 إحصائيات الأداء

- **⚡ سرعة التحميل**: < 2 ثانية
- **📱 نقاط الأداء**: 95+ (Lighthouse)
- **♿ إمكانية الوصول**: AA متوافق
- **🔍 تحسين محركات البحث**: محسن بالكامل

## 🐛 الإبلاغ عن المشاكل

إذا واجهت مشكلة:
1. تحقق من [قائمة المشاكل المعروفة](https://github.com/ideaflux/ideaflux/issues)
2. أنشئ [تقريراً جديداً](https://github.com/ideaflux/ideaflux/issues/new) إذا لم تجد المشكلة

## 🤝 المساهمة

نرحب بمساهماتك! اتبع هذه الخطوات:

1. Fork المشروع
2. أنشئ فرعاً جديداً (`git checkout -b feature/amazing-feature`)
3. Commit تغييراتك (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. أنشئ Pull Request

### إرشادات المساهمة
- استخدم أسماء متغيرات وصفية باللغة العربية في التعليقات
- اتبع نمط الكود الموجود
- أضف تعليقات واضحة
- اختبر التغييرات قبل الإرسال

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🌟 الشكر والتقدير

- **Scrintal**: لإلهام فكرة التفكير البصري
- **Font Awesome**: للأيقونات الرائعة
- **Google Fonts**: لخط Cairo الجميل
- **Netlify**: للاستضافة المجانية المتقدمة

## 📞 التواصل

- **📧 البريد الإلكتروني**: support@ideaflux.com
- **🌐 الموقع**: https://ideaflux.netlify.app
- **💬 الدعم**: متاح 24/7

---

<div align="center">

**صنع بـ ❤️ للمبدعين العرب**

[الموقع الرسمي](https://ideaflux.netlify.app) • [GitHub](https://github.com/ideaflux/ideaflux) • [الدعم](mailto:support@ideaflux.com)

</div>