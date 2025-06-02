"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/LoginNavbar";
import Footer from "../components/Footer";
import axios from "axios";
import Link from "next/link";
import { Search, FileText } from "lucide-react";

export default function PapersPage() {
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all papers on mount
  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/paper/all-papers", {
          headers: { Authorization: `${token}` },
        });
        setPapers(res.data.papers);
        setFilteredPapers(res.data.papers);
      } catch (err) {
        setError("Failed to fetch papers. Please try again.");
      }
      setLoading(false);
    };
    fetchPapers();
  }, []);

  // Filter papers whenever search changes
  useEffect(() => {
    const s = search.trim().toLowerCase();
    if (!s) {
      setFilteredPapers(papers);
      return;
    }
    setFilteredPapers(
      papers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(s) ||
          paper.username.toLowerCase().includes(s)
      )
    );
  }, [search, papers]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <section className="flex-1 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">All Research Papers</h2>
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or uploader..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder:text-gray-400"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          {loading ? (
            <div className="text-center text-lg text-blue-600 py-20">Loading papers...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-20">{error}</div>
          ) : filteredPapers.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No papers found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPapers.map((paper) => (
                <Link
                  href={`/papers/${paper.id}`}
                  key={paper.id}
                  className="block hover:shadow-lg transition-shadow"
                >
                  <div className="bg-white rounded-lg shadow p-6 flex flex-col h-full cursor-pointer border border-gray-100 hover:border-blue-200">
                    <div className="flex items-center mb-4">
                      <FileText className="h-7 w-7 text-blue-600 mr-3" />
                      <span className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {paper.title}
                      </span>
                    </div>
                    <div className="flex-1" />
                    <div className="flex justify-between items-center mt-4 text-sm">
                      <span className="text-gray-500">
                        Uploaded by{" "}
                        <span className="text-blue-600 font-medium">{paper.username}</span>
                      </span>
                      <span className="text-gray-400">
                        {new Date(paper.uploaded_at).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}