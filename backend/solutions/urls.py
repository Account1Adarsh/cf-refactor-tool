from django.urls import path
from .views import (
    TopSubmissionsView,
    RefactorCodeView,
    ProblemMetaView,
    get_problem_metadata
)

urlpatterns = [
    path('top-submissions/', TopSubmissionsView.as_view(), name='top-submissions'),
    path('refactor-code/',    RefactorCodeView.as_view(),    name='refactor-code'),

    # Class-based
    path('problems/<str:problem_id>/meta/', ProblemMetaView.as_view(), name='problem-meta'),
    # Function-based
    path('problems/<str:cf_id>/meta-func/', get_problem_metadata, name='problem-meta-func'),
]
