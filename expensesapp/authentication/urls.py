from .views import *
from django.urls import path

urlpatterns = [
    path('register', RegisterationView.as_view(), name="register")
]