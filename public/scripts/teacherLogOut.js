const login = document.querySelector('.log-in')
const aLogin = document.querySelector('.login-a')

document.addEventListener('DOMContentLoaded', ()=>{

    aLogin.setAttribute('href', "/teacher/logout")
    login.innerHTML = `
    Logout `

})