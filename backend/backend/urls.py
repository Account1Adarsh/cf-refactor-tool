# backend/backend/urls.py

from django.contrib import admin
from django.urls import path, include
# from ..solutions.views import RefactorCodeView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/solutions/', include('solutions.urls')),
]
