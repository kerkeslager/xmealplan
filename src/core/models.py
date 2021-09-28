import uuid

from django.contrib.auth.models import User
from django.db import models

class Plan(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plans')
    is_selected = models.BooleanField()
    name = models.TextField()
    starch = models.PositiveSmallIntegerField()
    fruit = models.PositiveSmallIntegerField()
    dairy = models.PositiveSmallIntegerField()
    vegetable = models.PositiveSmallIntegerField()
    protein = models.PositiveSmallIntegerField()
    fat = models.PositiveSmallIntegerField()

