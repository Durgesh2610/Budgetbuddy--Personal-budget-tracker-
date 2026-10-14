require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Health check (used by Docker & load balancers)
app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// Root
app.get("/", (req, res) => {
    res.json({ message: "BudgetBuddy API is running!" });
});

// User Routes
app.use("/api/users", require("./routes/userRoutes"));

// Expense Routes
app.use("/api/expenses", require("./routes/expenseRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
