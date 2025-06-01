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
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-7xl shadow-lg mx-10">
        <CardHeader>
          <CardTitle className="text-xl text-center">XBOX RAGP</CardTitle>
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
