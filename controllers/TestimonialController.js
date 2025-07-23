import Testimonial from '../models/TestimonialModel.js';
import fs from 'fs';
import path from 'path';

// Create Testimonial
export const createTestimonial = async (req, res) => {
    try {
        const { name, designation, feedback } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }
        const testimonial = new Testimonial({
            name,
            designation,
            feedback,
            image: req.file.path
        });
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Testimonials
export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Testimonial
export const getTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        res.status(200).json(testimonial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Testimonial
export const updateTestimonial = async (req, res) => {
    try {
        const { name, designation, feedback } = req.body;
        const updates = { name, designation, feedback };
        if (req.file) {
            // Delete old image if new one is uploaded
            const testimonial = await Testimonial.findById(req.params.id);
            if (testimonial?.image) {
                fs.unlinkSync(testimonial.image);
            }
            updates.image = req.file.path;
        }
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        if (!updatedTestimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        res.status(200).json(updatedTestimonial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Testimonial
export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        // Delete associated image
        if (testimonial.image) {
            fs.unlinkSync(testimonial.image);
        }
        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};