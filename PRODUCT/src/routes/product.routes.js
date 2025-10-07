const {
    Router
} = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const product = require("../controller/product.controller");
const {
    validateCreateProduct
} = require("../middleware/validator");
const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage()
}); 

const route = Router();

route.post(
    "/",
    authMiddleware(["admin", "seller"]),
    upload.array("images", 5),
    validateCreateProduct,
    product.createProduct
);

route.get("/", product.getAllProducts);

route.get("/seller", authMiddleware(["seller"]), product.getProductBySeller);

route.get("/:id", product.getProductById);

route.patch("/:id", authMiddleware(["admin", "seller"]), product.updateProduct);

route.delete(
    "/:id",
    authMiddleware(["admin", "seller"]),
    product.deleteProduct
);

module.exports = route;