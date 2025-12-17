import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React from "react";

const AIChatDialog = () => {
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
        <div className=" self-start bg-white text-gray-700 p-3 rounded-2xl rounded-bl-none shadow">
          Hi! 👋 What would you like to eat today?
        </div>

        {/* User Message */}
        <div className=" self-end bg-orange-500 text-white p-3 rounded-2xl rounded-br-none shadow text-right">
          Suggest something healthy 😋
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white flex items-center gap-3">
        <Input
          placeholder="Ask about your food..."
          className="rounded-full focus-visible:ring-orange-500"
        />
        <button className="bg-orange-500 hover:bg-orange-600 transition text-white p-2 rounded-full">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChatDialog;
