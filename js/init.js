


function start(){       
    var sendButton = document.getElementById("sendButton");
    sendButton.addEventListener("click", preset, false);
    var allButton = document.getElementById("allButton");
    allButton.addEventListener("click", selectALL, false);
    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", resetAll, false);
    var setButton = document.getElementById("setButton");
    setButton.addEventListener("click", setAll, false);

    
    box =document.getElementsByName("box");
    ctx = document.getElementById("canvas").getContext("2d");
    ctx2 = document.getElementById('canvas2').getContext('2d');
    ctx3 = document.getElementById('canvas3').getContext('2d');
    line_chart = new Chart(ctx,{});
    bar_chart = new Chart(ctx2,{})
    best_line_chart = bar_chart = new Chart(ctx2,{});

}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    if(color == "#FF0000"){
        return getRandomColor();
    }else{
        return color;
    }
}
window.addEventListener("load", start, false);