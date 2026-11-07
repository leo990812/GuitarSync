const form=document.querySelector("#searchForm");
const input=document.querySelector("#songInput");
const instrument=document.querySelector("#instrument");
const results=document.querySelector("#searchResults");
const toast=document.querySelector("#toast");
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400)}
function searchUrl(base,query){return base+encodeURIComponent(query)}
form.addEventListener("submit",event=>{
  event.preventDefault();
  const song=input.value.trim();
  if(!song)return;
  const kind=instrument.value==="bass"?"bass":"guitar";
  const q=song+" "+kind+" tab";
  const sources=[
    {name:"Songsterr",desc:"互動式吉他譜與播放",url:searchUrl("https://www.songsterr.com/?pattern=",q),tag:"INTERACTIVE TABS"},
    {name:"Ultimate Guitar",desc:"吉他 TAB、和弦與使用者譜面",url:searchUrl("https://www.ultimate-guitar.com/search.php?search_type=title&value=",song),tag:"COMMUNITY TABS"},
    {name:"Google 搜尋",desc:"搜尋更多公開譜面來源",url:searchUrl("https://www.google.com/search?q=",q),tag:"WEB SEARCH"}
  ];
  results.innerHTML='<div class="result-grid">'+sources.map(s=>'<article class="result-card"><span>'+s.tag+'</span><strong>'+s.name+'</strong><small>'+s.desc+'</small><a href="'+s.url+'" target="_blank" rel="noopener noreferrer">前往搜尋結果 ↗</a></article>').join("")+'</div>';
});
document.querySelector("#bpmSlider").addEventListener("input",e=>{document.querySelector("#bpmValue").textContent=e.target.value+" BPM"});
document.querySelector("#loopToggle").addEventListener("change",e=>{document.querySelector("#loopStatus").textContent=e.target.checked?"已開啟循環預覽。實際播放與段落定位功能將於後續版本加入。":"循環功能預覽，播放同步將於後續版本加入。"});
document.querySelector("#copyTab").addEventListener("click",async()=>{
  const tab=document.querySelector("#tabContent").textContent;
  try{await navigator.clipboard.writeText(tab);notify("TAB 已複製到剪貼簿");}
  catch{notify("瀏覽器未允許剪貼簿存取，請手動選取 TAB");}
});