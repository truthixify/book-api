import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import authMiddleware from "../middleware/auth";

import Category from "../models/Category";

const router: Router = express.Router();

// 1. Create a new category
router.post(
  "/",
  [
    body("name")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Category name must be at least 3 characters long"),
  ],
  authMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      // Check if the category already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).send("Category already exists");
      }

      // Create a new category
      const category = new Category({ name });
      await category.save();

      res.status(201).send(category);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

// 2. Get a list of all categories
router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 3. Get details of a specific category
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 4. Update a category
router.put(
  "/:id",
  [
    body("name")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Category name must be at least 3 characters long"),
  ],
  authMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).send("Category not found");
      }

      // Update category details
      category.name = name || category.name;
      await category.save();

      res.status(200).send(category);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

// Delete a Category
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).send("The category has been deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
