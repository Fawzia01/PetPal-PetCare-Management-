import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { pool } from "./db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
// Serve uploaded files
app.use('/upload', express.static(path.join(__dirname, '../upload')));

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
  } catch (err) {
    console.error("AI Error:", err);
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

  res.json({ token });
});


// POST - Add new pet with photo
app.post("/pets", authenticate, upload.single("profile_pic"), async (req, res) => {
  const { name, species, breed, gender, dob, weight, med_note } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      `INSERT INTO pets(user_id,name,species,breed,gender,dob,weight,med_note,profile_pic)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        req.user.user_id,
        name,
        species,
        breed,
        gender,
        dob,
        weight,
        med_note,
        profilePic  // Add profile pic here
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add pet" });
  }
});

// GET - Fetch all pets for a user
app.get("/pets/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

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

// GET - Fetch single pet
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

// PUT - Update pet with optional new photo
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
// NUTRITION ROUTES
// ---------------------------------------------
app.post(
  "/nutrition",
  authenticate,
  upload.single("food_pic"),
  async (req, res) => {
    const { pet_name, food_name, quantity, date } = req.body;

    try {
      // Find pet for this user
      const petResult = await pool.query(
        `SELECT p_id FROM pets WHERE user_id = $1 AND name = $2`,
        [req.user.user_id, pet_name]
      );

      if (!petResult.rows.length) {
        return res.status(404).json({ message: "Pet not found" });
      }

      const p_id = petResult.rows[0].p_id;

      // AI calorie calculation
      const calories = await calculateCaloriesAI(food_name, quantity);
      const foodPic = req.file ? req.file.path : null;

      // Save nutrition
      const result = await pool.query(
        `
        INSERT INTO nutrition
        (p_id, food_name, quantity, date, calories, food_pic)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [p_id, food_name, quantity, date, calories, foodPic]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add nutrition" });
    }
  }
);

app.get("/nutrition/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  if (Number(userId) !== req.user.user_id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const result = await pool.query(
      `
      SELECT n.log_id, n.p_id, n.food_name, n.quantity, n.date, n.calories, n.food_pic, p.name AS pet_name
      FROM nutrition n
      JOIN pets p ON n.p_id = p.p_id
      WHERE p.user_id = $1
      ORDER BY n.date DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch nutrition" });
  }
});

app.get("/nutrition/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT n.*, p.name AS pet_name
      FROM nutrition n
      JOIN pets p ON n.p_id = p.p_id
      WHERE n.log_id = $1 AND p.user_id = $2
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch nutrition" });
  }
});

app.put(
  "/nutrition/:id",
  authenticate,
  upload.single("food_pic"),
  async (req, res) => {
    const { id } = req.params;
    const { food_name, quantity, date } = req.body;

    try {
      const calories = await calculateCaloriesAI(food_name, quantity);
      const foodPic = req.file ? req.file.path : null;

      // First verify the nutrition belongs to user's pet
      const checkResult = await pool.query(
        `
        SELECT n.log_id
        FROM nutrition n
        JOIN pets p ON n.p_id = p.p_id
        WHERE n.log_id = $1 AND p.user_id = $2
        `,
        [id, req.user.user_id]
      );

      if (!checkResult.rows.length)
        return res.status(404).json({ message: "Nutrition not found" });

      // Update nutrition
      const updateQuery = foodPic
        ? `UPDATE nutrition SET food_name=$1, quantity=$2, date=$3, calories=$4, food_pic=$5 WHERE log_id=$6 RETURNING *`
        : `UPDATE nutrition SET food_name=$1, quantity=$2, date=$3, calories=$4 WHERE log_id=$5 RETURNING *`;

      const params = foodPic
        ? [food_name, quantity, date, calories, foodPic, id]
        : [food_name, quantity, date, calories, id];

      const result = await pool.query(updateQuery, params);

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update nutrition" });
    }
  }
);

app.delete("/nutrition/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM nutrition n
      USING pets p
      WHERE n.p_id = p.p_id
        AND n.log_id = $1
        AND p.user_id = $2
      RETURNING n.*
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Delete failed" });

    res.json({ message: "Nutrition deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete nutrition" });
  }
});

// ---------------------------------------------
// DIET SUGGESTION
// ---------------------------------------------
app.post("/nutrition/suggest", authenticate, async (req, res) => {
  const { food_name, quantity } = req.body;

  try {
    const prompt = `
Pet ate ${quantity}g of ${food_name}.
Give a short friendly suggestion for next meal.
    `.trim();

    const result = await model.generateContent(prompt);
    res.json({ suggestion: result.response.text() });
  } catch (err) {
    console.error("Suggestion error:", err);
    res.status(500).json({ message: "Failed to get suggestion" });
  }
});

// ---------------------------------------------
// SERVER
// ---------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
