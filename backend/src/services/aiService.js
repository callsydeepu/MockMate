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
  }
};

module.exports = aiService;
