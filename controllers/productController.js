async function createProduct(req, res) {
    res.send('create product');
}
async function getAllProducts(req, res) {
    res.send('get all products');
}
async function getSingleProduct(req, res) {
    res.send('get single product');
}
async function updateProduct(req, res) {
    res.send('update product');
}
async function deleteProduct(req, res) {
    res.send('delete product');
}
async function uploadImage(req, res) {
    res.send('upload image');
}

module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage };
