"use client";

import React, { useState } from "react";
import { Search, FileText, Calendar, Loader2 } from "lucide-react";

function PapersList({ papers, selectedPaper, onPaperSelect, loading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Papers</h2>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
          />
        </div>
      </div>

      {/* Papers List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading papers...</span>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <FileText className="h-8 w-8 mb-2" />
            <p className="text-sm">
              {searchTerm ? "No papers found matching your search" : "No papers uploaded yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => onPaperSelect(paper)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPaper?.id === paper.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{paper.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(paper.uploaded_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          {filteredPapers.length} paper{filteredPapers.length !== 1 ? "s" : ""} available
        </p>
      </div>
    </div>
  );
}

export default PapersList;