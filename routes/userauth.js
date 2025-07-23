// routes/userauthRoutes.js
import express from "express"
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  updateUser,
  deleteUser,
  placeOrder,
  getUserOrders,
} from "../controllers/userauthController.js"

import { userAuth } from "../middleware/userAuth.js"

const router = express.Router()

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)

// Protected routes
router.get("/:id", userAuth, getUserById)
router.put("/:id", userAuth, updateUser)
router.delete("/:id", userAuth, deleteUser)

// Order routes
router.post("/orders/:id", userAuth, placeOrder)
router.get("/orders/:id", userAuth, getUserOrders)

export default router
