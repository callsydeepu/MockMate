import type { Question } from '../context/interview/InterviewContext';

export interface AIGenerationOptions {
  role: string;
  company: string;
  difficulty: 'easy' | 'medium' | 'hard';
  techStack: string;
}

export const aiService = {
  buildPrompt: (options: AIGenerationOptions): string => {
    return `You are a senior technical interviewer at ${options.company}.
Generate exactly 3 realistic interview questions for a candidate applying for the role of ${options.role} with the following tech stack: ${options.techStack}.
The overall interview difficulty is: ${options.difficulty}.

The response MUST be a valid JSON array of objects, and nothing else (do not include any surrounding markdown, explanations, or text before or after the JSON block).
Each object in the array must contain:
1. "question": The full text of the interview question.
2. "category": One of "behavioral", "technical", or "system-design".
3. "difficulty": One of "simple", "moderate", or "advanced".
4. "tips": An array of exactly 3 helpful tips for answering this question.
5. "suggestedDuration": The suggested answering duration in seconds (an integer between 90 and 240).

Respond strictly with a raw JSON array matching this format. Do not wrap it in markdown code blocks (\`\`\`json).`;
  },

  generateQuestions: async (options: AIGenerationOptions): Promise<Question[]> => {
    console.log('[DEBUG] AI generation start - options:', options);
    const puter = (window as any).puter;
    
    if (!puter) {
      console.warn('[DEBUG] AI generation - Puter.js is not loaded. Using highly-tailored local generator fallback.');
      
      // Dynamic local question generation fallback based on techStack / role
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate AI generation time
      
      // Determine categories based on tech stack and role
      const isSystemDesign = options.role.toLowerCase().includes('system') || options.role.toLowerCase().includes('senior') || options.role.toLowerCase().includes('architect');
      const isFrontend = options.techStack.toLowerCase().includes('react') || options.techStack.toLowerCase().includes('vue') || options.techStack.toLowerCase().includes('css') || options.techStack.toLowerCase().includes('html') || options.techStack.toLowerCase().includes('angular');
      
      let fallbackQuestions: Question[] = [];
      
      if (isSystemDesign) {
        fallbackQuestions = [
          {
            id: `ai_fallback_${Date.now()}_0`,
            text: `How would you design a scalable notification service that handles millions of active push notifications daily for a candidate with ${options.techStack}? Describe the queuing mechanisms and push backpressure.`,
            category: 'system-design',
            difficulty: 'advanced',
            suggestedDuration: 210,
            tips: ['Discuss high availability and redundancy.', 'Explain how queuing brokers like RabbitMQ or Kafka resolve spike loads.', 'Detail push notification service backpressures.'],
          },
          {
            id: `ai_fallback_${Date.now()}_1`,
            text: `Given your target role as a ${options.role}, how do you balance database consistency versus availability (CAP theorem) in high-write transactional platforms?`,
            category: 'technical',
            difficulty: 'advanced',
            suggestedDuration: 180,
            tips: ['Describe eventual consistency models.', 'Discuss transaction isolation levels.', 'Contrast SQL multi-region setups with NoSQL document stores.'],
          },
          {
            id: `ai_fallback_${Date.now()}_2`,
            text: 'Describe a time you had to argue for a specific architecture pattern against a manager or team lead. How did you handle the situation?',
            category: 'behavioral',
            difficulty: 'moderate',
            suggestedDuration: 120,
            tips: ['Focus on active communication and consensus-building.', 'Articulate technical trade-offs objectively.', 'Focus on the final positive project outcome.'],
          }
        ];
      } else if (isFrontend) {
        fallbackQuestions = [
          {
            id: `ai_fallback_${Date.now()}_0`,
            text: `Explain how you would optimize a React application that is experiencing slow rendering times while rendering large list components. How do tools in your stack (${options.techStack}) solve this?`,
            category: 'technical',
            difficulty: options.difficulty === 'hard' ? 'advanced' : 'moderate',
            suggestedDuration: 180,
            tips: ['Discuss virtualized lists (react-window or react-virtualized).', 'Explain React.memo, useMemo, and useCallback hook optimizations.', 'Discuss how browser profiling helps isolate re-render triggers.'],
          },
          {
            id: `ai_fallback_${Date.now()}_1`,
            text: `Describe the differences between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR). How does your tech stack (${options.techStack}) adapt to these?`,
            category: 'technical',
            difficulty: 'moderate',
            suggestedDuration: 150,
            tips: ['Explain the initial page load speed trade-offs.', 'Discuss SEO implications for crawl bots.', 'Discuss hydrations and bundle chunk sizes.'],
          },
          {
            id: `ai_fallback_${Date.now()}_2`,
            text: 'Describe a challenging UI rendering bug you solved. What was your systematic debugging approach, and what did you learn?',
            category: 'behavioral',
            difficulty: 'simple',
            suggestedDuration: 120,
            tips: ['Use the STAR method structure.', 'Explain how browser inspector consoles helped track elements.', 'Focus on prevention models learned.'],
          }
        ];
      } else {
        // General backup
        fallbackQuestions = [
          {
            id: `ai_fallback_${Date.now()}_0`,
            text: `What are the core design practices and architectural best practices you follow when building services using: ${options.techStack}?`,
            category: 'technical',
            difficulty: 'moderate',
            suggestedDuration: 150,
            tips: ['Discuss clean code paradigms and SOLID principles.', 'Explain design patterns like Singleton, Factory, or Repository.', 'Detail automated testing strategies.'],
          },
          {
            id: `ai_fallback_${Date.now()}_1`,
            text: `How do you handle scaling and caching strategies (e.g. Redis, CDN) when building web applications for the role of ${options.role}?`,
            category: 'technical',
            difficulty: 'advanced',
            suggestedDuration: 180,
            tips: ['Describe cache invalidation strategies.', 'Discuss horizontal vs. vertical scaling.', 'Detail edge routing caching benefits.'],
          },
          {
            id: `ai_fallback_${Date.now()}_2`,
            text: 'Describe a time you had to adapt quickly to a major change in project requirements. How did you adjust your timeline and technical approaches?',
            category: 'behavioral',
            difficulty: 'moderate',
            suggestedDuration: 120,
            tips: ['Focus on flexibility and proactive communications.', 'Explain how agile sprints were restructured.', 'Focus on quality preservation.'],
          }
        ];
      }

      console.log('[DEBUG] AI generation local fallback success - compiled questions:', fallbackQuestions);
      return fallbackQuestions;
    }

    const prompt = aiService.buildPrompt(options);
    console.log('[DEBUG] prompt creation - compiled prompt:', prompt);

    try {
      // Puter.js v2 API for LLM chat with x-ai/grok-4 model
      const response = await puter.ai.chat(prompt, { model: 'x-ai/grok-4' });
      console.log('[DEBUG] Grok API response:', response);

      const responseText = typeof response === 'string' ? response : response?.message?.content || JSON.stringify(response);
      
      console.log('[DEBUG] parsing AI response - raw response text:', responseText);

      // Sanitize response text in case Grok wraps it in markdown code blocks
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3);
      }
      cleanedText = cleanedText.trim();

      const parsedArray = JSON.parse(cleanedText);

      if (!Array.isArray(parsedArray)) {
        throw new Error('Grok response is not a valid JSON array');
      }

      const questions: Question[] = parsedArray.map((item: any, index: number) => {
        // Ensure no undefined/null values are stored
        return {
          id: `ai_q_${Date.now()}_${index}`,
          text: item.question || 'Explain your experience with technical problem-solving.',
          category: item.category || 'technical',
          difficulty: item.difficulty || 'moderate',
          suggestedDuration: Number(item.suggestedDuration) || 120,
          tips: Array.isArray(item.tips) ? item.tips : ['Utilize the STAR format.', 'Explain spatial trade-offs.', 'Keep it concise.'],
        };
      });

      console.log('[DEBUG] AI generation success - compiled questions:', questions);
      return questions;
    } catch (err: any) {
      console.error('[DEBUG] AI generation error - Exception:', err);
      throw err;
    }
  }
};
