import { Router } from "express";
import { MeetingController } from "../controllers/MeetingController";

const router = Router();
const meetingController = new MeetingController();

// Criando rotas com arrow functions
router.post("/meetings", async (req, res) => {
  await meetingController.createMeeting(req, res);
});

router.get("/meetings/:roomId", async (req, res) => {
  await meetingController.getMeeting(req, res);
});

router.post("/meetings/:roomId/end", async (req, res) => {
  await meetingController.endMeeting(req, res);
});

export default router;
