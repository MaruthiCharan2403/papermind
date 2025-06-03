"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Brain, User } from "lucide-react";
import PapersList from "../components/paper-list";
import ChatInterface from "../components/chat-interface";
import Navbar from "../components/LoginNavbar";

function ChatPage() {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's papers on component mount
  useEffect(() => {
    fetchPapers();
  }, []);

  // Fetch chat history when a paper is selected
  useEffect(() => {
    if (selectedPaper) {
      fetchChatHistory(selectedPaper.id);
    }
  }, [selectedPaper]);

  const fetchPapers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/paper/my-papers", {
        headers: {
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      });
      setPapers(response.data.papers || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching papers:", error);
      setLoading(false);
    }
  };

  const fetchChatHistory = async (paperId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/query/history/${paperId}`, {
        headers: {
          Authorization: `${sessionStorage.getItem("token")}`,
        },
      });
      setChatHistory(response.data.queries || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    }
  };

  const handlePaperSelect = (paper) => {
    setSelectedPaper(paper);
  };

  const handleNewMessage = (question, answer) => {
    const newQuery = {
      id: Date.now(), // Temporary ID
      user_id: 1,     // This should come from auth context
      paper_id: selectedPaper.id,
      question,
      answer,
      asked_at: new Date().toISOString(),
    };
    setChatHistory((prev) => [newQuery, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar/>

      {/* Main Chat Interface */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Papers List */}
        <div className="w-1/3 border-r border-gray-200 bg-white">
          <PapersList
            papers={papers}
            selectedPaper={selectedPaper}
            onPaperSelect={handlePaperSelect}
            loading={loading}
          />
        </div>

        {/* Right Side - Chat Interface */}
        <div className="flex-1 bg-white">
          <ChatInterface
            selectedPaper={selectedPaper}
            chatHistory={chatHistory}
            onNewMessage={handleNewMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;