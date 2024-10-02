from django.db import models

class User(models.Model):
    
    id = models.AutoField(primary_key=True)  # Novo campo 'id' como chave primária
    name = models.CharField(max_length=150, default='')
    username = models.CharField(max_length=100, default='', unique = True)
    email = models.EmailField(default='')
    dateofbirth = models.DateField(default='2024-08-09')
    GENDER_CHOICES = [('Man', 'Man'),('Woman', 'Woman'),('Other', 'Other'),]
    gender = models.CharField(max_length=10,choices=GENDER_CHOICES,default='Male')
    location = models.CharField(max_length=255, default='')

    def __str__(self):
        return f'Nickname: {self.username} | E-mail: {self.email}'





class UserTasks(models.Model):
    username = models.CharField(max_length=100, default='')
    user_task = models.CharField(max_length=255, default='')