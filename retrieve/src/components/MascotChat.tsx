"use client";

import React, { useState, useEffect, useRef } from "react";
import Mascot3D from "./Mascot3D";

interface Message {
  id: string;
  sender: "user" | "scratten";
  text: string;
}

interface MascotChatProps {
  isOpen: boolean;
  onClose: () => void;
  passageText?: string;
  question?: {
    questionText: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
  };
  selectedOption?: "A" | "B" | "C" | "D" | null;
  correctOption?: "A" | "B" | "C" | "D";
  explanation?: string;
}

export default function MascotChat({
  isOpen,
  onClose,
  passageText = "",
  question,
  selectedOption,
  correctOption,
  explanation = "",
}: MascotChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mascotEmotion, setMascotEmotion] = useState<"happy" | "thinking" | "love" | "sad" | "sleepy">("happy");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when drawer is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "scratten",
          text: "Squeak! I'm Scratten, your personal MCAT study buddy! 🐿️ Need some help breaking down this question, or want a quick hint? Ask me anything! 🌰",
        },
      ]);
      setMascotEmotion("happy");
    }
  }, [isOpen, messages]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setMascotEmotion("thinking");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passage: passageText,
          question,
          selectedOption,
          correctOption,
          explanation,
          userMessage: text,
          history: messages.slice(-6), // Send last few messages for context
        }),
      });

      const data = await response.json();
      const scrattenMsg: Message = {
        id: Math.random().toString(),
        sender: "scratten",
        text: data.text || "Squeak! I couldn't formulate a response. Let's try again! 🌰",
      };

      setMessages((prev) => [...prev, scrattenMsg]);

      // Set happy or loving emotion upon responding
      if (text.toLowerCase().includes("thank") || text.toLowerCase().includes("love")) {
        setMascotEmotion("love");
      } else {
        setMascotEmotion("happy");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "scratten",
          text: "Squeak! My squirrel brain got a bit overloaded. Let's try that again! 🐿️",
        },
      ]);
      setMascotEmotion("sad");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      {/* Backdrop closer click */}
      <div className="flex-grow" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-md bg-[#FAFAF9] border-l-4 border-[#E5E5E5] flex flex-col h-full shadow-2xl relative z-10 animate-slide-left">
        {/* Header */}
        <header className="px-5 py-4 border-b-2 border-[#E5E5E5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#58CC02] font-bold text-2xl">school</span>
            <div>
              <h2 className="text-base font-extrabold text-[#1A1C1C]">Scratten's Study Corner</h2>
              <p className="text-[10px] text-[#5F6A59] font-extrabold uppercase tracking-wider">MCAT Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border-2 border-[#E5E5E5] hover:bg-[#FAFAF9] shadow-[0_2px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined text-[#5F6A59] font-bold">close</span>
          </button>
        </header>

        {/* 3D Mascot Header Display */}
        <div className="bg-[#E8F9DB] border-b-2 border-[#E5E5E5] p-3 flex flex-col items-center justify-center relative min-h-[160px] overflow-hidden select-none">
          {/* Subtle light sunburst */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] animate-pulse" />
          <Mascot3D emotion={mascotEmotion} className="w-32 h-32 absolute z-10" />
        </div>

        {/* Chat History Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#FAFAF9]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "scratten" && (
                <div className="w-8 h-8 rounded-lg bg-[#b85c1a]/10 border border-[#b85c1a]/30 flex items-center justify-center text-lg shadow-sm">
                  🐿️
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm border-2 ${
                  msg.sender === "user"
                    ? "bg-[#58CC02] border-[#2B6C00] text-white rounded-br-none"
                    : "bg-white border-[#E5E5E5] text-[#1A1C1C] rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Scratten is typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#b85c1a]/10 border border-[#b85c1a]/30 flex items-center justify-center text-lg shadow-sm animate-pulse">
                🐿️
              </div>
              <div className="bg-white border-2 border-[#E5E5E5] text-[#1A1C1C] px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#5F6A59] rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-[#5F6A59] rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-[#5F6A59] rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-white border-t-2 border-[#E5E5E5]">
          <button
            onClick={() => handleSuggestionClick("Give me a hint! 💡")}
            className="px-3 py-1.5 bg-[#FFF9E0] border border-[#FFE894] hover:bg-[#FFF3C2] text-[#755B00] text-[11px] font-extrabold rounded-full transition-all"
          >
            Give me a hint 💡
          </button>
          <button
            onClick={() => handleSuggestionClick("Explain this concept like I'm 5! 🍼")}
            className="px-3 py-1.5 bg-[#E8F9DB] border border-[#B7EB8F] hover:bg-[#D4F5B8] text-[#2B6C00] text-[11px] font-extrabold rounded-full transition-all"
          >
            Explain like I'm 5 🍼
          </button>
          <button
            onClick={() => handleSuggestionClick("Break down the correct answer. 🧬")}
            className="px-3 py-1.5 bg-[#E0F5FF] border border-[#88ceff] hover:bg-[#C8EBFF] text-[#005FA3] text-[11px] font-extrabold rounded-full transition-all"
          >
            Break down the science 🧬
          </button>
        </div>

        {/* Input Form Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="p-4 border-t-2 border-[#E5E5E5] bg-white flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Ask Scratten a question..."
            className="flex-1 border-2 border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs font-bold text-[#1A1C1C] focus:outline-none focus:border-[#58CC02] transition-colors bg-[#FAFAF9]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#58CC02] border-b-4 border-[#2B6C00] text-white disabled:bg-[#E5E5E5] disabled:border-b-0 disabled:text-[#A6A6A6] active:translate-y-[2px] active:border-b-2 transition-all shrink-0"
          >
            <span className="material-symbols-outlined font-bold text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
