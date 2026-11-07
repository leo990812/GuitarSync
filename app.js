const form=document.querySelector("#searchForm");
const input=document.querySelector("#songInput");
const instrument=document.querySelector("#instrument");
const results=document.querySelector("#searchResults");
const toast=document.querySelector("#toast");
let toastTimer;
function notify(message){
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);
}
function searchUrl(base,query){return base+encodeURIComponent(query)}
function renderSearchResults(song,kind){
  const q=song+" "+kind+" tab";
  const sources=[
    {name:"Songsterr",desc:"互動式 TAB、播放與速度控制",url:searchUrl("https://www.songsterr.com/?pattern=",q),tag:"INTERACTIVE TABS",mark:"S"},
    {name:"Ultimate Guitar",desc:"社群 TAB、和弦與不同編曲版本",url:searchUrl("https://www.ultimate-guitar.com/search.php?search_type=title&value=",song),tag:"COMMUNITY TABS",mark:"UG"},
    {name:"Google 搜尋",desc:"探索其他公開譜面與教學來源",url:searchUrl("https://www.google.com/search?q=",q),tag:"WEB DISCOVERY",mark:"↗"}
  ];
  const heading=document.createElement("div");
  heading.className="results-toolbar";
  const title=document.createElement("strong");
  title.textContent="「"+song+"」的搜尋入口";
  const count=document.createElement("small");
  count.textContent="3 SOURCES READY";
  heading.append(title,count);
  const grid=document.createElement("div");
  grid.className="result-grid";
  sources.forEach(source=>{
    const card=document.createElement("article");
    card.className="result-card";
    const top=document.createElement("div");
    top.className="result-topline";
    const mark=document.createElement("span");
    mark.className="source-mark";
    mark.textContent=source.mark;
    const tag=document.createElement("span");
    tag.className="source-type";
    tag.textContent=source.tag;
    top.append(mark,tag);
    const name=document.createElement("strong");
    name.textContent=source.name;
    const description=document.createElement("small");
    description.textContent=source.desc;
    const link=document.createElement("a");
    link.href=source.url;
    link.target="_blank";
    link.rel="noopener noreferrer";
    link.append(document.createTextNode("開啟 "+source.name));
    const arrow=document.createElement("b");
    arrow.textContent="↗";
    link.append(arrow);
    card.append(top,name,description,link);
    grid.append(card);
  });
  results.replaceChildren(heading,grid);
}
form.addEventListener("submit",event=>{
  event.preventDefault();
  const song=input.value.trim();
  if(!song)return;
  const kind=instrument.value==="bass"?"bass":"guitar";
  renderSearchResults(song,kind);
});
document.querySelector("#bpmSlider").addEventListener("input",event=>{
  document.querySelector("#bpmValue").textContent=event.target.value+" BPM";
});
document.querySelector("#loopToggle").addEventListener("change",event=>{
  document.querySelector("#loopStatus").textContent=event.target.checked
    ?"已開啟循環預覽。實際播放與段落定位功能將於後續版本加入。"
    :"循環功能預覽，播放同步將於後續版本加入。";
});
document.querySelector("#copyTab").addEventListener("click",async()=>{
  const tab=document.querySelector("#tabContent").textContent;
  try{
    await navigator.clipboard.writeText(tab);
    notify("TAB 已複製到剪貼簿");
  }catch{
    notify("瀏覽器未允許剪貼簿存取，請手動選取 TAB");
  }
});
