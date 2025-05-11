import time
from functools import wraps
import os
from dotenv import load_dotenv
import cloudscraper
from bs4 import BeautifulSoup
import requests

load_dotenv()

scraper = cloudscraper.create_scraper(
    browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False}
)

def retry(max_attempts: int = 3, initial_delay: float = 1.0, backoff: float = 2.0):
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

@retry()
def fetch_top_cpp_submission_urls(cf_id, limit=5):
    contest_id    = ''.join(filter(str.isdigit, cf_id))
    problem_index = ''.join(filter(str.isalpha, cf_id)).upper()

    api_url = (
        f"https://codeforces.com/api/contest.status"
        f"?contestId={contest_id}&from=1&count=200"
    )
    resp = requests.get(api_url, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    if data.get('status') != 'OK':
        raise Exception(f"CF API error: {data.get('comment')}")

    submissions = data['result']
    links = []

    for sub in submissions:
        lang    = sub.get('programmingLanguage', '')
        if (
            sub.get('verdict') == 'OK'
            and sub['problem']['index'] == problem_index
            and 'C++' in lang
        ):
            sid = sub['id']
            links.append(
                f"https://codeforces.com/contest/{contest_id}/submission/{sid}"
            )
            if len(links) >= limit:
                break

    if not links:
        raise Exception("No accepted C++ submissions found in the latest 200 attempts.")

    return links

@retry()
def fetch_problem_statement(cf_id: str) -> str:
    contest_id  = ''.join(filter(str.isdigit, cf_id))
    problem_idx = ''.join(filter(str.isalpha, cf_id)).upper()
    url = f"https://codeforces.com/contest/{contest_id}/problem/{problem_idx}"

    resp = scraper.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    stmt_div = soup.find('div', class_='problem-statement')
    if not stmt_div:
        raise RuntimeError("Problem statement block not found")

    for tag in stmt_div(['script', 'style']):
        tag.decompose()

    return stmt_div.get_text(separator='\n').strip()
