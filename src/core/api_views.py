from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED

class UserViewSet(viewsets.ViewSet):
    def create(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        assert username
        assert password

        User.objects.create_user(username, password=password)

        return Response({}, status=HTTP_201_CREATED)

    def retrieve(self, request):
        if not request.user.is_authenticated:
            return Response({
                'is_authenticated': False,
            })

        return Response({
            'is_authenticated': True,
            'name': request.user.name,
        })

user = UserViewSet.as_view({
    'get': 'retrieve',
    'post': 'create',
})
