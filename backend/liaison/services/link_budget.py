import math

import numpy as np

LINK_MARGIN_STABLE_THRESHOLD_DB = 15
LINK_MARGIN_LIMIT_THRESHOLD_DB = 5


def compute_fspl_db(distance_km: float, frequency_mhz: float) -> float:
    if distance_km <= 0 or frequency_mhz <= 0:
        raise ValueError("La distance et la fréquence doivent être strictement positives.")
    return 20 * math.log10(distance_km) + 20 * math.log10(frequency_mhz) + 32.45


def compute_received_power_dbm(
    pt_dbm: float, gt_dbi: float, gr_dbi: float,
    fspl_db: float, lc_tx_db: float, lc_rx_db: float,
) -> float:
    return pt_dbm + gt_dbi + gr_dbi - fspl_db - lc_tx_db - lc_rx_db


def compute_link_margin_db(pr_dbm: float, sensitivity_dbm: float) -> float:
    return pr_dbm - sensitivity_dbm


def classify_link(margin_db: float) -> dict:
    if margin_db >= LINK_MARGIN_STABLE_THRESHOLD_DB:
        return {"status": "stable", "label": "Liaison stable", "color": "green"}
    elif margin_db >= LINK_MARGIN_LIMIT_THRESHOLD_DB:
        return {"status": "limite", "label": "Liaison limite", "color": "orange"}
    else:
        return {"status": "instable", "label": "Liaison instable", "color": "red"}


def run_link_budget(params: dict) -> dict:
    fspl_db = compute_fspl_db(params["distance_km"], params["frequency_mhz"])
    pr_dbm = compute_received_power_dbm(
        params["tx_power_dbm"], params["tx_antenna_gain_dbi"], params["rx_antenna_gain_dbi"],
        fspl_db, params["tx_cable_loss_db"], params["rx_cable_loss_db"],
    )
    margin_db = compute_link_margin_db(pr_dbm, params["rx_sensitivity_dbm"])
    classification = classify_link(margin_db)

    return {
        "fspl_db": round(fspl_db, 2),
        "received_power_dbm": round(pr_dbm, 2),
        "link_margin_db": round(margin_db, 2),
        "classification": classification,
        "interpretation": f"{classification['label']} — Marge de {round(margin_db, 1)} dB",
    }


def generate_pr_vs_distance_series(params: dict, n_points: int = 30) -> list[dict]:
    max_distance = max(params["distance_km"] * 2, 5)
    distances = np.linspace(0.5, max_distance, n_points)
    series = []
    for d in distances:
        fspl = compute_fspl_db(d, params["frequency_mhz"])
        pr = compute_received_power_dbm(
            params["tx_power_dbm"], params["tx_antenna_gain_dbi"],
            params["rx_antenna_gain_dbi"],
            fspl, params["tx_cable_loss_db"], params["rx_cable_loss_db"],
        )
        series.append({"distance_km": round(float(d), 2), "received_power_dbm": round(pr, 2)})
    return series


def generate_fspl_vs_frequency_series(params: dict, n_points: int = 30) -> list[dict]:
    max_freq = max(params["frequency_mhz"] * 3, 1000)
    frequencies = np.linspace(50, max_freq, n_points)
    series = []
    for f in frequencies:
        fspl = compute_fspl_db(params["distance_km"], f)
        series.append({"frequency_mhz": round(float(f), 2), "fspl_db": round(fspl, 2)})
    return series
