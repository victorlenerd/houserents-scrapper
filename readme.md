# Propert Scrapper

[![Greenkeeper badge](https://badges.greenkeeper.io/victorlenerd/houserents_scrapper.svg?token=55f32e78e21d59bf21170179c4d552cda474f759f5903572a3e93590d8261e3c&ts=1570260536900)](https://greenkeeper.io/)

## A scraper for https://www.propertypro.ng/ and https://www.nigeriapropertycentre.com/

 
 This project is the first part of the https://houserents.app project. 
 The scraper for both sites are in different directories. However they are both used in index.js. 
 After scrapping the website the latitude and logitude is derived from google location coding api.

 When running the code it's possible to get an `ECONNECTREST` error, just restart it if you get this error.
 Also, at the end of the execution you'll see `Done!` and all the entries will be stored in `data.all.json`
 in the root directory.

# Usage and Installation	
	* npm install
	* npm start

## Test
	* npm test