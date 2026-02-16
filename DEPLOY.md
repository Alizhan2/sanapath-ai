# 🚀 Деплой SanaPath AI

## Шаг 1: Подготовка GitHub репозитория

```bash
cd "c:\Users\Admin\Desktop\Carerr Ai"
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Шаг 2: Деплой Backend на Render (Бесплатно)

### 2.1. Создать аккаунт
1. Перейти на https://render.com
2. "Sign up with GitHub"

### 2.2. Создать Web Service
1. Dashboard → "New" → "Web Service"
2. Подключить GitHub репозиторий `SanaPath-AI`
3. Настройки:
   - **Name:** `sanapath-api`
   - **Region:** Frankfurt (EU)
   - **Branch:** `main`
   - **Root Directory:** (оставить пустым)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`

### 2.3. Environment Variables (в Render Dashboard → Environment)
```
SECRET_KEY = (нажать Generate)
GEMINI_API_KEY = <your-gemini-api-key-from-aistudio.google.com>
CORS_ORIGINS = https://sanapath-ai.netlify.app
FRONTEND_URL = https://sanapath-ai.netlify.app
ENVIRONMENT = production
DEMO_MODE = true
AI_DEMO_MODE = auto
```
> ⚠️ НИКОГДА не коммитьте API ключи в Git! Используйте только Dashboard.

### 2.4. Нажать "Create Web Service"
- Подождать 5-10 минут для билда
- URL будет: `https://sanapath-api.onrender.com`

---

## Шаг 3: Деплой Frontend на Netlify (Бесплатно)

### 3.1. Создать аккаунт
1. Перейти на https://netlify.com
2. "Sign up with GitHub"

### 3.2. Import Project
1. "Add new site" → "Import an existing project"
2. Выбрать репозиторий `SanaPath-AI`
3. Настройки:
   - **Base directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `frontend/dist`

### 3.3. Environment Variables (в Netlify Dashboard → Site Settings → Environment Variables)
```
VITE_API_URL = https://sanapath-ai.onrender.com
VITE_FIREBASE_API_KEY = <your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN = sanapath-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = sanapath-ai
VITE_FIREBASE_STORAGE_BUCKET = sanapath-ai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = <your-sender-id>
VITE_FIREBASE_APP_ID = <your-app-id>
VITE_FIREBASE_MEASUREMENT_ID = <your-measurement-id>
```
> ⚠️ Получите эти значения из Firebase Console → Project Settings → Your Apps → Config
> НИКОГДА не коммитьте их в репозиторий!

### 3.4. Нажать "Deploy site"
- Подождать 2-3 минуты
- URL будет: `https://sanapath-ai.netlify.app`

---

## Шаг 4: Проверка

### Тестовые URLs:
| Сервис | URL |
|--------|-----|
| Frontend | https://sanapath-ai.netlify.app |
| Backend API | https://sanapath-ai.onrender.com |
| API Docs | https://sanapath-ai.onrender.com/docs |
| Health Check | https://sanapath-ai.onrender.com/health |

### Проверить:
1. Открыть https://sanapath-ai.netlify.app
2. Попробовать Demo Login
3. Пройти Survey
4. Проверить Dashboard

---

## 🔧 Troubleshooting

### Backend не запускается
```bash
# Проверить логи в Render Dashboard
# Убедиться что requirements.txt корректный
```

### CORS ошибки
1. В Render добавить переменные:
   ```
   CORS_ORIGINS = https://sanapath-ai.netlify.app
   FRONTEND_URL = https://sanapath-ai.netlify.app
   ```
2. Redeploy backend

### Frontend не подключается к API
1. В Netlify проверить переменную:
   ```
   VITE_API_URL = https://sanapath-ai.onrender.com
   ```
2. Redeploy frontend (Deploys → Trigger deploy)

### ИИ работает в Demo режиме?
1. В Render добавить `GEMINI_API_KEY` (из https://aistudio.google.com/app/apikey)
2. Убрать или установить `AI_DEMO_MODE = auto`
3. Redeploy backend

---

## 🔒 Безопасность

> **ВАЖНО**: Никогда не коммитьте API ключи в Git!
> - Используйте Render Dashboard для backend ключей
> - Используйте Netlify UI для frontend ключей
> - Файлы `.env`, `.env.production` добавлены в `.gitignore`

---

## 💰 Бесплатные лимиты

### Render (Free tier):
- 750 часов/месяц
- Засыпает после 15 мин неактивности
- Первый запрос после сна ~30 сек

### Vercel (Hobby):
- 100 GB bandwidth
- Unlimited deployments
- Automatic HTTPS

---

## 🎉 Готово!

После деплоя твой проект будет доступен по адресу:
**https://sanapath-ai.netlify.app**

Поделись ссылкой для тестирования! 🚀
