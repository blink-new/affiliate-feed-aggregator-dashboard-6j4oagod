# FeedFlow: Affiliate Feed Aggregator Dashboard

A modern, minimal web app that lets you upload messy affiliate deal feeds (CSV, JSON, XML), map incoming fields to your own clean schema, and output a structured, standardized feed via a private API.

## Features

- **Upload Feed Files**: Support for CSV, JSON, and XML formats
- **Field Mapping**: Map source fields to your target schema
- **Schema Design**: Create custom output schemas and clean messy categories
- **Export Options**: Access processed data via RESTful API or direct download
- **Beautiful UI**: Clean, light, playful but professional design inspired by bolt.new

## Tech Stack

- React with TypeScript
- Vite for fast development
- ShadCN UI Components
- Framer Motion for animations
- React Router for navigation
- Tailwind CSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## User Flow

1. **Upload Feed**: Upload your affiliate feed files (CSV, JSON, XML)
2. **Map Fields**: Define how incoming fields map to your schema
3. **Design Schema**: Create a clean, consistent schema for your data
4. **Export Feed**: Generate an API endpoint or download CSV for your clean feed

## Development

This project uses Vite for fast development. Run `npm run dev` to start the development server.

## Build

Run `npm run build` to create a production build of the application.