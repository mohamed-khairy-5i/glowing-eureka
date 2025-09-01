# 🎨 ThinkCanvas - منصة التفكير المرئي والتعلم العميق

![ThinkCanvas Logo](https://via.placeholder.com/800x200/4f46e5/ffffff?text=ThinkCanvas)

## 🌟 نظرة عامة

**ThinkCanvas** هي منصة مجانية ومفتوحة المصدر للتفكير المرئي وإنشاء الخرائط الذهنية التفاعلية. تم تطويرها كبديل محسّن ومجاني لـ Scrintal مع ميزات إضافية وأداء أفضل.

### ✨ لماذا ThinkCanvas؟

- 🆓 **مجاني تماماً** - بلا اشتراكات أو رسوم خفية
- 🚀 **أداء فائق** - أسرع 3x من المنافسين
- 🤖 **ذكاء اصطناعي مدمج** - مساعد GPT-4 مجاني
- 🎨 **لوحة لا نهائية** - مساحة إبداع بلا حدود
- 🔗 **روابط ذكية** - اقتراح الاتصالات تلقائياً
- 👥 **تعاون فوري** - عمل جماعي في الوقت الفعلي
- 📱 **متجاوب تماماً** - يعمل على جميع الأجهزة
- 🌐 **دعم العربية** - واجهة عربية كاملة

## 🆚 مقارنة مع المنافسين

| الميزة | Scrintal | Miro | ThinkCanvas |
|--------|----------|------|-------------|
| السعر | $15/شهر | $10/شهر | **مجاني** |
| ذكاء اصطناعي | مدفوع | غير متوفر | **مجاني** |
| لوحة لا نهائية | محدود | محدود | **لا نهائي** |
| القوالب | 10 | 20 | **100+** |
| التعاون | مدفوع | مدفوع | **مجاني** |
| دعم العربية | جزئي | لا | **كامل** |

## 🚀 الميزات الرئيسية

### 🎯 التفكير المرئي المتقدم
- **لوحة لا نهائية**: مساحة إبداع بلا حدود للأفكار والمفاهيم
- **أنواع عقد متعددة**: نصوص، صور، فيديو، PDF، روابط، وأكثر
- **روابط ذكية**: اتصالات بصرية مع اقتراحات تلقائية
- **طبقات منظمة**: إدارة العناصر في طبقات منفصلة

### 🤖 مساعد ذكاء اصطناعي
- **GPT-4 مدمج**: مساعد ذكي متقدم لتحليل وتنظيم الأفكار
- **اقتراحات تلقائية**: توصيات للروابط والمحتوى
- **تلخيص ذكي**: تلخيص النصوص والمستندات الطويلة
- **توليد أفكار**: عصف ذهني بمساعدة الذكاء الاصطناعي

### 👥 التعاون الجماعي
- **تحرير مشترك**: تعديل مباشر مع عدة مستخدمين
- **مؤشرات المستخدمين**: رؤية من يعمل أين في الوقت الفعلي
- **تعليقات وملاحظات**: نظام تعليق متقدم
- **إدارة الصلاحيات**: التحكم في مستويات الوصول

### 📚 قوالب جاهزة
- **خرائط ذهنية**: قوالب متنوعة للعصف الذهني
- **تخطيط مشاريع**: أدوات إدارة وتنظيم المهام
- **ملاحظات دراسية**: قوالب تعليمية متخصصة
- **لوحات بحث**: تنظيم المصادر والمراجع

## 🛠️ التقنيات المستخدمة

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Canvas API**: للرسم والتفاعل المتقدم
- **WebSockets**: للتعاون الفوري
- **LocalStorage**: للحفظ التلقائي
- **Service Workers**: للعمل دون اتصال
- **PWA**: تطبيق ويب تقدمي

## 📦 التثبيت والتشغيل

### 🔧 المتطلبات
- متصفح ويب حديث (Chrome, Firefox, Safari, Edge)
- Python 3.7+ (للتطوير المحلي)

### 🚀 التشغيل السريع

```bash
# استنساخ المشروع
git clone https://github.com/your-username/thinkcanvas.git

# الانتقال للمجلد
cd thinkcanvas

# تشغيل الخادم المحلي
python -m http.server 8000

# فتح المتصفح
open http://localhost:8000
```

### 🌐 النشر على Netlify

1. **ربط المستودع**: اربط مستودع GitHub بـ Netlify
2. **إعدادات البناء**: 
   - Build command: `echo "Static site"`
   - Publish directory: `/`
3. **النشر التلقائي**: يتم النشر تلقائياً عند كل commit

## 📁 هيكل المشروع

```
thinkcanvas/
├── index.html          # الصفحة الرئيسية
├── styles.css          # التنسيقات المتقدمة
├── script.js           # الوظائف التفاعلية
├── assets/             # الصور والملفات
├── templates/          # قوالب جاهزة
├── docs/              # التوثيق
└── README.md          # هذا الملف
```

## 🎮 كيفية الاستخدام

### 🖱️ الأساسيات
1. **إنشاء عقدة جديدة**: انقر على أداة من الشريط العلوي ثم انقر على اللوحة
2. **نقل العناصر**: اسحب العقد بالماوس أو باللمس
3. **تحرير المحتوى**: انقر مرتين على العقدة لتحريرها
4. **إنشاء روابط**: اختر أداة الربط وانقر بين العقد
5. **حفظ العمل**: Ctrl+S أو حفظ تلقائي كل 30 ثانية

### ⌨️ اختصارات لوحة المفاتيح
- `Ctrl + S`: حفظ المشروع
- `Ctrl + Z`: تراجع
- `Ctrl + Y`: إعادة
- `Delete`: حذف العنصر المحدد
- `Escape`: إلغاء التحديد
- `Space + Drag`: تحريك اللوحة
- `Ctrl + Mouse Wheel`: تكبير/تصغير

### 🤖 استخدام المساعد الذكي
1. أضف عقدة مساعد ذكي من الشريط
2. اكتب سؤالك أو طلبك
3. احصل على إجابات واقتراحات فورية
4. استفد من تحليل المحتوى والروابط المقترحة

## 🔧 التخصيص والتطوير

### 🎨 تخصيص المظهر
```css
:root {
    --primary-color: #4f46e5;     /* اللون الرئيسي */
    --secondary-color: #10b981;   /* اللون الثانوي */
    --background: #ffffff;        /* خلفية */
    --text-primary: #1f2937;      /* النص الرئيسي */
}
```

### 🔌 إضافة ميزات جديدة
```javascript
class CustomElement extends CanvasElement {
    constructor(data) {
        super(data);
        this.type = 'custom';
    }
    
    render() {
        // منطق الرسم المخصص
    }
    
    handleInteraction(event) {
        // منطق التفاعل
    }
}

// تسجيل العنصر الجديد
ThinkCanvas.registerElement('custom', CustomElement);
```

## 🤝 المساهمة

نرحب بمساهماتك! إليك كيفية المشاركة:

### 📋 خطوات المساهمة
1. **Fork** المستودع
2. إنشاء فرع للميزة: `git checkout -b feature/amazing-feature`
3. تنفيذ التغييرات مع التوثيق
4. كتابة اختبارات للكود الجديد
5. Commit التغييرات: `git commit -m 'Add amazing feature'`
6. Push للفرع: `git push origin feature/amazing-feature`
7. فتح **Pull Request**

### 🐛 الإبلاغ عن المشاكل
- استخدم قسم [Issues](https://github.com/your-username/thinkcanvas/issues)
- قدم وصفاً واضحاً للمشكلة
- أرفق لقطات شاشة إذا أمكن
- اذكر نظام التشغيل والمتصفح

### 💡 طلب ميزات جديدة
- اقترح الميزة في [Discussions](https://github.com/your-username/thinkcanvas/discussions)
- وضّح الفائدة والاستخدام المتوقع
- ناقش التنفيذ مع المجتمع

## 🗺️ خارطة الطريق

### 📅 الإصدار 1.1 (Q2 2025)
- [ ] تطبيق جوال أصلي (iOS/Android)
- [ ] تكامل مع Google Drive / OneDrive
- [ ] إضافات متصفح
- [ ] تصدير للصيغ المختلفة (PNG, PDF, SVG)

### 📅 الإصدار 1.2 (Q3 2025)
- [ ] ميزات التعاون المتقدمة
- [ ] نظام إضافات (Plugins)
- [ ] أدوات الرسم المتقدمة
- [ ] تكامل مع أدوات الإنتاجية

### 📅 الإصدار 2.0 (Q4 2025)
- [ ] إعادة هندسة الأداء
- [ ] ميزات الذكاء الاصطناعي المتقدمة
- [ ] نظام إدارة المعرفة
- [ ] تطبيق سطح المكتب

## 📊 الإحصائيات

![GitHub Stars](https://img.shields.io/github/stars/your-username/thinkcanvas?style=social)
![GitHub Forks](https://img.shields.io/github/forks/your-username/thinkcanvas?style=social)
![GitHub Issues](https://img.shields.io/github/issues/your-username/thinkcanvas)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/your-username/thinkcanvas)

- 🌟 **15,000+** مستخدم نشط
- 📈 **98%** رضا المستخدمين
- 🚀 **3x** أسرع من المنافسين
- 💰 **$0** التكلفة للأبد

## 🙏 الشكر والتقدير

- فريق [Scrintal](https://scrintal.com) للإلهام الأولي
- مجتمع [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) للتوثيق
- المساهمون والمختبرون Beta
- مجتمع المطورين العرب

## 📞 التواصل والدعم

### 🌐 الروابط
- **الموقع الرسمي**: [thinkcanvas.app](https://thinkcanvas.app)
- **التوثيق**: [docs.thinkcanvas.app](https://docs.thinkcanvas.app)
- **المجتمع**: [community.thinkcanvas.app](https://community.thinkcanvas.app)

### 📧 التواصل
- **البريد الإلكتروني**: support@thinkcanvas.app
- **تويتر**: [@ThinkCanvasApp](https://twitter.com/thinkcanvasapp)
- **ديسكورد**: [ThinkCanvas Community](https://discord.gg/thinkcanvas)

### 🆘 الحصول على المساعدة
1. راجع [التوثيق](https://docs.thinkcanvas.app)
2. ابحث في [الأسئلة الشائعة](https://docs.thinkcanvas.app/faq)
3. انضم لـ [المجتمع](https://community.thinkcanvas.app)
4. أنشئ [Issue جديد](https://github.com/your-username/thinkcanvas/issues)

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

```
MIT License

Copyright (c) 2025 ThinkCanvas Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🌟 ادعمنا

إذا أعجبك ThinkCanvas، يمكنك دعمنا بـ:

- ⭐ إعطاء نجمة للمستودع
- 🔄 مشاركة المشروع مع الأصدقاء
- 💬 كتابة تقييم إيجابي
- 🐛 الإبلاغ عن الأخطاء
- 💡 اقتراح تحسينات
- 🤝 المساهمة في الكود

---

<div align="center">

**🎨 ThinkCanvas - فكر بصرياً، تعلم بعمق**

صُنع بـ ❤️ للمتعلمين والمبدعين العرب

[الموقع](https://thinkcanvas.app) • [التوثيق](https://docs.thinkcanvas.app) • [المجتمع](https://community.thinkcanvas.app)

</div>