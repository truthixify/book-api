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
const category_1 = __importDefault(require("../src/routes/category"));
const app = (0, express_1.default)();
app.use("/api/category", category_1.default);
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
// Test for POST /api/category
describe("POST /api/category", () => {
  it("should create a new category", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const newCategory = {
        name: "science",
      };
      const response = yield (0, supertest_1.default)(app)
        .post("/api/category")
        .send(newCategory);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data.name).toBe(newCategory.name);
    }));
});
// Test for GET /api/category
describe("GET /api/category", () => {
  it("should get all categories", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const response = yield (0, supertest_1.default)(app).get("/api/category");
      expect(response.status).toBe(200);
      expect(response.body.categories).toBeInstanceOf(Array);
    }));
});
