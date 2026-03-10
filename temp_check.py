import re
with open("backend/app/services/ai_engine.py", "r", encoding="utf-8") as f:
    c = f.read()
s = c.find("project_templates =")
e = c.find("default_project =")
sec = c[s:e]
m = re.findall(r'^\s{8}"([A-Z].+?)":\s*\{', sec, re.MULTILINE)
print("Template keys:", m)
