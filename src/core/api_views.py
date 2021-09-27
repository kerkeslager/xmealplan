from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED

class AuthViewSet(viewsets.ViewSet):
    def create(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        assert username
        assert password

        user = authenticate(request, username=username, password=password)

        if not user:
            # TODO Authentication failed
            raise Exception()

        login(request, user)
        return Response({})

    def destroy(self, request):
        logout(request)
        return Response({})

auth = AuthViewSet.as_view({
    'post': 'create',
    'delete': 'destroy',
})

class UserViewSet(viewsets.ViewSet):
    def create(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        assert username
        assert password

        user = User.objects.create_user(username, password=password)

        login(request, user)

        return Response({}, status=HTTP_201_CREATED)

    def retrieve(self, request):
        if not request.user.is_authenticated:
            return Response({
                'is_authenticated': False,
            })

        return Response({
            'is_authenticated': True,
            'name': request.user.username,
        })

user = UserViewSet.as_view({
    'get': 'retrieve',
    'post': 'create',
})
