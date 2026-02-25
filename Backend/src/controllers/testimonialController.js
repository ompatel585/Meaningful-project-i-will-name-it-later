import Testimonial from '../models/Testimonial.js';

// Get all active testimonials (public)
export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true })
            .sort({ isFeatured: -1, createdAt: -1 })
            .limit(10);
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get featured testimonials (public)
export const getFeaturedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true, isFeatured: true })
            .sort({ createdAt: -1 })
            .limit(6);
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create testimonial (public - for customers to submit)
export const createTestimonial = async (req, res) => {
    try {
        const testimonial = new Testimonial(req.body);
        const savedTestimonial = await testimonial.save();
        res.status(201).json(savedTestimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update testimonial (admin only)
export const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete testimonial (admin only)
export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all testimonials (admin only)
export const getAllTestimonialsAdmin = async (req, res) => {
    try {
        const testimonials = await Testimonial.find()
            .sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
