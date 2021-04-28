async function search(){
    const key3 = document.querySelector("#api_v3").value;
    let id = document.querySelector("#id").value;
    let language = document.querySelector("#language").value;
    let type = document.querySelector("#tv-or-movie").value;
    let json = "";
    let query = document.querySelector("#query").value;

    if(language == ""){
        language = "en-US";
    }

    if (id != ""){
        let service = document.querySelector("#service").value;
        if (service != "tmdb"){
            json = await search_id_external(key3, id, service, language); 
            write_multiple_results(json);
            return;
        }
        json = await search_id(key3, id, type, language);
        console.log(json);
        write_single_result(json);
    }
    else{
        if(query != ""){
            json = await search_tmdb(key3, type, query);
            console.log(json);
            write_multiple_results(json);
        }
    }
}
/**
 * 
 * @param {*} error 
 */
function print_issues(error){
    let container = document.querySelector("#api_problems");
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
            console.err(error);
            print_issues(error);
        });
    let data = await fetch_req;
    if (!data.ok){
        print_issues(data.statusText.toString());
    }
    let jsonData = await data.json();
    return jsonData;
}
async function search_tmdb(api_key, type, query){
    const URL = "https://api.themoviedb.org/3/search/"
    let fetch_url = URL + type + "/";
    let url_get = "?api_key" + api_key
                + "&language=" + language
                + "&query=" + query;
                fetch_url += url_get;
    let fetch_req = fetch(fetch_url)
        .catch((error)=>{
            console.err(error);
            print_issues(error);
        });
    let data = await fetch_req;
    if (!data.ok){
        print_issues(data.statusText.toString());
    }
    let jsonData = await data.json();
    return jsonData;
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
    let jsonData = await data.json(); 
    return jsonData;
}
async function write_single_result(results_promise){
    let container = document.querySelector("#output");
    add_poster(results_promise.poster_path, container)
}
/**
 * 
 * @param {*} results_json 
 */
async function write_multiple_results(results_promise){
    const poster_url = "https://image.tmdb.org/t/p/original";
    let results_json = await results_promise; 
    let container = document.querySelector("#output");
    output.innerHTML = "";

    let results = results_json.movie_results.concat(results_json.tv_results);
    for (ans of results){
        add_poster(ans.poster_path, container);
    }

}
function add_poster(path, container){
    const poster_url = "https://image.tmdb.org/t/p/original";
    container.innerHTML +=  "<img src='" + poster_url + path + "' width=100 height=150>";
}