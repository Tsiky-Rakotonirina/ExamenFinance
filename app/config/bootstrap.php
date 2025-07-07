<?php

/*
 * This is the file called bootstrap who's job is to make sure that all the
 * required services, plugins, connections, etc. are loaded and ready to go
 * for every request made to the application.
 */
$ds = DIRECTORY_SEPARATOR;
require(__DIR__ . $ds . '..' . $ds . '..' . $ds . 'vendor' . $ds . 'autoload.php');
if(file_exists(__DIR__. $ds . 'config.php') === false) {
	Flight::halt(500, 'Config file not found. Please create a config.php file in the app/config directory to get started.');
}

// It is better practice to not use static methods for everything. It makes your
// app much more difficult to unit test easily.
// This is important as it connects any static calls to the same $app object
$app = Flight::app();

/*
 * Load the config file
 * P.S. When you require a php file and that file returns an array, the array
 * will be returned by the require statement where you can assign it to a var.
 */
$config = require('config.php');
// Charger les services AVANT les routes
require('services.php');
// Initialiser le router
$router = $app->router();
/*
 * Load the routes file. the $router variable above is passed into the routes.php
 * file below so that you can define routes in that file.
 * A route is really just a URL, but saying route makes you sound cooler.
 * When someone hits that URL, you point them to a function or method 
 * that will handle the request.
 */
require('routes.php');
/*
 * You additionally could just define the routes in this file. It's up to you.
 * Example:
	$router->get('/', function() {
		echo 'Hello World!';
	});
*/

// At this point, your app should have all the instructions it needs and it'll
// "start" processing everything. This is where the magic happens.
$app->start();
/*
 .----..---.  .--.  .----.  .---.     .---. .-. .-.  .--.  .---.    .----. .-. .-..----. .----..-.  .-.
{ {__ {_   _}/ {} \ | {}  }{_   _}   {_   _}| {_} | / {} \{_   _}   | {}  }| { } || {}  }| {}  }\ \/ / 
.-._} } | | /  /\  \| .-. \  | |       | |  | { } |/  /\  \ | |     | .--' | {_} || .--' | .--'  }  {  
`----'  `-' `-'  `-'`-' `-'  `-'       `-'  `-' `-'`-'  `-' `-'     `-'    `-----'`-'    `-'     `--'  
*/