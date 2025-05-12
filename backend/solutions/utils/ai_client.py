import os
import requests

# Read API key and model from environment
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
MODEL_NAME     = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')

# Base URL for Generative Language API
GL_BASE = 'https://generativelanguage.googleapis.com/v1beta'

def refactor_and_explain(code: str, statement: str = "") -> dict:
    """
    Calls the Generative Language API to:
      1. Refactor the given C++ code for readability (logic unchanged)
      2. Add clear inline comments
      3. Provide a final ### Explanation: section tying the solution back to the problem statement

    Returns:
      {
        'refactored': '...refactored code with comments...',
        'explanation': '...plain-English explanation...'
      }
    """
    if not GEMINI_API_KEY:
        raise RuntimeError('GEMINI_API_KEY environment variable is required')

    # Build the user prompt
    prompt_parts = []

    if statement:
        prompt_parts.append(
            "Problem Statement:\n"
            "------------------\n"
            f"{statement}\n\n"
        )

    prompt_parts.append(
        "User Solution:\n"
        "--------------\n"
        f"```cpp\n{code}\n```\n\n"
    )

    prompt_parts.append(
        "### Instructions:\n"
        "1. Refactor the code to improve readability **without changing its logic** as well as remove extra unecessary code/templates to improve redabilty.\n"
        "2. Add clear, inline comments explaining each step (mark comments distinctly).\n"
        "3. At the end, provide a section titled `### Explanation:` summarizing and explaining how this solution "
        "solves the problem in the context of the statement. as well as give time and space complexity\n"
    )

    prompt_text = "\n".join(prompt_parts)

    # Prepare request payload
    url = f"{GL_BASE}/models/{MODEL_NAME}:generateContent?key={GEMINI_API_KEY}"
    payload = {
        'contents': [
            {
                'role': 'user',
                'parts': [{'text': prompt_text}]
            }
        ],
        'generationConfig': {
            'temperature':     0.2,
            'topK':            1,
            'topP':            1,
            'maxOutputTokens': 2048
        }
    }

    # Send request
    resp = requests.post(url, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    # Extract generated text
    candidates = data.get('candidates') or []
    if not candidates:
        raise RuntimeError('No candidates returned by Gemini API')

    content = ""
    parts = candidates[0].get('content', {}).get('parts', [])
    if parts:
        content = parts[0].get('text', '')

    # Split out explanation if present
    if '### Explanation:' in content:
        refactored, explanation = content.split('### Explanation:', 1)
    else:
        # Fallback if delimiter missing
        refactored  = content
        explanation = ""

    return {
        'refactored':  refactored.strip(),
        'explanation': explanation.strip()
    }
