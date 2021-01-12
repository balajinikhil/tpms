const whichClass = document.querySelector(".clasz").innerHTML;
const renderAcc = document.querySelector(".renderAcc");
// const sel = document.querySelector(".sel");
const btn = document.querySelector("#selectLang");
const selLang = document.querySelector(".selLang");
const sele = document.querySelector(".sele");

let data = [];
let lang = [];

document.addEventListener("DOMContentLoaded", async (e) => {
  const dt = await fetch(`/api-v1/sel-class/${whichClass}`)
    .then((dt) => dt.json())
    .then((dt) => (data = dt.ppts))
    .catch((err) => console.log(err));

  data.forEach((e) => {
    if (lang.includes(e.language)) {
      return;
    } else {
      lang.push(e.language);
    }
  });

  lang.forEach((e) => {
    var el = document.createElement("option");
    el.textContent = e;
    el.value = e;
    sele.appendChild(el);
  });

  renderAcc.innerHTML = `
  
  <div class="ui icon message" style="margin-top:2%">
  <i class="notched circle loading icon"></i>
  <div class="content">
    <div class="header">
      Please Select Your Language
    </div>
    <p></p>
  </div>
</div>

  
  
  `;
});

const langSelected = () => {
  console.log(data);
  renderAcc.innerHTML = "";

  data.forEach((e) => {
    if (sele.value === e.language) {
      renderAcc.innerHTML += `
      <div class="item pptDetails" style="margin-top:2%">
        <i class="large file powerpoint middle aligned icon"></i>
        <div class="content">
          <h3 class="ui header">Teacher: ${e.name}</h3>
          <div class="description">
          <p>View: <a href="/view-ppt-live/${e.ppt}">Link</a>
          <p>Download: <a href="/teacherUploads/${e.ppt}">${e.ppt}</a></p>
          </div>
        </div>      
      </div>


      `;
    }
  });

  if (renderAcc.innerHTML == "") {
    renderAcc.innerHTML = "<p>No PPT available for that language</p>";
  }
};

btn.addEventListener("click", langSelected);
