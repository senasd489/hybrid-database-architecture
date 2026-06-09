
const express = require("express");
const sql     = require("mssql");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const mssqlConfig = {
  user:     "sa",
  password: "sifreniz",
  server:   "localhost",
  database: "veritaniOdevii",
  options:  { trustServerCertificate: true }
};

mongoose.connect("mongodb://localhost:27017/veritaniOdevii");
const SurveyResponseSchema = new mongoose.Schema({
  UserID:               Number,
  SurveyID:             Number,
  GonderimTarihi:       { type: Date, default: Date.now },
  TamamlanmaSuresiSn:   Number,
  Cevaplar:             Array
});

const SurveyResponse = mongoose.model("SurveyResponse", SurveyResponseSchema);
app.get("/api/survey/:id", async (req, res) => {
  try {
    const pool = await sql.connect(mssqlConfig);
    const result = await pool.request()
      .input("SurveyID", sql.Int, req.params.id)
      .query(`
        SELECT q.QuestionID, q.SoruMetni, q.SoruTipi,
               o.OptionID, o.SecenekMetni, o.SiraNo
        FROM SurveyQuestions q
        LEFT JOIN SurveyOptions o ON o.QuestionID = q.QuestionID
        WHERE q.SurveyID = @SurveyID
        ORDER BY q.QuestionID, o.SiraNo
      `);

    const sorular = {};
    result.recordset.forEach(row => {
      if (!sorular[row.QuestionID]) {
        sorular[row.QuestionID] = {
          QuestionID: row.QuestionID,
          SoruMetni:  row.SoruMetni,
          SoruTipi:   row.SoruTipi,
          Secenekler: []
        };
      }
      if (row.OptionID) {
        sorular[row.QuestionID].Secenekler.push({
          OptionID:    row.OptionID,
          SecenekMetni: row.SecenekMetni
        });
      }
    });

    res.json({ SurveyID: req.params.id, Sorular: Object.values(sorular) });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});
app.post("/api/survey/:id/yanit", async (req, res) => {
  try {
    const yenit = await SurveyResponse.create({
      UserID:             req.body.UserID,
      SurveyID:           parseInt(req.params.id),
      TamamlanmaSuresiSn: req.body.TamamlanmaSuresiSn,
      Cevaplar:           req.body.Cevaplar
    });
    res.json({ mesaj: "Yanit kaydedildi", id: yenit._id });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});
app.get("/api/survey/:id/yanitlar", async (req, res) => {
  try {
    const yanitlar = await SurveyResponse
      .find({ SurveyID: parseInt(req.params.id) })
      .sort({ GonderimTarihi: -1 });
    res.json({ toplam: yanitlar.length, yanitlar });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const pool = await sql.connect(mssqlConfig);
    const result = await pool.request().query(`
      SELECT u.UserID, u.Ad, u.Soyad, u.Email, r.RoleAdi
      FROM Users u
      JOIN Roles r ON u.RoleID = r.RoleID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});
app.post("/api/enroll", async (req, res) => {
  try {
    const pool = await sql.connect(mssqlConfig);
    await pool.request()
      .input("UserID",   sql.Int, req.body.UserID)
      .input("CourseID", sql.Int, req.body.CourseID)
      .query(`
        INSERT INTO Enrollments (UserID, CourseID)
        VALUES (@UserID, @CourseID)
      `);
    res.json({ mesaj: "Kursa basariyla kayit olundu" });
  } catch (err) {
    res.status(500).json({ hata: err.message });
  }
});
app.listen(3000, () => {
  console.log("API calisiyor: http://localhost:3000");
  console.log("Endpointler:");
  console.log("  GET  /api/survey/:id          -> Anket sorularini getir (MSSQL)");
  console.log("  POST /api/survey/:id/yanit    -> Yanit kaydet (MongoDB)");
  console.log("  GET  /api/survey/:id/yanitlar -> Tum yanitlari getir (MongoDB)");
  console.log("  GET  /api/users               -> Kullanicilari getir (MSSQL)");
  console.log("  POST /api/enroll              -> Kursa kayit ol (MSSQL)");
});
