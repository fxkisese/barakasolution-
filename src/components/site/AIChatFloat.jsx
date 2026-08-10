import { useState, useRef, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

export default function AIChatFloat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi there! I am the Luxe Craft AI Assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({ name: '', contact: '' });
    const [askingDetails, setAskingDetails] = useState(false);
    const [pendingMessage, setPendingMessage] = useState("");

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        setInputValue("");
        setMessages(prev => [...prev, { role: 'user', text: userText }]);

        // If we don't have customer details, prompt for them
        if (!customerDetails.name || !customerDetails.contact) {
            setPendingMessage(userText);
            setAskingDetails(true);
            setMessages(prev => [...prev, { role: 'bot', text: 'To assist you better, could you please provide your name and phone/email? (e.g. "John, 0700123456")' }]);
            return;
        }

        await sendMessageToAI(userText, customerDetails);
    };

    const handleProvideDetails = async () => {
        if (!inputValue.trim()) return;
        const detailsText = inputValue.trim();
        setInputValue("");
        setMessages(prev => [...prev, { role: 'user', text: detailsText }]);

        // Crude extraction - just assume they typed their details
        const parts = detailsText.split(',').map(s => s.trim());
        const name = parts[0] || 'Website Visitor';
        const contact = parts[1] || detailsText;
        
        const newDetails = { name, contact };
        setCustomerDetails(newDetails);
        setAskingDetails(false);

        setMessages(prev => [...prev, { role: 'bot', text: 'Thank you! Let me check on your request...' }]);
        
        if (pendingMessage) {
            await sendMessageToAI(pendingMessage, newDetails);
            setPendingMessage("");
        }
    };

    const sendMessageToAI = async (text, details) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('handle-inquiry', {
                body: {
                    source: 'website',
                    customer_name: details.name,
                    customer_contact: details.contact,
                    message: text
                }
            });

            if (error) throw error;

            if (data?.status === 'auto_handled' && data?.ai_reply) {
                setMessages(prev => [...prev, { role: 'bot', text: data.ai_reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: "I've escalated this to our human team. They will review it and get back to you shortly!" }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I had trouble connecting. Please try again or reach out on WhatsApp." }]);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (askingDetails) {
            handleProvideDetails();
        } else {
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
            {isOpen && (
                <div className="bg-white border border-[#EAEBED] w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden" style={{ height: '500px', maxHeight: '80vh' }}>
                    {/* Header */}
                    <div className="bg-[#1A1816] text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6 text-[#C9A84C]" />
                            <div>
                                <h3 className="font-heading text-sm uppercase tracking-widest font-bold">Luxe Craft AI</h3>
                                <p className="text-xs text-[#A09D98]">Online</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-[#A09D98] hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 bg-[#FAF9F7] p-4 overflow-y-auto flex flex-col gap-3">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-[#1A1816] text-white rounded-tr-none' 
                                        : 'bg-white border border-[#E4E2DD] text-[#1A1816] rounded-tl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-[#E4E2DD] p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                    <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border-t border-[#EAEBED] p-3">
                        <form onSubmit={onSubmit} className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder={askingDetails ? "Name, Phone..." : "Type your message..."}
                                className="flex-1 h-10 px-3 bg-[#FAF9F7] border border-[#E4E2DD] rounded-full focus:outline-none focus:border-[#C9A84C] text-sm text-[#1A1816]"
                            />
                            <button 
                                type="submit" 
                                disabled={!inputValue.trim() || loading}
                                className="w-10 h-10 rounded-full bg-[#1A1816] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#C9A84C] transition-colors shrink-0"
                            >
                                <Send className="w-4 h-4 ml-1" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center w-14 h-14 bg-[#1A1816] text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-[#C9A84C] hover:scale-105 transition-all duration-300 group"
                    aria-label="Open AI Chat"
                >
                    <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
            )}
        </div>
    );
}
