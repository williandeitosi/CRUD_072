import { createEvent } from "../models/eventModel.js";

export async function createEventHandler(req, res) {
  try {
    const { title, description, date } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const desc = description || null;
    const eventDate = date || null;

    const eventId = await createEvent(title, desc, eventDate, userId);

    res.status(201).json({ message: "Event created", eventId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating event" });
  }
}
