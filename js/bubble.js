

var select_bubble = [];
var select_bubble_add = [];
var bubble_list = [];
var bubble_list_add = [];
var circles;
var names;
var images;
var color2 = d3.scale.category20();
var nodes = [];
var force;
var all_company_name = [];
var ticktimes = 0;


function sendBubble(){

    bubble_list = bubble_list.concat(select_bubble);
    bubble_list_add = bubble_list_add.concat(select_bubble_add);
    function sortBubble(a, b){
        var tempA = a.idx;
        var tempB = b.idx;
        if(tempA < tempB) return -1;
        if(tempA > tempB) return 1;
        if(tempA == tempB) return 0;
    }
    bubble_list.sort(sortBubble);

    for(var j = 0; j < select_bubble.length;j++){ 
        d3.select(select_bubble_add[j]).transition()
                    .duration(750)     
                    .ease("cubic-in")  
                    // .attr("xlink:href", "img/black.png")
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("x", 380)
                    .attr("y", 570)
                    .each('start',function(it){
                        it.r = 0;
                    });

        for(var k = 0; k < nodes.length; k++){
            if(nodes[k].company == select_bubble[j].company){
                nodes.splice(k,1);  
                images[0].splice(k,1);
            }
        }
    }
    select_bubble_add = [];
    select_bubble = [];
}  

function dragstart(d, i) {
            
}

function dragmove(d, i) {
    force.stop(); 
    d.px += d3.event.dx;
    d.py += d3.event.dy;
    d.x += d3.event.dx;
    d.y += d3.event.dy; 
    d.fixed = true; 
    tick(); 
    force.resume();
}

function dragend(d, i) {
    d.fixed = false;
    tick();
    force.resume();
    
}

function clicked(d, i){
    if (d3.event.defaultPrevented) return; // dragged
    if(!(d.selected)){
        d3.select(this).transition()
        .duration(700)    
        .ease("bounce")
        .attr("width", d.r * 1.5 * 2)
        .attr("height", d.r * 1.5 * 2)
        .each("start",function(){
            d.r *= 1.5;
        });
        d.selected = true;

        for(var j = 0; j < nodes.length; j++){
            if(nodes[j].idx == d.idx){
                select_bubble.push(nodes[j]);
            }
        }
        select_bubble_add.push(this);
    }else{
        d3.select(this).transition()
        .duration(700)    
        .ease("bounce")
        .attr("width", d.r / 1.5 * 2)
        .attr("height", d.r / 1.5 * 2)
        .each("start",function(){
            d.r /= 1.5;
        });
        d.selected = false;
        for(var j = 0; j < select_bubble.length; j++){
            if(d.idx == select_bubble[j].idx){
                select_bubble.splice(j,1);
                select_bubble_add.splice(j,1);
            }
        }
    }
}

function mouseEnter(d, i){
    d.name = d.company;
}

function mouseLeave(d, i){
    d.name = "";
}

function tick() { // tick 會不斷的被呼叫
            
    // circles.attr({
    // cx: function(it) { return it.x; },  // it.x 由 Force Layout 提供
    // cy: function(it) { return it.y; },  // it.y 由 Force Layout 提供
    // r: function(it) { return it.r; },
    // idx: function(it) { return it.idx; },
    // fill: function(it) { return color2(it.idx);} 
    // });
    ticktimes++;

    images.attr({
        x: function(it){ return it.x;},
        y: function(it){ return it.y ;},
        width: function(it) {return it.r*2;},
        height: function(it) {return it.r*2;},
    });

    names.attr({
        x: function(it){ return it.x;},
        y: function(it){ return it.y;}
    }).text(function(it){return it.name});

    if(ticktimes == 298){
        ticktimes = 0;
        force.alpha(0.1);
    }

}
function showBubble(){


             
    d3.csv("data/data4.csv", function(d) {
        
        
        var c = 0;
        for(var i in d[0]){
            nodes[c] = {};
            nodes[c].r = 20;
            nodes[c].idx = c;
            nodes[c].company = i;
            nodes[c].selected = false;
            nodes[c].img = "img/" + i + ".png";
            nodes[c].name = "";
            all_company_name[c] = i;
            c++;

        }
        
        var node_drag = d3.behavior.drag()
            .on("dragstart", dragstart)
            .on("drag", dragmove)
            .on("dragend", dragend);

        // circles = d3.select("svg").selectAll("circle")
        //                         .data(nodes)
        //                         .enter()
        //                         .append("circle")
        //                         .attr("stroke", "black");
                                

        
        images = d3.select("svg").selectAll("image")
                                .data(nodes)
                                .enter()
                                .append("image")
                                .attr("xlink:href",  function(it) { return it.img;})
                                .attr("image-anchor", "middle")
                                .call(node_drag)
                                .on("click",clicked)
                                .on("mouseenter", mouseEnter)
                                .on("mouseleave", mouseLeave);
        
        names = d3.select("svg").selectAll("text")
                                .data(nodes)
                                .enter()
                                .append("text")
                                .attr("text-anchor", "middle")
                                .attr("x", function(it){return it.x;})
                                .attr("y", function(it){return it.y;})
                                .attr("fill", "black")
                                .text(function(it){return it.name;});

                                
        force = d3.layout.force() // 建立 Layout
            .nodes(nodes)               // 綁定資料
            .size([800,600])            // 設定範圍
            .gravity(0.1)
            .charge(-300)
            .on("tick", tick)           // 設定 tick 函式
            .start()                   // 啟動！
            .alpha(0.1);
    });
     
}