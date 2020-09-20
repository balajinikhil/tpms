

const app = angular.module('loginApp',[]);
app.controller("loginController", function($scope, $http){

    $(document).ready(function(){

        $("#loginForm").validate({
            rules:{"email":{
                required:true,
                email:true
            },
            "password":{
                required:true,
                minlength:5
            }
        },
        messages:{
            "email":{
                required:"Please enter email"
            },
            "password":{
                required:"Please enter password",
            }
        },
        submitHandler:function(){
            $http.post("/login", $scope.User).then(res=>{
                const response = res.data;
                if(response.status === "success") window.location.href = response.redirect;
                
            }).catch(err=>{
                
                $("#err").show()
                $scope.errMsg = err.data.message

            })
        }
        }
        )
    })

})


