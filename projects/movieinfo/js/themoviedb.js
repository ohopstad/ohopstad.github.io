/**
 * title: TMDB api project
 * author: Olav (https://github.com/ohopstad)
 * date: June 2021
 */
class Item{
    constructor(title, poster_path, popularity){
        this.poster_url = "https://image.tmdb.org/t/p/original" + poster_path;
        this.title = title;
        this.popularity = popularity;
    }
    print(){
        return "<div class='result'>"
        +"<img class='result_img' src='" + result.poster_url 
        + "'><br><h3>" + result.title +"</h3></div>";
    }
}
class Movie extends Item{
    constructor(title, poster_path, popularity){
        super(title, poster_path, popularity);
    }
    print(){
        return "<div class='result_" + "movie" + "'>"
        +"<img class='result_img' src='" + result.poster_url 
        + "'><br><h3>" + result.title +"</h3></div>";
    }
}
class Show extends Item{
    constructor(title, poster_path, popularity){
        super(title, poster_path, popularity);
    }
    print(){
        return "<div class='result_" + "tv" + "'>"
        +"<img class='result_img' src='" + result.poster_url 
        + "'><br><h3>" + result.title +"</h3></div>";
    }
}

/**
 * FUNCTIONS
 */
function toggle_api(){
    if(document.getElementById("enter_api").style.display == "block"){
        document.getElementById("enter_api").style.display = "none";
        document.getElementById("controls").style.display = "block";
    }
    else{
        document.getElementById("enter_api").style.display = "block";
        document.getElementById("controls").style.display = "none";
    }

}
function submit_api(){
    let api_3 = document.getElementById("api_v3").value;
    let api_4 = document.getElementById("api_v4").value;

    setCookie("tmdb_v3", api_3);
    setCookie("tmdb_v4", api_4);
    toggle_api();
}
function search(){
    const URL = "https://api.themoviedb.org/3/"
    const tmdb_key = "1422303e78dc4243889e6e549813ff6d";
    let language = document.getElementById("language").value;
    let type = document.getElementById("tv-or-movie").value;
    let query = document.getElementById("query").value;

    
/* 
    if (id != ""){
        console.log(id);
        hello = fetch_tmdb(URL + type + "/" + id + "?api_key=" + tmdb_key)
        .then((data)=>{
            console.log(data);
            write_results([new Item(data.name, data.poster_path)]);
        });
        console.log(hello);
    } */
    if(type != "any"){
        ret = [];
        fetch_tmdb(URL + "search/"+ type +"?api_key=" + tmdb_key + "&query=" + query)
        .then((data)=>{
            for (i of data.results){
                title = "";
                if (type == "movie"){
                    ret.push(new Movie(i.title, i.poster_path, i.popularity));
                }
                else{
                    ret.push(new Show(i.name, i.poster_path, i.popularity));
                }
            }
            write_results(ret);
        });
    }
    else{
        ret = [];   
        fetch_tmdb(URL + "search/"+ "movie" +"?api_key=" + tmdb_key + "&query=" + query)
        .then((data)=>{
            for (i of data.results){
                ret.push(new Movie(i.title, i.poster_path, i.popularity));
            }
        })
        .then(
            fetch_tmdb(URL + "search/"+ "tv" +"?api_key=" + tmdb_key + "&query=" + query)
            .then((data)=>{
                for (i of data.results){
                    ret.push(new Show(i.name, i.poster_path, i.popularity));
                }
                write_results(ret);
            })
        );
        
    }
}

function print_issues(error){
    let container = document.getElementById("api_problems");
    container.innerHTML = error.toString();
    container.style.display = "block";
} 

function write_results(arr){
    arr.sort(function(a, b){
        return b.popularity - a.popularity;
    });
    here = document.getElementById("results");
    here.style.display = "block";
    here.innerHTML = "";
    for (result of arr){
        here.innerHTML += result.print();
    }
}
async function fetch_tmdb(url){
    let response = await fetch(url, {
        redirect: "error"
    })
    .then(data=>{
        if (!data.ok){
            print_issues(data.status + " -> " + data.statusText);
            return;
        }
        meh = data.json();
        return meh;
    })
    .catch(error=>{
        console.log(error);
    });
    return response;
} 

// from https://javascript.info/cookie 
function getCookie(name) {
    if (document.cookie.includes(name)){
        return document.cookie
            .split('; ')
            .find((row)=>row.startsWith(name + '='))
            .split('=')[1];
    }
    console.error("getCookie(): Cookie '" + name + "' not found!");
    return "";
}

// from https://javascript.info/cookie 
function setCookie(name, value, options={}) {

    options = {
        samesite: 'strict', 
        'max-age': 3600
    };

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}
function toggle_results(){
    api_problems = document.getElementById("api_problems");
    results = document.getElementById("results");

    api_problems.style.display = "none";
    if (results.style.display != "none"){
        results.style.display = "none";
    }
    else{
        results.style.display = "block";
    }
}
