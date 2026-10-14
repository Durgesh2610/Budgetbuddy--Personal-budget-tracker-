const Expense = require("../models/Expense");

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL EXPENSES OF LOGGED-IN USER
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Expense deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
