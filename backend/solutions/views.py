from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .utils.scraper import (
    fetch_top_cpp_submission_urls,
    fetch_problem_statement
)
from .utils.ai_client import refactor_and_explain


class ProblemMetaView(APIView):
    """
    GET /api/solutions/problems/<problem_id>/meta/
    Returns the problem statement and top 3 C++ solution URLs.
    """
    def get(self, request, problem_id):
        try:
            statement   = fetch_problem_statement(problem_id)
            submissions = fetch_top_cpp_submission_urls(problem_id, limit=3)
            return Response({
                "problem_statement": statement,
                "submission_links": submissions
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TopSubmissionsView(APIView):
    """
    POST /api/solutions/top-submissions/
    Body: { "cf_id": "1234A" }
    Returns the top 5 C++ solution URLs.
    """
    def post(self, request):
        cf_id = request.data.get('cf_id')
        if not cf_id:
            return Response(
                {"error": "cf_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            urls = fetch_top_cpp_submission_urls(cf_id, limit=5)
            return Response({"urls": urls})
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RefactorCodeView(APIView):
    """
    POST /api/solutions/refactor-code/
    Body: {
      "code": "...",     # raw C++ code pasted by user
      "cf_id": "1234A"   # optional, for context
    }
    Returns:
      { "refactored": "...", "explanation": "..." }
    """
    def post(self, request):
        code  = request.data.get('code')
        cf_id = request.data.get('cf_id', "")

        if not code:
            return Response(
                {"error": 'Field "code" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Optionally fetch the problem statement
        statement = ""
        if cf_id:
            try:
                statement = fetch_problem_statement(cf_id)
            except Exception:
                # proceed without it
                pass

        try:
            result = refactor_and_explain(code, statement)
            return Response(result)
        except Exception as e:
            return Response(
                {"error": f"AI processing failed: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
def get_problem_metadata(request, cf_id):
    """
    GET /api/solutions/problems/<cf_id>/meta-func/
    Returns the problem statement and top 3 C++ solution URLs
    (function-based version of ProblemMetaView).
    """
    try:
        statement   = fetch_problem_statement(cf_id)
        submissions = fetch_top_cpp_submission_urls(cf_id, limit=3)
        return Response({
            "problem_statement": statement,
            "submission_links": submissions
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
