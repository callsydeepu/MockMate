// Substantial local fallback questions pool categorized by role, experience tier, and category rotations
const FALLBACK_QUESTION_POOL = {
  frontend: {
    junior: {
      fundamentals: [
        { question: "What is React, and how does it differ from vanilla HTML and JavaScript?", difficulty: "simple", tips: ["Discuss component-based reuse.", "Explain reactive UI updates vs manual DOM manipulation."] },
        { question: "What is the difference between props and state in React?", difficulty: "simple", tips: ["Explain that props are read-only inputs passed from parents.", "Describe state as internal mutable component memory."] },
        { question: "Can you explain what the useEffect hook does and when you would use its dependency array?", difficulty: "simple", tips: ["Discuss executing side effects (API calls, listeners).", "Detail the role of the dependency array in re-runs."] }
      ],
      projects: [
        { question: "Tell me about a frontend project you built. What was the most interesting UI component you implemented?", difficulty: "simple", tips: ["Detail the component's interactive features.", "Focus on state management and layout styles."] }
      ],
      debugging: [
        { question: "If your React component renders an 'undefined is not an object' error in the browser console, how do you debug it?", difficulty: "simple", tips: ["Mention checking console stack traces.", "Explain using console.log or browser debugger breakpoints.", "Discuss safe optional chaining (?.) check."] }
      ],
      behavioral: [
        { question: "Describe a time you had to learn a new frontend tool or library quickly. How did you approach learning it?", difficulty: "simple", tips: ["Discuss starting with official quick-start docs.", "Describe building a small sandbox project to practice."] }
      ]
    },
    mid: {
      fundamentals: [
        { question: "What is the difference between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG)?", difficulty: "moderate", tips: ["Compare initial page load speeds (TTFB, FCP).", "Discuss search engine optimization (SEO) implications."] }
      ],
      projects: [
        { question: "Describe a complex API integration you handled in a frontend project. How did you manage loading states and error boundaries?", difficulty: "moderate", tips: ["Detail state models for pending, success, and error paths.", "Discuss React Error Boundaries and robust retries."] }
      ],
      debugging: [
        { question: "How would you optimize a React list of 1000 items that is lagging on user scrolls and typing events?", difficulty: "moderate", tips: ["Suggest list virtualization libraries (react-window).", "Discuss memoizing elements with React.memo."] }
      ],
      behavioral: [
        { question: "Tell me about a time you disagreed with a teammate about a technical choice, like Tailwind vs CSS Modules. How was it resolved?", difficulty: "moderate", tips: ["Show respect for different engineering trade-offs.", "Describe objective prototyping or team alignment standard."] }
      ]
    },
    senior: {
      fundamentals: [
        { question: "Explain the React Fiber reconciliation architecture. How does it enable asynchronous rendering, scheduling, and concurrency under the hood?", difficulty: "advanced", tips: ["Explain the fiber tree linked list structure.", "Discuss time-slicing and prioritization levels."] }
      ],
      projects: [
        { question: "Describe the architecture of a custom Micro-Frontend system you built. How did you resolve state sync, style isolation, and routing conflicts?", difficulty: "advanced", tips: ["Discuss custom event buses or shared state stores.", "Detail CSS encapsulation (Shadow DOM, unique namespaces)."] }
      ],
      debugging: [
        { question: "How do you profile, identify, and eliminate memory leaks caused by uncleaned event listeners or subscriptions in a large-scale React app?", difficulty: "advanced", tips: ["Detail Chrome DevTools Memory Heap Allocations profiling.", "Explain ref and hook cleanup hooks on component unmount."] }
      ],
      behavioral: [
        { question: "Describe a time you argued against a massive framework migration proposed by management. How did you outline technical debt and costs?", difficulty: "advanced", tips: ["Focus on business cost vs engineering efficiency metrics.", "Present objective alternatives like incremental upgrades."] }
      ]
    }
  },
  backend: {
    junior: {
      fundamentals: [
        { question: "What is Express.js, and what are the main benefits of using it for a Node.js backend?", difficulty: "simple", tips: ["Explain routing and middleware integrations.", "Discuss lightweight nature over massive monolith structures."] },
        { question: "What is the difference between SQL (Relational) and NoSQL (Non-relational) databases?", difficulty: "simple", tips: ["Explain structured tables vs flexible document structures.", "Discuss schema constraints and basic scaling differences."] },
        { question: "What is Express middleware, and how does it use the 'req', 'res', and 'next' parameters?", difficulty: "simple", tips: ["Discuss intercepting requests before reaching route controllers.", "Explain the necessity of invoking next() to continue."] }
      ],
      projects: [
        { question: "Tell me about a backend API or database schema you designed. What was its main purpose?", difficulty: "simple", tips: ["Detail database schemas, models, and endpoints.", "Describe how user requests are mapped to database queries."] }
      ],
      debugging: [
        { question: "If your Node.js server crashed with an 'EADDRINUSE' error during startup, what does this mean and how do you resolve it?", difficulty: "simple", tips: ["Explain that the target PORT is already occupied by another process.", "Discuss killing the process running on that port or changing PORT."] }
      ],
      behavioral: [
        { question: "Describe a scenario where you made a mistake in a server route that broke a local test. How did you fix it?", difficulty: "simple", tips: ["Take responsibility openly.", "Detail using server logs or test runners to isolate the bug."] }
      ]
    },
    mid: {
      fundamentals: [
        { question: "Explain the differences between session-based authentication and JWT-based authentication. What are the key architectural trade-offs?", difficulty: "moderate", tips: ["Discuss server database lookup bottleneck vs stateless token scaling.", "Detail JWT security precautions."] }
      ],
      projects: [
        { question: "Describe how you implemented an email sending queue or a background task process in a MERN stack application.", difficulty: "moderate", tips: ["Discuss background job queues (Bull, Agenda) or cron schedulers.", "Explain how to handle process failures, retries, and logs."] }
      ],
      debugging: [
        { question: "How would you diagnose and optimize a slow database query in Express that is lagging from 5 seconds down to under 100 milliseconds?", difficulty: "moderate", tips: ["Detail using EXPLAIN ANALYZE or database query logs.", "Explain adding targeted database indexes to avoid full table scans."] }
      ],
      behavioral: [
        { question: "Tell me about a time you had to explain a complex backend bug or API delay to a frontend developer. How did you align?", difficulty: "moderate", tips: ["Demonstrate collaboration and active listening.", "Discuss using JSON mock schemas or Swagger docs to clarify paths."] }
      ]
    },
    senior: {
      fundamentals: [
        { question: "How would you design a distributed transaction mechanism across microservices order and inventory DBs without a centralized database?", difficulty: "advanced", tips: ["Explain the Saga Pattern (choreography vs orchestration).", "Discuss compensating transactions and event queues (Kafka)."] }
      ],
      projects: [
        { question: "Describe a high-throughput backend caching architecture you designed. How did you resolve cache invalidation and stampedes?", difficulty: "advanced", tips: ["Discuss Cache-Aside, Write-Through caching patterns.", "Detail Redis key invalidation and lock configurations."] }
      ],
      debugging: [
        { question: "How do you triage a production incident where your server is running out of memory (OOM) under heavy concurrent write loads?", difficulty: "advanced", tips: ["Detail Node.js heap snapshot profiling and memory leaks detection.", "Explain backpressure streaming mechanisms and cluster models."] }
      ],
      behavioral: [
        { question: "Detail a critical server outage you resolved under stress. How did you coordinate the post-mortem, and what long-term safeseals did you add?", difficulty: "advanced", tips: ["Describe direct triaging, monitoring metrics, and rollback procedures.", "Emphasize blameless culture and systemic automated tests."] }
      ]
    }
  },
  dataScience: {
    junior: {
      fundamentals: [
        { question: "What is overfitting in Machine Learning, and how can you detect if your model is experiencing it?", difficulty: "simple", tips: ["Explain high accuracy on training sets vs poor validation scores.", "Suggest using regularization or cross-validation techniques."] },
        { question: "What is the difference between supervised and unsupervised learning? Give a simple example of each.", difficulty: "simple", tips: ["Explain that supervised uses labeled data (predictions).", "Explain that unsupervised finds clusters in unlabeled data."] },
        { question: "How does Gradient Descent work simply? Explain the concept of learning rate.", difficulty: "simple", tips: ["Discuss taking incremental steps down a hill to minimize error.", "Explain that learning rate defines step sizes."] }
      ],
      projects: [
        { question: "Describe a dataset you analyzed or a simple machine learning model you trained. What did you learn from the data?", difficulty: "simple", tips: ["Describe the source of the data and its attributes.", "Detail the features and prediction results."] }
      ],
      debugging: [
        { question: "If your model training code throws a 'NaN loss' error on the second epoch, how do you debug this?", difficulty: "simple", tips: ["Discuss checking for extreme learning rates causing exploding gradients.", "Mention checking for null or missing values in input datasets."] }
      ],
      behavioral: [
        { question: "Tell me about a time you encountered a missing value in your data. How did you decide whether to drop or impute it?", difficulty: "simple", tips: ["Focus on understanding the dataset context.", "Discuss analytical trade-offs of dropping rows vs mean imputation."] }
      ]
    },
    mid: {
      fundamentals: [
        { question: "Explain the bias-variance trade-off in machine learning. How do you balance the two to achieve optimal generalization?", difficulty: "moderate", tips: ["Define bias (underfitting) vs variance (overfitting).", "Discuss learning curves and model complexity paths."] }
      ],
      projects: [
        { question: "Describe a machine learning feature engineering pipeline you designed. What specific feature transformations improved accuracy?", difficulty: "moderate", tips: ["Detail target encoding, scaling, or handling categorical data.", "Explain why the changes improved predictive capabilities."] }
      ],
      debugging: [
        { question: "How do you evaluate and optimize a classifier for an extremely imbalanced dataset where 99% of samples are of one class?", difficulty: "moderate", tips: ["Reject plain accuracy metrics.", "Suggest using ROC-AUC, Precision-Recall curves, or SMOTE oversampling."] }
      ],
      behavioral: [
        { question: "Describe a time you had to explain a complex ML model's prediction to a business stakeholder who did not understand AI.", difficulty: "moderate", tips: ["Translate stats jargon into concrete business outcomes.", "Use visual tools or explainable AI concepts (SHAP/LIME)."] }
      ]
    },
    senior: {
      fundamentals: [
        { question: "Explain the self-attention mechanism in Transformers Query-Key-Value calculations. How does it scale computationally?", difficulty: "advanced", tips: ["Explain Q, K, V dot product attention matrix math.", "Discuss quadratic O(N^2) complexity limitations."] }
      ],
      projects: [
        { question: "Describe the architecture of a real-time recommendation pipeline you built that serves ML predictions under 50 milliseconds.", difficulty: "advanced", tips: ["Outline kappa streaming processing (Flink/Kafka).", "Discuss Redis feature store servings and vector databases."] }
      ],
      debugging: [
        { question: "How do you address covariate shift and model drift in a production ML pipeline that processes active financial transactions?", difficulty: "advanced", tips: ["Explain automated performance tracking and drift triggers.", "Detail incremental retraining pipelines and shadow deployments."] }
      ],
      behavioral: [
        { question: "Tell me about an ML project that failed to deliver business value after deployment. What went wrong and what did you learn?", difficulty: "advanced", tips: ["Acknowledge operational gaps realistically.", "Discuss alignment errors, metrics drift, or data leaks."] }
      ]
    }
  },
  general: {
    junior: {
      fundamentals: [{ question: "Why do you want to join MockMate? Tell me about a simple engineering tool you enjoy using.", difficulty: "simple", tips: ["Show excitement about mock practice products.", "Explain tool's utility briefly."] }],
      projects: [{ question: "Tell me about a team project you participated in. What was your direct responsibility?", difficulty: "simple", tips: ["Detail your individual code contributions.", "Highlight communication during milestones."] }],
      debugging: [{ question: "Describe a basic code syntax error that took you longer than expected to fix. What did you learn?", difficulty: "simple", tips: ["Focus on understanding syntax errors or typo logic.", "Discuss using lints and compiler messages."] }],
      behavioral: [{ question: "Describe a time you received constructive feedback on your code. How did you react?", difficulty: "simple", tips: ["Focus on a growth mindset and gratitude.", "Explain how you adjusted your coding style."] }]
    },
    mid: {
      fundamentals: [{ question: "Describe a software engineering methodology (like Agile or Scrum) you worked with. What are its pros and cons?", difficulty: "moderate", tips: ["Discuss sprint structures and alignments.", "Explain friction points or overheads."] }],
      projects: [{ question: "Describe a project you delivered where the requirements changed halfway through. How did you adjust?", difficulty: "moderate", tips: ["Show flexibility and proactive planning.", "Discuss adjusting sprint milestones and communication."] }],
      debugging: [{ question: "How do you approach code reviews? What balance do you strike between technical rigor and collaborative support?", difficulty: "moderate", tips: ["Focus on learning loops and standard formatting.", "Describe using constructive, friendly PR commentaries."] }],
      behavioral: [{ question: "Describe a conflict you had with a product manager regarding a feature deadline. How did you resolve it?", difficulty: "moderate", tips: ["Describe active negotiation and compromise.", "Detail outlining technical debt risks objectively."] }]
    },
    senior: {
      fundamentals: [{ question: "How do you evaluate, justify, and introduce a new technology or microservice architecture to an established team?", difficulty: "advanced", tips: ["Focus on business value vs learning curve overheads.", "Suggest proof-of-concept prototypes and incremental buy-ins."] }],
      projects: [{ question: "Describe how you managed technical debt in a massive legacy system while continuing to deliver critical new features.", difficulty: "advanced", tips: ["Describe technical debt budgets in sprints.", "Detail decoupled refactor patterns and interface abstractions."] }],
      debugging: [{ question: "How do you mentor junior developers? Give an instance where you helped a junior engineer grow into an independent contributor.", difficulty: "advanced", tips: ["Focus on empowerment, clean code reviews, and pair debugging.", "Describe scaling up their task autonomy over time."] }],
      behavioral: [{ question: "Describe a major architectural decision you made that failed. What went wrong, and how did you manage the rollback and lessons?", difficulty: "advanced", tips: ["Take full leadership responsibility.", "Detail risk mitigations and architectural fail-safes learned."] }]
    }
  }
};

const aiService = {
  /**
   * Generates a highly experience-aware, role-specific, category-rotating question with low latency
   * @param {Object} options
   * @param {string} options.role
   * @param {string} options.company
   * @param {string} options.difficulty
   * @param {string} options.experienceLevel
   * @param {string[]} options.previousQuestions
   * @param {number} options.questionIndex
   */
  generateRoleSpecificQuestion: async ({ role, company, difficulty, experienceLevel = "junior", previousQuestions = [], questionIndex = 0 }) => {
    console.log(`[DEBUG] AI Service - Role: "${role}", Company: "${company}", Exp: "${experienceLevel}", Index: ${questionIndex}`);
    console.log(`[DEBUG] AI Service - Truncated Previous Questions:`, previousQuestions);

    const normalizedRole = role.toLowerCase().trim();
    const expTier = ["junior", "mid-level", "senior"].includes(experienceLevel.toLowerCase()) ? experienceLevel.toLowerCase() : "junior";
    const mappedTier = expTier === "mid-level" ? "mid" : expTier; // normalize for fallback keying

    // 1. Resolve active category in rotation cycle: Q1 (Fundamentals) -> Q2 (Projects) -> Q3 (Debugging) -> Q4 (Behavioral)
    const categories = ["fundamentals", "projects", "debugging", "behavioral"];
    const activeCategory = categories[questionIndex % 4];
    console.log(`[DEBUG] AI Service - Active rotated category selected: "${activeCategory}"`);

    // 2. Identify role category mapping
    let roleCategory = "general";
    if (normalizedRole.includes("front") || normalizedRole.includes("react") || normalizedRole.includes("ui") || normalizedRole.includes("web")) {
      roleCategory = "frontend";
    } else if (normalizedRole.includes("back") || normalizedRole.includes("api") || normalizedRole.includes("node") || normalizedRole.includes("database")) {
      roleCategory = "backend";
    } else if (normalizedRole.includes("data") || normalizedRole.includes("ml") || normalizedRole.includes("ai") || normalizedRole.includes("python") || normalizedRole.includes("deep")) {
      roleCategory = "dataScience";
    } else if (normalizedRole.includes("devops") || normalizedRole.includes("cloud") || normalizedRole.includes("infrastructure") || normalizedRole.includes("aws")) {
      roleCategory = "backend";
    } else if (normalizedRole.includes("full") || normalizedRole.includes("stack")) {
      roleCategory = Math.random() > 0.5 ? "frontend" : "backend";
    }

    // 3. Build experience-aware prompt templates (extremely compressed for speed)
    let experienceConstraints = "";
    if (expTier === "junior") {
      experienceConstraints = `Junior/intern candidate. Ask ONLY core basic concepts, simple code workflows, or basic project scopes.
STRICTLY BAN: system design, advanced low-level internals (Fiber, locking, engines), deep performance bottlenecks, or academic scaling queries.`;
    } else if (expTier === "mid-level") {
      experienceConstraints = `Mid-level candidate. Ask moderate questions regarding integrations, performance metrics, testing suites, or routine debugging logs.`;
    } else {
      experienceConstraints = `Senior candidate. Focus strictly on advanced system design, low-level internal thread pools, distributed transactions, memory triaging, or high-level architectural tradeoffs.`;
    }

    let categoryInstruction = "";
    if (activeCategory === "fundamentals") {
      categoryInstruction = "Ask a direct technical question about a core concept, syntax, or runtime characteristic.";
    } else if (activeCategory === "projects") {
      categoryInstruction = "Ask a conversational question requesting the candidate to describe a component or feature they have built.";
    } else if (activeCategory === "debugging") {
      categoryInstruction = "Present a realistic bug or error scenario and ask how they would diagnose or triage it.";
    } else {
      categoryInstruction = "Ask a behavioral situational question focused on team collaboration, feedback, or conflict resolution.";
    }

    let generatedQuestion = null;

    // 4. Attempt low-latency Groq query using llama-3.1-8b-instant
    if (process.env.GROQ_API_KEY) {
      console.log(`[DEBUG] AI Service - Querying llama-3.1-8b-instant on Groq for low latency.`);
      try {
        const prompt = `You are a technical interviewer at ${company || "a tech firm"}.
Generate ONE question for a ${expTier} applying for the role of ${role}.

EXPERIENCE LEVEL CONSTRAINTS:
${experienceConstraints}

ACTIVE CATEGORY INSTRUCTION (${activeCategory.toUpperCase()}):
${categoryInstruction}

PREVIOUS TOPICS (DO NOT SEMANTICALLY REPEAT OR OVERLAP):
${previousQuestions.map(q => `- "${q}"`).join("\n")}

STRICT OUTPUT RULES:
1. Return EXACTLY ONE clean question. Keep it short and conversational. The question text MUST stay under 25 words.
2. Return strictly a raw JSON object matching the following structure, with NO surrounding text, markdown formatting, or fences:
{
  "question": "The question text (< 25 words)",
  "category": "${activeCategory === "fundamentals" || activeCategory === "projects" || activeCategory === "debugging" ? "technical" : "behavioral"}",
  "difficulty": "${expTier === "junior" ? "simple" : expTier === "mid-level" ? "moderate" : "advanced"}",
  "tips": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "suggestedDuration": ${activeCategory === "debugging" ? 180 : 120}
}`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          let contentText = data.choices[0].message.content.trim();
          console.log(`[DEBUG] AI Service - Groq response: "${contentText}"`);

          // Sanitize fences
          if (contentText.startsWith("```json")) contentText = contentText.substring(7);
          else if (contentText.startsWith("```")) contentText = contentText.substring(3);
          if (contentText.endsWith("```")) contentText = contentText.substring(0, contentText.length - 3);
          contentText = contentText.trim();

          const parsed = JSON.parse(contentText);
          if (parsed && parsed.question) {
            generatedQuestion = {
              text: parsed.question,
              category: parsed.category || "technical",
              difficulty: parsed.difficulty || (expTier === "junior" ? "simple" : expTier === "mid-level" ? "moderate" : "advanced"),
              tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 3) : ["Detail implementation specifics.", "Focus on complexities.", "Reference real-world cases."],
              suggestedDuration: Number(parsed.suggestedDuration) || 120
            };
          }
        } else {
          console.error(`[DEBUG] AI Service - Groq llama-3.1-8b-instant failed with status: ${response.status}`);
        }
      } catch (err) {
        console.error(`[DEBUG] AI Service - Exception during Groq query:`, err);
      }
    }

    // 5. High-fidelity fallback engine: Run if Groq is offline or failed
    if (!generatedQuestion) {
      console.warn(`[DEBUG] AI Service - Groq inactive. Extracting from experience-aware local fallback pool.`);

      const rolePool = FALLBACK_QUESTION_POOL[roleCategory] ? roleCategory : "general";
      const tierPool = FALLBACK_QUESTION_POOL[rolePool][mappedTier] || FALLBACK_QUESTION_POOL.general[mappedTier];
      const categoryQuestions = tierPool[activeCategory] || tierPool.fundamentals;

      // Filter out previously asked questions to guarantee uniqueness
      const freshQuestions = categoryQuestions.filter(candidateQ => {
        return !previousQuestions.some(askedQText => 
          askedQText.toLowerCase().includes(candidateQ.question.substring(0, 15).toLowerCase()) ||
          candidateQ.question.toLowerCase().includes(askedQText.substring(0, 15).toLowerCase())
        );
      });

      const selected = freshQuestions.length > 0 
        ? freshQuestions[Math.floor(Math.random() * freshQuestions.length)]
        : categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

      generatedQuestion = {
        text: selected.question,
        category: activeCategory === "behavioral" ? "behavioral" : "technical",
        difficulty: expTier === "junior" ? "simple" : expTier === "mid-level" ? "moderate" : "advanced",
        tips: selected.tips || ["Focus on core concepts.", "Detail implementation specifics.", "State complexity analysis."],
        suggestedDuration: activeCategory === "debugging" ? 180 : 120
      };
    }

    // Assign unified ID
    generatedQuestion.id = `ai_q_${Date.now()}_${questionIndex}`;
    return generatedQuestion;
  },

  /**
   * Helper to resolve a highly concise, professional expected ideal answer for a question
   */
  getExpectedAnswerForFallback: (questionText, tips = []) => {
    const qLower = questionText.toLowerCase();
    if (qLower.includes("what is react") && qLower.includes("differ")) {
      return "React is a component-based JavaScript library focused on building interactive user interfaces. Unlike vanilla HTML and JavaScript, which require manual DOM updates, React uses a Virtual DOM and a reactive state-driven model to efficiently update only the components that change.";
    }
    if (qLower.includes("props and state")) {
      return "Props are read-only configuration inputs passed down from parent to child components, allowing them to remain reusable and stateless. State is mutable, component-local memory that is declared and managed internally, triggering automatic re-renders when updated.";
    }
    if (qLower.includes("useeffect") || qLower.includes("dependency array")) {
      return "The useEffect hook lets React components perform side effects like fetching data, setting up event subscriptions, or manual DOM updates. Its dependency array controls when the effect re-runs: an empty array runs it once on mount, while specifying state or prop values runs it only when those values change.";
    }
    if (qLower.includes("frontend project") || qLower.includes("ui component")) {
      return "I built an interactive dashboard featuring a custom draggable Kanban board component. It utilized optimized HTML5 Drag and Drop APIs, managed local state efficiently to support high-performance transitions, and integrated smooth CSS transform micro-animations for dragging states.";
    }
    if (qLower.includes("undefined is not") || qLower.includes("browser console")) {
      return "I would start by inspecting the stack trace in the browser console to identify the exact line of code. Next, I'd set breakpoints or add logging to check variable states, and apply optional chaining (?.) or defensive null checks to ensure nested objects are populated before rendering.";
    }
    if (qLower.includes("learn a new frontend") || qLower.includes("quickly")) {
      return "When I needed to learn TailwindCSS, I started by reading the official documentation and building a simple sandbox project. I focused on understanding utility-first CSS principles, experimented with theme customizations, and immediately applied it to build a responsive landing page layout.";
    }
    if (qLower.includes("express.js") || (qLower.includes("express") && qLower.includes("node"))) {
      return "Express.js is a minimal, lightweight, and flexible web application framework for Node.js. It simplifies backend development by providing robust systems for routing, handling HTTP requests, and integrating custom middleware to process requests and responses cleanly.";
    }
    if (qLower.includes("sql") && qLower.includes("nosql")) {
      return "SQL databases are relational systems that use structured, predefined schemas with tables and foreign key relationships, making them ideal for complex queries and ACID-compliant transactions. NoSQL databases, like MongoDB, are non-relational, schema-less document stores optimized for flexible data structures and horizontal scalability.";
    }
    if (qLower.includes("middleware") && qLower.includes("next")) {
      return "Express middleware functions have access to the request object (req), response object (res), and the next middleware function in the cycle (next). They are used to intercept requests, run code (such as authentication or logging), and must call 'next()' to pass control to the subsequent handler.";
    }
    if (qLower.includes("backend api") || qLower.includes("database schema")) {
      return "I designed a RESTful API and relational database schema for an e-commerce order processing system. It featured one-to-many relationships between users, orders, and products, with indexes on foreign keys to optimize query performance and ensure transaction reliability under concurrent loads.";
    }
    if (qLower.includes("eaddrinuse")) {
      return "An 'EADDRINUSE' error means the port your server is trying to bind to is already being used by another running process. To resolve this, I would identify and terminate the process using that port (using tools like lsof or netstat) or configure the server to use a different port.";
    }
    if (qLower.includes("mistake") && qLower.includes("server route")) {
      return "During local integration testing, I mistakenly returned a status of 200 instead of 401 for an unauthenticated request. I identified the failure in my test runner output, reviewed the route's middleware chain, and corrected the conditional branch to properly reject missing authorization tokens.";
    }

    // Fallback using tips if available
    if (Array.isArray(tips) && tips.length > 0) {
      return `A professional and concise expected answer for this question should demonstrate technical depth by covering: ${tips.join(" ")}`;
    }

    return "An ideal response should state exact definitions, demonstrate syntax/architectural options, detail handling edge cases, and analyze complexity trade-offs suitable for the target role.";
  },

  /**
   * Evaluates candidate's responses dynamically using seasoned experience-aware criteria
   * @param {Object} options
   * @param {string} options.role
   * @param {string} options.company
   * @param {string} options.difficulty
   * @param {string} options.experienceLevel
   * @param {Array} options.questions
   */
  evaluateInterview: async ({ role, company, difficulty, experienceLevel = "junior", questions = [] }) => {
    console.log(`[DEBUG] AI Service - Evaluating interview: Role: "${role}", Company: "${company}", Exp: "${experienceLevel}", Questions Count: ${questions.length}`);
    
    // Filter questions that actually have answers or are defined
    const transcript = questions.filter(q => q.question && q.answer && q.answer.trim().length > 0);
    
    if (transcript.length === 0) {
      console.warn("[DEBUG] AI Service - No answered questions in interview, returning minimum default evaluation.");
      return {
        overallScore: 10,
        technicalScore: 5,
        communicationScore: 10,
        confidenceScore: 5,
        strengths: [],
        weaknesses: ["No answers provided for any of the interview questions"],
        feedback: "You did not provide any responses during this interview session. To receive feedback and improve, please attempt to answer each question in future sessions.",
        questionBreakdown: questions.map(q => ({
          question: q.question,
          userAnswer: q.answer || "[No response provided]",
          expectedAnswer: aiService.getExpectedAnswerForFallback(q.question, q.tips || []),
          score: 0,
          feedback: "No response was recorded for this question."
        }))
      };
    }

    let result = null;

    if (process.env.GROQ_API_KEY) {
      console.log(`[DEBUG] AI Service - Querying Groq llama-3.1-8b-instant for interview evaluation.`);
      try {
        const expTier = ["junior", "mid-level", "senior"].includes(experienceLevel.toLowerCase()) ? experienceLevel.toLowerCase() : "junior";
        
        let evaluationStandard = "";
        if (expTier === "junior") {
          evaluationStandard = `Junior level standard. Evaluate on basic programming syntax, core foundational concepts, logical steps, and simple code workflows. Be constructive but strict—if they do not know basic concepts, rate accordingly. Do not expect complex system designs or advanced runtime optimizations.`;
        } else if (expTier === "mid-level") {
          evaluationStandard = `Mid-level standard. Expect solid understanding of application architecture, REST API design, intermediate state management, basic optimizations, error handling, and debugging.`;
        } else {
          evaluationStandard = `Senior level standard. Expect deep expertise, systems design authority, performance optimization, concurrency patterns, distributed databases, memory leak tracking, and core runtime engine behavior. Standard is exceptionally high and rigorous.`;
        }

        const formattedTranscript = transcript.map((q, idx) => `Q${idx + 1}: "${q.question}"\nCandidate Answer: "${q.answer}"`).join("\n\n");

        const prompt = `You are a professional software engineering recruiter and senior interviewer at ${company || "a tech company"}.
You have just completed an interview for a ${expTier} applying for the role of ${role} (Difficulty: ${difficulty}).

You are evaluating their performance. You must act as a realistic, strict, and rigorous interviewer, NOT a supportive tutor. DO NOT give inflated scores.

STRICT SCORING RUBRIC:
- 0–20: No understanding, empty answers, or extremely weak responses (e.g., "I don't know", "not sure", "pass", "no idea", or completely irrelevant babble).
- 20–40: Weak understanding or mostly incorrect. Shows huge misconception or is highly superficial (e.g., "React is JS" for "What is React?").
- 40–60: Partial understanding with major gaps. Understands basic definition but fails on details, runtime parameters, or simple implementation rules.
- 60–80: Good understanding with decent explanations. Explains core concepts and basic details well, but lacks deep architectural/performance trade-offs.
- 80–100: Strong technical depth and clarity. Displays production-grade knowledge, exact architectural details, exact edge cases, and solid technical vocabulary.

CANDIDATE EXPERIENCE TIERS (CALIBRATION):
- Junior: Evaluate on core syntax, fundamental parameters, logical reasoning, and basic project mechanics. Do not judge on low-level internals (e.g., React Fiber, Saga patterns, distributed lock architectures). Be constructive but strict.
- Mid-level: Evaluate on API design, intermediate web architecture, state management, basic optimization, error handlings, and debugging workflows.
- Senior: Evaluate rigorously on low-level internals, thread pooling, system design, high-scale database query profiling, caching stamps, distributed failovers, and concrete architectural tradeoffs.

WEAK ANSWER & PENALTY DETECTION:
- Explicitly scan the candidate's answers for weak patterns (e.g., "I don't know", "not sure", "no idea", "pass", empty values, or completely off-topic answers).
- For EVERY question containing a weak answer or "I don't know" style response, you MUST cap the score of that question at 20 MAXIMUM.
- If the candidate gives consecutive or repeated (2 or more) weak/empty responses, compound the penalty: cap the overallScore and technicalScore at 35 MAXIMUM. If ALL questions are weak/empty, overallScore and technicalScore MUST be capped at 15 MAXIMUM.

Here is the exact transcript of the questions asked and the candidate's answers:
${formattedTranscript}

Perform a deep, comprehensive evaluation. Generate the overall scores and a detailed question-by-question breakdown, including a high-quality, concise, professional expected ideal answer for each question.

STRICT RULES FOR OUTPUT:
1. You MUST return strictly a raw JSON object matching the following structure, with NO surrounding text, markdown formatting, or fences:
{
  "overallScore": <integer between 0 and 100 based on the rubric and penalties>,
  "technicalScore": <integer between 0 and 100>,
  "communicationScore": <integer between 0 and 100>,
  "confidenceScore": <integer between 0 and 100>,
  "strengths": ["Actionable Strength 1", "Actionable Strength 2"],
  "weaknesses": ["Actionable Area for Improvement 1", "Actionable Area for Improvement 2"],
  "feedback": "A concise, detailed summary under 100 words including specific recommendations.",
  "questionBreakdown": [
    {
      "question": "The exact question text",
      "userAnswer": "The candidate's response",
      "expectedAnswer": "A concise, 2-3 sentence, highly professional, interview-grade ideal/expected answer that demonstrates 100% technical mastery.",
      "score": <integer score for this question, strictly following the rubric and weak response penalties>,
      "feedback": "A short, specific critique (1-2 sentences) of the user's answer, explaining exactly why they received this score."
    }
  ]
}
2. The scores MUST be extremely realistic and follow all instructions strictly. Do not explain anything outside the JSON structure.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          let contentText = data.choices[0].message.content.trim();
          console.log(`[DEBUG] AI Service - Groq evaluation raw response: "${contentText}"`);

          // Sanitize fences
          if (contentText.startsWith("```json")) contentText = contentText.substring(7);
          else if (contentText.startsWith("```")) contentText = contentText.substring(3);
          if (contentText.endsWith("```")) contentText = contentText.substring(0, contentText.length - 3);
          contentText = contentText.trim();

          const parsed = JSON.parse(contentText);
          if (parsed && typeof parsed.overallScore === "number") {
            result = {
              overallScore: Math.min(100, Math.max(0, parsed.overallScore)),
              technicalScore: Math.min(100, Math.max(0, parsed.technicalScore || parsed.overallScore)),
              communicationScore: Math.min(100, Math.max(0, parsed.communicationScore || parsed.overallScore)),
              confidenceScore: Math.min(100, Math.max(0, parsed.confidenceScore || parsed.overallScore)),
              strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : ["Good overall performance"],
              weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : ["Some minor areas for improvement"],
              feedback: parsed.feedback || "Good effort. Keep practicing on Mock Space to boost your score.",
              questionBreakdown: Array.isArray(parsed.questionBreakdown) ? parsed.questionBreakdown : []
            };
          }
        } else {
          console.error(`[DEBUG] AI Service - Groq evaluation failed with status: ${response.status}`);
        }
      } catch (err) {
        console.error(`[DEBUG] AI Service - Exception during Groq evaluation query:`, err);
      }
    }

    // High-fidelity fallback engine: Run if Groq is offline or failed
    if (!result) {
      console.warn("[DEBUG] AI Service - Groq inactive or failed for evaluation. Generating high-fidelity experience-aware local fallback evaluation.");

      const expTier = ["junior", "mid-level", "senior"].includes(experienceLevel.toLowerCase()) ? experienceLevel.toLowerCase() : "junior";
      
      // Analyze transcripts for weak answers heuristically
      let weakCount = 0;
      const questionBreakdown = transcript.map(q => {
        const ans = q.answer || "";
        const words = ans.split(/\s+/).filter(Boolean);
        const lowerAns = ans.toLowerCase().trim();
        
        const isWeak = 
          words.length === 0 ||
          lowerAns === "i don't know" || 
          lowerAns === "don't know" || 
          lowerAns === "idk" || 
          lowerAns === "not sure" || 
          lowerAns === "no idea" || 
          lowerAns === "pass" || 
          lowerAns === "skip" || 
          lowerAns === "i am not sure" || 
          lowerAns === "i do not know" ||
          words.length < 4;

        let score = 70;
        let critique = "";

        if (isWeak) {
          weakCount++;
          score = Math.floor(Math.random() * 11) + 5; // 5 to 15
          critique = "You gave an empty or extremely weak response. For high-scoring answers, describe your logical approach and try guessing based on fundamentals.";
        } else if (words.length < 15) {
          score = Math.floor(Math.random() * 16) + 22; // 22 to 37
          critique = "Superficial answer with major explanation gaps. Try elaborating on the specific workflow or mechanisms.";
        } else {
          // Score based on experience calibration & response length
          if (expTier === "junior") {
            if (words.length > 40) {
              score = Math.floor(Math.random() * 11) + 82; // 82 to 92
              critique = "Strong explanation of core fundamentals showing solid reasoning.";
            } else {
              score = Math.floor(Math.random() * 16) + 61; // 61 to 76
              critique = "Good fundamental answer, but could explain execution lifecycle or prop bindings in more detail.";
            }
          } else if (expTier === "mid-level") {
            if (words.length > 60) {
              score = Math.floor(Math.random() * 11) + 80; // 80 to 90
              critique = "Very good grasp of intermediate application architectures and edge scenarios.";
            } else {
              score = Math.floor(Math.random() * 16) + 56; // 56 to 71
              critique = "Solid answer, but missed describing detailed error handlings or api caching strategies.";
            }
          } else {
            // Senior standard: extremely rigorous
            if (words.length > 80) {
              score = Math.floor(Math.random() * 11) + 76; // 76 to 86
              critique = "Solid senior architecture reasoning, outlining key trade-offs and scaling parameters.";
            } else {
              score = Math.floor(Math.random() * 16) + 45; // 45 to 60
              critique = "Partial senior response. Failed to explain low-level resource cleanups, database locks, or concurrency issues.";
            }
          }
        }

        return {
          question: q.question,
          userAnswer: ans,
          expectedAnswer: aiService.getExpectedAnswerForFallback(q.question, q.tips || []),
          score,
          feedback: critique
        };
      });

      // Calculate cumulative averages
      const totalBreakdownScore = questionBreakdown.reduce((acc, curr) => acc + curr.score, 0);
      let avgScore = Math.round(totalBreakdownScore / questionBreakdown.length);

      // Apply compound weak penalty caps
      if (weakCount === questionBreakdown.length) {
        avgScore = Math.min(15, avgScore);
      } else if (weakCount >= 2) {
        avgScore = Math.min(35, avgScore);
      }

      // Variance offsets
      const variance = () => Math.floor(Math.random() * 5) - 2; // -2 to +2
      const overallScore = Math.max(0, Math.min(100, avgScore));
      const technicalScore = Math.max(0, Math.min(100, overallScore + variance() - 2));
      const communicationScore = Math.max(0, Math.min(100, overallScore + variance() + (weakCount > 0 ? -10 : 3)));
      const confidenceScore = Math.max(0, Math.min(100, overallScore + variance() + (weakCount > 0 ? -12 : 5)));

      // Generate calibrated strengths & weaknesses
      let strengths = [];
      let weaknesses = [];
      let feedback = "";

      if (expTier === "junior") {
        strengths = [
          "Responsive communication and clear basic coding logic",
          "Shows proactive enthusiasm to resolve standard technical questions"
        ];
        weaknesses = [
          "Needs further depth on specific framework parameters and local states",
          "Could avoid using 'I don't know' phrasing by explaining high-level concepts"
        ];
        feedback = `Constructive effort for a junior candidate. You responded with basic structures, but your overall technical score is docked due to key concept gaps. To improve, practice explaining the exact difference between props/state and execution hooks.`;
      } else if (expTier === "mid-level") {
        strengths = [
          "Direct handling of standard application route integrations",
          "Professional articulation of common programming tasks"
        ];
        weaknesses = [
          "Needs deeper tracing of api performance constraints and caching models",
          "Lacked detailed coverage of robust frontend error boundary recovery"
        ];
        feedback = `A reasonable attempt at a mid-level standard. You showed good vocabulary but failed to address key scalability and recovery parameters. Focusing on standard queue patterns and database index optimizations will raise your score.`;
      } else {
        strengths = [
          "Excellent vocabulary regarding standard microservice scaling trade-offs",
          "Logical structural breakdown of system-design challenges"
        ];
        weaknesses = [
          "Failed to cover low-level runtime engine architectures or concurrency limits",
          "Lacked clear explanation of critical memory leak diagnosis and thread safety"
        ];
        feedback = `Rigorously evaluated at a senior engineering standard. While you show decent high-level awareness, your responses lacked the deep, low-level technical specifics expected of a senior engineer. Study database lock mechanisms and node heap allocations closely.`;
      }

      // If extreme penalties applied
      if (overallScore <= 35) {
        feedback = `Evaluation completed strictly. Your scores are capped below 35% because of repeated weak answers or "I don't know" style responses. To succeed in actual interviews, practice explaining the theoretical approach or guessing intelligently.`;
      }

      result = {
        overallScore,
        technicalScore,
        communicationScore,
        confidenceScore,
        strengths,
        weaknesses,
        feedback,
        questionBreakdown
      };
    }

    return result;
  }
};

module.exports = aiService;
