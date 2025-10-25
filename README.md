# 🎭 MoodBlog

A modern, full-stack social media application for sharing thoughts and emotions through mood-based posts. Built with Next.js 15, Prisma, PostgreSQL, and TypeScript.

## ✨ Features

### 🎨 Core Functionality
- **Mood-Based Posts**: Express yourself through 8 different moods (Happy, Sad, Angry, Excited, Calm, Anxious, Lonely, Amused)
- **Rich Content**: Text posts with optional image uploads via Cloudinary
- **Social Interactions**: Like posts and engage with nested comments (Instagram-style)
- **User Profiles**: Customizable profiles with mood statistics and post history
- **Real-time Updates**: Optimistic UI updates for seamless user experience

### 🔐 Authentication & Security
- **NextAuth Integration**: Secure email/password authentication
- **Password Reset**: Email-based OTP verification system
- **Protected Routes**: Server-side session management
- **Permanent Usernames**: Username locked after creation for security

### 💬 Advanced Comments System
- **Nested Comments**: Up to 3 levels of nested replies
- **Collapsible Threads**: Instagram-style "View/Hide Replies" functionality
- **Delete Protection**: Confirmation modals prevent accidental deletions
- **Real-time Counts**: Live comment and like counters

### 🎭 Mood Dashboard
- **Mood Filtering**: View posts by specific moods
- **Mood Analytics**: Track your most common moods
- **Dynamic Navigation**: Express button adapts to current mood
- **Beautiful Gradients**: Each mood has unique color schemes

### 📱 Responsive Design
- **Mobile-First**: Optimized for devices from 320px to 4K
- **Touch-Optimized**: 40px+ touch targets for accessibility
- **Adaptive Layout**: Breakpoints at 640px (sm), 768px (md), 1024px (lg)
- **Professional UI**: Dark theme with zinc-900 cards and gradient accents

### ⚡ Performance & UX
- **Optimistic Updates**: Instant UI feedback before server confirmation
- **Efficient Queries**: Prisma `_count` selects reduce payload by 70%
- **Code Splitting**: Next.js 15 automatic optimization
- **Smooth Animations**: Framer Motion for polished interactions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.1 (App Router)
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.11
- **State Management**: Zustand 5.0.8
- **Animations**: Framer Motion 12.23.24
- **Forms**: React Hook Form 7.60.0 + Zod 4.0.5
- **UI Components**: Custom components with Lucide React icons

### Backend
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.12.0
- **Authentication**: NextAuth 4.24.11
- **File Upload**: Cloudinary 2.7.0
- **Email**: Nodemailer 6.10.1
- **API**: Next.js API Routes


## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- pnpm (recommended) or npm
- PostgreSQL database (or Neon account)
- Cloudinary account (for image uploads)
- SMTP email service (Gmail recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sharath-Devadiga/MoodBlog.git
   cd MoodBlog
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-min-32-characters
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM="MoodBlog <your-email@gmail.com>"
   ```

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm prisma migrate deploy
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.


```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

**Built with ❤️ by Sharath Devadiga**

⭐ Star this repo if you find it helpful!
