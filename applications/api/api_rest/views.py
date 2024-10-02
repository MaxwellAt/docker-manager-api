from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializers import UserSerializer

import json

#from . import funcoes as fn



@api_view(['GET'])
def get_users(request):

    if request.method == 'GET':
        users = User.objects.all()                          # Get all objects in User's database (It returns a queryset)
        serializer = UserSerializer(users, many=True)       # Serialize the object data into json (Has a 'many' parameter cause it's a queryset)
        return Response({
            "message": "Usuários encontrados",
            "data": serializer.data
        }, status=status.HTTP_200_OK)  # Código 200 OK para GET com sucesso                    # Return the serialized data

    return Response(status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT'])
def get_by_id(request, id):

    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response({
            "message": "Usuário não encontrado"
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response({
            "message": "Usuário encontrado",
            "data": serializer.data
        }, status=status.HTTP_200_OK)  # Código 200 OK para GET com sucesso

    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Usuário atualizado com êxito!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Erro ao atualizar usuário. Verifique os dados e tente novamente.",
            "errors": serializer.errors
        }, status=status.HTTP_404_NOT_FOUND)




# CRUDZAO DA MASSA
@api_view(['GET','POST','PUT','DELETE'])
def user_manager(request):

    if request.method == 'GET':
        user_id = request.GET.get('id')
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
                serializer = UserSerializer(user)
                return Response({
                    "message": "Usuário encontrado",
                    "data": serializer.data
                }, status=status.HTTP_200_OK)   # Código 200 OK para GET com sucesso
            except User.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)

    

# CRIANDO DADOS

    if request.method == 'POST':

        new_user = request.data
        serializer = UserSerializer(data=new_user)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Usuário cadastrado com sucesso!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "message": "Erro ao cadastrar usuário. Verifique os dados e tente novamente.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



"""
# EDITAR DADOS (PUT)

    if request.method == 'PUT':
        # Obtém o 'user_id' do corpo da requisição
        user_id = request.data.get('id')
        
        # Verifica se 'user_id' está presente no corpo da requisição
        if not user_id:
            return Response({
                "message": "O campo 'user_nickname' é obrigatório."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            updated_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({
                "message": "Usuário não encontrado."
            }, status=status.HTTP_404_NOT_FOUND)

        # Cria o serializer com os dados atualizados
        serializer = UserSerializer(updated_user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Usuário atualizado com êxito!",
                "data": serializer.data
            }, status=status.HTTP_202_ACCEPTED)

        return Response({
            "message": "Erro ao atualizar usuário. Verifique os dados e tente novamente.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

"""


# DELETAR DADOS (DELETE)
@api_view(['DELETE'])  # Define que a view só aceita requisições DELETE
def delete_user_by_id(request, id):
    try:
        user_to_delete = User.objects.get(pk=id)  # Busca o usuário pelo username
        user_to_delete.delete()  # Deleta o usuário
        return Response({
            "message": f"Usuário '{id}' excluído com sucesso!"
        }, status=status.HTTP_204_NO_CONTENT)

    except User.DoesNotExist:
        return Response({
            "message": f"Usuário '{id}' não encontrado."
        }, status=status.HTTP_404_NOT_FOUND)
















# def databaseEmDjango():

#     data = User.objects.get(pk='gabriel_nick')          # OBJETO

#     data = User.objects.filter(user_age='25')           # QUERYSET

#     data = User.objects.exclude(user_age='25')          # QUERYSET

#     data.save()

#     data.delete()

