import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
  try {
    console.log("Incoming order:", req.body);

    const latestOrder = await Order.findOne().sort({ date: -1 });
    let orderId = "ORD000001";

    if (latestOrder) {
      let latestOrderNumber = parseInt(latestOrder.orderId.replace("ORD", ""));
      orderId = "ORD" + String(latestOrderNumber + 1).padStart(6, "0");
    }

    const items = [];
    let total = 0;

    for (const item of req.body.items) {
      const product = await Product.findOne({ productID: item.productID });

      if (!product) {
        return res.status(400).json({
          message: `Product with ID ${item.productID} not found`,
        });
      }

      items.push({
        productId: product.productID,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });

      total += product.price * item.quantity;
    }

    const newOrder = new Order({
      orderId: orderId,
      email: req.user.email,
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      total: total,
      items: items,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder.orderId,
      total,
    });
  } catch (error) {
    console.error("Order create error:", error);
    return res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
}

export async function getOrders(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (isAdmin(req)) {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } else {
    const orders = await Order.find({ email: req.user.email }).sort({
      date: -1,
    });
    res.json(orders);
  }
}

export async function updateOrderstatus(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  try {
    const orderId = req.params.orderId;
    const status = req.body.status;
    const notes = req.body.notes;

    await Order.updateOne(
      { orderId: orderId },
      { $set: { status: status, notes: notes } }
    );
    res.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Order update error:", error);
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
}
