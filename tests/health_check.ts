import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import healthCheckRoute from "../src/routes/health_check";

const app = express();

app.use("/api/health-check", healthCheckRoute);

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

// Test for GET /api/category
describe("GET /api/health-check", () => {
  it("should check health", async () => {
    const response = await request(app).get("/api/health-check");

    expect(response.status).toBe(200);
  });
});
