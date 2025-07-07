create database pdf;
use pdf;
create table etudiant(idEtudiant int auto_increment primary key, nom varchar(60), prenom varchar(10), naissance date, classe varchar(30));
create table filiere(idOption int auto_increment primary key, nom varchar(10));
create table matiere(idMatiere int auto_increment primary key, semestre int, matiere varchar(50), codeMatiere varchar(10), idOption int, optionnel int, credit int, foreign key (idOption) references filiere(idOption));
create table note(idNote int auto_increment primary key, semestre int, idEtudiant int, idMatiere int, Note int, foreign key (idEtudiant) references etudiant(idEtudiant), foreign key (idMatiere) references matiere(idMatiere));


-- Insertion des valeurs dans la table option
INSERT INTO filiere(nom) VALUES ('Tc');
INSERT INTO filiere(nom) VALUES ('Dev');
INSERT INTO filiere(nom) VALUES ('Web');
INSERT INTO filiere(nom) VALUES ('Bd');

-- Insertion de 10 etudiants
INSERT INTO etudiant(nom, prenom, naissance, classe) VALUES ('Alice', 'Dupont', '2005-01-14', "S1 Informatique");
INSERT INTO etudiant(nom, prenom, naissance, classe) VALUES ('Benoît', 'Martin', '2006-04-13', "S2 Informatique");
INSERT INTO etudiant(nom, prenom, naissance, classe) VALUES ('Catherine', 'Leroy', '2006-11-06', "S4 Informatique");
INSERT INTO etudiant(nom, prenom, naissance, classe) VALUES ('David', 'Bernard', '2006-03-06', "S6 Informatique");
INSERT INTO etudiant(nom, prenom, naissance, classe) VALUES ('Emma', 'Richard', '2002-09-03', "S1 Informatique");

-- Semestre 1
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (1, 'Programmation procedurale', 'INF101', 1, 0, 7);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (1, 'HTML et Introduction au Web', 'INF104', 1, 0, 5);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (1, 'Informatique de Base', 'INF107', 1, 0, 4);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (1, 'Arithmetique et nombres', 'MTH101', 1, 0, 4);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (1, 'Analyse mathematique', 'MTH102', 1, 0, 6);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (1, 'Techniques de communication', 'ORG101', 1, 0, 4);

-- Semestre 2
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (2, 'Bases de donnees relationnelles', 'INF102', 1, 0, 5);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (2, 'Bases de l administration système', 'INF103', 1, 0, 5);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (2, 'Maintenance materiel et logiciel', 'INF105', 1, 0, 4);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (2, 'Complements de programmation', 'INF106', 1, 0, 6);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (2, 'Calcul Vectoriel et Matriciel', 'MTH103', 1, 0, 6);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (2, 'Probabilite et Statistique', 'MTH105', 1, 0, 4);

-- Semestre 3
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (3, 'Programmation orientee objet', 'INF201', 1, 0, 6);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (3, 'Bases de donnees objets', 'INF202', 1, 0, 6);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (3, 'Programmation système', 'INF203', 1, 0, 4);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (3, 'Reseaux informatiques', 'INF208', 1, 0, 6);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (3, 'Methodes numeriques', 'MTH201', 1, 0, 4);
INSERT INTO matiere(semestre, matiere, codeMatiere, idOption, optionnel, credit) VALUES (3, 'Bases de gestion', 'ORG201', 1, 0, 4);


INSERT note(semestre, idEtudiant, idMatiere, Note) VALUES (1, 1, 1, 15),
    (1, 1, 2, 16),
    (1, 1, 3, 14),
    (1, 1, 4, 17),
    (1, 1, 5, 18),
    (1, 1, 6, 13),
    (1, 2, 1, 12),
    (1, 2, 2, 14),
    (1, 2, 3, 16),
    (1, 2, 4, 11),
    (1, 2, 5, 10),
    (1, 2, 6, 14),
    (1, 3, 1, 9),
    (1, 3, 2, 8),
    (1, 3, 3, 7),
    (1, 3, 4, 6),
    (1, 3, 5, 10),
    (1, 3, 6, 12),
    (2, 1, 1, 16),
    (2, 1, 2, 18),
    (2, 1, 3, 17),
    (2, 1, 4, 19),
    (2, 1, 5, 14),
    (2, 1, 6, 13),
    (2, 2, 1, 10),
    (2, 2, 2, 12),
    (2, 2, 3, 13),
    (2, 2, 4, 11),
    (2, 2, 5, 15),
    (2, 2, 6, 16),
    (2, 3, 1, 8),
    (2, 3, 2, 9),
    (2, 3, 3, 7),
    (2, 3, 4, 6),
    (2, 3, 5, 5),
    (2, 3, 6, 4),
    (3, 1, 1, 14),
    (3, 1, 2, 13),
    (3, 1, 3, 15),
    (3, 1, 4, 16),
    (3, 1, 5, 17),
    (3, 1, 6, 18),
    (3, 2, 1, 8),
    (3, 2, 2, 9),
    (3, 2, 3, 7),
    (3, 2, 4, 6),
    (3, 2, 5, 10),
    (3, 2, 6, 12),
    (3, 3, 1, 5),
    (3, 3, 2, 7),
    (3, 3, 3, 4),
    (3, 3, 4, 6),
    (3, 3, 5, 8),
    (3, 3, 6, 7)
;

ALTER TABLE note ADD COLUMN resultat VARCHAR(2);
UPDATE note
SET resultat = CASE
    WHEN Note < 10 THEN NULL
    WHEN Note >= 10 AND Note < 12 THEN 'P'
    WHEN Note >= 12 AND Note < 14 THEN 'AB'
    WHEN Note >= 14 AND Note < 16 THEN 'B'
    WHEN Note >= 16 THEN 'TB'
    END;

-- Ajouter la colonne lieu avec la valeur par defaut 'Antananarivo'
ALTER TABLE etudiant ADD COLUMN lieu VARCHAR(50) DEFAULT 'Antananarivo';

-- Ajouter la colonne inscription
ALTER TABLE etudiant ADD COLUMN inscription VARCHAR(20);

-- Mettre à jour inscription avec des valeurs generees aleatoirement
UPDATE etudiant
SET inscription = CONCAT('INS', LPAD(FLOOR(RAND() * 10000), 4, '0'));

ALTER TABLE note ADD COLUMN credit INT;

UPDATE note n
JOIN matiere m ON n.idMatiere = m.idMatiere
SET n.credit = CASE
    WHEN n.Note < 10 THEN 0  -- Si la note est inferieure à 10, on met le credit à 0
    ELSE m.credit  -- Sinon, on garde le credit de la matière
END;
