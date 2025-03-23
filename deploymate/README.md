# Todo Application

A full-stack Todo application built with Next.js, React, and Prisma with PostgreSQL.

## Features

- Create, read, update, and delete todos
- Mark todos as completed
- RESTful API endpoints
- Responsive UI
- Dockerized for easy deployment
- CI/CD pipeline with Jenkins

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **CI/CD**: Jenkins, Docker
- **Deployment**: Docker, PM2

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Git

### Environment Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd todo-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/todo_app?schema=public"
   ```

4. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

### Development

Start the development server:
```
npm run dev
```

The application will be available at http://localhost:3000.

### Building for Production

Build the project:
```
npm run build
```

Start the production server:
```
npm start
```

### Docker Deployment

1. Build the Docker image:
   ```
   docker build -t todo-app .
   ```

2. Run the Docker container:
   ```
   docker run -p 3000:3000 -e DATABASE_URL=<your-db-url> todo-app
   ```

Or use Docker Compose:
```
docker-compose up -d
```

## CI/CD Setup with Jenkins

1. Install Jenkins on your server or use a Jenkins cloud provider
2. Create a new Pipeline job in Jenkins
3. Configure the job to use the provided Jenkinsfile
4. Set up the DATABASE_URL credential in Jenkins
5. Configure webhooks to trigger builds on code changes

## Folder Structure

```
├── prisma/             # Prisma schema and migrations
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── api/        # API routes
│   │   ├── components/ # React components
│   │   ├── page.tsx    # Home page
│   │   └── layout.tsx  # App layout
├── public/             # Static assets
├── .env                # Environment variables
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker configuration
├── Jenkinsfile         # Jenkins CI/CD pipeline
└── package.json        # Project dependencies
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a single todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## License

MIT
