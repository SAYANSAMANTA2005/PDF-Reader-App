import { GoogleGenerativeAI } from "@google/generative-ai";

export const getApiKeys = () => {
    const keys = localStorage.getItem("GEMINI_API_KEYS");
    if (keys) return JSON.parse(keys);

    const primaryKey = localStorage.getItem("GEMINI_API_KEY") || import.meta.env.VITE_GEMINI_API_KEY;
    return primaryKey ? [primaryKey] : [];
};

export const setApiKey = (key) => {
    setApiKeys([key]);
};

export const setApiKeys = (keys) => {
    localStorage.setItem("GEMINI_API_KEYS", JSON.stringify(keys.filter(k => k && k.trim() !== "").slice(0, 5)));
};

export const hasApiKey = () => {
    return getApiKeys().length > 0;
};

const getModel = (key, modelName = "gemini-3-flash-preview") => {
    if (!key) throw new Error("API Key is missing.");
    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({ model: modelName });
};

// Global fallback wrapper with rotation for multiple keys
const callAIFunc = async (prompt, text, modelName = "gemini-3-flash-preview") => {
    const keys = getApiKeys();
    if (keys.length === 0) {
        throw new Error("No API keys found. Please enter your Gemini API keys in the settings.");
    }

    let lastError = null;

    // Try each key in sequence
    for (let i = 0; i < keys.length; i++) {
        try {
            const key = keys[i];
            const model = getModel(key, modelName);
            const fullPrompt = `${prompt}\n\nContent:\n${text}`;
            const result = await model.generateContent(fullPrompt);
            return (await result.response).text();
        } catch (error) {
            lastError = error;
            console.error(`API Key ${i + 1} failed:`, error.message);

            // If it's a quota error or internal error, try next key
            if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("500")) {
                continue;
            }

            // If it's an invalid key and we have more, try next. Otherwise throw.
            if (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID")) {
                if (i === keys.length - 1) {
                    throw new Error("One or more API keys are invalid. Please check your settings.");
                }
                continue;
            }

            // For 404 on specific models, fallback but don't necessarily rotate key immediately unless it continues to fail
            if (error.message.includes("404") && modelName !== "gemini-3-flash-preview") {
                return callAIFunc(prompt, text.substring(0, 10000), "gemini-3-flash-preview");
            }

            // If we've exhausted all keys, throw the last error
            if (i === keys.length - 1) break;
        }
    }

    throw lastError || new Error("Failed to process request with available API keys.");
};

export const clearApiKey = () => {
    localStorage.removeItem("GEMINI_API_KEY");
    localStorage.removeItem("GEMINI_API_KEYS");
};

export const generateSummary = async (text) => {
    const prompt = `Summarize the following PDF content in a professional manner. 
    Focus on key themes, main arguments, and important conclusions. 
    Use bullet points for clarity where appropriate. 
    Keep it concise but comprehensive.`;
    return callAIFunc(prompt, text.substring(0, 50000));
};

export const semanticSearch = async (query, text) => {
    const prompt = `Given the following PDF content, find the most relevant sections or information related to the query: "${query}".
    Return a list of relevant snippets, including the page numbers if available in the text.
    If no relevant information is found, state so.`;
    return callAIFunc(prompt, text.substring(0, 50000));
};

export const getSmartSuggestions = async (text) => {
    const prompt = `Based on the following PDF content, suggest 3 interesting questions or topics that a reader might want to explore further.
    Keep the suggestions short and engaging.`;
    return callAIFunc(prompt, text.substring(0, 50000));
};

export const generateStudyMaterial = async (text, type = "flashcards") => {
    let prompt = "";
    if (type === "flashcards") {
        prompt = `Based on the following PDF text, create 5-8 flashcards for active recall. 
        Each flashcard should have a 'Question' and an 'Answer'. 
        Return them in a clear, labeled format.`;
    } else if (type === "mcqs") {
        prompt = `Based on the following PDF text, create 5 multiple choice questions (MCQs). 
        Each question should have 4 options (A, B, C, D) and indicate the correct answer with a brief explanation.`;
    } else if (type === "viva") {
        prompt = `Based on the following PDF text, generate 5-10 viva/interview questions that test deep understanding of the core concepts. 
        Include a sample 'Ideal Answer' for each.`;
    }
    return callAIFunc(prompt, text.substring(0, 50000));
};

export const generateRevisionMode = async (text) => {
    const prompt = `Convert the following PDF content into a condensed revision sheet.
    Include:
    1. A "Key Concept Map" (summary of main ideas).
    2. A "Formula & Definitions" section (extract any formulas, equations, or critical definitions).
    3. A "Quick Review" checklist.`;
    return callAIFunc(prompt, text.substring(0, 50000));
};

export const generateSocialContent = async (text, platform = "linkedin") => {
    let prompt = "";
    if (platform === "linkedin") {
        prompt = `Create a professional LinkedIn post based on the following content extracted from a PDF. 
        Make it engaging, use relevant hashtags, and structure it for high readability. 
        Focus on insights and value for a professional network.`;
    } else if (platform === "twitter") {
        prompt = `Create an engaging Twitter/X thread (3-5 tweets) based on the following PDF content. 
        Use hook-based writing, emojis, and hashtags. 
        Ensure each tweet is under 280 characters.`;
    } else if (platform === "blog") {
        prompt = `Write a compelling blog post draft based on the following PDF content. 
        Include a catchy title, an introduction, subheadings for main points, and a conclusion.`;
    }
    return callAIFunc(prompt, text.substring(0, 50000));
};

export const generateWebsiteContent = async (text) => {
    const prompt = `Convert the following PDF content into a structured, responsive website layout (represented in clean Markdown/HTML compatible structure).
    Organize the content with a clear navigation hierarchy (H1, H2, H3).
    Add "Sidebars" for key definitions or callouts.
    Make it look like a modern documentation or blog site.`;
    return callAIFunc(prompt, text.substring(0, 50000));
};

/**
 * Ask PDF with Context Awareness
 * Chat with PDF content using contextual understanding
 */
export const askPDFWithContext = async (question, context, selectedText = "", pageRange = "", persona = "Friendly Tutor") => {
    let personaInstructions = "";
    if (persona === "Strict Exam Coach") {
        personaInstructions = "Be rigorous, focus on exam efficiency, drill core concepts, and don't tolerate half-answers. Push the student to be precise.";
    } else if (persona === "Research Advisor") {
        personaInstructions = "Provide academic depth, cite sources meticulously, suggest related research directions, and use formal scholarly tone.";
    } else if (persona === "Explain Like I'm 12") {
        personaInstructions = "Use very simple language, relatable analogies, and avoid all technical jargon. Make it fun and easy.";
    } else {
        personaInstructions = "Be supportive, clear, and encouraging. Use a balanced tone suitable for a high-quality learning session.";
    }

    let prompt = `You are playing the role of a ${persona}. ${personaInstructions}
    
    You are helping a student understand PDF content. 
    
User Question: "${question}"

${pageRange ? `Page Range: ${pageRange}` : ''}
${selectedText ? `Selected Text:\n${selectedText}\n` : ''}

PDF Context:
${context}

Instructions:
1. Answer the question based on the provided context and your assigned persona.
2. If the selected text is provided, focus on it while using broader context for support.
3. Be concise but thorough.
4. Highlight relevant sections from the provided text in your answer.
5. If information is not in the provided context, clearly state that.
6. For complex topics, break down the explanation into digestible parts.`;

    const response = await callAIFunc(prompt, context.substring(0, 80000));
    return response;
};

/**
 * Explain concept at different levels
 */
export const explainConcept = async (text, concept, level = "intermediate") => {
    let prompt = "";

    if (level === "beginner") {
        prompt = `Explain the following concept in simple terms that a beginner can understand. Use analogies and everyday examples. Avoid jargon.
        
Concept: ${concept}`;
    } else if (level === "intermediate") {
        prompt = `Explain the following concept at an intermediate level. Assume basic understanding of the subject.
        
Concept: ${concept}`;
    } else if (level === "advanced") {
        prompt = `Provide an advanced explanation of the following concept with technical depth and nuance.
        
Concept: ${concept}`;
    }

    return callAIFunc(prompt, text.substring(0, 50000));
};

/**
 * Summarize specific pages
 */
export const summarizePageRange = async (text, startPage, endPage) => {
    const prompt = `Summarize the following content from pages ${startPage} to ${endPage} in a concise manner. 
    Focus on key points and main ideas.`;
    return callAIFunc(prompt, text.substring(0, 60000));
};

/**
 * Extract source with answer - tracks where information came from
 */
export const askPDFWithSourceTracking = async (question, context, selectedText = "") => {
    let prompt = `Answer the following question based on the PDF content. 
    
After your answer, provide a "SOURCE" section that indicates exactly where in the text this information came from.

Question: "${question}"

${selectedText ? `Selected Text:\n${selectedText}\n\n` : ''}

Content:
${context}

Format your response as:
[Your detailed answer here]

SOURCE:
[Specify the exact quote or page reference from the PDF that supports this answer]`;

    return callAIFunc(prompt, context.substring(0, 80000));
};
/**
 * Exam Blueprint Mode
 * Generates study plan and revision cycles based on exam target
 */
export const generateExamBlueprint = async (examName, examDate, pdfText) => {
    const prompt = `You are an expert exam strategist. Create a highly detailed study plan for the "${examName}" exam scheduled for ${examDate}.
    
    Based on the following content from study documents:
    ${pdfText.substring(0, 40000)}
    
    Tasks:
    1. Map the syllabus found in the text to major exam topics.
    2. Create a week-by-week study plan leading up to the exam.
    3. Define optimal revision cycles (e.g., Active Recall on Day 1, 3, 7, 14).
    4. Generate 3 high-probability mock questions.
    
    Return the response as a structured markdown report.`;

    return callAIFunc(prompt, pdfText.substring(0, 30000));
};

/**
 * Predictive Exam Readiness
 * Predicts scores and identifies weak spots
 */
export const predictExamReadiness = async (masteryData, filename) => {
    const prompt = `Based on the following student mastery data for the document "${filename}":
    ${JSON.stringify(masteryData)}
    
    Predict:
    1. Expected score range (0-100%).
    2. Top 3 weakest topics that need immediate attention.
    3. Estimated time needed to improve the overall score by 15%.
    4. A motivational tip based on their current progress.
    
    Be objective and data-driven.`;

    return callAIFunc(prompt, JSON.stringify(masteryData));
};

/**
 * Cross-PDF Insight Engine
 * Finds connections and contradictions across multiple sources
 */
export const getCrossPDFInsights = async (currentText, otherPdfsData) => {
    const otherContexts = otherPdfsData.map(d => `[Source: ${d.name}]\n${d.text.substring(0, 5000)}`).join('\n\n');

    const prompt = `You are analyzing multiple textbooks/documents simultaneously. 
    
    Primary Document Content:
    ${currentText.substring(0, 20000)}
    
    Other Source Contexts:
    ${otherContexts}
    
    Task:
    1. Identify if the same concept is explained differently or more intuitively in one of the other sources.
    2. Point out any contradictions or complementary information between these sources.
    3. Provide "Quick Jumps" e.g., "This theorem is explained more intuitively in Source B, Page 74."
    
    Format as a comparison report.`;

    return callAIFunc(prompt, currentText.substring(0, 20000));
};

/**
 * Equation Intelligence
 * Explains math/engineering formulas and derivations
 */
export const explainEquation = async (equationText, surroundingContext = "") => {
    const prompt = `You are an expert mathematician and engineer. 
    
    Selected Equation: "${equationText}"
    
    Context: "${surroundingContext.substring(0, 2000)}"
    
    Explain:
    1. The meaning and significance of this equation.
    2. A step-by-step derivation or logical breakdown.
    3. Real-world applications or where it's typically used later in studies.
    4. Any related equations or concepts.`;

    return callAIFunc(prompt, surroundingContext.substring(0, 5000));
};

/**
 * Personal Knowledge Graph Builder
 * Identifies concepts and their relationships (dependencies)
 */
export const buildKnowledgeGraph = async (text) => {
    const prompt = `Analyze the following text and extract a list of core concepts and their relationships.
    
    Identify:
    1. Concepts (as nodes).
    2. Dependencies (as links, e.g., \"Concept A is a pre-requisite for Concept B\", \"Concept C is related to Concept D\").
    
    Return the result as a JSON object with this structure:
    {
       \"nodes\": [ {\"id\": \"ConceptName\", \"description\": \"Short definition\"} ],
       \"links\": [ {\"source\": \"ConceptA\", \"target\": \"ConceptB\", \"type\": \"requires|related\"} ]
    }
    
    Only return the JSON.`;

    const response = await callAIFunc(prompt, text.substring(0, 40000));
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (e) {
        console.error("Failed to parse knowledge graph JSON", e);
        return { nodes: [], links: [] };
    }
};

/**
 * Estimate Concept Mastery
 * Analyzes behavior and interaction to score understanding
 */
export const estimateMastery = async (behaviorData, concepts) => {
    const prompt = `Based on the following student behavior data:\n` +
        JSON.stringify(behaviorData) +
        ` \n\nAnd these concepts extracted from the material: \n` +
        concepts.join(", ") +
        ` \n\nEstimate the student's mastery score (0-100%) for each concept.
    Consider:
    - Time spent on pages.
    - Number of questions asked.
    - Correctness in past flashcard attempts (if provided).
    
    Return a JSON object: { "ConceptName": score }`;

    const response = await callAIFunc(prompt, JSON.stringify(behaviorData));
    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (e) {
        return {};
    }
};

/**
 * Citation & Reference Explorer
 * Extracts and maps paper citations
 */
export const extractCitations = async (text) => {
    const prompt = `Extract all academic references and citations from this text.
    For each citation, provide:
    1. The paper/book title.
    2. The authors.
    3. The year.
    4. A short snippet explaining where it's cited.
    
    Return as a JSON array of objects.`;

    const response = await callAIFunc(prompt, text.substring(0, 30000));
    try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (e) {
        return [];
    }
};
