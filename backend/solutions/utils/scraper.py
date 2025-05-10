import time
from functools import wraps
import os
from dotenv import load_dotenv
import cloudscraper
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# Load environment variables from .env
load_dotenv()

# Create a cloudscraper session that mimics a real browser
scraper = cloudscraper.create_scraper(
    browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False}
)

# Load CF credentials from environment; required for authenticated scraping
CF_USERNAME = os.getenv('CF_USERNAME')
CF_PASSWORD = os.getenv('CF_PASSWORD')

# ------------------ Auth Helpers ------------------

def cf_login():
    """
    Log in to Codeforces and establish session cookies.
    Requires CF_USERNAME and CF_PASSWORD in environment.
    """
    if not CF_USERNAME or not CF_PASSWORD:
        raise RuntimeError('CF_USERNAME and CF_PASSWORD must be set for login.')

    # 1) Fetch login page for CSRF token from hidden input
    login_page = scraper.get('https://codeforces.com/enter')
    login_page.raise_for_status()
    soup = BeautifulSoup(login_page.text, 'html.parser')
    csrf_input = soup.find('input', {'name': 'csrf_token'})
    if not csrf_input or not csrf_input.get('value'):
        raise RuntimeError('Unable to find CSRF token in login page')
    csrf = csrf_input['value']

    # 2) Post credentials
    payload = {
        'csrf_token': csrf,
        'action': 'enter',
        'handleOrEmail': CF_USERNAME,
        'password': CF_PASSWORD
    }
    headers = {
        'Referer': 'https://codeforces.com/enter'
    }
    resp = scraper.post('https://codeforces.com/enter', data=payload, headers=headers)
    resp.raise_for_status()
    return scraper

# ------------------ Retry Decorator ------------------

def retry(max_attempts: int = 3, initial_delay: float = 1.0, backoff: float = 2.0):
    """
    Decorator to retry a function up to max_attempts with exponential backoff.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            delay = initial_delay
            for attempt in range(1, max_attempts + 1):
                try:
                    return fn(*args, **kwargs)
                except Exception:
                    if attempt == max_attempts:
                        raise
                    time.sleep(delay)
                    delay *= backoff
        return wrapped
    return decorator

# ------------------ Scraper Functions ------------------

@retry()
def fetch_top_submission_urls(cf_id: str, limit: int = 10) -> list[str]:
    """
    Return up to `limit` accepted submission URLs for a problem in a contest (e.g., "2051A" or "148C2").
    """
    contest_id = ''.join(filter(str.isdigit, cf_id))
    problem_index = ''.join(filter(str.isalpha, cf_id)).upper()
    status_url = (
        f"https://codeforces.com/contest/{contest_id}/status"
        f"?problemIndex={problem_index}&order_by=time&order=asc"
    )
    resp = scraper.get(status_url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')

    urls: list[str] = []
    for row in soup.select('table.status-frame-datatable tr'):
        cols = row.find_all('td')
        if len(cols) < 6 or cols[5].text.strip().lower() != 'accepted':
            continue
        a = cols[0].find('a')
        if a and a['href']:
            href = a['href']
            if href.startswith('/problemset/submission/'):
                parts = href.strip('/').split('/')
                href = f"/contest/{parts[2]}/submission/{parts[3]}"
            urls.append(f'https://codeforces.com{href}')
            if len(urls) >= limit:
                break
    return urls

@retry()
def fetch_code(submission_url: str) -> str:
    """
    Fetch the full source code for a CF submission by hitting
    the built-in ?action=showSource page (no login needed).
    """
    # Strip any existing query params
    base = submission_url.split('?')[0]
    show_url = f"{base}?action=showSource"
    resp = scraper.get(show_url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    # Code is inside <pre id="program-source-text">
    pre = soup.find('pre', id='program-source-text')
    if not pre:
        raise RuntimeError("Unable to find source code on page")
    return pre.get_text()

from bs4 import BeautifulSoup

@retry()
def fetch_problem_statement(cf_id: str) -> str:
    """
    Scrape the full problem statement text for a given CF ID (e.g., "1234A").
    """
    # Parse contest number and problem index
    contest_id  = ''.join(filter(str.isdigit, cf_id))
    problem_idx = ''.join(filter(str.isalpha, cf_id)).upper()
    problem_url = f"https://codeforces.com/contest/{contest_id}/problem/{problem_idx}"

    resp = scraper.get(problem_url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')

    stmt_div = soup.find('div', class_='problem-statement')
    if not stmt_div:
        raise RuntimeError("Problem statement block not found")

    # Remove scripts/styles
    for tag in stmt_div(['script', 'style']):
        tag.decompose()

    # Extract and clean text
    text = stmt_div.get_text(separator='\n').strip()
    return text
