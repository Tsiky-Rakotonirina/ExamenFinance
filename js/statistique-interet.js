document.addEventListener('DOMContentLoaded', () => {
    const btnFiltrer = document.querySelector('#btn-filtrer-statistiques');
    const moisMinSelect = document.querySelector('#mois_min');
    const anneeMinInput = document.querySelector('#annee_min');
    const moisMaxSelect = document.querySelector('#mois_max');
    const anneeMaxInput = document.querySelector('#annee_max');
    const ctx = document.getElementById('interetsChart').getContext('2d');
    let interetsChart = null;

    // Vérifier que tous les éléments existent
    if (!moisMinSelect || !anneeMinInput || !moisMaxSelect || !anneeMaxInput || !ctx) {
        console.error('Erreur : un ou plusieurs éléments (formulaire ou canvas) ne sont pas trouvés dans le DOM.');
        return;
    }

    // Fonction pour charger les années disponibles
    function chargerAnneesDisponibles() {
        // Définir 2020 comme valeur par défaut pour les années, et 1 et 12 pour les mois
        const anneeDefaut = 2020;
        anneeMinInput.value = anneeDefaut;
        anneeMaxInput.value = anneeDefaut;
        moisMinSelect.value = '1'; // Janvier
        moisMaxSelect.value = '12'; // Décembre

        // Déclencher automatiquement la requête /interets-par-mois
        const moisMin = moisMinSelect.value.trim();
        const anneeMin = anneeMinInput.value.trim();
        const moisMax = moisMaxSelect.value.trim();
        const anneeMax = anneeMaxInput.value.trim();

        const data = `mois_min=${encodeURIComponent(moisMin)}&annee_min=${encodeURIComponent(anneeMin)}&mois_max=${encodeURIComponent(moisMax)}&annee_max=${encodeURIComponent(anneeMax)}`;
        
        ajax('GET', '/interets-par-mois?' + data, data, (json) => {
            console.log('Réponse API /interets-par-mois :', json);
            if (json.succes && json.data) {
                updateChart(json.data);
            } else {
                alert(json.message || 'Erreur lors du chargement des statistiques.');
                updateChart(Array(12).fill(0));
            }
        });
    }

    // Fonction pour mettre à jour le tableau
    function updateTable(data) {
        const moisLabels = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        const interets = Object.values(data).map(val => parseFloat(val) || 0);
        const tableBody = document.querySelector('#interetsTableBody');

        // Vider le tableau
        tableBody.innerHTML = '';

        // Remplir le tableau
        interets.forEach((interet, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding: 0.7rem; border: 1px solid var(--border-color);">${moisLabels[index]}</td>
                <td style="padding: 0.7rem; border: 1px solid var(--border-color); text-align: right;">${interet.toFixed(2)} €</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fonction pour mettre à jour le graphique
    function updateChart(data) {
        const moisLabels = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        const interets = Object.values(data).map(val => parseFloat(val) || 0);

        // Mettre à jour le tableau
        updateTable(data);

        // Détruire le graphique existant s'il existe
        if (interetsChart) {
            interetsChart.destroy();
        }

        const chartConfig = {
            type: 'bar',
            data: {
                labels: moisLabels,
                datasets: [{
                    label: 'Intérêts mensuels (€)',
                    data: interets,
                    backgroundColor: 'rgba(125, 132, 113, 0.6)',
                    borderColor: 'rgba(125, 132, 113, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Montant (€)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Mois'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Statistiques des intérêts par mois'
                    }
                }
            }
        };

        interetsChart = new Chart(ctx, chartConfig);
    }

    // Événement pour le bouton Filtrer
    btnFiltrer.addEventListener('click', () => {
        const moisMin = moisMinSelect.value.trim();
        const anneeMin = anneeMinInput.value.trim();
        const moisMax = moisMaxSelect.value.trim();
        const anneeMax = anneeMaxInput.value.trim();

        if (!moisMin || !anneeMin || !moisMax || !anneeMax) {
            alert('Veuillez sélectionner un mois et une année pour la date de début et de fin.');
            return;
        }

        // Vérifier que la date de fin est postérieure ou égale à la date de début
        const dateDebut = new Date(anneeMin, moisMin - 1);
        const dateFin = new Date(anneeMax, moisMax - 1);
        if (dateFin < dateDebut) {
            alert('La date de fin doit être postérieure ou égale à la date de début.');
            return;
        }

        const data = `mois_min=${encodeURIComponent(moisMin)}&annee_min=${encodeURIComponent(anneeMin)}&mois_max=${encodeURIComponent(moisMax)}&annee_max=${encodeURIComponent(anneeMax)}`;
        
        ajax('GET', '/interets-par-mois?' + data, data, (json) => {
            console.log('Réponse API /interets-par-mois :', json);
            if (json.succes && json.data) {
                updateChart(json.data);
            } else {
                alert(json.message || 'Erreur lors du chargement des statistiques.');
                updateChart(Array(12).fill(0));
            }
        });
    });

    // Charger les années au démarrage
    chargerAnneesDisponibles();
});