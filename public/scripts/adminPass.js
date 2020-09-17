const form = document.querySelector('form')
const err = document.querySelector(".err")
err.style.display = "none"

form.addEventListener("submit", (e) => {
  err.style.display = "none"
  e.preventDefault();

  let pass = e.target.elements.password.value;
  if (pass.length < 3 || pass.length > 12) {
    
    err.style.display = "block"
    err.innerHTML = `
    <i class="close icon"></i> Password length doesn't match
    <div class="header">
    </div>
    <p> 
      Length must be greater than 3 and less than 12
    </p>

    `


    return false;
  } else {
    form.submit();
  }
});


