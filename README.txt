The app is using 2 API's: 

1. get country by region: https://restcountries.herokuapp.com/api/v1/region/(enter region) 
(this returns a full object of the region, "asia" for example, containing all of the countries
in asia includind there cca2 code (country code)).

2. get country by code: https://corona-api.com/countries/(enter country code)
(this returns an object of corona info for the enterd country).

and the PROXY server: https://api.codetabs.com/v1/proxy/?quest=  .
flow:

On page load, there is an existing HTML: 
heading
5 buttons: Europe, America(s), Africa, Asia, Oceania World

The user is pressing a continent.
    1. we request to get continent data. we create an array of objects(data).
    2. we create a new array containing the country codes cca2.
    3. we loop over the code array to create a new array. for each code, we will send a request to the 
        corona API, and get that country following properties: 
        name
        confirmed
        deaths
        recoverd
        critical
        which will be stored in an object in the array.
    4. write a function "make table" that accepts an array of keys(country names), an array of stats(numbers) and a lable,
        and from that creates a table.
    5. now we can present the data. we have the table creator, and an array with objects containing all the information that
        we need. all we need to do now is to filter the data and get what we want to present.
        we need to write a function "draw table" which is an event listener on each button. 
        the function is activated by a click on the button, and it recives continent name 
        and the button value (confirmed/deaths/recoverd/critical)  . it runs the 