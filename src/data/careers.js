const CAREERS = {
  datascience: {
    label: "Data Science",
    icon: "🧠",
    color: "#6366f1",
    accent: "#a5b4fc",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    description: "Master data analysis, machine learning, and AI to become a top Data Scientist.",
    roles: ["Data Analyst", "ML Engineer", "Data Scientist", "AI Researcher", "MLOps Engineer"],
    avgSalary: "₹12–35 LPA",

    roadmap: [
      { phase: "Foundation", icon: "🔢", steps: ["Python Basics", "Statistics & Probability", "SQL & Databases", "Linear Algebra"] },
      { phase: "Core Skills", icon: "🔍", steps: ["Data Wrangling (Pandas, NumPy)", "Exploratory Data Analysis", "Data Visualization", "Feature Engineering"] },
      { phase: "Machine Learning", icon: "🤖", steps: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation & Tuning", "Ensemble Methods"] },
      { phase: "Advanced", icon: "🚀", steps: ["Deep Learning (PyTorch/TF)", "NLP & LLMs", "MLOps & Deployment", "Cloud Platforms (AWS/GCP)"] },
    ],

    courses: [
      { title: "Python for Data Science & AI", provider: "Coursera (IBM)", link: "https://www.coursera.org/learn/python-for-applied-data-science-ai", duration: "25 hrs", level: "Beginner" },
      { title: "Mathematics for Machine Learning", provider: "Coursera", link: "https://www.coursera.org/specializations/mathematics-machine-learning", duration: "40 hrs", level: "Intermediate" },
      { title: "SQL for Data Analysis", provider: "Udacity", link: "https://www.udacity.com/course/sql-for-data-analysis--ud198", duration: "15 hrs", level: "Beginner" },
      { title: "Machine Learning Specialization", provider: "Coursera (Andrew Ng)", link: "https://www.coursera.org/specializations/machine-learning-introduction", duration: "90 hrs", level: "Intermediate" },
      { title: "Deep Learning Specialization", provider: "Coursera", link: "https://www.coursera.org/specializations/deep-learning", duration: "80 hrs", level: "Advanced" },
      { title: "LLMs & Prompt Engineering", provider: "DeepLearning.AI", link: "https://www.deeplearning.ai/short-courses/", duration: "10 hrs", level: "Advanced" },
      { title: "MLOps Fundamentals", provider: "Google Cloud", link: "https://www.coursera.org/learn/mlops-fundamentals", duration: "20 hrs", level: "Advanced" },
    ],

    youtube: [
      { channel: "StatQuest with Josh Starmer", topic: "ML & Statistics", link: "https://www.youtube.com/@statquest", subs: "1.1M" },
      { channel: "Sentdex", topic: "Python & ML Projects", link: "https://www.youtube.com/@sentdex", subs: "1.2M" },
      { channel: "3Blue1Brown", topic: "Math Intuition", link: "https://www.youtube.com/@3blue1brown", subs: "6M" },
      { channel: "Andrej Karpathy", topic: "Deep Learning & LLMs", link: "https://www.youtube.com/@AndrejKarpathy", subs: "850K" },
      { channel: "Ken Jee", topic: "Data Science Career", link: "https://www.youtube.com/@KenJee_ds", subs: "420K" },
      { channel: "Krish Naik", topic: "ML & MLOps", link: "https://www.youtube.com/@krishnaik06", subs: "1M" },
    ],

    interview: [
      { category: "Python", questions: ["What is a list comprehension? Give an example.", "Difference between deep copy and shallow copy?", "What are decorators in Python?", "How does garbage collection work in Python?", "What is the difference between a list and a tuple?"] },
      { category: "Statistics", questions: ["Explain p-value in simple terms.", "What is the Central Limit Theorem?", "Difference between Type I and Type II errors?", "What is Bayes' Theorem?", "Explain correlation vs causation."] },
      { category: "Machine Learning", questions: ["What is the bias-variance tradeoff?", "How does gradient descent work?", "What is overfitting and how do you prevent it?", "Explain Random Forest vs Gradient Boosting.", "How do you handle imbalanced datasets?"] },
      { category: "SQL", questions: ["What is a JOIN? Explain all types.", "Window functions vs GROUP BY?", "How would you find duplicate rows?", "Explain HAVING vs WHERE.", "What is a CTE vs Subquery?"] },
    ],

    plan: [
      { week: "Week 1–2", focus: "Python + Statistics", tasks: ["Complete Python basics: loops, functions, OOP", "Statistics: mean, median, variance, distributions", "Solve 10 Python exercises on HackerRank"] },
      { week: "Week 3–4", focus: "SQL + Pandas", tasks: ["SQL: SELECT, JOIN, GROUP BY, subqueries", "Practice on LeetCode SQL problems", "Pandas: DataFrames, merge, groupby, pivot"] },
      { week: "Week 5–8", focus: "EDA + Visualization", tasks: ["EDA on Titanic / Iris datasets", "Matplotlib & Seaborn mastery", "First Kaggle competition"] },
      { week: "Week 9–16", focus: "Machine Learning", tasks: ["Linear & Logistic Regression", "Decision Trees, Random Forest, XGBoost", "3 ML projects with Streamlit deployment"] },
      { week: "Week 17–24", focus: "Deep Learning + LLMs", tasks: ["Neural Networks from scratch", "CNNs and LSTMs", "Fine-tune an LLM with HuggingFace"] },
    ],
  },

  webdev: {
    label: "Web Development",
    icon: "🌐",
    color: "#f97316",
    accent: "#fdba74",
    gradient: "linear-gradient(135deg, #f97316, #ef4444)",
    description: "Build modern full-stack web applications from front to back end.",
    roles: ["Frontend Developer", "Backend Developer", "Full Stack Engineer", "React Developer", "DevOps Engineer"],
    avgSalary: "₹8–28 LPA",

    roadmap: [
      { phase: "Frontend Basics", icon: "🎨", steps: ["HTML5 Semantics", "CSS3 & Flexbox/Grid", "JavaScript ES6+", "Responsive Design"] },
      { phase: "Frontend Advanced", icon: "⚛️", steps: ["React.js & Hooks", "State Management", "TypeScript", "Tailwind CSS"] },
      { phase: "Backend", icon: "⚙️", steps: ["Node.js & Express", "REST APIs & GraphQL", "Authentication (JWT/OAuth)", "SQL & NoSQL Databases"] },
      { phase: "DevOps", icon: "🚢", steps: ["Git & GitHub", "Docker", "CI/CD Pipelines", "Cloud Deployment (Vercel/AWS)"] },
    ],

    courses: [
      { title: "The Complete Web Developer Bootcamp", provider: "Udemy (Angela Yu)", link: "https://www.udemy.com/course/the-complete-web-development-bootcamp/", duration: "65 hrs", level: "Beginner" },
      { title: "JavaScript: The Complete Guide", provider: "Udemy", link: "https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/", duration: "52 hrs", level: "Beginner–Adv" },
      { title: "React — The Complete Guide", provider: "Udemy", link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", duration: "68 hrs", level: "Intermediate" },
      { title: "Node.js Developer Course", provider: "Udemy", link: "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/", duration: "35 hrs", level: "Intermediate" },
      { title: "Full Stack Open", provider: "University of Helsinki", link: "https://fullstackopen.com/", duration: "Free", level: "Intermediate" },
      { title: "CS50's Web Programming", provider: "Harvard / edX", link: "https://cs50.harvard.edu/web/", duration: "Free", level: "Intermediate" },
    ],

    youtube: [
      { channel: "Traversy Media", topic: "Full Stack Tutorials", link: "https://www.youtube.com/@TraversyMedia", subs: "2.2M" },
      { channel: "Fireship", topic: "Modern Web Dev", link: "https://www.youtube.com/@Fireship", subs: "2.5M" },
      { channel: "Kevin Powell", topic: "CSS Mastery", link: "https://www.youtube.com/@KevinPowell", subs: "1M" },
      { channel: "Web Dev Simplified", topic: "React & JavaScript", link: "https://www.youtube.com/@WebDevSimplified", subs: "1.3M" },
      { channel: "Theo (t3.gg)", topic: "TypeScript / Next.js", link: "https://www.youtube.com/@t3dotgg", subs: "270K" },
      { channel: "The Net Ninja", topic: "Vue, React, Node", link: "https://www.youtube.com/@NetNinja", subs: "1.1M" },
    ],

    interview: [
      { category: "HTML & CSS", questions: ["Explain the CSS box model.", "Difference between em, rem, and px?", "What are CSS specificity rules?", "What is semantic HTML?", "CSS Grid vs Flexbox?"] },
      { category: "JavaScript", questions: ["Explain the JavaScript event loop.", "What is a closure?", "Promise vs async/await?", "Difference between == and ===?", "What is prototypal inheritance?"] },
      { category: "React", questions: ["What is the virtual DOM?", "useState vs useReducer?", "How does useEffect work?", "What is lifting state up?", "How do you optimize React performance?"] },
      { category: "Backend", questions: ["REST vs GraphQL?", "What is middleware in Express?", "Explain JWT authentication.", "SQL vs NoSQL?", "What is database indexing?"] },
    ],

    plan: [
      { week: "Week 1–2", focus: "HTML + CSS", tasks: ["Build 3 static pages from scratch", "Master Flexbox and CSS Grid", "Responsive design with media queries"] },
      { week: "Week 3–4", focus: "JavaScript", tasks: ["DOM manipulation and events", "Fetch API and async/await", "Build a weather app using a public API"] },
      { week: "Week 5–8", focus: "React.js", tasks: ["Components, props, state, hooks", "React Router for navigation", "Build a full CRUD app"] },
      { week: "Week 9–12", focus: "Node + Express", tasks: ["REST API with Express", "PostgreSQL with Prisma ORM", "JWT auth: Register & Login"] },
      { week: "Week 13–16", focus: "Full Stack + Deploy", tasks: ["Deploy to Vercel + Railway", "GitHub Actions CI/CD", "3 live portfolio projects"] },
    ],
  },
};

export default CAREERS;
