from django.urls import path

from . import views

urlpatterns = [
    path("simulate/", views.simulate, name="simulate"),
    path("simulations/", views.simulation_list, name="simulation-list"),
    path("simulations/<int:pk>/", views.simulation_detail, name="simulation-detail"),
]
