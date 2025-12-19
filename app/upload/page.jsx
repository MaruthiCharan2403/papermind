"use client";

import { useState } from "react";
import Navbar from "../components/LoginNavbar";
import Footer from "../components/Footer";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [paperId, setPaperId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter the paper title or DOI.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");
    setPaperId(null);

    try {
      const token = sessionStorage.getItem("token");
      console.log("Token:", token); // Debugging line to check token
      const res = await axios.post(
        "https://papermind.vercel.app/api/paper/upload",
        { name, title },
        { headers: { Authorization: `${token}` } }
      );

      if (res.status === 201) {
        setStatus("success");
        setPaperId(res.data.paperId);
        setTitle("");
        setMessage("Paper uploaded and processed successfully!");
      } else {
        setStatus("error");
        setMessage(res.data.error || "Unknown error occurred.");
      }
    } catch (err) {
      if (
        err.response &&
        err.response.status === 505
      ) {
        setStatus("error");
        setTitle("");
        setMessage("A paper with this title already exists.Check in View papers section.");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.error
      ) {
        setStatus("error");
        setMessage(err.response.data.error);
      } else {
        setStatus("error");
        setMessage("Paper processing failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Upload Research Paper
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setStatus("idle");
                  setMessage("");
                  setPaperId(null);
                }}
                required
                className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                disabled={status === "loading"}
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1.5 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Name of the Paper
              </label>
            </div>

            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setStatus("idle");
                  setMessage("");
                  setPaperId(null);
                }}
                required
                className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                disabled={status === "loading"}
              />
              <label
                htmlFor="title"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1.5 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                DOI
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing...
                </>
              ) : (
                "Upload and Process"
              )}
            </button>
          </form>

          {status === "loading" && (
            <div className="mt-6 text-center text-blue-600 font-medium flex flex-col items-center">
              <Loader2 className="animate-spin h-6 w-6 mb-2" />
              Please don&apos;t leave or refresh this tab until processing is complete!
            </div>
          )}
          {status === "error" && (
            <div className="mt-6 text-center text-red-600">{message}</div>
          )}
          {status === "success" && (
            <div className="mt-6 text-center text-green-600">
              {message}
              <br />

            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}