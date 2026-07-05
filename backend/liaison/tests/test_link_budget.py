import math

from django.test import TestCase

from ..services.link_budget import (
    classify_link,
    compute_fspl_db,
    compute_link_margin_db,
    compute_received_power_dbm,
    run_link_budget,
)


class LinkBudgetTestCase(TestCase):
    def test_fspl_formula(self):
        # d = 10 km, f = 1000 MHz → FSPL = 20*log10(10) + 20*log10(1000) + 32.45
        # = 20*1 + 20*3 + 32.45 = 20 + 60 + 32.45 = 112.45
        fspl = compute_fspl_db(10, 1000)
        self.assertAlmostEqual(fspl, 112.45, places=2)

    def test_received_power(self):
        # Pt=20, Gt=18, Gr=18, FSPL=112.45, Lc_tx=2, Lc_rx=2
        # Pr = 20+18+18 - 112.45 -2 -2 = 56 - 116.45 = -60.45
        pr = compute_received_power_dbm(20, 18, 18, 112.45, 2, 2)
        self.assertAlmostEqual(pr, -60.45, places=2)

    def test_link_margin(self):
        # Pr = -60.45, Sr = -85 → M = -60.45 - (-85) = 24.55
        margin = compute_link_margin_db(-60.45, -85)
        self.assertAlmostEqual(margin, 24.55, places=2)

    def test_classify_stable(self):
        result = classify_link(15)
        self.assertEqual(result["status"], "stable")
        self.assertEqual(result["color"], "green")

    def test_classify_limite(self):
        result = classify_link(10)
        self.assertEqual(result["status"], "limite")
        self.assertEqual(result["color"], "orange")

    def test_classify_instable(self):
        result = classify_link(4)
        self.assertEqual(result["status"], "instable")
        self.assertEqual(result["color"], "red")

    def test_run_link_budget_returns_expected_keys(self):
        params = {
            "frequency_mhz": 2400,
            "distance_km": 15,
            "tx_power_dbm": 20,
            "tx_antenna_gain_dbi": 18,
            "rx_antenna_gain_dbi": 18,
            "tx_cable_loss_db": 2,
            "rx_cable_loss_db": 2,
            "rx_sensitivity_dbm": -85,
        }
        result = run_link_budget(params)
        self.assertIn("fspl_db", result)
        self.assertIn("received_power_dbm", result)
        self.assertIn("link_margin_db", result)
        self.assertIn("classification", result)
        self.assertIn("interpretation", result)
