import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderstatus,
} from "../controllers/orderController.js";
const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.put("/:orderId", updateOrderstatus);

export default orderRouter;
