const fs = require('fs');
const path = require('path');

const files = [
    "src/pages/TestimonialsPage.jsx",
    "src/pages/Terms.jsx",
    "src/pages/Services.jsx",
    "src/pages/PrivacyPolicy.jsx",
    "src/pages/ProductDetail.jsx",
    "src/pages/Contact.jsx",
    "src/pages/Blog.jsx",
    "src/pages/About.jsx",
    "src/components/site/TiktokFeed.jsx",
    "src/components/site/Footer.jsx"
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // General replacements
        content = content.replace(/Baraka Solutions/g, "Luxe Craft Furniture");
        content = content.replace(/barakasolutions/g, "luxecraftfurniture");
        content = content.replace(/Baraka Team/g, "Luxe Craft Team");
        content = content.replace(/Baraka/g, "Luxe Craft Furniture");
        
        // Specific content replacements to match furniture context
        content = content.replace(/premium glass and mirror craftsmanship/g, "premium furniture and decor");
        content = content.replace(/bespoke glass and mirror installations/g, "bespoke furniture collections");
        content = content.replace(/frameless glass partitions to custom LED mirrors/g, "elegant sofas to custom oak dining tables");
        content = content.replace(/glass and mirrors/g, "furniture and decor");
        content = content.replace(/premium glass and mirror products/g, "premium furniture products");
        content = content.replace(/glass coffee tables/g, "wooden coffee tables");
        content = content.replace(/glass partitions or mirrors/g, "furniture pieces");
        content = content.replace(/glass cutting, and polishing/g, "woodworking and finishing");
        content = content.replace(/custom mirror and glass orders/g, "custom furniture orders");
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
