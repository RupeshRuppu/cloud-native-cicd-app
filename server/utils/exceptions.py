# utils/exceptions.py

from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    data = response.data

    # Handle Simple JWT errors
    if isinstance(data, dict) and "messages" in data:
        try:
            message = data["messages"][0]["message"]
            response.data = {"error": message}
        except (KeyError, IndexError):
            response.data = {"error": "Authentication error"}

    # Handle normal DRF errors
    elif "detail" in data:
        response.data = {"error": data["detail"]}

    return response
