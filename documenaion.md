# CF Refactor Tool

A web application that helps Codeforces users refactor and understand their own solutions using Google’s Gemini AI.

---

## Overview

- **Input:**  
  1. A Codeforces submission URL (e.g. `https://codeforces.com/contest/1234/submission/56789012`)  
  2. The user’s pasted source code from that submission  

- **Process:**  
  1. Backend (Django) validates the URL and extracts contest/problem IDs.  
  2. User pastes their code into a text editor on the page.  
  3. Backend sends the pasted code + prompt to Gemini AI:  
     > “Refactor this code for readability and maintainability, add inline comments explaining each block, and summarize the algorithm and its complexity.”  
  4. Gemini returns a refactored version with inline comments and a brief summary.  

- **Output:**  
  - Refactored code (side-by-side with the original)  
  - Inline comments explaining key parts  
  - A short plain-language summary  

---

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Django REST Framework (Python)  
- **AI:** Google Gemini API  

---

## Workflow

```mermaid
flowchart LR
  A[Enter CF submission URL] --> B[Paste code]
  B --> C[Backend sends code + prompt to Gemini]
  C --> D[Receive refactored code & comments]
  D --> E[Display results]


Example
Original Code

cpp
Copy
Edit
int main(){
    int n; cin>>n;
    int a[n];
    for(int i=0;i<n;i++) cin>>a[i];
    sort(a, a+n);
    cout<<a[n/2];
}

Refactored by Gemini

cpp
Copy
Edit
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) {
        cin >> a[i];
    }
    sort(a.begin(), a.end());
    // Print median
    cout << a[n/2] << "\n";
    return 0;
}
Summary

Reads n integers into a vector, sorts them, and prints the median element.

Setup
Clone the repo

bash
Copy
Edit
git clone https://github.com/Account1Adarsh/cf-refactor-tool.git
cd cf-refactor-tool
Backend

bash
Copy
Edit
cd backend
pip install -r requirements.txt
export GEMINI_API_KEY="your_key"
python manage.py runserver
Frontend

bash
Copy
Edit
cd ../frontend
npm install
npm start
Copy
Edit
