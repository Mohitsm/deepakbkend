import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      orders: [], // Initialize empty orders array
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" })

    // Return consistent structure
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        _id: user._id, // Include both for compatibility
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        joinDate: user.joinDate,
        orders: user.orders,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Registration failed", error: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" })

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        _id: user._id, // Include both for compatibility
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        joinDate: user.joinDate,
        orders: user.orders || [],
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Login failed", error: error.message })
  }
}

// Logout (clears token client-side)
export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logout successful" })
}

// Get by ID - Fixed to return consistent structure
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    // Return in consistent format
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        joinDate: user.joinDate,
        orders: user.orders || [],
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Error fetching user", error: error.message })
  }
}

// Update
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) return res.status(404).json({ message: "User not found" })

    res.status(200).json({
      message: "User updated successfully",
      data: {
        id: user._id,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        joinDate: user.joinDate,
        orders: user.orders || [],
      },
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ message: "Update failed", error: error.message })
  }
}

// Delete
export const deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ message: "User not found" })
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Deletion failed", error: error.message })
  }
}

// Place Order - Enhanced with better structure
export const placeOrder = async (req, res) => {
  try {
    const userId = req.params.id
    const orderData = req.body

    console.log("Placing order for user:", userId)
    console.log("Order data:", orderData)

    // Validate required fields
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" })
    }

    if (!orderData.total || orderData.total <= 0) {
      return res.status(400).json({ message: "Order total must be greater than 0" })
    }

    // Generate unique order ID and number
    const orderId = new Date().getTime().toString()
    const orderNumber = `MOR${Date.now()}`

    const newOrder = {
      _id: orderId,
      id: orderId, // Include both for compatibility
      orderNumber,
      date: new Date(),
      orderDate: new Date().toISOString(),
      status: orderData.status || "confirmed",
      total: orderData.total,
      subtotal: orderData.subtotal || orderData.total,
      discount: orderData.discount || 0,
      shippingCost: orderData.shippingCost || orderData.shipping || 0,
      tax: orderData.tax || 0,
      items: orderData.items.map((item) => ({
        productId: item.productId || item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping: orderData.shipping || null,
      payment: orderData.payment || null,
    }

    console.log("Created order object:", newOrder)

    // Find user and add order
    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { orders: newOrder } }, { new: true }).select(
      "-password",
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    console.log("Order added to user successfully")

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
      user: {
        id: updatedUser._id,
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        orders: updatedUser.orders,
      },
    })
  } catch (error) {
    console.error("Place order error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    })
  }
}

// Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("orders")
    if (!user) return res.status(404).json({ message: "User not found" })

    res.status(200).json({
      success: true,
      data: user.orders || [],
    })
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ message: "Failed to fetch orders", error: error.message })
  }
}
