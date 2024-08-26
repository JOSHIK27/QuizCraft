"use client";

import { useState } from "react";
import { FaYoutube, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

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

  const handleOptionSelect = (questionIndex: number, option: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = option;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const handleGenerateNewQuiz = () => {
    setQuestions([]);
    setSelectedAnswers([]);
    setShowResults(false);
    setUrl("");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        YouTube Quiz Generator
      </h1>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl mb-12 transform hover:scale-105 transition-all duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="relative">
            <FaYoutube className="absolute top-3 left-3 text-red-500 text-2xl" />
            <input
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
              placeholder="Enter YouTube URL"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Quiz"
            )}
          </button>
        </form>
      </div>

      {questions.length > 0 && (
        <div className="w-full max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-center text-purple-800">
            Quiz Questions
          </h2>
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-xl p-8 mb-8 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-purple-700">
                Question {index + 1}: {q.question}
              </h3>
              <ul className="space-y-4">
                {q.options.map((option, optionIndex) => (
                  <li
                    key={optionIndex}
                    className={`flex items-center text-gray-800 rounded-lg p-4 transition-colors duration-200 cursor-pointer ${
                      selectedAnswers[index] === option
                        ? "bg-purple-200"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleOptionSelect(index, option)}
                  >
                    <span className="mr-4 text-purple-600 font-semibold">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    {option}
                  </li>
                ))}
              </ul>
              {showResults && (
                <div className="mt-6 flex items-center">
                  {selectedAnswers[index] === q.correctAnswer ? (
                    <FaCheckCircle className="mr-2 text-green-600" />
                  ) : (
                    <FaTimesCircle className="mr-2 text-red-600" />
                  )}
                  <p
                    className={`font-semibold ${
                      selectedAnswers[index] === q.correctAnswer
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedAnswers[index] === q.correctAnswer
                      ? "Correct!"
                      : `Incorrect. The correct answer is: ${q.correctAnswer}`}
                  </p>
                </div>
              )}
            </div>
          ))}
          {!showResults && (
            <button
              onClick={handleCheckAnswers}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-8"
            >
              Check Answers
            </button>
          )}
          {showResults && (
            <button
              onClick={handleGenerateNewQuiz}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-8"
            >
              Generate New Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}