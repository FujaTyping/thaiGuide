"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send, Bot } from "lucide-react"

interface ChatMessage {
    id: string
    text: string
    sender: 'user' | 'bot'
}

interface ChatbotProps {
    apiUrl?: string
    initialBotMessage?: string
}

export default function Chatbot({
    apiUrl = "https://hook.eu2.make.com/nzl7mbbaod3ni514z2wptcx8dt1mukkq",
    initialBotMessage = "Hello! How can I help you plan your trip?"
}: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: crypto.randomUUID(), text: initialBotMessage, sender: 'bot' }
    ])
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: input,
            sender: 'user',
        }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsSending(true)

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: userMessage.text }),
            })

            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`)
            }

            // Read the response as plain text
            const botResponseText = await response.text()

            // Use the plain text response directly, or provide a fallback
            const finalText = botResponseText || "Got it! Let me process that."

            setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: finalText, sender: 'bot' }])
        } catch (error) {
            console.error("Chatbot API error:", error)
            setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: "Sorry, I couldn't connect to the assistant.", sender: 'bot' }])
        } finally {
            setIsSending(false)
        }
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <Button
                        onClick={handleToggle}
                        className="rounded-full w-16 h-16 bg-orange-600 hover:bg-orange-700 shadow-lg"
                        aria-label="Open chat"
                    >
                        <MessageCircle size={32} />
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-full sm:h-[70vh] sm:max-h-[600px] bg-white shadow-xl rounded-t-lg sm:rounded-lg flex flex-col z-50 border border-gray-200">
                    <div className="flex items-center justify-between p-4 bg-orange-600 text-white rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Bot size={20} />
                            <h3 className="font-semibold text-lg">Trip Assistant</h3>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleToggle} className="text-white hover:bg-orange-700" aria-label="Close chat">
                            <X size={20} />
                        </Button>
                    </div>

                    <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isSending && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-lg text-sm bg-gray-200 text-gray-800 flex items-center space-x-1">
                                    <span className="italic">Assistant is typing</span>
                                    <span className="animate-bounce [animation-delay:-0.3s] inline-block w-1.5 h-1.5 bg-current rounded-full"></span>
                                    <span className="animate-bounce [animation-delay:-0.15s] inline-block w-1.5 h-1.5 bg-current rounded-full"></span>
                                    <span className="animate-bounce inline-block w-1.5 h-1.5 bg-current rounded-full"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t bg-white">
                        <div className="flex items-center gap-2">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSend()} placeholder="Ask about your trip..." className="flex-1 p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500" disabled={isSending} />
                            <Button onClick={handleSend} disabled={isSending || !input.trim()} className="bg-orange-500 hover:bg-orange-600"><Send size={18} /></Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}