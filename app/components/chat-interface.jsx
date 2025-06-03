"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User, FileText, Loader2 } from "lucide-react";

function ChatInterface({ selectedPaper, chatHistory, onNewMessage }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedPaper || isLoading) return;

    const question = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/query/ask",
        {
          paperId: selectedPaper.id,
          question,
        },
        {
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        onNewMessage(question, response.data.answer);
      } else {
        console.error("Error asking question:", response.data.error);
      }
    } catch (error) {
      // Axios error response
      if (error.response) {
        console.error("Error asking question:", error.response.data?.error);
      } else {
        console.error("Error asking question:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedPaper) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <FileText className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium mb-2">Select a Paper to Start Chatting</h3>
        <p className="text-sm text-center max-w-md">
          Choose a research paper from the left sidebar to begin asking questions and exploring its content.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 truncate">{selectedPaper.title}</h2>
            <p className="text-sm text-gray-500">Ask questions about this paper</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">Start Your Conversation</h3>
            <p className="text-sm text-center max-w-md">
              Ask any question about "{selectedPaper.title}" and I'll help you understand it better.
            </p>
          </div>
        ) : (
          <>
            {[...chatHistory].reverse().map((query) => (
              <div key={query.id} className="space-y-4">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="max-w-3xl">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2">
                      <p className="text-sm">{query.question}</p>
                    </div>
                    <div className="flex items-center justify-end mt-1 space-x-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{formatTime(query.asked_at)}</span>
                    </div>
                  </div>
                </div>

                {/* AI Answer */}
                <div className="flex justify-start">
                  <div className="max-w-3xl">
                    <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                      <p className="text-sm whitespace-pre-wrap">{query.answer}</p>
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <Bot className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">AI Assistant</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl">
              <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
              <div className="flex items-center mt-1 space-x-2">
                <Bot className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">AI Assistant</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about this paper..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send your question. Be specific for better answers.</p>
      </div>
    </div>
  );
}

export default ChatInterface;