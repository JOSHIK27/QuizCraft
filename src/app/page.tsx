"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      console.log(data);
      if (Array.isArray(data.quizQuestions)) {
        setQuestions(data.quizQuestions);
      } else {
        console.error("Invalid quiz questions format received");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="url" className="font-medium text-gray-700">
            Enter YouTube URL
          </label>
          <input
            id="url"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </form>
      </div>

      {questions.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4 text-black">Quiz Questions</h2>
          {questions.map((q, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h3 className="text-lg font-semibold mb-2 text-black">
                {q.question}
              </h3>
              <ul className="list-disc pl-6">
                {q.options.map((option, optionIndex) => (
                  <li key={optionIndex} className="mb-1 text-black">
                    {option}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-black">
                Correct answer: {q.correctAnswer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
