

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils.scraper import fetch_top_submission_urls, fetch_code
from .utils.ai_client import refactor_and_explain


import os


class ProblemMetaView(APIView):
    def get(self, request, problem_id):
        try:
            statement = fetch_problem_statement(problem_id)
            submissions = fetch_top_submission_urls(problem_id, limit=3)
            return Response({
                "problem_statement": statement,
                "submission_links": submissions
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class TopSubmissionsView(APIView):
    """
    POST {"cf_id": "2051A"} → { "urls": [ ...top 5 URLs... ] }
    """
    def post(self, request):
        cf_id = request.data.get('cf_id')
        if not cf_id:
            return Response(
                {'error': 'cf_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            urls = fetch_top_submission_urls(cf_id, limit=5)
            return Response({'urls': urls})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FetchCodeView(APIView):
    """
    POST {"url": "<CF submission URL>"} → { "code": "<raw source>" }
    """
    def post(self, request):
        url = request.data.get('url')
        if not url:
            return Response(
                {'error': 'Submission URL is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            code = fetch_code(url)
            return Response({'code': code})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .utils.scraper import fetch_code, fetch_problem_statement
from .utils.ai_client import refactor_and_explain

class RefactorCodeView(APIView):
    """
    POST {
      "submission_url": "...",   # optional
      "code": "...",             # optional if submission_url given
      "cf_id": "1234A"           # optional, for context
    }
    → {
      "refactored": "...",
      "explanation": "..."
    }
    """
    def post(self, request):
        submission_url = request.data.get('submission_url')
        cf_id          = request.data.get('cf_id')
        code           = request.data.get('code')

        # 1) If a URL was provided, fetch the raw code
        if submission_url:
            try:
                code = fetch_code(submission_url)
            except Exception as e:
                return Response(
                    {'error': f"Failed to fetch code: {e}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        if not code:
            return Response(
                {'error': 'Provide either submission_url or code'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2) Optionally fetch the problem statement for context
        statement = ""
        if cf_id:
            try:
                statement = fetch_problem_statement(cf_id)
            except Exception:
                # If it fails, we’ll proceed without it
                pass

        # 3) Call the AI client
        try:
            result = refactor_and_explain(code, statement)
            return Response(result)
        except Exception as e:
            return Response(
                {'error': f"AI processing failed: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils.scraper import fetch_problem_statement, fetch_top_submission_urls

@api_view(['GET'])
def get_problem_metadata(request, cf_id):
    try:
        problem_statement = fetch_problem_statement(cf_id)
        submission_links = fetch_top_submission_urls(cf_id, limit=3)
        return Response({
            "problem_statement": problem_statement,
            "submission_links": submission_links
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)
