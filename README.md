# Book API

This is a RESTful API built with Express and MongoDB that allows users to manage books, authors, and categories. It supports functionalities such as creating, updating, deleting, and retrieving books and authors. Additionally, it provides sorting, filtering, and pagination capabilities.

## Features

- **Book Management**: Create, Read, Update, and Delete (CRUD operations) for books.
- **Author Management**: Create, Read, Update, and Delete (CRUD operations) for authors.
- **Category Management**: Support for categorizing books.
- **Authentication**: Token-based authentication using JWT (JSON Web Token).
- **Validation**: Input validation with Express-validator.
- **Sorting & Filtering**: Books can be filtered and sorted by categories, authors, and other fields.
- **Pagination**: Supports pagination for listing books and authors.

## Technologies Used

- Node.js
- Express.js
- MongoDB / Mongoose
- JWT (JSON Web Token)
- CryptoJS (for password encryption)
- Express-validator
- Jest (for testing)

## Installation

1. Clone the repository:

```bash
   git clone https://github.com/truthixify/api/book-api.git
```

1. Install dependencies:

```bash
   cd book-api
   npm install
```

1. Create a .env file in the root directory and add the following variables:

```bash
   JWT_SEC=your_jwt_secret
   PASSWORD_SEC=your_password_secret
   MONGODB_URI=mongodb+srv://<username>:<password>@beyondthebasics.abcde.mongodb.net/
```

1. Start the application:

```bash
   npm start
```

The app will run on http://localhost:3000.

## API Endpoints

### 1. Health Check Route

**GET /api/health-check**

- Check server health.

### 2. Auth Routes

**POST /api/register**

- Create a new user.
- Body parameters:
  - username: String (required)
  - email: String (required)
  - password: String (required)

**POST /api/login**

- Login an existing user and return a JWT token.
- Body parameters:
  - username: String (required)
  - password: String (required)

### 3. Book Routes

**POST /api/book**

- Create a new book.
- Body parameters:
  - title: String (required)
  - description: String (required)
  - author: ObjectId (required)
  - categories: [String] (required)
  - - publicationYear: Number (required),
  - isn: String (required)

**GET /api/book**

- Get a list of books with optional query parameters for filtering and sorting.
- Query parameters:
  - author: String (filter by author)
  - category: String (filter by category)
  - sort: String (e.g., title:asc or createdAt:desc)
  - page: Integer (pagination page)
  - limit: Integer (pagination limit)

**GET /books/:id**

- Get a specific book by ID.

**PUT /books/:id**

- Update an existing book by ID.
- Body parameters:
  - title: String (optional)
  - description: String (optional)
  - author: ObjectId (optional)
  - categories: [String] (optional)
  - publicationYear: Number (optional),
  - isn: String (optional)

**DELETE /books/:id**

- Delete a book by ID.

### 4. Author Routes

**POST /api/author/**

- Update an author by ID.
- Body parameters:
  - name: String (required)
  - biography: String (required)

**GET /api/author**

- Get a list of all authors.

**GET /api/author/:id**

- Get details of a specific author by ID.

**PUT /api/author/:id**

- Update an author by ID.
- Body parameters:
  - name: String (optional)
  - biography: String (optional)

**DELETE /api/author/:id**

- Delete an author by ID.

### 5. Category Routes

**POST /api/category**

- Create a new category.
- Body parameters:
  - name: String (required)

**GET /api/category**

- Get a list of all categories.

**GET /api/category/:id**

- Get details of a specific category by ID.

**PUT /api/category/:id**

- Update a category by ID.
- Body parameters:
  - name: String (optional)

**DELETE /api/category/:id**

- Delete a category by ID.

## Testing

To run tests, use the following command:

```bash
    npm test
```

Make sure you've started the mongodb compass database before running the test.
