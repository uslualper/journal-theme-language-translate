/*
    To use this service, you must start a service on localhost
*/

var langs = ['en','tr','ar','ru','de','es','fr'];// example language array

$(document).on('dblclick','.ui-input.input-large',function(){
    if($(this).next('.lang-flag').find('img').attr('alt')=='English'){
        let sentece = false;  
        $(this).parents('.field-option').find('input').each(function(index,item){    
            if(index!=0 && sentece){           
                translate({sentence:sentece,lang:langs[index],index:index},(res)=>{                               
                    $(item).after(`<p>${$(item).val()}</p>`);
                    writeText(item,res,reactTrigger(item,res));                      
                });                      
            }else{
                sentece=$(item).val();
            }
        });     
    } 
});

function writeText(input,text,callback){
    input.select(); // you can also use input.focus()
    input.value="";
    var l=text.length;
    var current = 0;
    var time = 10;

    var write_text = function() {
        input.value+=text[current];
        if(current < l-1) {
            current++;
            setTimeout(function(){write_text()},time);
        } else {
            input.setAttribute('value',input.value);
            if(callback)callback();   
        }
    }
    setTimeout(function(){write_text()},time);
}

function reactTrigger(input,value){ // for react.js component    
    let lastValue = input.value;
    input.value = value;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

function translate(options,callback) {
    setTimeout(function(){
        $.ajax({
            url:"http://localhost:8080/",  
            data:{sentence:options.sentence,lang:options.lang},
            async:false,
            success:function(data) {
            callback(data); 
            },
            error:function(){
                alert('Error!')
            }
        });
    },500*options.index+(options.sentence.length*10)); 
}
  
  
