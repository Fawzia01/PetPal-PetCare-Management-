import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { pool } from "./db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------
// GEMINI CLIENT
// ---------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ---------------------------------------------
// MULTER SETUP
// ---------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ---------------------------------------------
// JWT AUTH MIDDLEWARE
// ---------------------------------------------
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ---------------------------------------------
// AI HELPER
// ---------------------------------------------
async function calculateCaloriesAI(food_name, quantity) {
  try {
    const prompt = `
Estimate calories for this pet meal:
Food: ${food_name}
Quantity: ${quantity} grams
Return ONLY a number.
    `.trim();

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const calories = parseFloat(raw.replace(/[^0-9.]/g, ""));
    return isNaN(calories) ? quantity * 0.5 : calories;
  } catch {
    return quantity * 0.5;
  }
}

// ---------------------------------------------
// AUTH ROUTES
// ---------------------------------------------
app.post("/signup", upload.single("profile_pic"), async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name,email,password,phone,address,profile_pic)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING user_id,name,email`,
      [name, email, hashed, phone, address, profilePic]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ message: "Email exists" });
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  if (!result.rows.length)
    return res.status(404).json({ message: "User not found" });

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { user_id: user.user_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ 
    token,
    user_id: user.user_id,
    name: user.name,
    email: user.email
  });
});

// ---------------------------------------------
// PET ROUTES
// ---------------------------------------------
app.post("/pets", authenticate, async (req, res) => {
  const { name, species, breed, gender, dob, weight, med_note } = req.body;

  const result = await pool.query(
    `INSERT INTO pets(user_id,name,species,breed,gender,dob,weight,med_note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      req.user.user_id,
      name,
      species,
      breed,
      gender,
      dob,
      weight,
      med_note,
    ]
  );

  res.json(result.rows[0]);
});

// ---------------------------------------------
// GET ALL PETS FOR A USER
// ---------------------------------------------
app.get("/pets/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  // Ensure the user is requesting their own pets
  if (Number(userId) !== req.user.user_id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const result = await pool.query(
      `SELECT * FROM pets WHERE user_id = $1 ORDER BY name`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pets" });
  }
});

// ---------------------------------------------
// GET SINGLE PET BY PET ID
// ---------------------------------------------
app.get("/pets/:petId", authenticate, async (req, res) => {
  const { petId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM pets WHERE p_id = $1 AND user_id = $2`,
      [petId, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Pet not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pet" });
  }
});

// ---------------------------------------------
// UPDATE PET INFO
// ---------------------------------------------
app.put("/pets/:petId", authenticate, upload.single("profile_pic"), async (req, res) => {
  const { petId } = req.params;
  const { name, species, breed, gender, dob, weight, med_note } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      `
      UPDATE pets
      SET name = $1,
          species = $2,
          breed = $3,
          gender = $4,
          dob = $5,
          weight = $6,
          med_note = $7,
          profile_pic = COALESCE($8, profile_pic)
      WHERE p_id = $9 AND user_id = $10
      RETURNING *
      `,
      [name, species, breed, gender, dob, weight, med_note, profilePic, petId, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Pet update failed" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update pet" });
  }
});

// ---------------------------------------------
// ADD NUTRITION
// ---------------------------------------------
app.post(
  "/nutrition",
  authenticate,
  upload.single("food_pic"),
  async (req, res) => {
    const { p_id, food_name, quantity, date } = req.body;

    const calories = await calculateCaloriesAI(food_name, quantity);
    const foodPic = req.file ? req.file.path : "upload/default-food.png";

    const result = await pool.query(
      `INSERT INTO nutrition
       (p_id,food_name,quantity,date,calories,food_pic)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [p_id, food_name, quantity, date, calories, foodPic]
    );

    res.json(result.rows[0]);
  }
);

// ---------------------------------------------
// GET ALL NUTRITION BY USER ID
// ---------------------------------------------
app.get("/nutrition/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  if (Number(userId) !== req.user.user_id)
    return res.status(403).json({ message: "Forbidden" });

  const result = await pool.query(
    `
    SELECT n.*, p.name AS pet_name
    FROM nutrition n
    JOIN pets p ON n.p_id = p.p_id
    WHERE p.user_id = $1
    ORDER BY date DESC
    `,
    [userId]
  );

  res.json(result.rows);
});

// ---------------------------------------------
// GET SINGLE NUTRITION BY ID
// ---------------------------------------------
app.get("/nutrition/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `
    SELECT n.*
    FROM nutrition n
    JOIN pets p ON n.p_id = p.p_id
    WHERE n.n_id = $1 AND p.user_id = $2
    `,
    [id, req.user.user_id]
  );

  if (!result.rows.length)
    return res.status(404).json({ message: "Not found" });

  res.json(result.rows[0]);
});

// ---------------------------------------------
// UPDATE NUTRITION
// ---------------------------------------------
app.put(
  "/nutrition/:id",
  authenticate,
  upload.single("food_pic"),
  async (req, res) => {
    const { id } = req.params;
    const { food_name, quantity, date } = req.body;

    const calories = await calculateCaloriesAI(food_name, quantity);
    const foodPic = req.file ? req.file.path : null;

    const result = await pool.query(
      `
      UPDATE nutrition n
      SET food_name=$1,
          quantity=$2,
          date=$3,
          calories=$4,
          food_pic=COALESCE($5, food_pic)
      FROM pets p
      WHERE n.p_id = p.p_id
        AND n.n_id = $6
        AND p.user_id = $7
      RETURNING n.*
      `,
      [
        food_name,
        quantity,
        date,
        calories,
        foodPic,
        id,
        req.user.user_id,
      ]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Update failed" });

    res.json(result.rows[0]);
  }
);

// ---------------------------------------------
// DELETE NUTRITION
// ---------------------------------------------
app.delete("/nutrition/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `
    DELETE FROM nutrition n
    USING pets p
    WHERE n.p_id = p.p_id
      AND n.n_id = $1
      AND p.user_id = $2
    RETURNING n.*
    `,
    [id, req.user.user_id]
  );

  if (!result.rows.length)
    return res.status(404).json({ message: "Delete failed" });

  res.json({ message: "Nutrition deleted" });
});

// ---------------------------------------------
// DIET SUGGESTION
// ---------------------------------------------
app.post("/nutrition/suggest", authenticate, async (req, res) => {
  const { food_name, quantity } = req.body;

  const prompt = `
Pet ate ${quantity}g of ${food_name}.
Give a short friendly suggestion for next meal.
  `.trim();

  const result = await model.generateContent(prompt);
  res.json({ suggestion: result.response.text() });
});

// ---------------------------------------------
// GROQ API SETTINGS
// ---------------------------------------------
app.post("/api-settings", authenticate, async (req, res) => {
  try {
    const { user_id, groq_api_key, groq_model } = req.body;

    const result = await pool.query(
      `INSERT INTO user_api_settings (user_id, groq_api_key, groq_model, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET 
         groq_api_key = EXCLUDED.groq_api_key,
         groq_model = EXCLUDED.groq_model,
         updated_at = NOW()
       RETURNING *`,
      [user_id, groq_api_key, groq_model]
    );

    res.json({ message: "Settings saved", data: result.rows[0] });
  } catch (error) {
    console.error("Save settings error:", error);
    res.status(500).json({ message: "Failed to save settings" });
  }
});

app.get("/api-settings/:user_id", authenticate, async (req, res) => {
  try {
    const { user_id } = req.params;

    const result = await pool.query(
      `SELECT groq_api_key, groq_model FROM user_api_settings WHERE user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Load settings error:", error);
    res.status(500).json({ message: "Failed to load settings" });
  }
});

// ---------------------------------------------
// TEST GROQ API
// ---------------------------------------------
app.post("/test-groq-api", async (req, res) => {
  try {
    const { apiKey, model, prompt } = req.body;

    if (!apiKey || !model || !prompt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const groq = new Groq({ apiKey });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 1024
    });

    res.json({
      success: true,
      response: chatCompletion.choices[0]?.message?.content || "No response",
      model: model
    });
  } catch (error) {
    console.error("Groq API test error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "API test failed" 
    });
  }
});

// ---------------------------------------------
// AI HEALTH ADVISOR (GROQ)
// ---------------------------------------------
app.post("/ai-advisor", authenticate, async (req, res) => {
  try {
    const { message, pet_info } = req.body;

    // Get user's Groq settings
    const settings = await pool.query(
      `SELECT groq_api_key, groq_model FROM user_api_settings WHERE user_id = $1`,
      [req.user.user_id]
    );

    if (settings.rows.length === 0 || !settings.rows[0].groq_api_key) {
      return res.status(400).json({ 
        message: "Please configure your Groq API key in settings first" 
      });
    }

    const { groq_api_key, groq_model } = settings.rows[0];
    const groq = new Groq({ apiKey: groq_api_key });

    const systemPrompt = `You are an expert pet health advisor. Provide helpful, accurate, and caring advice about pet health, nutrition, behavior, and general care. 
${pet_info ? `Current pet: ${pet_info.name}, ${pet_info.species}, ${pet_info.breed}, ${pet_info.age} years old.` : ''}

Always be:
- Compassionate and understanding
- Clear and concise in your explanations
- Safety-conscious (remind when to see a vet)
- Evidence-based in your recommendations

Format your responses with:
- Clear headings
- Bullet points for lists
- Important warnings with ⚠️ or 🚨 emojis
- Positive tips with ✅ or 💡 emojis`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      model: groq_model || "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048
    });

    const response = chatCompletion.choices[0]?.message?.content;

    res.json({ 
      response,
      model: groq_model
    });
  } catch (error) {
    console.error("AI Advisor error:", error);
    res.status(500).json({ 
      message: "AI service temporarily unavailable. Please try again." 
    });
  }
});

// ---------------------------------------------
// SERVER
// ---------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
