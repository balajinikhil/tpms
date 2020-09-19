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
    console.log(res);
  })
  
}

const formTag = document.querySelector('#issueForm');
formTag.addEventListener('submit', submitForm );

const yesBtn = document.querySelector('#issueSubmit');
yesBtn.addEventListener('click', submitForm);