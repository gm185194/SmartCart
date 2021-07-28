var itemcount = 0;
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

    let routes = [];
    let chance = 0;

    if (isvalid(i - 1, j) && issafe(visited, i - 1, j)) {
        let result = shortestpath(visited, i - 1, j, x, y, minroute, routelist + "u");
        if (result !== -1) routes.push(result);
        chance = 1;
    }

    if (isvalid(i, j + 1) && issafe(visited, i, j + 1)) {
        let result = shortestpath(visited, i, j + 1, x, y, minroute, routelist + "r");
        if (result !== -1) routes.push(result);
        chance = 1;
    }
    if (isvalid(i, j - 1) && issafe(visited, i, j - 1)) {
        let result = shortestpath(visited, i, j - 1, x, y, minroute, routelist + "l");
        if (result !== -1) routes.push(result);
        chance = 1;
    }
    if (isvalid(i + 1, j) && issafe(visited, i + 1, j)) {
        let result = shortestpath(visited, i + 1, j, x, y, minroute, routelist + "d");
        if (result !== -1) routes.push(result);
        chance = 1;
    }
    visited[i][j] = 0;
    if (!chance || routes.length === 0) return -1;
    routes.sort((a, b) => a.length - b.length);
    // console.log(routes);
    return routes[0];
}

function refreshmap(destination = [-1, -1]) {
    for (let i = 0; i < storearray.length; i++) {
        for (let j = 0; j < storearray[i].length; j++) {
            let rackorspace = storearray[i][j] ? "rack" : "space";
            let id = "r" + i + "c" + j;
            if (destination[0] === i && destination[1] === j) continue;
            $("#" + id).removeClass("route");
            $("#" + id).html("");
        }
    }
}

function addItemToCart(img, item, price, quantity = 1) {
    $('.cartWrap').append("<li class=\"items\">\n" +
        "                <div class=\"infoWrap\">\n" +
        "                    <div class=\"cartSection\">\n" +
        "                        <img src=\"" + img + "\" alt=\"\" class=\"itemImg\" height=\"100px\" width=\"100px\"/>\n" +
        "                        <h3>" + item + "</h3>\n" +
        "                        <p><i class='fa fa-plus-circle'  style='font-size: 20px;padding-right: 10px;color: black'></i><input type=\"text\" class=\"qty\" placeholder=\"1\" value='" + quantity + "'/><i class='fa fa-minus-circle' style='font-size:20px;padding-left: 10px;color: black'></i> x Rs " + price + "</p>\n" +
        "                        <p class=\"stockStatus\"> In Stock</p>\n" +
        "                    </div>\n" +
        "                    <div class=\"prodTotal cartSection\">\n" +
        "                        <p> Rs " + quantity * price + "</p>\n" +
        "                    </div>\n" +
        "                    <div class=\"cartSection removeWrap\">\n" +
        "                        <a href=\"#\" class=\"remove\" style='text-decoration: none'>x</a>\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </li>");
    itemcount += 1;
    $("#itemcount").html(itemcount);
    $(".remove").click(function () {
        $(this).parent().parent().parent().remove();
        itemcount -= 1;
        $("#itemcount").html(itemcount);
        return false;
    });
}

function requiredArm(this_add_cart, Question) {
    Alert({
        type: "question",
        title: "Robotic Arm",
        message: Question,
        confirmText: "Yes",
        cancelText: "No"
    }).then((e) => {
        if (e === ("confirm")) {
            alert("Arm is picking up the item, Please Wait...");
        } else {
            var item = this_add_cart.siblings(".card-title").html();
            var price = this_add_cart.siblings(".card-text").children("span").html();
            var img = this_add_cart.parent().siblings(".card-img-top").attr("src");
            addItemToCart(img, item, price);
            $(this).html("Added to Cart");
            var this_temp = this_add_cart;
            setTimeout(function () {
                this_temp.html("Add to Cart <i class=\"fa fa-cart-arrow-down\"></i>");
            }, 3000);
        }
    });
}

$(document).ready(function () {

    $("#searchcross").hide();
    $("#itemsscrollleft").hide();
    $("#itemsscrollright").show();
    var destination = [8, 11];
    var cartposition = [0, 0];
    var currentItemAddCart = NaN;

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
                refreshmap(destination);
                cartposition[0] = i;
                cartposition[1] = j;
                if (cartposition[0] === destination[0] && cartposition[1] === destination[1]) {
                    destination[0] = -1;
                    destination[1] = -1;
                    let text = "You have reached your destination, please pick your item";
                    speaker.text = text;
                    window.speechSynthesis.speak(speaker);
                    document.getElementById("map").style.zIndex = "-200";
                    document.getElementById("map").style.opacity = "0";
                    setTimeout(function () {
                        currentItemAddCart.trigger('click');
                        currentItemAddCart = NaN;
                    }, 100);
                    return;
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
                    if (pathlist[direction] === "r") {
                        cords[1] += 1;
                        $("#" + id).html("<img src=\"../static/img/right-arrow.gif\" width='100%'/>");
                    }
                    if (pathlist[direction] === "l") {
                        cords[1] -= 1;
                        $("#" + id).html("<img src=\"../static/img/left-arrow.gif\" width='100%'/>");
                    }
                    if (pathlist[direction] === "u") {
                        cords[0] -= 1;
                        $("#" + id).html("<img src=\"../static/img/up-arrow.gif\" width='100%'/>");
                    }
                    if (pathlist[direction] === "d") {
                        cords[0] += 1;
                        $("#" + id).html("<img src=\"../static/img/down-arrow.gif\" width='100%'/>");
                    }
                }
            });
        }
    }

    $('#closecart').click(function () {
        document.getElementById("cart").style.zIndex = "-100";
        document.getElementById("cart").style.opacity = "0";
        return false;
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
        let this_add_cart = $(this);
        let cords = this_add_cart.siblings(".directions").siblings("i").html().split(",");
        // alert(cartposition[0]+" "+parseInt(cords[0])+" "+cartposition[1]+" "+parseInt(cords[1]));
        if (cartposition[0] === parseInt(cords[0]) && cartposition[1] === parseInt(cords[1])) {
            requiredArm($(this), "You are at the item location<br>Do you want the Arm to pick the item?");
            return false;
        }
        Alert({
            type: "question",
            title: "In-Store Navigavtion",
            message: "Do you want the directions to the item?",
            confirmText: "Yes",
            cancelText: "No"
        }).then((e) => {
            if (e === ("confirm")) {
                this_add_cart.siblings(".directions").trigger('click');
            } else {
                requiredArm($(this), "Do you want the Arm to pick the item?");
            }
        });
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
        recognition.stop();
        if (transcript.toLowerCase().indexOf("add ") > -1) {
            let wantdestination
            $.getJSON('additem', {'transcript': transcript.toLowerCase()}, function (data, Status) {
                if (data["status"] === "found") {
                    let this_add_cart = $("#" + data['item']['Code'] + "_add-cart");
                    if (cartposition[0] === parseInt(data['item']['Position_X']) && cartposition[1] === parseInt(data['item']['Position_Y'])) {
                        requiredArm(this_add_cart, "You are at the item location<br>Do you want the Arm to pick the item?");
                        return false;
                    } else {
                        Alert({
                            type: "question",
                            title: "In-Store Navigavtion",
                            message: "Do you want the directions to the item?",
                            confirmText: "Yes",
                            cancelText: "No"
                        }).then((e) => {
                            if (e === ("confirm")) {
                                this_add_cart.siblings(".directions").trigger('click');
                            } else {
                                requiredArm($(this), "You are at the item location<br>Do you want the Arm to pick the item?");
                            }
                        });
                    }
                } else {
                    speaker.text = "Sorry " + data['item_name'] + " not Found, try searching for that item in the search bar";
                    window.speechSynthesis.speak(speaker);
                    alert(speaker.text);
                }
            }).fail(function (ex) {
                alert('item not added,due to ' + ex);
            });
        } else {
            speaker.text = "These are the results for " + transcript;
            window.speechSynthesis.speak(speaker);
            $('#searchbar').val(transcript);
            $('#searchbar').keyup();
        }

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
        currentItemAddCart = $(this).siblings(".add-cart");
        destination[0] = parseInt(cords[0]);
        destination[1] = parseInt(cords[1]);
        var img = $(this).parent().siblings(".card-img-top").attr("src");
        let id = "r" + destination[0] + "c" + destination[1];
        document.getElementById("map").style.zIndex = "200";
        document.getElementById("map").style.opacity = "1";
        refreshmap(destination);
        $("#" + id).html("<img src='" + img + "' width='100%'/>");
        // findpath();
    });

    $("#items").scroll(function () {
        if ($('#items').scrollLeft() === 0) {
            $("#itemsscrollleft").hide();
        } else if ($('#items').scrollLeft() === $('#items')[0].scrollWidth - 960) {
            $("#itemsscrollright").hide();
        } else {
            $("#itemsscrollleft").show();
            $("#itemsscrollright").show();
        }
    });

    $("#itemsscrollleft").click(function () {
        let temp = $('#items').scrollLeft() - 550;
        temp = temp > 0 ? temp : 0;
        $('#items').animate({
            scrollLeft: temp
        }, 500);
    });

    $("#itemsscrollright").click(function () {
        let temp = $('#items').scrollLeft() + 550;
        temp = temp <= $('#items')[0].scrollWidth - 960 ? temp : $('#items')[0].scrollWidth - 960;
        $('#items').animate({
            scrollLeft: temp
        }, 500);
    });

});
