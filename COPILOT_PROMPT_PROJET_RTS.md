# PROMPT PROJET — Outil de Dimensionnement pour Bilan de Liaison Hertzienne

> **Instructions pour GitHub Copilot / Copilot Chat** : Ce fichier décrit l'intégralité du projet à implémenter. Utilise-le comme contexte permanent (ouvre-le dans un onglet, ou colle-le dans Copilot Chat avec `#file:COPILOT_PROMPT_PROJET_RTS.md`) avant de générer du code. Respecte STRICTEMENT la stack, les formules, et la structure de dossiers décrites ci-dessous. Génère du code commenté en français pour les commentaires métier, et en anglais pour les noms de variables/fonctions (convention standard).

---

## 0. CONTEXTE ACADÉMIQUE

- **Établissement** : École Supérieure Polytechnique (ESP) — UCAD Dakar
- **Filière** : DIC2 INFO / M1 GLSI — DGI/ESP/UCAD 2025/2026
- **Module** : Réseaux Télécoms et Services (RTS)
- **Enseignant** : Dr. Magoné Fall
- **Binôme** : Youssouph Gnaga Diatta & Souleymane KONÉ
- **État actuel** : Phases 1 (Préparation) et 2 (Conception) déjà rédigées et validées (document joint). On passe maintenant aux **Phases 3 & 4 : Développement Front-End + Back-End**.
- **Deadline projet** : 15 juin 2026 (cf. consigne enseignant — à adapter si le calendrier a été décalé par l'enseignant)

**Sujet retenu parmi les choix possibles du cours** (GSM, UMTS, bilan liaison hertzienne, bilan liaison optique) : **Bilan de liaison hertzienne**.

---

## 1. OBJECTIF DU LIVRABLE LOGICIEL

Développer une **web app complète** permettant de :
1. Saisir les paramètres d'une liaison hertzienne point-à-point.
2. Calculer automatiquement le **FSPL** (Free Space Path Loss), la **puissance reçue (Pr)**, et la **marge de liaison (M)**.
3. Classifier la liaison : **Stable / Limite / Instable**.
4. Afficher les résultats avec code couleur + graphiques (Pr vs distance, FSPL vs fréquence).
5. Exporter un **rapport PDF** complet.
6. Historiser les simulations en base de données.

---

## 2. STACK TECHNOLOGIQUE (NE PAS DÉVIER)

| Couche | Technologie | Détails |
|---|---|---|
| Front-End | **React.js** (Vite, pas Create-React-App) | Hooks (`useState`, `useEffect`), pas de TypeScript sauf si demandé |
| Style | **CSS** (classes utilitaires custom ou Tailwind si Copilot le propose — à valider) | Responsive mobile-first |
| Graphiques | **Recharts** | Courbes Pr(d) et FSPL(f) |
| Back-End | **Django + Django REST Framework (DRF)** | API REST, calculs en Python |
| Calcul scientifique | **NumPy** (optionnel mais recommandé) | Pour les courbes (génération de séries de points) |
| Base de données | **MySQL** | Stockage des simulations (historique) |
| Export PDF | **jsPDF + html2canvas** (côté client, dans React) | Génération du rapport directement dans le navigateur |
| Versionnement | **Git / GitHub** | Commits atomiques, branche `dev` + `main` |

> Ne propose pas Next.js, Flask, PostgreSQL, ou un autre stack — ce choix a été justifié et validé en Phase 2 du rapport (voir section "Justification des choix" : React pour les hooks/écosystème, Django REST pour NumPy/SciPy natif et séparation front/back).

---

## 3. ARCHITECTURE GLOBALE (3-TIERS)

```
┌─────────────────────────────┐      HTTP/JSON       ┌──────────────────────────────┐      ORM      ┌─────────────┐
│   Couche Présentation        │ ───────────────────► │   Couche Métier               │ ───────────► │  Couche      │
│   React.js (Front-End)       │ ◄─────────────────── │   Django REST API             │ ◄───────────  │  Données     │
│   - Formulaire de saisie     │     POST /api/...    │   - Moteur de calcul FSPL     │              │  MySQL       │
│   - Affichage résultats      │                       │   - Calcul Pr, marge          │              │  - Historique│
│   - Graphiques Recharts      │                       │   - Classification           │              │    simulations│
│   - Export PDF (jsPDF)       │                       │   - Sérialisation JSON       │              │             │
└─────────────────────────────┘                       └──────────────────────────────┘              └─────────────┘
```

### Modules fonctionnels (4, indépendants et interopérables)
1. **Module 1 — Saisie des paramètres** (Front) : formulaire avec validation temps réel.
2. **Module 2 — Moteur de calcul télécom** (Back) : FSPL, Pr, marge, classification.
3. **Module 3 — Visualisation graphique** (Front) : courbes interactives.
4. **Module 4 — Génération de rapport PDF** (Front, côté client) : export complet.

---

## 4. STRUCTURE DE DOSSIERS ATTENDUE

```
projet-rts-bilan-liaison/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                      # settings Django (anciennement <projectname>)
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── liaison/                     # app Django principale
│       ├── __init__.py
│       ├── models.py                 # modèle Simulation (historique)
│       ├── serializers.py            # DRF serializers (input + output)
│       ├── services/
│       │   ├── __init__.py
│       │   └── link_budget.py        # MOTEUR DE CALCUL (logique pure, testable)
│       ├── views.py                  # ViewSets / APIView
│       ├── urls.py                   # routes de l'app
│       ├── validators.py             # validation des plages de valeurs (BF1)
│       └── tests/
│           ├── __init__.py
│           └── test_link_budget.py   # tests unitaires des formules (Phase 5 anticipée)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── liaisonApi.js         # appels fetch/axios vers /api/simulate
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── HomePage.jsx          # 10.a Page d'accueil
│       │   ├── SimulationForm.jsx    # 10.b Page de simulation (formulaire)
│       │   ├── ResultsPage.jsx       # 10.c Page de résultats
│       │   ├── StatusBanner.jsx      # bandeau coloré stable/limite/instable
│       │   ├── ResultsTable.jsx      # tableau récapitulatif
│       │   ├── ChartPrVsDistance.jsx
│       │   ├── ChartFsplVsFrequency.jsx
│       │   └── PdfExportButton.jsx
│       ├── hooks/
│       │   └── useSimulation.js      # state management du formulaire + résultats
│       ├── utils/
│       │   └── validators.js         # validation côté client (miroir du back)
│       └── styles/
│           └── *.css
└── README.md
```

---

## 5. FORMULES TÉLÉCOM À IMPLÉMENTER (RÉFÉRENCE UNIQUE — NE PAS EN INVENTER D'AUTRES)

> ⚠️ Toutes les formules ci-dessous doivent être implémentées dans `backend/liaison/services/link_budget.py`, avec une fonction Python pure par formule (facilement testable unitairement). Le front-end NE DOIT PAS recalculer ces formules — il appelle l'API.

### 5.1 — Pertes en espace libre (FSPL — formule de Friis, convention km/MHz)

```
FSPL(dB) = 20·log10(d_km) + 20·log10(f_MHz) + 32.45
```

- `d_km` : distance émetteur-récepteur en kilomètres
- `f_MHz` : fréquence porteuse en MHz (convertir si l'utilisateur saisit en GHz : `f_MHz = f_GHz * 1000`)
- Constante **32.45** (valable pour d en km et f en MHz — NE PAS utiliser 92.45 qui est la constante pour d en km et f en GHz, ni -27.55 qui est pour d en mètres et f en MHz)

```python
import math

def compute_fspl_db(distance_km: float, frequency_mhz: float) -> float:
    """Calcule les pertes en espace libre (Free Space Path Loss) selon Friis.
    Convention : distance en km, fréquence en MHz, constante = 32.45 dB.
    """
    if distance_km <= 0 or frequency_mhz <= 0:
        raise ValueError("La distance et la fréquence doivent être strictement positives.")
    return 20 * math.log10(distance_km) + 20 * math.log10(frequency_mhz) + 32.45
```

### 5.2 — Puissance reçue (Pr)

```
Pr(dBm) = Pt(dBm) + Gt(dBi) + Gr(dBi) - FSPL(dB) - Lc_tx(dB) - Lc_rx(dB)
```

- `Pt` : puissance d'émission (dBm)
- `Gt`, `Gr` : gains antennes émission/réception (dBi)
- `Lc_tx`, `Lc_rx` : pertes câbles/connecteurs côté émission et réception (dB)
- `FSPL` : calculé en 5.1

```python
def compute_received_power_dbm(pt_dbm: float, gt_dbi: float, gr_dbi: float,
                                 fspl_db: float, lc_tx_db: float, lc_rx_db: float) -> float:
    """Calcule la puissance reçue (Pr) au niveau du récepteur."""
    return pt_dbm + gt_dbi + gr_dbi - fspl_db - lc_tx_db - lc_rx_db
```

### 5.3 — Marge de liaison (M)

```
M(dB) = Pr(dBm) - Sr(dBm)
```

- `Sr` : sensibilité du récepteur (dBm), généralement une valeur négative (ex: -85 dBm)

```python
def compute_link_margin_db(pr_dbm: float, sensitivity_dbm: float) -> float:
    """Calcule la marge de liaison disponible."""
    return pr_dbm - sensitivity_dbm
```

### 5.4 — Classification automatique de la liaison

Seuils paramétrables (à définir comme constantes en haut de `link_budget.py`, modifiables facilement) :

| Marge M | Classification | Couleur |
|---|---|---|
| M ≥ 15 dB | **Liaison stable** | 🟢 vert |
| 5 dB ≤ M < 15 dB | **Liaison limite** | 🟠 orange |
| M < 5 dB | **Liaison instable** | 🔴 rouge |

```python
LINK_MARGIN_STABLE_THRESHOLD_DB = 15
LINK_MARGIN_LIMIT_THRESHOLD_DB = 5

def classify_link(margin_db: float) -> dict:
    """Retourne le statut de la liaison + couleur associée selon la marge."""
    if margin_db >= LINK_MARGIN_STABLE_THRESHOLD_DB:
        return {"status": "stable", "label": "Liaison stable", "color": "green"}
    elif margin_db >= LINK_MARGIN_LIMIT_THRESHOLD_DB:
        return {"status": "limite", "label": "Liaison limite", "color": "orange"}
    else:
        return {"status": "instable", "label": "Liaison instable", "color": "red"}
```

### 5.5 — Fonction d'orchestration globale (utilisée par la vue DRF)

```python
def run_link_budget(params: dict) -> dict:
    """
    Orchestration complète du bilan de liaison à partir d'un dict de paramètres bruts.
    params attendu (toutes clés obligatoires sauf height_tx_m / height_rx_m) :
        frequency_mhz, distance_km, tx_power_dbm,
        tx_antenna_gain_dbi, rx_antenna_gain_dbi,
        tx_cable_loss_db, rx_cable_loss_db, rx_sensitivity_dbm,
        height_tx_m (optionnel), height_rx_m (optionnel)
    Retourne un dict prêt à être sérialisé en JSON pour le front.
    """
    fspl_db = compute_fspl_db(params["distance_km"], params["frequency_mhz"])
    pr_dbm = compute_received_power_dbm(
        params["tx_power_dbm"], params["tx_antenna_gain_dbi"], params["rx_antenna_gain_dbi"],
        fspl_db, params["tx_cable_loss_db"], params["rx_cable_loss_db"]
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
```

### 5.6 — Données pour les graphiques (Module 3)

L'API doit aussi exposer une route qui génère des **séries de points** (et non une seule valeur) pour :
- **Pr en fonction de la distance** : faire varier `distance_km` sur une plage (ex: de 1 km à 2×distance saisie, 30 points), tous les autres paramètres fixes.
- **FSPL en fonction de la fréquence** : faire varier `frequency_mhz` sur une plage pertinente (ex: 100 MHz à 10×fréquence saisie, 30 points), distance fixe.

```python
def generate_pr_vs_distance_series(params: dict, n_points: int = 30) -> list[dict]:
    """Génère des points (distance_km, pr_dbm) pour le graphique Module 3."""
    import numpy as np
    max_distance = max(params["distance_km"] * 2, 5)
    distances = np.linspace(0.5, max_distance, n_points)
    series = []
    for d in distances:
        fspl = compute_fspl_db(d, params["frequency_mhz"])
        pr = compute_received_power_dbm(
            params["tx_power_dbm"], params["tx_antenna_gain_dbi"], params["rx_antenna_gain_dbi"],
            fspl, params["tx_cable_loss_db"], params["rx_cable_loss_db"]
        )
        series.append({"distance_km": round(float(d), 2), "received_power_dbm": round(pr, 2)})
    return series

def generate_fspl_vs_frequency_series(params: dict, n_points: int = 30) -> list[dict]:
    """Génère des points (frequency_mhz, fspl_db) pour le graphique Module 3."""
    import numpy as np
    max_freq = max(params["frequency_mhz"] * 3, 1000)
    frequencies = np.linspace(50, max_freq, n_points)
    series = []
    for f in frequencies:
        fspl = compute_fspl_db(params["distance_km"], f)
        series.append({"frequency_mhz": round(float(f), 2), "fspl_db": round(fspl, 2)})
    return series
```

> 💡 Note pédagogique pour le rapport : ces formules suivent les recommandations télécom standard (cf. UIT-R) mentionnées comme exigence de fiabilité (BNF "Fiabilité" du cahier des charges Phase 1).

---

## 6. VALIDATION DES DONNÉES (BF1 + Sécurité non-fonctionnelle)

Plages de valeurs raisonnables à valider **côté client (React) ET côté serveur (Django)** :

| Paramètre | Min | Max | Unité |
|---|---|---|---|
| Fréquence | 1 | 100 000 | MHz |
| Distance | 0.01 | 1000 | km |
| Puissance d'émission | -50 | 60 | dBm |
| Gain antenne TX/RX | 0 | 60 | dBi |
| Pertes câbles TX/RX | 0 | 20 | dB |
| Sensibilité récepteur | -150 | -20 | dBm |
| Hauteur antennes (optionnel) | 1 | 200 | m |

- Backend : utiliser les **DRF serializers** avec `min_value` / `max_value` sur chaque champ (`serializers.FloatField`).
- Frontend : validation en temps réel (`onChange` + affichage de message d'erreur sous le champ, pas de blocage bloquant brutal mais désactivation du bouton "Calculer" si formulaire invalide).
- Si des données invalides sont soumises malgré tout → l'API retourne `400 Bad Request` avec un message clair en français, affiché dans le composant `SimulationForm.jsx`.

---

## 7. API REST — CONTRAT D'ENDPOINTS

### `POST /api/simulate/`
**Requête (JSON)** :
```json
{
  "frequency_mhz": 2400,
  "distance_km": 15,
  "tx_power_dbm": 20,
  "tx_antenna_gain_dbi": 18,
  "rx_antenna_gain_dbi": 18,
  "tx_cable_loss_db": 2,
  "rx_cable_loss_db": 2,
  "rx_sensitivity_dbm": -85,
  "height_tx_m": 30,
  "height_rx_m": 25
}
```

**Réponse (200 OK)** :
```json
{
  "id": 12,
  "input": { "...paramètres saisis..." },
  "results": {
    "fspl_db": 112.5,
    "received_power_dbm": -60.5,
    "link_margin_db": 24.5,
    "classification": { "status": "stable", "label": "Liaison stable", "color": "green" },
    "interpretation": "Liaison stable — Marge de 24.5 dB"
  },
  "charts": {
    "pr_vs_distance": [ { "distance_km": 0.5, "received_power_dbm": -30.1 }, "..." ],
    "fspl_vs_frequency": [ { "frequency_mhz": 50, "fspl_db": 78.2 }, "..." ]
  },
  "created_at": "2026-06-27T10:00:00Z"
}
```
→ Cette même requête **enregistre la simulation en base** (modèle `Simulation`) pour l'historique.

### `GET /api/simulations/` — Historique (liste paginée, optionnel BF mais utile pour la soutenance)
### `GET /api/simulations/{id}/` — Détail d'une simulation passée

---

## 8. MODÈLE DE DONNÉES (Django ORM → MySQL)

```python
# backend/liaison/models.py
from django.db import models

class Simulation(models.Model):
    frequency_mhz = models.FloatField()
    distance_km = models.FloatField()
    tx_power_dbm = models.FloatField()
    tx_antenna_gain_dbi = models.FloatField()
    rx_antenna_gain_dbi = models.FloatField()
    tx_cable_loss_db = models.FloatField()
    rx_cable_loss_db = models.FloatField()
    rx_sensitivity_dbm = models.FloatField()
    height_tx_m = models.FloatField(null=True, blank=True)
    height_rx_m = models.FloatField(null=True, blank=True)

    fspl_db = models.FloatField()
    received_power_dbm = models.FloatField()
    link_margin_db = models.FloatField()
    classification_status = models.CharField(max_length=20)  # stable / limite / instable

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
```

Settings MySQL (`backend/config/settings.py`) :
```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "bilan_liaison_db",
        "USER": "root",
        "PASSWORD": "<à définir dans .env, ne pas committer>",
        "HOST": "localhost",
        "PORT": "3306",
        "OPTIONS": {"charset": "utf8mb4"},
    }
}
```
> Utiliser `python-dotenv` ou `django-environ` pour ne jamais committer les credentials MySQL (fichier `.env` + `.env.example` + `.gitignore`).

---

## 8.bis DESIGN SYSTEM — DIRECTION ARTISTIQUE (À SUIVRE À LA LETTRE)

> ⚠️ Sans cette section, Copilot génère par défaut un dashboard SaaS générique (cards blanches, ombres molles, bleu Bootstrap). **Interdiction de partir sur ce défaut.** L'identité visuelle ci-dessous est pensée pour le sujet réel : une console d'ingénierie radio — un signal émis perd en puissance en traversant l'espace, jusqu'à atteindre (ou non) le récepteur. Tout l'habillage visuel doit raconter ça.

### Concept directeur
Pense "console RF d'un ingénieur télécom" plutôt que "dashboard web app". Fond sombre comme un écran de spectre analyseur, données en évidence comme sur un oscilloscope, une seule touche de couleur vive réservée au statut de la liaison (le signal lui-même).

### Palette (à respecter exactement — variables CSS)
```css
:root {
  --bg-primary: #0B0E14;       /* fond principal, presque noir bleuté */
  --bg-surface: #11151F;       /* cards, panneaux de formulaire */
  --bg-surface-raised: #161B28; /* éléments surélevés (inputs focus, hover) */
  --border-subtle: #232A3A;    /* séparateurs, bordures fines */
  --text-primary: #E8EBF2;     /* texte principal */
  --text-muted: #7C879E;       /* labels, unités, texte secondaire */
  --accent-signal: #00D9A3;    /* vert-cyan "signal actif" — CTA, focus, liaison stable */
  --accent-warning: #FFB347;   /* liaison limite */
  --accent-critical: #FF5C72;  /* liaison instable */
  --accent-data: #5B8DEF;      /* courbes graphiques, valeurs calculées */
}
```
Ne PAS utiliser de bleu Bootstrap (#0d6efd), de violet "AI-generated" (#8b5cf6), ni de fond blanc/gris clair par défaut. Le fond sombre est un choix délibéré, pas une option dark-mode secondaire.

### Typographie
- **Display / titres** : `"Space Grotesk"` (Google Fonts) — géométrique, légèrement technique, bon pour les gros chiffres de résultats (Pr, marge en dB).
- **Corps de texte / labels** : `"Inter"` — lisible, neutre, pour les formulaires et descriptions.
- **Valeurs numériques / unités / code** : `"JetBrains Mono"` ou `"IBM Plex Mono"` — toutes les valeurs en dBm, dBi, dB, MHz doivent être en monospace pour évoquer un instrument de mesure. C'est un détail signature : **chaque nombre affiché à l'écran (résultats, tableau, axes de graphique) est en police mono**, jamais en police standard.

Échelle type :
```css
--font-display: "Space Grotesk", sans-serif;
--font-body: "Inter", sans-serif;
--font-mono: "JetBrains Mono", monospace;

--text-hero: 2.5rem;      /* titre page d'accueil */
--text-result-xl: 3rem;   /* la marge de liaison affichée en gros, en mono */
--text-h2: 1.5rem;
--text-body: 0.95rem;
--text-caption: 0.8rem;   /* unités, labels secondaires */
```

### Élément signature : le "Signal Path" (à intégrer sur la page de résultats)
L'élément mémorable du design est une **représentation visuelle horizontale du trajet du signal** (un mini budget waterfall en haut de la page de résultats, au-dessus du tableau) :
```
[Pt] ──Gt──► ░░░░░░ FSPL ░░░░░░ ──Gr──► [Pr] ╌╌╌╌ marge ╌╌╌╌ [Sr]
 ▲ point plein                                    ▲ point creux si marge faible
```
- Implémenter en SVG léger ou en flex/CSS (pas besoin de lib lourde) : une ligne horizontale avec des points/segments représentant Pt → pertes → Pr → seuil Sr, avec la zone de marge mise en évidence par la couleur du statut (vert/orange/rouge).
- Cet élément réutilise directement la logique du `StatusBanner` mais sous forme graphique plutôt que texte — c'est LE signature element de toute l'interface, à ne pas sacrifier.

### Layout & composants
- **Cards** : `--bg-surface`, bordure 1px `--border-subtle`, `border-radius: 12px`, **pas d'ombre portée molle générique** — préférer une bordure subtile qui s'illumine légèrement (`box-shadow: 0 0 0 1px var(--accent-signal)` en `:focus-within`) plutôt qu'un `box-shadow` gris flou.
- **Inputs** : fond `--bg-surface-raised`, bordure `--border-subtle`, au focus la bordure passe à `--accent-signal` avec une transition `150ms ease`. Unité affichée en suffixe dans le champ (ex: "MHz" en `--text-muted`, aligné à droite dans l'input), pas dans un label séparé seulement.
- **Bandeau de statut (`StatusBanner`)** : pas un simple bloc de couleur plein — fond `--bg-surface` avec une bordure gauche épaisse (4-6px) de la couleur du statut, et le texte d'interprétation en `--font-display`. Évite le bandeau "alerte Bootstrap" plein de couleur saturée sur toute la largeur.
- **Graphiques Recharts** : fond transparent (hérite de `--bg-surface`), grille `--border-subtle` en pointillés fins, courbe en `--accent-data`, le point correspondant à la simulation actuelle marqué par un point de la couleur du statut avec un léger halo (`drop-shadow`).
- **Boutons** : bouton primaire ("Calculer le bilan") en `--accent-signal` plein avec texte `--bg-primary` (contraste fort), bouton secondaire ("Réinitialiser") en outline `--border-subtle` avec texte `--text-muted`.
- **Page d'accueil** : pas de hero générique "titre + sous-titre + bouton centré". Utilise le signal path (version simplifiée, animée en boucle douce au chargement — un point qui voyage de gauche à droite) comme illustration principale du hero, avec le titre du projet à côté/au-dessus.

### Mouvement
- Une seule animation orchestrée à privilégier : au chargement de la page de résultats, le "Signal Path" se dessine progressivement (trait qui se trace de gauche à droite, ~600ms, `ease-out`) plutôt que d'apparaître statique. 
- Transitions de hover/focus courtes (120-150ms), pas d'animation décorative sur chaque élément (pas de fade-in en cascade sur chaque card, ça lit comme généré par IA).
- Respecter `prefers-reduced-motion: reduce` (désactiver les animations si l'utilisateur l'a demandé au niveau système).

### Responsive
- Mobile (< 640px) : sections du formulaire en accordéon empilé verticalement, signal path qui passe en orientation simplifiée (toujours horizontal mais texte réduit), graphiques en pleine largeur.
- Desktop (≥ 1024px) : formulaire en grille 2 colonnes par section, signal path pleine largeur au-dessus du tableau + graphiques.

---

## 9. SPÉCIFICATIONS UI/UX DÉTAILLÉES (cohérentes avec Phase 2, section 10)

### 9.a — Page d'accueil (`HomePage.jsx`)
- En-tête avec nom du projet : **"LinkBudget Pro"** (ou nom de votre choix)
- Description courte du rôle de l'outil
- Bouton CTA "Démarrer une simulation" → navigue vers `SimulationForm`

### 9.b — Page de simulation (`SimulationForm.jsx`)
Formulaire en 3 sections thématiques (accordéons ou cards) :
- **Section Paramètres radio** : fréquence (+ sélecteur unité MHz/GHz), distance (km)
- **Section Émetteur** : Pt (dBm), Gt (dBi), pertes câbles TX (dB)
- **Section Récepteur** : sensibilité Sr (dBm), Gr (dBi), pertes câbles RX (dB)
- Champs optionnels hauteur antennes (repliable "Paramètres avancés")
- Boutons : **Calculer le bilan** (POST vers API) / **Réinitialiser** (reset form state)
- Affichage des erreurs de validation en rouge sous chaque champ concerné

### 9.c — Page de résultats (`ResultsPage.jsx`)
- `StatusBanner.jsx` : bandeau pleine largeur, fond vert/orange/rouge selon `classification.color`, texte = `interpretation`
- `ResultsTable.jsx` : tableau à deux colonnes "Paramètre saisi" | "Résultat calculé"
- `ChartPrVsDistance.jsx` + `ChartFsplVsFrequency.jsx` : deux graphiques Recharts (LineChart), avec ligne verticale/marqueur indiquant la valeur correspondant à la simulation actuelle
- `PdfExportButton.jsx` : bouton "Télécharger le rapport PDF" déclenchant `html2canvas` + `jsPDF` sur un conteneur dédié regroupant tableau + graphiques + interprétation

---

## 10. PLAN D'IMPLÉMENTATION RECOMMANDÉ (ordre des prompts à donner à Copilot)

> Donne ces étapes à Copilot Chat **une par une**, dans cet ordre, en gardant ce fichier en contexte :

1. **Setup backend** : `django-admin startproject config .` + créer l'app `liaison` + configurer MySQL + installer `djangorestframework`, `django-cors-headers`, `python-dotenv`, `numpy`.
2. **Moteur de calcul** : générer `services/link_budget.py` avec les fonctions de la section 5 (copier les exemples ci-dessus, les compléter/affiner).
3. **Tests unitaires** : générer `tests/test_link_budget.py` avec au moins 3 cas de test (un cas "stable", un "limite", un "instable") en vérifiant les valeurs numériques attendues calculées à la main.
4. **Serializers + Validators** : `serializers.py` avec les bornes de la section 6.
5. **Vue API** : `views.py` avec une `APIView` (ou `ViewSet`) pour `POST /api/simulate/`, qui appelle `run_link_budget`, sauvegarde en DB via le modèle `Simulation`, retourne le JSON conforme à la section 7.
6. **Routes** : `urls.py` (app) + inclusion dans `config/urls.py`.
7. **CORS** : configurer `django-cors-headers` pour autoriser `http://localhost:5173` (Vite).
8. **Setup frontend** : `npm create vite@latest frontend -- --template react` + installer `recharts`, `jspdf`, `html2canvas`, `axios`.
9. **Design tokens d'abord** : créer `src/styles/tokens.css` (ou `:root` dans un fichier global) avec exactement les variables CSS de la section 8.bis (couleurs, polices, échelle typographique) + import des polices Google Fonts (Space Grotesk, Inter, JetBrains Mono) avant de toucher au moindre composant.
10. **Composants UI** dans l'ordre : `HomePage` (avec signal path animé en hero) → `SimulationForm` (+ `validators.js`) → `useSimulation` hook → `liaisonApi.js` → `ResultsPage` (+ sous-composants, en commençant par le composant `SignalPath.jsx` — l'élément signature de la section 8.bis) → `PdfExportButton`.
11. **Styles CSS** responsive (mobile-first, breakpoints simples), en respectant strictement la section 8.bis (pas d'ombres molles génériques, pas de fond blanc, valeurs numériques en police mono).
12. **Tests d'intégration manuels** : vérifier le flux complet saisie → calcul → affichage → export PDF.
13. **README.md** : instructions d'installation (`pip install -r requirements.txt`, `npm install`, variables d'environnement, commandes de lancement).

---

## 11. CONTRAINTES NON-FONCTIONNELLES À RESPECTER DANS LE CODE

- **Performance** : le calcul doit être quasi instantané (< 2s) — pas de calcul lourd, NumPy suffit largement.
- **Ergonomie** : labels clairs en français, unités toujours affichées à côté des champs, tooltips d'aide possibles sur les paramètres techniques (Gt, Lc, Sr...).
- **Compatibilité** : CSS responsive testé au minimum en largeur mobile (375px) et desktop (1280px+).
- **Maintenabilité** : commentaires français sur la logique métier (formules), noms de fonctions/variables en anglais, séparation stricte logique métier (`services/`) / présentation (`views.py`) / accès données (`models.py`).
- **Sécurité** : validation systématique côté serveur même si le front valide déjà (ne jamais faire confiance au seul client).

---

## 12. RAPPEL — CE QUE COPILOT NE DOIT PAS FAIRE

- Ne pas remplacer Django REST par Flask/FastAPI/Express.
- Ne pas remplacer MySQL par SQLite/PostgreSQL/MongoDB (sauf en dev local temporaire si MySQL pose un souci d'installation — dans ce cas le signaler explicitement en commentaire, ne pas le faire silencieusement).
- Ne pas inventer de nouvelles formules de bilan de liaison non listées en section 5.
- Ne pas utiliser de constante FSPL autre que **32.45** (km/MHz) — c'est une source d'erreur fréquente avec d'autres conventions d'unités (92.45 pour km/GHz, -27.55 pour m/MHz).
- Ne pas générer le PDF côté serveur (Django) — c'est explicitement une génération **côté client** (jsPDF + html2canvas), conformément au choix technologique validé en Phase 2.
- Ne pas ignorer la section 8.bis (Design System) : pas de fond blanc/gris clair par défaut, pas d'ombres molles génériques type Bootstrap, pas de bleu/violet "AI-generated" par défaut. Le thème sombre + le composant `SignalPath` sont des choix imposés, pas des suggestions.

---

## 13. EXEMPLE DE PROMPT D'AMORÇAGE POUR COPILOT CHAT

```
En te basant sur le fichier COPILOT_PROMPT_PROJET_RTS.md ouvert dans ce projet,
génère la structure complète du backend Django (étape 1 du plan d'implémentation,
section 10). Crée le projet "config", l'app "liaison", configure MySQL avec
django-environ pour les credentials, et installe les dépendances listées dans
requirements.txt. Respecte la structure de dossiers de la section 4.
```

---

*Document généré pour servir de prompt système à GitHub Copilot — Projet RTS, ESP/UCAD, 2025/2026.*
