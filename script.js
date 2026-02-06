const T={ua:{status:"Статус",online:"У мережі",quote:"Фокус. Розвиток. Повтор.",about:"Навчаюсь у коледжі на комп’ютерного інженера.<br>Займаюсь ремонтом та обслуговуванням ПК-техніки."},en:{status:"Status",online:"Online",quote:"Focus. Improve. Repeat.",about:"College student in computer engineering.<br>PC repair and maintenance."}}
let L="ua"
const S=document.getElementById("status"),Q=document.getElementById("quote"),A=document.getElementById("about"),TM=document.getElementById("time"),B=document.getElementById("lang")
function render(){S.innerHTML=`<h2>${T[L].status}</h2><p><span class="on"></span>${T[L].online}</p>`;Q.innerHTML=`<h2>Quote</h2><p>${T[L].quote}</p>`;A.innerHTML=`<h2>About</h2><p>${T[L].about}</p>`;B.textContent=L==="ua"?"EN":"UA"}
render()
B.onclick=()=>{L=L==="ua"?"en":"ua";render()}
setInterval(()=>{const d=new Date();TM.innerHTML=`<h2>Time</h2><p>${d.toLocaleTimeString()} • ${d.toLocaleDateString()}</p>`},1000)

const c=document.getElementById("p"),x=c.getContext("2d");let w,h,dots=[]
function rs(){w=c.width=innerWidth;h=c.height=innerHeight}
rs();onresize=rs
for(let i=0;i<80;i++)dots.push({x:Math.random()*w,y:Math.random()*h,v:Math.random()+.3})
setInterval(()=>{x.clearRect(0,0,w,h);x.fillStyle="#5865f2";dots.forEach(o=>{o.y+=o.v;o.y>h&&(o.y=0);x.beginPath();x.arc(o.x,o.y,1.3,0,7);x.fill()})},30)
