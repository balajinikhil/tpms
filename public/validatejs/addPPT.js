$(document).ready(function(){
    $("#addPPT").validate({
        rules:{
            "name":{
                required:true
            },
            "email":{
                required:true
            },
            "class":{
                required:true,
            },
            "language":{
                required:true
            },
            "notes":{
                required:true
            }

        },
        messages:{
            "name":{
                required:"please enter name"
            },
            "email":{
                required:"please enter email"
            },
            "class":{
                required:"please enter class"
            },
            "language":{
                required:"please select language"
            },
            "notes":{
                required:"please add some notes"
            }
        }
    })
})