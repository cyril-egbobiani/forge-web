# Forge Admin Panel

A React-based admin panel for managing events and teachings in the Forge mobile app ecosystem.

## Features

- 🔐 **Authentication** - Secure admin login system
- 📅 **Event Management** - Create, edit, and manage community events
- 📚 **Teaching Management** - Publish sermons, devotionals, and study materials
- 📊 **Dashboard** - Analytics and recent activity overview
- 🖼️ **Media Upload** - Support for images and videos
- 📱 **Responsive Design** - Works on desktop and tablet devices
- 🔔 **Real-time Notifications** - Toast notifications for user feedback

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Running backend API (forge-backend)

### Installation

1. **Install dependencies**:

   ```bash
   cd forge-web
   npm install
   ```

2. **Configure environment**:

   ```bash
   # Edit .env and set your backend API URL
   VITE_API_URL=http://localhost:3001/api
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable components
│   └── Layout.tsx    # Main layout with sidebar
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Events.tsx
│   ├── EventForm.tsx
│   ├── Teachings.tsx
│   ├── TeachingForm.tsx
│   ├── Login.tsx
│   └── Settings.tsx
├── services/         # API services
│   └── api.ts       # API client and endpoints
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── api.ts      # Axios configuration
└── styles.css      # Global styles with Tailwind
```

## Default Login

- Username: `admin`
- Password: `password`

## Usage

### Creating Events

1. Navigate to Events → Add Event
2. Fill in event details (title, description, date, time, location)
3. Upload an optional featured image
4. Set category and activation status
5. Save the event

### Managing Teachings

1. Navigate to Teachings → Add Teaching
2. Enter teaching content (title, description, full content)
3. Add author and scripture references
4. Set category and tags
5. Upload optional media (image/video)
6. Publish immediately or save as draft

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```
