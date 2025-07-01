"use client";
import React from "react";
import { UsersList } from "../components/UsersList";

export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          CBS Logistics - Redux Toolkit Demo
        </h1>
        <UsersList />
      </div>
    </div>
  );
}
