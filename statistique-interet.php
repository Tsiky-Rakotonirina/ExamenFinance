<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Statistiques des Intérêts</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <link rel="stylesheet" href="css/statistique-interet.css">
</head>

<body>
    <div class="container">
        <h1>Statistiques des Intérêts</h1>

        <div class="content-wrapper">
            <div class="filters-section">
                <h2>Filtres de Période</h2>

                <div class="filter-group">
                    <h3 style="color: var(--primary-color); font-size: 1rem; margin-bottom: 1rem;">Période de début</h3>
                    <div class="filter-row">
                        <div class="filter-item">
                            <label for="mois_min">Mois</label>
                            <select id="mois_min">
                                <option value="1">Janvier</option>
                                <option value="2">Février</option>
                                <option value="3">Mars</option>
                                <option value="4">Avril</option>
                                <option value="5">Mai</option>
                                <option value="6">Juin</option>
                                <option value="7">Juillet</option>
                                <option value="8">Août</option>
                                <option value="9">Septembre</option>
                                <option value="10">Octobre</option>
                                <option value="11">Novembre</option>
                                <option value="12">Décembre</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label for="annee_min">Année</label>
                            <input type="number" id="annee_min" placeholder="2020">
                        </div>
                    </div>
                </div>

                <div class="filter-group">
                    <h3 style="color: var(--primary-color); font-size: 1rem; margin-bottom: 1rem;">Période de fin</h3>
                    <div class="filter-row">
                        <div class="filter-item">
                            <label for="mois_max">Mois</label>
                            <select id="mois_max">
                                <option value="1">Janvier</option>
                                <option value="2">Février</option>
                                <option value="3">Mars</option>
                                <option value="4">Avril</option>
                                <option value="5">Mai</option>
                                <option value="6">Juin</option>
                                <option value="7">Juillet</option>
                                <option value="8">Août</option>
                                <option value="9">Septembre</option>
                                <option value="10">Octobre</option>
                                <option value="11">Novembre</option>
                                <option value="12">Décembre</option>
                            </select>
                        </div>
                        <div class="filter-item">
                            <label for="annee_max">Année</label>
                            <input type="number" id="annee_max" placeholder="2020">
                        </div>
                    </div>
                </div>

                <button id="btn-filtrer-statistiques">Filtrer les Statistiques</button>
            </div>

            <div class="chart-section">
                <h2>Graphique des Intérêts</h2>
                <div class="chart-container">
                    <canvas id="interetsChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    <script src="js/statistique-interet.js"></script>
</body>

</html>