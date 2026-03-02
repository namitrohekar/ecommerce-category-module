# Ecommerce Category and Product Module

A production-style e-commerce admin/customer module built with Spring Boot and React.  
It focuses on lifecycle-safe category and product management, server-side pagination, and clean API contracts.

## Progress Update (March 2, 2026)

- Product Management module is now implemented end-to-end (backend + admin UI + public UI).
- Category deactivation now supports product reassignment:
  - move to a selected active category, or
  - move to auto-managed `Uncategorized`.
- Admin routes now include dashboard, products, and categories.
- Public side now includes landing page, product listing, and light/dark theme toggle.
- Existing category lifecycle flows remain active (create, update, toggle, soft-delete behavior).

## Live Deployment

- Frontend: `https://ecommerce-category-module.vercel.app`
- Admin: `https://ecommerce-category-module.vercel.app/admin`
- Backend: `https://category-backend-4q0p.onrender.com`
- Swagger UI: `https://category-backend-4q0p.onrender.com/swagger-ui/index.html`
- OpenAPI JSON: `https://category-backend-4q0p.onrender.com/v3/api-docs`

Note: Render free-tier cold start may take about 60-90 seconds on first request.

## Module Scope

### Category Management

- Create, update, list, and lifecycle toggle (Active/Inactive)
- Server-side pagination and status filtering (`active`, `inactive`, `all`)
- Product count endpoint for safe deactivation flows
- Reassignment enforcement before category deactivation

### Product Management

- Create, update, list, and lifecycle toggle (Active/Inactive)
- SKU uniqueness enforcement
- Active-category-only assignment during create/update
- Admin listing with server-side pagination and status filter
- Public listing endpoint that returns active products only

### Frontend Experience

- Admin pages:
  - `/admin` (dashboard)
  - `/admin/products`
  - `/admin/categories`
- Public pages:
  - `/`
  - `/products`
- Modal-based create/edit forms
- Toast feedback + validation mapping from backend errors
- Theme toggle (light/dark)

## Architecture

- `category-backend`: Spring Boot REST API (layered design)
- `category-frontend`: React + Vite client (admin + customer views)

Backend layers:

- Controller: HTTP endpoints
- Service: business rules
- Repository: JPA persistence
- Specification: dynamic filtering
- Common: API envelope + global exception handling

## Project Structure

```text
ecommerce-category-module/
|- category-backend/                                # Spring Boot API
|  |- src/main/java/com/namit/categorybackend/      # Backend source root
|  |  |- category/                                  # Category domain module
|  |  |  |- controller/                             # Category endpoints
|  |  |  |- dto/                                    # Category request/response DTOs
|  |  |  |- entity/                                 # Category JPA entities
|  |  |  |- mapper/                                 # Category mappers
|  |  |  |- repository/                             # Category repositories
|  |  |  |- service/                                # Category business logic
|  |  |  `- specification/                          # Category dynamic filters
|  |  |- product/                                   # Product domain module
|  |  |  |- controller/                             # Product endpoints
|  |  |  |- dto/                                    # Product request/response DTOs
|  |  |  |- entity/                                 # Product JPA entities
|  |  |  |- mapper/                                 # Product mappers
|  |  |  |- repository/                             # Product repositories
|  |  |  |- service/                                # Product business logic
|  |  |  `- specification/                          # Product dynamic filters
|  |  |- common/                                    # Shared backend utilities
|  |  |  |- exception/                              # Global/custom exceptions
|  |  |  `- response/                               # API envelope + page wrapper
|  |  `- config/                                    # CORS/OpenAPI/app config
|  |- src/main/resources/                           # Properties and resources
|  `- pom.xml                                       # Maven build config
`- category-frontend/                               # React + Vite app
   |- src/                                          # Frontend source root
   |  |- api/                                       # Axios base client
   |  |- services/                                  # API service functions
   |  |  |- categoryService.js
   |  |  `- productService.js
   |  |- pages/                                     # Route-level pages
   |  |  |- Category.jsx                            # Admin categories page
   |  |  |- AdminProducts.jsx                       # Admin products page
   |  |  |- PublicProducts.jsx                      # Customer product listing
   |  |  |- AdminDashboard.jsx                      # Admin landing page
   |  |  `- Landing.jsx                             # Public home page
   |  |- components/                                # Reusable UI blocks
   |  |  |- CategoryForm.jsx
   |  |  |- CategoryTable.jsx
   |  |  |- CategoryReassignModal.jsx
   |  |  |- ProductForm.jsx
   |  |  |- ProductTable.jsx
   |  |  |- Modal.jsx
   |  |  `- ThemeToggle.jsx
   |  |- layouts/                                   # Admin/customer shells
   |  |  |- AdminLayout.jsx
   |  |  `- CustomerLayout.jsx
   |  |- App.jsx                                    # Route map
   |  |- main.jsx                                   # App bootstrap
   |  `- index.css                                  # Theme + global styles
   `- package.json                                  # Frontend scripts/deps
```

## API Overview

Base URL (Local): `http://localhost:8080/api/v1`  
Base URL (Production): `https://category-backend-4q0p.onrender.com/api/v1`

### Category Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/categories` | Create category |
| GET | `/categories?page=0&size=10&status=active` | Paginated list with lifecycle filter |
| GET | `/categories/{id}` | Get category by id (active lookup) |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Soft delete category (supports reassignment body) |
| PATCH | `/categories/{id}/toggle` | Toggle category status (supports reassignment body) |
| GET | `/categories/{id}/product-count` | Count products in category |

Reassignment request body (optional on delete/toggle):

```json
{
  "reassignCategoryId": 12
}
```

If omitted/null and products exist, backend reassigns to `Uncategorized`.

### Product Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/products` | Create product |
| GET | `/products?page=0&size=10&status=active` | Admin list with lifecycle filter |
| GET | `/products/{id}` | Get product by id |
| PUT | `/products/{id}` | Update active product |
| PATCH | `/products/{id}/toggle` | Toggle product status |
| GET | `/products/public?page=0&size=12` | Public active-only product listing |

## Data Model

### `categories`

- `category_id` (PK)
- `category_name` (unique)
- `description`
- `created_at`, `updated_at`
- `status` (`true` active, `false` inactive)

### `products`

- `product_id` (PK)
- `product_name`
- `description`
- `price`
- `sku` (unique)
- `inventory_count`
- `category_id` (FK -> `categories.category_id`)
- `created_at`, `updated_at`
- `status` (`true` active, `false` inactive)

## Tech Stack

- Backend: Java 17, Spring Boot 4, Spring Data JPA, MySQL, Jakarta Validation, Springdoc OpenAPI
- Frontend: React 19, Vite 7, Tailwind CSS 4, Axios, react-hook-form, react-router-dom, Sonner

## Local Setup

### Prerequisites

- Java 17+
- Maven
- MySQL 8+
- Node.js LTS + npm

### Backend

```bash
cd category-backend
mvnw.cmd spring-boot:run
```

Configure datasource values in your active Spring profile (for example `application.properties` / `application-dev.properties`) before run.

### Frontend

```bash
cd category-frontend
npm install
```

Create `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Run:

```bash
npm run dev
```

## Current Status

- Category module: implemented
- Product module: implemented
- Admin UI: implemented
- Public product listing: implemented
- Production deployments: active

Built as part of a structured e-commerce system design and internship submission.
