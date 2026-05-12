from django.http import HttpResponse
from django.urls import path, include

urlpatterns = [
    path("health", lambda request: HttpResponse("OK"), name="health"),
    path("", include("apis.urls")),
    path("auth/", include("auth.urls")),
]
