let ua=true
const T={
ua:{status:"Статус",online:"У мережі",time:"Час",quote:"Цитата",q:"Фокус. Розвиток. Повтор.",about:"Про мене",a:"Навчаюсь у коледжі на комп’ютерного інженера.<br>Займаюсь ремонтом та обслуговуванням ПК-техніки."},
en:{status:"Status",online:"Online",time:"Time",quote:"Quote",q:"Focus. Improve. Repeat.",about:"About me",a:"College student in computer engineering.<br>PC repair and maintenance."}
}
const hs=document.getElementById("h-status"),ts=document.getElementById("t-status"),ht=document.getElementById("h-time"),hq=document.getElementById("h-quote"),tq=document.getElementById("t-quote"),ha=document.getElementById("h-about"),ta=document.getElementById("t-about"),b=document.getElementById("lang"),tm=document.getElementById("time")
function apply(){const l=ua?T.ua:T.en;hs.textContent=l.status;ts.textContent=l.online;ht.textContent=l.time;hq.textContent=l.quote;tq.textContent=l.q;ha.textContent=l.about;ta.innerHTML=l.a;b.textContent=ua?"EN":"UA"}
apply()
b.onclick=()=>{ua=!ua;apply()}
setInterval(()=>{const d=new Date();tm.textContent=d.toLocaleTimeString()+" • "+d.toLocaleDateString()},1000)
