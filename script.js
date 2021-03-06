//flags to know is the stats buttons / countrie buttons are present 
//or active
let statsButtonsFlag = false;
let countriesButtonsFlag = false;
let currentRegionFlag ='';
let coronaDataArr = [];

//A function that recives a region, and get the api of all of the countries in
//that region as an array of objects.
//loops over the array and map it - to return an array of objects with
//only one property - country(name): cca2 code.
async function createContryCodeArr (region) {
    try {
        const countriesByRegionEndPoint = `https://restcountries.herokuapp.com/api/v1/region/${region}`;
        const PROXY = `https://api.codetabs.com/v1/proxy/?quest=`;
        const response = await fetch(`${PROXY}${countriesByRegionEndPoint}`);
        const data = await response.json();

        //if valid region is not enterd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        if (data.code === 34) {
            return null;
        }
        else {

            //Massage data to return country code array
            const codeArr = [];
           for(i = 0; i<data.length; i++) {
                // const objKey = String(data[i].name.common);
                // const objValue = data[i].cca2;
                // const tempArr = new Map([[objKey, objValue]]);
                // const myObj = Object.fromEntries(tempArr);
                // result.push(myObj);
                const cca2 = data[i].cca2;
                codeArr.push(cca2);
           }
        //    console.log(codeArr);
        //console.log(region);
           return codeArr;
        }
    }
    catch(err) {
        console.log(`something went wrong with country by region. ${err}`);
    }
}
//createContryCodeArr(`asia`);
//createCoronaDataArr(createContryCodeArr('asia'));

//Function to loop over code array, and for each code, retrive the api of 
//the countries corona data. from that data create an object with only the foloowing:
//name, confirmed, deaths, recoverd, critical.
//return this array.

async function createCoronaDataArr(codeArr) {
        try {
            let infoArr = [];
            const countrieInfoByCodeEndPoint = `https://corona-api.com/countries/`;
            const PROXY = `https://api.codetabs.com/v1/proxy/?quest=`;

            //loop over codeArr, get the info for every country and push into infoArr 
            for(i = 0; i<codeArr.length; i++) {

                const response = await fetch(`${PROXY}${countrieInfoByCodeEndPoint}${codeArr[i]}`);
                const data = await response.json();
                infoArr.push(data);
                //console.log(infoArr);
            }
            
            //massage the data object to contain only:
            //country name, confirmed, deaths, recoverd, critical
            let result = [];
            for(i = 0; i<infoArr.length; i++) {
                const obj = infoArr[i];
                if (obj.message == "Not Found!") continue;                

                const dataObj = {
                    name: "NULL",
                    confirmed: 0,
                    deaths: 0,
                    recovered: 0,
                    critical: 0,
                    newCases: 0,
                    newDeaths: 0  
                }

                if (obj.data) {
                    dataObj.name = obj.data.name;
                    if (obj.data.latest_data) {
                        dataObj.confirmed = obj.data.latest_data.confirmed;
                        dataObj.deaths =  obj.data.latest_data.deaths;
                        dataObj.recovered = obj.data.latest_data.recovered;
                        dataObj.critical =  obj.data.latest_data.critical;
                    }
                    if (obj.data.timeline && obj.data.timeline[0]) {
                        let lastUpdate = obj.data.timeline[0];
                        dataObj.newCases = lastUpdate['new_confirmed'];
                        dataObj.newDeaths = lastUpdate['new_deaths'];
                    }    
                }

                result.push(dataObj);
                //console.log(dataObj);
                
            }
            //console.log(infoArr);
        return result;
        }

        catch(err) {
            console.log(`something went wrong with data for country. ${err}`);
        }
}

async function makeCountryGraph(countryID,infoArr) {

    let statsBtns = document.querySelector(".stats-btn-wrapper");
    statsBtns.innerHTML = "";
    statsButtonsFlag = false;

    resetCanvas();
     ///// the graph /////
    const ctx = document.getElementById('myChart').getContext('2d');

    //chart.defaults.global.defaultFontSize = "20px";
    const chart = new Chart.Bar (ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["Total Cases", "New Cases", "Total Deaths", "New Deaths", "Total Recovered", "Critical"],
            datasets: [{
            label: `COVID-19 Detailed stats for ${infoArr[countryID].name}`,
            backgroundColor: "cornsilk",
            borderColor: "lightblue",
            borderWidth: 2,
            hoverBackgroundColor: "lightgray",
            hoverBorderColor: "lightblue",
            data: [ infoArr[countryID].confirmed,
                    infoArr[countryID].newCases,
                    infoArr[countryID].deaths,
                    infoArr[countryID].newDeaths,
                    infoArr[countryID].recovered,
                    infoArr[countryID].critical ],
            }]
        },
      
        options: {
            maintainAspectRatio: false,
            scales: {
            yAxes: [{
                stacked: true,
                gridLines: {
                display: true,
                color: "darkgray"
                }
            }],
            xAxes: [{
                gridLines: {
                display: false
                }
            }]
            }
        }
    });
      
      
}

function resetCanvas() {
  
    let graphWrapper = document.querySelector('.graph-wrapper');
    let myCanvas = document.querySelector('#myChart');

    myCanvas.remove();

    let myChart = document.createElement("canvas");
    myChart.id = "myChart";
    graphWrapper.appendChild(myChart);
}

//function that recives info and stats and creates a graph.
async function makeGraph(region, infoArr, statsRequest) {
    //cancel the animation
    let animation = document.querySelector('.animation');
    animation.innerHTML = "";
    let title = document.querySelector('.title');
    title.innerHTML = region;

    const graphLabels = [];
    for(i = 0; i<infoArr.length; i++) {
        graphLabels.push(infoArr[i].name);
    }
    const graphData = [];
    for(i = 0; i<infoArr.length; i++) {
        let countryObj = infoArr[i];
        graphData.push(countryObj[statsRequest]);
    }

    resetCanvas();

    ///// the graph /////
   const ctx = document.getElementById('myChart').getContext('2d');

   //chart.defaults.global.defaultFontSize = "20px";
   const chart = new Chart (ctx, {

        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: graphLabels,
            datasets: [{
                label: `${statsRequest}`,
                backgroundColor: 'cornsilk',
                borderColor: 'lightblue',
                data: graphData
            }]
        },
        // Configuration options go here
        options: { 
            maintainAspectRatio: false,
            legend: { 
                labels: { 
                    fontColor: 'black',
                }
            }
        }
    });
    Chart.defaults.global.defaultFontSize = 16;
}

//function to create country buttons from the info array.
//the buttons are appended to the HTML div "countries".
//the buttons have an event listener.
async function createCountryButtons(infoArr) {
    const countriesWrap = document.querySelector(".countries");
    countriesWrap.innerHTML= '';
    
    for(i = 0; i<infoArr.length; i++){
        const countryBtn = document.createElement("button");
        countryBtn.innerHTML = `${infoArr[i].name}`;
        //the id is a unique number to find the country
        countryBtn.id = i;
        countryBtn.classList.add("countryButton");
        countryBtn.addEventListener('click', countryHandler);
        countriesWrap.appendChild(countryBtn);
    }
}

//the event listener function, that recives an event target(button),
//extracts the button innerHTML (asia for example) calls
//"createContryCodeArr" on the region, then sends the code arr to
//"createCoronaDataArr", which then sends an info arr to
//"makeGraph".
async function regionHandler(event) {
    drawRegionGraph(event.target.innerHTML,"confirmed");
}

async function drawRegionGraph(region,statsRequest) {

    let animation = document.querySelector('.animation');
    animation.innerHTML = "<img src='images/loadingGif.gif'>";

    //if the target is world button, do for all countries
    if (region == "World") {
        const regions = ['Asia', 'Africa', 'Europe', 'Oceania', 'Americas'];
        let worldCodeArr = [];
        //for codeArr to contain all countrie codes 
        for(reg in regions) {
            //console.log("Region: "+region);
            const codeArr = await createContryCodeArr(regions[reg]);
            worldCodeArr.push(codeArr);
        }
        worldCodeArr = worldCodeArr.flat().sort();

        //update GLOBAL array coronaDataArr 
        //defining it as global allows it to be used later in 'statHandler' to quickly switch between stats
        //by calling makeGraph directly.
        coronaDataArr = await createCoronaDataArr(worldCodeArr);      
    }
    else {
        if (region == 'America') region = 'Americas';
        const codeArr = await createContryCodeArr(region);
        coronaDataArr = await createCoronaDataArr(codeArr);
    }
    //draw graph
    makeGraph(region,coronaDataArr,statsRequest);
    //create buttons
    createCountryButtons(coronaDataArr);
    //if the event target is a region button, 
    //add confirmed, deaths, critical, recoverd btns
    if(statsButtonsFlag == false) {
        const statsWrapper = document.querySelector(".stats-btn-wrapper");

        const confirmedButton = document.createElement('button');
        confirmedButton.innerHTML = "Confirmed";
        statsWrapper.appendChild(confirmedButton);
        confirmedButton.classList.add('stats');
        confirmedButton.addEventListener('click', statHandler);

        const deathsButton = document.createElement('button');
        deathsButton.innerHTML = "Deaths";
        statsWrapper.appendChild(deathsButton);
        deathsButton.classList.add('stats');
        deathsButton.addEventListener('click', statHandler);

        const criticalButton = document.createElement('button');
        criticalButton.innerHTML = "Critical";
        statsWrapper.appendChild(criticalButton);
        criticalButton.classList.add('stats');
        criticalButton.addEventListener('click', statHandler);

        const recoveredButton = document.createElement('button');
        recoveredButton.innerHTML = "Recovered";
        statsWrapper.appendChild(recoveredButton);
        recoveredButton.classList.add('stats');
        recoveredButton.addEventListener('click', statHandler);

        statsButtonsFlag = true;
    }
}

async function statHandler(event) {
    let region = document.querySelector(".title").innerHTML;
    let statsRequest = event.target.innerHTML.toLowerCase();
    //drawRegionGraph(region, statsRequest);
    makeGraph(region,coronaDataArr,statsRequest);
}


async function countryHandler(event) {
    let countryID = event.target.id;
    makeCountryGraph(countryID,coronaDataArr);
}

//for HTML buttons
const buttons = document.querySelectorAll('.btn');

for(i = 0; i<buttons.length; i++) {
    buttons[i].addEventListener('click', regionHandler);
}
