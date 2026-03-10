from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from ..config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    context: str = ""  # optional: current project info, user skills, etc.


class ChatResponse(BaseModel):
    reply: str
    source: str = "gemini"


@router.post("/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """
    Chat with the AI assistant. Uses Gemini API or falls back to smart demo responses.
    """
    try:
        if not settings.is_ai_demo and settings.GEMINI_API_KEY:
            return await _gemini_chat(request)
        else:
            return ChatResponse(
                reply=_smart_demo_response(request.message, request.context),
                source="demo"
            )
    except Exception as e:
        # Log error, then fallback to demo
        logger.warning(f"Gemini chat error: {e}")
        return ChatResponse(
            reply=_smart_demo_response(request.message, request.context),
            source="demo-fallback"
        )


async def _gemini_chat(request: ChatRequest) -> ChatResponse:
    """Use Google Gemini for real AI responses."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    system_context = """You are a helpful AI learning assistant for SanaPath AI, 
a platform that helps students find and build AI/ML projects. You are part of the AI-Sana ecosystem 
with 60,000+ students.

Your capabilities:
- Help students understand AI/ML concepts
- Suggest project ideas based on their skills
- Provide coding tips and debugging help
- Recommend learning resources (YouTube tutorials, documentation, courses)
- Motivate and encourage students

Keep responses concise (max 300 words), use markdown formatting with bold and bullet points.
Be friendly, encouraging, and practical. Always suggest actionable next steps.
If the student mentions a specific technology, provide relevant tips and resources."""

    if request.context:
        system_context += f"\n\nUser context: {request.context}"

    prompt = f"{system_context}\n\nStudent's question: {request.message}"

    # Try stable models in fallback order on quota/availability errors
    models = ["gemini-2.0-flash", "gemini-2.0-flash-lite"]
    last_error = None
    for model in models:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=1000,
                ),
            )
            return ChatResponse(reply=response.text, source=f"gemini-{model}")
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                logger.warning(f"Chat model {model} hit 429, trying next...")
                last_error = e
                continue
            if "404" in error_str or "NOT_FOUND" in error_str:
                logger.warning(f"Chat model {model} not available, trying next...")
                last_error = e
                continue
            raise
    raise Exception(f"No available Gemini chat model could complete the request: {last_error}")


def _smart_demo_response(message: str, context: str = "") -> str:
    """Generate smart demo responses based on keywords."""
    msg = message.lower()

    # Project-related
    if any(w in msg for w in ["project", "build", "create", "make", "idea"]):
        return """Great question! Here are some project ideas based on popular trends:

🎯 **Computer Vision**: Build a real-time object detection system with YOLO and OpenCV
🗣️ **NLP**: Create a sentiment analyzer or chatbot using Transformers
📊 **Data Science**: Build a predictive analytics dashboard with Streamlit
🤖 **Reinforcement Learning**: Train an agent to play a game

**To get personalized recommendations**, take our AI Survey — it analyzes your skills, interests, and goals to suggest 5 perfect projects with detailed roadmaps!

👉 Click **Survey** in the navigation bar to get started."""

    # Learning / resources
    if any(w in msg for w in ["learn", "tutorial", "course", "resource", "study", "book"]):
        return """Here are my top learning resource recommendations:

📚 **Beginner**:
• [Python for Everybody](https://www.py4e.com/) — Free online course
• [fast.ai](https://www.fast.ai/) — Practical deep learning

🧠 **Intermediate**:
• [Hugging Face Course](https://huggingface.co/learn) — NLP & Transformers
• [CS50 AI](https://cs50.harvard.edu/ai/) — Harvard's AI intro

🚀 **Advanced**:
• [Full Stack Deep Learning](https://fullstackdeeplearning.com/) — Production ML
• [Papers With Code](https://paperswithcode.com/) — Latest research

💡 **Tip**: Each task in your SanaPath roadmap already includes curated video tutorials and docs. Start a project to access them!"""

    # Code / debug
    if any(w in msg for w in ["code", "debug", "error", "bug", "fix", "python", "import"]):
        return """I can help with coding issues! Here are some common tips:

🐛 **Common Python Errors**:
• `ModuleNotFoundError` → Run `pip install <package_name>`
• `IndentationError` → Check consistent spaces/tabs
• `TypeError` → Verify data types match expected inputs

🔧 **Debugging Steps**:
1. Read the full error traceback (last line = actual error)
2. Add `print()` statements to check variable values
3. Use `try/except` to handle edge cases
4. Search the error message on Stack Overflow

💡 **Pro Tips**:
• Use `breakpoint()` for Python debugger
• Install `pylint` for code quality checks
• Write unit tests with `pytest`

Paste your error message here and I'll help you diagnose it! 🚀"""

    # AI/ML concepts
    if any(w in msg for w in ["explain", "what is", "how does", "concept", "neural", "machine learning", "deep learning", "ai"]):
        return """Great question about AI/ML concepts! Let me break it down:

🧠 **Machine Learning**: Algorithms that learn patterns from data without explicit programming.

📊 **Key Types**:
• **Supervised Learning** — Training with labeled data (classification, regression)
• **Unsupervised Learning** — Finding patterns in unlabeled data (clustering)
• **Reinforcement Learning** — Learning through rewards and actions

🔥 **Deep Learning** is a subset of ML using neural networks with many layers. Popular architectures:
• **CNN** — Image recognition & computer vision
• **RNN/LSTM** — Sequential data & time series
• **Transformer** — NLP (GPT, BERT) & modern AI

💡 **Start Practical**: Take our survey to get a project that teaches these concepts through building, not just theory!

What specific concept would you like me to explain further?"""

    # Career
    if any(w in msg for w in ["career", "job", "interview", "resume", "portfolio", "salary", "hire"]):
        return """Great career question! Here's how to stand out in AI:

📋 **Build Your Portfolio**:
• Complete 2-3 SanaPath projects with full documentation
• Share certificates on LinkedIn
• Push code to GitHub with clean README files

🎯 **Top In-Demand AI Skills (2026)**:
• Python + PyTorch/TensorFlow
• LLMs & Prompt Engineering
• MLOps (Docker, CI/CD, cloud deployment)
• Data Engineering (SQL, Spark, Airflow)

💼 **Interview Prep**:
• Practice on LeetCode + ML-specific questions
• Prepare case studies from your SanaPath projects
• Know system design basics for ML pipelines

🚀 **Career Tip**: Sharing your project progress on LinkedIn with #BuildInPublic gets you noticed by recruiters. Use our LinkedIn share feature after each milestone!"""

    # Motivation / help
    if any(w in msg for w in ["help", "stuck", "motivation", "hard", "difficult", "overwhelm"]):
        return """I hear you — learning AI can feel overwhelming at times. But you've got this! 💪

🌟 **Remember**:
• Every expert was once a beginner
• Progress > perfection
• Small daily steps compound into massive results

📌 **If You're Stuck**:
1. Break the task into smaller subtasks
2. Watch the video tutorial for your current task
3. Search the error message online
4. Ask in the Community — other students can help!

🔥 **Stay Motivated**:
• Maintain your daily streak (even 15 min counts!)
• Celebrate each completed task
• Share your wins on LinkedIn

You're part of a community of 60,000+ students all on the same journey. You are NOT alone! 🚀

What specific task are you struggling with?"""

    # Greeting
    if any(w in msg for w in ["hello", "hi", "hey", "привет", "сәлем", "assalomu"]):
        return """Hello! 👋 I'm your SanaPath AI assistant, part of the AI-Sana ecosystem.

I can help you with:
• 🎯 **Project Ideas** — Personalized AI project recommendations
• 📚 **Learning Resources** — Tutorials, courses, and documentation
• 🐛 **Code Help** — Debug errors and optimize your code
• 🧠 **AI Concepts** — Explain ML topics in simple terms
• 💼 **Career Advice** — Portfolio tips, interview prep, and more

What would you like to explore today? 🚀"""

    # Default
    return f"""That's an interesting question! Let me share some thoughts:

🤔 Based on your question about "*{message[:50]}{'...' if len(message) > 50 else ''}*", here are some resources:

• Take our **AI Survey** for personalized project recommendations
• Check the **Community** board to see what others are building
• Browse your project **Roadmap** for step-by-step tutorials

💡 **Tip**: I work best when you ask about:
• Specific AI/ML concepts
• Project ideas for your skill level
• Coding errors and debugging
• Learning resources and career advice

Try asking something like "Suggest a beginner ML project" or "Explain how neural networks work"! 🚀"""
