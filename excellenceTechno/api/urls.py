
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import *

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_registration'), 
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('logout/', TokenRefreshView.as_view(), name='token_refresh'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    

    path('todos/', TodoListView.as_view(), name='todo_list'),  
    path('todos/<int:todo_id>/', TodoDetailView.as_view(), name='todo_detail'), 
 
]