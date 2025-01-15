import express, { Request, Response } from 'express';

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    console.log("hel")
    res.status(200).send("server is alive");
})

export default router;