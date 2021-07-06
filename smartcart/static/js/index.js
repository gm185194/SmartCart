var storearray = [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
]

function issafe(visited, x, y) {
    return !(storearray[x][y] === 1 || visited[x][y]);
}

function isvalid(x, y) {
    // console.log(x+" "+y);
    // console.log(0<=x && x<9 && 0<=y &&y<12);
    return 0 <= x && x < 9 && 0 <= y && y < 12;
}

function shortestpath(visited, i, j, x, y, minroute, routelist) {
    if (i === x && j === y) {
        // console.log("reached :"+routelist);
        if (routelist.length < minroute.length) {
            minroute = routelist;
        }
        return minroute;
    }
    // console.log("NOT reached :"+routelist);
    visited[i][j] = 1;

    let routes=[];
    let chance=0;

    if (isvalid(i - 1, j) && issafe(visited, i - 1, j)) {
        let result=shortestpath(visited, i - 1, j, x, y, minroute, routelist + "u");
        if(result!==-1)routes.push(result);
        chance=1;
    }

    if (isvalid(i, j + 1) && issafe(visited, i, j + 1)) {
        let result=shortestpath(visited, i, j + 1, x, y, minroute, routelist + "r");
        if(result!==-1)routes.push(result);
        chance=1;
    }
    if (isvalid(i, j - 1) && issafe(visited, i, j - 1)) {
        let result=shortestpath(visited, i, j - 1, x, y, minroute, routelist + "l");
        if(result!==-1)routes.push(result);
        chance=1;
    }
    if (isvalid(i + 1, j) && issafe(visited, i + 1, j)) {
        let result=shortestpath(visited, i + 1, j, x, y, minroute, routelist + "d");
        if(result!==-1)routes.push(result);
        chance=1;
    }
    visited[i][j] = 0;
    if(!chance || routes.length===0)return -1;
    routes.sort((a,b) => a.length - b.length);
    // console.log(routes);
    return routes[0];
}

function refreshmap() {
    for (let i = 0; i < storearray.length; i++) {
        for (let j = 0; j < storearray[i].length; j++) {
            let rackorspace = storearray[i][j] ? "rack" : "space";
            let id = "r" + i + "c" + j;
            $("#" + id).removeClass("route");
            $("#" + id).html("");
        }
    }
}


$(document).ready(function () {

    $("#searchcross").hide();
    var itemcount = 1;
    var destination = [8, 11];
    var cartposition = [0, 0];

    let speaker = new SpeechSynthesisUtterance();
    speaker.lang = 'en-US';
    speaker.volume = 0.5;

    var SpeechRecognition = window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

    for (let i = 0; i < storearray.length; i++) {
        for (let j = 0; j < storearray[i].length; j++) {
            let rackorspace = storearray[i][j] ? "rack" : "space";
            let id = "r" + i + "c" + j;
            $(".store").append("<div id='" + id + "' class=\"" + rackorspace + "\"></div>");
            if (rackorspace === "rack") continue;
            $("#" + id).hover(function () {
                refreshmap();
                cartposition[0] = i;
                cartposition[1] = j;
                if(cartposition[0]===destination[0] && cartposition[1]===destination[1])
                {
                    let text="You have reached your destination, please pick your item";
                    // alert(text);
                    speaker.text = text;
                    window.speechSynthesis.speak(speaker);
                    document.getElementById("map").style.zIndex = "-200";
                    document.getElementById("map").style.opacity = "0";
                }
                let visited = []
                for (let temp = 0; temp < storearray.length; temp++)
                    visited.push(Array(storearray[temp].length).fill(0));

                let minroute = "Goutham+309lksdnalnflksndlkfnlksndlksnflknslknflknslkfnlsknlcnjnlknsdkfniediosnmfn";

                // console.log(destination[0],destination[1]);

                let pathlist = shortestpath(visited, i, j, destination[0], destination[1], minroute, '');

                // console.log(pathlist);
                // console.log(pathlist.length);
                let cords = [i, j];
                for (let direction = 0; direction <= pathlist.length; direction++) {
                    // console.log(cords[0] + " " + cords[1]);
                    let id = "r" + cords[0] + "c" + cords[1];
                    $("#" + id).addClass("route");
                    if (pathlist[direction] === "r")
                    {
                        cords[1] += 1;
                        $("#" + id).html("<img src=\"../static/img/right-arrow.gif\" width='100%'/>");
                    }
                    if (pathlist[direction] === "l")
                    {
                        cords[1] -= 1;
                        $("#" + id).html("<img src=\"../static/img/left-arrow.gif\" width='100%'/>");
                    }
                    if (pathlist[direction] === "u")
                    {
                        cords[0] -= 1;
                        $("#" + id).html("<img src=\"../static/img/up-arrow.gif\" width='100%'/>");
                    }
                    if (pathlist[direction] === "d")
                    {
                        cords[0] += 1;
                        $("#" + id).html("<img src=\"../static/img/down-arrow.gif\" width='100%'/>");
                    }
                }
            });
        }
    }


    // var store=$(".store");
    // store.css("height",height-10);
    // store.css("width",width-10);

    $('a.remove').click(function () {
        event.preventDefault();
        $(this).parent().parent().parent().html("");

    })

    // Just for testing, show all items
    $('a.btn.continue').click(function () {
        $('li.items').show(400);
    })

    $('#closecart').click(function () {
        document.getElementById("cart").style.zIndex = "-100";
        document.getElementById("cart").style.opacity = "0";
    });

    $('#cartopen').click(function () {
        document.getElementById("cart").style.zIndex = "100";
        document.getElementById("cart").style.opacity = "1";
    });

    $("#searchbar").on("keyup", function () {
        if ($(this).val() === "") {
            $("#searchcross").hide();
        } else {
            $("#searchcross").show();
        }
        var value = $(this).val().toLowerCase();
        $("#items div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(".add-cart").click(function () {
        if ($(this).html() === "Added to Cart") {
            alert("Item already added");
            return false;
        }
        var item = $(this).siblings(".card-title").html();
        var price = $(this).siblings(".card-text").html();
        var img = $(this).parent().siblings(".card-img-top").attr("src");
        if (itemcount % 2 === 0) {
            var oddoreven = "even"
        } else {
            var oddoreven = "odd"
        }
        $('.cartWrap').append("<li class=\"items " + oddoreven + "\">\n" +
            "                <div class=\"infoWrap\">\n" +
            "                    <div class=\"cartSection\">\n" +
            "                        <img src=\"" + img + "\" alt=\"\" class=\"itemImg\" height=\"100px\" width=\"100px\"/>\n" +
            "                        <h3>" + item + "</h3>\n" +
            "                        <p><input type=\"text\" class=\"qty\" placeholder=\"1\"/> x " + price + "</p>\n" +
            "                        <p class=\"stockStatus\"> In Stock</p>\n" +
            "                    </div>\n" +
            "                    <div class=\"prodTotal cartSection\">\n" +
            "                        <p>" + price + "</p>\n" +
            "                    </div>\n" +
            "                    <div class=\"cartSection removeWrap\">\n" +
            "                        <a href=\"#\" class=\"remove\">x</a>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </li>");
        $(this).html("Added to Cart");
        $(this).attr("disabled");
        itemcount += 1;
        return false;
    });

    $("#voicesearch").click(function () {
        recognition.start();
        $('#searchbar').val("");
        $('#searchbar').keyup();
    });

    recognition.onresult = function (event) {
        var current = event.resultIndex;

        var transcript = event.results[current][0].transcript;
        speaker.text = "These are the results for " + transcript;
        window.speechSynthesis.speak(speaker);
        recognition.stop();
        $('#searchbar').val(transcript);
        $('#searchbar').keyup();
    };

    $("#searchcross").click(function () {
        $('#searchbar').val("");
        $("#searchcross").hide();
        $('#searchbar').keyup();
    });

    $(".closemaps").click(function () {
        document.getElementById("map").style.zIndex = "-200";
        document.getElementById("map").style.opacity = "0";
    });

    $(".directions").click(function () {
        let cords = $(this).siblings("i").html().split(",");
        destination[0] = parseInt(cords[0]);
        destination[1] = parseInt(cords[1]);
        document.getElementById("map").style.zIndex = "200";
        document.getElementById("map").style.opacity = "1";
        refreshmap();
        // findpath();
    });

});
