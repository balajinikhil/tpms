const renderClass = document.querySelector(".renderClass");

const afterContentLoad = async () => {
  let data = [];
  let doneClass = [];

  //   GET DATA FROM API
  const call = await fetch("/api-v1/ppt")
    .then((dt) => dt.json())
    .then((dt) => {
      data = dt.ppts;
    })
    .catch((err) => console.log(err));

  //LOOP THROUGH DATA AND RENDER CLASS
  data.forEach((e) => {
    if (doneClass.includes(e.class)) {
      return;
    } else {
      renderClass.innerHTML += `
        <div class="item" style=" margin:15px; padding:3%">
          <div class="content">
              <div class="heading-tertiary">Class: ${e.class}</div>
              <a href="/select-class/${e.class}" style="margin-top:1%" class="description"> 
                <button class="ui primary right labeled icon button" id="select-btn">
                <i class="right arrow icon"></i>  
                Select
              </button>
              </a>
          </div>
        </div>
        <div class="ui section divider"></div>`;

      doneClass.push(e.class);
    }
  });
};
document.addEventListener("DOMContentLoaded", afterContentLoad);
