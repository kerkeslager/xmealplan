from rest_framework import serializers

from . import models

class PlanSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source='uuid', read_only=True)

    class Meta:
        model = models.Plan
        fields = (
            'id',
            'name',
            'starch',
            'fruit',
            'dairy',
            'vegetable',
            'protein',
            'fat',
        )
