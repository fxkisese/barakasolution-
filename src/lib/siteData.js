// Centralised content + generated imagery for the Luxe Craft Furniture flagship.

export const IMAGES = {
    hero: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/8bf6ece01_generated_40ce79b9.png",
    decor: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/78fc0c2e8_generated_45488a2c.png",
    chair: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/cfd64d8da_generated_770bee63.png",
    lighting: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/460d60835_generated_61a03648.png",
    couch: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/36a11895f_generated_5e350e8e.png",
    office: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/071f3e102_generated_c74ff25f.png",
    art: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/2b57b0551_generated_c7cf62f4.png",
    plants: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/349188121_generated_75b5d677.png",
    clocks: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/16205d4e1_generated_61b3a178.png",
    blog1: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/5a44af682_generated_c3bb48eb.png",
    blog2: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/0b95de8ec_generated_29985c2f.png",
    blog3: "https://media.base44.com/images/public/6a6d9931404d2ed792b9761d/a30bd088e_generated_2fce60e3.png",
};

export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Shop", href: "/shop" },
    { label: "Gallery", href: "/gallery" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
];

export const MEGA_MENU_LINKS = [
    { label: "SOFAS", href: "/shop?category=sofas", hasDropdown: true },
    { label: "BEDROOM", href: "/shop?category=bedroom", hasDropdown: true },
    { label: "LIVING PACKAGES", href: "/shop?category=living-packages", hasDropdown: false },
    { label: "COMING SOON", href: "/shop?category=coming-soon", hasDropdown: true },
    { label: "OFFICE", href: "/shop?category=office", hasDropdown: true },
    { label: "DINING", href: "/shop?category=dining", hasDropdown: true },
    { label: "LIVING", href: "/shop?category=living", hasDropdown: true },
    { label: "OUTDOOR", href: "/shop?category=outdoor", hasDropdown: true },
    { label: "MATTRESSES", href: "/shop?category=mattresses", hasDropdown: true },
    { label: "SOFT FURNISHINGS & OTTOMANS", href: "/shop?category=soft-furnishings", hasDropdown: true },
    { label: "HOME DECOR", href: "/shop?category=decor", hasDropdown: true },
    { label: "AVENUE 19 CLEARANCE", href: "/shop?category=clearance", hasDropdown: false },
    { label: "ONLINE EXCLUSIVE", href: "/shop?category=exclusive", hasDropdown: false, isRed: true },
    { label: "OFFICE CATALOGUE", href: "/shop?category=office-catalogue", hasDropdown: false },
    { label: "B2B SERVICES", href: "/services", hasDropdown: false },
];

export const CATEGORIES = [
    { name: "Decor", tag: "/DECOR", image: IMAGES.decor, blurb: "Sculptural objects & vases" },
    { name: "Chair", tag: "/CHAIR", image: IMAGES.chair, blurb: "Lounge & accent chairs" },
    { name: "Lighting", tag: "/LIGHTING", image: IMAGES.lighting, blurb: "Lamps that set the mood" },
    { name: "Couch", tag: "/COUCH", image: IMAGES.couch, blurb: "Low-profile loungers" },
    { name: "Office", tag: "/OFFICE", image: IMAGES.office, blurb: "Desks & workspace" },
    { name: "Art", tag: "/ART", image: IMAGES.art, blurb: "Framed wall works" },
    { name: "Plants", tag: "/PLANTS", image: IMAGES.plants, blurb: "Greenery & planters" },
    { name: "Clocks", tag: "/CLOCKS", image: IMAGES.clocks, blurb: "Time, kept quietly" },
];

export const PRODUCTS = [
    { name: "Eames-Style Lounge Chair", category: "Seating", price: 45000, image: IMAGES.chair },
    { name: "Brass Arc Floor Lamp", category: "Lighting", price: 12500, image: IMAGES.lighting },
    { name: "Boucle Lounge Sofa", category: "Sofas", price: 89000, image: IMAGES.couch },
    { name: "Solid Oak Writing Desk", category: "Office", price: 38000, image: IMAGES.office },
    { name: "Sculptural Ceramic Vase", category: "Decor", price: 3200, image: IMAGES.decor },
    { name: "Terracotta Planter Set", category: "Plants", price: 2800, image: IMAGES.plants },
];

export const SHOP_CATEGORIES = [
    { name: "Clocks", tag: "/CLOCKS", image: IMAGES.clocks },
    { name: "Decor", tag: "/DECOR", image: IMAGES.decor },
    { name: "Lighting", tag: "/LIGHTING", image: IMAGES.lighting },
    { name: "Office", tag: "/OFFICE", image: IMAGES.office },
    { name: "Plants", tag: "/PLANTS", image: IMAGES.plants },
    { name: "Couch", tag: "/COUCH", image: IMAGES.couch },
];

export const TESTIMONIALS = [
    {
        name: "Stella Smith",
        location: "New York City",
        rating: 5,
        quote: "I love the pieces from this shop. Everything has been spot on — fits wonderfully, the finish is exceptional, and there is so much to choose from. Truly worth the wait.",
    },
    {
        name: "Thomas Smith",
        location: "San Francisco",
        rating: 4,
        quote: "We stumbled across Luxe Craft Furniture and are so glad we did. Really buzzing vibe with a quirky, considered selection. The craftsmanship is superb — so much so we shipped pieces home.",
    },
    {
        name: "Joan Berg",
        location: "London",
        rating: 5,
        quote: "From Nairobi to my flat in London, the delivery was flawless and the chair even better in person. Quiet, warm, and built to last. I will be back for the sofa next.",
    },
    {
        name: "Josa Doe",
        location: "New York City",
        rating: 5,
        quote: "A rare store that respects both the product and the customer. The materials feel honest, the proportions are right, and the service never sleeps. Highly recommended.",
    },
];

export const BLOG_POSTS = [
    {
        title: "The Art of Slow Living in Nairobi Homes",
        category: "Interior",
        date: "Jul 18, 2026",
        image: IMAGES.blog1,
        excerpt: "How a quieter palette and fewer, better objects can transform a space into a sanctuary.",
    },
    {
        title: "Materials That Age With Grace",
        category: "Design",
        date: "Jul 02, 2026",
        image: IMAGES.blog3,
        excerpt: "On teak, brass and boucle — and why honest materials only get better with time.",
    },
    {
        title: "Styling Neutral Spaces With Warmth",
        category: "Styling",
        date: "Jun 21, 2026",
        image: IMAGES.blog2,
        excerpt: "A guide to layering texture, light and greenery without crowding the room.",
    },
];

export const FEATURES = [
    {
        icon: "truck",
        title: "Free Shipping",
        body: "Free standard shipping available within Nairobi on orders above a threshold.",
    },
    {
        icon: "map",
        title: "Nationwide Delivery",
        body: "We deliver across Kenya at a fee depending on distance and the pieces purchased.",
    },
    {
        icon: "headset",
        title: "24/7 Free Support",
        body: "We are here twenty-four hours a day, every day of the week, including holidays.",
    },
];

export const formatPrice = (kes) => `KES ${kes.toLocaleString("en-KE")}`;