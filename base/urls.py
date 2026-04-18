from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    re_path(
        r"^(?:auth)?$", TemplateView.as_view(template_name="index.html"), name="home"
    ),
    path("admin/", admin.site.urls),
    path("apis/", include("apis.urls")),
    path("auth/", include("auth.urls")),
]
