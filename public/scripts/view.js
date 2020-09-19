const report = document.querySelector('#report');
report.addEventListener('click', (e)=>{
    
    $('.ui.basic.modal')
  .modal('show')
;
})

const submitForm = async (e)=>{

  const obj = {
    ppt:document.querySelector('input[name="ppt"]').value,
    message:document.querySelector('input[name="message"]').value
  }
  e.preventDefault();

  console.log(obj);

    fetch('/issues', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  }).then((res)=>{
  })
  
}

const formTag = document.querySelector('#issueForm');
formTag.addEventListener('submit', submitForm );

const yesBtn = document.querySelector('#issueSubmit');
yesBtn.addEventListener('click', submitForm);

const dislike = document.querySelector(".like");
const dislikeno = document.querySelector("#dislikeno");
const ppt = document.querySelector('input[name="ppt"]')

dislike.addEventListener('click', 

async()=>{

  fetch(`/dislike/${ppt.value}`).then(res=>res.json()).then((res)=>{

    console.log(ppt);

    if (res.status === "error"){
      return
    }else{
      dislikeno.innerHTML = res.dislike
    }

  }).catch(err=>{

    console.log(err);

  })

})