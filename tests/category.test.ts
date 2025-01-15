import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import categoryRoute from "../src/routes/category";

const app = express();

app.use("/api/category", categoryRoute);

// Connect to MongoDB before tests run
beforeAll(async () => {
  try {
    await mongoose.connect(String("mongodb://127.0.0.1:27017"));
    console.log("conected to DB successfully");
  } catch (err) {
    console.log(err);
  }
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Test for POST /api/category
describe("POST /api/category", () => {
  it("should create a new category", async () => {
    const newCategory = {
      name: "science",
    };

    const response = await request(app).post("/api/category").send(newCategory);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.name).toBe(newCategory.name);
  });
});

// Test for GET /api/category
describe("GET /api/category", () => {
  it("should get all categories", async () => {
    const response = await request(app).get("/api/category");

    expect(response.status).toBe(200);
    expect(response.body.categories).toBeInstanceOf(Array);
  });
});
