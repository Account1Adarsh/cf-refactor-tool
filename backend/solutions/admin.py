from django.contrib import admin
from .models import Solution

@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    list_display = ('cf_id', 'created_at')
    ordering = ('-created_at',)
