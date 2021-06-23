/**
 * title: TMDB api project
 * author: Olav (https://github.com/ohopstad)
 * date: May 2021
 */
class Item{
    constructor(title, poster_path, type){
        this.poster_url = "https://image.tmdb.org/t/p/original" + poster_path;
        this.title = title;
        this.type = type;
    }
}
function submit_api(){
    let api_3 = document.getElementById("api_v3").value;
    let api_4 = document.getElementById("api_v4").value;

    setCookie("tmdb_v3", api_3);
    setCookie("tmdb_v4", api_4);
    document.getElementById("enter_api").style.display = "none";
    document.getElementById("controls").style.display = "block";
}
function search(){
    const URL = "https://api.themoviedb.org/4/"
    const tmdb_key = getCookie('tmdb_v4');
    let id = document.getElementById("id").value;
    let language = document.getElementById("language").value;
    let type = document.getElementById("tv-or-movie").value;
    let query = document.getElementById("query").value;

    

    if (id != ""){
        console.log(id);
        hello = fetch_tmdb(URL + type + "/" + id + "?api_key=" + tmdb_key)
        .then((data)=>{
            console.log(data);
            write_results([new Item(data.name, data.poster_path, type)]);
        });
        console.log(hello);
    }
    else if(query != ""){
        fetch_tmdb(URL + "search/"+ type +"?api_key=" + tmdb_key + "&query=" + query)
        .then((data)=>{
            ret = [];
            for (i of data.results){
                title = "";
                if (type == "movie"){
                    title = i.title;
                }
                else{
                    title = i.name;
                }
                ret.push(new Item(title, i.poster_path, type));
            }
            write_results(ret);
        });

    }
}

function print_issues(error){
    let container = document.getElementById("api_problems");
    container.innerHTML = error.toString();
    container.style.display = "block";
} 

function write_results(arr){
    here = document.getElementById("results");
    here.style.display = "block";
    here.innerHTML = "";
    for (result of arr){
        here.innerHTML += "<div class='result_"+ result.type + "'>"
                        +"<img class='result_img' src='" + result.poster_url 
                        + "'><br><h3>" + result.title +"</h3></div>";
    }
}
async function fetch_tmdb(url){
    let response = await fetch(url, {
        redirect: "error"
    })
    .then(data=>{
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