const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware (MUST be before routes)
app.use(cors());
app.use(express.json());

// Temporary storage
let savedNotes = [];

// ✅ Generate notes (improved summarizer)
app.post("/generate", (req, res) => {
    const { content } = req.body;

    console.log("Incoming content:", content);

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "No content provided" });
    }

    // 🔹 Split text into sentences or lines
    let parts = content.split(/[.!?\n]/);

    // 🔹 Clean + remove short/empty lines
    parts = parts
        .map(p => p.trim())
        .filter(p => p.length > 25);

    // 🔹 If not enough parts, fallback to chunking words
    if (parts.length < 3) {
        let words = content.split(" ");
        parts = [];

        for (let i = 0; i < words.length; i += 12) {
            parts.push(words.slice(i, i + 12).join(" "));
        }
    }

    // 🔹 Create summarized bullet points
    let notes = parts.slice(0, 5).map(p => {
        let words = p.split(" ").slice(0, 10).join(" ");

        // Capitalize first letter
        words = words.charAt(0).toUpperCase() + words.slice(1);

        return "• " + words + "...";
    });

    // 🔹 Add heading (makes it look better)
    notes.unshift("📌 Key Points:");

    res.json({
        notes: notes.join("\n")
    });
});

// ✅ Save notes
app.post("/save", (req, res) => {
    const { notes } = req.body;

    if (!notes) {
        return res.status(400).json({ error: "No notes provided" });
    }

    savedNotes.push(notes);

    res.json({ message: "Notes saved successfully" });
});

// ✅ Get all saved notes
app.get("/notes", (req, res) => {
    res.json(savedNotes);
});

// ✅ Start server
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});