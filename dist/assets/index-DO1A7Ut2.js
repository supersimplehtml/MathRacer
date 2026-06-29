(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(e){this.root=e,this.currentScene=null}changeScene(e){this.currentScene&&this.currentScene.destroy&&this.currentScene.destroy(),this.root.innerHTML=``,this.currentScene=e,this.currentScene.render(this.root)}};function t(e){(!e||e.length===0)&&(e=[1]);let t=e[Math.floor(Math.random()*e.length)],r=Math.floor(Math.random()*10)+1,i=`${t} × ${r}`,a=t*r,o=new Set;for(o.add(a);o.size<4;){let e=a+(Math.floor(Math.random()*10)-5);o.add(e)}return{question:i,correct:a,options:n([...o])}}function n(e){return e.sort(()=>Math.random()-.5)}var r=class{constructor(e,t,n){this.sceneManager=e,this.root=null,this.tables=t,this.car=n||{speed:2.2},this.gameOver=!1,this.stats={startTime:null,correct:0,wrong:0},this.finishLine=11e3,this.scale=Math.min(window.innerWidth/1400,1),this.carWidth=Math.max(40,Math.min(65,window.innerWidth*.045)),this.carHeight=this.carWidth*1.6,this.roadHeight=Math.max(220,Math.min(320,window.innerHeight*.32));let r=this.roadHeight/4,i=2.2;this.cars={player:{x:0,y:r*1.5,speed:i},ai1:{x:0,y:r*.5,speed:i},ai2:{x:0,y:r*2.5,speed:i},ai3:{x:0,y:r*3.5,speed:i}},this.car.speed=i,this.aiBoostTimer=0,this.question=null}render(e){this.root=e;let t=document.createElement(`div`);t.style.width=`100vw`,t.style.height=`100vh`,t.style.overflow=`hidden`,t.style.background=`#111`,t.style.fontFamily=`Arial`,t.style.position=`relative`,t.innerHTML=`
      <!-- WORLD -->
      <div id="world" style="
        position:absolute;
        top:0;
        left:0;
        width:12000px;
        height:100vh;
        background: linear-gradient(#3cb043, #2e8b57);
      ">

        <!-- ROAD -->
        <div id="track" style="
          position:absolute;
          top:50%;
          transform: translateY(-50%);
          left:0;
          width:12000px;
         height:${this.roadHeight}px;
          background:#2c2c2c;
          border-top:5px solid white;
          border-bottom:5px solid white;
        ">

          <!-- lanes -->
          <div style="position:absolute;top:${this.roadHeight*.25}px; width:100%; height:2px;
            background: repeating-linear-gradient(90deg, white, white 20px, transparent 20px, transparent 40px);"></div>

          <div style="position:absolute; top:${this.roadHeight*.5}px; width:100%; height:2px;
            background: repeating-linear-gradient(90deg, white, white 20px, transparent 20px, transparent 40px);"></div>

          <div style="position:absolute; top:${this.roadHeight*.75}px; width:100%; height:2px;
            background: repeating-linear-gradient(90deg, white, white 20px, transparent 20px, transparent 40px);"></div>

          <!-- cars -->
         <!-- Cars -->
<img id="player" class="car" src="src/assets/playercar.png">

<img id="ai1" class="car" src="src/assets/aicar.png">

<img id="ai2" class="car" src="src/assets/aicar.png">

<img id="ai3" class="car" src="src/assets/aicar.png">

          <!-- FINISH -->
          <div id="finish" style="
            position:absolute;
            top:50%;
            transform: translateY(-50%);
            left:11000px;
           width:${Math.max(50,this.scale*80)}px;
height:${this.roadHeight}px;
font-size:${Math.max(30,this.scale*40)}px;
            background: repeating-linear-gradient(
              45deg,
              white,
              white 10px,
              black 10px,
              black 20px
            );
            display:flex;
            align-items:center;
            justify-content:center;
           
          ">🏁</div>

        </div>
      </div>
<!-- HUD -->
<div style="
  position:absolute;
  bottom:0;
  left:0;
  width:100%;
  background:rgba(0,0,0,0.92);
  color:white;
  padding:clamp(12px,3vw,30px);
  box-sizing:border-box;
  text-align:center;
">

  <h1 id="qbox" style="
      margin:0 0 25px 0;
      font-size:clamp(28px,5vw,60px);
      font-weight:900;
      letter-spacing:2px;
      color:#FFD700;
      text-shadow:
        0 0 10px #ffae00,
        0 0 20px #ffae00,
        3px 3px 0 #000;
  ">
  </h1>

  <div id="options" style="
      display:flex;
      justify-content:center;
      gap:clamp(10px,2vw,20px);
      flex-wrap:wrap;
  "></div>

</div>
    `,e.appendChild(t),this.el={world:t.querySelector(`#world`),player:t.querySelector(`#player`),ai1:t.querySelector(`#ai1`),ai2:t.querySelector(`#ai2`),ai3:t.querySelector(`#ai3`),qbox:t.querySelector(`#qbox`),options:t.querySelector(`#options`)},[this.el.player,this.el.ai1,this.el.ai2,this.el.ai3].forEach(e=>{e.style.position=`absolute`,e.style.width=this.carWidth+`px`,e.style.height=this.carHeight+`px`,e.style.objectFit=`contain`,e.style.transform=`translate(-50%, -50%) rotate(90deg)`,e.style.transformOrigin=`center center`,e.style.userSelect=`none`,e.draggable=!1}),this.nextQuestion(),this.startCountdown(()=>{this.stats.startTime=Date.now(),this.loop()}),window.addEventListener(`resize`,()=>{this.scale=Math.min(window.innerWidth/1400,1),this.carWidth=Math.max(40,Math.min(65,window.innerWidth*.045)),this.carHeight=this.carWidth*1.6,[this.el.player,this.el.ai1,this.el.ai2,this.el.ai3].forEach(e=>{e.style.width=this.carWidth+`px`,e.style.height=this.carHeight+`px`})})}startCountdown(e){let t=document.createElement(`div`);t.style.position=`absolute`,t.style.top=`0`,t.style.left=`0`,t.style.width=`100vw`,t.style.height=`100vh`,t.style.display=`flex`,t.style.alignItems=`center`,t.style.justifyContent=`center`,t.style.fontSize=`clamp(70px,18vw,140px)`,t.style.color=`white`,t.style.background=`rgba(0,0,0,0.6)`,t.style.zIndex=`999`,document.body.appendChild(t);let n=3,r=setInterval(()=>{n>0?t.innerText=n:n===0?t.innerText=`GO!`:(clearInterval(r),t.remove(),e()),n--},1e3)}loop(){let e=()=>{this.update(),requestAnimationFrame(e)};e()}update(){this.gameOver||(this.move(this.cars.player),this.move(this.cars.ai1),this.move(this.cars.ai2),this.move(this.cars.ai3),this.aiBoostTimer++,this.aiBoostTimer>=400&&(this.aiBoostTimer=0,this.cars.ai1.speed=4.5,this.cars.ai2.speed=4.2,this.cars.ai3.speed=4.7,setTimeout(()=>{this.cars.ai1.speed=2.1,this.cars.ai2.speed=2.2,this.cars.ai3.speed=2.1},1e3)),Math.random()<.002&&(this.cars.player.speed=this.car.speed+2,setTimeout(()=>{this.cars.player.speed=this.car.speed},800)),this.renderPositions(),this.renderCamera(),this.checkWin())}move(e){e.x+=e.speed}renderCamera(){let e=window.innerWidth*.25,t=this.cars.player.x-e;this.el.world.style.transform=`translateX(${-t}px)`}renderPositions(){this.el.player.style.left=this.cars.player.x+`px`,this.el.player.style.top=this.cars.player.y+`px`,this.el.ai1.style.left=this.cars.ai1.x+`px`,this.el.ai1.style.top=this.cars.ai1.y+`px`,this.el.ai2.style.left=this.cars.ai2.x+`px`,this.el.ai2.style.top=this.cars.ai2.y+`px`,this.el.ai3.style.left=this.cars.ai3.x+`px`,this.el.ai3.style.top=this.cars.ai3.y+`px`}nextQuestion(){this.question=t(this.tables),this.el.qbox.innerText=`${this.question.question} = ?`,this.el.options.innerHTML=``,this.question.options.forEach(e=>{let t=document.createElement(`button`);t.innerText=e,t.style.width=`clamp(80px,18vw,150px)`,t.style.height=`clamp(50px,8vw,75px)`,t.style.margin=`8px`,t.style.fontSize=`clamp(20px,3vw,30px)`,t.style.fontWeight=`bold`,t.style.border=`none`,t.style.borderRadius=`15px`,t.style.background=`#2196F3`,t.style.color=`white`,t.style.cursor=`pointer`,t.style.transition=`0.2s`,t.onmouseenter=()=>{t.style.transform=`scale(1.08)`},t.onmouseleave=()=>{t.style.transform=`scale(1)`},t.onclick=()=>this.answer(e),this.el.options.appendChild(t)})}answer(e){this.gameOver||(e===this.question.correct?(this.stats.correct++,this.cars.player.speed=this.car.speed+2,setTimeout(()=>{this.cars.player.speed=this.car.speed},500)):this.stats.wrong++,this.nextQuestion())}checkWin(){if(this.gameOver)return;let e=e=>{this.gameOver=!0;let t=((Date.now()-this.stats.startTime)/1e3).toFixed(1),n=this.stats.correct+this.stats.wrong,r=n?Math.round(this.stats.correct/n*100):0,i=document.createElement(`div`);i.style.position=`absolute`,i.style.top=`0`,i.style.left=`0`,i.style.width=`100vw`,i.style.height=`100vh`,i.style.background=`#000`,i.style.color=`white`,i.style.display=`flex`,i.style.flexDirection=`column`,i.style.alignItems=`center`,i.style.justifyContent=`center`,i.style.fontSize=`28px`,i.innerHTML=`
        <h1>${e}</h1>
        <p>⏱ Time: ${t}s</p>
        <p>✅ Correct: ${this.stats.correct}</p>
        <p>❌ Wrong: ${this.stats.wrong}</p>
        <p>🎯 Accuracy: ${r}%</p>
        <button onclick="location.reload()">Play Again</button>
      `,document.body.appendChild(i)};this.cars.player.x>=this.finishLine&&e(`You Win!`),this.cars.ai1.x>=this.finishLine&&e(`AI 1 Wins!`),this.cars.ai2.x>=this.finishLine&&e(`AI 2 Wins!`),this.cars.ai3.x>=this.finishLine&&e(`AI 3 Wins!`)}},i=class{constructor(e){this.sceneManager=e,this.root=null,this.selected=[]}render(e){this.root=e;let t=document.createElement(`div`);Object.assign(t.style,{width:`100vw`,height:`100vh`,background:`linear-gradient(#0a0a0a,#111)`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`,padding:`20px`,boxSizing:`border-box`,color:`white`,fontFamily:`Arial, sans-serif`,overflowY:`auto`}),t.innerHTML=`
      <h1 style="
        font-size:clamp(30px,5vw,56px);
        margin:0;
        text-align:center;
      ">
        📚 Select Tables
      </h1>

      <p style="
        font-size:clamp(16px,2vw,22px);
        margin:12px 0 30px;
        text-align:center;
      ">
        Pick one or more multiplication tables
      </p>

      <div id="grid"></div>

      <button id="startBtn">
        🚀 Start Race
      </button>
    `,e.appendChild(t);let n=t.querySelector(`#grid`);Object.assign(n.style,{display:`grid`,gridTemplateColumns:`repeat(auto-fit,minmax(90px,1fr))`,gap:`15px`,width:`100%`,maxWidth:`700px`,marginBottom:`35px`});for(let e=1;e<=10;e++){let t=document.createElement(`button`);t.textContent=`${e} ×`,Object.assign(t.style,{padding:`18px`,fontSize:`clamp(18px,2vw,24px)`,borderRadius:`14px`,border:`none`,cursor:`pointer`,background:`#333`,color:`white`,transition:`.2s`,minHeight:`70px`,touchAction:`manipulation`}),t.onclick=()=>{this.selected.includes(e)?(this.selected=this.selected.filter(t=>t!==e),t.style.background=`#333`,t.style.transform=`scale(1)`):(this.selected.push(e),t.style.background=`#00c96d`,t.style.transform=`scale(1.05)`)},n.appendChild(t)}let i=t.querySelector(`#startBtn`);Object.assign(i.style,{padding:`18px 40px`,fontSize:`clamp(18px,2vw,26px)`,border:`none`,borderRadius:`16px`,background:`#ff3b3b`,color:`white`,cursor:`pointer`,minWidth:`220px`,touchAction:`manipulation`}),i.onclick=()=>{if(this.selected.length===0){alert(`Select at least one table!`);return}this.sceneManager.changeScene(new r(this.sceneManager,this.selected,this.sceneManager.selectedCar))}}destroy(){this.root.innerHTML=``}},a=[{id:`speedster`,name:`Speedster`,speed:2.2,boost:4},{id:`balanced`,name:`Balanced`,speed:2,boost:3.5},{id:`tank`,name:`Tank`,speed:1.7,boost:5}],o=class{constructor(e){this.sceneManager=e}render(e){this.root=e;let t=document.createElement(`div`);Object.assign(t.style,{width:`100vw`,height:`100vh`,background:`linear-gradient(180deg,#1b1b1b,#090909)`,color:`white`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,padding:`20px`,boxSizing:`border-box`,overflowY:`auto`,fontFamily:`Arial, sans-serif`});let n=document.createElement(`h1`);n.innerText=`🚗 Select Your Car`,n.style.marginBottom=`30px`,n.style.fontSize=`clamp(28px,5vw,52px)`,n.style.textAlign=`center`,t.appendChild(n);let r=document.createElement(`div`);Object.assign(r.style,{display:`grid`,gridTemplateColumns:`repeat(auto-fit,minmax(240px,1fr))`,gap:`20px`,width:`100%`,maxWidth:`900px`}),a.forEach(e=>{let t=document.createElement(`button`);t.innerHTML=`
        <div style="font-size:1.4rem;font-weight:bold;">
            ${e.name}
        </div>

        <div style="opacity:.8;margin-top:8px;">
            Speed: ${e.speed}
        </div>
      `,Object.assign(t.style,{padding:`22px`,borderRadius:`18px`,border:`none`,cursor:`pointer`,background:`#2d2d2d`,color:`white`,fontSize:`clamp(18px,2vw,24px)`,transition:`0.2s`,minHeight:`120px`,touchAction:`manipulation`}),t.onmouseenter=()=>{t.style.transform=`scale(1.04)`,t.style.background=`#3e3e3e`},t.onmouseleave=()=>{t.style.transform=`scale(1)`,t.style.background=`#2d2d2d`},t.onclick=()=>{this.sceneManager.selectedCar=e,this.sceneManager.changeScene(new i(this.sceneManager))},r.appendChild(t)}),t.appendChild(r),e.appendChild(t)}destroy(){this.root.innerHTML=``}},s=class{constructor(e){this.sceneManager=e,this.root=null,this.interval=null,this.container=null}render(e){this.root=e,this.container=document.createElement(`div`),this.container.className=`menu`,this.container.innerHTML=`
      <div class="bg"></div>

      <div class="content">
        <h1 class="title">🏎️ Math Racer</h1>
        <p class="subtitle">Learn • Race • Win</p>

        <button id="playBtn" class="play-btn">
          ▶ PLAY
        </button>

        <div class="footer">Version 1.0</div>
      </div>
    `,e.appendChild(this.container),this.container.querySelector(`#playBtn`).addEventListener(`click`,()=>{this.sceneManager.changeScene(new o(this.sceneManager))}),this.startBackgroundAnimation()}startBackgroundAnimation(){this.interval&&clearInterval(this.interval);let e=0,t=this.container.querySelector(`.bg`);this.interval=setInterval(()=>{e=(e+.6)%360,t.style.background=`
        radial-gradient(
          circle at center,
          hsl(${e},80%,20%),
          #000 70%
        )
      `},40)}destroy(){this.interval&&=(clearInterval(this.interval),null)}},c=document.querySelector(`#app`);c||console.error(`❌ #app not found in index.html`);var l=new e(c);l.changeScene(new s(l));