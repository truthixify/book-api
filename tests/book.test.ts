import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import bookRoutes from "../src/routes/book";

const app = express();

app.use("/api/book", bookRoutes);

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

// Test for POST /api/book
describe("POST /api/book", () => {
  it("should create a new book", async () => {
    const newBook = {
      title: "The Great Gatsby",
      description:
        "A novel set in the Roaring Twenties, The Great Gatsby explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Jazz Age or the era of the New York elite.",
      categoryIds: ["6786fb90111bbf46cc1e95e7"],
    };

    const response = await request(app).post("/api/book").send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.title).toBe(newBook.title);
  });
});

// Test for GET /api/book
describe("GET /api/book", () => {
  it("should get all books", async () => {
    const response = await request(app).get("/api/book");

    expect(response.status).toBe(200);
    expect(response.body.books).toBeInstanceOf(Array);
  });
});
