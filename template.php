<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title></title>
    <link rel="stylesheet" href="css/template.css">
    <link rel="stylesheet" href="css/default.css">
    <script>
        const urlBase = 'http://localhost:80/ExamenFinance/ws'; 
        function ajax(method, url, data, callback) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, urlBase + url, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(JSON.parse(xhr.responseText));
                }
            };
            xhr.send(data);
        }
    </script>
    <script src="js/template.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <div id="loader">
        <div></div>
    </div>
    <header>
        <nav class="menu">
            
        </nav>
    </header>
    <main>
        <?php include($_GET["page"].".php") ?>    
    </main>
    <footer>

    </footer>
</body>
</html>