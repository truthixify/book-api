"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_1 = __importDefault(require("../src/routes/book"));
const app = (0, express_1.default)();
app.use("/api/book", book_1.default);
// Connect to MongoDB before tests run
beforeAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      yield mongoose_1.default.connect(String("mongodb://127.0.0.1:27017"));
      console.log("conected to DB successfully");
    } catch (err) {
      console.log(err);
    }
  }),
);
// Cleanup after tests
afterAll(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.dropDatabase();
    yield mongoose_1.default.connection.close();
  }),
);
// Test for POST /api/book
describe("POST /api/book", () => {
  it("should create a new book", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const newBook = {
        title: "The Great Gatsby",
        description:
          "A novel set in the Roaring Twenties, The Great Gatsby explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Jazz Age or the era of the New York elite.",
        categoryIds: ["6786fb90111bbf46cc1e95e7"],
      };
      const response = yield (0, supertest_1.default)(app)
        .post("/api/book")
        .send(newBook);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data.title).toBe(newBook.title);
    }));
});
// Test for GET /api/book
describe("GET /api/book", () => {
  it("should get all books", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(app).get("/api/book");
      expect(response.status).toBe(200);
      expect(response.body.books).toBeInstanceOf(Array);
    }));
});
