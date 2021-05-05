
class Item{
    constructor(title, poster_path, type){
        this.poster_url = "https://image.tmdb.org/t/p/original" + poster_path;
        this.title = title;
        this.type = type;
    }
}
async function search(){
    const key3 = document.getElementById("api_v3").value;
    let id = document.getElementById("id").value;
    let language = document.getElementById("language").value;
    let type = document.getElementById("tv-or-movie").value;
    let json = "";
    let query = document.getElementById("query").value;

    if(language == ""){
        language = "en-US";
    }

    if (id != ""){
        let service = document.getElementById("service").value;
        if (service != "tmdb"){
            json = await search_id_external(key3, id, service, language); 
            json = await json.json();
            ret = [];
            for (res of json.tv_results){
                ret.push(new Item(res.name, res.poster_path, "tv"));
            }
            for (res of json.movie_results){
                ret.push(new Item(res.title, res.poster_path, "movie"));
            }
            write_results(ret);
            return;
        }
        json = await search_id(key3, id, type, language);
        ret = [];
        for (res in json.results.tv_shows.concat(json.results.movies)){
            ret.push(new Item(res.title, res.poster_path, type));
        }
        write_results(json);
    }
    else{
        if(query != ""){
            json = await search_tmdb(key3, type, query, language);
            json = await json.json();
            json = json.results;
            
            console.log(json);
            ret = [];
            for (res of json){
                ret.push(new Item(res.name, res.poster_path, type));
                
            }
            
            write_results(ret);
        }
    }
}
/**
 * 
 * @param {*} error 
 */
function print_issues(error){
    let container = document.getElementById("api_problems");
    container.innerHTML = error.toString();
    container.style.display = "block";
} 

/**
 * 
 * @param {*} api_key 
 * @param {*} id 
 * @param {*} language 
 */
async function search_id(api_key, id, type, language){
    const URL = "https://api.themoviedb.org/3/"
    let fetch_url = URL + type + "/" + id;
    let url_get = "?api_key=" + api_key
                + "&language=" + language;
    fetch_url += url_get;
    let fetch_req = fetch(fetch_url)
        .catch((error)=>{
            print_issues(error);
        });
    let data = await fetch_req;
    if (!data.ok){
        print_issues(data.statusText.toString());
    }
    return data;
}
async function search_tmdb(api_key, type, query, language="en-US"){
    const URL = "https://api.themoviedb.org/3/search/"
    let fetch_url = URL + type + "/";
    let url_get = "?api_key=" + api_key
                + "&language=" + language
                + "&query=" + query;
                fetch_url += url_get;
    let fetch_req = fetch(fetch_url)
        .catch((error)=>{
            print_issues(error);
        });
    let data = await fetch_req;
    if (!data.ok){
        print_issues(data.statusText.toString());
    }
    return data;
}
/**
 * 
 * @returns 
 */
async function search_id_external(api_key, id, service, language){
    const URL = "https://api.themoviedb.org/3/";
    
    let fetch_url = URL;
    let url_get = "?api_key=" + api_key //api-key
                + "&language=" + language
                + "&external_source=" + service + "_id";

    fetch_url += "find/" + id + url_get;
    let fetch_req = fetch(fetch_url)
        .catch((error)=>{
            print_issues(error);
        });
    let data = await fetch_req;  
    if (!data.ok){
        print_issues(data.statusText.toString());
    }  
    return data;
}
function write_results(arr){
    here = document.getElementById("output");
    console.log(arr[0])
    for (result of arr){
        here.innerHTML += "<div class='result_"+ result.type + "'><h3>"
                        + result.title +"</h3><br><img class='result_img' src='" + result.poster_url 
                        + "'></div>";
    }
}
