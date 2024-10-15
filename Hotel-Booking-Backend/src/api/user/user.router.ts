import { Router } from "express";
import {confirmEmail, list, me, updatePassword} from "./user.controller";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.get("/me", isAuthenticated, me);
router.get("users",list)
router.post("/email-confirmation", confirmEmail);
router.patch("/updatePassword",isAuthenticated, updatePassword);
export default router;