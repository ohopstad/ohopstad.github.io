
class Item{
    constructor(title, poster_path, type){
        this.poster_url = "https://image.tmdb.org/t/p/original" + poster_path;
        this.title = title;
        this.type = type;
    }
}
function search(){
    const key3 = document.getElementById("api_v3").value;
    const URL = "https://api.themoviedb.org/3/"
    let id = document.getElementById("id").value;
    let language = document.getElementById("language").value;
    let type = document.getElementById("tv-or-movie").value;
    let json = "";
    let query = document.getElementById("query").value;

    if(language == ""){
        language = "en-US";
    }

    if (id != ""){
        console.log(id);
        hello = fetch_tmdb(URL + type + "/" + id + "?api_key=" + key3)
        .then((data)=>{
            console.log(data);
            write_results([new Item(data.name, data.poster_path, type)]);
        });
        console.log(hello);
    }
    else if(query != ""){
        fetch_tmdb(URL + "search/"+ type +"?api_key=" + key3 + "&query=" + query)
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
    here = document.getElementById("output");
    here.innerHTML = "";
    for (result of arr){
        here.innerHTML += "<div class='result_"+ result.type + "'><h3>"
                        + result.title +"</h3><br><img class='result_img' src='" + result.poster_url 
                        + "'></div>";
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
