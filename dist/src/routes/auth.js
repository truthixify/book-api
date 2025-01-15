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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Author_1 = __importDefault(require("../models/Author"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// ROUTES
// CREATE A NEW USER
router.post(
  "/register",
  [
    (0, express_validator_1.body)("name")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Author name must be at least 3 characters long"),
    (0, express_validator_1.body)("email")
      .isEmail()
      .withMessage("Please provide a valid email address"),
    (0, express_validator_1.body)("username")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    (0, express_validator_1.body)("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[@$!%*?&]/)
      .withMessage(
        "Password must contain at least one special character (@$!%*?&)",
      ),
  ],
  (req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const errors = (0, express_validator_1.validationResult)(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const username = yield Author_1.default.findOne({
        username: req.body.username,
      });
      if (username)
        return res.status(400).send("User already exists. Please login");
      const email = yield Author_1.default.findOne({ email: req.body.email });
      if (email)
        return res.status(400).send("User already exists. Please login");
      const hashedPassword = crypto_js_1.default.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SEC,
      ).toString();
      try {
        const author = new Author_1.default(
          Object.assign(Object.assign({}, req.body), {
            password: hashedPassword,
          }),
        );
        yield author.save();
        const _a = author.toObject(),
          { password } = _a,
          others = __rest(_a, ["password"]);
        res.status(200).send(others);
      } catch (ex) {
        res.status(500).send(ex);
      }
    }),
);
// LOGIN USER
router.post("/login", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const author = yield Author_1.default.findOne({
        username: req.body.username,
      });
      if (!author) return res.status(400).send("Invalid Login Credentials");
      const originalPassword = crypto_js_1.default.AES.decrypt(
        author.password,
        process.env.PASSWORD_SEC,
      ).toString(crypto_js_1.default.enc.Utf8);
      if (originalPassword !== req.body.password)
        return res.status(400).send("Invalid Login Credentials");
      const token = author.generateAuthToken();
      const _a = author.toObject(),
        { password } = _a,
        others = __rest(_a, ["password"]);
      res
        .header("x-auth-token", token)
        .status(200)
        .send(Object.assign(Object.assign({}, others), { token }));
    } catch (ex) {
      res.status(500).send(ex);
    }
  }),
);
exports.default = router;
