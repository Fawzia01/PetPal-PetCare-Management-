import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { pool } from "./db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create upload directory if it doesn't exist
const uploadDir = 'upload';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Upload directory created');
}

// Serve static files from upload directory
app.use('/upload', express.static('upload'));

// ---------------------------------------------
// GEMINI CLIENT
// ---------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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
  } catch (err) {
    console.error("Auth error:", err);
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
    console.error("AI calculation error:", err);
    return quantity * 0.5;
  }
}

// ---------------------------------------------
// HEALTH CHECK
// ---------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

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
    console.error("SIGNUP ERROR >>>", err);
    if (err.code === "23505")
      return res.status(409).json({ message: "Email exists" });
    res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
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

    res.json({ token, user: { user_id: user.user_id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("LOGIN ERROR >>>", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// Admin credentials
const ADMIN_EMAIL = "jannatul@gmail.com";
const ADMIN_PASSWORD = "admin123";

// Admin middleware to verify admin role
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Check if this is an admin
    if (!decoded.is_admin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}

// Admin Login Endpoint
app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Admin login attempt:", { email, password: password ? "***" : "empty" });

  try {
    // Direct admin login check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { user_id: 0, is_admin: true },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log("Admin login successful for:", email);
      return res.json({ 
        token, 
        user_id: 0,
        name: "Admin", 
        email: ADMIN_EMAIL,
        is_admin: true
      });
    } else {
      console.log("Admin login failed - invalid credentials");
      return res.status(400).json({ message: "Invalid admin credentials" });
    }
  } catch (err) {
    console.error("ADMIN LOGIN ERROR >>>", err);
    return res.status(500).json({ message: "Admin login failed" });
  }
});

// Admin Setup Endpoint (Create admin user in database)
app.post("/admin-setup", async (req, res) => {
  const { setupKey } = req.body;

  // Simple setup key for security
  if (setupKey !== process.env.ADMIN_SETUP_KEY) {
    return res.status(401).json({ message: "Invalid setup key" });
  }

  try {
    // Check if admin already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Admin user already exists" });
    }

    // Create admin user
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, is_admin)
       VALUES ($1, $2, $3, $4)
       RETURNING user_id, name, email`,
      ["Admin", ADMIN_EMAIL, hashed, true]
    );

    res.status(201).json({ 
      message: "Admin user created successfully", 
      user: result.rows[0] 
    });
  } catch (err) {
    console.error("ADMIN SETUP ERROR >>>", err);
    res.status(500).json({ message: "Admin setup failed" });
  }
});

// Admin Stats Endpoint (Protected)
app.get("/admin/stats", authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await pool.query("SELECT COUNT(*) as count FROM users");
    const totalPets = await pool.query("SELECT COUNT(*) as count FROM pets");
    const activeUsers = await pool.query(
      "SELECT COUNT(DISTINCT user_id) as count FROM activities WHERE date >= CURRENT_DATE - INTERVAL '7 days'"
    );

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalPets: parseInt(totalPets.rows[0].count),
      activeUsers: parseInt(activeUsers.rows[0].count)
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Get all users (Admin only)
app.get("/admin/users", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email, phone, address, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("FETCH USERS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get all pets (Admin only)
app.get("/admin/pets", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as owner_name, u.email as owner_email 
       FROM pets p 
       JOIN users u ON p.user_id = u.user_id 
       ORDER BY p.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("FETCH ADMIN PETS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch pets" });
  }
});

// Get user details (Admin only)
app.get("/admin/users/:userId", authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await pool.query(
      "SELECT user_id, name, email, phone, address, created_at FROM users WHERE user_id=$1",
      [userId]
    );
    const pets = await pool.query(
      "SELECT * FROM pets WHERE user_id=$1",
      [userId]
    );

    if (!user.rows.length)
      return res.status(404).json({ message: "User not found" });

    res.json({ ...user.rows[0], pets: pets.rows });
  } catch (err) {
    console.error("FETCH USER DETAILS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});

// Delete user (Admin only)
app.delete("/admin/users/:userId", authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id=$1 RETURNING user_id",
      [userId]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE USER ERROR >>>", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// ---------------------------------------------
// PET ROUTES
// ---------------------------------------------
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
        profilePic,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ADD PET ERROR >>>", err);
    res.status(500).json({ message: "Failed to add pet" });
  }
});

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
    console.error("FETCH PETS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch pets" });
  }
});

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
    console.error("FETCH PET ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch pet" });
  }
});

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
    console.error("UPDATE PET ERROR >>>", err);
    res.status(500).json({ message: "Failed to update pet" });
  }
});

// Admin endpoint to update any pet (admin only)
app.put("/admin/pets/:petId", authenticate, upload.single("profile_pic"), async (req, res) => {
  const { petId } = req.params;
  const { name, species, breed, gender, dob, weight, med_note, health_status } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {
    // Check if user is admin
    const adminResult = await pool.query(
      "SELECT * FROM admins WHERE admin_id = $1",
      [req.user.user_id]
    );

    if (!adminResult.rows.length) {
      return res.status(403).json({ message: "Unauthorized - Admin only" });
    }

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
          health_status = $8,
          profile_pic = COALESCE($9, profile_pic)
      WHERE p_id = $10
      RETURNING *
      `,
      [name, species, breed, gender, dob, weight, med_note, health_status, profilePic, petId]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Pet not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("ADMIN UPDATE PET ERROR >>>", err);
    res.status(500).json({ message: "Failed to update pet" });
  }
});

// ---------------------------------------------
// ACTIVITY ROUTES
// ---------------------------------------------

app.post("/activities", authenticate, upload.single("activity_pic"), async (req, res) => {
  const { p_id, type, duration, distance, date, time } = req.body;

  try {
    const petCheck = await pool.query(
      `SELECT * FROM pets WHERE p_id = $1 AND user_id = $2`,
      [p_id, req.user.user_id]
    );

    if (!petCheck.rows.length)
      return res.status(403).json({ message: "Pet not found or unauthorized" });

    const activityPic = req.file ? req.file.path : null;

    const result = await pool.query(
      `INSERT INTO activities (p_id, type, duration, distance, date, time, activity_pic)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [p_id, type, duration, distance || 0, date, time, activityPic]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ADD ACTIVITY ERROR >>>", err);
    res.status(500).json({ message: "Failed to add activity", error: err.message });
  }
});

app.get("/activities/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  if (Number(userId) !== req.user.user_id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const result = await pool.query(
      `
      SELECT a.*, p.name AS pet_name, p.species
      FROM activities a
      JOIN pets p ON a.p_id = p.p_id
      WHERE p.user_id = $1
      ORDER BY a.date DESC, a.time DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("FETCH ACTIVITIES ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
});

app.get("/activities/pet/:petId", authenticate, async (req, res) => {
  const { petId } = req.params;

  try {
    const petCheck = await pool.query(
      `SELECT * FROM pets WHERE p_id = $1 AND user_id = $2`,
      [petId, req.user.user_id]
    );

    if (!petCheck.rows.length)
      return res.status(403).json({ message: "Pet not found or unauthorized" });

    const result = await pool.query(
      `
      SELECT a.*, p.name AS pet_name
      FROM activities a
      JOIN pets p ON a.p_id = p.p_id
      WHERE a.p_id = $1
      ORDER BY a.date DESC, a.time DESC
      `,
      [petId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("FETCH PET ACTIVITIES ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
});

app.get("/activities/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT a.*, p.name AS pet_name
      FROM activities a
      JOIN pets p ON a.p_id = p.p_id
      WHERE a.a_id = $1 AND p.user_id = $2
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Activity not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("FETCH ACTIVITY ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
});

app.put("/activities/:id", authenticate, upload.single("activity_pic"), async (req, res) => {
  const { id } = req.params;
  const { type, duration, distance, date, time } = req.body;

  try {
    const activityPic = req.file ? req.file.path : null;

    const result = await pool.query(
      `
      UPDATE activities a
      SET type = $1,
          duration = $2,
          distance = $3,
          date = $4,
          time = $5,
          activity_pic = COALESCE($6, activity_pic)
      FROM pets p
      WHERE a.p_id = p.p_id
        AND a.a_id = $7
        AND p.user_id = $8
      RETURNING a.*
      `,
      [type, duration, distance || 0, date, time, activityPic, id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Update failed" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE ACTIVITY ERROR >>>", err);
    res.status(500).json({ message: "Failed to update activity" });
  }
});

app.delete("/activities/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM activities a
      USING pets p
      WHERE a.p_id = p.p_id
        AND a.a_id = $1
        AND p.user_id = $2
      RETURNING a.*
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Delete failed" });

    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error("DELETE ACTIVITY ERROR >>>", err);
    res.status(500).json({ message: "Failed to delete activity" });
  }
});

app.get("/activities/stats/weekly/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  if (Number(userId) !== req.user.user_id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const result = await pool.query(
      `
      SELECT 
        TO_CHAR(a.date, 'Dy') as day,
        SUM(a.duration) as duration
      FROM activities a
      JOIN pets p ON a.p_id = p.p_id
      WHERE p.user_id = $1
        AND a.date >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY a.date, TO_CHAR(a.date, 'Dy')
      ORDER BY a.date
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("FETCH WEEKLY STATS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch weekly stats" });
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
    const { p_id, food_name, quantity, date } = req.body;

    try {
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
    } catch (err) {
      console.error("ADD NUTRITION ERROR >>>", err);
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
      SELECT n.*, p.name AS pet_name
      FROM nutrition n
      JOIN pets p ON n.p_id = p.p_id
      WHERE p.user_id = $1
      ORDER BY date DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("FETCH NUTRITION ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch nutrition" });
  }
});

app.post("/nutrition/suggest", authenticate, async (req, res) => {
  const { food_name, quantity } = req.body;

  // Add validation
  if (!food_name || !quantity) {
    return res.status(400).json({ 
      message: "food_name and quantity are required",
      suggestion: "Please provide both food name and quantity for a personalized suggestion."
    });
  }

  try {
    console.log(`Generating suggestion for: ${food_name} (${quantity}g)`);
    
    const prompt = `You are a helpful pet nutrition advisor. A pet just ate ${quantity} grams of ${food_name}.

Please provide a brief, friendly suggestion (2-3 sentences) about:
1. Whether this is a healthy portion
2. What to consider for the next meal
3. Any nutritional tips

Keep it concise and friendly.`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      console.error('Invalid Gemini response:', result);
      throw new Error('Invalid response from AI');
    }
    
    const suggestionText = result.response.text();
    console.log('Gemini response received:', suggestionText);
    
    if (!suggestionText || suggestionText.trim().length === 0) {
      throw new Error('Empty response from AI');
    }
    
    res.json({ 
      suggestion: suggestionText.trim()
    });
    
  } catch (err) {
    console.error("AI SUGGESTION ERROR >>>", err);
    console.error("Error details:", err.message);
    console.error("Error stack:", err.stack);
    
    // Check if it's a Gemini API specific error
    if (err.message && err.message.includes('API key')) {
      return res.status(500).json({ 
        message: "AI service configuration error",
        suggestion: "Great choice! For the next meal, consider balancing with different nutrients and maintaining proper portion sizes for your pet's health."
      });
    }
    
    // Return a fallback suggestion instead of just an error
    res.status(200).json({ 
      suggestion: `Thanks for feeding your pet ${food_name}! For the next meal, consider:\n\n• Ensure proper hydration alongside meals\n• Balance different food types throughout the day\n• Monitor your pet's energy levels and adjust portions accordingly\n\nConsult your vet for personalized nutrition advice!`
    });
  }
});

app.get("/nutrition/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
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
  } catch (err) {
    console.error("FETCH NUTRITION ERROR >>>", err);
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
    } catch (err) {
      console.error("UPDATE NUTRITION ERROR >>>", err);
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
        AND n.n_id = $1
        AND p.user_id = $2
      RETURNING n.*
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Delete failed" });

    res.json({ message: "Nutrition deleted" });
  } catch (err) {
    console.error("DELETE NUTRITION ERROR >>>", err);
    res.status(500).json({ message: "Failed to delete nutrition" });
  }
});

// ---------------------------------------------
// HEALTH RECORDS ROUTES
// ---------------------------------------------
app.post("/health", authenticate, upload.single("document_pic"), async (req, res) => {
  const { p_id, type, condition, note, date, vet_name } = req.body;

  try {
    const petCheck = await pool.query(
      `SELECT * FROM pets WHERE p_id = $1 AND user_id = $2`,
      [p_id, req.user.user_id]
    );

    if (!petCheck.rows.length)
      return res.status(403).json({ message: "Pet not found or unauthorized" });

    const documentPic = req.file ? req.file.path : null;

    const result = await pool.query(
      `INSERT INTO health_records (p_id, type, condition, note, date, vet_name, document_pic)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [p_id, type, condition, note, date, vet_name, documentPic]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ADD HEALTH RECORD ERROR >>>", err);
    res.status(500).json({ message: "Failed to add health record", error: err.message });
  }
});

app.get("/health/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  if (Number(userId) !== req.user.user_id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const result = await pool.query(
      `
      SELECT h.*, p.name AS pet_name, p.species
      FROM health_records h
      JOIN pets p ON h.p_id = p.p_id
      WHERE p.user_id = $1
      ORDER BY h.date DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("FETCH HEALTH RECORDS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch health records" });
  }
});

app.get("/health/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT h.*, p.name AS pet_name
      FROM health_records h
      JOIN pets p ON h.p_id = p.p_id
      WHERE h.h_id = $1 AND p.user_id = $2
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Health record not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("FETCH HEALTH RECORD ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch health record" });
  }
});

app.put("/health/:id", authenticate, upload.single("document_pic"), async (req, res) => {
  const { id } = req.params;
  const { type, condition, note, date, vet_name } = req.body;

  try {
    const documentPic = req.file ? req.file.path : null;

    const result = await pool.query(
      `
      UPDATE health_records h
      SET type = $1,
          condition = $2,
          note = $3,
          date = $4,
          vet_name = $5,
          document_pic = COALESCE($6, document_pic)
      FROM pets p
      WHERE h.p_id = p.p_id
        AND h.h_id = $7
        AND p.user_id = $8
      RETURNING h.*
      `,
      [type, condition, note, date, vet_name, documentPic, id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Update failed" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE HEALTH RECORD ERROR >>>", err);
    res.status(500).json({ message: "Failed to update health record" });
  }
});

app.delete("/health/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM health_records h
      USING pets p
      WHERE h.p_id = p.p_id
        AND h.h_id = $1
        AND p.user_id = $2
      RETURNING h.*
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Delete failed" });

    res.json({ message: "Health record deleted successfully" });
  } catch (err) {
    console.error("DELETE HEALTH RECORD ERROR >>>", err);
    res.status(500).json({ message: "Failed to delete health record" });
  }
});

// ---------------------------------------------
// REMINDERS ROUTES
// ---------------------------------------------
app.post("/reminders", authenticate, upload.single("reminder_pic"), async (req, res) => {
  const { p_id, type, title, date, time, repeat } = req.body;

  try {
    const petCheck = await pool.query(
      `SELECT * FROM pets WHERE p_id = $1 AND user_id = $2`,
      [p_id, req.user.user_id]
    );

    if (!petCheck.rows.length)
      return res.status(403).json({ message: "Pet not found or unauthorized" });

    const reminderPic = req.file ? req.file.path : null;

    const result = await pool.query(
      `INSERT INTO reminders (p_id, type, title, date, time, repeat, reminder_pic, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [p_id, type, title, date, time, repeat, reminderPic, false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ADD REMINDER ERROR >>>", err);
    res.status(500).json({ message: "Failed to add reminder", error: err.message });
  }
});

app.get("/reminders/user/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;

  if (Number(userId) !== req.user.user_id)
    return res.status(403).json({ message: "Forbidden" });

  try {
    const result = await pool.query(
      `
      SELECT r.*, p.name AS pet_name, p.species
      FROM reminders r
      JOIN pets p ON r.p_id = p.p_id
      WHERE p.user_id = $1
      ORDER BY r.date ASC, r.time ASC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("FETCH REMINDERS ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
});

app.get("/reminders/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT r.*, p.name AS pet_name
      FROM reminders r
      JOIN pets p ON r.p_id = p.p_id
      WHERE r.r_id = $1 AND p.user_id = $2
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Reminder not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("FETCH REMINDER ERROR >>>", err);
    res.status(500).json({ message: "Failed to fetch reminder" });
  }
});

app.put("/reminders/:id", authenticate, upload.single("reminder_pic"), async (req, res) => {
  const { id } = req.params;
  const { type, title, date, time, repeat, completed } = req.body;

  try {
    const reminderPic = req.file ? req.file.path : null;

    const result = await pool.query(
      `
      UPDATE reminders r
      SET type = $1,
          title = $2,
          date = $3,
          time = $4,
          repeat = $5,
          completed = $6,
          reminder_pic = COALESCE($7, reminder_pic)
      FROM pets p
      WHERE r.p_id = p.p_id
        AND r.r_id = $8
        AND p.user_id = $9
      RETURNING r.*
      `,
      [type, title, date, time, repeat, completed, reminderPic, id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Update failed" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE REMINDER ERROR >>>", err);
    res.status(500).json({ message: "Failed to update reminder" });
  }
});

app.patch("/reminders/:id/toggle", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE reminders r
      SET completed = NOT completed
      FROM pets p
      WHERE r.p_id = p.p_id
        AND r.r_id = $1
        AND p.user_id = $2
      RETURNING r.*
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Toggle failed" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("TOGGLE REMINDER ERROR >>>", err);
    res.status(500).json({ message: "Failed to toggle reminder" });
  }
});

app.delete("/reminders/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM reminders r
      USING pets p
      WHERE r.p_id = p.p_id
        AND r.r_id = $1
        AND p.user_id = $2
      RETURNING r.*
      `,
      [id, req.user.user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Delete failed" });

    res.json({ message: "Reminder deleted successfully" });
  } catch (err) {
    console.error("DELETE REMINDER ERROR >>>", err);
    res.status(500).json({ message: "Failed to delete reminder" });
  }
});

// ---------------------------------------------
// ERROR HANDLING
// ---------------------------------------------
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ---------------------------------------------
// SERVER
// ---------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
