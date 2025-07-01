import {
  createEvent,
  deleteEvent,
  getEventsByUser,
  updateEvent,
} from "../models/eventModel.js";

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

export async function listEventsHandler(req, res) {
  try {
    const userId = req.user.id;
    const allEvents = await getEventsByUser(userId);
    if (!allEvents) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ allEvents });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error list event" });
  }
}

export async function updateEventHandler(req, res) {
  try {
    const { title, description, date } = req.body;
    const userId = req.user.id;
    const eventId = req.params.id;

    if (!eventId) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ok = await updateEvent(title, description, date, eventId, userId);

    if (!ok) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error update event" });
  }
}

export async function deleteEventHandler(req, res) {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    if (!eventId) {
      return res.status(400).json({ message: "Event id is required" });
    }

    const ok = await deleteEvent(eventId, userId);

    if (!ok) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting event" });
  }
}
