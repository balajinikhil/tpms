$(document).ready(function(){

    $('#singup-form').validate({
        rules:{
            "name":{
                required:true
            },
            "email":{
                required:true,
                email:true
            },
            "phone":{
                required:true,
                minlength:10,
                maxlenght:10
            },
            "designation":{
                required:true
            },
            "school":{
                required:true
            },
            "password":{
                required:true,
                minlength:5
            },
            "passwordConfirm":{
                required:true,
                minlength:5
            }
        },
        messages:{
            "name":{
                required:"please enter name"
            },
            "email":{
                required:"please enter email"
            },
            "phone":{
                required:"please enter phone number"
            },
            "designation":{
                required:"please enter designation"
            },
            "school":{
                required:"please enter school"
            },
            "password":{
                required:"please enter password"
            },
            "passwordConfirm":{
                required:"please confirm password"
            }
        }
    },
    
    )
})