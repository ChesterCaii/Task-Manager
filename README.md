# Task Manager Pro

A full-stack task management application with advanced features built with Next.js, React, and PostgreSQL.

![Task Manager Pro](https://i.imgur.com/yUuHg3d.png)

## ✨ Features

- **Modern UI/UX Design** with responsive layout and animations
- **Dark/Light Mode** with system preference detection
- **Advanced Task Management**
  - Priority levels (high, medium, low)
  - Due dates with overdue detection
  - Task categories with custom tags
  - Subtasks support
- **Interactive Dashboard** with task analytics and statistics
- **Keyboard Shortcuts** for improved productivity
- **Search & Filtering** capabilities
- **Confirmation Dialogs** for important actions

## 🚀 Tech Stack

- **Frontend**: React.js, Next.js, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker with CI/CD pipeline via Jenkins

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChesterCaii/Task-Manager.git
   cd Task-Manager/deploymate
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables:
   ```
   # Create a .env file with the following
   DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

- **Add Tasks**: Fill out the form at the top of the page
- **Complete Tasks**: Click the checkbox next to a task
- **Edit Tasks**: Click the edit icon on any task
- **Delete Tasks**: Click the trash icon (confirmation required)
- **Filter Tasks**: Use the toolbar to filter by status or priority
- **Search Tasks**: Use the search bar to find specific tasks
- **View Analytics**: Toggle the analytics dashboard
- **Keyboard Shortcuts**: Press `?` to view available shortcuts

## 🐳 Docker Deployment

The application includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 👨‍💻 Development

This project uses Next.js with TypeScript. The codebase is structured as follows:

- `/src/app`: Main application code
  - `/api`: API routes for backend functionality
  - `/components`: Reusable React components
  - `/globals.css`: Global styles
  - `/page.tsx`: Main page component

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Built with Next.js and React
- Styled with TailwindCSS
- Database managed with Prisma
- Icons from various open source libraries 