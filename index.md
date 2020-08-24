<div id="page">
<!--         <input id="savedPage" type="button">Saved Page </input>
        <input id="savePage" type="button">Save Page </input> -->
        <input type="number" id="pageNumber" />
        <ul id="bookSelect">
            <li>Book Of The New Sun</li> |
            <li>Fiasco</li> |
            <li>Mort</li> |
            <li>Small Gods</li>
        </ul>
        <div id="bookMarks">
            <div id=savePage>Bookmark</div>
            <div id=savedPage>Go to Bookmark</div>
        </div>
        <img id="pagePick" src="nothin" />
</div>


<script type="text/javascript">
    let bookString = "BookOfTheNewSun";

    let page = 1;
    var clickAble = document.getElementById("pagePick");
    var pageSelect = document.getElementById("pageNumber");
    var pageSave = document.getElementById("savePage");
    var pageSaved = document.getElementById("savedPage");

    document.onkeydown = (e) => {
        if(e.keyCode == 39) {
            pageNext();
        }
        if(e.keyCode == 37){
            pageLast();
        }
    }

    document.getElementById("bookSelect").onclick = (el) => {
        bookString = el.target.textContent.replaceAll(" ", "");
    }

    clickAble.onclick = () => {
        pageNext();
    }

    clickAble.oncontextmenu = () => {
        pageLast();   
    }
    pageSelect.onchange = () => {
        page = pageSelect.value
        console.log(`./${bookString}/${bookString}-${page}.png`);
        document.getElementById("pagePick").setAttribute("src", `./${bookString}/${bookString}-${page}.png`)
    }

    function pageLast(){
        page--;
        pageSelect.value = page
        document.getElementById("pagePick").setAttribute("src", `./${bookString}/${bookString}-${page}.png`)
        return false; 
    }

    function pageNext(){
        page++;
        pageSelect.value = page
        window.scrollTo(0, 0);
        document.getElementById("pagePick").setAttribute("src", `./${bookString}/${bookString}-${page}.png`)
    }
    pageSave.onclick = () => {
        console.log(page);
        document.cookie =`./${bookString}/${bookString}-${page}.png`
    }
    pageSaved.onclick = () => {
        console.log(decodeURIComponent(document.cookie).split(" "));
        document.getElementById("pagePick").setAttribute("src", decodeURIComponent(document.cookie).split(" ")[2]);
    }
</script>


<style>
body{
    background-color: black;
    color: white;
}
#page{
    display: flex;
    flex-direction: column;
    max-width: 500px;
    align-content: center;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
}
#bookSelect{
    list-style-type: none;
}
ul > li {
    display: inline-block;
    /* You can also add some margins here to make it look prettier */
    zoom:1;
    *display:inline;
}
</style>
