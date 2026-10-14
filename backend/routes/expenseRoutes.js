const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addExpense, getExpenses, deleteExpense } = require("../controllers/expenseController");

// Add new expense (POST)
router.post("/", auth, addExpense);

// Get all expenses of logged-in user (GET)
router.get("/", auth, getExpenses);

// Delete a single expense by ID (DELETE)
router.delete("/:id", auth, deleteExpense);

module.exports = router;
