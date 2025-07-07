-- status_type_pret
INSERT INTO status_type_pret (nom) VALUES
('Actif'), ('Inactif');

-- type_pret
INSERT INTO type_pret (nom, date_type_pret, status_type_pret_id, mois_max, montant_max, taux_annuel, echeance_initiale)
VALUES
('Prêt Personnel', '2024-07-01', 1, 24, 10000.00, 5.50, 1),
('Prêt Immobilier', '2024-07-01', 1, 120, 200000.00, 3.20, 1);

-- client
INSERT INTO client (nom, email, mot_de_passe, date_ajout)
VALUES
('Alice Dupont', 'alice@example.com', 'motdepasse1', '2024-07-01'),
('Bob Martin', 'bob@example.com', 'motdepasse2', '2024-07-01');

-- status_compte
INSERT INTO status_compte (nom) VALUES
('Actif'), ('Fermé');

-- compte
INSERT INTO compte (client_id, status_compte_id, solde)
VALUES
(1, 1, 5000.00),
(2, 1, 15000.00);

-- pret
INSERT INTO pret (date_pret, type_pret_id, compte_id, montant, duree)
VALUES
('2024-07-01', 1, 1, 5000.00, 12),
('2024-07-01', 2, 2, 100000.00, 60);

-- periode
INSERT INTO periode (nom, nombre_mois, libelle)
VALUES
('Mensuel', 1, 1),
('Trimestriel', 3, 2);

-- remboursement
INSERT INTO remboursement
(pret_id, numero_periode, periode_id, base, interet, amortissement, a_payer, date_remboursement, date_echeance)
VALUES
(1, 1, 1, 5000.00, 22.92, 427.08, 450.00, '2024-08-01', '2024-08-01'),
(1, 2, 1, 4572.92, 20.72, 429.28, 450.00, NULL, '2024-09-01'),
(2, 1, 1, 100000.00, 266.67, 1400.00, 1666.67, '2024-08-01', '2024-08-01');

-- historique_type_pret
INSERT INTO historique_type_pret
(type_pret_id, date_type_pret, status_type_pret, mois_max, montant_max, taux_annuel, echeance_initiale)
VALUES
(1, '2024-07-01', 1, 24, 10000.00, 5.50, 1),
(2, '2024-07-01', 1, 120, 200000.00, 3.20, 1);

-- fond
INSERT INTO fond (date_fond, montant)
VALUES
('2024-07-01', 1000000.00),
('2024-08-01', 500000.00);