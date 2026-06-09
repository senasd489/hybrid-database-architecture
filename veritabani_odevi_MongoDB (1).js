
use("DijitalEgitimDB");
db.createCollection("SurveyResponses");

db.SurveyResponses.insertOne({
    UserID: 1,
    SurveyID: 1,
    GonderimTarihi: new Date(),
    TamamlanmaSuresiSn: 145,
    Cevaplar: [
        {
            QuestionID: 1,
            SoruTipi: "CoktanSecmeli",
            Cevap: {
                SecenekID: 2,
                SecenekMetni: "İyi"
            }
        },
        {
            QuestionID: 2,
            SoruTipi: "Metin",
            Cevap: {
                Metin: "Özellikle MongoDB konusu çok faydalıydı."
            }
        },
        {
            QuestionID: 3,
            SoruTipi: "Derecelendirme",
            Cevap: {
                Puan: 4
            }
        }
    ]
});

db.SurveyResponses.insertOne({
    UserID: 3,
    SurveyID: 1,
    GonderimTarihi: new Date(),
    TamamlanmaSuresiSn: 87,
    Cevaplar: [
        {
            QuestionID: 1,
            SoruTipi: "CoktanSecmeli",
            Cevap: { SecenekID: 1, SecenekMetni: "Çok İyi" }
        },
        {
            QuestionID: 3,
            SoruTipi: "Derecelendirme",
            Cevap: { Puan: 5 }
        }
    ]
});
db.createCollection("VideoLogs");

db.VideoLogs.insertMany([
    {
        UserID: 1,
        CourseID: 1,
        VideoBaslik: "Python ile Veri Bilimi - Ders 3",
        OturumID: "sess-001",
        Etkinlik: "oynat",
        VideoSaniye: 0,
        ZamanDamgasi: new Date("2025-01-15T10:00:00Z"),
        Cihaz: "web"
    },
    {
        UserID: 1,
        CourseID: 1,
        VideoBaslik: "Python ile Veri Bilimi - Ders 3",
        OturumID: "sess-001",
        Etkinlik: "duraklat",
        VideoSaniye: 183,
        ZamanDamgasi: new Date("2025-01-15T10:03:03Z"),
        Cihaz: "web"
    },
    {
        UserID: 1,
        CourseID: 1,
        VideoBaslik: "Python ile Veri Bilimi - Ders 3",
        OturumID: "sess-001",
        Etkinlik: "ileri_sar",
        VideoSaniye: 183,
        VideoSaniyeHedef: 240,
        ZamanDamgasi: new Date("2025-01-15T10:03:10Z"),
        Cihaz: "web"
    },
    {
        UserID: 1,
        CourseID: 1,
        VideoBaslik: "Python ile Veri Bilimi - Ders 3",
        OturumID: "sess-001",
        Etkinlik: "tamamladi",
        VideoSaniye: 1800,
        ZamanDamgasi: new Date("2025-01-15T10:30:00Z"),
        Cihaz: "web",
        ToplamIzlemeSuresiSn: 1750
    }
]);
db.SurveyResponses.createIndex({ SurveyID: 1 });
db.SurveyResponses.createIndex({ UserID: 1 });
db.SurveyResponses.createIndex({ GonderimTarihi: -1 });

db.VideoLogs.createIndex({ UserID: 1, CourseID: 1 });
db.VideoLogs.createIndex({ OturumID: 1 });
db.VideoLogs.createIndex({ ZamanDamgasi: -1 });
print("--- Survey 1 Yanıtları ---");
db.SurveyResponses.find({ SurveyID: 1 }).forEach(printjson);

print("--- Kullanıcı 1 Video Logları ---");
db.VideoLogs.find({ UserID: 1 }).sort({ ZamanDamgasi: 1 }).forEach(printjson);

print("Toplam SurveyResponse sayısı: " + db.SurveyResponses.countDocuments());
print("Toplam VideoLog sayısı: " + db.VideoLogs.countDocuments());
