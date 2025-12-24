import { Input } from "@/components/ui/input";
import { suggestFood } from "@/modules/AI suggestions/server/suggest-food";
import { Loader2, Send } from "lucide-react";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "ai";
  content: string;
};
const AIChatDialog = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [Message, setMessage] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! 👋 What would you like to eat today?",
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const handleResponse = async (userMessage: string) => {
    if (userMessage === "") {
      return toast.error("Please write something");
    }
    setMessage((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    startTransition(async () => {
      try {
        const aiReply = await suggestFood(userMessage);
        if (!aiReply) {
          throw new Error("No response from AI");
        }
        setMessage((prev) => [...prev, { role: "ai", content: aiReply }]);
      } catch (error) {
        console.log(error);
        toast.error(
          "AI service is available only on localhost. Please run the app locally."
        );
      }
    });
  };

  console.log(Message);

  return (
    <div className="h-[80vh] flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b bg-orange-50">
        <h2 className="text-lg font-semibold text-orange-600">
          🍽️ Chat with AI Assistant
        </h2>
        <p className="text-sm text-gray-500">
          Ask about food, calories, or recommendations
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4 bg-gray-50">
        {/* AI Message */}
        {/* <div className=" text-lg font-semibold bg-orange-300 rounded-2xl p-2">
          Hi! 👋 What would you like to eat today?
        </div> */}

        {/* User Message */}
        {/* <div className=" self-end bg-orange-500 text-white p-3 rounded-2xl rounded-br-none shadow text-right">
          Suggest something healthy 😋
        </div> */}
        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4 bg-gray-50">
          {Message.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] p-3 rounded-2xl shadow text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-orange-500 text-white rounded-br-none text-right"
                  : "bg-orange-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {/* Typing indicator */}
          {isPending && (
            <div className="bg-orange-100 text-gray-600 p-3 rounded-2xl w-fit">
              Thinking...
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center gap-3">
        <Input
          placeholder="Ask about your food..."
          className="rounded-full focus-visible:ring-orange-500"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="bg-orange-500 hover:bg-orange-600 transition text-white p-2 rounded-full"
          onClick={() => handleResponse(inputValue)}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChatDialog;
