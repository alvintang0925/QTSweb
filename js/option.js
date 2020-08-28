function selectALL(){
    for(var j = 0; j < box.length; j++){
        box[j].checked = true;
    }
}

function resetAll(){
    for(var j = 0; j < box.length; j++){
        box[j].checked = false;
    }
}

function setAll(){
    var n = parseInt(document.getElementById("select_number").value);
    for(var j = 0; j < n; j++){
        box[j].checked = true;
    }
}

function temp(fn, c){
    if(c<count_f){
        d3.csv(fn, function(d){
                data = data.concat(d);
                c++;
                temp(filename[c],c);
        });
    }
}

var filename = [];
var count_f = 0;

function preset(){
    data = [];
    data_list = [];
    data_list_count = 0;
    filename = [];
    count_f = 0;
    var start_month = document.getElementById("start_month").value;
    var end_month = document.getElementById("end_month").value;
    start_month = start_month.split("-");
    end_month = end_month.split("-");
    var current_month = start_month;
    var date_switch = true;

    while(date_switch){
        if((current_month[0] >= end_month[0] && current_month[1] > end_month[1])){
            date_switch = false;
        }else{
            filename[count_f] = "DJI_30/M2M/train_" + current_month[0] + "_" + current_month[1] + "(" + current_month[0] + " Q1).csv";
            count_f++;
            var m = parseInt(current_month[1])
            if(m < 12){
                m++;
                if(m < 10){
                    current_month[1] = "0" + m.toString();
                }else{
                    current_month[1] = m.toString();
                }
            }else{
                m = parseInt(current_month[0])+1;
                current_month[0] = m.toString();
                m = 1;
                current_month[1] = "0" + m.toString();
            }
        }
    }
    
    temp(filename[0], 0, data)
    
    var se = count_f * 50;
    setTimeout(countFunds,se);
}