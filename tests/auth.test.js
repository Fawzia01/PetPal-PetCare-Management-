import request from "supertest";
import app from "../src/index.js"; // your main file

describe("User Auth", () => {
  it("signup and login", async () => {
    // Signup
    await request(app).post("/signup").send({
      name: "Test",
      email: "test@example.com",
      password: "123456"
    });

    // Login
    const res = await request(app).post("/login").send({
      email: "test@example.com",
      password: "123456"
    });

    console.log(res.body); // See token
  });
});

