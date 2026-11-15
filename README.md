# قرار صورتی 💗💜 — دعوت‌نامه برای Cloudflare Pages

این مخزن شامل صفحهٔ دعوت فارسی، انتخاب نوع قرار و تاریخ/ساعت، ثبت اطلاعات در Cloudflare D1 و پنل مدیریت خصوصی است.

## ساختار پروژه

```text
/
├── public/
│   ├── index.html
│   └── admin.html
├── functions/
│   └── api/
│       ├── respond.js
│       └── admin-responses.js
├── schema.sql
├── README.md
└── .gitignore
```

> مهم: هنگام آپلود در GitHub، محتویات این پوشه باید مستقیماً در ریشهٔ مخزن قرار بگیرند؛ پوشهٔ اضافهٔ `date-invite/` نساز.

## انتشار از GitHub روی Cloudflare Pages

### 1. ساخت مخزن
1. در GitHub یک مخزن جدید بساز. بهتر است مخزن را `Private` انتخاب کنی.
2. همهٔ محتویات این پروژه را در ریشهٔ مخزن آپلود کن و `Commit changes` را بزن.

### 2. ساخت پروژهٔ Pages
1. وارد Cloudflare Dashboard شو و بخش **Workers & Pages** را باز کن.
2. **Create application** و سپس **Pages** را انتخاب کن.
3. **Connect to Git** را انتخاب و مخزن GitHub را متصل کن.
4. تنظیمات ساخت را این‌طور وارد کن:
   - Framework preset: `None`
   - Build command: خالی بگذار
   - Build output directory: `public`
   - Root directory: خالی بگذار (ریشهٔ مخزن)
5. پروژه را Deploy کن.

Cloudflare Pages فایل‌های API داخل پوشهٔ ریشه‌ای `functions/` را به‌عنوان Pages Functions اجرا می‌کند. فایل‌های تابع نباید داخل `public/` باشند.

### 3. ساخت پایگاه داده D1
1. در Cloudflare بخش **D1 SQL Database** را باز و یک پایگاه داده بساز؛ مثلاً `invite-responses`.
2. در کنسول SQL پایگاه داده، محتوای فایل `schema.sql` را اجرا کن.
3. به پروژهٔ Pages برو: **Settings → Functions → D1 database bindings**.
4. یک binding اضافه کن:
   - Variable name: `DB`
   - D1 database: پایگاه داده‌ای که ساختی
5. تغییرات را ذخیره کن و دوباره Deploy کن.

### 4. تنظیم رمز پنل مدیریت
1. در تنظیمات پروژهٔ Pages، بخش **Variables and Secrets** را باز کن.
2. یک **Secret** با نام دقیق `ADMIN_KEY` بساز و یک رمز طولانی و غیرقابل‌حدس قرار بده.
3. رمز را داخل فایل‌ها یا مخزن GitHub ننویس.
4. پس از ذخیره، پروژه را دوباره Deploy کن.

### 5. نشانی‌ها و آزمایش
پس از Deploy، Cloudflare یک دامنه شبیه `https://نام-پروژه.pages.dev` می‌دهد:
- صفحهٔ دعوت: `/`
- پنل مدیریت: `/admin.html`

برای آزمایش، صفحهٔ دعوت را باز کن، یک قرار آزمایشی ثبت کن، سپس در `/admin.html` با `ADMIN_KEY` وارد شو و بررسی کن که رکورد در پنل دیده می‌شود. اگر آزمایش کردی، رکورد آزمایشی را از D1 پاک کن یا با آن اشتباه نگیر.

## نکات مهم
- بازکردن `public/index.html` به‌صورت فایل محلی، ثبت ابری را فعال نمی‌کند؛ باید سایت از Cloudflare اجرا شود.
- پنل مدیریت به Secret سمت سرور `ADMIN_KEY` و binding پایگاه داده `DB` نیاز دارد.
- شمارهٔ تماس اختیاری است؛ فقط در صورت واردکردن آن در پایگاه داده ذخیره می‌شود.
- پاسخ‌ها در D1 نگهداری می‌شوند تا مدیر آن‌ها را حذف کند.
- برای راهنمای رسمی، مستندات Cloudflare Pages Git integration، Pages Functions و D1 را ببین.
