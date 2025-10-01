import express from "express";
import Workout from "../models/Workout.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { exercises } = req.body;

    if (!exercises || exercises.length === 0) {
      return res.status(400).json({ message: "Please add at least one exercise" });
    }

    const workout = new Workout({
      user: req.user.id,
      exercises,
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: "Error saving workout", error });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workouts", error });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await workout.deleteOne();
    res.json({ message: "Workout removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting workout", error });
  }
});

export default router;
