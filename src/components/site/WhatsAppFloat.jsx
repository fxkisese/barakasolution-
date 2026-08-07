import { MessageCircle } from "lucide-react";
import { sendGeneralInquiryWhatsApp } from "@/utils/whatsapp";

export default function WhatsAppFloat() {
    return (
        <button
            onClick={sendGeneralInquiryWhatsApp}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-105 transition-all duration-300"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-7 h-7" />
        </button>
    );
}
