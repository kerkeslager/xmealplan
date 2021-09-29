import uuid

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    selected_plan = models.ForeignKey(
        'Plan',
        on_delete=models.CASCADE,
        null=True,
    )

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender='core.Plan')
    def set_selected_plan(sender, instance, created, **kwargs):
        if instance.user.profile.selected_plan is None:
            instance.user.profile.selected_plan = instance
            instance.user.profile.save()

class Plan(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='plans',
    )
    name = models.TextField()
    starch = models.PositiveSmallIntegerField()
    fruit = models.PositiveSmallIntegerField()
    dairy = models.PositiveSmallIntegerField()
    vegetable = models.PositiveSmallIntegerField()
    protein = models.PositiveSmallIntegerField()
    fat = models.PositiveSmallIntegerField()

    @property
    def is_selected(self) -> bool:
        return self == self.user.profile.selected_plan
