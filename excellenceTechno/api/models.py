from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    role_choices = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    email = models.EmailField(unique=True)   
    role = models.CharField(max_length=50, default='user',choices=role_choices)  

    def __str__(self):
        return self.username
    
    
    
class Todo(models.Model):
    
    category_choices = (
        ('Urgent', 'Urgent'),
        ('Non-Urgent', 'Non-Urgent'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=category_choices, default='Non-Urgent')
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title