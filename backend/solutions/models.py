
# Create your models here.
from django.db import models

class Solution(models.Model):
    cf_id       = models.CharField(max_length=20)   # e.g. “1234A”
    original    = models.TextField()                # raw scraped code
    refactored  = models.TextField()                # AI‑refactored code
    explanation = models.TextField()                # AI summary/explanation
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cf_id} @ {self.created_at:%Y-%m-%d %H:%M}"
