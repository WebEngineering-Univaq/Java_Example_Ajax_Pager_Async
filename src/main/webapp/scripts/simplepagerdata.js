//------------------------------------------------------------------------------------
//COMMON CODE

var totpages = -1;

//ritorna il numero totale di pagine (sincrono)
//returj the total number of pages (synchronous)
function getTotalPages() {
    //carichiamo la prima pagina solo per farci dire quante pagine ci sono...
    //si potrebbe creare una API specifica sul server, ovviamente
    //load the first page only to let the server tell us the total pages...
    //we may create a specific API on the server for this task
    if (totpages < 0)
        getPageData(1);
    return totpages;
}

//ritorna la funzione callback usata per dare stile alle celle create dal paginatore in base ai dati contenuti
//returns a callback function used to style the cells created by the pager 
function getCellStyleCallback() {
    return null;
}

//------------------------------------------------------------------------------------
//SYNCHRONOUS VERSION

//creates and returns an XMLHttpRequest object
function createRequest() {
    var ACTIVEXIDs = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.3.0"];
    if (typeof XMLHttpRequest != "undefined") {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        for (var i = 0; i < ACTIVEXIDs.length; i++) {
            try {
                return new ActiveXObject(ACTIVEXIDs[i]);
            } catch (oError) {
                //l'oggetto richiesto non esiste: proviamo il successivo
                //this object is unavailable: try the next one
            }
        }
        alert("XMLHttpRequest object could not be created");
    } else {
        alert("XMLHttpRequest object could not be created");
    }
    return null;
}

function getNewsDataXHRSync(page) {
    //prepara l'oggetto XMLHttpRequest
    //get the XMLHttpRequest object
    var req = createRequest();
    //prepara la URL usata per richiedere al browser i dati
    //prepare the URL used to download the data
    var requrl = "SimpleAjaxPager?json&page=" + page;

    //avvia la richiesta AJAX sincrona
    //start the synchronous AJAX request
    req.open("GET", requrl, false);
    req.send();

    if (req.status === 200) {
        //interpreta i dati JSON ricevuti
        //parse the received JSON data
        //var jsondata = new Function("return " + req.responseText)(); //old way
        var jsondata = JSON.parse(req.responseText); //modern way
        return jsondata;
    } else {
        //in caso di errore...
        //if there has been an error...
        alert("Data transfer error");
        return new Array();
    }
}

//ritorna i dati di una pagina
//returns the data for a given page
function getPageDataXHRSync(page) {
    data = getNewsDataXHRSync(page);
    totpages = data.totpages;
    return data.pagedata;

}

//------------------------------------------------------------------------------------
//ASYNCHRONOUS VERSION - XmlHttpRequest

function getNewsDataXHRAsync(page) {
    //prepara l'oggetto XMLHttpRequest
    //get the XMLHttpRequest object
    var req = createRequest();
    //prepara la URL usata per richiedere al browser i dati
    //prepare the URL used to download the data
    var requrl = "SimpleAjaxPager?json&page=" + page;

    //avvia la richiesta AJAX asincrona e ritorna la sua promise
    //start the asynchronous AJAX request and return its primise
    //console.log("avvio richiesta asincrona XHR per la pagina " + page);
    return new Promise((success, failure) => {
        req.open("GET", requrl, true);
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    //interpreta i dati JSON ricevuti
                    //parse the received JSON data
                    //var jsondata = new Function("return " + req.responseText)(); //old way
                    var jsondata = JSON.parse(req.responseText); //modern way
                    //console.log("chiusura con successo della promise per la pagina " + page);
                    success(jsondata);
                } else {
                    //in caso di errore...
                    //if there has been an error...
                    failure("Data transfer error");
                    //return new Array();
                }
            }
        };
        req.send();
    });
}

//ritorna la promise derivante dalla ricezione asincrona e pre-elaborazione dei dati di una pagina
//returns the promise deriving from the asynchronous reception and pre-processing of the data for a given page
function getPageDataXHRAsync(page) {
    return getNewsDataXHRAsync(page).then(data => {
        //promise concatenata: questa promise (restituita allo script chiamante) termina con successo
        //quando la richiesta Ajax ha esito positivo e i dati risultanti sono stati pre-elaborati
        //chained promise: this promise (returned to the calling script) terminates with success
        //when the ajax request is successfull and the resulting data has been pre-processed
        //console.log("completamento promise per la pagina " + page);
        totpages = data.totpages;
        return data.pagedata;
    });
}


//------------------------------------------------------------------------------------
//ASYNCHRONOUS VERSION - Fetch


function getNewsDataFetch(page) {
    //prepara la URL usata per richiedere al browser i dati
    //prepare the URL used to download the data
    var requrl = "SimpleAjaxPager?json&page=" + page;

    //avvia la richiesta Fetch asincrona e ritorna la sua promise
    //start the asynchronous AJAX request and return its primise
    //console.log("avvio richiesta asincrona Fetch per la pagina " + page);
    return fetch(requrl)
            .then(response => {
                if (!response.ok) {
                    //in caso di errore...
                    //if there has been an error...
                    throw new Error("Data transfer error");
                }
                //restituisce una Promise che si risolve quando tutta la response è stata decondificata come JSON
                //returns a promise that resolves when all the response data has been decoded as JSON
                return response.json();
            });
}

//ritorna la promise derivante dalla ricezione asincrona e pre-elaborazione dei dati di una pagina
//returns the promise deriving from the asynchronous reception and pre-processing of the data for a given page
function getPageDataFetch(page) {
    return getNewsDataFetch(page).then(data => {
        //promise concatenata: questa promise (restituita allo script chiamante) termina con successo
        //quando la richiesta Ajax ha esito positivo e i dati risultanti sono stati pre-elaborati
        //chained promise: this promise (returned to the calling script) terminates with success
        //when the ajax request is successfull and the resulting data has been pre-processed
        //console.log("completamento promise per la pagina " + page);
        totpages = data.totpages;
        return data.pagedata;
    });
}


//------------------------------------------------------------------------------------
//ASYNCHRONOUS VERSION - Fetch + async keyword

//una funzione async restituisce una Promise del suo risultato
//an async function returns a Promise for its result
async function getNewsDataFetchAwait(page) {
    //prepara la URL usata per richiedere al browser i dati
    //prepare the URL used to download the data
    var requrl = "SimpleAjaxPager?json&page=" + page;

    //avvia la richiesta Fetch asincrona e attende che la sua promise si risolva
    //start the asynchronous AJAX request and wait for its primise to resolve
    //console.log("avvio richiesta asincrona Fetch in async function per la pagina " + page);
    const response = await fetch(requrl);
    if (!response.ok) {
        //in caso di errore...
        //if there has been an error...
        throw new Error("Data transfer error");
    }
    //restituisce tutta la response decondificata come JSON
    //returns all the response  decoded as JSON
    const json = await response.json();
    return json;
}

async function getPageDataFetchAwait(page) {
    //possiamo anche usare await per aspettare che la Promise 
    //restituita da getNewsDataFetchAwait si risolva
    //we can also use the await keyword to wait for the Promise
    //returned by getNewsDataFetchAwait to resolve
    const data = await getNewsDataFetchAwait(page);
    //avendo usato await, possiamo ora usare data sapendo che è disponibile
    //since we used await, we can now use data as it is available
    totpages = data.totpages;
    return data.pagedata;
}