# Ecommerce Category Module

A production-style category management system built with Spring Boot and React, designed to model lifecycle-controlled entity management within an e-commerce platform.

Although scoped as a single module, the design mirrors real-world administrative systems where data integrity, lifecycle control, and predictable API contracts are essential.

---

## Overview

This module implements the complete lifecycle of product categories inside an e-commerce admin environment.

Key capabilities include:

* Server-driven pagination
* Lifecycle-based filtering (Active / Inactive / All)
* Soft-delete modeling (no hard deletes)
* Defensive update validation
* Structured API response envelopes
* Frontend-backend contract alignment

The implementation emphasizes clean layering, predictable behavior, and domain integrity rather than superficial feature breadth.

---

## Project Architecture

This module is split into two applications:

* `category-backend` - Spring Boot API for category lifecycle management
* `category-frontend` - React admin UI that consumes the backend contract

The backend follows a layered architecture:

* **Controller Layer** — Thin HTTP adapters
* **Service Layer** — Domain logic and validation
* **Repository Layer** — JPA persistence abstraction
* **Specification Layer** — Dynamic query composition

### Source Folder Structure

```text
# Backend src structure (Spring Boot)
category-backend/
└── src/
    ├── main/
    │   ├── java/com/namit/categorybackend/
    │   │   ├── CategoryBackendApplication.java   # Spring Boot entry point
    │   │   ├── category/
    │   │   │   ├── controller/                   # REST endpoints
    │   │   │   ├── dto/                          # Request/response models
    │   │   │   ├── entity/                       # JPA entities
    │   │   │   ├── mapper/                       # DTO/entity mapping
    │   │   │   ├── repository/                   # Data access abstraction
    │   │   │   ├── service/                      # Service contracts
    │   │   │   ├── service/impl/                 # Service implementations
    │   │   │   └── specification/                # Dynamic filter specifications
    │   │   ├── common/
    │   │   │   ├── exception/                    # Global and domain exceptions
    │   │   │   └── response/                     # API envelope and paged response
    │   │   └── config/                           # Web/OpenAPI configuration
    │   └── resources/
    │       └── application.properties            # Runtime configuration
    └── test/                                     # Backend tests
```

```text
# Frontend src structure (React + Vite)
category-frontend/
└── src/
    ├── api/
    │   └── axios.js                # Axios base client setup
    ├── components/
    │   ├── CategoryForm.jsx        # Create/edit form UI
    │   ├── CategoryTable.jsx       # Paginated table UI
    │   └── Modal.jsx               # Reusable modal component
    ├── pages/
    │   └── Category.jsx            # Category management page
    ├── services/
    │   └── categoryService.js      # Category API operations
    ├── assets/                     # Static assets
    ├── lib/                        # Shared frontend utilities
    ├── App.jsx                     # Root application component
    ├── main.jsx                    # React bootstrap
    └── index.css                   # Global styles
```

### Core Design Decisions

* Categories are never hard deleted.
* Lifecycle state is controlled via a boolean `status` field.
* Pagination is handled server-side to ensure scalability.
* Frontend UI strictly reflects backend rules (inactive categories cannot be edited).
* All API responses are wrapped in a consistent `ApiWrapper`.

---

## Backend (`category-backend`)

### Lifecycle Management

Categories support a complete lifecycle:

* Creation with uniqueness validation
* Update with conditional duplicate checks
* Soft delete (`status = false`)
* Explicit status toggling (`active ↔ inactive`)
* Filtered retrieval by lifecycle state

Inactive records remain persisted and auditable.

### Filtering and Pagination

Endpoint supports:

```
GET /api/v1/categories?page=0&size=10&status=active
```

Supported `status` values:

* `active` (default)
* `inactive`
* `all`

Filtering is implemented using the JPA Specification pattern to allow extensibility without repository method explosion.

### API Response Structure

All responses follow a standard envelope:

```json
{
  "status": "success",
  "message": "Categories retrieved successfully",
  "data": {
    "content": [...],
    "totalElements": 12,
    "totalPages": 2,
    "number": 0,
    "size": 10
  }
}
```

### Error Handling

Centralized exception handling covers:

* `400` — Validation errors
* `404` — Resource not found
* `409` — Duplicate resource conflict
* `500` — Unexpected server errors

### Technologies

* Java 17
* Spring Boot 3.x
* Spring Data JPA
* MySQL
* Jakarta Validation
* Springdoc OpenAPI
* Maven

---

## Frontend (`category-frontend`)

The React admin interface integrates directly with the paginated API contract.

### Features

* Paginated category listing
* Active / Inactive / All filter dropdown
* Responsive data table
* Skeleton loading state
* Empty state handling
* Modal-based Create and Edit forms
* Client-side + server-side validation mapping
* Toast notifications for action feedback
* Disabled Edit button for inactive categories
* Confirmation flow for status toggling

### Frontend Architecture

* Axios-based service layer abstraction
* `react-hook-form` for controlled form state
* Tailwind CSS utility styling
* Strict alignment with backend lifecycle rules

### Technologies

* React 19
* Vite 7
* Tailwind CSS 4
* Axios
* react-hook-form
* Sonner (toast notifications)
* lucide-react (icons)

---

## Database Model

**Table:** `categories`

| Column        | Type         | Notes                               |
| ------------- | ------------ | ----------------------------------- |
| category_id   | bigint       | Primary key, auto increment         |
| category_name | varchar(100) | Required, unique                    |
| description   | varchar(300) | Optional                            |
| created_at    | timestamp    | Auto-set on create                  |
| updated_at    | timestamp    | Auto-set on update                  |
| status        | boolean      | `true` = active, `false` = inactive |

Soft delete ensures historical integrity and prevents accidental data loss.

---

## API Endpoints

Base URL: `http://localhost:8080/api/v1`

| Method | Endpoint                                   | Description                          |
| ------ | ------------------------------------------ | ------------------------------------ |
| POST   | `/categories`                              | Create category                      |
| GET    | `/categories?page=0&size=10&status=active` | Paginated list with lifecycle filter |
| GET    | `/categories/{id}`                         | Retrieve active category by ID       |
| PUT    | `/categories/{id}`                         | Update category                      |
| DELETE | `/categories/{id}`                         | Soft delete category                 |
| PATCH  | `/categories/{id}/toggle`                  | Toggle category status               |

---

## Local Development Setup

### Prerequisites

* Java 17+
* MySQL 8+
* Node.js (LTS)
* npm
* Maven

---

### Backend Setup

```
cd category-backend
```

Configure `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/your_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

Run:

```
mvnw.cmd spring-boot:run
```

Backend URL:

```
http://localhost:8080
```

Swagger UI:

```
http://localhost:8080/swagger-ui/index.html
```

---

### Frontend Setup

```
cd category-frontend
```

Create `.env.local`:

```
VITE_API_URL_LOCAL=http://localhost:8080/api/v1
```

Run:

```
npm install
npm run dev
```

Frontend dev server:

```
http://localhost:5173
```

---

## Design Rationale

**Why soft delete?**
Hard deletes were avoided to preserve referential integrity and allow safe lifecycle transitions in an e-commerce environment.

**Why server-side pagination?**
To ensure predictable performance as the dataset grows.

**Why Specification pattern?**
To enable dynamic filtering without proliferating repository methods.

**Why disable Edit for inactive categories?**
To ensure UI state reflects backend domain rules, preventing inconsistent user interactions.

---

## Current Status

This module demonstrates:

* Clean layered architecture
* Lifecycle-based domain modeling
* Contract-driven frontend integration
* Defensive validation patterns
* Structured error handling
* API documentation discipline


---

Built as part of a structured e-commerce system design exercise and internship engagement.
