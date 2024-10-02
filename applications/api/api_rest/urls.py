from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.get_users, name='get_all_users'),
    path('users/<int:id>', views.get_by_id),
    path('users', views.user_manager),
    path('users/<int:id>/', views.delete_user_by_id) # Nova rota para DELETE
]