from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Simulation
from .serializers import SimulationInputSerializer, SimulationListSerializer
from .services.link_budget import (
    generate_fspl_vs_frequency_series,
    generate_pr_vs_distance_series,
    run_link_budget,
)


@api_view(["POST"])
def simulate(request):
    serializer = SimulationInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    params = serializer.validated_data
    results = run_link_budget(params)
    pr_series = generate_pr_vs_distance_series(params)
    fspl_series = generate_fspl_vs_frequency_series(params)

    simulation = Simulation.objects.create(
        frequency_mhz=params["frequency_mhz"],
        distance_km=params["distance_km"],
        tx_power_dbm=params["tx_power_dbm"],
        tx_antenna_gain_dbi=params["tx_antenna_gain_dbi"],
        rx_antenna_gain_dbi=params["rx_antenna_gain_dbi"],
        tx_cable_loss_db=params["tx_cable_loss_db"],
        rx_cable_loss_db=params["rx_cable_loss_db"],
        rx_sensitivity_dbm=params["rx_sensitivity_dbm"],
        height_tx_m=params.get("height_tx_m"),
        height_rx_m=params.get("height_rx_m"),
        fspl_db=results["fspl_db"],
        received_power_dbm=results["received_power_dbm"],
        link_margin_db=results["link_margin_db"],
        classification_status=results["classification"]["status"],
    )

    return Response(
        {
            "id": simulation.id,
            "input": params,
            "results": results,
            "charts": {
                "pr_vs_distance": pr_series,
                "fspl_vs_frequency": fspl_series,
            },
            "created_at": simulation.created_at.isoformat(),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def simulation_list(request):
    queryset = Simulation.objects.all()
    paginator = PageNumberPagination()
    paginator.page_size = 20
    page = paginator.paginate_queryset(queryset, request)
    serializer = SimulationListSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def simulation_detail(request, pk):
    try:
        simulation = Simulation.objects.get(pk=pk)
    except Simulation.DoesNotExist:
        return Response({"detail": "Simulation introuvable."}, status=status.HTTP_404_NOT_FOUND)

    params = {
        "frequency_mhz": simulation.frequency_mhz,
        "distance_km": simulation.distance_km,
        "tx_power_dbm": simulation.tx_power_dbm,
        "tx_antenna_gain_dbi": simulation.tx_antenna_gain_dbi,
        "rx_antenna_gain_dbi": simulation.rx_antenna_gain_dbi,
        "tx_cable_loss_db": simulation.tx_cable_loss_db,
        "rx_cable_loss_db": simulation.rx_cable_loss_db,
        "rx_sensitivity_dbm": simulation.rx_sensitivity_dbm,
    }
    results = run_link_budget(params)
    pr_series = generate_pr_vs_distance_series(params)
    fspl_series = generate_fspl_vs_frequency_series(params)

    return Response(
        {
            "id": simulation.id,
            "input": {
                **params,
                "height_tx_m": simulation.height_tx_m,
                "height_rx_m": simulation.height_rx_m,
            },
            "results": results,
            "charts": {
                "pr_vs_distance": pr_series,
                "fspl_vs_frequency": fspl_series,
            },
            "created_at": simulation.created_at.isoformat(),
        }
    )



