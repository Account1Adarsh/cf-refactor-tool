# solutions/urls.py

from django.urls import path
from .views import (
    TopSubmissionsView,
    FetchCodeView,
    RefactorCodeView,
    get_problem_metadata,
    ProblemMetaView
)

urlpatterns = [
    path('top-submissions/', TopSubmissionsView.as_view(), name='top-submissions'),
    path('fetch-code/', FetchCodeView.as_view(), name='fetch-code'),
    path('refactor-code/', RefactorCodeView.as_view(), name='refactor-code'),

    # You can use either one of these depending on whether you want FBV or CBV
    path('problems/<str:cf_id>/meta-func/', get_problem_metadata, name='problem-meta-func'),  # Function-based
    path('problems/<str:problem_id>/meta/', ProblemMetaView.as_view(), name='problem-meta'),  # Class-based
]
