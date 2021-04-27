async function test_inline_external_id(){
    const URL = "https://api.themoviedb.org/3/find/"
    let key3 = document.querySelector("#api_v3").value;
    let key4 = document.querySelector('#api_v4').value;
    
    let service = document.querySelector("#service").value;
    let ext_id = document.querySelector("#id").value;
    let fetch_req = fetch(URL + ext_id 
        + "?api_key=" + key3 
        + "&language=" + "en-US"
        + "&external_source=" + service)
        .catch((error)=>{
            console.out(error);
            let out = document.querySelector("#api_problems");
            out.innerHTML = error.toString();
            out.style.display = inline;
            return;
        });
    let data = await fetch_req;
    //console.log(data);
    let jsonData = await data.json(); 
    //console.log(jsonData);
    let ret = {movies : [], TV : []};
    for (movie in jsonData.movie_results){
        ret.movies.push(movie.title);
    }
    for (show of jsonData.tv_results){
        ret.TV.push(show.name);
    }
    //console.log(ret);
    document.querySelector("#output").innerHTML = "movies: " + ret.movies.toString() + "<br>TV: " + ret.TV.toString();
}