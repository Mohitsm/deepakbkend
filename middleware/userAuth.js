// import jwt from "jsonwebtoken"
// import User from "../models/User.js"

// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"

// export const userAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided, authorization denied",
//       })
//     }

//     const token = authHeader.split(" ")[1]

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided, authorization denied",
//       })
//     }

//     const decoded = jwt.verify(token, JWT_SECRET)
//     const user = await User.findById(decoded.id).select("-password")

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found, authorization denied",
//       })
//     }

//     req.user = user
//     req.userId = user._id
//     next()
//   } catch (error) {
//     console.error("Auth middleware error:", error)

//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token",
//       })
//     }

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Token expired",
//       })
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error in authentication",
//       error: error.message,
//     })
//   }
// }
// Enhanced userAuth middleware with better error handling
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"

export const userAuth = async (req, res, next) => {
  try {
    console.log("=== AUTH MIDDLEWARE DEBUG ===")
    console.log("Headers:", req.headers)

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No valid authorization header")
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      })
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
      console.log("❌ No token found")
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      })
    }

    console.log("✅ Token found, verifying...")
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log("✅ Token decoded:", decoded)

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      console.log("❌ User not found for ID:", decoded.id)
      return res.status(401).json({
        success: false,
        message: "User not found, authorization denied",
      })
    }

    console.log("✅ User authenticated:", user._id)
    console.log("=== END AUTH MIDDLEWARE DEBUG ===")

    req.user = user
    req.userId = user._id
    next()
  } catch (error) {
    console.error("❌ Auth middleware error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error in authentication",
      error: error.message,
    })
  }
}
