import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not set in .env.local");
  process.exit(1);
}

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [{ title: String, videoUrl: String }],
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
}, { timestamps: true });

const courses = [
  {
    title: "Python for Beginners",
    description: "Learn Python from scratch. This course covers variables, data types, control flow, functions, file handling, and object-oriented programming. Perfect for anyone with zero programming experience who wants to build a strong foundation.",
    lessons: [
      { title: "Installing Python & Setting Up Your Environment", videoUrl: "" },
      { title: "Variables, Data Types & Operators", videoUrl: "" },
      { title: "Strings and String Methods", videoUrl: "" },
      { title: "Conditional Statements: if, elif, else", videoUrl: "" },
      { title: "Loops: for and while", videoUrl: "" },
      { title: "Functions and Parameters", videoUrl: "" },
      { title: "Lists, Tuples, and Dictionaries", videoUrl: "" },
      { title: "File Reading and Writing", videoUrl: "" },
      { title: "Error Handling with try/except", videoUrl: "" },
      { title: "Introduction to Object-Oriented Programming", videoUrl: "" },
    ],
  },
  {
    title: "Java Programming Masterclass",
    description: "A comprehensive Java course covering core concepts, OOP principles, collections framework, exception handling, multithreading, and building real-world applications. Ideal for aspiring software developers.",
    lessons: [
      { title: "Java Setup and Your First Program", videoUrl: "" },
      { title: "Primitive Data Types and Variables", videoUrl: "" },
      { title: "Control Flow: if-else, switch, loops", videoUrl: "" },
      { title: "Methods and Method Overloading", videoUrl: "" },
      { title: "Arrays and ArrayLists", videoUrl: "" },
      { title: "Object-Oriented Programming: Classes & Objects", videoUrl: "" },
      { title: "Inheritance and Polymorphism", videoUrl: "" },
      { title: "Interfaces and Abstract Classes", videoUrl: "" },
      { title: "Exception Handling", videoUrl: "" },
      { title: "Collections Framework: List, Set, Map", videoUrl: "" },
      { title: "File I/O and Serialization", videoUrl: "" },
      { title: "Introduction to Multithreading", videoUrl: "" },
    ],
  },
  {
    title: "C++ Fundamentals",
    description: "Master the fundamentals of C++ programming including pointers, memory management, classes, templates, and the Standard Template Library. A must for systems programming and competitive coding.",
    lessons: [
      { title: "C++ Environment Setup and Hello World", videoUrl: "" },
      { title: "Variables, Data Types, and Input/Output", videoUrl: "" },
      { title: "Operators and Expressions", videoUrl: "" },
      { title: "Control Structures: if, switch, loops", videoUrl: "" },
      { title: "Functions and Scope", videoUrl: "" },
      { title: "Arrays and Strings", videoUrl: "" },
      { title: "Pointers and References", videoUrl: "" },
      { title: "Dynamic Memory Allocation", videoUrl: "" },
      { title: "Classes and Objects", videoUrl: "" },
      { title: "Inheritance and Polymorphism in C++", videoUrl: "" },
      { title: "Templates and the STL", videoUrl: "" },
    ],
  },
  {
    title: "Data Structures & Algorithms",
    description: "Deep dive into essential data structures and algorithms. Learn arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and dynamic programming with hands-on coding problems.",
    lessons: [
      { title: "Big O Notation and Time Complexity", videoUrl: "" },
      { title: "Arrays and Two-Pointer Technique", videoUrl: "" },
      { title: "Linked Lists: Singly and Doubly", videoUrl: "" },
      { title: "Stacks and Queues", videoUrl: "" },
      { title: "Hash Tables and Hash Maps", videoUrl: "" },
      { title: "Trees and Binary Search Trees", videoUrl: "" },
      { title: "Tree Traversals: BFS and DFS", videoUrl: "" },
      { title: "Heaps and Priority Queues", videoUrl: "" },
      { title: "Graphs: Representation and Traversal", videoUrl: "" },
      { title: "Sorting Algorithms: Merge Sort, Quick Sort", videoUrl: "" },
      { title: "Searching Algorithms: Binary Search", videoUrl: "" },
      { title: "Recursion and Backtracking", videoUrl: "" },
      { title: "Dynamic Programming: Fundamentals", videoUrl: "" },
      { title: "Greedy Algorithms", videoUrl: "" },
    ],
  },
  {
    title: "JavaScript Essential Training",
    description: "Learn modern JavaScript from the ground up. Covers ES6+ syntax, DOM manipulation, asynchronous programming with Promises and async/await, closures, and building interactive web applications.",
    lessons: [
      { title: "JavaScript Basics: Variables and Data Types", videoUrl: "" },
      { title: "Operators and Type Coercion", videoUrl: "" },
      { title: "Functions: Declarations, Expressions, Arrow Functions", videoUrl: "" },
      { title: "Objects and Arrays", videoUrl: "" },
      { title: "DOM Manipulation", videoUrl: "" },
      { title: "Event Handling", videoUrl: "" },
      { title: "ES6+ Features: Destructuring, Spread, Rest", videoUrl: "" },
      { title: "Closures and Scope", videoUrl: "" },
      { title: "Promises and Async/Await", videoUrl: "" },
      { title: "Fetch API and Working with JSON", videoUrl: "" },
      { title: "Error Handling in JavaScript", videoUrl: "" },
    ],
  },
  {
    title: "SQL and Database Fundamentals",
    description: "Master SQL and relational database concepts. Learn to create tables, write queries, use joins, subqueries, aggregate functions, indexing, and database design principles with practical exercises.",
    lessons: [
      { title: "Introduction to Databases and SQL", videoUrl: "" },
      { title: "Creating Tables and Defining Schemas", videoUrl: "" },
      { title: "INSERT, UPDATE, DELETE Operations", videoUrl: "" },
      { title: "SELECT Queries and Filtering with WHERE", videoUrl: "" },
      { title: "Sorting and Limiting Results", videoUrl: "" },
      { title: "Aggregate Functions: COUNT, SUM, AVG, MAX, MIN", videoUrl: "" },
      { title: "GROUP BY and HAVING", videoUrl: "" },
      { title: "Joins: INNER, LEFT, RIGHT, FULL", videoUrl: "" },
      { title: "Subqueries and Nested Queries", videoUrl: "" },
      { title: "Indexes and Query Optimization", videoUrl: "" },
      { title: "Database Design and Normalization", videoUrl: "" },
    ],
  },
  {
    title: "Git and Version Control",
    description: "Learn professional version control with Git and GitHub. Covers branching, merging, rebasing, conflict resolution, pull requests, and collaborative workflows used in real development teams.",
    lessons: [
      { title: "What is Version Control and Why Git?", videoUrl: "" },
      { title: "Installing Git and Initial Configuration", videoUrl: "" },
      { title: "Creating Repositories: init and clone", videoUrl: "" },
      { title: "Staging, Committing, and Viewing History", videoUrl: "" },
      { title: "Branching and Merging", videoUrl: "" },
      { title: "Resolving Merge Conflicts", videoUrl: "" },
      { title: "Working with Remote Repositories", videoUrl: "" },
      { title: "Pull Requests and Code Reviews", videoUrl: "" },
      { title: "Rebasing vs Merging", videoUrl: "" },
      { title: "Git Workflow Strategies: GitFlow, Trunk-Based", videoUrl: "" },
    ],
  },
  {
    title: "Introduction to Algorithms with Python",
    description: "Solve real algorithmic problems using Python. This course bridges theory and practice with searching, sorting, graph algorithms, and step-by-step problem-solving strategies for coding interviews.",
    lessons: [
      { title: "Problem-Solving Approach and Pseudocode", videoUrl: "" },
      { title: "Linear Search and Binary Search", videoUrl: "" },
      { title: "Bubble Sort and Selection Sort", videoUrl: "" },
      { title: "Merge Sort and Quick Sort in Python", videoUrl: "" },
      { title: "Recursion: Concepts and Practice", videoUrl: "" },
      { title: "Stack and Queue Implementations", videoUrl: "" },
      { title: "Graph Algorithms: BFS and DFS in Python", videoUrl: "" },
      { title: "Shortest Path: Dijkstra's Algorithm", videoUrl: "" },
      { title: "Dynamic Programming Problems", videoUrl: "" },
      { title: "Coding Interview Tips and Patterns", videoUrl: "" },
    ],
  },
  {
    title: "Object-Oriented Programming Concepts",
    description: "Understand the four pillars of OOP — encapsulation, abstraction, inheritance, and polymorphism. Language-agnostic concepts with examples in Python and Java for building maintainable software.",
    lessons: [
      { title: "What is Object-Oriented Programming?", videoUrl: "" },
      { title: "Classes, Objects, and Constructors", videoUrl: "" },
      { title: "Encapsulation and Access Modifiers", videoUrl: "" },
      { title: "Abstraction: Abstract Classes and Interfaces", videoUrl: "" },
      { title: "Inheritance: Single, Multiple, Hierarchical", videoUrl: "" },
      { title: "Polymorphism: Overloading and Overriding", videoUrl: "" },
      { title: "Composition vs Inheritance", videoUrl: "" },
      { title: "SOLID Principles Overview", videoUrl: "" },
      { title: "Design Patterns: Singleton, Factory, Observer", videoUrl: "" },
      { title: "Building a Mini Project Using OOP", videoUrl: "" },
    ],
  },
  {
    title: "Linux Command Line for Developers",
    description: "Get comfortable with the Linux terminal. Learn essential commands, file system navigation, permissions, shell scripting, process management, and tools every developer needs to work in a Unix environment.",
    lessons: [
      { title: "Introduction to the Linux Terminal", videoUrl: "" },
      { title: "Navigating the File System: cd, ls, pwd", videoUrl: "" },
      { title: "File Operations: cp, mv, rm, mkdir", videoUrl: "" },
      { title: "Viewing Files: cat, less, head, tail", videoUrl: "" },
      { title: "File Permissions and Ownership", videoUrl: "" },
      { title: "Searching: grep, find, locate", videoUrl: "" },
      { title: "Pipes and Redirection", videoUrl: "" },
      { title: "Environment Variables and PATH", videoUrl: "" },
      { title: "Shell Scripting Basics", videoUrl: "" },
      { title: "Process Management: ps, top, kill", videoUrl: "" },
      { title: "Package Management: apt, yum, brew", videoUrl: "" },
    ],
  },
];

async function seedCourses() {
  await mongoose.connect(MONGO_URI as string);

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

  // Find the admin user to use as instructor
  const admin = await User.findOne({ email: "admin@test.com" });
  if (!admin) {
    console.error("Admin user not found. Run seed-admin.ts first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const courseData of courses) {
    const existing = await Course.findOne({ title: courseData.title });
    if (existing) {
      console.log(`  Skipped (already exists): ${courseData.title}`);
      skipped++;
      continue;
    }

    await Course.create({
      title: courseData.title,
      description: courseData.description,
      instructor: admin._id,
      lessons: courseData.lessons,
    });
    console.log(`  Created: ${courseData.title} (${courseData.lessons.length} lessons)`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seedCourses().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
