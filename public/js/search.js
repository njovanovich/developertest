// onReady
$( document ).ready(function() {
    // create select2
    $(".select2").select2({
        tags: true
    });
});

// search OMDb
let totalResults = -1;
let lastGoodPageNo = 1;
let hasFoundData = false;
let pageNo = 1;
function search(term, page){
    // reset the gui
    resetGui();

    // validate the input
    let match = term.match(/\S*\d*/);
    if (match) {
        // set the page if none
        if (!page) {
            page = 1;
        }
        $('#inpPageNo').val(page);
        pageNo = page;

        // hit the url
        let url = 'http://www.omdbapi.com/?S='+term+'&apikey='+api_key;
        url += '&page='+page;
        $.ajax({
            url: url,
            success: displayResults,
            error: errorInAjax
        });
    } else {
        displayError("Please use letters and numbers only");
    }
}

// pull the title runtime from OMDb
function getTitleRuntime(imdbId){
    return new Promise((resolve, reject) => {
        let url = 'http://www.omdbapi.com/?i='+imdbId+'&apikey='+api_key;
        $.ajax({
            url: url,
            success: function (data) {
                resolve({imdbId:imdbId, data: data});
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}


// display the results
function displayResults(data, textStatus, jqXHR){
    if (data.Response == "False") {
        // if the response is none, display an error
        displayError(data.Error);
    } else if (data.Search){
        hasFoundData = true;
        lastGoodPageNo = pageNo;

        // clear the previous search data
        $('.displayTable tbody').empty();

        //set the totalResults
        totalResults = data.totalResults;
        $('#inpTotalPageNo').val(totalResults);

        // show the table and populate, saving the imdb id
        $('#divDisplayTable').css("display","inline");
        let imdbIds = [];
        for(let i in data.Search){
            let movie = data.Search[i];
            let title = movie.Title;

            // get first matching word
            let splitSpaces = $('.select2').val().split(' ');
            let regex = new RegExp('('+splitSpaces[0]+')', 'i');
            title = title.replace(regex,
                "<span style='background-color: yellow'>$1</span>");

            let newRow = "<tr><td>" + title + "</td><td>" + movie.Year +
                            "</td><td id='td"+movie.imdbID+"'></td></tr>";
            imdbIds.push(movie.imdbID);
            $('.displayTable tbody').append(newRow);
        }

        for(let i in imdbIds){
            let imdbId = imdbIds[i];
            // get the runtime of the title when we can
            getTitleRuntime(imdbId)
                .then((result) => {
                    $('#td'+result.imdbId).html(result.data.Runtime);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }
}

// if call is erroring
function errorInAjax(jqXHR, textStatus, errorThrown){
    let errorMessage = "Error in call, contact support.";
    if (errorThrown) {
        errorMessage = "Error in call, contact support ["+errorThrown+"]";
    }
    alert(errorMessage);
}

// display the error message div
function displayError(errorMessage){
    resetGui();
    $('#divError').css("display","inline");
    if (hasFoundData) {
        errorMessage += "<br/><button onClick='goBack()'>&laquo; Go back</button>";
        $('#divError2').html(errorMessage);
    } else {
        $('#divError2').html(errorMessage);
    }
}

function incrementPage(){
    let pageNo = getPageNo();
    let totalPageNo = getTotalPageNo();
    if (pageNo != -1 && pageNo + 1 <= totalPageNo) {
        $('#inpPageNo').val(pageNo + 1);
        search($('.select2').val(), pageNo + 1);
    }
}

function decrementPage(){
    let pageNo = getPageNo();
    if (pageNo != -1 && pageNo - 1 > 0) {
        $('#inpPageNo').val(pageNo - 1);
        search($('.select2').val(), pageNo - 1);
    }
}

function startPage(){
    $('#inpPageNo').val(1);
    search($('.select2').val(), 1);
}

function endPage(){
    let totalPageNo = getTotalPageNo();
    $('#inpPageNo').val(totalPageNo);
    search($('.select2').val(), totalPageNo);
}

function gotoPage(){
    let pageNo = getPageNo();
    if (pageNo != -1) {
        $('#inpPageNo').val(pageNo);
        search($('.select2').val(), pageNo);
    } else {
        setLastGoodPage();
    }
}

function goBack(){
    resetGui();
    $('#divDisplayTable').css("display","inline");
    search($('.select2').val(), lastGoodPageNo);
}

function setLastGoodPage(){
    $('#inpPageNo').val(lastGoodPageNo);
}

// Execute a function when the user releases a key on the keyboard
$('#inpPageNo').keypress(function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        gotoPage();
    }
});

function getPageNo(){
    let pageNoString = $('#inpPageNo').val();
    let pageNo = parseInt(pageNoString);
    if (pageNo) {
        return pageNo;
    } else {
        return -1;
    }
}

function getTotalPageNo(){
    let pageNoString = $('#inpTotalPageNo').val();
    let pageNo = parseInt(pageNoString);
    if (pageNo) {
        return pageNo;
    } else {
        return -1;
    }
}

// reset the gui
function resetGui(){
    $('#divError').css("display","none");
    $('#divDisplayTable').css("display","none");
    $('.displayTable tbody').empty();
    $('.displayTable tbody').append('<tr/>');
}
