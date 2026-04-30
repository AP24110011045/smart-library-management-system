# Smart Library Management System
A full-stack MERN Smart Library Management System built with React, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, role-based access, and demonstrable data structure logic.
---
##  Project Overview
This application simulates a real-world library system with separate student and admin experiences.
* Students can search, borrow, and return books
* Admins can manage books and monitor transactions
* The system uses Data Structures for efficient operations
The system provides separate dashboards for Admin and Students with role-based access control.
---
##  Features
##  Student Features
* Register and log in with email and password
* Search books by title, author, category, ISBN
* Autocomplete search (Trie)
* Borrow books
* Join waiting queue if unavailable
* Return books
* View borrowing history and fines
---
###  Admin Features
* Add, edit, delete books
* Monitor transactions
* View overdue books
* Dashboard analytics
* Undo last edit/delete (Stack)
* User lookup
* Book recommendations (Graph)
---
##  Technologies Used

| Category  | Technologies                               |
| --------- | ------------------------------------------ |
| Languages | JavaScript, JSX, HTML, CSS, JSON, Markdown |
| Frontend  | React, Vite, Tailwind CSS, Axios           |
| Backend   | Node.js, Express.js, JWT, bcrypt           |
| Database  | MongoDB, Mongoose                          |
---

## Data Structures Used

| Data Structure | File                          | Purpose             |
| -------------- | ----------------------------- | ------------------- |
| Stack          | `server/dsa/Stack.js`         | Undo admin actions  |
| Queue          | `server/dsa/Queue.js`         | Waiting list system |
| Trie           | `server/dsa/Trie.js`          | Autocomplete search |
| BST            | `server/dsa/BookBST.js`       | Fast book lookup    |
| Graph          | `server/dsa/CategoryGraph.js` | Recommendations     |
| HashMap        | `server/dsa/libraryIndex.js`  | User lookup         |

---
##  How the System Works
1. User logs in
2. Searches books (Trie + BST)
3. Borrows book
4. If unavailable → added to Queue
5. Returns book → fine calculated
6. Admin monitors system
7. Undo feature via Stack
---
#  Project Report
## 1. Introduction
The **Smart Library Management System** is a MERN-based application designed to digitalize library operations. It integrates Data Structures like Stack, Queue, Trie, BST, Graph, and HashMap to improve efficiency.
---
## 2. Objective
* Digitalize library operations
* Apply real-world data structures
* Provide admin & student interfaces
* Improve search and performance
---
## 3. System Overview
### Student
* Search, borrow, return books
* Track history
### Admin
* Manage books
* Monitor system
* Undo actions
Architecture:
* React (Frontend)
* Node.js + Express (Backend)
* MongoDB (Database)
---
## 4. Technologies Used
* JavaScript, JSX, HTML, CSS
* React, Node.js, Express
* MongoDB
* JWT, bcrypt
---
## 5. Functionalities
### Student
* Register/login
* Search
* Borrow/return
* View history
### Admin
* Manage books
* Monitor transactions
* Undo actions
---
## 6. Data Structures Used
* Stack → Undo actions
* Queue → Waiting list
* Trie → Autocomplete
* BST → Fast search
* Graph → Recommendations
* HashMap → User lookup
---
## 7. Working of System
* Login → Search → Borrow → Return
* Queue handles waiting
* Stack handles undo
---
## 8. Architecture
* Presentation → React
* Backend → Express
* Database → MongoDB
---
## 9. Security
* JWT authentication
* bcrypt password hashing
* Role-based access
---
## 10. Error Handling
* 400, 401, 403, 404, 500 status codes
---
## 11. Advantages
* Efficient search
* Real-time tracking
* Scalable
---
## 12. Limitations
* No email notifications
* Limited analytics
---
## 13. Future Enhancements
* Email alerts
* Payment system
* Mobile app
---
## 14. Conclusion
This project demonstrates integration of Data Structures with full-stack development for real-world applications.
---
##  Project Structure
```text
root/
  client/
  server/
  README.md
```
---
##  Setup Instructions
### Install Dependencies

```bash
cd server
npm install

cd client
npm install
```
---
### Configure Environment

```bash
cd server
copy .env.example .env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
```
---
### Run Backend
```bash
cd server
npm run dev
```
---
### Run Frontend

```bash
cd client
npm start
```
---
### Open in Browser

```text
http://localhost:3000
```
## Setup Instructions
### Quick Start (Recommended)

cd server  
npm install  
copy .env.example .env  
npm run dev  

cd client  
npm install  
npm start  
### Detailed Steps
(keep your existing install + env + run sections)
##  Security Features

* JWT authentication
* bcrypt password hashing
* Role-based access

---
##  Error Handling
* 400 → Bad Request
* 401 → Unauthorized
* 403 → Forbidden
* 404 → Not Found
* 500 → Server Error
---
##  Sample Credentials
* Admin: [admin@library.com](mailto:admin@library.com) / password123
* Student: [student@library.com](mailto:student@library.com) / password123
  You can also register a new student account using the Register page and log in with your own credentials.
---
##  DSA Justification
This project implements Stack, Queue, Trie, BST, Graph, and HashMap to optimize performance and demonstrate practical applications of Data Structures.

---

 
