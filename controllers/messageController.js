import Message from "../models/Message.js";

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { firstname, lastname, email, subject, message } = req.body;

    const newMessage = new Message({
      firstname,
      lastname,
      email,
      subject,
      message,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json({
      success: true,
      data: savedMessage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single message
export const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }
    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a message
export const updateMessage = async (req, res) => {
  try {
    const { firstname, lastname, email, subject, message } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, email, subject, message },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    res.json({
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }
    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
