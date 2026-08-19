# 🚀 Full-Stack Developer Portfolio & CMS

A modern, production-grade, and dynamic personal developer portfolio application with a comprehensive administrative management dashboard. Built with **Spring Boot 3 (Java 17/21)**, **React 18 (Vite + Tailwind CSS)**, **Cloud MySQL (Aiven)**, **JWT Authentication**, and **Cloudinary CDN**.

---

## 📸 Tech Stack

### Backend
- **Framework**: Spring Boot 3.3 (Java 17/25)
- **Security**: Spring Security 6 with stateless JWT Authentication (Access + Refresh Token)
- **Database**: MySQL 8 with Spring Data JPA & Hibernate
- **Caching**: Caffeine Cache for high-performance sub-millisecond responses
- **Media Management**: Cloudinary CDN Integration with local storage fallback
- **API Documentation**: OpenAPI 3.0 / Swagger UI
- **Deployment**: Dockerized on Render

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & Modern CSS Design System (Glassmorphism, Dark Mode)
- **State Management**: Context API with Custom Hooks
- **Icons**: Lucide React
- **Deployment**: Vercel (SPA with dynamic client-side routing)

---

## ✨ Key Features

- ⚡ **Dynamic CMS Dashboard**: Complete admin panel to edit Hero profile, Orbit elements, Skills, Experience, Education, and Projects on the fly.
- 🎯 **Granular Skill Management**: Add, update in-place, delete individual skills or manage entire skill categories dynamically.
- 🖼️ **Media & Resume Upload**: Integrated Cloudinary CDN storage for profile photos and downloadable PDF resumes.
- 📬 **Interactive Contact System**: Visitor message submission with rate limiting and unread message management.
- 🔒 **Enterprise-Grade Security**: BCrypt password hashing, JWT authentication filter, CORS protection, and input validation.

---

## 🛠️ Getting Started Locally

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- MySQL Database

### 1. Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🚢 Deployment Architecture

```
[React Frontend] (Vercel) ──► [Spring Boot REST API] (Render Docker) ──► [Aiven Cloud MySQL]
                                        │
                                        ▼
                                [Cloudinary CDN]
```
