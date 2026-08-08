import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Location() {
    return (
        <section id="location" className="bg-secondary py-24 md:py-32">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full lg:w-1/3"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-obsidian flex items-center justify-center text-silk">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <p className="text-[12px] uppercase tracking-[0.3em] text-obsidian">Our Showroom</p>
                    </div>

                    <h2 className="font-heading font-light text-obsidian text-4xl leading-tight mb-6">
                        Experience Our Craft in Person
                    </h2>

                    <div className="space-y-6 text-basalt font-body">
                        <div>
                            <h4 className="text-obsidian font-medium mb-1">Address</h4>
                            <p>Luxe Craft Furniture<br />Nairobi, Kenya</p>
                        </div>
                        <div>
                            <h4 className="text-obsidian font-medium mb-1">Opening Hours</h4>
                            <p>Mon - Fri: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                        </div>
                        <p className="text-sm pt-4 italic">
                            * Drop by to feel the textures and see the true quality of our pieces before you decide.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="w-full lg:w-2/3 h-[400px] lg:h-[500px] bg-obsidian/5 rounded-sm overflow-hidden border border-obsidian/10 shadow-sm relative group"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d249.30022267662716!2d36.8858403!3d-1.2922645!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f138feb2484ab%3A0x55ec80639e353241!2sLeader%20Glaziers%20and%20Hardware!5e0!3m2!1sen!2ske!4v1786226108284!5m2!1sen!2ske"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Luxe Craft Furniture – Showroom Location"
                        className="w-full h-full grayscale-[80%] opacity-90 contrast-125 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                    ></iframe>
                </motion.div>
            </div>
        </section>
    );
}
