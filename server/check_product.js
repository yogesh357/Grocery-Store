import 'dotenv/config';
import connectDb from './configs/db.js';
import Product from './models/product.js';

async function run() {
    await connectDb();
    console.log("Searching for the product named 'Apple_test_Mail'...");
    
    const products = await Product.find({ name: 'Apple_test_Mail' }).sort({ createdAt: -1 });
    if (products.length === 0) {
        console.log("No products found with that name.");
        const lastProduct = await Product.findOne().sort({ createdAt: -1 });
        console.log("The latest product in the database is:", lastProduct);
    } else {
        console.log("Found products:");
        products.forEach((p, idx) => {
            console.log(`\nProduct #${idx + 1}:`);
            console.log("ID:", p._id);
            console.log("Name:", p.name);
            console.log("Image field:", p.image);
            console.log("Type of image:", typeof p.image, Array.isArray(p.image) ? "Array" : "Not Array");
            console.log("Full Product object:", JSON.stringify(p, null, 2));
        });
    }
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
