/**
 * Skill Assessment Questions
 * 10 questions per career, 4 options each, with difficulty levels
 */

export const ASSESSMENTS = {
  datascience: {
    title: "Data Science Skill Assessment",
    duration: 15, // minutes
    passMark: 60,
    questions: [
      {
        id: 1, difficulty: "Easy",
        question: "Which Python library is primarily used for data manipulation and analysis?",
        options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        correct: 1,
        explanation: "Pandas provides DataFrames and Series for data manipulation. NumPy handles arrays, Matplotlib handles visualization, and Scikit-learn handles ML."
      },
      {
        id: 2, difficulty: "Easy",
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Simple Query Logic", "Sequential Query Language", "Standard Query Library"],
        correct: 0,
        explanation: "SQL stands for Structured Query Language, used to manage and query relational databases."
      },
      {
        id: 3, difficulty: "Medium",
        question: "In a normal distribution, approximately what percentage of data falls within 2 standard deviations of the mean?",
        options: ["68%", "90%", "95%", "99.7%"],
        correct: 2,
        explanation: "The 68-95-99.7 rule: ~68% within 1σ, ~95% within 2σ, ~99.7% within 3σ."
      },
      {
        id: 4, difficulty: "Medium",
        question: "Which of the following is a supervised learning algorithm?",
        options: ["K-Means Clustering", "PCA", "DBSCAN", "Random Forest"],
        correct: 3,
        explanation: "Random Forest is supervised (needs labeled data). K-Means, PCA, and DBSCAN are unsupervised algorithms."
      },
      {
        id: 5, difficulty: "Medium",
        question: "What is the purpose of the train-test split in machine learning?",
        options: [
          "To speed up model training",
          "To evaluate model performance on unseen data",
          "To reduce dataset size",
          "To normalize features"
        ],
        correct: 1,
        explanation: "The test set simulates unseen data, letting us evaluate how well the model generalizes."
      },
      {
        id: 6, difficulty: "Medium",
        question: "Which SQL clause filters results AFTER aggregation?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correct: 1,
        explanation: "HAVING filters aggregated groups (e.g., HAVING COUNT(*) > 5), while WHERE filters rows before aggregation."
      },
      {
        id: 7, difficulty: "Hard",
        question: "What is the bias-variance tradeoff?",
        options: [
          "Higher bias always leads to better model performance",
          "A model with low bias and low variance is always achievable",
          "Reducing bias tends to increase variance and vice versa",
          "Variance only matters in classification tasks"
        ],
        correct: 2,
        explanation: "As model complexity increases, bias decreases but variance increases. The sweet spot minimizes total error."
      },
      {
        id: 8, difficulty: "Hard",
        question: "Which technique is used to prevent overfitting in neural networks?",
        options: ["Increasing learning rate", "Adding more layers", "Dropout regularization", "Removing validation set"],
        correct: 2,
        explanation: "Dropout randomly deactivates neurons during training, forcing the network to learn redundant representations and reducing overfitting."
      },
      {
        id: 9, difficulty: "Hard",
        question: "In gradient boosting, each new tree is trained to predict:",
        options: [
          "The original target variable",
          "The residual errors of the previous ensemble",
          "Random subsets of features",
          "The average of all previous trees"
        ],
        correct: 1,
        explanation: "Gradient boosting builds trees sequentially where each tree corrects the errors (residuals) of the combined previous trees."
      },
      {
        id: 10, difficulty: "Hard",
        question: "What does the p-value represent in hypothesis testing?",
        options: [
          "The probability that the null hypothesis is true",
          "The probability of observing results as extreme as the data, assuming H₀ is true",
          "The effect size of the experiment",
          "The confidence interval width"
        ],
        correct: 1,
        explanation: "A p-value is the probability of obtaining results at least as extreme as observed, given that H₀ is true. It does NOT give the probability H₀ is true."
      },
    ],
  },

  webdev: {
    title: "Web Development Skill Assessment",
    duration: 15,
    passMark: 60,
    questions: [
      {
        id: 1, difficulty: "Easy",
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1,
        explanation: "<a> (anchor) creates hyperlinks. <link> imports external resources, while href and url are attributes, not tags."
      },
      {
        id: 2, difficulty: "Easy",
        question: "Which CSS property controls the space between the element border and its content?",
        options: ["margin", "padding", "border-spacing", "gap"],
        correct: 1,
        explanation: "Padding is inside the border (content to border). Margin is outside the border (border to surrounding elements)."
      },
      {
        id: 3, difficulty: "Easy",
        question: "What does DOM stand for?",
        options: ["Data Object Management", "Document Object Model", "Dynamic Output Module", "Design Object Method"],
        correct: 1,
        explanation: "DOM (Document Object Model) is a programming interface that represents an HTML document as a tree of objects JavaScript can manipulate."
      },
      {
        id: 4, difficulty: "Medium",
        question: "What is the output of: console.log(typeof null)?",
        options: ["'null'", "'undefined'", "'object'", "'boolean'"],
        correct: 2,
        explanation: "typeof null returns 'object' — a long-standing JavaScript bug that was never fixed for backward compatibility."
      },
      {
        id: 5, difficulty: "Medium",
        question: "In React, what hook would you use to run side effects after rendering?",
        options: ["useState", "useEffect", "useCallback", "useMemo"],
        correct: 1,
        explanation: "useEffect runs after render and is used for side effects like data fetching, subscriptions, or manually changing the DOM."
      },
      {
        id: 6, difficulty: "Medium",
        question: "What is the correct HTTP method for updating a resource partially?",
        options: ["GET", "POST", "PUT", "PATCH"],
        correct: 3,
        explanation: "PATCH partially updates a resource. PUT replaces the entire resource. POST creates. GET retrieves."
      },
      {
        id: 7, difficulty: "Medium",
        question: "Which CSS layout model allows items to be arranged in both rows AND columns?",
        options: ["Flexbox", "CSS Grid", "Float", "Position absolute"],
        correct: 1,
        explanation: "CSS Grid is a 2-dimensional layout system (rows and columns). Flexbox is 1-dimensional (either row OR column)."
      },
      {
        id: 8, difficulty: "Hard",
        question: "What is event delegation in JavaScript?",
        options: [
          "Removing event listeners after use",
          "Using a parent element to handle events for its children",
          "Firing multiple events simultaneously",
          "Blocking default browser behavior"
        ],
        correct: 1,
        explanation: "Event delegation uses event bubbling to handle events at a parent level, which is more efficient than adding listeners to each child."
      },
      {
        id: 9, difficulty: "Hard",
        question: "In Node.js, what is the event loop responsible for?",
        options: [
          "Handling synchronous code execution",
          "Managing database connections",
          "Handling async callbacks and allowing non-blocking I/O",
          "Garbage collection"
        ],
        correct: 2,
        explanation: "Node's event loop enables non-blocking I/O by offloading operations and using callbacks when they complete, without blocking the main thread."
      },
      {
        id: 10, difficulty: "Hard",
        question: "What is a JWT (JSON Web Token) primarily used for?",
        options: [
          "Encrypting database entries",
          "Stateless authentication between client and server",
          "Storing session data server-side",
          "Compressing API responses"
        ],
        correct: 1,
        explanation: "JWTs enable stateless authentication: the server signs a token with user info, the client stores it, and sends it with requests for verification — no server-side session needed."
      },
    ],
  },
};

export const getScoreLabel = (pct) => {
  if (pct >= 90) return { label: "Expert", color: "#22c55e", icon: "🏆" };
  if (pct >= 75) return { label: "Advanced", color: "#6366f1", icon: "⭐" };
  if (pct >= 60) return { label: "Intermediate", color: "#f59e0b", icon: "📈" };
  if (pct >= 40) return { label: "Beginner", color: "#f97316", icon: "📚" };
  return { label: "Needs Work", color: "#ef4444", icon: "💪" };
};

export const getRecommendedPhase = (pct) => {
  if (pct >= 75) return 2; // Skip to Core/Advanced
  if (pct >= 50) return 1; // Start at Core
  return 0; // Start from Foundation
};
