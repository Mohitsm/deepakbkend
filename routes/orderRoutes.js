import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  updateOrderStatusByAdmin,
} from "../controllers/orderController.js";
import { userAuth } from "../middleware/userAuth.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// User
router.post("/user/:userId", userAuth, placeOrder);
router.get("/user/:userId", userAuth, getUserOrders);

// Admin
router.get("/all", authMiddleware, getAllOrders);
router.put("/admin/:orderId/status", authMiddleware, updateOrderStatusByAdmin);

// Optional routes (Add these if needed)
router.get("/order/:orderId", authMiddleware, getOrderById); // For both user/admin
router.put("/order/:orderId/status", authMiddleware, updateOrderStatus); // For user status updates
router.delete("/order/:orderId", authMiddleware, deleteOrder); // Delete order (admin)


export default router;