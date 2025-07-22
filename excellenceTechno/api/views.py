from django.shortcuts import render

from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

#Token authentication imports
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,IsAdminUser,IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView

# User registration view
class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# User login view
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    


class TodoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'admin':
            todos = Todo.objects.all()
        else:
            todos = request.user.todos.all()
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role == 'admin':
            serializer = TodoSerializer(data=request.data)
        else:
            serializer = TodoSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user if request.user.role != 'admin' else serializer.validated_data.get('user', request.user))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TodoDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, todo_id):
        try:
            todo = Todo.objects.get(id=todo_id)
            if request.user.role == 'admin' or todo.user == request.user:
                return todo
        except Todo.DoesNotExist:
            return None
        return None

    def get(self, request, todo_id):
        todo = self.get_object(request, todo_id)
        if not todo:
            return Response({'error': 'Todo not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TodoSerializer(todo)
        return Response(serializer.data)

    def put(self, request, todo_id):
        todo = self.get_object(request, todo_id)
        if not todo:
            return Response({'error': 'Todo not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TodoSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, todo_id):
        todo = self.get_object(request, todo_id)
        if not todo:
            return Response({'error': 'Todo not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TodoSerializer(todo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, todo_id):
        todo = self.get_object(request, todo_id)
        if not todo:
            return Response({'error': 'Todo not found or permission denied'}, status=status.HTTP_404_NOT_FOUND)
        todo.delete()
        return Response({'msg': "Todo deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


