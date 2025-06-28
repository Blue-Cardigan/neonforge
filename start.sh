#!/bin/bash

echo "🚀 Setting up NeonForge..."

# Navigate to project directory
cd /Users/cardigan/Desktop/NeonForge

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo "🔑 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your service credentials!"
    echo "🤖 Gemini API key: https://makersuite.google.com/app/apikey"
    echo "📋 Supabase project: https://supabase.com"
else
    echo "✅ .env file found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start development server
echo "🔥 Starting development server..."
npm run dev

echo "✅ NeonForge is running!"
echo "🌐 Open your browser to the localhost URL shown above"
echo "⚡ The WebContainer will boot automatically and provide full functionality"
echo "🤖 Configure Gemini API key for AI features"
echo "📂 Configure Supabase for GitHub integration"
