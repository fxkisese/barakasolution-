// Centralised content for the Luxe Craft Furniture flagship.
// All product/category images come from the Supabase admin panel.


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