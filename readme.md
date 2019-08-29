# Propert Scrapper
## A scraper for https://www.propertypro.ng/ and https://www.nigeriapropertycentre.com/

 
 This project is the first part of the https://houserents.app project. 
 The scraper for both sites are in different directories. However they are both used in index.tsx. 
 After scrapping the website the latitude and logitude is derived from google location coding api.

 When running the code it's possible to get an `ECONNECTREST` error, just restart it if you get this error.
 Also, at the end of the execution you'll see `Done!` and all the entries will be stored in `data.all.json`
 in the root directory.

# Usage and Installation	
	* npm install
	* npm start

## Test
	* npm test