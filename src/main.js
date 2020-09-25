M.Tooltip.init(document.querySelectorAll('.tooltipped'),{});

const editableImg = document.querySelector(".editable");
const colorVal = document.querySelector(".value");
const colorBox = document.querySelector(".color");
const colorBoxFixed = document.querySelector(".color-box");
const copyBtn = document.querySelector(".copy");
const fileInput = document.querySelector("#file");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

fileInput.addEventListener("change", e => {
    let reader = new FileReader();
    reader.onload= function(evt){
        editableImg.setAttribute("src", evt.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
});
const ct = new ColorThief();

editableImg.addEventListener("mousemove", e => {
    canvas.style.opacity = 1;
    colorBox.style.opacity = 1;
    canvas.style.top = e.pageY-40+"px";
    canvas.style.left = e.pageX+40+"px";
    colorBox.style.top = e.pageY-40+"px";
    colorBox.style.left = e.pageX+82+"px";
    let scale = editableImg.naturalWidth/editableImg.width;
    
    ctx.drawImage(editableImg,e.offsetX*scale,e.offsetY*scale,40,40,0,0,40,40);
    let newImg = canvas.toDataURL();
    let img = new Image(40,40);
    img.src=newImg;
    img.onload = function(e){
        let color=ct.getColor(img);
        colorBox.style.backgroundColor=`rgb(${color[0]},${color[1]},${color[2]})`;
    }
});

editableImg.addEventListener("click", e => {
    colorVal.setAttribute("value",colorBox.style.backgroundColor)
    colorBoxFixed.style.backgroundColor=colorVal.getAttribute("value");
});

copyBtn.addEventListener("click", e => {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
            navigator.clipboard.writeText(colorVal.getAttribute("value"))
            .then( () => M.toast({html: "Copied to clipboard"}))
            .catch(err => M.toast({html: "Copied to clipboard"}));
        }
      });
})

//#region service worker
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("/serviceWorker.js")
    .then(reg => console.log("Service worker registered"))
    .catch(err => console.log("Service worker not registered"));
} else {
    console.log("Service worker not available");
}
//#endregion