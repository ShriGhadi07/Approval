import { Router } from "express";
import { approveRequest, createRequest } from "../controllers/approval.controller";

const router = Router();

router.post("/create", createRequest);
router.post("/approve/:id", approveRequest);

export default router;
