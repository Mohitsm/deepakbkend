import Order from "../models/Order.js";

// Place a new order (User)
// export const placeOrder = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const orderData = req.body;

//     if (!orderData.items || orderData.items.length === 0) {
//       return res.status(400).json({ success: false, message: "Order must include at least one item" });
//     }

//     const newOrder = new Order({
//       ...orderData,
//       userId,
//       orderNumber: `ORD-${Date.now()}`
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json({ success: true, order: savedOrder });
//   } catch (error) {
//     console.error("Place Order Error:", error);
//     res.status(500).json({ success: false, message: "Failed to place order", error: error.message });
//   }
// };
// controllers/Order.js
export const placeOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderData = req.body;

    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Order must include at least one item" 
      });
    }

    if (!orderData.total) {
      return res.status(400).json({ 
        success: false, 
        message: "Total amount is required" 
      });
    }

    // Create order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = new Order({
      ...orderData,
      userId,
      orderNumber,
      orderDate: new Date().toISOString(),
      status: "confirmed"
    });

    const savedOrder = await newOrder.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully",
      order: savedOrder 
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to place order",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// Get all orders of a specific user (User)
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userid }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user orders", error: error.message });
  }
};

// Get order by ID (Admin or User - depends on middleware)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
  }
};

// Update order status (User updating their own order - e.g., cancel request)
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.orderId,
//       { status },
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.status(200).json({ success: true, message: "Order status updated", order: updatedOrder });
//   } catch (error) {
//     console.error("Update Order Status Error:", error);
//     res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
//   }
// };


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Admin updates any order status
export const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated by admin", order: updatedOrder });
  } catch (error) {
    console.error("Admin Update Order Status Error:", error);
    res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
  }
};

// Delete an order (Admin or user, based on middleware)
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted", order: deletedOrder });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
  }
};
