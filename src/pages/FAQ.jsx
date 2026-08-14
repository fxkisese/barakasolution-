import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
    const faqs = [
        {
            question: "How long does a custom order take?",
            answer: "Custom mirror and glass orders typically take 3 to 7 working days depending on the complexity of the design, glass cutting, and polishing required. We'll give you an exact timeline during consultation."
        },
        {
            question: "Do you offer delivery and installation?",
            answer: "Yes! We offer safe delivery and professional installation services. For major installations like shower cubicles or large wall mirrors, our expert team ensures secure and precise fitting. Delivery fees depend on your location."
        },
        {
            question: "What are your payment terms?",
            answer: "We require a 60% deposit before commencing any custom work, with the remaining 40% payable upon completion or delivery. We accept M-PESA, bank transfers, and cash."
        },
        {
            question: "Do your products come with a warranty?",
            answer: "We stand by the quality of our work. We offer a 1-year warranty on installation workmanship and LED lighting components for our smart mirrors. Glass breakage after safe installation is not covered."
        },
        {
            question: "Can I visit your showroom?",
            answer: "Absolutely. You can visit our main branch at Kyumbi or our pickup point at Whitehouse Footbridge. Our team is always ready to guide you through our product catalogs and physical samples."
        },
        {
            question: "Do you handle large commercial projects?",
            answer: "Yes, we regularly handle commercial contracts including office glass partitions, storefronts, and gym mirror walls. Please contact us via email or phone to discuss your commercial needs."
        }
    ];

    return (
        <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-6">
                    <HelpCircle className="w-8 h-8 text-slate-900" />
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Frequently Asked Questions</h1>
                <p className="text-lg text-slate-600">
                    Find answers to common questions about our products, delivery, and ordering process.
                </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-100">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left text-lg font-medium text-slate-900 hover:text-slate-600 transition-colors">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed text-base pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="mt-16 text-center">
                <p className="text-slate-600 mb-4">Still have questions?</p>
                <a 
                    href="/contact"
                    className="inline-flex font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600 transition-colors"
                >
                    Contact our support team
                </a>
            </div>
        </div>
    );
}
