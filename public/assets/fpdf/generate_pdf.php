<?php
require('fpdf.php');
include("function.php");

$studentInfo = getStudentInfo();

class PDF extends FPDF
{
    private $currentY; // Variable pour suivre la position Y actuelle

    function Header()
    {
        $this->Image('logo.png', 12, 2, 65, 0, '');

        $this->SetFont('Times', '', 11.5);
        $this->SetTextColor(180, 180, 180);
        $this->Text(130, 15, 'Annee universitaire 2015-2016');

        $this->SetFont('Times', 'B', 15);
        $this->SetTextColor(50, 100, 180);
        $this->Text(70, 35, 'RELEVE DE NOTES ET RESULTATS');
    }
    function Footer()
    {
        $this->SetFont('Arial', '', 10);
        $this->SetTextColor(0, 0, 0);
    
        $boxWidth = 100; 
        $boxHeight = 20; 
        $x = $this->GetPageWidth() - $boxWidth + 4;
        $y = 220; 
        $text1 = 'Fait a Antananarivo, le 12/09/2016';
        $text2 = 'Le Recteur de l\'IT University';
    
        $text1Width = $this->GetStringWidth($text1);
        $text2Width = $this->GetStringWidth($text2);
    
        $text1X = $x + ($boxWidth - $text1Width) / 2;
        $text2X = $x + ($boxWidth - $text2Width) / 2;
    
        $this->Text($text1X, $y + 5, $text1); 
        $this->Text($text2X, $y + 12, $text2); 
    }

    function Semestre($header, $data)
    {
        $moyenne = 0;
        $totalCredit = 0;
        $w = array(40, 35, 45, 40, 30); // Largeur des colonnes

        // Initialiser la position Y
        $this->currentY = 85;

        $this->SetY($this->currentY);
        $this->SetFillColor(255, 255, 255); // Fond blanc
        $this->SetFont('Arial', 'B', 10);

        // Filtrer les données pour ne garder que celles dont 'semestre' == 1
        $dataFiltered = array_filter($data, function($row) {
            return $row['semestre'] == 1;
        });

        // Affichage des en-têtes de colonnes
        for ($i = 0; $i < count($header); $i++) {
            $this->Cell($w[$i], 7, $header[$i], 0, 0, 'C', true);
        }
        $this->Ln();
        $this->currentY += 7; // Ajuster la position Y après les en-têtes

        $credit = 0;
        $note = 0;
        $nombre = 0;
        $this->SetFont('Arial', '', 10);
        foreach ($dataFiltered as $row) {
            if (is_array($row)) {
                $this->Cell($w[0], 6, $row['codematiere'], 0, 0, 'C');
                $this->Cell($w[1], 6, $row['matiere'], 0, 0, 'C');
                $this->Cell($w[2], 6, $row['credit'], 0, 0, 'C');
                $this->Cell($w[3], 6, $row['Note'], 0, 0, 'C');
                $this->Cell($w[4], 6, $row['resultat'], 0, 0, 'C');
                $this->Ln();
                $this->currentY += 6; // Ajuster la position Y après chaque ligne

                $credit += $row['credit'];
                $note += $row['Note'];
                $nombre++;
            } else {
                echo "Erreur : les données ne sont pas dans le format attendu.";
            }
        }

        $this->SetFont('Arial', 'B', 10);
        $this->Cell($w[0], 6, '', 0, 0, 'C');
        $this->Cell($w[1], 6, 'Semestre 1', 0, 0, 'C');
        $this->Cell($w[2], 6, $credit, 0, 0, 'C');
        $totalCredit += $credit;
        $moyenne += $note / $nombre;
        $this->Cell($w[3], 6, $note / $nombre, 0, 0, 'C');
        $this->Cell($w[4], 6, $this->getMention($note / $nombre), 0, 0, 'C');
        $this->Ln();
        $this->currentY += 6; // Ajuster la position Y après la ligne de résultat

        // Répéter le processus pour le semestre 2
        $this->SetY($this->currentY);
        $dataFiltered = array_filter($data, function($row) {
            return $row['semestre'] == 2;
        });

        for ($i = 0; $i < count($header); $i++) {
            $this->Cell($w[$i], 7, $header[$i], 0, 0, 'C', true);
        }
        $this->Ln();
        $this->currentY += 7;

        $credit = 0;
        $note = 0;
        $nombre = 0;
        $this->SetFont('Arial', '', 10);
        foreach ($dataFiltered as $row) {
            if (is_array($row)) {
                $this->Cell($w[0], 6, $row['codematiere'], 0, 0, 'C');
                $this->Cell($w[1], 6, $row['matiere'], 0, 0, 'C');
                $this->Cell($w[2], 6, $row['credit'], 0, 0, 'C');
                $this->Cell($w[3], 6, $row['Note'], 0, 0, 'C');
                $this->Cell($w[4], 6, $row['resultat'], 0, 0, 'C');
                $this->Ln();
                $this->currentY += 6;

                $credit += $row['credit'];
                $note += $row['Note'];
                $nombre++;
            }
        }

        $this->SetFont('Arial', 'B', 10);
        $this->Cell($w[0], 6, '', 0, 0, 'C');
        $this->Cell($w[1], 6, 'Semestre 2', 0, 0, 'C');
        $this->Cell($w[2], 6, $credit, 0, 0, 'C');
        $totalCredit += $credit;
        $moyenne += $note / $nombre;
        $this->Cell($w[3], 6, $note / $nombre, 0, 0, 'C');
        $this->Cell($w[4], 6, $this->getMention($note / $nombre), 0, 0, 'C');
        $this->Ln();
        $this->currentY += 6;

        // Afficher les résultats généraux
        $this->SetFont('Arial', 'B', 10);
        $this->Cell($w[0], 6, 'Resultat General: ', 0, 0, 'C');
        $this->SetFont('Arial', '', 10);
        $this->Cell($w[1], 6, 'Credit: ', 0, 0, 'C');
        $this->Cell($w[2], 6, $totalCredit, 0, 0, 'C');
        $this->Ln();
        $this->currentY += 6;

        $this->Cell($w[0], 6, '', 0, 0, 'C');
        $this->Cell($w[1], 6, 'Moyenne General: ', 0, 0, 'C');
        $this->Cell($w[2], 6, $moyenne / 2, 0, 0, 'C');
        $this->Ln();
        $this->currentY += 6;

        $this->Cell($w[0], 6, '', 0, 0, 'C');
        $this->Cell($w[1], 6, 'Mention: ', 0, 0, 'C');
        $this->Cell($w[2], 6, $this->getMention($moyenne / 2), 0, 0, 'C');
        $this->Ln();
        $this->currentY += 6;

        if ($moyenne / 2 >= 10) {
            $this->Cell($w[0], 6, '', 0, 0, 'C');
            $this->SetFont('Arial', 'B', 10);
            $this->Cell($w[1], 6, 'ADMIS', 0, 0, 'C');
            $this->Cell($w[2], 6, '', 0, 0, 'C');
            $this->Ln();
            $this->currentY += 6;
        } else {
            $this->Cell($w[0], 6, '', 0, 0, 'C');
            $this->SetFont('Arial', 'B', 10);
            $this->Cell($w[1], 6, 'NON ADMIS', 0, 0, 'C');
            $this->Cell($w[2], 6, '', 0, 0, 'C');
            $this->Ln();
            $this->currentY += 6;
        }

        $this->Cell($w[0], 6, '', 0, 0, 'C');
        $this->SetFont('Arial', '', 10);
        $this->Cell($w[1], 6, 'Session: ', 0, 0, 'C');
        $this->Cell($w[2], 6, '08/2015', 0, 0, 'C');
        $this->Ln();
        $this->currentY += 6;
    }

    private function getMention($moyenne)
    {
        if ($moyenne >= 10 && $moyenne < 12) return 'P';
        if ($moyenne >= 12 && $moyenne < 14) return 'AB';
        if ($moyenne >= 14 && $moyenne < 16) return 'B';
        if ($moyenne >= 16) return 'TB';
        return 'Echoue';
    }
}

$pdf = new PDF();
$pdf->AddPage();

$pdf->SetFont('Arial', '', 10);
$pdf->Text(20, 45, 'Nom: ');
$pdf->Text(46, 45, $studentInfo[0]['nom']);
$pdf->SetFillColor(0, 0, 0);
$pdf->Rect(46, 42, $pdf->GetStringWidth($studentInfo[0]['nom']), 6.5, 'F');

$pdf->Text(20, 52, 'Prenom(s): ');
$pdf->Text(46, 52, $studentInfo[0]['prenom']);
$pdf->Rect(46, 49, $pdf->GetStringWidth($studentInfo[0]['prenom']), 6.5, 'F');

$pdf->Text(20, 59, 'Ne le: ');
$pdf->Text(46, 59, $studentInfo[0]['naissance'] . ' a ' . $studentInfo[0]['lieu']);
$pdf->Rect(46, 56, $pdf->GetStringWidth($studentInfo[0]['naissance']), 6.5, 'F');
$pdf->Rect(68, 56, $pdf->GetStringWidth($studentInfo[0]['lieu']), 6.5, 'F');

$pdf->Text(20, 66, 'N d\'inscription: ');
$pdf->Text(46, 66, $studentInfo[0]['inscription']);
$pdf->Rect(46, 63, $pdf->GetStringWidth($studentInfo[0]['inscription']), 6.5, 'F');

$pdf->Text(20, 73, 'Inscrit en: ');
$pdf->SetFont('Arial', 'B', 10);
$pdf->Text(46, 73, $studentInfo[0]['classe']);

$pdf->SetFont('Arial', '', 10);
$pdf->Text(20, 80, 'a obtenu les notes suivantes: ');
$pdf->SetTextColor(0, 0, 0);

$header = array('UE', 'Intitule', 'Credits', 'Note/20', 'Resultat');
$pdf->Semestre($header, $studentInfo);
$pdf->Output();
// $pdf->Output('D', 'releve_notes.pdf'); // 'D' force le téléchargement
?>