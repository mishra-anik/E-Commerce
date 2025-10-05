const {
    get,
    default: mongoose
} = require("mongoose");
const Product = require("../models/product.model");
const uploadImage = require("../services/imagekit.service");

const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            priceAmount,
            priceCuurency = "INR",
            image,
        } = req.body;

        const seller = req.user._id;

        const price = {
            amount: Number(priceAmount),
            currency: priceCuurency,
        };

        const images = await Promise.all(
            (req.file || []).map((file) => uploadImage({
                buffer: file.buffer
            }))
        );

        const product = await Product.create({
            title,
            description,
            price,
            images,
            seller,
        });

        // Logic to create a product
        res.status(201).json({
            message: "Product created",
            product
        });
    } catch (err) {
        console.error("Create product error", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const {
            q,
            minprice,
            maxprice,
            skip = 0,
            limit = 20
        } = req.query;

        const filter = {};
        if (q) {
            filter.title = {
                $search: q,
                $options: "i"
            }; // Case-insensitive search
        }

        if (minprice || maxprice) {
            filter.price = {};
            if (minprice) filter.price.$gte = Number(minprice);
            if (maxprice) filter.price.$lte = Number(maxprice);
        }

        const products = await Product.find(filter)
            .skip(Number(skip))
            .limit(Number(limit));
        res.status(200).json({
            data: products
        });
    } catch (err) {
        console.error("Get all products error", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getProductBySeller = async (req, res) => {
    const sellerId = req.user._id;
    const {
        skip = 0, limit = 20
    } = req.query;
    try {
        const products = await Product.find({
                seller: sellerId
            })
            .skip(Number(skip))
            .limit(Number(limit));
        return res.status(200).json({
            data: products
        });
    } catch (err) {
        console.error("Get products by seller error", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        // Find product by ID and populate seller information
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error("Get product by ID error", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (req.user._id.toString() !== product.seller.toString()) {
            return res.status(403).json({
                message: "You are not authorized to update this product",
            });
        }

        const allowedUpdates = [
            "title",
            "description",
            "priceAmount",
            "priceCuurency",
            "images",
        ];

        for (const key in req.body) {
            if (allowedUpdates.includes(key)) {
                if (key === "price" && typeof req.body.price === "object") {
                    if (key === "priceAmount" || key === "priceCuurency") {
                        product.price[key] = req.body[key];
                    }
                }

                if (key === "images" && req.files) {
                    const images = await Promise.all(
                        req.files.map((file) =>
                            uploadImage({
                                buffer: file.buffer
                            })
                        )
                    );
                    product.images = images;
                }
            } else {
                product[key] = req.body[key];
            }
        }

        await product.save();
        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (err) {
        console.error("Update product error", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if (req.user._id.toString() !== product.seller.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this product",
            });
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.error("Delete product error", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductBySeller,
    updateProduct,
    deleteProduct,
};