import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { pool } from "./db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------------------------------------
// JWT AUTH MIDDLEWARE
// ---------------------------------------------
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ---------------------------------------------
// AI HELPER: CALORIE CALCULATION
// ---------------------------------------------
async function calculateCaloriesAI(food_name, quantity) {
  try {
    const prompt = `
Estimate calories for this pet meal:
Food: ${food_name}
Quantity: ${quantity} grams
Return ONLY a number. No text.
    `.trim();

    const result = await model.generateContent(prompt);

    // Log raw Gemini response
    console.log("Raw Gemini response:", result.response.text());

    const raw = result.response.text().trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g, ""));

    // Fallback if Gemini returns invalid
    const fallbackCalories = Number(quantity) * 0.5;
    return isNaN(num) ? fallbackCalories : num;
  } catch (err) {
    console.error("Gemini calorie calc error:", err);
    return Number(quantity) * 0.5;
  }
}

// ---------------------------------------------
// ROUTE: USER SIGNUP
// ---------------------------------------------
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING user_id";
    const result = await pool.query(query, [name, email, hashed]);
    return res.json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// ROUTE: USER LOGIN
// ---------------------------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const query = "SELECT * FROM users WHERE email=$1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ message: "Login success", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// ROUTE: ADD PET
// ---------------------------------------------
app.post("/pets", authenticate, async (req, res) => {
  const { name, species, breed, gender, dob, weight, med_note } = req.body;
  if (!name) return res.status(400).json({ message: "Missing pet name" });

  try {
    const query = `
      INSERT INTO pets(user_id, name, species, breed, gender, dob, weight, med_note)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `;
    const result = await pool.query(query, [
      req.user.user_id,
      name,
      species,
      breed,
      gender,
      dob,
      weight,
      med_note,
    ]);

    return res.json({ message: "Pet added", pet: result.rows[0] });
  } catch (err) {
    console.error("Pet add error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// ROUTE: ADD NUTRITION ENTRY
// ---------------------------------------------
app.post("/nutrition", authenticate, async (req, res) => {
  const { p_id, food_name, quantity, date } = req.body;
  if (!p_id || !food_name || !quantity || !date)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const calories = await calculateCaloriesAI(food_name, quantity);

    const query = `
      INSERT INTO nutrition (p_id, food_name, quantity, date, calories)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `;
    const result = await pool.query(query, [
      p_id,
      food_name,
      quantity,
      date,
      calories,
    ]);

    return res.json({
      message: "Nutrition log added",
      log: result.rows[0],
    });
  } catch (err) {
    console.error("Nutrition error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------------
// ROUTE: GET DIET SUGGESTION
// ---------------------------------------------
app.post("/nutrition/suggest", authenticate, async (req, res) => {
  const { p_id, food_name, quantity } = req.body;
  if (!p_id || !food_name || !quantity)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const prompt = `
A pet with ID ${p_id} ate:
Food: ${food_name}
Quantity: ${quantity}g

Give a short, friendly diet suggestion for the next meal.
Keep it simple and actionable.
    `.trim();

    const result = await model.generateContent(prompt);
    const suggestion = result.response.text();

    res.json({ suggestion });
  } catch (err) {
    console.error("Gemini diet suggestion error:", err);
    res.status(500).json({ message: "No suggestion available" });
  }
});

// ---------------------------------------------
// START SERVER
// ---------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
