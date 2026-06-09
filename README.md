# Dijital Eğitim Platformu — Veritabanı Tasarımı

Veritabanı Sistemleri II dersi için hazırladığım proje. MSSQL ve MongoDB'yi birlikte kullanarak bir eğitim platformunun veri tabanı altyapısını tasarladım.

---

## Ne Yaptım?

Platformda iki farklı veri tabanı kullandım:

- **MSSQL** → Kullanıcılar, kurslar, anket şablonları, ödemeler, sertifikalar gibi ilişkisel veriler burada tutuluyor.
- **MongoDB** → Anket yanıtları ve video izlenme logları burada tutuluyor. Her öğrencinin cevabı farklı yapıda olabileceği için MongoDB daha uygun.

İkisi arasındaki köprüyü küçük bir Node.js API'si sağlıyor.

---

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `veritabani_odevi_MSSQL.sql` | Tüm MSSQL tabloları ve örnek veriler |
| `veritabani_odevi_MongoDB.js` | MongoDB koleksiyonları ve indeksler |
| `veritabani_odevi_API.js` | MSSQL + MongoDB'yi birleştiren API |
| `veritabani_odevi_Rapor.pdf` | Tasarım kararları ve performans analizi |

---

## MSSQL Tabloları

Roles, Categories, Users, Courses, Enrollments, Surveys, SurveyQuestions, SurveyOptions, Finances, Certificates

Tablolar 3NF'e uygun tasarlandı. Rol ve kategori bilgileri ayrı tablolara alındı.

---

## MongoDB Koleksiyonları

**SurveyResponses** — Her öğrencinin anket cevapları tek dokümanda saklanıyor. Soru sayısı ve tipi kişiden kişiye değişebildiği için esnek yapı gerekiyordu.

**VideoLogs** — Video izlenirken oluşan etkinlikler (oynat, duraklat, ileri sar...) burada tutuluyor.

---

## Performans Testi

50.000 kayıt üzerinde indeks öncesi ve sonrasını karşılaştırdım:

- İndekssiz: 50 ms, 50.002 belge tarandı (COLLSCAN)
- İndeksli: 19 ms, 5.051 belge tarandı (FETCH)

---

## Kurulum

MSSQL için SSMS'de `veritabani_odevi_MSSQL.sql` dosyasını çalıştır.

MongoDB için mongosh terminalinde `veritabani_odevi_MongoDB.js` dosyasını çalıştır.

API için:
```bash
npm install express mssql mongoose
node veritabani_odevi_API.js
```

---


