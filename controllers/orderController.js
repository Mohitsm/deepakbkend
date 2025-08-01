import Order from "../models/Order.js";
import mongoose from "mongoose";
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

    // Fetch complete product data for each item
    const Product = mongoose.model('Product');
    const itemsWithProductData = await Promise.all(
      orderData.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          productId: item.productId,
          title: product?.title || item.title,
          quantity: item.quantity,
          price: product?.price || item.price,
          image: product?.image || null // Get image from product
        };
      })
    );

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = new Order({
      ...orderData,
      items: itemsWithProductData, // Use enriched items
      userId,
      orderNumber,
      orderDate: new Date(),
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
      error: error.message
    });
  }
};
// export const placeOrder = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const orderData = req.body;

//     // Validate required fields
//     if (!orderData.items || orderData.items.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Order must include at least one item" 
//       });
//     }

//     if (!orderData.total) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Total amount is required" 
//       });
//     }

//     // Create order number
//     const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//     const newOrder = new Order({
//       ...orderData,
//       userId,
//       orderNumber,
//       orderDate: new Date().toISOString(),
//       status: "confirmed"
//     });

//     const savedOrder = await newOrder.save();
    
//     res.status(201).json({ 
//       success: true, 
//       message: "Order placed successfully",
//       order: savedOrder 
//     });
//   } catch (error) {
//     console.error("Place Order Error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to place order",
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };



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


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate({
        path: 'items.productId',
        select: 'title price image',
        model: 'Product'
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        // Use populated product data or fallback to order data
        title: item.productId?.title || item.title,
        price: item.productId?.price || item.price,
        // Construct image URL if available
        image: item.productId?.image 
          ? `${req.protocol}://${req.get('host')}/uploads/${item.productId.image}`
          : null
      }))
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};
// export const getUserOrders = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user ID format",
//       });
//     }

    
//     const orders = await Order.find({ userId })
//       .populate({
//         path: 'items.productId',
//         select: 'title price image', 
//         model: 'Product' 
//       })
//       .sort({ createdAt: - 1})
//       .lean();

//     if (!orders || orders.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No orders found for this user",
//         orders: [],
//       });
//     }

    
//     const formattedOrders = orders.map((order) => ({
//       id: order._id,
//       orderNumber: order.orderNumber,
//       date: order.orderDate || order.createdAt,
//       status: order.status,
//       total: order.total,
//       items: order.items.map((item) => ({
//         productId: item.productId?._id || item.productId,
//         title: item.productId?.title || item.title,
//         quantity: item.quantity,
//         price: item.productId?.price || item.price,
//         total: item.quantity * (item.productId?.price || item.price),
        
//         image: item.productId?.image 
//           ? `${req.protocol}://${req.get('host')}/uploads/${item.productId.image}`
//           : null
//       })),
//       shipping: order.shipping,
//       payment: order.payment,
//       createdAt: order.createdAt,
//       updatedAt: order.updatedAt,
//     }));

//     res.status(200).json({
//       success: true,
//       count: formattedOrders.length,
//       orders: formattedOrders,
//     });
//   } catch (error) {
//     console.error("Error in getUserOrders:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user orders",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };