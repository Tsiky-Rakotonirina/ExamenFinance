-- Vue pour les types de prêt actifs
CREATE OR REPLACE VIEW vue_type_pret_actif AS
SELECT * FROM type_pret WHERE status_type_pret_id = 1;

-- Vue pour les comptes avec infos client et status (seulement comptes actifs, sans solde)
CREATE OR REPLACE VIEW vue_compte_detail AS
SELECT c.id_compte, c.client_id, c.status_compte_id, cl.nom as client_nom, sc.nom as status_nom
FROM compte c
LEFT JOIN client cl ON c.client_id = cl.id_client
LEFT JOIN status_compte sc ON c.status_compte_id = sc.id_status
WHERE c.status_compte_id = 1;



-- Vue pour les périodes (ordre croissant)
CREATE OR REPLACE VIEW vue_periode AS
SELECT * FROM periode ORDER BY nombre_mois ASC;