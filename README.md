# CRM File System Service

A file and document management microservice within the CRM ecosystem responsible for secure file uploads, storage tracking, and document lifecycle management. This service provides centralized document handling for all CRM users and clients.

## Overview

The CRM File System Service manages the upload, retrieval, and deletion of user documents within the CRM platform. It enforces per-client storage quotas, organizes files into hashed directory structures for security, and integrates with other CRM services (such as lead management) to maintain document references across the system.

## Key Features

- **Secure File Uploads** — Upload documents with Multer, stored in MD5-hashed directory structures per client and user
- **Storage Quota Enforcement** — Tracks cumulative file sizes per client and enforces configurable storage limits (default: 100 MB per client)
- **Document CRUD Operations** — Create, retrieve, and soft-delete documents via RESTful API
- **Database Migrations** — Schema management with db-migrate for the `user_documents` table
- **Cross-Service Integration** — Communicates with the Lead Management service to synchronize document deletions
- **Static File Serving** — Uploaded files are served statically via the `/uploads` route
- **Paginated Listing** — Support for paginated document retrieval

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **File Upload:** Multer
- **Database:** MySQL (mysql2 with promise support)
- **Migrations:** db-migrate-mysql
- **Hashing:** MD5 (for directory naming)
- **HTTP Client:** Axios
- **Environment Config:** dotenv

## API Endpoints

All document endpoints are prefixed with `/api/documents`.

| Method | Endpoint                     | Description                              |
|--------|------------------------------|------------------------------------------|
| GET    | `/`                          | Health check                             |
| GET    | `/api/documents/:id`         | Retrieve a document by ID                |
| POST   | `/api/documents/`            | Upload a new document                    |
| DELETE | `/api/documents/delete/:id`  | Soft-delete a document by ID             |

### Upload Request

**POST `/api/documents/`** (multipart/form-data)

| Field              | Type   | Required | Description              |
|--------------------|--------|----------|--------------------------|
| `document_name`    | File   | Yes      | The file to upload       |
| `user_id`          | String | Yes      | ID of the uploading user |
| `client_id`        | String | Yes      | ID of the client/tenant  |
| `document_details` | String | No       | Description of the file  |

## Prerequisites

- Node.js (v14 or higher)
- MySQL server

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mhmalvi/CRM-File-System.git
   cd CRM-File-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```

   ```env
   PORT=5000
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=files_server
   DB_USERNAME=root
   DB_PASSWORD=your_password
   LEAD_SERVICES=your_lead_service_host
   ```

4. **Run database migrations:**
   ```bash
   npx db-migrate up
   ```

5. **Start the service:**
   ```bash
   npm start
   ```

   The service will start on the configured `PORT`.

## Database Schema

### `user_documents` Table

| Column            | Type     | Description                               |
|-------------------|----------|-------------------------------------------|
| `id`              | INT (PK) | Auto-increment primary key               |
| `user_id`         | INT      | Associated user ID                       |
| `client_id`       | INT      | Associated client/tenant ID              |
| `document_name`   | TEXT     | File path on disk                        |
| `document_details`| TEXT     | File description                         |
| `file_sizes`      | INT      | File size in bytes                       |
| `deleted_by`      | INT      | User who deleted the document            |
| `created_at`      | DATETIME | Record creation timestamp                |
| `updated_at`      | DATETIME | Last update timestamp                    |
| `status`          | INT      | Active (1) or deleted (0)                |

## Project Structure

```
CRM-File-System/
├── index.js                # Application entry point
├── config.js               # Database and app configuration
├── helper.js               # Utility functions
├── database.json           # db-migrate configuration
├── migrations/             # Database migration files
├── routes/
│   ├── userDocuments.js    # Document upload/download routes
│   └── programmingLanguages.js  # Resource management routes
├── services/
│   ├── db.js               # Database connection pool
│   ├── userDocuments.js    # Document business logic
│   └── programmingLanguage.js  # Resource service logic
└── uploads/                # File storage directory
```

## Architecture

This service is part of a larger **CRM microservices architecture**. It acts as the centralized file storage layer that other CRM services reference when users attach documents to leads, invoices, or other CRM records. It communicates with the Lead Management service for document reference cleanup and can be deployed and scaled independently.

## License

ISC
