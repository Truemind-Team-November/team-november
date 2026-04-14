# TalentFlow - Learning Management System (Backend)

TalentFlow is a scalable Learning Management System (LMS) API built with .NET 8 using Clean Architecture.

It provides core learning platform functionality including authentication, course management, assignments, progress tracking, and certificate issuance.

## Tech Stack

- .NET 8 (ASP.NET Core)
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- FluentValidation
- SMTP Email Service
- Docker

## Architecture

This project follows Clean Architecture:

**API → Infrastructure → Application → Domain**

### Layers

- **Domain** → Core entities and business rules
- **Application** → Services, DTOs, interfaces
- **Infrastructure** → Database, repositories, external services
- **API** → Controllers and endpoints

## Features

### Authentication & Users
- User registration & login
- JWT-based authentication
- Role-based access (Admin, Instructor, Learner)
- Secure password reset (token-based via email)

### Learning System
- Course creation and enrollment
- Assignments and submissions
- Grading system
- Progress tracking

### Certificates
- Automatic certificate issuance
- Score-based eligibility

### Email System
- Password reset emails
- Extensible email templates

## Getting Started

### Clone the project

git clone <your-repo-url>
cd Backend

### Run with Docker

docker-compose up --build

### Run locally

dotnet restore
dotnet ef database update --project LMS.Infrastructure --startup-project LMS.Api
dotnet run --project LMS.Api

## Configuration

Set these in `appsettings.json` or environment variables:

### Database

"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=lmsdb;Username=postgres;Password=your_password"
}

### JWT

"Jwt": {
  "Secret": "your_secret_key",
  "Issuer": "lms",
  "Audience": "lms-users"
}

### Email (SMTP)

"Email": {
  "SmtpHost": "smtp.gmail.com",
  "Port": 587,
  "Username": "your-email@gmail.com",
  "Password": "your-app-password",
  "From": "your-email@gmail.com"
}

### Frontend URL

"App": {
  "FrontendUrl": "http://localhost:3000"
}

## API Documentation

Swagger available at:

http://localhost:5000/swagger

## Authentication Flow

1. User registers or logs in
2. Receives JWT token
3. Uses token for protected endpoints

### Password Reset

1. User requests reset
2. Secure token is generated and stored (hashed)
3. Email sent with reset link
4. User resets password via frontend
5. Token becomes invalid after use

## Project Structure

- **LMS.Domain** → Entities & enums
- **LMS.Application** → Business logic
- **LMS.Infrastructure** → Data & external services
- **LMS.Api** → Controllers & endpoints

## Highlights

- Clean Architecture implementation
- Secure password reset (hashed tokens + expiration)
- Background service for token cleanup
- Role-based authorization

## Future Improvements

- Unit & integration testing
- API versioning
- Caching
- Real-time notifications
- Structured Logging
