from django.urls import path, include

urlpatterns = [
    path("", include("apis.urls")),
    path("auth/", include("auth.urls")),
]
