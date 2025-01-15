"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Category_1 = __importDefault(require("../models/Category"));
const router = express_1.default.Router();
// 1. Create a new category
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    try {
        // Check if the category already exists
        const existingCategory = yield Category_1.default.findOne({ name });
        if (existingCategory) {
            return res.status(400).send('Category already exists');
        }
        // Create a new category
        const category = new Category_1.default({ name, description });
        yield category.save();
        res.status(201).send(category);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// 2. Get a list of all categories
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find();
        res.status(200).send(categories);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// 3. Get details of a specific category
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield Category_1.default.findById(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.status(200).send(category);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// 4. Update a category
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = yield Category_1.default.findById(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        // Update category details
        category.name = name || category.name;
        yield category.save();
        res.status(200).send(category);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Delete a Category
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Category_1.default.findByIdAndDelete(req.params.id);
        res.status(200).send('The category has been deleted');
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
