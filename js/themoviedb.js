/*
fetches 
*/
async function test_id(){
    const URL = "https://api.themoviedb.org/3/";
    const poster_url = "https://image.tmdb.org/t/p/original";
    let key3 = document.querySelector("#api_v3").value;
    
    let service = document.querySelector("#service").value;
    let id = document.querySelector("#id").value;
    let fetch_url = URL;
    let url_get = "?api_key=" + key3 
        + "&language=" + "en-US"
        + "&external_source=" + service;
    if (service == "movie_id"){
        fetch_url += "movie/"  + id + url_get;
    }
    else{
        fetch_url += "find/" + id + url_get;
    }
    let fetch_req = fetch(fetch_url)
        .catch((error)=>{
            console.out(error);
            let out = document.querySelector("#api_problems");
            out.innerHTML = error.toString();
            out.style.display = inline;
            return true;
        });
    let data = await fetch_req;  
    if (!data.ok){
        let out = document.querySelector("#api_problems");
        out.innerHTML = data.status.toString();
        out.style.display = inline;
        return true;
    }  
    let jsonData = await data.json(); 

    //---results
    output = document.querySelector("#output");
    //clear
    output.innerHTML = "";
    results = jsonData.movie_results.concat(jsonData.tv_results);

    for (ans of results){
        output.innerHTML +=  "<br><img src='" + poster_url + ans.poster_path + "' width=100 height=150>";
    }
}