

var select_bubble = [];
var select_bubble_add = [];
var bubble_list = [];
var bubble_list_add = [];
var circles;
var names;
var color2 = d3.scale.category20();
var nodes = [];
var force;
var all_company_name = [];


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
                    .attr("fill", "black")
                    .attr("r", 0)
                    .attr("cx", 400)
                    .attr("cy", 590)
                    .each('start',function(it){
                        it.r = 0;
                        
                    });

        for(var k = 0; k < nodes.length; k++){
            if(nodes[k].company == select_bubble[j].company){
                nodes.splice(k,1);  
                circles[0].splice(k,1);
            }
        }
        
        select_bubble[j].company = "";
        names.text(function(it){ return it.company});
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
        .duration(400)    
        .ease("bounce")
        .attr("r", d.r * 1.5)
        .each('start',function(){
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
        .duration(400)    
        .ease("bounce")   
        .attr("r", d.r / 1.5)
        .each('start',function(){
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

function tick() { // tick 會不斷的被呼叫
            
    circles.attr({
    cx: function(it) { return it.x; },  // it.x 由 Force Layout 提供
    cy: function(it) { return it.y; },  // it.y 由 Force Layout 提供
    r: function(it) { return it.r; },
    idx: function(it) { return it.idx; },
    fill: function(it) { return color2(it.idx);} 
    });
    names.attr({
        x: function(it){ return it.x;},
        y: function(it){ return it.y+5;},
    }).text(function(it){return it.company});
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
            all_company_name[c] = i;
            c++;

        }
        
        var node_drag = d3.behavior.drag()
            .on("dragstart", dragstart)
            .on("drag", dragmove)
            .on("dragend", dragend);

        circles = d3.select("svg").selectAll("circle")
                                .data(nodes)
                                .enter()
                                .append("circle")
                                .call(node_drag)
                                .on("click",clicked);

        names = d3.select("svg").selectAll("text")
                                .data(nodes)
                                .enter()
                                .append("text")
                                .attr({
                                    x: function(it) { return it.x; },
                                    y: function(it) { return it.y; },
                                    idx: function(it){ return it.idx},
                                    "text-anchor": "middle",                    
                                }).text(function(it) { return it.company; });

        
        force = d3.layout.force() // 建立 Layout
            .nodes(nodes)               // 綁定資料
            .size([800,600])            // 設定範圍
            .distance(30)
            .gravity(0.1)
            .charge(-300)
            .on("tick", tick)           // 設定 tick 函式
            .start();                   // 啟動！
    });
     
}