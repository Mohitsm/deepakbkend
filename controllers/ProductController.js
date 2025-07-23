import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

// Create
export const createProduct = async (req, res) => {
  try {
    const { body, file } = req;

    const benefits = [];
    for (let key in body) {
      if (key.startsWith("benefits[")) {
        benefits.push(body[key]);
      }
    }

    const product = new Product({
      ...body,
      benefits,
      image: file ? `/uploads/${file.filename}` : "",
    });

    await product.save();
    res.status(201).json({ message: "Product created", data: product });
  } catch (err) {
    res.status(400).json({ message: "Failed to create product", error: err.message });
  }
};

// Read All
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// Update
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, file } = req;

    const benefits = [];
    for (let key in body) {
      if (key.startsWith("benefits[")) {
        benefits.push(body[key]);
      }
    }

    const updateData = {
      ...body,
      benefits,
    };

    if (file) {
      updateData.image = `/uploads/${file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", data: product });
  } catch (err) {
    res.status(400).json({ message: "Failed to update product", error: err.message });
  }
};

// Delete
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image file if exists
    if (product.image) {
      const filePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete product", error: err.message });
  }
};
