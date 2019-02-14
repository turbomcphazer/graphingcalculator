const RIGHT = 0
const LEFT = 1

var xsize = 10;
var ysize = 10;
var lastFormula = "";
var update_loop = setInterval(check, 1000);

var error = ""

document.addEventListener("keydown", function (event) {
   if (event.keyCode == 13) {
        return false;
    }
});

document.addEventListener("DOMContentLoaded", function(){
    setaxes();
});

window.onload = window.onresize = function() {
    var canvas = document.getElementById('canvas');
    // Set internal size
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resetSize();
}

function resetSize() {
    var canvas = document.getElementById('canvas');
    ysize = xsize * (canvas.height / canvas.width);
    setaxes();
    lastFormula = ""; // force recheck
    check();
}

function setaxes() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.closePath();

    ctx.font = "12px Courier";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "gray";
    ctx.fillText(ysize.toFixed(2), canvas.width/2 - canvas.width/80, canvas.height / 80);
    ctx.fillText(-ysize.toFixed(2), canvas.width/2 - canvas.width/80, canvas.height - canvas.height / 80);

    ctx.fillText(xsize.toFixed(2), canvas.width - (canvas.width / 80), canvas.height/2 - canvas.height / 40);

    ctx.textAlign = "left";
    ctx.fillText(-xsize.toFixed(2), canvas.width / 80, canvas.height/2 - canvas.height/40);

}

function display(val) {

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setaxes();

    ctx.strokeStyle = "red";
    var xstep = canvas.width / val.length;
    var i;
    for (i = 0; i < val.length - 1; i++) {
        if (val[i] != null && val[i+1] != null) {
            ctx.beginPath();
            ctx.moveTo(i * xstep, (canvas.height / 2) + ((val[i] / ysize) * (-canvas.height / 2)));
            ctx.lineTo((i+1) * xstep, (canvas.height / 2) + ((val[i+1] / ysize) * (-canvas.height / 2)));
            ctx.stroke();
            ctx.closePath();
        }
    }
}

function check() {

    var formula = document.getElementById("formula").value;

    if (formula == lastFormula)
    {
        return false;
    }

    document.getElementById("errormessage").innerHTML = "&nbsp;";
    lastFormula = formula;

    var tempValues = checkFormula(formula);
    if (tempValues == false) {
        document.getElementById("errormessage").innerHTML = error;
        return false;
    } else {
        display(tempValues);
        return true;
    }
}

function zoom(factor) {
    xsize *= factor;
    resetSize();
}

function noenter() {
    return !(window.event && window.event.keyCode == 13);
}

