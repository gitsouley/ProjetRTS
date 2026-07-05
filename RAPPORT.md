# Rapport du Projet RTS — LinkBudget Pro

**Outil de dimensionnement pour bilan de liaison hertzienne point-à-point**

---

## Informations générales

| | |
|---|---|
| **Établissement** | École Supérieure Polytechnique (ESP) — UCAD Dakar |
| **Filière** | DIC2 INFO / M1 GLSI — DGI/ESP/UCAD 2025/2026 |
| **Module** | Réseaux Télécoms et Services (RTS) |
| **Enseignant** | Dr. Magoné Fall |
| **Binôme** | Youssouph Gnaga Diatta & Souleymane KONÉ |
| **Date de remise** | Juillet 2026 |

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Processus de conception](#2-processus-de-conception)
3. [Architecture technique](#3-architecture-technique)
4. [Stack technologique et justification des choix](#4-stack-technologique-et-justification-des-choix)
5. [Structure du projet](#5-structure-du-projet)
6. [Formules télécom implémentées](#6-formules-télécom-implémentées)
7. [API REST — Contrat et endpoints](#7-api-rest--contrat-et-endpoints)
8. [Base de données](#8-base-de-données)
9. [Design système et interface utilisateur](#9-design-système-et-interface-utilisateur)
10. [Tests et résultats](#10-tests-et-résultats)
11. [Instructions de lancement](#11-instructions-de-lancement)
12. [Éléments techniques notables](#12-éléments-techniques-notables)
13. [Difficultés rencontrées et solutions](#13-difficultés-rencontrées-et-solutions)
14. [Conclusion et perspectives](#14-conclusion-et-perspectives)

---

## 1. Présentation du projet

### 1.1 Contexte

Dans le cadre du module **Réseaux Télécoms et Services (RTS)** de l'École Supérieure Polytechnique (ESP) de l'UCAD, il nous a été demandé de réaliser un projet de dimensionnement d'une liaison hertzienne point-à-point. Ce projet s'inscrit dans la formation DIC2 INFO / M1 GLSI et vise à mettre en pratique les connaissances théoriques acquises en télécommunications, couplées à des compétences en développement web full-stack.

### 1.2 Objectif

Développer une **application web complète** permettant de :

1. Saisir les paramètres d'une liaison hertzienne point-à-point (fréquence, distance, puissance d'émission, gains d'antennes, pertes câbles, sensibilité du récepteur)
2. Calculer automatiquement le **FSPL** (Free Space Path Loss) selon la formule de Friis
3. Calculer la **puissance reçue (Pr)** au niveau du récepteur
4. Calculer la **marge de liaison (M)** disponible
5. Classifier la liaison en trois catégories : **Stable / Limite / Instable**
6. Afficher les résultats avec un code couleur intuitif (vert/orange/rouge)
7. Visualiser graphiquement l'évolution de Pr en fonction de la distance et du FSPL en fonction de la fréquence
8. Exporter un **rapport PDF** complet de la simulation
9. Historiser les simulations en base de données

### 1.3 Solution développée : LinkBudget Pro

**LinkBudget Pro** est une application web complète (architecture 3-tiers) qui répond à l'ensemble des objectifs ci-dessus. Elle se compose de :

- Un **front-end React.js** avec une interface utilisateur sombre de type "console d'ingénierie radio", comprenant un formulaire de saisie, une page de résultats avec graphiques interactifs, et un export PDF côté client
- Un **back-end Django REST** exposant une API REST pour les calculs télécom et la persistance des simulations
- Une **base de données MySQL** pour l'historisation des simulations

---

## 2. Processus de conception

### 2.1 Phases du projet

Le projet a été décomposé en plusieurs phases, conformément à la méthodologie de développement en cascade adaptée :

#### Phase 1 : Préparation et cahier des charges
- Analyse du sujet et des besoins fonctionnels
- Identification des formules télécom à implémenter (FSPL, Pr, marge, classification)
- Définition des plages de validation des paramètres
- Rédaction du cahier des charges fonctionnel

#### Phase 2 : Conception
- Choix de la stack technologique (React + Django REST + MySQL)
- Conception de l'architecture 3-tiers
- Définition du design système (chart graphique, palette de couleurs, typographie)
- Conception de l'API REST (contrat d'endpoints)
- Modélisation de la base de données
- Création des maquettes UI/UX

#### Phase 3 : Développement du back-end (Django REST)
- Mise en place du projet Django et de l'application `liaison`
- Implémentation du moteur de calcul télécom (`services/link_budget.py`)
- Création du modèle de données `Simulation`
- Implémentation des sérialiseurs DRF avec validation des bornes
- Création des vues API (`POST /api/simulate/`, `GET /api/simulations/`, `GET /api/simulations/{id}/`)
- Écriture des tests unitaires (6 tests)

#### Phase 4 : Développement du front-end (React + Vite)
- Initialisation du projet Vite avec React
- Mise en place des design tokens (couleurs, polices, échelle typographique)
- Développement des composants :
  - `HomePage` avec animation du signal
  - `SimulationForm` avec validation temps réel et sélecteur d'unité MHz/GHz
  - `ResultsPage` avec `StatusBanner`, `SignalPath`, `ResultsTable`
  - `ChartPrVsDistance` et `ChartFsplVsFrequency` (Recharts)
  - `PdfExportButton` (jsPDF + html2canvas)
- Implémentation du hook `useSimulation` pour la gestion d'état
- Développement du validateur côté client (`utils/validators.js`)

#### Phase 5 : Tests et validation
- Tests unitaires backend (formules, classification, réponse API)
- Tests d'intégration manuels (flux complet saisie → calcul → affichage → export PDF)
- Tests de validation des bornes (côté client et serveur)
- Test responsive (mobile 375px et desktop 1280px+)

### 2.2 Diagramme de flux utilisateur

```
Accueil (HomePage)
    │
    ▼
[Démarrer une simulation]
    │
    ▼
Formulaire de saisie (SimulationForm)
    │
    ├─ Saisie des paramètres radio (fréquence, distance)
    ├─ Saisie des paramètres émetteur (Pt, Gt, pertes câbles TX)
    ├─ Saisie des paramètres récepteur (Sr, Gr, pertes câbles RX)
    └─ Paramètres avancés optionnels (hauteurs d'antennes)
    │
    ▼
[Calculer le bilan] → POST /api/simulate/
    │
    ▼
Page de résultats (ResultsPage)
    │
    ├─ StatusBanner (classification stable/limite/instable)
    ├─ SignalPath (représentation visuelle du trajet du signal)
    ├─ ResultsTable (paramètres saisis + résultats calculés)
    ├─ Graphiques Recharts (Pr vs distance, FSPL vs fréquence)
    └─ Export PDF (bouton de téléchargement)
    │
    ▼
[Nouvelle simulation] → retour au formulaire
```

---

## 3. Architecture technique

### 3.1 Architecture 3-tiers

L'application suit une architecture 3-tiers classique, garantissant une séparation claire des responsabilités :

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

### 3.2 Flux des données

1. L'utilisateur remplit le formulaire dans le navigateur (React)
2. Les données sont validées côté client en temps réel
3. Au clic sur "Calculer le bilan", une requête `POST` est envoyée à l'API Django
4. Django valide les données (DRF serializers), exécute les calculs télécom via le moteur `link_budget.py`, sauvegarde la simulation en base MySQL
5. La réponse JSON (résultats + données de graphiques) est renvoyée au front-end
6. React affiche les résultats (tableau, graphiques, bandeau de statut, signal path)
7. L'utilisateur peut exporter le rapport en PDF (génération 100% côté client)

### 3.3 Modules fonctionnels

Le logiciel est organisé en **4 modules fonctionnels indépendants et interopérables** :

| Module | Description | Technologies |
|---|---|---|
| **Module 1 — Saisie des paramètres** | Formulaire avec validation temps réel, sélecteur d'unité MHz/GHz | React, CSS |
| **Module 2 — Moteur de calcul télécom** | Calcul du FSPL, Pr, marge, classification | Python, NumPy |
| **Module 3 — Visualisation graphique** | Courbes interactives Pr(d) et FSPL(f) | Recharts |
| **Module 4 — Génération de rapport PDF** | Export complet du rapport dans le navigateur | jsPDF, html2canvas |

---

## 4. Stack technologique et justification des choix

### 4.1 Récapitulatif de la stack

| Couche | Technologie choisie | Alternatives envisagées | Justification |
|---|---|---|---|
| **Front-End** | React 19 + Vite 8 | Next.js, Vue.js | React offre un écosystème mature avec les Hooks pour la gestion d'état. Vite est plus rapide que Create-React-App. |
| **Style** | CSS custom (dark theme, design système propriétaire) | Tailwind CSS, Bootstrap | Un design sur mesure était nécessaire pour le thème sombre "console RF". Pas de dépendance lourde superflue. |
| **Graphiques** | Recharts | Chart.js, D3.js | Recharts s'intègre nativement avec React (composants déclaratifs), courbes interactives faciles à implémenter. |
| **Back-End** | Django 5 + Django REST Framework | Flask, FastAPI, Express | Django permet une intégration native de NumPy/SciPy pour les calculs scientifiques. DRF simplifie la création d'API REST. |
| **Calcul scientifique** | NumPy | — | Génération de séries de points pour les courbes (linspace), optionnel mais efficace. |
| **Base de données** | MySQL 8 | SQLite, PostgreSQL | Imposé par le cahier des charges. MySQL est largement déployé en production. |
| **Export PDF** | jsPDF + html2canvas (côté client) | Generation côté serveur (ReportLab, WeasyPrint) | Génération 100% côté client pour éviter la charge serveur et permettre l'utilisation hors-ligne. |
| **Versionnement** | Git / GitHub | — | Standard de l'industrie, branches `dev` et `main`. |

### 4.2 Pourquoi React plutôt que Next.js ?

Next.js aurait apporté le SSR (Server-Side Rendering) mais notre application est une SPA (Single Page Application) avec une API dédiée. React pur avec Vite est plus simple, plus rapide à développer et parfaitement adapté à notre cas d'usage (pas de SEO, pas de rendu côté serveur nécessaire).

### 4.3 Pourquoi Django REST plutôt que Flask ?

Le besoin d'intégrer NumPy pour les calculs scientifiques et la nécessité d'un ORM mature pour la persistence en MySQL ont orienté notre choix vers Django. DRF offre en outre une sérialisation robuste avec validation intégrée des champs.

### 4.4 Pourquoi l'export PDF côté client ?

Conformément au cahier des charges, l'export PDF est généré côté client via `html2canvas` (capture du DOM) et `jsPDF` (génération du PDF). Ce choix évite la charge serveur, permet une utilisation hors-ligne et donne un rendu fidèle à l'affichage navigateur.

---

## 5. Structure du projet

```
ProjetRTS/
├── backend/
│   ├── manage.py                  # Point d'entrée Django
│   ├── requirements.txt           # Dépendances Python
│   ├── .env                       # Variables d'environnement (credentials MySQL)
│   ├── .env.example               # Exemple de fichier .env
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py            # Configuration Django (DB, CORS, DRF, etc.)
│   │   ├── urls.py                # Routes racine
│   │   └── wsgi.py                # Point d'entrée WSGI
│   └── liaison/                   # Application Django principale
│       ├── __init__.py
│       ├── admin.py               # Interface d'administration
│       ├── models.py              # Modèle Simulation (ORM MySQL)
│       ├── serializers.py         # DRF serializers (validation)
│       ├── validators.py          # Bornes de validation des paramètres
│       ├── views.py               # Endpoints API (simulate, list, detail)
│       ├── urls.py                # Routes de l'API (/api/...)
│       ├── apps.py                # Configuration de l'application
│       ├── services/
│       │   ├── __init__.py
│       │   └── link_budget.py     # MOTEUR DE CALCUL TÉLÉCOM (logique pure)
│       ├── migrations/
│       │   └── 0001_initial.py    # Migration initiale
│       └── tests/
│           ├── __init__.py
│           └── test_link_budget.py # Tests unitaires (6 tests)
├── frontend/
│   ├── package.json               # Dépendances Node.js
│   ├── vite.config.js             # Configuration Vite
│   ├── index.html                 # HTML racine
│   └── src/
│       ├── main.jsx               # Point d'entrée React
│       ├── App.jsx                # Composant racine (routage)
│       ├── api/
│       │   └── liaisonApi.js      # Appels Axios vers l'API REST
│       ├── components/
│       │   ├── Header.jsx         # Navigation
│       │   ├── HomePage.jsx       # Page d'accueil avec animation
│       │   ├── SimulationForm.jsx # Formulaire de saisie
│       │   ├── ResultsPage.jsx    # Page de résultats
│       │   ├── StatusBanner.jsx   # Bandeau de statut coloré
│       │   ├── SignalPath.jsx     # Trajet du signal (élément signature)
│       │   ├── ResultsTable.jsx   # Tableau des résultats
│       │   ├── ChartPrVsDistance.jsx      # Courbe Pr vs distance
│       │   ├── ChartFsplVsFrequency.jsx   # Courbe FSPL vs fréquence
│       │   └── PdfExportButton.jsx        # Bouton d'export PDF
│       ├── hooks/
│       │   └── useSimulation.js   # Hook personnalisé (state management)
│       ├── utils/
│       │   └── validators.js      # Validation côté client
│       └── styles/
│           ├── tokens.css         # Design tokens (variables CSS)
│           └── global.css         # Styles globaux et composants
└── RAPPORT.md                     # Ce rapport
```

---

## 6. Formules télécom implémentées

### 6.1 Pertes en espace libre (FSPL — Formule de Friis)

La formule de Friis (également appelée formule de transmission de Friis) permet de calculer l'atténuation du signal électromagnétique dans l'espace libre entre l'émetteur et le récepteur.

```
FSPL(dB) = 20·log₁₀(d_km) + 20·log₁₀(f_MHz) + 32.45
```

- `d_km` : distance émetteur-récepteur en kilomètres
- `f_MHz` : fréquence porteuse en MHz
- `32.45` : constante pour la convention km/MHz

> **Note importante** : Il existe plusieurs conventions pour le calcul du FSPL. La constante `32.45` est valable pour une distance en km et une fréquence en MHz. Nous avons strictement respecté cette convention (et non `92.45` pour km/GHz ou `-27.55` pour m/MHz) car c'est la plus courante dans les télécommunications terrestres.

**Implémentation** (`backend/liaison/services/link_budget.py:10-14`) :
```python
def compute_fspl_db(distance_km: float, frequency_mhz: float) -> float:
    if distance_km <= 0 or frequency_mhz <= 0:
        raise ValueError("La distance et la fréquence doivent être strictement positives.")
    return 20 * math.log10(distance_km) + 20 * math.log10(frequency_mhz) + 32.45
```

### 6.2 Puissance reçue (Pr)

La puissance reçue au niveau du récepteur est calculée en prenant en compte la puissance émise, les gains des antennes et les pertes (espace libre et câbles).

```
Pr(dBm) = Pt(dBm) + Gt(dBi) + Gr(dBi) - FSPL(dB) - Lc_tx(dB) - Lc_rx(dB)
```

- `Pt` : puissance d'émission en dBm
- `Gt`, `Gr` : gains des antennes d'émission et de réception en dBi
- `Lc_tx`, `Lc_rx` : pertes dans les câbles et connecteurs côté émission et réception en dB
- `FSPL` : pertes en espace libre calculées en 6.1

**Implémentation** (`link_budget.py:16-20`) :
```python
def compute_received_power_dbm(
    pt_dbm, gt_dbi, gr_dbi, fspl_db, lc_tx_db, lc_rx_db
) -> float:
    return pt_dbm + gt_dbi + gr_dbi - fspl_db - lc_tx_db - lc_rx_db
```

### 6.3 Marge de liaison (M)

La marge de liaison représente la différence entre la puissance reçue et la sensibilité du récepteur. Elle indique la "réserve" de puissance disponible.

```
M(dB) = Pr(dBm) - Sr(dBm)
```

- `Sr` : sensibilité du récepteur en dBm (généralement négative, par exemple -85 dBm)

**Implémentation** (`link_budget.py:22-24`) :
```python
def compute_link_margin_db(pr_dbm: float, sensitivity_dbm: float) -> float:
    return pr_dbm - sensitivity_dbm
```

### 6.4 Classification automatique de la liaison

| Marge M | Classification | Couleur | Interprétation |
|---|---|---|---|
| M ≥ 15 dB | **Liaison stable** | 🟢 Vert | Liaison fiable, marge suffisante |
| 5 dB ≤ M < 15 dB | **Liaison limite** | 🟠 Orange | Liaison fonctionnelle mais sensible aux perturbations |
| M < 5 dB | **Liaison instable** | 🔴 Rouge | Liaison non fiable, risque de déconnexion |

Les seuils sont définis comme constantes en haut du fichier `link_budget.py` pour une modification facile :
```python
LINK_MARGIN_STABLE_THRESHOLD_DB = 15
LINK_MARGIN_LIMIT_THRESHOLD_DB = 5
```

**Implémentation** (`link_budget.py:26-34`) :
```python
def classify_link(margin_db: float) -> dict:
    if margin_db >= LINK_MARGIN_STABLE_THRESHOLD_DB:
        return {"status": "stable", "label": "Liaison stable", "color": "green"}
    elif margin_db >= LINK_MARGIN_LIMIT_THRESHOLD_DB:
        return {"status": "limite", "label": "Liaison limite", "color": "orange"}
    else:
        return {"status": "instable", "label": "Liaison instable", "color": "red"}
```

### 6.5 Fonction d'orchestration globale

La fonction `run_link_budget` orchestre l'ensemble des calculs à partir d'un dictionnaire de paramètres et retourne un dictionnaire prêt à être sérialisé en JSON.

```python
def run_link_budget(params: dict) -> dict:
    fspl_db = compute_fspl_db(params["distance_km"], params["frequency_mhz"])
    pr_dbm = compute_received_power_dbm(
        params["tx_power_dbm"], params["tx_antenna_gain_dbi"],
        params["rx_antenna_gain_dbi"],
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
```

### 6.6 Données pour les graphiques (séries de points)

L'API génère des séries de points pour deux graphiques :

**Pr en fonction de la distance** : 30 points, distance variant de 0.5 km à 2× la distance saisie (minimum 5 km).

**FSPL en fonction de la fréquence** : 30 points, fréquence variant de 50 MHz à 3× la fréquence saisie (minimum 1000 MHz).

Ces séries utilisent `numpy.linspace` pour générer les points de manière uniforme, puis appellent les fonctions de calcul pour chaque point.

---

## 7. API REST — Contrat et endpoints

### 7.1 Endpoints disponibles

| Méthode | URL | Description | Code retour |
|---|---|---|---|
| `POST` | `/api/simulate/` | Calculer un bilan de liaison | 201 Created |
| `GET` | `/api/simulations/` | Historique des simulations (pagíné) | 200 OK |
| `GET` | `/api/simulations/{id}/` | Détail d'une simulation spécifique | 200 OK |

### 7.2 Endpoint `POST /api/simulate/`

**Requête (JSON)** — Tous les champs sont obligatoires sauf `height_tx_m` et `height_rx_m` :

```json
{
  "frequency_mhz": 2400,
  "distance_km": 15,
  "tx_power_dbm": 20,
  "tx_antenna_gain_dbi": 18,
  "rx_antenna_gain_dbi": 18,
  "tx_cable_loss_db": 2,
  "rx_cable_loss_db": 2,
  "rx_sensitivity_dbm": -85
}
```

**Réponse (201 Created)** :

```json
{
  "id": 1,
  "input": {
    "frequency_mhz": 2400,
    "distance_km": 15,
    "tx_power_dbm": 20,
    "tx_antenna_gain_dbi": 18,
    "rx_antenna_gain_dbi": 18,
    "tx_cable_loss_db": 2,
    "rx_cable_loss_db": 2,
    "rx_sensitivity_dbm": -85
  },
  "results": {
    "fspl_db": 123.45,
    "received_power_dbm": -60.5,
    "link_margin_db": 24.5,
    "classification": {
      "status": "stable",
      "label": "Liaison stable",
      "color": "green"
    },
    "interpretation": "Liaison stable — Marge de 24.5 dB"
  },
  "charts": {
    "pr_vs_distance": [
      { "distance_km": 0.5, "received_power_dbm": -30.1 },
      "... (30 points)"
    ],
    "fspl_vs_frequency": [
      { "frequency_mhz": 50, "fspl_db": 78.2 },
      "... (30 points)"
    ]
  },
  "created_at": "2026-06-27T10:00:00Z"
}
```

### 7.3 Validation des paramètres (double couche)

Les paramètres sont validés **à la fois côté client (React) et côté serveur (Django)** pour garantir l'intégrité des données :

| Paramètre | Min | Max | Unité |
|---|---|---|---|
| Fréquence | 1 | 100 000 | MHz |
| Distance | 0.01 | 1000 | km |
| Puissance d'émission | -50 | 60 | dBm |
| Gain antenne TX/RX | 0 | 60 | dBi |
| Pertes câbles TX/RX | 0 | 20 | dB |
| Sensibilité récepteur | -150 | -20 | dBm |
| Hauteur antennes (optionnel) | 1 | 200 | m |

- **Côté serveur** : utilisation des `FloatField` de DRF avec les paramètres `min_value` et `max_value`
- **Côté client** : validation en temps réel via `onChange` avec affichage des messages d'erreur sous chaque champ et désactivation du bouton "Calculer" si le formulaire est invalide

---

## 8. Base de données

### 8.1 Modèle `Simulation`

Le modèle `Simulation` stocke l'ensemble des paramètres saisis et des résultats calculés pour chaque simulation. Il est défini dans `backend/liaison/models.py` :

| Champ | Type | Contrainte | Description |
|---|---|---|---|
| `frequency_mhz` | FloatField | Obligatoire | Fréquence porteuse en MHz |
| `distance_km` | FloatField | Obligatoire | Distance émetteur-récepteur en km |
| `tx_power_dbm` | FloatField | Obligatoire | Puissance d'émission en dBm |
| `tx_antenna_gain_dbi` | FloatField | Obligatoire | Gain antenne TX en dBi |
| `rx_antenna_gain_dbi` | FloatField | Obligatoire | Gain antenne RX en dBi |
| `tx_cable_loss_db` | FloatField | Obligatoire | Pertes câbles TX en dB |
| `rx_cable_loss_db` | FloatField | Obligatoire | Pertes câbles RX en dB |
| `rx_sensitivity_dbm` | FloatField | Obligatoire | Sensibilité RX en dBm |
| `height_tx_m` | FloatField | Nullable | Hauteur antenne TX (optionnel) |
| `height_rx_m` | FloatField | Nullable | Hauteur antenne RX (optionnel) |
| `fspl_db` | FloatField | Calculé | Résultat FSPL en dB |
| `received_power_dbm` | FloatField | Calculé | Résultat Pr en dBm |
| `link_margin_db` | FloatField | Calculé | Résultat marge en dB |
| `classification_status` | CharField(20) | Calculé | Statut (stable/limite/instable) |
| `created_at` | DateTimeField | Auto | Date et heure de création |

Le modèle est ordonné par date décroissante (`Meta.ordering = ["-created_at"]`).

### 8.2 Configuration MySQL

La base de données est configurée via Django settings avec des variables d'environnement (via `django-environ`) pour ne pas exposer les credentials dans le code :

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
        "PORT": env("DB_PORT"),
        "OPTIONS": {"charset": "utf8mb4"},
    }
}
```

Les credentials réels sont stockés dans un fichier `.env` (non versionné, listé dans `.gitignore`). Un fichier `.env.example` est fourni en modèle.

---

## 9. Design système et interface utilisateur

### 9.1 Concept directeur

L'interface utilisateur de **LinkBudget Pro** a été pensée comme une **console d'ingénierie radio** plutôt que comme un dashboard web générique. Le choix délibéré d'un fond sombre (#0B0E14) évoque un écran de spectre analyseur ou d'oscilloscope, renforçant l'immersion dans le domaine des télécommunications.

### 9.2 Palette de couleurs

```css
:root {
  --bg-primary: #0B0E14;       /* Fond principal, presque noir bleuté */
  --bg-surface: #11151F;       /* Cards, panneaux de formulaire */
  --bg-surface-raised: #161B28;/* Éléments surélevés (inputs focus, hover) */
  --border-subtle: #232A3A;    /* Séparateurs, bordures fines */
  --text-primary: #E8EBF2;     /* Texte principal */
  --text-muted: #7C879E;       /* Labels, unités, texte secondaire */
  --accent-signal: #00D9A3;    /* Vert-cyan "signal actif" — liaison stable */
  --accent-warning: #FFB347;   /* Orange — liaison limite */
  --accent-critical: #FF5C72;  /* Rouge — liaison instable */
  --accent-data: #5B8DEF;      /* Bleu — courbes graphiques, valeurs calculées */
}
```

### 9.3 Typographie

| Usage | Police | Justification |
|---|---|---|
| **Titres / display** | Space Grotesk (Google Fonts) | Géométrique, légèrement technique, bon pour les grands chiffres |
| **Corps de texte / labels** | Inter (Google Fonts) | Lisible, neutre, pour les formulaires |
| **Valeurs numériques / unités** | JetBrains Mono (Google Fonts) | Police monospace pour évoquer un instrument de mesure |

### 9.4 Composants UI

#### Page d'accueil (`HomePage.jsx`)
- Animation d'un point qui voyage le long d'une ligne (signal RF se propageant)
- Titre "LinkBudget Pro" avec accent vert-cyan sur "Link"
- Description courte de l'outil
- Bouton CTA "Démarrer une simulation"
- 4 cartes de fonctionnalités clés

#### Formulaire de simulation (`SimulationForm.jsx`)
- 3 sections thématiques organisées en cartes :
  - **Paramètres radio** : fréquence (avec sélecteur MHz/GHz), distance
  - **Émetteur** : Pt, Gt, pertes câbles TX
  - **Récepteur** : Sr, Gr, pertes câbles RX
- Section "Paramètres avancés" (hauteurs d'antennes) repliable via `<details>`
- Validation en temps réel avec messages d'erreur en rouge
- Boutons "Calculer le bilan" (vert) et "Réinitialiser" (outline)

#### Page de résultats (`ResultsPage.jsx`)
- **StatusBanner** : bandeau avec bordure gauche colorée (vert/orange/rouge) affichant l'interprétation
- **SignalPath** : représentation visuelle horizontale du trajet du signal (Pt → FSPL → Pr → Marge → Sr), élément signature du design
- **ResultsTable** : tableau à deux colonnes (paramètres saisis / résultats calculés), valeurs en police monospace
- **Graphiques Recharts** : deux graphiques interactifs avec point marqué correspondant à la simulation actuelle
- **Export PDF** : bouton générant le rapport via html2canvas + jsPDF

### 9.5 Responsive design

- **Mobile (< 640px)** : marges réduites, cartes empilées, grille du formulaire en une colonne, signal path adapté
- **Desktop (≥ 1024px)** : formulaire en grille 2 colonnes par section, graphiques côte à côte
- Respect de `prefers-reduced-motion` pour les animations

---

## 10. Tests et résultats

### 10.1 Tests unitaires backend

6 tests unitaires ont été implémentés dans `backend/liaison/tests/test_link_budget.py` couvrant :

| N° | Test | Description | Résultat |
|---|---|---|---|
| 1 | `test_fspl_formula` | Vérifie le calcul FSPL avec d=10 km, f=1000 MHz → 112.45 dB | ✅ Passé |
| 2 | `test_received_power` | Vérifie Pr avec Pt=20, Gt=18, Gr=18, FSPL=112.45, pertes=2 → -60.45 dBm | ✅ Passé |
| 3 | `test_link_margin` | Vérifie Marge avec Pr=-60.45, Sr=-85 → 24.55 dB | ✅ Passé |
| 4 | `test_classify_stable` | Marge=15 dB → status="stable", color="green" | ✅ Passé |
| 5 | `test_classify_limite` | Marge=10 dB → status="limite", color="orange" | ✅ Passé |
| 6 | `test_classify_instable` | Marge=4 dB → status="instable", color="red" | ✅ Passé |
| 7 | `test_run_link_budget_returns_expected_keys` | Vérifie que la fonction d'orchestration retourne toutes les clés attendues | ✅ Passé |

**Exécution des tests** :
```bash
$ python manage.py test liaison
Found 7 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
.......
----------------------------------------------------------------------
Ran 7 tests in 0.015s
OK
```

### 10.2 Validation des formules (calculs manuels)

**Cas de test :**
- Distance : 10 km
- Fréquence : 1000 MHz
- Pt : 20 dBm
- Gt : 18 dBi
- Gr : 18 dBi
- Pertes câbles TX : 2 dB
- Pertes câbles RX : 2 dB
- Sr : -85 dBm

**Calcul manuel :**
1. FSPL = 20·log10(10) + 20·log10(1000) + 32.45 = 20 + 60 + 32.45 = **112.45 dB**
2. Pr = 20 + 18 + 18 - 112.45 - 2 - 2 = **-60.45 dBm**
3. Marge = -60.45 - (-85) = **24.55 dB** → **Liaison stable** (M ≥ 15 dB)

**Résultat obtenu par l'application :** ✅ Conforme

### 10.3 Tests d'intégration manuels

Le flux complet a été testé manuellement :

1. **Navigation** : Accueil → Formulaire → Résultats → Nouvelle simulation ✅
2. **Validation client** : saisie de valeurs hors bornes → message d'erreur affiché ✅
3. **Validation serveur** : envoi de données invalides → 400 Bad Request ✅
4. **Calcul** : soumission du formulaire → résultats corrects affichés ✅
5. **Graphiques** : courbes générées avec point marqué pour la simulation ✅
6. **Signal Path** : animation au chargement, couleurs adaptées au statut ✅
7. **Export PDF** : téléchargement du rapport avec tableau + graphiques ✅
8. **Conversion d'unité** : saisie en GHz → conversion automatique en MHz ✅
9. **Responsive** : affichage correct sur mobile (375px) et desktop (1280px) ✅
10. **Historique** : vérification en base que la simulation est bien sauvegardée ✅

### 10.4 Tests de vérification supplémentaires

Pour s'assurer du bon fonctionnement de l'outil dans différents scénarios, nous avons testé plusieurs configurations :

| Scénario | Distance | Fréquence | Pt | Résultat attendu | Résultat obtenu |
|---|---|---|---|---|---|
| Liaison courte portée | 1 km | 2400 MHz | 10 dBm | Stable | ✅ Stable (Marge > 15 dB) |
| Liaison longue portée | 50 km | 5800 MHz | 20 dBm | Limite/Instable | ✅ Limite (Marge ≈ 8 dB) |
| Liaison avec forte atténuation | 100 km | 10000 MHz | 5 dBm | Instable | ✅ Instable (Marge < 5 dB) |
| Fréquence maximale | 10 km | 100000 MHz | 30 dBm | Variable | ✅ Calcul correct |

---

## 11. Instructions de lancement

### 11.1 Prérequis

- **Node.js** 18+ (recommandé : 20 LTS)
- **Python** 3.10+ (recommandé : 3.12)
- **MySQL** 8+ (ou compatibilité)
- **npm** ou **yarn**

### 11.2 Backend (Django REST)

```bash
cd backend

# Créer et activer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer la base de données MySQL
# 1. Créer une base nommée "bilan_liaison_db" (ou autre nom selon .env)
# 2. Copier .env.example vers .env et éditer les identifiants

# Exécuter les migrations
python manage.py migrate

# Lancer les tests (optionnel)
python manage.py test liaison

# Lancer le serveur de développement
python manage.py runserver
```

Le backend est accessible sur `http://localhost:8000`.

### 11.3 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Le frontend est accessible sur `http://localhost:5173`.

### 11.4 Variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` en suivant le modèle `.env.example` :

```env
SECRET_KEY=django-insecure-key-change-in-production
DEBUG=True
DB_NAME=bilan_liaison_db
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_HOST=127.0.0.1
DB_PORT=3306
```

---

## 12. Éléments techniques notables

### 12.1 Validation double couche

La validation des paramètres est implémentée à deux niveaux :

- **Côté client (React)** : validation en temps réel via `utils/validators.js` avec affichage instantané des erreurs. Le bouton "Calculer" est implicitement désactivé par le biais des erreurs (si des erreurs persistent, la fonction `submit` retourne null avant l'appel API).
- **Côté serveur (Django)** : validation via DRF serializers avec `min_value` et `max_value` sur chaque champ. En cas de dépassement, retour d'une erreur 400 Bad Request avec un message clair en français.

### 12.2 Conversion d'unité fréquence

Le formulaire propose un sélecteur d'unité **MHz/GHz** pour le champ fréquence. La conversion est effectuée côté client avant l'envoi à l'API :

```javascript
if (freqUnit === "GHz" && payload.frequency_mhz != null) {
    payload.frequency_mhz = payload.frequency_mhz * 1000;
}
```

### 12.3 Génération de courbes côté serveur

L'API génère des séries de 30 points pour les graphiques en faisant varier la distance et la fréquence sur des plages pertinentes, via `numpy.linspace`. Cette approche évite au front-end d'avoir à implémenter une logique de calcul complexe.

### 12.4 Export PDF 100% client

Le rapport PDF est généré entièrement dans le navigateur via :
1. **html2canvas** : capture du conteneur de résultats (tableau + graphiques + interprétation) en image bitmap
2. **jsPDF** : génération du PDF A4 avec en-tête "LinkBudget Pro - Rapport de simulation" et intégration de l'image

Ce choix évite toute charge sur le serveur et permet une utilisation hors-ligne.

### 12.5 Design tokens centralisés

Toutes les variables de design (couleurs, polices, espacements, rayons de bordure) sont centralisées dans le fichier `tokens.css` sous forme de variables CSS personnalisées. Cette approche garantit la cohérence visuelle et facilite la maintenance.

### 12.6 Élément signature : SignalPath

Le composant `SignalPath` est l'élément signature de l'interface. Il représente visuellement le trajet du signal de l'émetteur au récepteur :

```
[Pt] ──── Gt ──── ░░░░░ FSPL ░░░░░ ──── Gr ──── [Pr] ╌╌╌╌ marge ╌╌╌╌ [Sr]
```

- Chaque nœud est représenté par un cercle avec son label
- Les nœuds "actifs" (Pt, Pr, Marge) sont colorés selon le statut de la liaison
- Les nœuds "passifs" (FSPL, Sr) sont en grisé
- Une ligne horizontale se dessine progressivement au chargement (animation CSS 600ms)

### 12.7 Accessibilité

Les animations respectent la préférence système `prefers-reduced-motion: reduce` :

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .home-signal-dot {
    animation: none;
    left: calc(100% - 38px);
    opacity: 0.5;
  }
}
```

---

## 13. Difficultés rencontrées et solutions

### 13.1 Choix de la constante FSPL

**Problème** : Plusieurs conventions existent pour la formule de Friis (32.45 pour km/MHz, 92.45 pour km/GHz, -27.55 pour m/MHz). Une erreur sur la constante conduit à des résultats totalement aberrants.

**Solution** : Nous avons explicitement documenté la convention choisie dans le code et utilisé une constante unique (32.45) avec conversion automatique des GHz en MHz côté client. Des tests unitaires vérifient la formule avec un cas concret.

### 13.2 CORS et communication front-back

**Problème** : Le navigateur bloque les requêtes cross-origin entre le front-end (localhost:5173) et le back-end (localhost:8000).

**Solution** : Configuration de `django-cors-headers` avec la liste blanche des origines autorisées :
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### 13.3 Gestion des erreurs API

**Problème** : Les messages d'erreur retournés par DRF peuvent avoir des structures différentes selon le type d'erreur (champ invalide, erreur globale, etc.).

**Solution** : Implémentation d'une logique de parsing des erreurs dans le hook `useSimulation` :
```javascript
const msg =
    err.response?.data?.detail ||
    err.response?.data?.[Object.keys(err.response?.data || {})[0]]?.[0] ||
    "Erreur de connexion au serveur.";
```

### 13.4 Export PDF avec fond sombre

**Problème** : `html2canvas` génère parfois un fond blanc au lieu du fond sombre de l'interface.

**Solution** : Spécification explicite de la couleur de fond dans les options `html2canvas` :
```javascript
const canvas = await html2canvas(element, {
    backgroundColor: "#0B0E14",
    scale: 2,
});
```

### 13.5 Responsive du SignalPath

**Problème** : Sur mobile, les 5 nœuds du SignalPath dépassaient de la largeur de l'écran.

**Solution** : Application d'un `flex-wrap: wrap` avec `justify-content: center` sur la barre de navigation du SignalPath pour mobile.

---

## 14. Conclusion et perspectives

### 14.1 Bilan du projet

Le projet **LinkBudget Pro** est une application web complète et fonctionnelle qui répond à l'ensemble des objectifs fixés dans le cahier des charges :

- ✅ Calcul précis du FSPL, de la puissance reçue et de la marge de liaison
- ✅ Classification automatique avec code couleur
- ✅ Interface utilisateur intuitive et professionnelle (dark theme)
- ✅ Visualisation graphique interactive
- ✅ Export PDF complet
- ✅ Historisation des simulations en base de données
- ✅ Validation double couche (client + serveur)
- ✅ Responsive design (mobile et desktop)
- ✅ Tests unitaires et d'intégration

### 14.2 Compétences mises en œuvre

Ce projet nous a permis de mettre en pratique et de consolider des compétences dans les domaines suivants :

- **Télécommunications** : bilan de liaison hertzienne, formule de Friis, calcul de marge
- **Développement web full-stack** : React.js, Django REST Framework, API REST
- **Base de données** : modélisation ORM avec Django, MySQL
- **Design UI/UX** : design système, thème sombre, responsive design
- **Tests** : tests unitaires Django, tests d'intégration manuels
- **Versionnement** : Git, commits atomiques

### 14.3 Perspectives d'amélioration

Plusieurs fonctionnalités pourraient enrichir l'application dans une version future :

1. **Carte interactive** : intégration d'une carte (Leaflet/OpenStreetMap) pour sélectionner les coordonnées GPS des antennes et calculer automatiquement la distance
2. **Diagramme de Fresnel** : visualisation des zones de Fresnel pour vérifier les dégagements
3. **Export multi-format** : ajout d'export CSV et Excel en plus du PDF
4. **Comparaison de scénarios** : fonctionnalité permettant de comparer plusieurs simulations côte à côte
5. **Authentification** : gestion des utilisateurs avec comptes personnels et historique privé
6. **Mode dégradé** : fonctionnement sans base de données (SQLite ou localStorage) pour les démonstrations
7. **Thème clair** : option de bascule entre thème sombre et thème clair

### 14.4 Remerciements

Nous tenons à remercier le **Dr. Magoné Fall**, enseignant du module Réseaux Télécoms et Services, pour la qualité de l'enseignement dispensé et pour avoir proposé ce projet passionnant qui nous a permis de lier théorie télécom et pratique du développement logiciel.

---

*Rapport rédigé par Youssouph Gnaga Diatta & Souleymane KONÉ — DIC2 INFO / M1 GLSI — ESP/UCAD — Juillet 2026*
