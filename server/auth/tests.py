from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

    def test_register(self):
        url = reverse("register")
        data = {"username": "testuser-new", "password": "testpassword"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        user = User.objects.get(username="testuser-new")
        correct = User.check_password(user, "testpassword")
        self.assertTrue(correct)
        self.assertTrue("refresh" in response.data)
        self.assertTrue("access" in response.data)
