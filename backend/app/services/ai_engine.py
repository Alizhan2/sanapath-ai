import json
from typing import List
from openai import OpenAI
from anthropic import Anthropic
from google import genai
from google.genai import types
from ..config import settings
from ..models.survey import SurveyResponse, ProjectRecommendation, ProjectRoadmapWeek, RecommendationResponse

SYSTEM_PROMPT = """You are an expert AI career counselor and project recommendation engine for the SanaPath AI platform, serving 60,000 students in the AI-Sana ecosystem.

Your role is to analyze student profiles and recommend personalized AI/ML project ideas that match their skills, interests, and career goals.

For each recommendation, you must provide:
1. A compelling project title
2. A detailed description (2-3 sentences)
3. Difficulty level (Beginner, Intermediate, Advanced, Expert)
4. Complete tech stack (programming languages, frameworks, tools)
5. Estimated duration
6. Key learning outcomes (3-5 bullet points)
7. A DETAILED 4-week implementation roadmap where EACH TASK includes:
   - Clear step-by-step instructions
   - Helpful resources (YouTube tutorials, documentation links, articles)
   - Estimated time for completion
8. Relevant tags for discoverability

IMPORTANT: Your response must be valid JSON matching this exact structure:
{
    "recommendations": [
        {
            "title": "Project Title",
            "description": "Detailed description...",
            "difficulty_level": "Intermediate",
            "tech_stack": ["Python", "TensorFlow", "FastAPI"],
            "estimated_duration": "4 weeks",
            "learning_outcomes": ["outcome1", "outcome2", "outcome3"],
            "roadmap": [
                {
                    "week": 1,
                    "title": "Week 1: Foundation",
                    "tasks": [
                        {
                            "name": "Set up development environment",
                            "description": "Install Python, create virtual environment, install required packages",
                            "steps": [
                                "Install Python 3.10+ from python.org",
                                "Create virtual environment: python -m venv venv",
                                "Install packages: pip install tensorflow numpy pandas"
                            ],
                            "resources": [
                                {"title": "Python Installation Guide", "url": "https://www.python.org/downloads/", "type": "docs"},
                                {"title": "TensorFlow Setup Tutorial", "url": "https://www.tensorflow.org/install", "type": "docs"},
                                {"title": "Python Virtual Environments", "url": "https://www.youtube.com/watch?v=APOPm01BVrk", "type": "video"}
                            ],
                            "estimated_time": "2 hours"
                        }
                    ],
                    "deliverables": ["Working development environment", "Project repository on GitHub"]
                }
            ],
            "tags": ["NLP", "Deep Learning", "Healthcare"]
        }
    ],
    "personalization_summary": "Summary of why these projects match the student..."
}

CRITICAL: Each task MUST have detailed steps and real working resource links (YouTube, official docs, tutorials). Generate exactly 1 unique project recommendation."""


def build_user_prompt(survey: SurveyResponse) -> str:
    return f"""
Student Profile:
- Name: {survey.name}
- University: {survey.university or 'Not specified'}
- Programming Languages: {', '.join(survey.programming_languages)}
- Skill Level: {survey.skill_level}
- AI/ML Experience: {survey.ai_ml_experience}
- Interest Areas: {', '.join(survey.interest_areas)}
- Preferred Project Type: {survey.preferred_project_type}
- Industries of Interest: {', '.join(survey.industry_interest)}
- Career Goal: {survey.career_goal}
- Learning Style: {survey.learning_style}
- Time Commitment: {survey.time_commitment}
- Preferred Duration: {survey.project_duration}
- Team Preference: {survey.team_preference}
- Collaboration Tools: {', '.join(survey.collaboration_tools)}

Based on this comprehensive profile, generate exactly 1 personalized AI project recommendation with a detailed 4-week roadmap. Ensure the project aligns with the student's skill level, interests, and career goals.
"""


async def get_recommendations_openai(survey: SurveyResponse) -> RecommendationResponse:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(survey)}
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
        max_tokens=4000
    )
    
    result = json.loads(response.choices[0].message.content)
    
    recommendations = []
    for rec in result["recommendations"]:
        roadmap = [ProjectRoadmapWeek(**week) for week in rec["roadmap"]]
        recommendations.append(ProjectRecommendation(
            title=rec["title"],
            description=rec["description"],
            difficulty_level=rec["difficulty_level"],
            tech_stack=rec["tech_stack"],
            estimated_duration=rec["estimated_duration"],
            learning_outcomes=rec["learning_outcomes"],
            roadmap=roadmap,
            tags=rec["tags"]
        ))
    
    return RecommendationResponse(
        student_name=survey.name,
        recommendations=recommendations,
        personalization_summary=result["personalization_summary"]
    )


async def get_recommendations_anthropic(survey: SurveyResponse) -> RecommendationResponse:
    client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": build_user_prompt(survey)}
        ]
    )
    
    result = json.loads(response.content[0].text)
    
    recommendations = []
    for rec in result["recommendations"]:
        roadmap = [ProjectRoadmapWeek(**week) for week in rec["roadmap"]]
        recommendations.append(ProjectRecommendation(
            title=rec["title"],
            description=rec["description"],
            difficulty_level=rec["difficulty_level"],
            tech_stack=rec["tech_stack"],
            estimated_duration=rec["estimated_duration"],
            learning_outcomes=rec["learning_outcomes"],
            roadmap=roadmap,
            tags=rec["tags"]
        ))
    
    return RecommendationResponse(
        student_name=survey.name,
        recommendations=recommendations,
        personalization_summary=result["personalization_summary"]
    )


async def get_recommendations_gemini(survey: SurveyResponse) -> RecommendationResponse:
    """Get recommendations using Google Gemini AI"""
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    prompt = f"""{SYSTEM_PROMPT}

{build_user_prompt(survey)}

IMPORTANT: Respond ONLY with valid JSON, no additional text or markdown.
You MUST follow the schema exactly as defined."""

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.7,
            max_output_tokens=8192,
            response_mime_type="application/json",
            response_schema=RecommendationResponse,
        )
    )
    
    # Extract JSON from response
    response_text = response.text
    
    result = json.loads(response_text.strip())
    
    recommendations = []
    for rec in result["recommendations"]:
        roadmap = [ProjectRoadmapWeek(**week) for week in rec["roadmap"]]
        recommendations.append(ProjectRecommendation(
            title=rec["title"],
            description=rec["description"],
            difficulty_level=rec["difficulty_level"],
            tech_stack=rec["tech_stack"],
            estimated_duration=rec["estimated_duration"],
            learning_outcomes=rec["learning_outcomes"],
            roadmap=roadmap,
            tags=rec["tags"]
        ))
    
    return RecommendationResponse(
        student_name=survey.name,
        recommendations=recommendations,
        personalization_summary=result["personalization_summary"]
    )


def generate_demo_recommendations(survey: SurveyResponse) -> RecommendationResponse:
    """Generate smart demo recommendations based on user interests without API"""
    from ..models.survey import TaskDetail, TaskResource
    
    # Detailed project templates with resources
    project_templates = {
        "Computer Vision": {
            "title": "🎯 Smart Object Detection System",
            "description": "Build a real-time object detection system using YOLO and OpenCV. Create an application that can identify and track multiple objects in video streams with high accuracy.",
            "tech_stack": ["Python", "PyTorch", "YOLO", "OpenCV", "Streamlit"],
            "tags": ["Computer Vision", "Deep Learning", "Real-time AI"],
            "roadmap": [
                {
                    "week": 1,
                    "title": "Week 1: Environment Setup & Fundamentals",
                    "tasks": [
                        {
                            "name": "Set up Python development environment",
                            "description": "Install Python, create virtual environment, and configure IDE",
                            "steps": [
                                "Download and install Python 3.10+ from python.org",
                                "Create virtual environment: python -m venv venv",
                                "Activate environment: venv\\Scripts\\activate (Windows)",
                                "Install VS Code with Python extension",
                                "Configure linting and formatting"
                            ],
                            "resources": [
                                {"title": "Python Installation Guide", "url": "https://www.python.org/downloads/", "type": "docs"},
                                {"title": "VS Code Python Setup", "url": "https://code.visualstudio.com/docs/python/python-tutorial", "type": "docs"},
                                {"title": "Virtual Environments Tutorial", "url": "https://www.youtube.com/watch?v=APOPm01BVrk", "type": "video"}
                            ],
                            "estimated_time": "2 hours"
                        },
                        {
                            "name": "Install PyTorch and OpenCV",
                            "description": "Set up deep learning frameworks and computer vision libraries",
                            "steps": [
                                "Visit pytorch.org and select your configuration",
                                "Install PyTorch: pip install torch torchvision",
                                "Install OpenCV: pip install opencv-python",
                                "Install additional libraries: pip install numpy matplotlib",
                                "Verify installation with test script"
                            ],
                            "resources": [
                                {"title": "PyTorch Installation", "url": "https://pytorch.org/get-started/locally/", "type": "docs"},
                                {"title": "OpenCV Python Tutorial", "url": "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html", "type": "docs"},
                                {"title": "PyTorch Crash Course", "url": "https://www.youtube.com/watch?v=V_xro1bcAuA", "type": "video"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Learn YOLO fundamentals",
                            "description": "Understand YOLO architecture and object detection concepts",
                            "steps": [
                                "Read about CNN fundamentals and feature extraction",
                                "Understand YOLO architecture (backbone, neck, head)",
                                "Learn about anchor boxes and IoU",
                                "Study non-maximum suppression (NMS)",
                                "Review YOLOv8 improvements over previous versions"
                            ],
                            "resources": [
                                {"title": "YOLO Official Documentation", "url": "https://docs.ultralytics.com/", "type": "docs"},
                                {"title": "YOLO Explained", "url": "https://www.youtube.com/watch?v=n9_XyCGr-MI", "type": "video"},
                                {"title": "Object Detection Guide", "url": "https://www.analyticsvidhya.com/blog/2018/12/practical-guide-object-detection-yolo-framewor-python/", "type": "article"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Configured development environment", "Understanding of YOLO architecture"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Core Model Implementation",
                    "tasks": [
                        {
                            "name": "Download and test pre-trained YOLO model",
                            "description": "Get YOLOv8 working with pre-trained weights",
                            "steps": [
                                "Install ultralytics: pip install ultralytics",
                                "Download YOLOv8 pre-trained model",
                                "Test on sample images",
                                "Understand model output format",
                                "Experiment with different model sizes (n, s, m, l, x)"
                            ],
                            "resources": [
                                {"title": "YOLOv8 Quickstart", "url": "https://docs.ultralytics.com/quickstart/", "type": "docs"},
                                {"title": "YOLOv8 Tutorial", "url": "https://www.youtube.com/watch?v=WgPbbWmnXJ8", "type": "video"},
                                {"title": "COCO Dataset Classes", "url": "https://cocodataset.org/#explore", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Implement real-time video detection",
                            "description": "Process video stream and detect objects in real-time",
                            "steps": [
                                "Set up OpenCV video capture from webcam",
                                "Create frame processing loop",
                                "Run YOLO inference on each frame",
                                "Draw bounding boxes with labels and confidence",
                                "Optimize for real-time performance (FPS)"
                            ],
                            "resources": [
                                {"title": "OpenCV Video Capture", "url": "https://docs.opencv.org/4.x/dd/d43/tutorial_py_video_display.html", "type": "docs"},
                                {"title": "Real-time Detection Tutorial", "url": "https://www.youtube.com/watch?v=WQeoO7MI0Bs", "type": "video"},
                                {"title": "Drawing on Images", "url": "https://docs.opencv.org/4.x/dc/da5/tutorial_py_drawing_functions.html", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Add object tracking",
                            "description": "Track detected objects across frames",
                            "steps": [
                                "Learn about tracking algorithms (SORT, DeepSORT)",
                                "Install tracking library: pip install supervision",
                                "Implement object ID assignment",
                                "Track object paths over time",
                                "Handle object occlusion and re-identification"
                            ],
                            "resources": [
                                {"title": "Supervision Library", "url": "https://supervision.roboflow.com/", "type": "docs"},
                                {"title": "Object Tracking Explained", "url": "https://www.youtube.com/watch?v=O3b8lVF93jU", "type": "video"},
                                {"title": "DeepSORT Paper", "url": "https://arxiv.org/abs/1703.07402", "type": "article"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Working detection script", "Real-time video processing", "Object tracking"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Web Interface & Features",
                    "tasks": [
                        {
                            "name": "Build Streamlit web interface",
                            "description": "Create interactive web app for object detection",
                            "steps": [
                                "Install Streamlit: pip install streamlit",
                                "Create main app.py structure",
                                "Add file upload component for images/videos",
                                "Display detection results with visualizations",
                                "Add sidebar with configuration options"
                            ],
                            "resources": [
                                {"title": "Streamlit Documentation", "url": "https://docs.streamlit.io/", "type": "docs"},
                                {"title": "Streamlit Crash Course", "url": "https://www.youtube.com/watch?v=VqgUkExPvLY", "type": "video"},
                                {"title": "Streamlit Gallery", "url": "https://streamlit.io/gallery", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Add custom model training capability",
                            "description": "Allow users to train on custom datasets",
                            "steps": [
                                "Prepare dataset in YOLO format (images + labels)",
                                "Create data.yaml configuration file",
                                "Set up training parameters",
                                "Implement training with progress tracking",
                                "Save and load custom trained models"
                            ],
                            "resources": [
                                {"title": "YOLOv8 Training Guide", "url": "https://docs.ultralytics.com/modes/train/", "type": "docs"},
                                {"title": "Roboflow Dataset Tools", "url": "https://roboflow.com/", "type": "docs"},
                                {"title": "Custom Training Tutorial", "url": "https://www.youtube.com/watch?v=gRAyOPjQ9_s", "type": "video"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Implement analytics dashboard",
                            "description": "Show detection statistics and insights",
                            "steps": [
                                "Track object counts over time",
                                "Create charts with Plotly/Matplotlib",
                                "Add heatmap visualization for object locations",
                                "Export detection logs to CSV",
                                "Generate detection summary reports"
                            ],
                            "resources": [
                                {"title": "Plotly Python", "url": "https://plotly.com/python/", "type": "docs"},
                                {"title": "Data Visualization Tutorial", "url": "https://www.youtube.com/watch?v=GGL6U0k8WYA", "type": "video"},
                                {"title": "Streamlit Charts", "url": "https://docs.streamlit.io/library/api-reference/charts", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        }
                    ],
                    "deliverables": ["Streamlit web app", "Custom training feature", "Analytics dashboard"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Deployment & Documentation",
                    "tasks": [
                        {
                            "name": "Deploy to Streamlit Cloud",
                            "description": "Make your app accessible online",
                            "steps": [
                                "Create requirements.txt with all dependencies",
                                "Push code to GitHub repository",
                                "Connect Streamlit Cloud to GitHub",
                                "Configure deployment settings",
                                "Test deployed application"
                            ],
                            "resources": [
                                {"title": "Streamlit Cloud Deployment", "url": "https://docs.streamlit.io/streamlit-community-cloud/deploy-your-app", "type": "docs"},
                                {"title": "Deploy Tutorial", "url": "https://www.youtube.com/watch?v=HKoOBiAaHGg", "type": "video"},
                                {"title": "GitHub Guide", "url": "https://docs.github.com/en/get-started", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Write comprehensive documentation",
                            "description": "Document your project for portfolio",
                            "steps": [
                                "Write detailed README.md with screenshots",
                                "Add installation and usage instructions",
                                "Document API/code with docstrings",
                                "Create architecture diagram",
                                "Add license and contribution guidelines"
                            ],
                            "resources": [
                                {"title": "README Template", "url": "https://www.makeareadme.com/", "type": "docs"},
                                {"title": "Technical Writing Guide", "url": "https://www.youtube.com/watch?v=E6NO0rgFub4", "type": "video"},
                                {"title": "Markdown Guide", "url": "https://www.markdownguide.org/", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Create demo video",
                            "description": "Record a compelling project demonstration",
                            "steps": [
                                "Plan demo script covering all features",
                                "Set up screen recording (OBS Studio)",
                                "Record demo with voiceover",
                                "Edit video (trim, add captions)",
                                "Upload to YouTube and LinkedIn"
                            ],
                            "resources": [
                                {"title": "OBS Studio", "url": "https://obsproject.com/", "type": "docs"},
                                {"title": "How to Make Demo Videos", "url": "https://www.youtube.com/watch?v=iP4KyHT4yWs", "type": "video"},
                                {"title": "Video Editing Tips", "url": "https://www.youtube.com/watch?v=bFVoMPYPaPQ", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Live deployed app", "Full documentation", "Demo video"]
                }
            ]
        },
        "NLP": {
            "title": "💬 AI-Powered Sentiment Analyzer",
            "description": "Develop a sentiment analysis tool using transformer models that analyzes text from social media, reviews, and customer feedback to extract emotional insights.",
            "tech_stack": ["Python", "Hugging Face", "BERT", "FastAPI", "React"],
            "tags": ["NLP", "Transformers", "Text Analysis"],
            "roadmap": [
                {
                    "week": 1,
                    "title": "Week 1: NLP Fundamentals & Setup",
                    "tasks": [
                        {
                            "name": "Set up NLP development environment",
                            "description": "Install necessary libraries for NLP work",
                            "steps": [
                                "Create Python virtual environment",
                                "Install transformers: pip install transformers",
                                "Install torch: pip install torch",
                                "Install datasets: pip install datasets",
                                "Set up Jupyter notebook for experimentation"
                            ],
                            "resources": [
                                {"title": "Hugging Face Course", "url": "https://huggingface.co/learn/nlp-course", "type": "docs"},
                                {"title": "Transformers Tutorial", "url": "https://www.youtube.com/watch?v=QEaBAZQCtwE", "type": "video"},
                                {"title": "NLP with Python", "url": "https://www.nltk.org/book/", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Learn transformer architecture",
                            "description": "Understand how BERT and transformers work",
                            "steps": [
                                "Read 'Attention is All You Need' paper summary",
                                "Understand self-attention mechanism",
                                "Learn about tokenization and embeddings",
                                "Study BERT architecture and pre-training",
                                "Explore different transformer variants"
                            ],
                            "resources": [
                                {"title": "Illustrated Transformer", "url": "http://jalammar.github.io/illustrated-transformer/", "type": "article"},
                                {"title": "BERT Explained", "url": "https://www.youtube.com/watch?v=xI0HHN5XKDo", "type": "video"},
                                {"title": "Hugging Face Docs", "url": "https://huggingface.co/docs/transformers/", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Explore sentiment datasets",
                            "description": "Find and prepare training data",
                            "steps": [
                                "Browse Hugging Face datasets hub",
                                "Download IMDB or SST-2 dataset",
                                "Analyze data distribution and labels",
                                "Clean and preprocess text data",
                                "Create train/validation/test splits"
                            ],
                            "resources": [
                                {"title": "Hugging Face Datasets", "url": "https://huggingface.co/datasets", "type": "docs"},
                                {"title": "Data Preprocessing", "url": "https://www.youtube.com/watch?v=Yq4c2SVcxYQ", "type": "video"},
                                {"title": "IMDB Dataset", "url": "https://huggingface.co/datasets/imdb", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        }
                    ],
                    "deliverables": ["Environment setup", "Understanding of transformers", "Prepared dataset"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Model Training & Fine-tuning",
                    "tasks": [
                        {
                            "name": "Fine-tune BERT for sentiment analysis",
                            "description": "Train a custom sentiment classification model",
                            "steps": [
                                "Load pre-trained BERT model from Hugging Face",
                                "Add classification head for sentiment",
                                "Configure training arguments",
                                "Train with Trainer API",
                                "Monitor training metrics"
                            ],
                            "resources": [
                                {"title": "Fine-tuning Guide", "url": "https://huggingface.co/docs/transformers/training", "type": "docs"},
                                {"title": "BERT Fine-tuning Tutorial", "url": "https://www.youtube.com/watch?v=NQNiX3-qpw4", "type": "video"},
                                {"title": "Training Tips", "url": "https://huggingface.co/docs/transformers/perf_train_gpu_one", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Evaluate and optimize model",
                            "description": "Test model performance and improve it",
                            "steps": [
                                "Calculate accuracy, F1, precision, recall",
                                "Analyze confusion matrix",
                                "Try different learning rates and epochs",
                                "Experiment with data augmentation",
                                "Compare with different base models"
                            ],
                            "resources": [
                                {"title": "Model Evaluation", "url": "https://scikit-learn.org/stable/modules/model_evaluation.html", "type": "docs"},
                                {"title": "Hyperparameter Tuning", "url": "https://www.youtube.com/watch?v=5dSc2JEcbB0", "type": "video"},
                                {"title": "Weights & Biases", "url": "https://wandb.ai/", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Add multi-language support",
                            "description": "Extend to analyze text in multiple languages",
                            "steps": [
                                "Research multilingual models (mBERT, XLM-RoBERTa)",
                                "Download multilingual pre-trained model",
                                "Test on non-English text",
                                "Fine-tune on multilingual dataset",
                                "Add language detection"
                            ],
                            "resources": [
                                {"title": "Multilingual BERT", "url": "https://huggingface.co/bert-base-multilingual-cased", "type": "docs"},
                                {"title": "XLM-RoBERTa", "url": "https://huggingface.co/xlm-roberta-base", "type": "docs"},
                                {"title": "Multilingual NLP", "url": "https://www.youtube.com/watch?v=P3yH6L9bxmY", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Fine-tuned model", "Evaluation report", "Multilingual capability"]
                },
                {
                    "week": 3,
                    "title": "Week 3: API & Frontend Development",
                    "tasks": [
                        {
                            "name": "Build FastAPI backend",
                            "description": "Create REST API for sentiment analysis",
                            "steps": [
                                "Install FastAPI: pip install fastapi uvicorn",
                                "Create main.py with API routes",
                                "Implement /analyze endpoint",
                                "Add batch processing endpoint",
                                "Configure CORS for frontend"
                            ],
                            "resources": [
                                {"title": "FastAPI Documentation", "url": "https://fastapi.tiangolo.com/", "type": "docs"},
                                {"title": "FastAPI Full Course", "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA", "type": "video"},
                                {"title": "FastAPI + ML", "url": "https://www.youtube.com/watch?v=CmV_FnJKr-w", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Create React frontend",
                            "description": "Build interactive user interface",
                            "steps": [
                                "Create React app: npx create-react-app frontend",
                                "Design sentiment input form",
                                "Add result visualization with charts",
                                "Implement history of analyses",
                                "Add loading states and error handling"
                            ],
                            "resources": [
                                {"title": "React Documentation", "url": "https://react.dev/", "type": "docs"},
                                {"title": "React Tutorial", "url": "https://www.youtube.com/watch?v=bMknfKXIFA8", "type": "video"},
                                {"title": "Chart.js for React", "url": "https://react-chartjs-2.js.org/", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Add social media integration",
                            "description": "Analyze tweets and social posts",
                            "steps": [
                                "Set up Twitter API access",
                                "Implement tweet fetching by keyword/user",
                                "Process tweets through sentiment model",
                                "Display sentiment trends over time",
                                "Add export functionality"
                            ],
                            "resources": [
                                {"title": "Twitter API", "url": "https://developer.twitter.com/en/docs", "type": "docs"},
                                {"title": "Tweepy Library", "url": "https://www.tweepy.org/", "type": "docs"},
                                {"title": "Social Media Analysis", "url": "https://www.youtube.com/watch?v=ujId4ipkBio", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["REST API", "React frontend", "Social media integration"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Deployment & Polish",
                    "tasks": [
                        {
                            "name": "Deploy backend to Railway/Render",
                            "description": "Host API on cloud platform",
                            "steps": [
                                "Create Dockerfile for FastAPI app",
                                "Set up Railway/Render account",
                                "Connect to GitHub repository",
                                "Configure environment variables",
                                "Test deployed API endpoints"
                            ],
                            "resources": [
                                {"title": "Railway Deployment", "url": "https://railway.app/", "type": "docs"},
                                {"title": "Render Tutorial", "url": "https://www.youtube.com/watch?v=bnCOyGaSe84", "type": "video"},
                                {"title": "Docker for Python", "url": "https://docs.docker.com/language/python/", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Deploy frontend to Vercel",
                            "description": "Host React app on Vercel",
                            "steps": [
                                "Create Vercel account",
                                "Connect GitHub repository",
                                "Configure build settings",
                                "Set environment variables for API URL",
                                "Set up custom domain (optional)"
                            ],
                            "resources": [
                                {"title": "Vercel Deployment", "url": "https://vercel.com/docs", "type": "docs"},
                                {"title": "Deploy React to Vercel", "url": "https://www.youtube.com/watch?v=FvsvHzcwOmQ", "type": "video"},
                                {"title": "Environment Variables", "url": "https://vercel.com/docs/concepts/projects/environment-variables", "type": "docs"}
                            ],
                            "estimated_time": "2 hours"
                        },
                        {
                            "name": "Create portfolio presentation",
                            "description": "Document and showcase project",
                            "steps": [
                                "Write detailed README with architecture",
                                "Create demo GIF/video",
                                "Add to personal portfolio site",
                                "Write LinkedIn post about project",
                                "Prepare for technical interviews"
                            ],
                            "resources": [
                                {"title": "Portfolio Tips", "url": "https://www.youtube.com/watch?v=ocdwh0KYeUs", "type": "video"},
                                {"title": "README Best Practices", "url": "https://readme.so/", "type": "docs"},
                                {"title": "LinkedIn Post Examples", "url": "https://www.youtube.com/watch?v=4A3gfFe3-4k", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Deployed API", "Live frontend", "Portfolio-ready documentation"]
                }
            ]
        },
        "Machine Learning": {
            "title": "📊 Predictive Analytics Dashboard",
            "description": "Create a machine learning pipeline that predicts trends from historical data. Build an interactive dashboard for data visualization and model insights.",
            "tech_stack": ["Python", "Scikit-learn", "Pandas", "Plotly", "Streamlit"],
            "tags": ["ML", "Data Science", "Analytics"],
            "roadmap": [
                {
                    "week": 1,
                    "title": "Week 1: Data Science Foundations",
                    "tasks": [
                        {
                            "name": "Set up data science environment",
                            "description": "Install essential data science libraries",
                            "steps": [
                                "Create virtual environment",
                                "Install pandas, numpy, scikit-learn",
                                "Install visualization libraries (matplotlib, seaborn, plotly)",
                                "Set up Jupyter notebooks",
                                "Configure data directory structure"
                            ],
                            "resources": [
                                {"title": "Pandas Documentation", "url": "https://pandas.pydata.org/docs/", "type": "docs"},
                                {"title": "Scikit-learn Tutorial", "url": "https://scikit-learn.org/stable/tutorial/", "type": "docs"},
                                {"title": "Data Science Setup", "url": "https://www.youtube.com/watch?v=_u5AmF00C9c", "type": "video"}
                            ],
                            "estimated_time": "2 hours"
                        },
                        {
                            "name": "Acquire and explore dataset",
                            "description": "Find data and perform exploratory analysis",
                            "steps": [
                                "Browse Kaggle for interesting datasets",
                                "Download and load data into pandas",
                                "Check data types and missing values",
                                "Generate statistical summaries",
                                "Create initial visualizations"
                            ],
                            "resources": [
                                {"title": "Kaggle Datasets", "url": "https://www.kaggle.com/datasets", "type": "docs"},
                                {"title": "EDA Tutorial", "url": "https://www.youtube.com/watch?v=xi0vhXFPegw", "type": "video"},
                                {"title": "Pandas EDA Guide", "url": "https://www.analyticsvidhya.com/blog/2021/04/20-must-know-pandas-function-for-exploratory-data-analysis-eda/", "type": "article"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Learn feature engineering",
                            "description": "Transform raw data into useful features",
                            "steps": [
                                "Handle missing values (imputation)",
                                "Encode categorical variables",
                                "Scale numerical features",
                                "Create new features from existing ones",
                                "Remove correlated features"
                            ],
                            "resources": [
                                {"title": "Feature Engineering", "url": "https://www.kaggle.com/learn/feature-engineering", "type": "docs"},
                                {"title": "Feature Engineering Tutorial", "url": "https://www.youtube.com/watch?v=6WDFfaYtN6s", "type": "video"},
                                {"title": "Scikit-learn Preprocessing", "url": "https://scikit-learn.org/stable/modules/preprocessing.html", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Clean dataset", "EDA notebook", "Feature engineering pipeline"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Model Development",
                    "tasks": [
                        {
                            "name": "Train baseline models",
                            "description": "Build and compare multiple ML algorithms",
                            "steps": [
                                "Split data into train/test sets",
                                "Train Linear Regression as baseline",
                                "Train Random Forest model",
                                "Train Gradient Boosting (XGBoost)",
                                "Compare model performances"
                            ],
                            "resources": [
                                {"title": "Model Comparison", "url": "https://scikit-learn.org/stable/tutorial/machine_learning_map/", "type": "docs"},
                                {"title": "XGBoost Tutorial", "url": "https://www.youtube.com/watch?v=8b1JEDvenQU", "type": "video"},
                                {"title": "Random Forest Guide", "url": "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ", "type": "video"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Hyperparameter tuning",
                            "description": "Optimize model parameters for best performance",
                            "steps": [
                                "Learn about grid search and random search",
                                "Use GridSearchCV for parameter tuning",
                                "Implement cross-validation",
                                "Use Optuna for advanced optimization",
                                "Document best parameters"
                            ],
                            "resources": [
                                {"title": "Hyperparameter Tuning", "url": "https://scikit-learn.org/stable/modules/grid_search.html", "type": "docs"},
                                {"title": "Optuna Tutorial", "url": "https://optuna.org/", "type": "docs"},
                                {"title": "Tuning Guide", "url": "https://www.youtube.com/watch?v=Gol_qOgRqfA", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Model interpretation",
                            "description": "Understand what the model learned",
                            "steps": [
                                "Calculate feature importances",
                                "Create SHAP explanations",
                                "Visualize decision boundaries",
                                "Analyze model errors",
                                "Document model behavior"
                            ],
                            "resources": [
                                {"title": "SHAP Library", "url": "https://shap.readthedocs.io/", "type": "docs"},
                                {"title": "Model Interpretability", "url": "https://www.youtube.com/watch?v=CYQYX_MBu2Q", "type": "video"},
                                {"title": "Explainable AI", "url": "https://christophm.github.io/interpretable-ml-book/", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Trained models", "Tuning results", "Interpretation report"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Dashboard Development",
                    "tasks": [
                        {
                            "name": "Build Streamlit dashboard",
                            "description": "Create interactive visualization interface",
                            "steps": [
                                "Install Streamlit: pip install streamlit",
                                "Create dashboard layout with sidebar",
                                "Add data upload functionality",
                                "Create interactive charts with Plotly",
                                "Add filtering and drill-down features"
                            ],
                            "resources": [
                                {"title": "Streamlit Documentation", "url": "https://docs.streamlit.io/", "type": "docs"},
                                {"title": "Dashboard Tutorial", "url": "https://www.youtube.com/watch?v=Sb0A9i6d320", "type": "video"},
                                {"title": "Plotly in Streamlit", "url": "https://docs.streamlit.io/library/api-reference/charts/st.plotly_chart", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Add prediction interface",
                            "description": "Allow users to make predictions",
                            "steps": [
                                "Create input form for features",
                                "Load trained model in Streamlit",
                                "Display prediction with confidence",
                                "Show feature contributions",
                                "Add batch prediction upload"
                            ],
                            "resources": [
                                {"title": "Streamlit Forms", "url": "https://docs.streamlit.io/library/api-reference/control-flow/st.form", "type": "docs"},
                                {"title": "ML App Tutorial", "url": "https://www.youtube.com/watch?v=xl0N7tHiwlw", "type": "video"},
                                {"title": "Model Deployment", "url": "https://www.youtube.com/watch?v=xWMR9hJVJy0", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Implement model monitoring",
                            "description": "Track model performance over time",
                            "steps": [
                                "Log predictions and actual outcomes",
                                "Calculate drift metrics",
                                "Create performance charts",
                                "Set up alerts for degradation",
                                "Build retraining workflow"
                            ],
                            "resources": [
                                {"title": "ML Monitoring", "url": "https://evidentlyai.com/", "type": "docs"},
                                {"title": "Model Monitoring Tutorial", "url": "https://www.youtube.com/watch?v=VdKrY7VGS8s", "type": "video"},
                                {"title": "MLflow Tracking", "url": "https://mlflow.org/docs/latest/tracking.html", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Interactive dashboard", "Prediction interface", "Monitoring system"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Deployment & Documentation",
                    "tasks": [
                        {
                            "name": "Deploy to cloud",
                            "description": "Make dashboard publicly accessible",
                            "steps": [
                                "Create requirements.txt",
                                "Push to GitHub",
                                "Deploy to Streamlit Cloud",
                                "Configure secrets management",
                                "Test production app"
                            ],
                            "resources": [
                                {"title": "Streamlit Cloud", "url": "https://streamlit.io/cloud", "type": "docs"},
                                {"title": "Deployment Guide", "url": "https://www.youtube.com/watch?v=HKoOBiAaHGg", "type": "video"},
                                {"title": "Secrets Management", "url": "https://docs.streamlit.io/streamlit-community-cloud/deploy-your-app/secrets-management", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Write technical documentation",
                            "description": "Document the entire project",
                            "steps": [
                                "Write detailed README",
                                "Document data pipeline",
                                "Create model card",
                                "Add usage examples",
                                "Include architecture diagrams"
                            ],
                            "resources": [
                                {"title": "Model Cards", "url": "https://huggingface.co/docs/hub/model-cards", "type": "docs"},
                                {"title": "Documentation Best Practices", "url": "https://www.youtube.com/watch?v=E6NO0rgFub4", "type": "video"},
                                {"title": "README Template", "url": "https://www.makeareadme.com/", "type": "docs"}
                            ],
                            "estimated_time": "3 hours"
                        },
                        {
                            "name": "Create project showcase",
                            "description": "Present your work professionally",
                            "steps": [
                                "Record demo video",
                                "Create presentation slides",
                                "Write blog post about project",
                                "Share on LinkedIn and Twitter",
                                "Add to portfolio website"
                            ],
                            "resources": [
                                {"title": "Technical Blogging", "url": "https://dev.to/", "type": "docs"},
                                {"title": "Demo Video Tips", "url": "https://www.youtube.com/watch?v=wZv62ShoStY", "type": "video"},
                                {"title": "Portfolio Examples", "url": "https://www.youtube.com/watch?v=ocdwh0KYeUs", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Deployed app", "Full documentation", "Project showcase"]
                }
            ]
        },
        "Generative AI": {
            "title": "🎨 AI Content Generator Studio",
            "description": "Create a multi-modal AI content generation platform using LLMs and diffusion models. Generate text, images, and code based on natural language prompts.",
            "tech_stack": ["Python", "OpenAI API", "LangChain", "Stable Diffusion", "React"],
            "tags": ["GenAI", "LLMs", "Creative AI"],
            "roadmap": [
                {
                    "week": 1,
                    "title": "Week 1: LLM Fundamentals",
                    "tasks": [
                        {
                            "name": "Set up API access",
                            "description": "Configure API keys for AI providers",
                            "steps": [
                                "Create OpenAI account and get API key",
                                "Set up Anthropic Claude access",
                                "Get Google Gemini API key",
                                "Configure environment variables",
                                "Test API connections"
                            ],
                            "resources": [
                                {"title": "OpenAI API", "url": "https://platform.openai.com/docs/", "type": "docs"},
                                {"title": "Anthropic Claude", "url": "https://www.anthropic.com/api", "type": "docs"},
                                {"title": "Google AI Studio", "url": "https://aistudio.google.com/", "type": "docs"}
                            ],
                            "estimated_time": "2 hours"
                        },
                        {
                            "name": "Learn prompt engineering",
                            "description": "Master the art of effective prompts",
                            "steps": [
                                "Study prompt engineering principles",
                                "Learn about system vs user prompts",
                                "Practice few-shot prompting",
                                "Experiment with chain-of-thought",
                                "Test different prompt structures"
                            ],
                            "resources": [
                                {"title": "OpenAI Prompt Guide", "url": "https://platform.openai.com/docs/guides/prompt-engineering", "type": "docs"},
                                {"title": "Prompt Engineering Course", "url": "https://www.youtube.com/watch?v=_ZvnD73m40o", "type": "video"},
                                {"title": "Anthropic Prompting", "url": "https://docs.anthropic.com/claude/docs/introduction-to-prompt-design", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Explore LangChain",
                            "description": "Learn LangChain for AI applications",
                            "steps": [
                                "Install LangChain: pip install langchain",
                                "Understand chains and agents",
                                "Create simple chat chain",
                                "Add memory to conversations",
                                "Implement tool usage"
                            ],
                            "resources": [
                                {"title": "LangChain Docs", "url": "https://python.langchain.com/docs/", "type": "docs"},
                                {"title": "LangChain Tutorial", "url": "https://www.youtube.com/watch?v=lG7Uxts9SXs", "type": "video"},
                                {"title": "LangChain Cookbook", "url": "https://github.com/langchain-ai/langchain/tree/master/cookbook", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        }
                    ],
                    "deliverables": ["API setup", "Prompt templates", "LangChain basics"]
                },
                {
                    "week": 2,
                    "title": "Week 2: Content Generation Features",
                    "tasks": [
                        {
                            "name": "Build text generation module",
                            "description": "Create various text generation features",
                            "steps": [
                                "Implement blog post generator",
                                "Add email writer functionality",
                                "Create code generation feature",
                                "Add text summarization",
                                "Implement translation feature"
                            ],
                            "resources": [
                                {"title": "Text Generation", "url": "https://platform.openai.com/docs/guides/text-generation", "type": "docs"},
                                {"title": "Building AI Writers", "url": "https://www.youtube.com/watch?v=rFQ5Kmkd4jc", "type": "video"},
                                {"title": "LangChain Templates", "url": "https://python.langchain.com/docs/modules/model_io/prompts/", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Add image generation",
                            "description": "Integrate image AI capabilities",
                            "steps": [
                                "Set up DALL-E API access",
                                "Implement image generation from text",
                                "Add image editing features",
                                "Integrate Stable Diffusion (optional)",
                                "Create image prompt optimizer"
                            ],
                            "resources": [
                                {"title": "DALL-E API", "url": "https://platform.openai.com/docs/guides/images", "type": "docs"},
                                {"title": "Stable Diffusion", "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0", "type": "docs"},
                                {"title": "Image Generation Tutorial", "url": "https://www.youtube.com/watch?v=N7YFfhgKgMA", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Implement RAG system",
                            "description": "Add retrieval-augmented generation",
                            "steps": [
                                "Set up vector database (Chroma/Pinecone)",
                                "Create document embedding pipeline",
                                "Implement semantic search",
                                "Build RAG chain with LangChain",
                                "Add document upload feature"
                            ],
                            "resources": [
                                {"title": "RAG Tutorial", "url": "https://python.langchain.com/docs/tutorials/rag/", "type": "docs"},
                                {"title": "ChromaDB", "url": "https://docs.trychroma.com/", "type": "docs"},
                                {"title": "RAG Explained", "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M", "type": "video"}
                            ],
                            "estimated_time": "5 hours"
                        }
                    ],
                    "deliverables": ["Text generator", "Image generator", "RAG system"]
                },
                {
                    "week": 3,
                    "title": "Week 3: Full-Stack Development",
                    "tasks": [
                        {
                            "name": "Build FastAPI backend",
                            "description": "Create API for all generation features",
                            "steps": [
                                "Set up FastAPI project structure",
                                "Create endpoints for each feature",
                                "Add streaming response support",
                                "Implement rate limiting",
                                "Add authentication"
                            ],
                            "resources": [
                                {"title": "FastAPI + LangChain", "url": "https://python.langchain.com/docs/langserve", "type": "docs"},
                                {"title": "FastAPI Tutorial", "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA", "type": "video"},
                                {"title": "Streaming Responses", "url": "https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Create React frontend",
                            "description": "Build modern UI for content studio",
                            "steps": [
                                "Set up React with Vite",
                                "Design studio layout",
                                "Create generation forms",
                                "Add real-time streaming display",
                                "Implement content history"
                            ],
                            "resources": [
                                {"title": "React + Vite", "url": "https://vitejs.dev/guide/", "type": "docs"},
                                {"title": "Building AI Apps", "url": "https://www.youtube.com/watch?v=mBcQiCaS07w", "type": "video"},
                                {"title": "Tailwind CSS", "url": "https://tailwindcss.com/docs/installation", "type": "docs"}
                            ],
                            "estimated_time": "5 hours"
                        },
                        {
                            "name": "Add user authentication",
                            "description": "Implement secure user system",
                            "steps": [
                                "Set up Firebase Auth",
                                "Implement Google OAuth",
                                "Add session management",
                                "Create user profiles",
                                "Track usage per user"
                            ],
                            "resources": [
                                {"title": "Firebase Auth", "url": "https://firebase.google.com/docs/auth", "type": "docs"},
                                {"title": "React Firebase Auth", "url": "https://www.youtube.com/watch?v=PKwu15ldZ7k", "type": "video"},
                                {"title": "OAuth Guide", "url": "https://oauth.net/2/", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Backend API", "React frontend", "Auth system"]
                },
                {
                    "week": 4,
                    "title": "Week 4: Launch & Scale",
                    "tasks": [
                        {
                            "name": "Deploy application",
                            "description": "Launch to production",
                            "steps": [
                                "Deploy backend to Railway",
                                "Deploy frontend to Vercel",
                                "Set up custom domain",
                                "Configure SSL certificates",
                                "Set up monitoring"
                            ],
                            "resources": [
                                {"title": "Railway Deployment", "url": "https://railway.app/", "type": "docs"},
                                {"title": "Vercel Deployment", "url": "https://vercel.com/docs", "type": "docs"},
                                {"title": "Full Stack Deploy", "url": "https://www.youtube.com/watch?v=hQAu0YEIF0g", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Optimize for production",
                            "description": "Improve performance and reliability",
                            "steps": [
                                "Add caching layer (Redis)",
                                "Implement request queuing",
                                "Set up error tracking (Sentry)",
                                "Add analytics",
                                "Optimize API response times"
                            ],
                            "resources": [
                                {"title": "Redis Caching", "url": "https://redis.io/docs/", "type": "docs"},
                                {"title": "Sentry Error Tracking", "url": "https://sentry.io/", "type": "docs"},
                                {"title": "Performance Optimization", "url": "https://www.youtube.com/watch?v=HDEbBwNBMB4", "type": "video"}
                            ],
                            "estimated_time": "4 hours"
                        },
                        {
                            "name": "Create showcase materials",
                            "description": "Prepare for portfolio and sharing",
                            "steps": [
                                "Record comprehensive demo",
                                "Write technical blog post",
                                "Create GitHub README",
                                "Share on social media",
                                "Prepare for interviews"
                            ],
                            "resources": [
                                {"title": "Technical Writing", "url": "https://developers.google.com/tech-writing", "type": "docs"},
                                {"title": "Portfolio Projects", "url": "https://www.youtube.com/watch?v=9No-FiEInLA", "type": "video"},
                                {"title": "GitHub Profile", "url": "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile", "type": "docs"}
                            ],
                            "estimated_time": "4 hours"
                        }
                    ],
                    "deliverables": ["Live application", "Production optimization", "Portfolio materials"]
                }
            ]
        }
    }
    
    # Default project with detailed roadmap
    default_project = {
        "title": "🧠 Personal AI Assistant",
        "description": "Build your own AI assistant using LLMs that can answer questions, summarize documents, and help with daily tasks. Integrate with APIs for real-world functionality.",
        "tech_stack": ["Python", "LangChain", "OpenAI API", "FastAPI", "React"],
        "tags": ["LLMs", "Chatbots", "Personal AI"],
        "roadmap": [
            {
                "week": 1,
                "title": "Week 1: Foundation Setup",
                "tasks": [
                    {
                        "name": "Set up development environment",
                        "description": "Configure all necessary tools and libraries",
                        "steps": [
                            "Install Python 3.10+",
                            "Create virtual environment",
                            "Install LangChain and OpenAI SDK",
                            "Get API keys (OpenAI/Anthropic)",
                            "Set up project structure"
                        ],
                        "resources": [
                            {"title": "LangChain Quickstart", "url": "https://python.langchain.com/docs/get_started/quickstart", "type": "docs"},
                            {"title": "OpenAI API Setup", "url": "https://platform.openai.com/docs/quickstart", "type": "docs"},
                            {"title": "Python Project Setup", "url": "https://www.youtube.com/watch?v=q5uM4VKywbA", "type": "video"}
                        ],
                        "estimated_time": "3 hours"
                    },
                    {
                        "name": "Build basic chatbot",
                        "description": "Create simple conversational interface",
                        "steps": [
                            "Create chat prompt template",
                            "Implement message history",
                            "Add streaming responses",
                            "Test in command line",
                            "Handle errors gracefully"
                        ],
                        "resources": [
                            {"title": "Building a Chatbot", "url": "https://python.langchain.com/docs/tutorials/chatbot/", "type": "docs"},
                            {"title": "LangChain Chat Tutorial", "url": "https://www.youtube.com/watch?v=lG7Uxts9SXs", "type": "video"},
                            {"title": "Prompt Templates", "url": "https://python.langchain.com/docs/modules/model_io/prompts/", "type": "docs"}
                        ],
                        "estimated_time": "4 hours"
                    }
                ],
                "deliverables": ["Working chatbot", "Conversation memory"]
            },
            {
                "week": 2,
                "title": "Week 2: Advanced Features",
                "tasks": [
                    {
                        "name": "Add document Q&A",
                        "description": "Enable asking questions about uploaded documents",
                        "steps": [
                            "Set up vector database (Chroma)",
                            "Create document loader",
                            "Implement text chunking",
                            "Build retrieval chain",
                            "Test with sample documents"
                        ],
                        "resources": [
                            {"title": "RAG Tutorial", "url": "https://python.langchain.com/docs/tutorials/rag/", "type": "docs"},
                            {"title": "Document Q&A", "url": "https://www.youtube.com/watch?v=tcqEUSNCn8I", "type": "video"},
                            {"title": "ChromaDB Guide", "url": "https://docs.trychroma.com/getting-started", "type": "docs"}
                        ],
                        "estimated_time": "5 hours"
                    },
                    {
                        "name": "Implement tools and agents",
                        "description": "Add ability to use external tools",
                        "steps": [
                            "Create web search tool",
                            "Add calculator tool",
                            "Build custom API tools",
                            "Configure agent executor",
                            "Test tool selection"
                        ],
                        "resources": [
                            {"title": "LangChain Agents", "url": "https://python.langchain.com/docs/tutorials/agents/", "type": "docs"},
                            {"title": "Building Agents", "url": "https://www.youtube.com/watch?v=DWUdGhRrv2c", "type": "video"},
                            {"title": "Tool Documentation", "url": "https://python.langchain.com/docs/integrations/tools/", "type": "docs"}
                        ],
                        "estimated_time": "5 hours"
                    }
                ],
                "deliverables": ["Document Q&A feature", "AI agent with tools"]
            },
            {
                "week": 3,
                "title": "Week 3: Full-Stack App",
                "tasks": [
                    {
                        "name": "Create FastAPI backend",
                        "description": "Build REST API for assistant",
                        "steps": [
                            "Set up FastAPI app",
                            "Create chat endpoint",
                            "Add document upload",
                            "Implement streaming",
                            "Add error handling"
                        ],
                        "resources": [
                            {"title": "FastAPI Documentation", "url": "https://fastapi.tiangolo.com/", "type": "docs"},
                            {"title": "FastAPI + LangChain", "url": "https://www.youtube.com/watch?v=PoXqb_hzGqI", "type": "video"},
                            {"title": "Streaming with FastAPI", "url": "https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse", "type": "docs"}
                        ],
                        "estimated_time": "5 hours"
                    },
                    {
                        "name": "Build React frontend",
                        "description": "Create beautiful chat interface",
                        "steps": [
                            "Set up React project",
                            "Create chat UI components",
                            "Add file upload feature",
                            "Implement real-time streaming",
                            "Style with Tailwind CSS"
                        ],
                        "resources": [
                            {"title": "React Chat UI", "url": "https://www.youtube.com/watch?v=4oXMbcPtlUA", "type": "video"},
                            {"title": "Tailwind CSS", "url": "https://tailwindcss.com/docs", "type": "docs"},
                            {"title": "SSE in React", "url": "https://developer.mozilla.org/en-US/docs/Web/API/EventSource", "type": "docs"}
                        ],
                        "estimated_time": "5 hours"
                    }
                ],
                "deliverables": ["Backend API", "React frontend"]
            },
            {
                "week": 4,
                "title": "Week 4: Deploy & Polish",
                "tasks": [
                    {
                        "name": "Deploy to cloud",
                        "description": "Make assistant accessible online",
                        "steps": [
                            "Deploy backend to Railway",
                            "Deploy frontend to Vercel",
                            "Configure environment variables",
                            "Set up custom domain",
                            "Test production deployment"
                        ],
                        "resources": [
                            {"title": "Railway Guide", "url": "https://railway.app/", "type": "docs"},
                            {"title": "Vercel Deployment", "url": "https://vercel.com/docs", "type": "docs"},
                            {"title": "Deployment Tutorial", "url": "https://www.youtube.com/watch?v=hQAu0YEIF0g", "type": "video"}
                        ],
                        "estimated_time": "4 hours"
                    },
                    {
                        "name": "Create documentation",
                        "description": "Document your project professionally",
                        "steps": [
                            "Write comprehensive README",
                            "Create demo video",
                            "Add installation guide",
                            "Document API endpoints",
                            "Share on LinkedIn"
                        ],
                        "resources": [
                            {"title": "README Template", "url": "https://www.makeareadme.com/", "type": "docs"},
                            {"title": "Demo Video Guide", "url": "https://www.youtube.com/watch?v=wZv62ShoStY", "type": "video"},
                            {"title": "API Documentation", "url": "https://swagger.io/specification/", "type": "docs"}
                        ],
                        "estimated_time": "4 hours"
                    }
                ],
                "deliverables": ["Live deployed app", "Full documentation"]
            }
        ]
    }
    
    recommendations = []
    used_titles = set()
    
    # Select projects based on user interests
    for interest in survey.interest_areas:
        if interest in project_templates and project_templates[interest]["title"] not in used_titles:
            template = project_templates[interest]
            used_titles.add(template["title"])
            
            # Convert roadmap to proper structure
            roadmap = []
            for week_data in template["roadmap"]:
                tasks = []
                for task_data in week_data["tasks"]:
                    resources = [TaskResource(**r) for r in task_data["resources"]]
                    tasks.append(TaskDetail(
                        name=task_data["name"],
                        description=task_data["description"],
                        steps=task_data["steps"],
                        resources=resources,
                        estimated_time=task_data["estimated_time"]
                    ))
                roadmap.append(ProjectRoadmapWeek(
                    week=week_data["week"],
                    title=week_data["title"],
                    tasks=tasks,
                    deliverables=week_data["deliverables"]
                ))
            
            recommendations.append(ProjectRecommendation(
                title=template["title"],
                description=template["description"],
                difficulty_level=survey.skill_level if survey.skill_level in ["Beginner", "Intermediate", "Advanced", "Expert"] else "Intermediate",
                tech_stack=template["tech_stack"],
                estimated_duration=survey.project_duration or "4 weeks",
                learning_outcomes=[
                    f"Master {template['tech_stack'][0]} for AI development",
                    f"Build production-ready {interest.lower()} applications",
                    "Learn best practices for AI project architecture",
                    "Deploy and monitor AI systems in production",
                    "Build a portfolio-worthy project"
                ],
                roadmap=roadmap,
                tags=template["tags"]
            ))
            
            if len(recommendations) >= 5:
                break
    
    # Fill remaining slots with default project
    if len(recommendations) < 5 and default_project["title"] not in used_titles:
        used_titles.add(default_project["title"])
        
        # Convert default roadmap
        roadmap = []
        for week_data in default_project["roadmap"]:
            tasks = []
            for task_data in week_data["tasks"]:
                resources = [TaskResource(**r) for r in task_data["resources"]]
                tasks.append(TaskDetail(
                    name=task_data["name"],
                    description=task_data["description"],
                    steps=task_data["steps"],
                    resources=resources,
                    estimated_time=task_data["estimated_time"]
                ))
            roadmap.append(ProjectRoadmapWeek(
                week=week_data["week"],
                title=week_data["title"],
                tasks=tasks,
                deliverables=week_data["deliverables"]
            ))
        
        recommendations.append(ProjectRecommendation(
            title=default_project["title"],
            description=default_project["description"],
            difficulty_level=survey.skill_level if survey.skill_level in ["Beginner", "Intermediate", "Advanced", "Expert"] else "Intermediate",
            tech_stack=default_project["tech_stack"],
            estimated_duration=survey.project_duration or "4 weeks",
            learning_outcomes=[
                f"Master {default_project['tech_stack'][0]} for AI development",
                "Build production-ready AI applications",
                "Learn modern AI development practices",
                "Deploy and share your AI project",
                "Strengthen your AI portfolio"
            ],
            roadmap=roadmap,
            tags=default_project["tags"]
        ))
    
    return RecommendationResponse(
        student_name=survey.name,
        recommendations=recommendations,
        personalization_summary=f"Based on your interests in {', '.join(survey.interest_areas[:3])}, skill level ({survey.skill_level}), and career goal ({survey.career_goal}), we've curated these {len(recommendations)} projects to accelerate your AI journey. Each project includes a detailed 4-week roadmap with step-by-step instructions and learning resources tailored to your {survey.time_commitment} time commitment."
    )


async def get_recommendations(survey: SurveyResponse) -> RecommendationResponse:
    """Get AI recommendations - uses real AI if API key available, otherwise demo mode"""
    
    # Check if demo mode is enabled
    if settings.is_ai_demo:
        print("AI Demo mode enabled, using demo recommendations")
        return generate_demo_recommendations(survey)
    
    # Try Gemini first (default provider)
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        try:
            print("Using Gemini AI for recommendations...")
            return await get_recommendations_gemini(survey)
        except Exception as e:
            print(f"Gemini API error: {e}, falling back to demo mode")
            return generate_demo_recommendations(survey)
    
    # Try Anthropic
    if settings.AI_PROVIDER == "anthropic" and settings.ANTHROPIC_API_KEY:
        try:
            return await get_recommendations_anthropic(survey)
        except Exception as e:
            print(f"Anthropic API error: {e}, falling back to demo mode")
            return generate_demo_recommendations(survey)
    
    # Try OpenAI
    if settings.OPENAI_API_KEY:
        try:
            return await get_recommendations_openai(survey)
        except Exception as e:
            print(f"OpenAI API error: {e}, falling back to demo mode")
            return generate_demo_recommendations(survey)
    
    # No API keys - use demo mode
    print("No AI API keys configured, using demo recommendations")
    return generate_demo_recommendations(survey)


def generate_linkedin_post(project_title: str, tech_stack: List[str], student_name: str, difficulty_level: str) -> str:
    tech_tags = " ".join([f"#{tech.replace(' ', '').replace('.', '')}" for tech in tech_stack[:5]])
    
    post = f"""🚀 Excited to announce that I'm starting a new AI project!

📌 Project: {project_title}
🎯 Difficulty: {difficulty_level}
💻 Tech Stack: {', '.join(tech_stack)}

I'm embarking on this journey through the SanaPath AI platform, joining 60,000+ students in the AI-Sana ecosystem who are building real-world AI solutions.

Looking forward to sharing my progress and connecting with fellow AI enthusiasts!

{tech_tags} #AI #MachineLearning #SanaPathAI #AISana #BuildInPublic #LearningInPublic

---
🔗 Discover your personalized AI project at SanaPath AI"""
    
    return post
