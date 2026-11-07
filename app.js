const form=document.querySelector("#searchForm"),input=document.querySelector("#songInput"),instrument=document.querySelector("#instrument"),results=document.querySelector("#searchResults"),editor=document.querySelector("#tabEditor"),toast=document.querySelector("#toast");
let timer,ctx,metro,beat=0,metroOn=false;const demo=editor.value;
function notify(t){toast.textContent=t;toast.classList.add("show");clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove("show"),2300)}
function val(v,f="未提供"){return v==null||v===""?f:String(v)}
function message(title,detail){const box=document.createElement("div");box.className="empty-state";const h=document.createElement("strong");h.textContent=title;const p=document.createElement("small");p.textContent=detail;box.append(h,p);results.replaceChildren(box)}
function detail(song){
 const p=document.createElement("article");p.className="song-detail panel";const head=document.createElement("div");head.className="results-toolbar";
 const title=document.createElement("strong");title.textContent=val(song.title,"未知歌曲");const tag=document.createElement("small");tag.textContent="SONGSTERR CATALOGUE";head.append(title,tag);
 const artist=document.createElement("p");artist.className="song-artist";artist.textContent="演出者："+val(song.artist?.name||song.artist);
 const label=document.createElement("strong");label.className="detail-label";label.textContent="可用音軌";
 const tracks=document.createElement("div");tracks.className="track-chips";
 (song.tracks||[]).forEach(t=>{const chip=document.createElement("span");chip.textContent=[t.instrument,t.name].filter(Boolean).join(" · ")||val(t);tracks.append(chip)});
 if(!tracks.childNodes.length){const chip=document.createElement("span");chip.textContent="API 未提供音軌資訊";tracks.append(chip)}
 const note=document.createElement("p");note.className="tab-source-notice";note.textContent="這是 Songsterr 公開 API 的曲目資料，不包含 TAB 音符內容。Songsterr 沒有提供可供本站直接顯示完整譜面的公開授權 API，因此不會把外站頁面假裝成本站譜面。";
 const actions=document.createElement("div");actions.className="detail-actions";
 const use=document.createElement("button");use.className="primary-btn";use.type="button";use.textContent="在工作台建立自己的 TAB";
 use.addEventListener("click",()=>{document.querySelector("#tabName").value=val(song.title,"Untitled TAB");document.querySelector("#tabTitle").textContent=val(song.title,"Untitled TAB");document.querySelector("#workspace").scrollIntoView({behavior:"smooth"});notify("歌曲名稱已帶入，請匯入或輸入可使用的譜面")});
 const link=document.createElement("a");link.className="source-link";link.href="https://www.songsterr.com/a/wa/song?id="+encodeURIComponent(song.id);link.target="_blank";link.rel="noopener noreferrer";link.textContent="前往官方來源（選用） ↗";
 actions.append(use,link);p.append(head,artist,label,tracks,note,actions);results.replaceChildren(p);
}
async function search(query,kind){
 message("正在搜尋曲目…","正在取得 Songsterr 公開曲目資料。");
 try{
  const res=await fetch("https://www.songsterr.com/api/songs?pattern="+encodeURIComponent(query)+"&size=20",{headers:{Accept:"application/json"}});
  if(!res.ok)throw Error("HTTP "+res.status);
  const data=await res.json();const all=Array.isArray(data)?data:(data.songs||data.results||[]);
  const songs=all.filter(song=>{const ts=song.tracks||[];return !ts.length||ts.some(t=>kind==="bass"?/bass/i.test((t.instrument||"")+" "+(t.name||"")):/guitar/i.test((t.instrument||"")+" "+(t.name||"")))});
  if(!songs.length){message("沒有找到符合的曲目","請試試英文歌名或藝人名稱。");return}
  const head=document.createElement("div");head.className="results-toolbar";const label=document.createElement("strong");label.textContent="搜尋結果："+query;const count=document.createElement("small");count.textContent=songs.length+" TRACKS";head.append(label,count);
  const grid=document.createElement("div");grid.className="result-grid";
  songs.forEach(song=>{const card=document.createElement("article");card.className="result-card";const name=document.createElement("strong");name.textContent=val(song.title,"未知歌曲");const artist=document.createElement("small");artist.textContent=val(song.artist?.name||song.artist,"未知演出者");const ts=document.createElement("small");ts.textContent=(song.tracks||[]).map(t=>t.instrument||t.name).filter(Boolean).join(" · ")||"音軌資訊未提供";const btn=document.createElement("button");btn.type="button";btn.className="in-app-result";btn.textContent="在 GuitarSync 查看";btn.addEventListener("click",()=>detail(song));card.append(name,artist,ts,btn);grid.append(card)});
  results.replaceChildren(head,grid);
 }catch(e){message("目前無法取得線上曲目資料","Songsterr API 連線失敗或受到瀏覽器跨網域限制。這次不會自動跳轉外站，請稍後重試。")}
}
form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();if(q)search(q,instrument.value==="bass"?"bass":"guitar")});
const bpm=document.querySelector("#bpmSlider");bpm.addEventListener("input",()=>{document.querySelector("#bpmValue").textContent=bpm.value+" BPM";if(metroOn)restartMetro()});
document.querySelector("#loopToggle").addEventListener("change",e=>document.querySelector("#loopStatus").textContent=e.target.checked?"循環模式已開啟。":"循環模式已關閉。");
function validate(){const lines=editor.value.split(/\r?\n/).filter(x=>x.trim()),strings=lines.filter(x=>/^\s*[eEbBgGdDaA][#b]?\s*\|/.test(x));document.querySelector("#lineCount").textContent=strings.length?strings.length+" STRINGS":"TEXT TAB";document.querySelector("#tabValidation").textContent=strings.length>=4?"偵測到 "+strings.length+" 條弦線":"文字譜面";document.querySelector("#tabState").textContent="未儲存變更"}
editor.addEventListener("input",validate);
document.querySelector("#tabName").addEventListener("input",e=>document.querySelector("#tabTitle").textContent=e.target.value||"Untitled TAB");
document.querySelector("#tabTuning").addEventListener("change",e=>document.querySelector("#tuningLabel").textContent=e.target.selectedOptions[0].textContent.split(" · ")[0]);
document.querySelector("#loadDemo").addEventListener("click",()=>{editor.value=demo;document.querySelector("#tabName").value="Example Riff";document.querySelector("#tabTitle").textContent="Example Riff";validate();notify("已載入示範 TAB")});
document.querySelector("#clearTab").addEventListener("click",()=>{editor.value="";validate();notify("編輯器已清空")});
document.querySelector("#copyTab").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(editor.value);notify("TAB 已複製")}catch{editor.focus();editor.select();notify("請按 Ctrl+C 複製")}});
document.querySelector("#tabFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;if(f.size>1048576){notify("檔案需小於 1 MB");return}editor.value=await f.text();document.querySelector("#tabName").value=f.name.replace(/\.(txt|tab)$/i,"");document.querySelector("#tabTitle").textContent=document.querySelector("#tabName").value;validate();notify("譜面已匯入")});
document.querySelector("#downloadTab").addEventListener("click",()=>{const u=URL.createObjectURL(new Blob([editor.value],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");a.href=u;a.download=(document.querySelector("#tabName").value||"guitarsync-tab")+".txt";a.click();URL.revokeObjectURL(u);notify("已匯出 TXT")});
function library(){try{return JSON.parse(localStorage.getItem("guitarsync-tabs")||"[]")}catch{return []}}
function refresh(){const list=library(),sel=document.querySelector("#savedTabs");sel.replaceChildren(new Option("選擇已儲存譜面",""));list.forEach((x,i)=>sel.add(new Option(x.name+" · "+x.date,i)));document.querySelector("#savedCount").textContent=list.length+" 首"}
document.querySelector("#saveTab").addEventListener("click",()=>{const name=document.querySelector("#tabName").value.trim()||"Untitled TAB",list=library(),item={name,text:editor.value,tuning:document.querySelector("#tabTuning").value,meter:document.querySelector("#timeSignature").value,date:new Date().toLocaleDateString("zh-TW")},at=list.findIndex(x=>x.name===name);if(at>=0)list[at]=item;else list.unshift(item);try{localStorage.setItem("guitarsync-tabs",JSON.stringify(list.slice(0,50)));refresh();document.querySelector("#tabState").textContent="已儲存於本機";notify("已儲存到本機譜面庫")}catch{notify("儲存空間不足，請匯出 TXT")}});
document.querySelector("#savedTabs").addEventListener("change",e=>{if(e.target.value==="")return;const x=library()[Number(e.target.value)];if(!x)return;editor.value=x.text;document.querySelector("#tabName").value=x.name;document.querySelector("#tabTitle").textContent=x.name;document.querySelector("#tabTuning").value=x.tuning;document.querySelector("#timeSignature").value=x.meter;document.querySelector("#tabTuning").dispatchEvent(new Event("change"));validate();document.querySelector("#tabState").textContent="已從本機載入"});
function tick(){if(!ctx)ctx=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==="suspended")ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=beat===0?1100:760;g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.15,ctx.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.08);o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+.09);document.querySelector("#beatNumber").textContent=beat+1;beat=(beat+1)%Number(document.querySelector("#timeSignature").value)}
function restartMetro(){clearInterval(metro);metro=setInterval(tick,60000/Number(bpm.value))}
function stopMetro(){clearInterval(metro);metro=null;metroOn=false;document.querySelector("#metronomeToggle").textContent="啟動節拍器"}
document.querySelector("#metronomeToggle").addEventListener("click",()=>{if(metroOn){stopMetro();return}metroOn=true;beat=0;tick();restartMetro();document.querySelector("#metronomeToggle").textContent="停止節拍器"});
document.querySelector("#timeSignature").addEventListener("change",()=>beat=0);window.addEventListener("pagehide",stopMetro);refresh();validate();
