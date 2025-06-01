/* "use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";



export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = async  (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");

    // Simulate bot reply (replace with API call as needed)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: `Bot reply to: "${input}"` },
      ]);
    }, 600);
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 h-80 overflow-y-auto bg-background p-2 rounded">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>🤖</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>🧑</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              autoFocus
            />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} */

"use client";
import React, { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const {
    append,
    status,
    stop,
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const noMessage = 0;

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 h-80 overflow-y-auto bg-background p-2 rounded">
            {!messages ||
              (messages.length == 0 && (
                <div className="text-center text-muted-foreground mt-10">
                  No messages yet. Start the conversation!
                </div>
              ))}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role !== "user" && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>🤖</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[70%] break-words ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>🧑</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {(status === "submitted" || status === "streaming") && (
            <div>
              {status === "submitted" && (
                <Loader2Icon className="animate-spin h-5 w-5 text-muted-foreground mr-2 inline-block" />
              )}

              <button type="button" onClick={() => stop()}>
                Stop
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              autoFocus
              className="flex-1"
              disabled={status === "streaming" || status === "submitted"}
            />
            <Button
              type="submit"
              disabled={status === "streaming" || status === "submitted"}
            >
              {status === "streaming" ? "Sending..." : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
