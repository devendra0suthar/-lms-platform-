import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// Course Schema
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [{
    title: String,
    videoUrl: String,
  }],
}, { timestamps: true });

// Quiz Schema
const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  title: String,
  description: String,
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
  }],
  passingScore: { type: Number, default: 70 },
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const courses = [
  {
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more. This comprehensive course takes you from beginner to professional web developer with hands-on projects and real-world examples.",
    lessons: [
      {
        title: "Introduction to Web Development",
        videoUrl: "https://www.youtube.com/watch?v=ysEN5RaKOlA"
      },
      {
        title: "HTML Fundamentals - Structure of Web Pages",
        videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE"
      },
      {
        title: "CSS Basics - Styling Your Website",
        videoUrl: "https://www.youtube.com/watch?v=1PnVor36_40"
      },
      {
        title: "CSS Flexbox & Grid Layout",
        videoUrl: "https://www.youtube.com/watch?v=JJSoEo8JSnc"
      },
      {
        title: "JavaScript Fundamentals",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk"
      },
      {
        title: "JavaScript DOM Manipulation",
        videoUrl: "https://www.youtube.com/watch?v=5fb2aPlgoys"
      },
      {
        title: "Introduction to React.js",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0"
      },
      {
        title: "React Hooks & State Management",
        videoUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q"
      },
      {
        title: "Node.js & Express Basics",
        videoUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE"
      },
      {
        title: "Building REST APIs with Node.js",
        videoUrl: "https://www.youtube.com/watch?v=pKd0Rpw7O48"
      }
    ],
    quiz: {
      title: "Web Development Fundamentals Quiz",
      description: "Test your knowledge of HTML, CSS, JavaScript and web development concepts",
      questions: [
        {
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
          ],
          correctAnswer: 0
        },
        {
          question: "Which CSS property is used to change text color?",
          options: ["text-color", "font-color", "color", "text-style"],
          correctAnswer: 2
        },
        {
          question: "What is the correct way to declare a JavaScript variable?",
          options: ["var myVar = 5;", "variable myVar = 5;", "v myVar = 5;", "declare myVar = 5;"],
          correctAnswer: 0
        },
        {
          question: "Which HTML tag is used for the largest heading?",
          options: ["<h6>", "<heading>", "<h1>", "<head>"],
          correctAnswer: 2
        },
        {
          question: "What does CSS stand for?",
          options: [
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Colorful Style Sheets"
          ],
          correctAnswer: 1
        },
        {
          question: "Which method is used to add an element at the end of an array in JavaScript?",
          options: ["push()", "add()", "append()", "insert()"],
          correctAnswer: 0
        },
        {
          question: "What is React.js?",
          options: [
            "A database",
            "A JavaScript library for building user interfaces",
            "A CSS framework",
            "A programming language"
          ],
          correctAnswer: 1
        },
        {
          question: "Which CSS property is used to make a flexbox container?",
          options: ["display: block", "display: flex", "display: grid", "display: inline"],
          correctAnswer: 1
        },
        {
          question: "What is Node.js used for?",
          options: [
            "Styling web pages",
            "Server-side JavaScript runtime",
            "Creating HTML documents",
            "Database management"
          ],
          correctAnswer: 1
        },
        {
          question: "Which HTTP method is used to retrieve data from a server?",
          options: ["POST", "PUT", "GET", "DELETE"],
          correctAnswer: 2
        }
      ],
      passingScore: 70
    }
  },
  {
    title: "Python Programming Masterclass",
    description: "Master Python from scratch. Learn programming fundamentals, data structures, object-oriented programming, and build real projects including web scraping, automation, and data analysis.",
    lessons: [
      {
        title: "Python Installation & Setup",
        videoUrl: "https://www.youtube.com/watch?v=YYXdXT2l-Gg"
      },
      {
        title: "Variables, Data Types & Operators",
        videoUrl: "https://www.youtube.com/watch?v=cQT33yu9pY8"
      },
      {
        title: "Control Flow - If Statements & Loops",
        videoUrl: "https://www.youtube.com/watch?v=Zp5MuPOtsSY"
      },
      {
        title: "Functions in Python",
        videoUrl: "https://www.youtube.com/watch?v=9Os0o3wzS_I"
      },
      {
        title: "Lists, Tuples & Dictionaries",
        videoUrl: "https://www.youtube.com/watch?v=W8KRzm-HUcc"
      },
      {
        title: "Object-Oriented Programming",
        videoUrl: "https://www.youtube.com/watch?v=JeznW_7DlB0"
      },
      {
        title: "File Handling in Python",
        videoUrl: "https://www.youtube.com/watch?v=Uh2ebFW8OYM"
      },
      {
        title: "Error Handling & Exceptions",
        videoUrl: "https://www.youtube.com/watch?v=NIWwJbo-9_8"
      }
    ],
    quiz: {
      title: "Python Programming Quiz",
      description: "Test your Python programming knowledge",
      questions: [
        {
          question: "What is the correct file extension for Python files?",
          options: [".python", ".py", ".pt", ".pyt"],
          correctAnswer: 1
        },
        {
          question: "How do you create a variable in Python?",
          options: ["var x = 5", "x = 5", "int x = 5", "create x = 5"],
          correctAnswer: 1
        },
        {
          question: "Which keyword is used to define a function in Python?",
          options: ["function", "def", "func", "define"],
          correctAnswer: 1
        },
        {
          question: "What is the output of print(2 ** 3)?",
          options: ["6", "8", "5", "9"],
          correctAnswer: 1
        },
        {
          question: "Which data type is used to store a sequence of characters?",
          options: ["int", "float", "str", "bool"],
          correctAnswer: 2
        }
      ],
      passingScore: 70
    }
  },
  {
    title: "Data Science with Python",
    description: "Dive into data science using Python. Learn NumPy, Pandas, Matplotlib, and machine learning basics. Analyze real datasets and build predictive models.",
    lessons: [
      {
        title: "Introduction to Data Science",
        videoUrl: "https://www.youtube.com/watch?v=ua-CiDNNj30"
      },
      {
        title: "NumPy for Data Analysis",
        videoUrl: "https://www.youtube.com/watch?v=QUT1VHiLmmI"
      },
      {
        title: "Pandas DataFrames",
        videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg"
      },
      {
        title: "Data Visualization with Matplotlib",
        videoUrl: "https://www.youtube.com/watch?v=3Xc3CA655Y4"
      },
      {
        title: "Introduction to Machine Learning",
        videoUrl: "https://www.youtube.com/watch?v=7eh4d6sabA0"
      }
    ],
    quiz: {
      title: "Data Science Quiz",
      description: "Test your data science knowledge",
      questions: [
        {
          question: "Which library is used for numerical operations in Python?",
          options: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
          correctAnswer: 1
        },
        {
          question: "What is a DataFrame in Pandas?",
          options: [
            "A picture frame",
            "A 2D labeled data structure",
            "A type of chart",
            "A machine learning model"
          ],
          correctAnswer: 1
        },
        {
          question: "Which library is used for data visualization?",
          options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
          correctAnswer: 2
        },
        {
          question: "What is machine learning?",
          options: [
            "Programming robots",
            "AI that learns from data",
            "Building computers",
            "Web development"
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    }
  },
  {
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile apps for iOS and Android using React Native. Learn components, navigation, state management, and publish your app to app stores.",
    lessons: [
      {
        title: "React Native Introduction & Setup",
        videoUrl: "https://www.youtube.com/watch?v=0-S5a0eXPoc"
      },
      {
        title: "Core Components & Styling",
        videoUrl: "https://www.youtube.com/watch?v=obH0Po_RdWk"
      },
      {
        title: "Navigation in React Native",
        videoUrl: "https://www.youtube.com/watch?v=npe3Wf4tpSg"
      },
      {
        title: "State Management with Redux",
        videoUrl: "https://www.youtube.com/watch?v=CVpUuw9XSjY"
      },
      {
        title: "Working with APIs",
        videoUrl: "https://www.youtube.com/watch?v=TwxdOFcEah4"
      },
      {
        title: "Publishing Your App",
        videoUrl: "https://www.youtube.com/watch?v=oBWBDaqNuws"
      }
    ],
    quiz: {
      title: "React Native Quiz",
      description: "Test your mobile development knowledge",
      questions: [
        {
          question: "What platforms can React Native target?",
          options: ["Only iOS", "Only Android", "iOS and Android", "Only Web"],
          correctAnswer: 2
        },
        {
          question: "Which language is React Native based on?",
          options: ["Python", "Java", "JavaScript", "Swift"],
          correctAnswer: 2
        },
        {
          question: "What is used for navigation in React Native?",
          options: ["React Router", "React Navigation", "Express Router", "Vue Router"],
          correctAnswer: 1
        },
        {
          question: "What is a component in React Native?",
          options: [
            "A database table",
            "A reusable piece of UI",
            "A server endpoint",
            "A CSS file"
          ],
          correctAnswer: 1
        }
      ],
      passingScore: 70
    }
  }
];

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Find or create an instructor
    let instructor = await User.findOne({ role: "instructor" });
    if (!instructor) {
      instructor = await User.findOne({ role: "admin" });
    }
    if (!instructor) {
      instructor = await User.findOne();
    }

    if (!instructor) {
      console.log("No users found. Please create a user first.");
      process.exit(1);
    }

    console.log(`Using instructor: ${instructor.name} (${instructor.email})`);

    for (const courseData of courses) {
      // Check if course already exists
      const existingCourse = await Course.findOne({ title: courseData.title });
      if (existingCourse) {
        console.log(`Course "${courseData.title}" already exists, skipping...`);
        continue;
      }

      // Create course
      const course = await Course.create({
        title: courseData.title,
        description: courseData.description,
        instructor: instructor._id,
        lessons: courseData.lessons,
      });
      console.log(`Created course: ${course.title}`);

      // Create quiz for the course
      if (courseData.quiz) {
        const existingQuiz = await Quiz.findOne({ courseId: course._id });
        if (!existingQuiz) {
          await Quiz.create({
            courseId: course._id,
            title: courseData.quiz.title,
            description: courseData.quiz.description,
            questions: courseData.quiz.questions,
            passingScore: courseData.quiz.passingScore,
          });
          console.log(`Created quiz: ${courseData.quiz.title}`);
        }
      }
    }

    console.log("\nAll courses created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
