USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'veritabani2Odev')
    DROP DATABASE veritabani2Odev;
GO

CREATE DATABASE veritabani2Odev;
GO

USE veritabani2Odev;
GO
CREATE TABLE Roles (
    RoleID  INT IDENTITY(1,1) PRIMARY KEY,
    RoleAdi NVARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE Categories (
    CategoryID  INT IDENTITY(1,1) PRIMARY KEY,
    CategoryAdi NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Users (
    UserID    INT IDENTITY(1,1) PRIMARY KEY,
    Ad        NVARCHAR(50)  NOT NULL,
    Soyad     NVARCHAR(50)  NOT NULL,
    Email     NVARCHAR(100) NOT NULL UNIQUE,
    SifreHash NVARCHAR(255) NOT NULL,
    RoleID    INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleID)
);

CREATE TABLE Courses (
    CourseID   INT IDENTITY(1,1) PRIMARY KEY,
    Baslik     NVARCHAR(200) NOT NULL,
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    EgitmenID  INT FOREIGN KEY REFERENCES Users(UserID)
);

CREATE TABLE Enrollments (
    EnrollmentID     INT IDENTITY(1,1) PRIMARY KEY,
    UserID           INT FOREIGN KEY REFERENCES Users(UserID),
    CourseID         INT FOREIGN KEY REFERENCES Courses(CourseID),
    KayitTarihi      DATETIME     DEFAULT GETDATE(),
    TamamlanmaTarihi DATETIME     NULL,
    IlerlemeYuzdesi  DECIMAL(5,2) DEFAULT 0
);

CREATE TABLE Surveys (
    SurveyID INT IDENTITY(1,1) PRIMARY KEY,
    CourseID INT FOREIGN KEY REFERENCES Courses(CourseID),
    Baslik   NVARCHAR(200) NOT NULL,
    Durum    NVARCHAR(20) CHECK (Durum IN ('Aktif','Pasif')) DEFAULT 'Aktif'
);

CREATE TABLE SurveyQuestions (
    QuestionID INT IDENTITY(1,1) PRIMARY KEY,
    SurveyID   INT FOREIGN KEY REFERENCES Surveys(SurveyID),
    SoruMetni  NVARCHAR(MAX) NOT NULL,
    SoruTipi   NVARCHAR(50) CHECK (SoruTipi IN (
                    'CoktanSecmeli','Metin','Derecelendirme',
                    'Test','Puanlama')) NOT NULL
);

CREATE TABLE SurveyOptions (
    OptionID     INT IDENTITY(1,1) PRIMARY KEY,
    QuestionID   INT NOT NULL FOREIGN KEY REFERENCES SurveyQuestions(QuestionID),
    SecenekMetni NVARCHAR(500) NOT NULL,
    SiraNo       INT DEFAULT 1
);

CREATE TABLE Finances (
    FinanceID   INT IDENTITY(1,1) PRIMARY KEY,
    UserID      INT FOREIGN KEY REFERENCES Users(UserID),
    CourseID    INT FOREIGN KEY REFERENCES Courses(CourseID),
    Tutar       DECIMAL(10,2) NOT NULL,
    OdemeTarihi DATETIME DEFAULT GETDATE()
);

CREATE TABLE Certificates (
    CertificateID   INT IDENTITY(1,1) PRIMARY KEY,
    UserID          INT FOREIGN KEY REFERENCES Users(UserID),
    CourseID        INT FOREIGN KEY REFERENCES Courses(CourseID),
    CertificateCode NVARCHAR(50) NOT NULL UNIQUE,
    VerilisTarihi   DATETIME DEFAULT GETDATE()
);

CREATE INDEX IX_Users_Email          ON Users(Email);
CREATE INDEX IX_Enrollments_UserID   ON Enrollments(UserID);
CREATE INDEX IX_Enrollments_CourseID ON Enrollments(CourseID);
CREATE INDEX IX_SurveyQuestions_SID  ON SurveyQuestions(SurveyID);
CREATE INDEX IX_SurveyOptions_QID    ON SurveyOptions(QuestionID);

INSERT INTO Roles (RoleAdi) 
VALUES ('Ogrenci'), ('Egitmen'), ('Admin');

INSERT INTO Categories (CategoryAdi) 
VALUES ('Yazilim'), ('Veri Bilimi'), ('Tasarim'), ('Isletme');

INSERT INTO Users (Ad, Soyad, Email, SifreHash, RoleID)
VALUES ('Sena',  'Sadık',  'sena@gmail.com',  '123',  1),
       ('Murat', 'Toptaş', 'murat@gmail.com', '1234', 2);

INSERT INTO Courses (Baslik, CategoryID, EgitmenID)
VALUES ('Veritabani2', 1, 2);

INSERT INTO Surveys (CourseID, Baslik, Durum)
VALUES (1, 'Kurs Değerlendirme Anketi', 'Aktif');

INSERT INTO SurveyQuestions (SurveyID, SoruMetni, SoruTipi)
VALUES (1, 'Kursu nasıl buldunuz?',    'CoktanSecmeli'),
       (1, 'Önerileriniz nelerdir?',   'Metin'),
       (1, 'Eğitmeni puanlayın (1-5)?','Puanlama');

INSERT INTO SurveyOptions (QuestionID, SecenekMetni, SiraNo)
VALUES (1, 'Çok İyi', 1),
       (1, 'İyi',     2),
       (1, 'Orta',    3),
       (1, 'Kötü',    4);

PRINT '✅ Tüm tablolar oluşturuldu';
PRINT '✅ Veriler eklendi';
GO

SELECT
    u.Ad, u.Soyad, r.RoleAdi,
    s.Baslik AS Anket,
    q.SoruMetni, q.SoruTipi
FROM Users u
JOIN Roles r ON u.RoleID = r.RoleID
JOIN Surveys s ON s.CourseID IN (
    SELECT CourseID FROM Courses WHERE EgitmenID = u.UserID
)
JOIN SurveyQuestions q ON q.SurveyID = s.SurveyID
WHERE r.RoleAdi = 'Egitmen';
