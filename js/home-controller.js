$(document).ready(function () {
    var count=0;
    for(var i =0;i< col.length;i++){
        for(var j =0;j< col.length;j++){
            var temId=col[i]+row[j];
            DIV_IDS[count]=temId;
            count++;
        }
    }
});

var checkMateStatus=false;

var DIV_IDS=[];

var col=["a","b","c","d","e","f","g","h"]

var row=["1","2","3","4","5","6","7","8"];

var CHESSMANS_IDS=[
    "b-l-r","b-l-k","b-l-b","b-a-q","b-a-king","b-r-b","b-r-k","b-r-r","b-1-p","b-2-p","b-3-p","b-4-p","b-5-p","b-6-p",
    "b-7-p","b-8-p","w-1-p","w-2-p","w-3-p","w-4-p","w-5-p","w-6-p","w-7-p","w-8-p","w-l-r","w-l-k","w-l-b","w-a-king",
    "w-a-q","w-r-b","w-r-k","w-r-r"];

var CROSS_DIV_IDS=["cr1","cr2","cr3","cr4","cr5","cr7","cr8","cr9","cr10","cr11","cr12","cr13","cr14","cr15","cr16","cr17",
    "cr18","cr19","cr20","cr21","cr22","cr23","cr24","cr25","cr26","cr27","cr28","cr29","cr30","cr31","cr32"]

var path=[];

var turn="w";

var ChessObject={
    team:"",
    chessmanId:"",
    chessmanParentId:""
};

$("div > div > div > div > div > div > div").click(function () {

    var chessman = $(this).attr("id");
    var chessmanParent = $(this).parent().attr("id");
    var team = checkTeam(chessman);

    if (!checkMateStatus) {
        if ((checkAnyCrossing().length > 0) && (team !== ChessObject.team)) {

            var selectedDivsParent = $(this).parent().attr("id");
            var selectedDiv = $(this).attr("id");
            var team = checkTeam(selectedDiv);

            if ($("#" + selectedDivsParent).hasClass("cross") && (!selectedDiv.includes("king"))) {
                moveToCrossQueue(chessman, team);
                findCrossedChessman(selectedDiv);
                $("#" + ChessObject.chessmanId).appendTo("#" + selectedDivsParent);
                moveToCrossQueue(chessman, team);
                removeAllCross();
                removeAllPath();
                findTurn();
                checkMate();
                turnChessBoard();
            }
        } else {
            removeAllCross();
            removeAllPath();
            ChessObject.chessmanId = chessman;
            ChessObject.chessmanParentId = chessmanParent;
            ChessObject.team = checkTeam(ChessObject.chessmanId);
            findName(ChessObject.chessmanId);
        }
    } else {
        alert("Game Over");
    }
});


function findCrossedChessman(id) {
    for(var i=0;i<CHESSMANS_IDS.length;i++){
        if(id==CHESSMANS_IDS[i]){
            CHESSMANS_IDS.splice(i,1);
            if(CHESSMANS_IDS[i].includes("w")){
                $("#"+id).toggleClass('rotate');
            }
            break;
        }
    }
}

function moveToCrossQueue(id, team) {
    if(team==="b"){
        for(var i=0; i<15;i++){
            if($("#"+CROSS_DIV_IDS[i]).children().length===0){
                $("#"+id).appendTo($("#"+CROSS_DIV_IDS[i]));
                break;
            }
}

    } else if (team === "w") {
        for (var i = 15; i < CROSS_DIV_IDS.length; i++) {
            if ($("#" + CROSS_DIV_IDS[i]).children().length === 0) {
                $("#" + id).appendTo($("#" + CROSS_DIV_IDS[i]));
                break;
            }
        }
    }
}

$("div > div > div > div > div > div").click(function () {

    var selectedDiv = $(this).attr("id");
    if (($("#" + selectedDiv).hasClass("path")) && (!selectedDiv.includes("king"))) {
        $("#" + ChessObject.chessmanId).appendTo("#" + selectedDiv);
        removeAllCross();
        removeAllPath();
        findTurn();
        checkMate();
        turnChessBoard();

    }

});

function checkTeam(id) {

    var details = id.split("-");

    switch (details[0]) {
        case "b":
            return "b";
        case "w":
            return "w";
    }

}

function findName(id) {

    var details = id.split("-");

    if (turn === ChessObject.team) {

        switch (details[2]) {
            case "pawn":
                ChessObject.chessman = "pawn";
                findPawnPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "rook" :
                ChessObject.chessman = "ruk";
                findRukPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "bishop":
                ChessObject.chessman = "bishop";
                findBishopPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "knight":
                ChessObject.chessman = "knight";
                findknightPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "king":
                ChessObject.chessman = "king";
                findKingPath(ChessObject.chessmanParentId, ChessObject.team);
                break;
            case "queen":
                ChessObject.chessman = "queen";
                findQueenPath(ChessObject.chessmanParentId, ChessObject.team, "queen");
                break;
        }

    } else {
        if ((turn === "w") && (checkAnyCrossing().length === 0) && (checkAnyPath().length === 0)) {
            alert("This is not your chance, This is white team's turn");
        } else if ((turn === "b") && (checkAnyCrossing().length === 0) && (checkAnyPath().length === 0)) {
            alert("This is not your chance, This is black team's turn");
        }
    }
}

function findPawnPath(currentPos, team, from) {
    if (from !== "check") {
        removeAllCross();
        removeAllPath();
    }
    var count = 0;
    if ((currentPos !== null) && (currentPos !== undefined)) {

        var x = currentPos.substr(0, 1);
        var y = currentPos.substr(1, 1);

        var xIndex = getXIndex(x);
        var yIndex = getYIndex(y);

        if (team === "w") {
            for (var j = 0; j < row.length; j++) {

                if ((y === "2")) {
                    if ($("#" + x + "3").children().length === 0) {
                        $("#" + x + "3").addClass("path");
                        if ($("#" + x + "4").children().length === 0) {
                            $("#" + x + "4").addClass("path");
                        }
                    }

                } else {
                    var content = $("div > div > div > div > div > div > div").attr("id");

                    if ((content !== null) && (content !== undefined)) {
                        if ((count < 1) && ($("#" + x + (row[yIndex + 1])).children().length === 0)) {
                            $("#" + x + (row[yIndex + 1])).addClass("path");
                            count++;
                        }
                    }
                }

                if ($("#" + col[xIndex + 1] + row[yIndex + 1]).children().length > 0) {
                    var id = $("#" + col[xIndex + 1] + row[yIndex + 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "b") {
                        $("#" + col[xIndex + 1] + row[yIndex + 1]).addClass("cross");
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex + 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex + 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "b") {
                        $("#" + col[xIndex - 1] + row[yIndex + 1]).addClass("cross");
                    }
                }
            }

        } else {
            for (var j = row.length; j > 0; j--) {
                if (y === "7") {
                    if ($("#" + x + "6").children().length === 0) {
                        $("#" + x + "6").addClass("path");
                        if ($("#" + x + "5").children().length === 0) {
                            $("#" + x + "5").addClass("path");
                        }
                    }
                } else {
                    var content = $("div > div > div > div > div > div > div").attr("id");
                    if ((content !== null) && (content !== undefined)) {
                        if ((count < 1) && ($("#" + x + (row[yIndex - 1])).children().length === 0)) {
                            $("#" + x + (row[yIndex - 1])).addClass("path");
                            count++;
                        }
                    }
                }
                if ($("#" + col[xIndex + 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex + 1] + row[yIndex - 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "w") {
                        $("#" + col[xIndex + 1] + row[yIndex - 1]).addClass("cross");
                    }
                }
                if ($("#" + col[xIndex - 1] + row[yIndex - 1]).children().length > 0) {
                    var id = $("#" + col[xIndex - 1] + row[yIndex - 1]).children().attr("id");
                    var team = checkTeam(id);
                    if (team === "w") {
                        $("#" + col[xIndex - 1] + row[yIndex - 1]).addClass("cross");
                    }
                }
            }
        }

    }

}

function findRukPath(currentPos, team, from) {

    if (from !== "queen") {
        removeAllCross();
        removeAllPath();
    }

    var pathArray = [];
    var crossArray = [];
    var check = [];
    var content = $("div > div > div > div > div > div > div").attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {

            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getXIndex(x);
            var yIndex = getYIndex(y);

            for (var i = xIndex + 1; i < row.length; i++) {

                if ($("#" + col[i] + row[yIndex]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            for (var i = xIndex - 1; i > -1; i--) {

                if ($("#" + col[i] + row[yIndex]).children().length === 0) {
                    pathArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                }
                if ($("#" + col[i] + row[yIndex]).children().length > 0) {
                    if (checkTeam($("#" + col[i] + row[yIndex]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[i] + row[yIndex]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[i] + row[yIndex]).children().attr("id").includes("king")) {
                                check.push($("#" + col[i] + row[yIndex]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            for (var i = yIndex + 1; i < col.length; i++) {

                if ($("#" + col[xIndex] + row[i]).children().length === 0) {
                    pathArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                }
                if ($("#" + col[xIndex] + row[i]).children().length > 0) {

                    if (checkTeam($("#" + col[xIndex] + row[i]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[xIndex] + row[i]).children().attr("id").includes("king")) {
                                check.push($("#" + col[xIndex] + row[i]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }

            for (var i = yIndex - 1; i > -1; i--) {
                if ($("#" + col[xIndex] + row[i]).children().length === 0) {
                    pathArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                }
                if ($("#" + col[xIndex] + row[i]).children().length > 0) {
                    if (checkTeam($("#" + col[xIndex] + row[i]).children().attr("id")) !== team) {

                        if (from !== "check") {
                            crossArray.push($("#" + col[xIndex] + row[i]).attr("id"));
                            break;
                        } else {
                            if ($("#" + col[xIndex] + row[i]).children().attr("id").includes("king")) {
                                check.push($("#" + col[xIndex] + row[i]).attr("id"));
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }

            }
        }
        if (from !== "check") {
            colorCrossPath(crossArray);
            colorPath(pathArray);
        } else {
            return check;
        }
    }
}

function findQueenPath(currentPos, team, from) {
    // findRukPath(ChessObject.chessmanParentId, ChessObject.team, from);
    findBishopPath(ChessObject.chessmanParentId, ChessObject.team, from);
}

function findKingPath(currentPos, team, from) {

    removeAllCross();
    removeAllPath();

    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $("div > div > div > div > div > div > div").attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getXIndex(x);
            var yIndex = getYIndex(y);

            for (var i = 0; i < DIV_IDS.length; i++) {

                var tempX = DIV_IDS[i].substr(0, 1);
                var tempY = DIV_IDS[i].substr(1, 1);

                var newX = getXIndex(tempX);
                var newY = getYIndex(tempY);

                if ((Math.abs(newX - xIndex) <= 1) && (Math.abs(newY - yIndex) <= 1)) {
                    if ($("#" + DIV_IDS[i]).children().length > 0) {
                        if (checkTeam($("#" + DIV_IDS[i]).children().attr("id")) !== team) {
                            if (from !== "check") {
                                crossArray.push($("#" + DIV_IDS[i]).attr("id"));

                            } else {
                                if ($("#" + DIV_IDS[i]).children().attr("id").includes("king")) {
                                    check.push($("#" + DIV_IDS[i]).attr("id"));
                                    break;
                                }
                            }
                        }
                    }
                    if ($("#" + DIV_IDS[i]).children().length === 0) {
                        pathArray.push($("#" + DIV_IDS[i]).attr("id"));
                    }
                }
            }


            if (from !== "check") {
                colorCrossPath(crossArray);
                colorPath(pathArray);
            } else {
                return check;
            }

        }
    }
}

function findknightPath(currentPos, team, from) {
    removeAllCross();
    removeAllPath();

    var pathArray = [];
    var crossArray = [];
    var check = [];

    var content = $("div > div > div > div > div > div > div").attr("id");

    if ((content !== null) && (content !== undefined)) {
        if ((currentPos !== null) && (currentPos !== undefined)) {
            var x = currentPos.substr(0, 1);
            var y = currentPos.substr(1, 1);

            var xIndex = getXIndex(x);
            var yIndex = getYIndex(y);

            for (var i = 0; i < DIV_IDS.length; i++) {
                var tempX = DIV_IDS[i].substr(0, 1);
                var tempY = DIV_IDS[i].substr(1, 1);

                var newX = getXIndex(tempX);
                var newY = getYIndex(tempY);

                if (((Math.abs(xIndex - newX) === 1) && ((Math.abs(yIndex - newY)) === 2)) | (((Math.abs(xIndex - newX)) === 2) && ((Math.abs(yIndex - newY)) === 1))) {
                    if ($("#" + DIV_IDS[i]).children().length > 0) {
                        if (checkTeam($("#" + DIV_IDS[i]).children().attr("id")) !== team) {
                            if (from !== "check") {
                                crossArray.push($("#" + DIV_IDS[i]).attr("id"));

                            } else {
                                if ($("#" + DIV_IDS[i]).children().attr("id").includes("king")) {
                                    check.push($("#" + DIV_IDS[i]).attr("id"));
                                    break;
                                }
                            }
                        }
                    }
                    if ($("#" + DIV_IDS[i]).children().length === 0) {
                        pathArray.push($("#" + DIV_IDS[i]).attr("id"));
                    }
                }
            }
        }
        if (from !== "check") {
            colorCrossPath(crossArray);
            colorPath(pathArray);
        } else {
            return check;
        }

    }
}

function colorPath(path) {
    for (var i = 0; i < path.length; i++) {
        $("#" + path[i]).addClass("path");
    }
}

function colorCrossPath(cross) {
    for (var i = 0; i < cross.length; i++) {
        $("#" + cross[i]).addClass("cross");
    }
}

function getXIndex(x) {
    for (var i = 0; i < col.length; i++) {
        if (x === col[i]) {
            return i;
        }
    }
}

function getYIndex(y) {
    for (var i = 0; i < row.length; i++) {
        if (y === row[i]) {
            return i;
        }
    }
}

function removeAllPath() {
    for (var i = 0; i < DIV_IDS.length; i++) {
        $("#" + DIV_IDS[i]).removeClass("path");
    }
}


function removeAllCross() {
    for (var i = 0; i < DIV_IDS.length; i++) {
        $("#" + DIV_IDS[i]).removeClass("cross");
    }
}

function checkAnyCrossing() {

    var count = 0;
    var crossArray = new Array();
    for (var i = 0; i < DIV_IDS.length; i++) {
        if ($("#" + DIV_IDS[i]).hasClass("cross")) {
            crossArray.push(DIV_IDS[i]);
            count++;
        }
    }
    return crossArray;
}

function checkAnyPath() {

    var count = 0;
    var pathArray = new Array();
    for (var i = 0; i < DIV_IDS.length; i++) {
        if ($("#" + DIV_IDS[i]).hasClass("cross")) {
            pathArray.push(DIV_IDS[i]);
            count++;
        }
    }

    return pathArray;
}

function findTurn() {
    if (turn === "w") {
        turn = "b";
    } else {
        turn = "w";
    }
}

function turnChessBoard() {
    $('#board').toggleClass('rotate');
    rotateChessman();
}
