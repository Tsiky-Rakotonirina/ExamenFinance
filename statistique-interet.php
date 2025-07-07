<?php

?>

<body>
    <link rel="stylesheet" href="css/index.css">
    <div>
        <h3>Statistiques des Intérêts par Mois</h3>
        <form id="filtrer-statistiques">
            <label>Mois Année de début :
                <select id="mois_min" required>
                    <option value="">-- Mois --</option>
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
                <input type="number" id="annee_min" placeholder="Année" required>
            </label>
            <label>Date de fin :
                <select id="mois_max" required>
                    <option value="">-- Mois --</option>
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
                <input type="number" id="annee_max" placeholder="Année" required>
            </label>
            <button id="btn-filtrer-statistiques" type="button">Afficher</button>
        </form>
    </div>
    <br>
    <div>
        <canvas id="interetsChart" width="2000" height="300"></canvas>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/statistique-interet.js"></script>
</body>

</html>