function getNewsData(page) {
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
        var jsondata = new Function("return " + req.responseText)();
        return jsondata;
    } else {
        //in caso di errore...
        //if there has been an error...
        alert("Data transfer error");
        return new Array();
    }
}

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

var totpages = -1;

//ritorna i dati di una pagina
//returns the data for a given page
function getPageData(page) {
    data = getNewsData(page);
    totpages = data.totpages;
    return data.pagedata;

}

//ritorna il numero totale di pagine (sincrono)
//returj the total number of pages (synchronous)
function getTotalPages() {
    //carichiamo la prima pagina solo per farci dire quante pagine ci sono...
    //si potrebbe creare una API specifica sul server, ovviamente
    //load the first page only to let the server tell us the total pages...
    //we may create a specific API on the server for this task
    if (totpages < 0) getPageData(1);
    return totpages;
}

//ritorna la funzione callback usata per dare stile alle celle create dal paginatore in base ai dati contenuti
//returns a callback function used to style the cells created by the pager 
function getCellStyleCallback() {
    return null;
}

//------------------------------------------------------------------------------------
//ASYNCHRONOUS VERSION

function getNewsDataAsync(page) {
    //prepara l'oggetto XMLHttpRequest
    //get the XMLHttpRequest object
    var req = createRequest();
    //prepara la URL usata per richiedere al browser i dati
    //prepare the URL used to download the data
    var requrl = "SimpleAjaxPager?json&page=" + page;

    //avvia la richiesta AJAX asincrona e ritorna la sua promise
    //start the asynchronous AJAX request and return its primise
    //console.log("avvio richiesta asincrona per la pagina " + page);
    return new Promise((success, failure) => {
        req.open("GET", requrl, true);
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    //interpreta i dati JSON ricevuti
                    //parse the received JSON data
                    var jsondata = new Function("return " + req.responseText)();
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
function getPageDataAsync(page) {
    return getNewsDataAsync(page).then(data => {
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