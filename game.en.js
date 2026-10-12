'use strict';
const LANG=(typeof window!=='undefined'&&window.BH_LANG==='en')?'en':'fr';
const LANG_NAME={fr:'Français',en:'English'};
const $=s=>document.querySelector(s);
const rnd=()=>Math.random();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(rnd()*a.length)];
const sum=a=>a.reduce((x,y)=>x+y,0);
function wpick(list){let t=0;for(const e of list)t+=e[1];if(t<=0)return null;let r=rnd()*t;for(const e of list){r-=e[1];if(r<=0)return e[0];}return list[list.length-1][0];}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const ZN={avant:"Front",flanc:"Flank",arriere:"Rear"};
const ALLZ=['avant','flanc','arriere'];
const ZPART={avant:'tete',flanc:'flanc',arriere:'queue'};
function uic(n,cls='uic'){return`<img class="${cls}" src="img/ui/${n}.webp" alt="" draggable="false">`;}
function elIcon(e){return uic('el_'+e);}
const ELEM={feu:{n:"Fire",i:'🔥'},glace:{n:"Ice",i:'❄️'},foudre:{n:"Thunder",i:'⚡'},dragon:{n:"Dragon",i:'🐲'}};
const STATN={burn:"burn",poison:'poison',gel:'frost',para:'paralysis',sleep:'sleep',down:'knockdown',bulle:'bubbles',virus:"frenzy",slime:"frost"};
const SHARP=[
 {n:"Red",c:'#c62828',raw:.5,el:.25},{n:"Orange",c:'#ef7d1a',raw:.75,el:.5},{n:"Yellow",c:'#e2bf16',raw:1,el:.75},
 {n:"Green",c:'#4caf50',raw:1.05,el:1},{n:"Blue",c:'#2f7fd8',raw:1.2,el:1.06},{n:"White",c:'#eeeeee',raw:1.32,el:1.12}];

const WT={
 gs:{n:"Great Sword",am:1.2,em:1,g:.45,r:{p:5,f:1,s:2,e:2},d:"The most powerful. Its charged attacks hit hard and make the monster flinch, canceling its attack. Taking a hit breaks the charge, but guarding or dodging keeps it: charge, avoid the hit, then release."},
 ls:{n:"Long Sword",am:1.05,em:1,g:0,r:{p:3,f:4,s:4,e:3},d:"Balanced. Fill the spirit gauge to power up, and counter attacks with Foresight Slash."},
 sns:{n:"Sword & Shield",am:.9,em:1,g:.5,r:{p:2,f:5,s:5,e:3},d:"The safest. Modest attack, but its guard fully blocks small hits, the shield bash strikes while guarding, and one item is free each turn."},
 db:{n:"Dual Blades",am:.92,em:1.35,g:0,r:{p:2,f:4,s:2,e:5},d:"Weak raw attack, but boosted element and flurries of hits: deadly against an elemental weakness. Furious Mode burns stamina."},
 hammer:{n:"Hammer",am:1.24,em:1,g:0,r:{p:4,f:3,s:3,e:2},d:"Powerful and blunt: aim for the head to stun. You can move and dodge without losing your charge."},
 hh:{n:"Hunting Horn",am:1.34,em:1,g:0,r:{p:3,f:3,s:3,e:2},d:"Blunt: aim for the head to stun. Each hit plays a note (red, blue or yellow). Recital strikes, then plays the melodies of your last two notes: Might (attack), Bulwark (defense) or Heal (HP, Griffu included)."},
 lance:{n:"Lance",am:1.05,em:1,g:.8,r:{p:2,f:2,s:5,e:3},d:"The sturdiest guard in the game. Counter blocks the hit aimed at you and strikes back at once; if nothing comes, it’s wasted. Lance charge chains three hits for stamina."},
 gl:{n:"Shell Lance",am:1.04,em:1,g:.7,r:{p:4,f:3,s:4,e:2},d:"A lance that fires shells. Shells deal fixed damage that ignores part hardness and sharpness: perfect against a hard shell or an iron plate. Depending on the line: normal shells (5), long (3, can be fired from range) or wide (2, very strong), then reload. Cannon breath explodes very hard, makes it flinch, then needs 6 turns to cool down."},
 sa:{n:"Blade Axe",am:.94,em:1,g:0,r:{p:4,f:3,s:2,e:3},d:"Two weapons in one. In axe mode, your hits fill the phial gauge. In sword mode, you hit harder (depending on the phial: +20% damage, or element ×1.7) but each hit drains the gauge; Element discharge empties it at once in a big explosion. Gauge empty: the weapon folds back into an axe."},
 cb:{n:"Shield Axe",am:1.05,em:1,g:.6,r:{p:4,f:1,s:4,e:2},d:"Sword and shield, or giant axe. In sword mode, your hits build energy that you charge into 5 phials, and the shield guards. In axe mode, no guard: each discharge blows up a phial (impact: fixed damage that stuns; element: based on the monster’s weakness), and Ultimate discharge blows them all up. With full phials, charge the shield: stronger guard and +30% explosions."},
 ig:{n:"Beetle Glaive",am:.89,em:1,g:0,r:{p:3,f:3,s:4,e:3},d:"An agile weapon that fights alongside a beetle. Send it at a part in your zone to gather an extract: head = red (attack +10%, longer combo), arms = white (cheaper leap and dodge), back = orange (defense +20). All three: Triple extract (+10% more). Leap dodges and launches you into the air; next turn, the aerial attack hits the head and, eventually, you mount the monster and it falls."},
 hbg:{n:"Heavy Blunderbuss",am:.86,em:1,g:.4,ranged:1,r:{p:5,f:2,s:3,e:2},d:"Heavy ranged weapon. No roll, but a guard. Siege mode (+50% damage) anchors you in place: no dodging or moving while it’s active. Full charge empties the whole magazine at once and makes the monster flinch."},
 lbg:{n:"Light Blunderbuss",am:.72,em:1,g:0,ranged:1,r:{p:3,f:3,s:4,e:3},d:"Mobile ranged weapon. Aim freely at any part, fire until the magazine is empty, then reload (1 turn). Normal ammo is unlimited; piercing, elemental and sleep ammo are crafted at the Workshop. Shot and roll fires and dodges in the same turn."},
 bow:{n:"Bow",am:.62,em:1.1,g:0,ranged:1,r:{p:3,f:3,s:4,e:4},d:"Ranged weapon. Aim freely at the head, flank or tail without moving. At range, melee attacks can’t reach you, but ranged attacks hit harder (defense −30%) and some rushes pull you back into melee. Draw the bow for stronger shots: a dodge draws it too."}};
const GUARD={rip:.25,lv:.1,cost:.15,tb:{sns:{L:1,M:1,H:.6,X:.4},gs:{L:1,M:.7,H:.5,X:.3},hbg:{L:1,M:.75,H:.5,X:.3},lance:{L:1,M:1,H:.8,X:.55},gl:{L:1,M:.9,H:.65,X:.45},cb:{L:1,M:.85,H:.6,X:.4}}};
function guardBlock(tier,T){const t=GUARD.tb[T];if(!t)return 0;return Math.min(1,(t[tier]||.3)+.1*(H?H.stats.sk.garde:0)+(T==='cb'&&H&&H.w&&H.w.shield>0?.15:0));}
const WT_ORDER=['gs','ls','sns','db','hammer','hh','lance','gl','sa','cb','ig','bow','lbg','hbg'];
const EXTR={r:{n:'red',c:'#d8342a'},w:{n:'white',c:'#f4f4f4'},o:{n:'orange',c:'#ef7d1a'}},EXT_T=10;
function extOf(p){return p==='tete'?'r':p==='flanc'?'w':'o';}
function triple(){const e=H.w.ex;return!!(e&&e.r>0&&e.w>0&&e.o>0);}
function vaultCost(){return H.w.ex&&H.w.ex.w>0?14:20;}
const WT_SHORT={gs:"Great Sword",ls:"Long Sword",sns:"Sword & Shield",db:"Dual Blades",hammer:"Hammer",hh:"Horn",lance:"Lance",gl:"Shell Lance",sa:"Blade Axe",cb:"Shield Axe",ig:"Beetle Glaive",bow:"Bow",lbg:"Light Blunderbuss",hbg:"Heavy Blunderbuss"};
const CB_PH=5;
function phialDmg(){const W=H.stats.w,sh=H.w.shield>0?1.3:1;if(W.var==='el'&&W.elem){const wk=H.m.d.weak[W.elem]||0;return Math.round(H.stats.atk*.27*(.55+wk)*sh);}return Math.round(H.stats.atk*.34*sh);}
function phialKo(k){return H.stats.w.var==='el'?0:k;}
const GL_SHELLS=5;
function glCap(){const v=wVar();return(v==='long'?3:v==='wide'?2:GL_SHELLS)+(H&&H.stats?H.stats.sk.chargeur:0);}
function conc(){return 1+.2*H.stats.sk.concentration;}
function chargeCost(T){return Math.max(2,(T==='hammer'?8:10)-2*H.stats.sk.concentration);}
function prolong(){return 3*H.stats.sk.prolong;}
function wfDmg(){return Math.round(H.stats.atk*.35*4.2*(wVar()==='wide'?1.2:1));}
function shellDmg(){const v=wVar();return Math.round(H.stats.atk*.35*(v==='long'?1.2:v==='wide'?1.5:1));}
const NOTES={r:{n:'red',c:'#d8423a'},b:{n:'blue',c:'#3f8fe0'},y:{n:'yellow',c:'#e0b43c'}};
const SONGS={rb:{id:'atk',n:"Might",d:"+15% attack (6 turns)"},br:{id:'atk',n:"Might",d:"+15% attack (6 turns)"},by:{id:'def',n:"Bulwark",d:"+25 defense (6 turns)"},yb:{id:'def',n:"Bulwark",d:"+25 defense (6 turns)"},yr:{id:'heal',n:"Heal",d:"+25 HP, Griffu included"},ry:{id:'heal',n:"Heal",d:"+25 HP, Griffu included"}};
function songOf(notes){const n=notes||[];if(n.length<2)return null;return SONGS[n[n.length-2]+n[n.length-1]]||null;}
const HBG_CAP={norm:5,perf:2,el:3,som:1};
function isGun(T){return T==='lbg'||T==='hbg';}
function ammoCap(k,T){T=T||(H&&H.stats.w.type);return(T==='hbg'?HBG_CAP[k]:AMMO[k].cap)+(H&&H.stats?H.stats.sk.chargeur:0);}
const AMMO={norm:{n:"Normal",cap:8,item:null},perf:{n:"Piercing",cap:3,item:'mun_perf'},el:{n:"Elemental",cap:5,item:'mun_el'},som:{n:"Sleep",cap:1,item:'mun_som'}};
const AMMO_ORDER=['norm','perf','el','som'];
const VARS={
 gl:{selenis:'long',herissaure:'wide',nacrelle:'norm',sismorak:'wide',tranchelune:'long',gorgovire:'norm',pyroclaste:'wide',rapinoux:'long',abyssaure:'wide',fer:'norm',grakku:'norm',brontal:'wide',velyra:'long',glacimorde:'norm',scoriak:'wide',fulgor:'long',boregor:'norm',devoreur:'wide',ferroi:'norm',bombardier:'wide',tempestaire:'long'},
 sa:{selenis:'el',herissaure:'pow',nacrelle:'el',sismorak:'pow',tranchelune:'el',gorgovire:'pow',pyroclaste:'el',rapinoux:'pow',abyssaure:'el',fer:'pow',grakku:'pow',brontal:'el',velyra:'el',glacimorde:'el',scoriak:'pow',fulgor:'el',boregor:'pow',devoreur:'el',ferroi:'pow',bombardier:'pow',tempestaire:'el'},
 cb:{selenis:'el',herissaure:'imp',nacrelle:'el',sismorak:'imp',tranchelune:'imp',gorgovire:'imp',pyroclaste:'el',rapinoux:'imp',abyssaure:'el',fer:'imp',grakku:'imp',brontal:'el',velyra:'imp',glacimorde:'el',scoriak:'imp',fulgor:'el',boregor:'imp',devoreur:'imp',ferroi:'imp',bombardier:'imp',tempestaire:'el'},
 ig:{selenis:'soin',herissaure:'lourd',nacrelle:'vif',sismorak:'lourd',tranchelune:'vif',gorgovire:'vif',pyroclaste:'lourd',rapinoux:'vif',abyssaure:'lourd',fer:'vif',grakku:'lourd',brontal:'vif',velyra:'soin',glacimorde:'soin',scoriak:'lourd',fulgor:'vif',boregor:'lourd',devoreur:'lourd',ferroi:'soin',bombardier:'lourd',tempestaire:'vif'}};
const VARN={gl:{norm:"Normal shells",long:"Long shells",wide:"Wide shells"},sa:{pow:"Power phial",el:"Element phial"},cb:{imp:"Impact phials",el:"Element phials"},ig:{vif:"Swift beetle",lourd:"Heavy beetle",soin:"Healer beetle"}};
const VARD={gl:{norm:"5 shells, the largest supply.",long:"3 slightly stronger shells (+20%), also fired from range: the outer ring becomes reachable, but thrusts and Cannon breath stay melee-only.",wide:"Only 2 shells, but very strong (+50%), plus Cannon breath +20%."},
 sa:{pow:"Sword mode: +20% raw damage.",el:"Sword mode: element (or poison) ×1.7 and +5% raw damage."},
 cb:{imp:"Phials deal fixed damage and stun on the head.",el:"Phials explode with the weapon’s element: damage based on the monster’s weakness, no stun."},
 ig:{vif:"Extracts last 4 more turns.",lourd:"The beetle hits much harder and stuns on the head.",soin:"Each extract you gather restores 10 HP."}};
function wVar(){return H&&H.stats?H.stats.w.var:null;}
function varName(w){if(!w.var)return'';if(w.type==='sa'&&w.var==='el'&&w.stat&&!w.elem)return"Poison phial";return VARN[w.type][w.var];}
function ranged(){return!!(H&&H.stats&&(WT[H.stats.w.type].ranged||(H.stats.w.type==='gl'&&H.stats.w.var==='long')));}
function reachOf(mv){if(mv.reach!=null)return!!mv.reach;return!!(mv.track||mv.fx||mv.after||mv.st||(mv.z||[]).length>=3);}
function farAway(mv){return ranged()&&!(H.close>0)&&!reachOf(mv);}

const LIN=[
 {id:'fer',name:"Iron",mon:null,rank:0,atk:100,aff:0,sharp:[6,10,14,22,0,0]},
 {id:'grakku',name:"Rockbeak",mon:'grakku',rank:1,atk:125,aff:5,sharp:[5,8,12,20,8,0]},
 {id:'rapinoux',name:"Pilferer",mon:'rapinoux',rank:1,atk:120,aff:15,sharp:[5,8,12,18,10,0]},
 {id:'brontal',name:"Blaze",mon:'brontal',rank:2,atk:132,aff:0,elem:'feu',ev:26,sharp:[5,8,12,18,12,0]},
 {id:'velyra',name:"Venom",mon:'velyra',rank:3,atk:168,aff:5,stat:'poison',sv:34,sharp:[4,6,10,18,16,4]},
 {id:'glacimorde',name:"Frost",mon:'glacimorde',rank:4,atk:190,aff:0,elem:'glace',ev:34,sharp:[4,6,10,16,18,8]},
 {id:'scoriak',name:"Magma",mon:'scoriak',rank:4,atk:196,aff:0,elem:'feu',ev:22,sharp:[5,7,11,17,16,4]},
 {id:'fulgor',name:"Thunder",mon:'fulgor',rank:5,atk:212,aff:15,elem:'foudre',ev:36,sharp:[4,6,10,14,18,12]},
 {id:'boregor',name:"Rime",mon:'boregor',rank:5,atk:204,aff:20,sharp:[4,6,10,14,18,12]},
 {id:'devoreur',name:"Ravenous",mon:'devoreur',rank:7,atk:252,aff:0,elem:'dragon',ev:40,sharp:[4,6,8,12,16,20]},
 {id:'ferroi',name:"Iron King’s",mon:'ferroi',rank:6,atk:236,aff:0,elem:'dragon',ev:42,sharp:[4,6,8,12,18,18]},
 {id:'bombardier',name:"Blast",mon:'bombardier',rank:8,atk:258,aff:5,elem:'feu',ev:46,sharp:[4,6,8,12,16,20]},
 {id:'tempestaire',name:"Tempest",mon:'tempestaire',rank:9,atk:268,aff:15,elem:'foudre',ev:50,sharp:[4,6,8,10,16,22]},
 {id:'selenis',name:"Lunar",mon:'selenis',rank:3,atk:160,aff:10,elem:'glace',ev:30,sharp:[5,7,10,16,12,4]},
 {id:'herissaure',name:"Bristled",mon:'herissaure',rank:4,atk:204,aff:0,sharp:[4,6,10,18,14,4]},
 {id:'nacrelle',name:"Nacre",mon:'nacrelle',rank:7,atk:248,aff:10,elem:'glace',ev:44,sharp:[4,6,8,12,16,18]},
 {id:'sismorak',name:"Seismic",mon:'sismorak',rank:8,atk:272,aff:-10,sharp:[4,6,8,12,18,16]},
 {id:'tranchelune',name:"Moon",mon:'tranchelune',rank:9,atk:270,aff:30,elem:'dragon',ev:40,sharp:[3,5,7,10,16,24]},
 {id:'gorgovire',name:"Frenzy",mon:'gorgovire',rank:10,atk:300,aff:20,sharp:[3,5,7,10,16,24]},
 {id:'pyroclaste',name:"Pyroclast",mon:'pyroclaste',rank:10,atk:292,aff:0,elem:'feu',ev:60,sharp:[3,5,7,10,16,24]},
 {id:'abyssaure',name:"Eclipse",mon:'abyssaure',rank:10,atk:290,aff:10,elem:'dragon',ev:58,sharp:[3,5,7,10,16,24]}];

for(const l of LIN.slice()){if(!l.mon)continue;const s=l.sharp.slice();s[4]+=6;if(l.rank>=3)s[5]+=4;
 LIN.push(Object.assign({},l,{id:l.id+'2',name:l.name+' II',up:l.id,atk:l.atk+18,ev:l.ev?l.ev+8:0,sv:l.sv?l.sv+8:0,sharp:s}));}
const T3={selenis:{atk:256,ev:60,aff:15},herissaure:{atk:284,aff:5},nacrelle:{atk:292,ev:62,aff:10},sismorak:{atk:306,aff:-5},tranchelune:{atk:302,ev:54,aff:30},gorgovire:{atk:326,aff:30},pyroclaste:{atk:322,ev:70,aff:5},rapinoux:{atk:270,aff:45},grakku:{atk:278,aff:35},brontal:{atk:248,ev:62},velyra:{atk:254,sv:64,aff:10},glacimorde:{atk:252,ev:60},scoriak:{atk:258,ev:48},boregor:{atk:270,aff:30},devoreur:{atk:292,ev:54},fulgor:{atk:256,ev:52,aff:20},ferroi:{atk:262,ev:50,aff:0},bombardier:{atk:294,ev:60,aff:10},tempestaire:{atk:302,ev:62,aff:25},abyssaure:{atk:322,ev:66,aff:15}};
for(const l of LIN.slice()){if(!l.up)continue;const b=LIN.find(x=>x.id===l.up);const o=T3[b.id]||{};
 LIN.push(Object.assign({},l,{id:b.id+'3',name:b.name+' III',up:l.id,t3:1,atk:o.atk,aff:o.aff!=null?o.aff:l.aff,ev:o.ev||0,sv:o.sv||0,sharp:[3,5,7,10,16,24]}));}
const T4={};for(const l of LIN.slice()){if(!l.t3)continue;const b=LIN.find(x=>x.id===l.id.replace(/3$/,''));
 LIN.push(Object.assign({},l,{id:b.id+'4',name:b.name+' IV',up:l.id,t3:0,t4:1,atk:l.atk+36,ev:l.ev?l.ev+12:0,sv:l.sv?l.sv+12:0,sharp:[2,4,6,8,14,34]}));}
function wSlots(lin){return lin.t4?[3,2]:lin.t3?[3,1]:lin.up?[1]:lin.rank>=6?[1]:[];}
const SLOTS=[{id:'tete',n:"Helm"},{id:'torse',n:"Mail"},{id:'bras',n:"Braces"},{id:'taille',n:"Coil"},{id:'jambes',n:"Greaves"}];
const SETS=[
 {id:'chasseur',name:"Hunter",mon:null,rank:0,def:4,p:[{},{},{},{},{}],sl:[[],[1],[],[],[]]},
 {id:'grakku',name:"Rockbeak",mon:'grakku',rank:1,def:14,p:[{bouchons:1,critique:1},{esquive:1,endurance:1},{tranchant:1,critique:1},{depeceur:1,esquive:1},{esquive:1,endurance:1,concentration:1}],sl:[[1],[1],[],[1],[1]]},
 {id:'rapinoux',name:"Pilferer",mon:'rapinoux',rank:1,def:14,p:[{esquive:1,critique:1},{depeceur:1,esquive:1},{critique:1,concentration:1},{capture:1,critique:1},{esquive:1,endurance:1}],sl:[[1],[],[1],[1],[1]]},
 {id:'brontal',name:"Blaze",mon:'brontal',rank:2,def:17,p:[{attaque:1,sante:1},{attaque:1,res_feu:1,artillerie:1},{attaque:2},{sante:1,endurance:1},{sante:1,garde:1}],sl:[[1],[1],[1],[1,1],[]]},
 {id:'velyra',name:"Venom",mon:'velyra',rank:3,def:26,p:[{critique:1,res_poison:1},{attaque:1,critique:1},{statut:1,sante:1,prolong:1},{faiblesse:1,critique:1},{faiblesse:1,esquive:1}],sl:[[2],[1],[1,1],[1],[2]]},
 {id:'glacimorde',name:"Frost",mon:'glacimorde',rank:4,def:32,p:[{garde:1,sante:1},{sante:1,res_glace:1},{garde:2,chargeur:1},{elem:2},{sante:1,elem:1}],sl:[[2,1],[1],[2],[1,1],[2]]},
 {id:'scoriak',name:"Magma",mon:'scoriak',rank:4,def:32,p:[{attaque:1,res_feu:1,artillerie:1},{sante:2},{attaque:1,garde:1},{endurance:1,attaque:1},{sante:1,tranchant:1}],sl:[[1],[2],[1],[1,1],[1]]},
 {id:'fulgor',name:"Thunder",mon:'fulgor',rank:5,def:38,p:[{agitateur:1,critique:1},{critique:1,crit_boost:1},{res_foudre:1,agitateur:1,tir:1},{faiblesse:1,critique:1},{agitateur:1,capture:1}],sl:[[2],[2,1],[1,1],[2],[1]]},
 {id:'boregor',name:"Rime",mon:'boregor',rank:5,def:36,p:[{critique:1,faiblesse:1},{esquive:1,endurance:1,concentration:1},{critique:1,res_glace:1},{faiblesse:1,agitateur:1},{critique:1,esquive:1}],sl:[[2],[1],[1,1],[2],[1]]},
 {id:'devoreur',name:"Ravenous",mon:'devoreur',rank:7,def:50,p:[{attaque:2},{agitateur:1,sante:1},{attaque:1,critique:1},{agitateur:1,garde:1},{attaque:1,sante:1,prolong:1}],sl:[[2],[2,1],[1],[2],[1]]},
 {id:'tempestaire',name:"Tempest",mon:'tempestaire',rank:9,def:58,p:[{critique:2,tir:1},{attaque:1,crit_boost:1},{faiblesse:1,critique:1},{attaque:1,esquive:1,concentration:1},{elem:1,faiblesse:1}],sl:[[2,1],[2],[2],[1,1],[2]]},
 {id:'bombardier',name:"Blast",mon:'bombardier',rank:8,def:54,p:[{attaque:1,elem:1,artillerie:1},{attaque:2},{elem:1,res_feu:1,chargeur:1},{critique:1,agitateur:1,artillerie:1},{elem:1,endurance:1}],sl:[[2],[2,1],[1],[2],[1,1]]},
 {id:'selenis',name:"Pale Moon",mon:'selenis',rank:3,def:24,p:[{elem:1,critique:1},{esquive:1,prolong:1},{elem:1,sante:1,chargeur:1},{critique:1,concentration:1},{esquive:1,elem:1}],sl:[[1],[1],[1,1],[1],[1]]},
 {id:'herissaure',name:"Thorned",mon:'herissaure',rank:4,def:30,p:[{garde:1,sante:1},{attaque:1,garde:1},{tranchant:1,attaque:1},{sante:1,artillerie:1},{garde:1,endurance:1}],sl:[[1],[2],[1],[1],[1]]},
 {id:'nacrelle',name:"Pearled",mon:'nacrelle',rank:7,def:50,p:[{esquive:2},{elem:1,critique:1},{esquive:1,tir:1},{critique:1,prolong:1},{esquive:1,elem:1}],sl:[[2],[1],[2,1],[1],[2]]},
 {id:'sismorak',name:"Telluric",mon:'sismorak',rank:8,def:54,p:[{attaque:1,garde:1},{sante:2},{attaque:2},{garde:1,res_glace:1},{attaque:1,endurance:1}],sl:[[2],[2,1],[1],[2],[1]]},
 {id:'tranchelune',name:"Moonblade",mon:'tranchelune',rank:9,def:58,p:[{critique:2},{faiblesse:1,crit_boost:1},{critique:1,tranchant:1},{attaque:1,esquive:1,tir:1},{critique:1,agitateur:1}],sl:[[2],[2],[2,1],[1],[2]]},
 {id:'gorgovire',name:"Frenzied",mon:'gorgovire',rank:10,def:64,p:[{agitateur:2,attaque:1},{critique:1,attaque:1,faiblesse:1},{agitateur:1,sante:1,tir:1},{attaque:2,volonte:1},{critique:2,esquive:1}],sl:[[3],[2,1],[2],[3,1],[2]]},
 {id:'pyroclaste',name:"Basalt",mon:'pyroclaste',rank:10,def:64,p:[{attaque:1,artillerie:1,elem:1},{attaque:2,sante:1},{artillerie:1,garde:1,res_feu:1},{attaque:1,chargeur:1,elem:1},{garde:1,attaque:1,endurance:1}],sl:[[2,1],[3],[2],[2,2],[2]]},
 {id:'abyssaure',name:"Eclipse",mon:'abyssaure',rank:10,def:66,p:[{critique:2,faiblesse:1},{attaque:2,crit_boost:1},{attaque:1,elem:1,esquive:1},{faiblesse:1,agitateur:1,prolong:1},{critique:1,attaque:1,volonte:1}],sl:[[3],[2,1],[2,2],[3],[2,1]]},
 {id:'ferroi',name:"Iron King’s",mon:'ferroi',rank:6,def:46,p:[{volonte:1,attaque:1},{attaque:2,chargeur:1},{elem:1,critique:1,prolong:1},{attaque:1,garde:1},{elem:1,sante:1}],sl:[[3],[1],[2],[1],[2]]}];
const DEF_CAP=70,DEF_CAP_MR=100,DEF_STEP=8,HARD_DEF=46;
function mrOpen(){const L=typeof QUESTS!=='undefined'?QUESTS.filter(q=>q.tier===6):[];return L.length>0&&!!(S&&S.cleared)&&(L.every(q=>S.cleared[q.id])||L.some(q=>q.urgent&&S.cleared[q.id]));}
function defCap(){return mrOpen()?DEF_CAP_MR:DEF_CAP;}
function armorMaxLv(set){return Math.ceil((defCap()-set.def)/DEF_STEP);}
const ARMOR_MATS={tete:{ecaille:1,tete:1},torse:{peau:1,ecaille:1,griffe:1},bras:{griffe:1,ecaille:1},taille:{peau:1,queue:1},jambes:{griffe:1,peau:1}};

const SKILLS={
 attaque:{n:"Attack Boost",max:5,d:"+4 attack per level"},
 critique:{n:"Critical Eye",max:5,d:"+5% affinity per level"},
 faiblesse:{n:"Weakness Exploit",max:2,d:"+15% affinity per level on weak points (★★★)"},
 crit_boost:{n:"Critical Boost",max:1,d:"Critical hits deal +40% instead of +25%"},
 statut:{n:"Poison Boost",max:3,d:"+20% poison buildup per level"},
 tranchant:{n:"Sharpness",max:3,d:"20% chance per level not to dull your weapon"},
 esquive:{n:"Agile Evasion",max:3,d:"Dodging costs 5 less stamina and dodge momentum gains +10% per level"},
 endurance:{n:"Long Breath",max:3,d:"Per level: +15 max stamina, +6 recovered per turn, cheaper Furious Mode"},
 sante:{n:"Health",max:3,d:"+15 max HP per level"},
 garde:{n:"Guard",max:3,d:"Per level: guard blocks 10% more of big hits and counters gain +10%"},
 bouchons:{n:"Earplugs",max:1,d:"Immune to roars"},
 res_feu:{n:"Fireproof",max:1,d:"Immune to burn"},
 res_poison:{n:"Anti-poison",max:1,d:"Immune to poison"},
 res_glace:{n:"Anti-frost",max:1,d:"Immune to frost"},
 res_foudre:{n:"Anti-paralysis",max:1,d:"Immune to paralysis"},
 elem:{n:"Elemental Attack",max:5,d:"+8% elemental damage per level"},
 depeceur:{n:"Carver",max:1,d:"+1 carve after a kill"},
 capture:{n:"Capture Master",max:1,d:"+1 capture reward"},
 agitateur:{n:"Agitator",max:3,d:"Against an enraged monster: +5 attack and +7% affinity per level"},
 volonte:{n:"Iron Will",max:1,d:"Once per hunt, a fatal blow leaves you at 1 HP"},
 artillerie:{n:"Artillery",max:3,d:"Shell Lance and Shield Axe: +12% fixed damage per level (shells, Cannon breath, phial explosions). Level 3: Cannon breath cools 1 turn faster."},
 concentration:{n:"Focus",max:3,d:"Long Sword, Blade Axe and Shield Axe: spirit, phial and energy gauges fill 20% faster per level. Great Sword, Hammer and Bow: charging costs 2 less stamina per level."},
 prolong:{n:"Extension",max:2,d:"+3 turns per level to Horn songs, Beetle Glaive extracts and the Shield Axe’s charged shield; +1 shot per level to Bow coatings."},
 chargeur:{n:"Extended Magazine",max:2,d:"Blunderbusses: +1 round per magazine per level. Shell Lance: +1 shell per level."},
 tir:{n:"Expert Shot",max:3,d:"Bow and Blunderbusses: +6% shot damage per level."}};
const SK_WT={artillerie:['gl','cb'],concentration:['ls','sa','cb','gs','hammer','bow'],prolong:['hh','ig','cb','bow'],chargeur:['lbg','hbg','gl'],tir:['bow','lbg','hbg']};
function skWeapons(k){return SK_WT[k]?SK_WT[k].map(t=>WT[t].n).join(', '):'';}
function skUseless(k,T){return!!(SK_WT[k]&&!SK_WT[k].includes(T));}

const ITEMS={
 soin:{n:"First-aid kit",i:'➕',p:0,carry:2,sup:1,d:"Restores 30 HP. Supplied by the Guild, lost at the end of the quest."},
 potion:{n:"Potion",i:'🧪',p:50,shop:1,carry:10,d:"Restores 35 HP."},
 mega:{n:"Mega Potion",i:'💚',p:90,carry:5,d:"Restores 70 HP."},
 antidote:{n:"Antidote",i:'🌿',p:40,shop:1,carry:5,d:"Cures poison."},
 steak:{n:"Well-done steak",i:'🍖',p:40,carry:3,d:"+25 max stamina (up to 150) and full stamina."},
 grain:{n:"Demon seed",i:'🌶️',p:150,carry:1,d:"+10% attack until the end of the quest."},
 armure:{n:"Armor seed",i:'🌰',p:120,carry:1,d:"+20 defense until the end of the quest."},
 flash:{n:"Flash bomb",i:'✨',p:80,carry:3,d:"Blinds the monster and cancels its attack this turn. Knocks a flying monster down."},
 piege:{n:"Pitfall trap",i:'🪤',p:250,carry:1,d:"The monster falls in on its next action: stuck for 3 turns."},
 baliste:{n:"Ballista bolt",i:'🏹',p:0,carry:3,sup:1,d:"Fire the rampart ballista: heavy damage to the targeted part, cracks iron plates."},
 tranq:{n:"Tranq bomb",i:'💤',p:60,carry:4,d:"Two bombs on a trapped, limping monster: capture!"},
 mun_perf:{n:"Piercing ammo",i:'🔩',p:0,carry:9,d:"Blunderbuss: each shot pierces the monster, hitting the head, arms and tail."},
 mun_el:{n:"Elemental ammo",i:'💠',p:0,carry:15,d:"Blunderbuss: shots charged with the weapon’s element (useless on a non-elemental weapon)."},
 mun_som:{n:"Sleep ammo",i:'💤',p:0,carry:3,d:"Blunderbuss: builds up sleep; a sleeping monster can’t move for 2 turns."},
 fiole_p:{n:"Power coating",i:'🔴',p:0,carry:6,d:"Bow: your next 4 shots gain +30% damage. Applying it doesn’t cost a turn."},
 fiole_v:{n:"Poison coating",i:'🟣',p:0,carry:6,d:"Bow: your next 4 shots poison the monster. Applying it doesn’t cost a turn."}};
const ITEM_ORDER=['soin','baliste','potion','mega','antidote','steak','grain','armure','flash','piege','tranq','fiole_p','fiole_v','mun_perf','mun_el','mun_som'];
const CAMP_OK=['soin','potion','mega','steak','grain','armure','fiole_p','fiole_v'];

/* ---------- Récolte et artisanat ---------- */
const RES={
 herbe:{n:"Healing herb",c:'#5aa84a'},champi:{n:"Blue mushroom",c:'#4a86c8'},amere:{n:"Bitterbug herb",c:'#8a9a3a'},
 miel:{n:"Honey",c:'#e0a62a'},viande:{n:"Raw meat",c:'#c2554a'},piment:{n:"Demon pepper",c:'#d8342a'},
 noix:{n:"Armored nut",c:'#8a6a4a'},insecte:{n:"Flashbug",c:'#e8d84a'},toile:{n:"Spiderweb",c:'#8e8ea6'},
 os:{n:"Monster bone",c:'#e6dcc2'},soporif:{n:"Sleep mushroom",c:'#9a6ac8'},
 sphere:{n:"Armor sphere",c:'#5a9ad8'},sphered:{n:"Hard armor sphere",c:'#b05ad8'},spherea:{n:"Ancestral sphere",c:'#d89a2a'},
 fer:{n:"Iron ore",c:'#9aa3ad',ore:1},ardente:{n:"Fire stone",c:'#e0602a',ore:1},boisdur:{n:"Hardwood",c:'#8a5a2a',ore:1},
 cristal:{n:"Ice crystal",c:'#8fd8f0',ore:1},tonnerre:{n:"Thunderstone",c:'#e8c83a',ore:1},dracite:{n:"Dracite",c:'#6a4aa0',ore:1},
 c_rod:{n:"Rodaille hide",c:'#9a7a4a',hide:1},c_brou:{n:"Grazer horn",c:'#d8c8a0',hide:1},c_kel:{n:"Keleboss shell",c:'#3a7a5a',hide:1},
 c_pin:{n:"Pincharde claw",c:'#e8a0a0',hide:1},c_ping:{n:"Pingrelot fur",c:'#e8f0f4',hide:1},c_volt:{n:"Voltwing membrane",c:'#5a6a9a',hide:1},c_sal:{n:"Salamander scale",c:'#d0602a',hide:1},c_lou:{n:"Givrelou fang",c:'#b8c8d8',hide:1},c_garg:{n:"Gargoylet shard",c:'#7a7a86',hide:1}};
const RES_ORDER=Object.keys(RES);
const SPOTS={
 col:[{n:"Pass herbs",k:'herb',t:[['fer',3],['herbe',5],['amere',2],['champi',3]]},{n:"Wild hive",k:'hive',t:[['miel',5],['insecte',2]]},{n:"Old carcass",k:'bone',t:[['os',4],['viande',4],['toile',1]]}],
 plaine:[{n:"Tall grass",k:'herb',t:[['ardente',3],['herbe',5],['piment',3],['amere',2]]},{n:"Carcass",k:'bone',t:[['viande',5],['os',4]]},{n:"Thornbushes",k:'bush',t:[['miel',3],['noix',2],['toile',2]]}],
 foret:[{n:"Undergrowth",k:'shroom',t:[['boisdur',3],['champi',5],['soporif',4],['amere',2]]},{n:"Giant webs",k:'web',t:[['toile',5],['insecte',3]]},{n:"Hollow hive",k:'hive',t:[['miel',5],['herbe',2]]}],
 glace:[{n:"Snowdrift",k:'ice',t:[['cristal',3],['noix',3],['champi',2],['soporif',3]]},{n:"Frozen carcass",k:'bone',t:[['os',5],['viande',4]]},{n:"Lichens",k:'herb',t:[['herbe',3],['amere',3],['miel',1]]}],
 citadelle:[{n:"Collapsed armory",k:'bone',t:[['dracite',3],['os',4],['toile',3],['noix',2]]},{n:"Scorched garden",k:'herb',t:[['herbe',4],['piment',3],['amere',2]]},{n:"Damp cellar",k:'shroom',t:[['champi',4],['soporif',3],['insecte',2],['miel',1]]}],
 lagon:[{n:"Giant shells",k:'ice',t:[['cristal',3],['noix',3],['miel',1]]},{n:"Dune grass",k:'herb',t:[['herbe',4],['amere',2],['champi',2]]},{n:"Wreck",k:'bone',t:[['os',3],['toile',3],['viande',3]]}],
 eclipse:[{n:"Amethyst vein",k:'ice',t:[['dracite',3],['noix',2],['insecte',2]]},{n:"Charred bones",k:'bone',t:[['os',5],['viande',3]]},{n:"Shadow moss",k:'shroom',t:[['champi',3],['soporif',3],['amere',2]]}],
 crete:[{n:"Storm swarm",k:'bug',t:[['tonnerre',3],['insecte',6],['toile',2]]},{n:"Dry bushes",k:'bush',t:[['piment',4],['noix',3],['miel',2]]},{n:"Scree",k:'bone',t:[['os',3],['herbe',3],['champi',2]]}]};
const ZONE_ORE={selenis:'fer',herissaure:'ardente',nacrelle:'cristal',sismorak:'cristal',tranchelune:'dracite',gorgovire:'tonnerre',pyroclaste:'ardente',rapinoux:'boisdur',abyssaure:'dracite',tempestaire:'tonnerre',bombardier:'ardente',grakku:'fer',brontal:'ardente',scoriak:'ardente',boregor:'cristal',devoreur:'dracite',velyra:'boisdur',glacimorde:'cristal',fulgor:'tonnerre',ferroi:'dracite',chasseur:'fer'};
const ZONE_HIDE={selenis:'c_rod',herissaure:'c_sal',nacrelle:'c_pin',sismorak:'c_lou',tranchelune:'c_garg',gorgovire:'c_volt',pyroclaste:'c_sal',rapinoux:'c_kel',abyssaure:'c_garg',tempestaire:'c_volt',bombardier:'c_sal',grakku:'c_rod',brontal:'c_brou',scoriak:'c_sal',boregor:'c_lou',devoreur:'c_garg',velyra:'c_kel',glacimorde:'c_ping',fulgor:'c_volt',ferroi:'c_garg'};
const SMALL={
 c_rod:{n:"Rodaille",d:"Small scaly predator that hunts in packs.",c:'#a07a48'},c_brou:{n:"Grazer",d:"Peaceful herbivore with curved horns.",c:'#c8b27a'},
 c_lou:{n:"Givrelou",d:"Small ice wolf that prowls the lakes in packs.",c:'#b8c8d8'},c_sal:{n:"Salamander",d:"Ember lizard that basks on the black stones.",c:'#d0602a'},c_kel:{n:"Keleboss",d:"Giant beetle with a green shell.",c:'#3f8a62'},c_ping:{n:"Pingrelot",d:"Plump, curious snow bird.",c:'#dfe8ee'},
 c_pin:{n:"Pincharde",d:"Small pearly crab that pinches anything within reach.",c:'#e8a0a0'},c_volt:{n:"Voltwing",d:"Bat crackling with electricity.",c:'#6070a8'},c_garg:{n:"Gargoylet",d:"Small animated gargoyle of stone and iron.",c:'#80808c'}};
const EXPZ=[
 {id:'vallee',n:"Brume Valley",d:"Plains and forests at the foot of the pass",hab:'foret',habs:['col','foret'],mons:['grakku','velyra','rapinoux','selenis'],hides:['c_rod','c_kel'],danger:'devoreur',rate:3.5,secs:["Camp","Pass meadow","Scree","Undergrowth","Mother tree"]},
 {id:'volcan',n:"Ashlands",d:"Scorched plain and lava flows",hab:'plaine',habs:['plaine'],mons:['brontal','scoriak','herissaure','bombardier'],hides:['c_brou','c_sal'],danger:'pyroclaste',key:'brontal',rate:4,secs:["Camp","Ash field","Warm pool","Black rocks","Smoking crater"]},
 {id:'toundra',n:"Frozen Tundra",d:"Ice-bound lakes and snowdrifts",hab:'glace',habs:['glace'],mons:['glacimorde','boregor','selenis'],hides:['c_ping','c_lou'],danger:'sismorak',key:'glacimorde',rate:4.5,secs:["Camp","Frozen shore","Rime cave","Central lake","Snowdrifts"]},
 {id:'ruines',n:"Crests & Ruins",d:"Stormy spires and an old citadel",hab:'crete',habs:['crete','citadelle'],mons:['fulgor','ferroi','tempestaire','tranchelune'],hides:['c_volt','c_garg'],danger:'gorgovire',key:'fulgor',rate:5,secs:["Camp","Windy pass","Spires","Ruined gate","Cold forge"]},
 {id:'lagon',n:"Nacre Lagoon",d:"Turquoise waters, coral arches and giant shells",hab:'lagon',habs:['lagon'],mons:['nacrelle','rapinoux','grakku'],hides:['c_pin','c_kel'],danger:'tempestaire',key:'nacrelle',rate:4.5,secs:["Camp","White beach","Coral arches","Shallows","Pearl grotto"]},
 {id:'cratere',n:"Eclipse Crater",d:"Obsidian, amethyst and a dying sky",hab:'eclipse',habs:['eclipse'],mons:['scoriak','gorgovire','pyroclaste','tranchelune'],hides:['c_sal','c_volt'],danger:'abyssaure',ores:['ardente','dracite'],mr:1,rate:5.5,secs:["Camp","Crater rim","Obsidian","Violet chasm","Black heart"]}];
const EXP_HOURS=30;
const DANGER={devoreur:{omen:"🌋 The ground shakes. Small monsters scatter in every direction… something huge is coming.",come:"☠️ The Devourer bursts out, starving!",shake:"At camp, the tremors fade: the beast has lost your trail.",stay:"Even at camp, the ground keeps shaking: the beast won’t let go of your trail."},
 pyroclaste:{omen:"🌋 Dull thuds shake the rock, and green gel oozes from the cracks…",come:"☠️ A Pyroclast bursts from a lava flow, fists smoking!",shake:"At camp, the dull thuds fade into the distance.",stay:"Even at camp, the rock keeps shaking: it’s following you."},
 sismorak:{omen:"❄️ The ice cracks rhythmically under your feet: something immense is coming…",come:"☠️ A Sismorak splits the ice and charges!",shake:"At camp, the cracking fades toward the lake.",stay:"Even at camp, the ice keeps cracking: it’s still coming."},
 gorgovire:{omen:"🦠 A cloud of dark spores drifts through the ruins; a shrill cry tears the silence…",come:"☠️ The Gorgovire drops from the sky, drawn by the noise!",shake:"At camp, silence returns: it has lost the sound of your steps.",stay:"Even at camp, the spores swirl: it can still hear you."},
 tempestaire:{omen:"⛈️ The sky darkens all at once and the sea heaves: a storm is bearing down on the lagoon…",come:"☠️ The Tempestar descends from the eye of the storm!",shake:"At camp, the storm drifts out to sea.",stay:"Even at camp, the storm doesn’t let up: it’s circling above you."},
 abyssaure:{omen:"🌑 The light fades, the sky slowly goes dark… The Eclipse is coming.",come:"☠️ The Abyssaur emerges from the dark!",shake:"At camp, the light slowly returns.",stay:"Even at camp, the sky stays black: it has found you."}};
function zDanger(z){return z&&z.danger;}
const HABN={lagon:"the Nacre Lagoon",eclipse:"the Eclipse Crater",col:"the Brume pass",plaine:"the scorched plain",foret:"the highland forest",glace:"the frozen lakes",crete:"the stormy crests",citadelle:"the Ruined Citadel, at the end of the world"};
const CRAFT_IN=new Set();
const RECIPES=[
 {out:'potion',ins:{herbe:1,champi:1}},{out:'mega',ins:{potion:1,miel:1},it:['potion']},{out:'antidote',ins:{amere:1,champi:1}},
 {out:'steak',ins:{viande:1}},{out:'grain',ins:{piment:1,miel:1}},{out:'armure',ins:{noix:1,miel:1}},
 {out:'flash',ins:{insecte:2}},{out:'piege',ins:{toile:2,os:1}},{out:'tranq',ins:{soporif:1,os:1},n:2},
 {out:'fiole_p',ins:{piment:1,insecte:1},n:2},{out:'fiole_v',ins:{amere:1,toile:1},n:2},
 {out:'mun_perf',ins:{os:1,toile:1},n:3},{out:'mun_el',ins:{noix:1,insecte:1},n:4},{out:'mun_som',ins:{soporif:1,toile:1},n:2}];
for(const r of RECIPES)for(const k in r.ins)if(RES[k])CRAFT_IN.add(k);

const SKFX={attaque:n=>`+${4*n} attack`,critique:n=>`+${5*n}% affinity`,faiblesse:n=>`+${15*n}% affinity on weak points`,
 crit_boost:()=>"Crits at +40% instead of +25%",statut:n=>`+${20*n}% poison buildup`,tranchant:n=>`${20*n}% chance not to dull`,
 esquive:n=>`Dodge −${5*n} stamina, momentum +${20+10*n}%`,endurance:n=>`+${15*n} max stamina, +${6*n} recovered per turn`,sante:n=>`+${15*n} max HP`,
 garde:n=>`Guard: +${10*n}% blocked on big hits, counter +${25+10*n}%`,bouchons:()=>"Immune to roars",res_feu:()=>"Immune to burn",
 res_poison:()=>"Immune to poison",res_glace:()=>"Immune to frost",res_foudre:()=>"Immune to paralysis",elem:n=>`+${8*n}% elemental damage`,
 depeceur:()=>"+1 carve after a kill",capture:()=>"+1 capture reward",agitateur:n=>`Enraged monster: +${5*n} attack, +${7*n}% affinity`,
 volonte:()=>"Once per hunt, a fatal blow leaves you at 1 HP",
 artillerie:n=>`Fixed damage +${12*n}%${n>=3?", Cannon breath −1 turn":''}`,concentration:n=>`Gauges +${20*n}% faster, charging −${2*n} stamina`,
 prolong:n=>`Weapon effects +${3*n} turns, coatings +${n} shot${n!==1?'s':''}`,chargeur:n=>`+${n} round${n!==1?'s':''} per magazine, shells +${n}`,tir:n=>`Shots +${6*n}% damage`};
const SK_ORDER=['attaque','critique','faiblesse','crit_boost','elem','statut','agitateur','tranchant','sante','endurance','esquive','garde','artillerie','concentration','prolong','chargeur','tir','volonte','bouchons','res_feu','res_poison','res_glace','res_foudre','depeceur','capture'];
function skEffect(k,n){return SKFX[k]?SKFX[k](Math.max(1,n)):SKILLS[k].d;}
const JEWELS=[
 {id:'j_bouch',n:"Silence Jewel",sz:1,sk:'bouchons',mon:'grakku'},{id:'j_esq',n:"Feather Jewel",sz:1,sk:'esquive',mon:'grakku'},{id:'j_tran',n:"Sharp Jewel",sz:1,sk:'tranchant',mon:'grakku'},
 {id:'j_feu',n:"Fireproof Jewel",sz:1,sk:'res_feu',mon:'brontal'},{id:'j_vie',n:"Vital Jewel",sz:1,sk:'sante',mon:'brontal'},
 {id:'j_poi',n:"Antidote Jewel",sz:1,sk:'res_poison',mon:'velyra'},{id:'j_ven',n:"Venom Jewel",sz:1,sk:'statut',mon:'velyra'},
 {id:'j_gel',n:"Thaw Jewel",sz:1,sk:'res_glace',mon:'glacimorde'},{id:'j_gar',n:"Bulwark Jewel",sz:1,sk:'garde',mon:'glacimorde'},
 {id:'j_iso',n:"Insulate Jewel",sz:1,sk:'res_foudre',mon:'fulgor'},{id:'j_sou',n:"Breath Jewel",sz:1,sk:'endurance',mon:'fulgor'},
 {id:'j_son',n:"Dream Jewel",sz:1,sk:'concentration',mon:'selenis'},{id:'j_epi',n:"Thorn Jewel",sz:2,sk:'garde',pts:2,mon:'herissaure'},{id:'j_ecu',n:"Foam Jewel",sz:2,sk:'prolong',pts:2,mon:'nacrelle'},{id:'j_sis',n:"Quake Jewel",sz:2,sk:'attaque',pts:2,mon:'sismorak'},{id:'j_lun',n:"Moonblade Jewel",sz:2,sk:'critique',pts:2,mon:'tranchelune'},{id:'j_fre',n:"Frenzy Jewel",sz:3,sk:'agitateur',pts:2,mon:'gorgovire'},{id:'j_det',n:"Blast Jewel",sz:3,sk:'artillerie',pts:2,mon:'pyroclaste'},
 {id:'j_lar',n:"Thief Jewel",sz:1,sk:'capture',mon:'rapinoux'},{id:'j_con',n:"Focus Jewel",sz:1,sk:'concentration',mon:'grakku'},{id:'j_art',n:"Powder Jewel",sz:1,sk:'artillerie',mon:'brontal'},{id:'j_pro',n:"Duration Jewel",sz:1,sk:'prolong',mon:'velyra'},
 {id:'j_chg',n:"Magazine Jewel",sz:1,sk:'chargeur',mon:'scoriak'},{id:'j_tir',n:"Marksman Jewel",sz:1,sk:'tir',mon:'fulgor'},
 {id:'j_atk',n:"Strength Jewel",sz:2,sk:'attaque',mon:'brontal'},{id:'j_cri',n:"Precision Jewel",sz:2,sk:'critique',mon:'velyra'},{id:'j_ele',n:"Element Jewel",sz:2,sk:'elem',mon:'glacimorde'},
 {id:'j_mag',n:"Magma Jewel",sz:2,sk:'sante',pts:2,mon:'scoriak'},{id:'j_trq',n:"Tracker Jewel",sz:2,sk:'esquive',pts:2,mon:'boregor'},{id:'j_vor',n:"Ravenous Jewel",sz:2,sk:'agitateur',pts:2,mon:'devoreur'},{id:'j_bmb',n:"Burst Jewel",sz:2,sk:'elem',pts:2,mon:'bombardier'},{id:'j_tmp',n:"Tempest Jewel",sz:2,sk:'faiblesse',pts:2,mon:'tempestaire'},{id:'j_fai',n:"Rift Jewel",sz:2,sk:'faiblesse',mon:'fulgor'},{id:'j_agi',n:"Wrath Jewel",sz:2,sk:'agitateur',mon:'fulgor'},
 {id:'j_atk3',n:"Mastery Jewel",sz:3,sk:'attaque',pts:2,mon:'ferroi'},{id:'j_cri3',n:"Iron Eye Jewel",sz:3,sk:'critique',pts:2,mon:'ferroi'},{id:'j_cb3',n:"Guardbreak Jewel",sz:3,sk:'crit_boost',mon:'ferroi'},
 {id:'j_art2',n:"Mortar Jewel",sz:2,sk:'artillerie',pts:2,mon:'bombardier'},{id:'j_tir2',n:"Gust Jewel",sz:2,sk:'tir',pts:2,mon:'tempestaire'},{id:'j_con2',n:"Trance Jewel",sz:2,sk:'concentration',pts:2,mon:'boregor'},
 {id:'j_ecl',n:"Eclipse Jewel",sz:3,sk:'faiblesse',pts:2,mon:'abyssaure'}];
function jewelRecipe(j){const o=ZONE_ORE[j.mon];if(MON[j.mon].mrOnly)return{mats:{arare:1,rare:1},res:{dracite:2},z:1200};return j.sz===1?{mats:{rare:1,ecaille:2},res:{[o]:1},z:150}:j.sz===2?{mats:{rare:2,tete:1},res:{[o]:2},z:400}:{mats:{xrare:1,rare:1},res:{dracite:2},z:900};}
const MEALS=[
 {id:'none',n:"No meal",p:0,d:"Head out on an empty stomach."},
 {id:'brochettes',n:"Hunter’s skewers",p:60,hp:30,d:"+30 max HP"},
 {id:'ragout',n:"Mountain stew",p:60,st:30,d:"+30 max stamina"},
 {id:'gratin',n:"Griffu gratin",p:90,atkPct:.08,d:"+8% attack"},
 {id:'bouillon',n:"Armored broth",p:80,def:25,d:"+25 defense"},
 {id:'festin',n:"Hunter’s feast",p:220,hp:20,st:20,atkPct:.05,def:15,d:"+20 HP, +20 stamina, +5% attack, +15 defense"}];
const FELYNE=[
 {id:'depeceur',n:"Carver Griffu",d:"+1 carve"},
 {id:'chance',n:"Lucky Griffu",d:"+1 quest reward"},
 {id:'econome',n:"Thrifty Griffu",d:"25% chance not to use up an item"}];

const QUESTS=[
 {id:'q1',mon:'grakku',stars:1,title:"The rock thief",turns:40,z:450,obj:[{id:'b:tete',n:"Break the beak"},{id:'fast:25',n:"Finish in under 25 turns"}],d:"A Grakku is raiding the eggs at the pass farm. Hunt or capture it."},
 {id:'q2',mon:'brontal',stars:2,title:"Blaze on the plain",turns:45,z:800,obj:[{id:'b:queue',n:"Sever the tail"},{id:'capture',n:"Capture the Brontal"}],d:"A starving Brontal is setting the pastures ablaze. Its massive tail sweeps everything behind it."},
 {id:'q12',mon:'rapinoux',stars:1,title:"The peak pilferer",turns:40,z:520,obj:[{id:'b:tete',n:"Break the crest"},{id:'fast:25',n:"Finish in under 25 turns"}],d:"A Rapinoux is robbing Guild convoys in the forest. It steals anything shiny, and anything edible."},
 {id:'q13',mon:'selenis',stars:3,title:"Wings of twilight",turns:50,z:1300,obj:[{id:'b:flanc',n:"Tear the wings"},{id:'nofaint',n:"No fainting"}],d:"A Selenis puts the pass shepherds to sleep at nightfall. Its silver powder will knock you out: dodge it."},
 {id:'q14',mon:'herissaure',stars:5,title:"The bristling back",turns:55,z:2000,obj:[{id:'b:queue',n:"Break the club tail"},{id:'fast:35',n:"Finish in under 35 turns"}],d:"A Bristlesaur is blocking the road to the Ashlands. When it bristles, every melee hit hurts you: break its spines with blunt damage, or shoot from range."},
 {id:'q3',mon:'velyra',stars:3,title:"The venomous queen",turns:50,z:1200,obj:[{id:'b:flanc',n:"Tear the wings"},{id:'b:queue',n:"Sever the tail"}],d:"Velyra has nested above the village. Beware its poison tail and its dives."},
 {id:'q7',mon:'scoriak',stars:4,title:"The ember shell",turns:55,z:1600,obj:[{id:'b:flanc',n:"Break the shell"},{id:'b:queue',n:"Break the club tail"}],d:"A Scoriak is gnawing at the lava flows of the Ashlands. When its shell ignites, it deflects blades: aim for its jaw or break the shell."},
 {id:'q8',mon:'boregor',stars:5,title:"Lord of the snows",turns:60,z:2400,obj:[{id:'b:tete',n:"Break the fangs"},{id:'nofaint',n:"No fainting"}],d:"A Boregor rules the Frozen Tundra. When it burrows under the snow, get ready: it bursts up beneath your feet. A well-timed trap catches it as it emerges."},
 {id:'q9',mon:'devoreur',stars:7,title:"Insatiable hunger",turns:70,z:5200,obj:[{id:'b:tete',n:"Break the maw"},{id:'nofaint',n:"No fainting"}],d:"The Devourer, a roaming predator that’s never sated, is ravaging Brume Valley. It grabs prey in its maw: struggle free with enough stamina, or count on your Griffu to free you."},
 {id:'q4',mon:'glacimorde',stars:4,title:"Under the eternal ice",turns:55,z:1600,obj:[{id:'b:tete',n:"Break the tusks"},{id:'nofaint',n:"No fainting"}],d:"A Glacimaw glides across the frozen lakes of the north. When the air turns icy, flee or interrupt it."},
 {id:'q5',mon:'fulgor',stars:5,title:"Fangs of the storm",turns:60,z:2200,obj:[{id:'b:tete',n:"Break the horns"},{id:'fast:40',n:"Finish in under 40 turns"}],d:"Fulgor, the thunder wolf, prowls the crests. When overcharged, it strikes twice as fast."},
 {id:'q6',mon:'ferroi',stars:6,final:1,title:"Oaths at the end of the world",turns:70,z:4500,obj:[{id:'plates:4',n:"Break 4 iron plates"},{id:'nofaint',n:"No fainting"}],d:"The Iron King has awoken in the Ruined Citadel. Its forged plates deflect blades; break them to reach the flesh. The Guild has mounted a ballista on the ramparts."}];

const FEM={velyra:1,tranchelune:1};
const TIER_N={1:"Rank 1",2:"Rank 2",3:"Rank 3 · Elite hunts"};
const ELITE_Q=[['grakku',7,"Wrath of the pass",62],['brontal',7,"Land of ashes",64],['velyra',7,"Queen of storms",66],['glacimorde',8,"The eternal frost",68],['fulgor',8,"The endless storm",70],['ferroi',8,"The last oath",75],['scoriak',8,"Heart of the ashes",68],['boregor',8,"The endless winter",70],['rapinoux',7,"King of thieves",62],['selenis',8,"The endless night",66],['herissaure',8,"The fortress of thorns",68]];
ELITE_Q.forEach(([mon,st,title,turns],i)=>QUESTS.push({id:'e'+(i+1),mon,elite:1,stars:st,title,turns,z:3000+i*700,final:mon==='ferroi'?0:0,
 obj:[{id:'b:tete',n:"Break the head"},{id:i%2?'nofaint':'fast:'+Math.round(turns*.6),n:i%2?"No fainting":`Finish in under ${Math.round(turns*.6)} turns`}],
 d:`An elite hunt: ${({selenis:"a veteran Selenis",herissaure:"a veteran Bristlesaur",rapinoux:"a veteran Rapinoux",grakku:"a veteran Grakku",brontal:"a veteran Brontal",velyra:"a veteran Velyra",glacimorde:"a veteran Glacimaw",scoriak:"a veteran Scoriak",boregor:"a veteran Boregor",fulgor:"a veteran Fulgor",ferroi:"the veteran Iron King"})[mon]}, tougher, faster, with an attack you’ve never seen.`}));
{const e7=QUESTS.find(q=>q.id==='e7');if(e7)e7.z=5100;const e8=QUESTS.find(q=>q.id==='e8');if(e8)e8.z=6000;}
QUESTS.push({id:'q15',mon:'nacrelle',stars:7,title:"The dancing foam",turns:70,z:5000,obj:[{id:'b:tete',n:"Break the crest"},{id:'nofaint',n:"No fainting"}],d:"A Nacrelle has settled in the Nacre Lagoon. Its bubbles make you slip: a dodge shakes them off. When it sucks in water, get away from the front."});
QUESTS.push({id:'q16',mon:'sismorak',stars:8,title:"The step that splits the ice",turns:72,z:6400,obj:[{id:'b:tete',n:"Break the tusks"},{id:'fast:50',n:"Finish in under 50 turns"}],d:"A Sismorak is heading down to the tundra villages. When it rears, Quake knocks everyone down: guard or dodge at the right moment."});
QUESTS.push({id:'q17',mon:'tranchelune',stars:9,title:"Blades beneath the moon",turns:75,z:8200,obj:[{id:'b:queue',n:"Sever the blade tail"},{id:'nofaint',n:"No fainting"}],d:"A Moonreaver hunts in the Ruined Citadel. When it freezes in Counter stance, whatever you do, don’t strike it: wait for it to come out."});
QUESTS.push({id:'q10',mon:'bombardier',stars:8,title:"Rain of fire",turns:70,z:6800,obj:[{id:'b:flanc',n:"Break the wings"},{id:'nofaint',n:"No fainting"}],d:"A Bombardier flies over the Ashlands, scattering explosive scales on the Guild’s trails. They explode the next turn: never stay in a zone where they glow."});
QUESTS.push({id:'q11',mon:'tempestaire',stars:9,final:1,title:"Eye of the storm",turns:80,z:9500,obj:[{id:'b:tete',n:"Break the horns"},{id:'nofaint',n:"No fainting"}],d:"The Tempestar, an elder dragon, unleashes storms over the Stormy Crests. In the storm, your blades are deflected and lightning strikes where you stand: keep moving, and strike when the sky calms."});
QUESTS.push({id:'train',mon:'pantin',training:1,stars:0,title:"Training Grounds",turns:999,z:0,obj:[],d:"Practice on a dummy that never fights back."});
QUESTS.push({id:'q3c',mon:'velyra',stars:3,capture:1,title:"Capture: queen of the peaks",turns:50,z:1500,obj:[{id:'nofaint',n:"No fainting"}],d:"The Guild wants to study Velyra alive. Weaken it, trap it and put it to sleep: killing it fails the quest."});
const GQ=[['g1',1,'vallee','fer',5,24,"Iron for the forge","The blacksmith is short on ore. Bring back iron ore from Brume Valley."],
 ['g2',2,'toundra','cristal',6,24,"Crystals of the far north","An alchemist wants ice crystals from the Frozen Tundra."],
 ['g3',3,'ruines','tonnerre',5,24,"Storm stones","The Guild’s artisans need thunderstones from the Crests."],
 ['g4',4,'vallee','c_kel',5,24,"Coveted shells","An armorer pays well for Keleboss shells from deep in the Valley."],
 ['g5',5,'volcan','ardente',8,24,"Live embers","The village forge must be relit: bring back fire stones."],
 ['g6',6,'ruines','dracite',6,24,"Heart of the citadel","The scholars want dracite, mined from deep within the ruins."],
 ['g7',7,'lagon','c_pin',6,24,"Claws on the menu","The canteen cook wants Pincharde claws from the Nacre Lagoon for a new dish."],
 ['g8',8,'toundra','c_ping',8,24,"Furs for the deep cold","The Guild’s tailors are making linings for Master Rank: bring back Pingrelot fur."],
 ['g9',9,'cratere','dracite',10,24,"Shards of the Eclipse","The scholars want the black dracite that surfaces deep in the Eclipse Crater."]];
for(const[id,t,zone,k,n,h,title,d]of GQ)QUESTS.push({id,gather:1,tier:t,zone,goal:{k,n},hours:h,title,d,stars:t,z:250*t,obj:[]});
const CARVE=[['ecaille',42],['peau',30],['griffe',20],['rare',8]];
const CAPT=[['ecaille',26],['peau',22],['griffe',20],['tete',12],['queue',12],['rare',8]];

const MON={
grakku:{hab:'col',name:"Grakku",kind:"Bird wyvern",rank:1,hp:900,lv:15,col:'#c49a6c',col2:'#7aa0b8',shape:'bird',roar:"Piercing cry",
 lore:"A crafty bird wyvern that picks up rocks to shield its head. Ideal for learning to read a monster’s intentions.",
 weak:{feu:.5,glace:1,foudre:.5,dragon:.25},ko:90,flinch:150,poison:100,
 parts:{tete:{name:"Beak",cut:85,blunt:90,brk:.16},flanc:{name:"Legs",cut:55,blunt:50,brk:.2},queue:{name:"Plumage",cut:48,blunt:45,brk:.14}},
 mats:{ecaille:"Grakku scale",peau:"Grakku feather",griffe:"Grakku talon",tete:"Grakku beak",queue:"Tail feather",rare:"Polished beakstone"},
 moves:[
 {id:'poursuite',n:"Tracking peck",t:"It fixes you with one eye and stretches its neck toward you…",z:[],track:1,tier:'L',w:1.2},
 {id:'bec',n:"Beak strike",t:"It tilts its head forward…",z:['avant'],tier:'L',w:4},
 {id:'picore',n:"Frenzied pecking",t:"It hops nervously, beak raised…",z:['avant'],tier:'M',w:2,c:12},
 {id:'ruee',n:"Rush",t:"It puffs up its feathers and locks onto its target…",z:['avant','flanc'],tier:'M',w:2,after:'flip',open:1,c:14},
 {id:'bond',n:"Back hop",t:"It crouches, wings folded…",z:['avant'],tier:'L',w:1.5,after:'face'},
 {id:'ailes',n:"Wing flap",t:"It ruffles its wings…",z:['flanc','arriere'],tier:'L',w:2.5},
 {id:'rocher',n:"Rock pickup",t:"It scratches the ground, looking for a rock…",z:[],fx:'rock',w:2.5,cond:(m,H)=>!m.rock&&m.rockUses<2&&H.turn>2},
 {id:'frappeRoc',n:"Rock strike",t:"It lifts its rock above its head…",z:['avant','flanc'],tier:'H',w:5,cond:m=>m.rock>0}]},
brontal:{hab:'plaine',name:"Brontal",kind:"Brute wyvern",rank:2,hp:1150,lv:17,col:'#8a4b3a',col2:'#e07a3b',shape:'brute',roar:"Roar",
 lore:"A thick-skulled brute wyvern that breathes fire. Its tail can be severed, which shortens its reach.",
 weak:{feu:0,glace:1,foudre:.5,dragon:.5},ko:105,flinch:200,poison:105,
 parts:{tete:{name:"Head",cut:75,blunt:80,brk:.15},flanc:{name:"Legs",cut:50,blunt:50,brk:.2},queue:{name:"Tail",cut:62,blunt:45,sever:1}},
 mats:{ecaille:"Brontal scale",peau:"Brontal hide",griffe:"Brontal fang",tete:"Brontal skull",queue:"Brontal tail",rare:"Fire gland"},
 moves:[
 {id:'traque',n:"Tracking bite",t:"It tracks your every step, jaw half open…",z:[],track:1,tier:'L',w:1.2},
 {id:'morsure',n:"Bite",t:"It opens its maw wide…",z:['avant'],tier:'M',w:4},
 {id:'queue',n:"Tail sweep",t:"It swivels its hips, tail outstretched…",z:['arriere','flanc'],tier:'M',w:3,tail:1},
 {id:'pietine',n:"Stomp",t:"It raises a massive leg…",z:['flanc'],tier:'L',w:2.5},
 {id:'charge',n:"Brutal charge",t:"It lowers its head and paws the ground…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:15},
 {id:'inspire',n:"Fiery inhale",t:"Flames lick at its maw as it inhales deeply!",z:[],fx:'windup',chain:'rayon',w:1.5,cond:m=>m.hp<m.max*.85},
 {id:'rayon',n:"Fire beam",t:"A torrent of flame sweeps the front and flanks!",z:['avant','flanc'],tier:'X',st:'burn',w:0,c:15},
 {id:'frenesie',n:"Furious jaws",t:"It snaps its jaws as it advances…",z:['avant','flanc'],tier:'M',w:2.5,rage:1}]},
velyra:{hab:'foret',name:"Velyra",kind:"Flying wyvern",rank:3,hp:2550,lv:25,col:'#5f7d3a',col2:'#bccf5c',shape:'wyvern',roar:"Roar",
 lore:"Queen of the skies. Its tail distills a potent poison. A flash bomb brings it down when it’s flying.",
 weak:{feu:0,glace:.5,foudre:1,dragon:.5},ko:140,flinch:320,poison:250,
 parts:{tete:{name:"Head",cut:75,blunt:70,brk:.15},flanc:{name:"Wings",cut:58,blunt:48,brk:.18},queue:{name:"Tail",cut:60,blunt:42,sever:1}},
 mats:{ecaille:"Velyra scale",peau:"Velyra membrane",griffe:"Velyra talon",tete:"Velyra crown",queue:"Velyra stinger",rare:"Velyra plate"},
 moves:[
 {id:'cible',n:"Aimed fireball",t:"It turns its head to keep you in its sights…",z:[],track:1,tier:'L',st:'burn',w:1.2},
 {id:'rafcible',n:"Diving shot",t:"It tracks you from the air…",z:[],track:1,tier:'L',st:'burn',w:1.2,fly:1},
 {id:'boule',n:"Fireball",t:"It rears back and swells its throat…",z:['avant'],tier:'M',st:'burn',w:3},
 {id:'salto',n:"Venomous flip",t:"It tucks its tail beneath its body…",z:['arriere','flanc'],tier:'H',st:'poison',w:3,open:1,c:15,tail:1},
 {id:'morsure',n:"Bite",t:"It thrusts its head forward, fangs bared…",z:['avant'],tier:'L',w:2},
 {id:'ruee',n:"Rush",t:"It spreads its wings and rushes in…",z:['avant','flanc'],tier:'M',w:2,after:'flip'},
 {id:'triple',n:"Triple fireball",t:"Its throat glows in bursts…",z:['avant','flanc'],tier:'M',st:'burn',w:2,rage:1},
 {id:'envol',n:"Takeoff",t:"It spreads its wings and tears itself off the ground…",z:[],fx:'fly',w:1.5,cond:(m,H)=>H.turn>3},
 {id:'rafale',n:"Aerial gust",t:"It takes aim from the air, throat blazing…",z:['avant','flanc'],tier:'M',st:'burn',w:3,fly:1},
 {id:'pique',n:"Venomous dive",t:"It goes into a dive, talons first!",z:['avant','flanc','arriere'],tier:'H',st:'poison',w:2,fly:1,ends:1},
 {id:'atterrit',n:"Landing",t:"It folds its wings and comes back down…",z:['flanc'],tier:'L',w:1,fly:1,ends:1}]},
glacimorde:{hab:'glace',name:"Glacimaw",kind:"Leviathan",rank:4,hp:3650,lv:29,col:'#7fa6c4',col2:'#e3f2f8',shape:'levi',roar:"Icy bellow",
 lore:"A leviathan that glides on the ice. Its belly is soft. When it calls the blizzard, interrupt it or flee.",
 weak:{feu:1,glace:0,foudre:.5,dragon:.25},ko:160,flinch:400,poison:140,
 parts:{tete:{name:"Tusks",cut:65,blunt:82,brk:.16},flanc:{name:"Belly",cut:75,blunt:65,brk:.2},queue:{name:"Fin",cut:50,blunt:40,sever:1}},
 mats:{ecaille:"Glacimaw scale",peau:"Frozen hide",griffe:"Glacimaw claw",tete:"Glacimaw tusk",queue:"Tail fin",rare:"Eternal crystal"},
 moves:[
 {id:'jet',n:"Aimed ice jet",t:"It slowly turns to face you, nostrils frosted…",z:[],track:1,tier:'M',st:'gel',w:1.2},
 {id:'glisse',n:"Slide",t:"It drops onto its belly and braces itself…",z:['avant','flanc'],tier:'H',w:3,after:'flip',open:1,c:14},
 {id:'souffle',n:"Glacial breath",t:"Frost streams from its nostrils…",z:['avant'],tier:'M',st:'gel',w:3},
 {id:'queue',n:"Tail whip",t:"It curls its tail against its flank…",z:['arriere','flanc'],tier:'M',w:3,tail:1},
 {id:'morsure',el:'ice',n:"Frozen bite",t:"It thrusts its jaw forward, growling…",z:['avant'],tier:'L',w:2},
 {id:'blizzard',n:"Blizzard call",t:"The air freezes around it… a storm is brewing!",z:[],fx:'windup',chain:'tempete',w:1.5,cond:m=>m.hp<m.max*.75},
 {id:'tempete',n:"Ice storm",t:"A blizzard explodes all around it!",z:['avant','flanc','arriere'],tier:'X',st:'gel',w:0,c:15},
 {id:'pics',el:'ice',n:"Ice spikes",t:"The ground cracks under its feet…",z:['flanc','arriere'],tier:'M',w:2.5,rage:1},
 {id:'volte',n:"About-face",t:"It whips around sharply…",z:['arriere'],tier:'L',w:1.5,after:'face'}]},
scoriak:{hab:'plaine',name:"Scoriak",kind:"Armored beast",rank:4,hp:3400,lv:28,eHp:.88,col:'#5b4b45',col2:'#ff7a2a',shape:'shell',roar:"Volcanic rumble",
 lore:"An armored beast that feeds on cooled lava. When its shell ignites, it deflects attacks: only its jaw stays soft. Breaking the shell stops it from igniting again. It fears ice.",
 weak:{feu:0,glace:1,foudre:.5,dragon:.5},ko:150,flinch:380,poison:140,
 parts:{tete:{name:"Jaw",cut:72,blunt:76,brk:.15},flanc:{name:"Shell",cut:42,blunt:66,brk:.2},queue:{name:"Club tail",cut:55,blunt:48,brk:.16}},
 mats:{ecaille:"Scoriak plate",peau:"Scoriak hide",griffe:"Scoriak claw",tete:"Scoriak jaw",queue:"Scoriak club",rare:"Magma heart"},
 moves:[
 {id:'crachat',n:"Slag spit",t:"It puffs its cheeks full of lava and tracks you…",z:[],track:1,tier:'L',st:'burn',w:1.2},
 {id:'morsure',n:"Bite",t:"It opens its glowing jaw…",z:['avant'],tier:'M',w:3.5},
 {id:'massue',n:"Club strike",t:"It swings its club tail above the ground…",z:['arriere','flanc'],tier:'H',w:2.5},
 {id:'pietine',n:"Stomp",t:"It lifts a stocky leg…",z:['flanc'],tier:'L',w:2.5},
 {id:'belier',n:"Ram",t:"It pulls its head into its shell and paws the ground…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'embrase',n:"Molten shell",t:"Its shell cracks red, the heat becomes unbearable…",z:[],fx:'harden',w:2,cond:(m,H)=>!m.harden&&!m.parts.flanc.broken&&H.turn>2},
 {id:'roulade',n:"Lava roll",t:"It curls into a ball, shell white-hot!",z:['avant','flanc'],tier:'H',st:'burn',w:3,after:'flip',c:15,cond:m=>m.harden>0},
 {id:'dorsale',n:"Dorsal eruption",t:"Its shell rumbles, lava oozing from the cracks…",z:[],fx:'windup',chain:'pluie',w:1.3,cond:m=>m.hp<m.max*.7},
 {id:'pluie',n:"Slag rain",t:"Scorching slag rains down all around it!",z:['avant','flanc','arriere'],tier:'X',st:'burn',w:0,c:15},
 {id:'rage',n:"Volcanic jaw",t:"It snaps its jaws, spitting embers…",z:['avant','flanc'],tier:'M',st:'burn',w:2.5,rage:1}]},
boregor:{hab:'glace',name:"Boregor",kind:"Snow beast",rank:5,hp:5900,lv:35,col:'#c9d4dc',col2:'#7aa6c8',shape:'ape',roar:"Polar howl",
 lore:"A snow colossus with huge arms. It burrows under the snow to burst up beneath your feet: dodge at the right moment, or set a trap while it’s burrowed. It fears fire.",
 weak:{feu:1,glace:0,foudre:.5,dragon:.25},ko:170,flinch:440,poison:150,
 parts:{tete:{name:"Fangs",cut:74,blunt:80,brk:.14},flanc:{name:"Arms",cut:62,blunt:58,brk:.18},queue:{name:"Spine",cut:52,blunt:50,brk:.18}},
 mats:{ecaille:"Boregor fleece",peau:"Boregor hide",griffe:"Boregor claw",tete:"Boregor fang",queue:"Boregor spine",rare:"Ancestral frost"},
 moves:[
 {id:'boule',n:"Snowball",t:"It picks up a block of snow and aims at your position…",z:[],track:1,tier:'L',st:'gel',w:1.2},
 {id:'poings',n:"Hammering fists",t:"It raises both fists above its head…",z:['avant'],tier:'M',w:3.5},
 {id:'revers',n:"Backhand",t:"It swings a huge arm to the side…",z:['flanc','arriere'],tier:'M',w:3},
 {id:'bond',n:"Massive leap",t:"It gathers itself on its hind legs…",z:['avant','flanc'],tier:'H',w:2,after:'face',open:1,c:14},
 {id:'souffle',n:"Frozen breath",t:"Frost seeps from its maw…",z:['avant','flanc'],tier:'M',st:'gel',w:2.5},
 {id:'creuse',n:"Burrow",t:"It dives under the snow and vanishes!",z:[],fx:'burrow',w:1.6,cond:(m,H)=>H.turn>3&&!m.burrow&&m.hp<m.max*.92},
 {id:'surgit',el:'ice',n:"Eruption",t:"The snow heaves beneath your feet!",z:[],track:1,tier:'H',st:'gel',w:0,c:14},
 {id:'avalanche',n:"Avalanche call",t:"It pounds the ground: the mountain rumbles above you…",z:[],fx:'windup',chain:'eboul',w:1.3,cond:m=>m.hp<m.max*.6},
 {id:'eboul',n:"Avalanche",t:"An avalanche sweeps down over the whole arena!",z:['avant','flanc','arriere'],tier:'X',st:'gel',w:0,c:15},
 {id:'furie',n:"Snow fury",t:"It slams the ground with both fists, howling…",z:['avant','flanc'],tier:'H',w:2,rage:1}]},
devoreur:{aHp:1.15,hab:'foret',name:"Devourer",kind:"Roaming wyvern",rank:7,hp:10500,lv:54,noElite:1,danger:1,col:'#4f5a3a',col2:'#c8322a',shape:'brute',roar:"Hungry roar",
 lore:"A roaming predator, never sated, master of Brume Valley. It grabs prey in its maw: struggle free (using stamina) or count on your Griffu to free you before it crushes you. Unpredictable: when the ground shakes and small monsters flee, head back to camp.",
 weak:{feu:.5,glace:.25,foudre:1,dragon:.75},ko:230,flinch:700,poison:260,
 parts:{tete:{name:"Maw",cut:75,blunt:80,brk:.12},flanc:{name:"Legs",cut:58,blunt:55,brk:.17},queue:{name:"Tail",cut:64,blunt:50,sever:1}},
 mats:{ecaille:"Ravenous scale",peau:"Ravenous hide",griffe:"Ravenous claw",tete:"Devourer fang",queue:"Devourer tail",rare:"Insatiable stomach"},
 moves:[
 {id:'traque',n:"Tracking bite",t:"It follows you, snapping its jaws…",z:[],track:1,tier:'M',w:1.2},
 {id:'morsure',n:"Ravenous bite",t:"It opens an enormous maw…",z:['avant'],tier:'H',w:3},
 {id:'queue',n:"Tail strike",t:"It swings its bulk around, tail outstretched…",z:['arriere','flanc'],tier:'M',w:3,tail:1},
 {id:'pietine',n:"Stomp",t:"It pounds the ground with its feet…",z:['avant','flanc'],tier:'M',w:2.5},
 {id:'saisie',n:"Grab",t:"It leans in, drooling, ready to snatch you…",z:['avant','flanc'],tier:'M',grab:1,w:2.2,cond:(m,H)=>!H.grab&&H.turn>2},
 {id:'broyage',n:"Crushing jaws",t:"It clamps its prey between its jaws!",z:[],track:1,tier:'X',w:0},
 {id:'charge',n:"Hungry charge",t:"It lowers its head and charges straight ahead…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:15},
 {id:'souffle',n:"Devouring breath",t:"A red glow rises in its throat…",z:[],fx:'windup',chain:'rayon',w:1.3,cond:m=>m.hp<m.max*.8},
 {id:'rayon',n:"Draconic beam",t:"A torrent of red energy sweeps the front and flanks!",z:['avant','flanc'],tier:'X',w:0,c:15},
 {id:'frenesie',n:"Frenzy",t:"It rears up and crashes down with all its weight!",z:['avant','flanc','arriere'],tier:'M',w:2,rage:1,c:12}]},
fulgor:{hab:'crete',name:"Fulgor",kind:"Fanged beast",rank:5,hp:5050,lv:36,col:'#4c6a8a',col2:'#f2d34a',shape:'beast',roar:"Howl",
 lore:"The thunder wolf. It overcharges itself with energy: faster and stronger, but its head becomes vulnerable. Stunning it or breaking its horns ends the overcharge.",
 weak:{feu:.25,glace:1,foudre:0,dragon:.5},ko:170,flinch:470,poison:150,
 parts:{tete:{name:"Horns",cut:72,blunt:78,brk:.14},flanc:{name:"Legs",cut:55,blunt:55,brk:.2},queue:{name:"Tail",cut:62,blunt:50,sever:1}},
 mats:{ecaille:"Fulgor scale",peau:"Fulgor fur",griffe:"Fulgor claw",tete:"Fulgor horn",queue:"Fulgor tail",rare:"Storm jade"},
 moves:[
 {id:'eclair',el:'bolt',n:"Aimed lightning",t:"Its horns crackle and point at you…",z:[],track:1,tier:'L',w:1.2},
 {id:'griffe',el:'bolt',n:"Claw swipe",t:"It raises a charged paw…",z:['avant','flanc'],tier:'M',w:3},
 {id:'bond',n:"Lightning leap",t:"It crouches, hind legs tensed…",z:['avant'],tier:'H',w:2,after:'face'},
 {id:'queue',n:"Tail hammer",t:"It raises its tail above its back…",z:['arriere'],tier:'M',w:2.5,tail:1},
 {id:'morsure',n:"Bite",t:"It hunches low, fangs gleaming…",z:['avant'],tier:'L',w:2},
 {id:'charge',n:"Overcharge",t:"Thunderbugs swarm toward it… it’s charging up!",z:[],fx:'charge',w:2,cond:(m,H)=>!m.charged&&H.turn>2},
 {id:'eclairs',n:"Lightning rain",t:"It raises its head; the air crackles all around…",z:['avant','flanc','arriere'],tier:'H',st:'para',w:2,chg:1,c:14},
 {id:'ruee',el:'bolt',n:"Electric rush",t:"It growls, mane bristling with sparks…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,chg:1,c:15},
 {id:'saut',n:"Arc jump",t:"It leaps over you!",z:['flanc'],tier:'M',w:1.5,after:'flip'}]}};
MON.ferroi={aLv:-4,hab:'citadelle',name:"Iron King",kind:"Elder dragon",rank:6,hp:6800,lv:42,col:'#4a4e57',col2:'#ff7a1a',shape:'dragon',roar:"Steel roar",elder:1,plated:1,phases:1,
 lore:"An elder dragon covered in forged plates. The iron repels blades, but a broken plate leaves the flesh bare for a while. Mortally wounded, its forge heart ignites and the arena floor turns molten. It conducts lightning.",
 weak:{feu:.25,glace:.5,foudre:1,dragon:.5},ko:200,flinch:560,poison:220,
 parts:{tete:{name:"Crown",cut:70,blunt:80,brk:.12},flanc:{name:"Mail",cut:68,blunt:66,brk:.16},queue:{name:"Mace tail",cut:62,blunt:55,sever:1}},
 mats:{ecaille:"Ancient iron scale",peau:"Forged hide",griffe:"Iron claw",tete:"Iron King’s crown",queue:"Mace tail",rare:"Forge heart"},
 moves:[
 {id:'eclats',n:"Iron shards",t:"It shakes its plates: shards whistle toward you…",z:[],track:1,tier:'L',w:1.2},
 {id:'griffe',n:"Iron claw",t:"It raises an armored paw…",z:['avant','flanc'],tier:'M',w:3},
 {id:'morsure',n:"Steel bite",t:"It lowers its crown, jaws open…",z:['avant'],tier:'M',w:2.5},
 {id:'queue',n:"Mace tail",t:"It coils its iron-weighted tail…",z:['arriere','flanc'],tier:'H',w:2.5,tail:1},
 {id:'charge',n:"Steel charge",t:"It crouches, plates clanking, and fixes on its target…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:15},
 {id:'seisme',n:"Quake",t:"It rears up on its hind legs, ready to crash down!",z:['avant','flanc','arriere'],tier:'M',w:1.5,c:12},
 {id:'renforce',n:"The iron reforms",t:"Its broken plates glow red and weld back together…",z:[],fx:'plate',w:2.5,p1:1,cond:m=>m.plates&&Object.values(m.plates).some(p=>p.hp<p.max*.5)},
 {id:'forge',n:"Forge breath",t:"Its throat turns white-hot; the air shimmers with heat!",z:[],fx:'windup',chain:'vague',w:1.2,cond:m=>m.hp<m.max*.8},
 {id:'vague',n:"Wave of molten iron",t:"A flood of molten metal sweeps the front and flanks!",z:['avant','flanc'],tier:'X',st:'burn',w:0,c:15},
 {id:'fusion',n:"Forge heart",t:"Its chest ignites: the plates melt, the ground starts to glow red!",z:ALLZ,fx:'phase',w:0},
 {id:'scories',n:"Slag jet",t:"It spits a spray of scorching slag straight at you…",z:[],track:1,tier:'M',st:'burn',w:1.5,p2:1},
 {id:'marteau',n:"Forge hammer",t:"It brings down both red-hot paws…",z:['avant','flanc'],tier:'H',st:'burn',w:2.5,p2:1},
 {id:'coulee',n:"Call of the flow",t:"The metal boils beneath its feet… everything is about to ignite!",z:[],fx:'windup',chain:'deluge',w:1.3,p2:1},
 {id:'deluge',n:"Deluge of iron",t:"A tide of molten iron floods the whole arena!",z:['avant','flanc','arriere'],tier:'X',st:'burn',w:0,c:15}]};
MON.bombardier={hab:'plaine',name:"Bombardier",kind:"Flying wyvern",rank:8,hp:12800,lv:64,noElite:1,col:'#6b3a34',col2:'#ffb04a',shape:'wyvern',roar:"Thundering roar",
 lore:"A flying wyvern covered in explosive scales. It scatters them across the field: they glow, then explode the next turn, even before it acts. Leave the zone or dodge. Breaking its wings reduces its drops. It fears thunder.",
 weak:{feu:0,glace:.5,foudre:1,dragon:.5},ko:240,flinch:760,poison:260,
 parts:{tete:{name:"Head",cut:74,blunt:78,brk:.12},flanc:{name:"Wings",cut:62,blunt:52,brk:.16},queue:{name:"Tail",cut:64,blunt:48,sever:1}},
 mats:{ecaille:"Explosive scale",peau:"Bombardier membrane",griffe:"Bombardier talon",tete:"Bombardier skull",queue:"Bombardier tail",rare:"Detonating gland"},
 moves:[
 {id:'ecaille',n:"Scale toss",t:"It flicks a glowing scale your way…",z:[],track:1,tier:'M',st:'burn',w:1.2},
 {id:'morsure',n:"Bite",t:"It thrusts its maw forward, fangs smoking…",z:['avant'],tier:'M',w:3},
 {id:'queue',n:"Flail tail",t:"It swings its scale-studded tail around…",z:['arriere','flanc'],tier:'H',w:2.5,tail:1},
 {id:'charge',n:"Winged rush",t:"It spreads its wings and rushes low over the ground…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'largage',n:"Scale drop",t:"It shakes its wings: white-hot scales rain down around it!",z:[],fx:'mines',w:3.2,cond:m=>!m.mines},
 {id:'tapis',n:"Carpet bombing",t:"It rears up and scatters scales across the whole arena!",z:[],fx:'mines',all:1,w:2,rage:1,cond:m=>!m.mines},
 {id:'envol',n:"Takeoff",t:"It beats its wings and rises above the arena…",z:[],fx:'fly',w:1.3,cond:(m,H)=>H.turn>4},
 {id:'bombarde',n:"Bombardment",t:"From high above, it drops a rain of scales…",z:[],fx:'mines',fly:1,w:3,cond:m=>!m.mines},
 {id:'rafale',n:"Aerial breath",t:"It takes aim from the air, throat glowing…",z:['avant','flanc'],tier:'M',st:'burn',w:2,fly:1},
 {id:'pique',n:"Explosive dive",t:"It folds its wings and dives, covered in scales ready to blow!",z:['avant','flanc','arriere'],tier:'H',st:'burn',w:2,fly:1,ends:1,c:14},
 {id:'explose',n:"Explosive scales",t:"The scales explode!",z:[],tier:'H',st:'burn',w:0}]};
MON.tempestaire={aHp:.93,hab:'crete',name:"Tempestar",kind:"Elder dragon",rank:9,hp:15800,lv:70,noElite:1,elder:1,col:'#7f93ad',col2:'#cfe4ff',shape:'dragon',roar:"Howl of the winds",
 lore:"An elder dragon that commands storms. When it summons them, a furious wind repels blades and lightning strikes where you stand, even before it acts: move or dodge. When the storm dies down, it is left exposed. Breaking its horns weakens its storms; poison dispels them faster. It fears the Dragon element.",
 weak:{feu:.5,glace:.5,foudre:0,dragon:1},ko:260,flinch:880,poison:240,
 parts:{tete:{name:"Horns",cut:72,blunt:80,brk:.11},flanc:{name:"Wings",cut:64,blunt:56,brk:.16},queue:{name:"Tail",cut:66,blunt:50,sever:1}},
 mats:{ecaille:"Tempest scale",peau:"Tempestar hide",griffe:"Tempestar claw",tete:"Tempestar horn",queue:"Tempestar tail",rare:"Heart of storms"},
 moves:[
 {id:'eclair',n:"Aimed lightning",t:"It raises its head toward you, horns crackling…",z:[],track:1,tier:'M',st:'para',w:1},
 {id:'griffe',n:"Wind claws",t:"It raises a paw wrapped in gusts…",z:['avant','flanc'],tier:'M',w:3},
 {id:'morsure',n:"Bite",t:"It lowers its head, maw half open…",z:['avant'],tier:'M',w:2.5},
 {id:'queue',n:"Storm lash",t:"It whips its tail around with a whistle…",z:['arriere','flanc'],tier:'H',w:2.5,tail:1},
 {id:'charge',n:"Wind rush",t:"It crouches, wings pressed flat, and fixes on its target…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'souffle',n:"Cyclonic breath",t:"The air contracts in front of its maw…",z:['avant'],tier:'H',w:2},
 {id:'invoque',n:"Call of the storm",t:"It spreads its wings and howls at the sky: the clouds swirl!",z:[],fx:'storm',w:3.5,cond:(m,H)=>!m.storm&&!m.stormCd&&H.turn>2},
 {id:'rafale',n:"Whirling gust",t:"The wind suddenly picks up all around it!",z:['avant','flanc','arriere'],tier:'M',w:2,cond:m=>m.storm>0,c:10},
 {id:'tornade',n:"Eye of the tornado",t:"It rises into the heart of the vortex… a tornado is forming!",z:[],fx:'windup',chain:'ouragan',w:1.6,cond:m=>m.storm>=2&&m.hp<m.max*.8},
 {id:'ouragan',n:"Hurricane",t:"A devastating tornado sweeps the whole arena!",z:['avant','flanc','arriere'],tier:'X',w:0,c:15},
 {id:'fureur',n:"Fury of the skies",t:"It howls, and lightning rains down in bursts before it…",z:['avant','flanc'],tier:'H',st:'para',w:2,rage:1},
 {id:'foudre_t',n:"Storm lightning",t:"Lightning strikes!",z:[],tier:'H',w:0}]};
MON.abyssaure={hab:'eclipse',name:"Abyssaur",kind:"Elder dragon of the depths",rank:10,hp:23300,lv:84,noElite:1,elder:1,mrOnly:1,col:'#2a2433',col2:'#b28cff',shape:'dragon',roar:"Howl of the void",
 lore:"An elder dragon risen from the depths of the world, its obsidian scales split by violet light. It swallows light: during the Eclipse, you can’t see where it strikes, only hear sounds in the dark. A flash bomb tears through the Eclipse and exposes it. Breaking its crystal horns shortens the Eclipse. When wounded, it gathers a Black sun: make it flinch or dodge the Void. It fears Thunder.",
 weak:{feu:.5,glace:.25,foudre:1,dragon:0},ko:320,flinch:1100,poison:300,
 parts:{tete:{name:"Crystal horns",cut:70,blunt:78,brk:.1},flanc:{name:"Wings",cut:62,blunt:55,brk:.15},queue:{name:"Tail",cut:64,blunt:52,sever:1}},
 mats:{ecaille:"Obsidian scale",peau:"Abyssal hide",griffe:"Abyssal claw",tete:"Crystal horn",queue:"Abyssal tail",rare:"Eclipse heart"},
 moves:[
 {id:'griffe',n:"Obsidian claw",t:"It raises a paw with crystal claws…",z:['avant','flanc'],tier:'M',w:3},
 {id:'morsure',n:"Abyssal bite",t:"It lowers its head, maw glowing violet…",z:['avant'],tier:'H',w:2.5},
 {id:'queue',n:"Obsidian lash",t:"It swings its shard-studded tail…",z:['arriere','flanc'],tier:'H',w:2.5,tail:1},
 {id:'charge',n:"Rush from the depths",t:"It crouches, wings pressed flat, eyes fixed on you…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'rayon',n:"Abyss beam",t:"A violet glow gathers between its horns and tracks you…",z:[],track:1,tier:'H',w:1.5},
 {id:'cristaux',n:"Crystal rain",t:"It shakes its wings: amethyst shards fly all around…",z:['avant','flanc','arriere'],tier:'M',w:1.5,c:10},
 {id:'eclipse',n:"Eclipse",t:"It spreads its wings and swallows the light: the arena sinks into darkness!",z:[],fx:'eclipse',w:3.5,cond:(m,H)=>!m.eclipse&&!m.eclCd&&H.turn>2},
 {id:'absorbe',n:"Black sun",t:"It draws in all the light around it… the air vibrates!",z:[],fx:'windup',chain:'neant',w:1.5,cond:m=>m.hp<m.max*.55},
 {id:'neant',n:"Void",t:"A wave of pure darkness surges across the whole arena!",z:['avant','flanc','arriere'],tier:'X',w:0,c:16},
 {id:'fureur',n:"Wrath of the abyss",t:"It roars; the cracks in its scales blaze violet…",z:['avant','flanc'],tier:'H',w:2,rage:1}]};
MON.rapinoux={hab:'foret',name:"Rapinoux",kind:"Ape wyvern",rank:1,hp:1000,lv:16,col:'#b0643a',col2:'#e8c07a',shape:'ape',roar:"Shrill cackle",
 lore:"A russet, thieving ape wyvern that leaps from branch to branch. Its Theft snatches an item from your pouch: break its crest, stun it or finish it off to get it back. Given time, it nibbles your loot to heal: make it flinch.",
 weak:{feu:1,glace:.5,foudre:.5,dragon:.25},ko:95,flinch:160,poison:100,
 parts:{tete:{name:"Crest",cut:80,blunt:85,brk:.15},flanc:{name:"Arms",cut:60,blunt:55,brk:.2},queue:{name:"Bushy tail",cut:70,blunt:45,sever:1}},
 mats:{ecaille:"Russet fur",peau:"Rapinoux pelt",griffe:"Rapinoux claw",tete:"Rapinoux crest",queue:"Bushy tail",rare:"Stolen gem"},
 moves:[
 {id:'griffes',n:"Quick claws",t:"It rears up on its hind legs, arms spread…",z:['avant','flanc'],tier:'L',w:3.5},
 {id:'larcin',n:"Theft",t:"It eyes your pouch, fingers twitching…",z:['avant','flanc'],tier:'L',w:2.5,steal:1,cond:m=>!(m.loot&&m.loot.length>=2)},
 {id:'queue',n:"Tail strike",t:"It spins, its bushy tail whipping the air…",z:['arriere','flanc'],tier:'L',w:2.5,tail:1},
 {id:'noix',n:"Nut throw",t:"It rummages in its cheek and takes aim at you…",z:[],track:1,tier:'L',w:1.5},
 {id:'bond',n:"Branch leap",t:"It crouches, ready to leap over you…",z:['avant','flanc'],tier:'M',w:2,after:'flip',open:1,c:12},
 {id:'grignote',n:"Nibbling",t:"It pulls out your item and gets ready to devour it…",z:[],fx:'eat',w:4,cond:m=>!!(m.loot&&m.loot.some(k=>EDIBLE.includes(k)))},
 {id:'plongeon',n:"Dive from the branches",t:"It climbs a tree and watches you from above…",z:['avant','flanc','arriere'],tier:'M',w:1.2,c:12}]};
const EDIBLE=['mega','potion','steak'];
function stealItem(n){const m=H.m;m.loot=m.loot||[];const got=[];for(let i=0;i<n;i++){const c=['mega','potion','steak','flash'].filter(k=>ITEMS[k]&&pouchLeft(k)>0&&!ITEMS[k].sup);if(!c.length)break;const k=c[0]==='mega'&&rnd()<.5&&c[1]?c[1]:c[0];
  H.used[k]=(H.used[k]||0)+1;if(!H.q.training)S.items[k]=Math.max(0,(S.items[k]||0)-1);m.loot.push(k);got.push(ITEMS[k].n);}
 if(got.length){log(`🐒 ${m.d.name} steals from you: ${got.join(', ')}! Break its crest, stun it or finish it off to get it back.`,'bad');tip('larcin',"Stolen item: it keeps it until its head is broken or it is stunned or defeated. If it nibbles it, it heals and the item is lost: make it flinch when it gets ready to.");}
 else log(`🐒 ${m.d.name} rummages through your pouch but finds nothing to steal.`);}
function giveBack(why){const m=H.m;if(!m.loot||!m.loot.length)return;const n=m.loot.map(k=>ITEMS[k].n);for(const k of m.loot){H.used[k]=Math.max(0,(H.used[k]||0)-1);if(!H.q.training)S.items[k]=(S.items[k]||0)+1;}m.loot=[];H.pend.push([`🎒 ${why}: you recover ${n.join(', ')}.`,'good']);}
MON.selenis={hab:'col',name:"Selenis",kind:"Moth wyvern",rank:3,hp:3400,lv:27,col:'#b8c0e0',col2:'#6a6ab8',shape:'bird',roar:"Lunar chirr",
 lore:"A moth wyvern with moon-marked wings that only comes out at dusk. Its powder puts you to sleep: asleep, you lose a turn and the next hit you take deals 50% more damage. Dodge or guard against the powder. Tearing its wings weakens it.",
 weak:{feu:1,glace:.25,foudre:.75,dragon:.5},ko:130,flinch:300,poison:130,
 parts:{tete:{name:"Antennae",cut:80,blunt:85,brk:.14},flanc:{name:"Wings",cut:75,blunt:55,brk:.18},queue:{name:"Tail",cut:60,blunt:50,sever:1}},
 mats:{ecaille:"Lunar scale",peau:"Selenis wing",griffe:"Selenis claw",tete:"Selenis antenna",queue:"Selenis tail",rare:"Moonstone"},
 moves:[
 {id:'poudre',n:"Sleep powder",t:"It beats its wings at you: a silver powder sparkles…",z:['avant','flanc'],tier:'L',st:'sleep',w:2.4},
 {id:'ailes',n:"Wing flap",t:"It rises a little and brings its great wings down…",z:['flanc','arriere'],tier:'M',w:3},
 {id:'dard',n:"Tail stinger",t:"It curls its tail over its back…",z:['arriere'],tier:'M',w:2.2,tail:1},
 {id:'morsure',n:"Bite",t:"It stretches its neck, mandibles open…",z:['avant'],tier:'M',w:2.5},
 {id:'vol',n:"Glide",t:"It gathers speed, gliding straight at you…",z:['avant','flanc'],tier:'M',w:1.8,after:'flip',open:1,c:12},
 {id:'nuee',n:"Powder cloud",t:"It spins in place, wrapped in a silver cloud…",z:['avant','flanc','arriere'],tier:'L',st:'sleep',w:1,c:14,cond:m=>m.hp<m.max*.75},
 {id:'rayon_l',n:"Moonbeam",t:"Its antennae light up and turn toward you…",z:[],track:1,tier:'M',w:1.4}]};
MON.herissaure={hab:'plaine',name:"Bristlesaur",kind:"Spiny reptile",rank:4,hp:5400,lv:34,col:'#c8a060',col2:'#e8e0c8',shape:'brute',roar:"Rumble",
 lore:"A large reptile covered in spikes. When it bristles, striking in melee hurts you: blunt weapons break its spines, and ranged shots avoid them. Its club tail stuns.",
 weak:{feu:.75,glace:.5,foudre:1,dragon:.25},ko:150,flinch:380,poison:150,
 parts:{tete:{name:"Head",cut:72,blunt:80,brk:.13},flanc:{name:"Spiny back",cut:50,blunt:62,brk:.18},queue:{name:"Club tail",cut:55,blunt:48,brk:.15}},
 mats:{ecaille:"Ochre scale",peau:"Spiny hide",griffe:"Bristlesaur claw",tete:"Bristlesaur skull",queue:"Bristlesaur club",rare:"Pure bone spine"},
 moves:[
 {id:'morsure',n:"Bite",t:"It opens its maw wide as it advances…",z:['avant'],tier:'M',w:3},
 {id:'epaule',n:"Shoulder charge",t:"It plants its feet and swings its spiky shoulder…",z:['flanc'],tier:'M',w:2.5},
 {id:'massue',n:"Club tail",t:"It swings its heavy tail around behind it…",z:['arriere','flanc'],tier:'H',w:2.4,tail:1},
 {id:'roulade',n:"Spiny roll",t:"It curls into a ball, spines out, and takes aim at you…",z:['avant','flanc'],tier:'H',w:1.8,after:'flip',open:1,c:14},
 {id:'salve',n:"Spine volley",t:"It shakes its back and points its spikes at you…",z:[],track:1,tier:'M',w:1.6},
 {id:'herisse',n:"Bristling",t:"It puffs up its body: all its spines stand up!",z:[],fx:'bristle',w:3,cond:(m,H)=>!m.spikes&&!m.spikeCd&&H.turn>2}]};
MON.nacrelle={hab:'lagon',name:"Nacrelle",kind:"Fox leviathan",rank:7,hp:11000,lv:53,noElite:1,col:'#e8eef0',col2:'#3ac8c0',shape:'dragon',roar:"Song of the foam",
 lore:"An elegant leviathan that dances on the lagoons. Its bubbles cover you: while bubbled, you slip, and your moves have a 50% chance to take you elsewhere. A dodge clears the bubbles. When it sucks in water, a cutting jet is coming.",
 weak:{feu:.5,glace:.25,foudre:1,dragon:.75},ko:220,flinch:680,poison:220,
 parts:{tete:{name:"Crest",cut:78,blunt:80,brk:.12},flanc:{name:"Fins",cut:70,blunt:55,brk:.16},queue:{name:"Tail",cut:72,blunt:50,sever:1}},
 mats:{ecaille:"Pearled scale",peau:"Foam fur",griffe:"Nacrelle claw",tete:"Nacrelle crest",queue:"Nacrelle tail",rare:"Foam pearl"},
 moves:[
 {id:'bulles',n:"Bubble jet",t:"It puffs its cheeks and takes aim at you…",z:[],track:1,tier:'L',st:'bulle',w:2},
 {id:'morsure',n:"Bite",t:"It slices the air with its long snout…",z:['avant'],tier:'M',w:2.6},
 {id:'fouet',n:"Tail whip",t:"It spins, its huge tail lashing the water…",z:['arriere','flanc'],tier:'H',w:2.6,tail:1},
 {id:'glissade',n:"Foam slide",t:"It lies on its bubbles and slides toward you…",z:['avant','flanc'],tier:'M',st:'bulle',w:2,after:'flip',open:1,c:12},
 {id:'danse',n:"Foam dance",t:"It spins in place, bubbles flying all around…",z:['avant','flanc','arriere'],tier:'M',st:'bulle',w:1.4,c:12},
 {id:'aspire',n:"Suction",t:"It sucks up lagoon water, neck stretched toward you…",z:[],fx:'windup',chain:'jet',w:1.5,cond:m=>m.hp<m.max*.85},
 {id:'jet',n:"Cutting jet",t:"A pressurized water jet sweeps in front of it!",z:['avant','flanc'],tier:'X',w:0,c:15},
 {id:'fureur',n:"Foam whirlpool",t:"It leaps, furious, in a spray of bubbles…",z:['avant','flanc'],tier:'H',st:'bulle',w:1.8,rage:1}]};
MON.sismorak={hab:'glace',name:"Sismorak",kind:"Mastodon",rank:8,hp:11400,lv:60,noElite:1,col:'#7f90a0',col2:'#d8e6f0',shape:'brute',roar:"Trumpeting",
 lore:"A colossal mastodon that shakes the tundra. When it rears, its Quake knocks everyone down: guard or dodge, or you lose your turn. Its tusks can break, which shortens its charges.",
 weak:{feu:1,glace:0,foudre:.5,dragon:.5},ko:240,flinch:760,poison:240,
 parts:{tete:{name:"Tusks",cut:65,blunt:78,brk:.12},flanc:{name:"Legs",cut:58,blunt:52,brk:.16},queue:{name:"Tail",cut:62,blunt:48,sever:1}},
 mats:{ecaille:"Sismorak plate",peau:"Sismorak hide",griffe:"Sismorak nail",tete:"Sismorak tusk",queue:"Sismorak tail",rare:"Telluric heart"},
 moves:[
 {id:'trompe',n:"Trunk strike",t:"It swings its trunk in front of it…",z:['avant'],tier:'M',w:3},
 {id:'pietine',n:"Stomp",t:"It raises a huge foot above you…",z:['avant','flanc'],tier:'H',st:'down',w:2.4},
 {id:'queue',n:"Tail strike",t:"It turns heavily, its tail bristling with ice…",z:['arriere','flanc'],tier:'M',w:2.4,tail:1},
 {id:'charge',n:"Tusk charge",t:"It lowers its head, tusks pointed at you…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'souffle',n:"Frozen breath",t:"It swells its chest; the air turns icy…",z:[],track:1,tier:'M',st:'gel',w:1.5},
 {id:'cabre',n:"Rearing",t:"It rears up on its hind legs, enormous, ready to come down!",z:[],fx:'windup',chain:'seisme',w:1.8,cond:m=>m.hp<m.max*.9},
 {id:'seisme',n:"Quake",t:"It comes down: the ground splits across the whole arena!",z:['avant','flanc','arriere'],tier:'H',st:'down',w:0,c:14},
 {id:'fureur',n:"Avalanche",t:"It trumpets, and blocks of ice tumble toward you…",z:['avant','flanc'],tier:'H',w:1.8,rage:1}]};
MON.tranchelune={aHp:.9,hab:'citadelle',name:"Moonreaver",kind:"Blade wyvern",rank:9,hp:12600,lv:64,noElite:1,col:'#22262e',col2:'#c8ccd8',shape:'wyvern',roar:"Hiss",
 lore:"A panther wyvern with razor wings that hunts under the moon. In Counter stance, it parries everything that hits it and counterattacks very hard: don’t attack it, wait for it to leave the stance, exposed. Its blade tail can be severed.",
 weak:{feu:1,glace:.5,foudre:.75,dragon:.25},ko:250,flinch:820,poison:250,
 parts:{tete:{name:"Head",cut:80,blunt:82,brk:.11},flanc:{name:"Blade wings",cut:55,blunt:60,brk:.16},queue:{name:"Blade tail",cut:66,blunt:48,sever:1}},
 mats:{ecaille:"Night fur",peau:"Moonreaver hide",griffe:"Moonreaver claw",tete:"Moonreaver fang",queue:"Blade tail",rare:"Moon shard"},
 moves:[
 {id:'lames',n:"Crossed blades",t:"It spreads its blade wings before it…",z:['avant','flanc'],tier:'H',w:2.8},
 {id:'queue',n:"Blade tail",t:"It lashes the air with its blade tail…",z:['arriere','flanc'],tier:'H',w:2.4,tail:1},
 {id:'bond',n:"Silent leap",t:"It crouches low, eyes fixed on you…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'tranche',n:"Lunar slash",t:"It tracks your movements, one wing raised…",z:[],track:1,tier:'M',w:1.6},
 {id:'posture',n:"Counter stance",t:"It goes still, wings crossed before it, perfectly calm…",z:[],fx:'stance',w:3,cond:(m,H)=>!m.stanceCd&&H.turn>2},
 {id:'rafale',n:"Blade flurry",t:"It spins, its wings slicing the air all around…",z:['avant','flanc','arriere'],tier:'M',w:1.4,c:12},
 {id:'fureur',n:"Dance of blades",t:"It hisses and unleashes wing strike after wing strike…",z:['avant','flanc'],tier:'H',w:2,rage:1}]};
MON.gorgovire={hab:'crete',name:"Gorgovire",kind:"Blind dragon",rank:10,hp:14500,lv:66,noElite:1,mrOnly:1,col:'#2a2530',col2:'#8a5aa0',shape:'dragon',roar:"Frenzied shriek",
 lore:"A blind dragon wrapped in its wings like a cloak, spreading dark spores. Its spores cause Frenzy: deal heavy damage within 4 turns to overcome it (+15% attack), or it explodes. It hunts by sound and hits harder and harder.",
 weak:{feu:.75,glace:.5,foudre:.5,dragon:1},ko:300,flinch:1050,poison:280,
 parts:{tete:{name:"Crown",cut:74,blunt:80,brk:.1},flanc:{name:"Mantle wings",cut:62,blunt:56,brk:.15},queue:{name:"Tail",cut:64,blunt:50,sever:1}},
 mats:{ecaille:"Spore scale",peau:"Gorgovire mantle",griffe:"Gorgovire claw",tete:"Gorgovire crown",queue:"Gorgovire tail",rare:"Frenzied heart"},
 moves:[
 {id:'spores',n:"Spore cloud",t:"It spreads its cloak: dark spores pour out…",z:['avant','flanc'],tier:'M',st:'virus',w:2.6},
 {id:'griffes',n:"Claws",t:"It raises a clawed paw, listening closely…",z:['avant','flanc'],tier:'H',w:2.6},
 {id:'queue',n:"Tail lash",t:"It sweeps behind it with its long tail…",z:['arriere','flanc'],tier:'H',w:2.4,tail:1},
 {id:'charge',n:"Blind rush",t:"It turns its head toward the sound of your steps…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'souffle',n:"Spore breath",t:"It swells its neck; violet smoke gathers in its maw…",z:[],track:1,tier:'H',st:'virus',w:1.6},
 {id:'explosion',n:"Bloom",t:"Spores burst all around it!",z:['avant','flanc','arriere'],tier:'M',st:'virus',w:1.2,c:12},
 {id:'fureur',n:"Frenzy",t:"It shrieks, its cloak unfurls, the spores blaze…",z:['avant','flanc'],tier:'X',w:1.6,rage:1}]};
MON.pyroclaste={hab:'plaine',name:"Pyroclast",kind:"Fist wyvern",rank:10,hp:18500,lv:74,noElite:1,mrOnly:1,goo:1,col:'#2a3448',col2:'#b8e03a',shape:'brute',roar:"Muffled roar",
 lore:"A stocky wyvern with stone fists covered in gel. The explosive gel sticks to you: next turn it explodes, unless you dodge to shake it off. When it charges its Detonation, all the gel in the arena will blow.",
 weak:{feu:0,glace:1,foudre:.5,dragon:.5},ko:300,flinch:1080,poison:280,
 parts:{tete:{name:"Horn",cut:72,blunt:80,brk:.1},flanc:{name:"Fists",cut:48,blunt:58,brk:.14},queue:{name:"Tail",cut:62,blunt:50,sever:1}},
 mats:{ecaille:"Basalt scale",peau:"Pyroclast hide",griffe:"Pyroclast claw",tete:"Pyroclast horn",queue:"Pyroclast tail",rare:"Gel core"},
 moves:[
 {id:'poing',n:"Sticky fist",t:"It draws back its fist, coated in glistening gel…",z:['avant','flanc'],tier:'H',st:'slime',w:2.8},
 {id:'marteau',n:"Double hammer",t:"It raises both fists above its head…",z:['avant'],tier:'X',w:1.6},
 {id:'queue',n:"Tail strike",t:"It turns, tail low…",z:['arriere','flanc'],tier:'M',w:2.4,tail:1},
 {id:'charge',n:"Basalt rush",t:"It leans forward, fists on the ground, and charges…",z:['avant','flanc'],tier:'H',w:2,after:'flip',open:1,c:14},
 {id:'eclabousse',n:"Gel splash",t:"It strikes the ground: gel splatters all around…",z:['avant','flanc','arriere'],tier:'M',st:'slime',w:1.4,c:12},
 {id:'jet_g',n:"Gel jet",t:"It spits a ball of gel at you…",z:[],track:1,tier:'M',st:'slime',w:1.5},
 {id:'arme',n:"Imminent detonation",t:"It smashes its fists together: the gel starts to glow!",z:[],fx:'windup',chain:'detonation',w:1.4,cond:m=>m.hp<m.max*.7},
 {id:'detonation',n:"Detonation",t:"All the gel in the arena explodes at once!",z:['avant','flanc','arriere'],tier:'X',w:0,c:16}]};
MON.pantin={hab:'arene',name:"Training dummy",kind:"Straw dummy",rank:0,hp:1000000,lv:10,noElite:1,col:'#c8a86a',col2:'#8a5a2a',shape:'bird',roar:'…',
 lore:"A straw-and-wood dummy set up by the Guild. It never fights back.",weak:{feu:1,glace:1,foudre:1,dragon:1},ko:110,flinch:1e9,poison:120,
 parts:{tete:{name:"Head",cut:80,blunt:90},flanc:{name:"Arms",cut:60,blunt:55},queue:{name:"Back",cut:45,blunt:45}},
 mats:{ecaille:"Straw",peau:"Cloth",griffe:"Wood",tete:"Target",queue:"Post",rare:"Ribbon"},moves:[{id:'rien',n:"Motionless",z:[],fx:'idle',w:0}]};
const TIER={L:1,M:1.8,H:3.1,X:4.5};
const TIERN={L:"light",M:'medium',H:'heavy',X:"devastating"};
for(const k in MON)for(const mv of MON[k].moves)if(mv.tier)mv.d=Math.round(MON[k].lv*TIER[mv.tier]);
const SIG={
 selenis:[{id:'songe',n:"Moon dream",t:"Its wings light up with pale moons…",z:[],fx:'windup',chain:'eclat',w:1.3,cond:m=>m.hp<m.max*.8},{id:'eclat',n:"Moon shard",t:"A rain of glowing powder falls over the whole arena!",z:ALLZ,tier:'M',st:'sleep',w:0,c:14}],
 herissaure:[{id:'tempete_e',n:"Storm of thorns",t:"It curls into a ball, spines out…",z:ALLZ,tier:'M',w:1.5,c:12,cond:m=>m.spikes>0}],
 rapinoux:[{id:'razzia',n:"Raid",t:"It hops from side to side, both hands reaching for you…",z:['avant','flanc','arriere'],tier:'M',w:1.6,steal:2,cond:m=>!(m.loot&&m.loot.length>=2)}],
 grakku:[{id:'grele',n:"Rock hail",t:"It strikes the cliff with its talons: rocks come tumbling down…",z:ALLZ,tier:'M',w:1.5,c:12},
  {id:'lancer',n:"Rock throw",t:"It lifts its rock and takes aim at you…",z:[],track:1,tier:'H',w:3,cond:m=>m.rock>0}],
 brontal:[{id:'eruption',n:"Eruption",t:"The ground cracks beneath it; lava rumbles…",z:[],fx:'windup',chain:'geyser',w:1.3,cond:m=>m.hp<m.max*.9},
  {id:'geyser',n:"Lava geysers",t:"Pillars of fire erupt all around it!",z:ALLZ,tier:'X',st:'burn',w:0,c:15}],
 velyra:[{id:'fouet',n:"Venomous lash",t:"It whirls its tail above its head…",z:ALLZ,tier:'M',st:'poison',w:2,tail:1}],
 glacimorde:[{id:'prison',el:'ice',n:"Rime prison",t:"It fixes on your silhouette; frost closes in around you…",z:[],track:1,tier:'M',st:'gel',w:2}],
 scoriak:[{id:'coulee',n:"Lava flow",t:"Lava spills from its shell and flows toward you…",z:[],track:1,tier:'M',st:'burn',w:1.5}],
 boregor:[{id:'grele',n:"Hailstones",t:"It hurls ice shards in every direction…",z:ALLZ,tier:'M',st:'gel',w:1.5,c:12}],
 fulgor:[{id:'orage',n:"Call of the storm",t:"It howls at the sky; clouds gather…",z:[],fx:'windup',chain:'colonne',w:1.4,cond:m=>m.charged>0},
  {id:'colonne',el:'bolt',n:"Lightning pillars",t:"Lightning strikes the whole arena!",z:ALLZ,tier:'X',st:'para',w:0,c:15}],
 ferroi:[{id:'effondre',n:"Collapse",t:"It strikes the pillars: stone blocks fall toward you…",z:[],track:1,tier:'H',w:1.5}]};
const ELITE={};const RANK_ATK=[100,125,145,168,190,212,236];
function eliteDef(id){if(ELITE[id])return ELITE[id];const b=MON[id],lv=Math.round(55+b.rank*1.2),hp=Math.round((5600+b.rank*700)*1.18*(b.eHp||1));
 const mv=x=>Object.assign({},x,x.tier?{d:Math.round(lv*TIER[x.tier])}:{});
 return ELITE[id]=Object.assign({},b,{name:withEl(b.name,id),kind:b.kind+", elite",hp,lv,elite:1,
  flinch:Math.round(b.flinch*255/RANK_ATK[b.rank]),ko:Math.round(b.ko*1.3),poison:Math.round(b.poison*1.5),moves:b.moves.map(mv).concat((SIG[id]||[]).map(mv))});}
for(const k in MON){MON[k].mats.xeca=`Veteran fragment (${MON[k].name})`;MON[k].mats.xrare=`Veteran gem (${MON[k].name})`;MON[k].mats.aeca=`Ancestral scale (${MON[k].name})`;MON[k].mats.arare=`Ancestral heart (${MON[k].name})`;}
const ANC={};
function ancSuffix(id){return MON[id].mrOnly?'':FEM[id]?' ancestrale':' ancestral';}
function withEl(n,id){return'Veteran '+n;}
function withAnc(n,id){return MON[id].mrOnly?n:'Ancestral '+n;}
function elTag(m){return'veteran';}
function ancTag(m){return'ancestral';}
function pron(m){return'it';}
function ancDef(id){if(ANC[id])return ANC[id];if(MON[id].mrOnly)return ANC[id]=Object.assign({},MON[id],{elite:1,anc:1});const b=MON[id],e=b.noElite?b:eliteDef(id),lv=Math.round(72+b.rank+(b.aLv||0)),hp=Math.round((14000+b.rank*800)*(b.aHp||1));
 const mv=x=>Object.assign({},x,x.tier?{d:Math.round(lv*TIER[x.tier])}:{});const ref=RANK_ATK[b.rank]||(236+18*(b.rank-6));
 return ANC[id]=Object.assign({},e,{name:withAnc(b.name,id),kind:b.kind+", ancestral",hp,lv,elite:1,anc:1,
  flinch:Math.round(b.flinch*340/ref),ko:Math.round(b.ko*1.6),poison:Math.round(b.poison*1.9),moves:e.moves.map(mv)});}
function monLabel(id,el,anc){return anc?withAnc(MON[id].name,id):el?withEl(MON[id].name,id):MON[id].name;}
function eCls(q){return q.anc?'elite anc':q.elite?'elite':'';}
const MON_ORDER=['rapinoux','grakku','selenis','brontal','velyra','glacimorde','scoriak','fulgor','herissaure','boregor','ferroi','devoreur','nacrelle','bombardier','sismorak','tempestaire','tranchelune'];
for(const mon of MON_ORDER)for(const el of[0,1]){if(el&&MON[mon].noElite)continue;const b=QUESTS.find(q=>q.mon===mon&&!q.elite);
 QUESTS.push({id:(el?'xe_':'x_')+mon,mon,explore:1,elite:el?1:0,stars:el?7:b.stars,title:`Encounter: ${el?withEl(MON[mon].name,mon):MON[mon].name}`,turns:40,z:Math.round((el?3000:b.z)*.6),obj:[],d:"An unexpected encounter during an expedition."});}
const STAGE={q13:2,q14:3,q15:4,q16:5,q17:6,e10:5,e11:6,q12:1,e9:4,q11:6,q10:5,q9:4,q1:1,q2:1,g1:1,q3:1,q4:2,q7:2,g2:2,q5:2,e7:5,q3c:3,q8:3,g3:3,q6:3,e8:6,e1:4,e2:4,e3:4,g4:4,e4:5,e5:5,g5:5,g6:6,e6:6};const URGENT={q3:1,q5:1,q6:1,q9:1,q10:1,q11:1};
QUESTS.push({id:'c2',mon:'brontal',capture:1,ref:'q2',title:"Capture: the living blaze",d:"A plains rancher wants a live Brontal to study its blazing tail. Weaken it, trap it and tranq it: killing it fails the quest."});
QUESTS.push({id:'c4',mon:'selenis',elite:1,capture:1,ref:'e10',title:"Capture: the captive moon",d:"The scholars want to observe a veteran Selenis up close. Beware its sleep powder, and don’t kill it."});
QUESTS.push({id:'c5',mon:'herissaure',elite:1,capture:1,ref:'e11',title:"Capture: living thorns",d:"The armorer dreams of the endlessly regrowing spines of a live veteran Bristlesaur. Weaken it without finishing it off."});
QUESTS.push({id:'c6',mon:'devoreur',capture:1,ref:'q9',title:"Capture: hunger in chains",d:"The Guild wants to understand why the Devourer never stops eating. Bring it back alive… if it gives you the time."});
QUESTS.push({id:'d4',mon:'brontal',duo:'scoriak',elite:1,opt:1,title:"Double hunt: the ember duo",d:"A veteran Brontal and a veteran Scoriak are fighting over the Ashlands. Slay the first: the racket will draw the second. Your HP and items are not restored between the two."});
QUESTS.push({id:'d5',mon:'glacimorde',duo:'boregor',elite:1,opt:1,title:"Double hunt: the deep cold",d:"A veteran Glacimaw guards the central lake; a veteran Boregor prowls the snowdrifts. Both back to back, no return to camp."});
QUESTS.push({id:'d6',mon:'fulgor',duo:'ferroi',elite:1,opt:1,title:"Double hunt: storm over the citadel",d:"A veteran Fulgor hunts in the Ruined Citadel, and its storms have woken the veteran Iron King. Slay the wolf, then stand up to the king."});
Object.assign(STAGE,{c2:2,c4:4,c5:5,c6:6,d4:4,d5:5,d6:6,g7:7,g8:8,g9:9});
for(const q of QUESTS){q.tier=STAGE[q.id]||0;q.urgent=URGENT[q.id]?1:0;}
for(const mon of MON_ORDER)for(const el of[0,1]){const b=QUESTS.find(q=>q.mon===mon&&!!q.elite===!!el&&q.tier>0&&!q.capture&&!q.duo);if(!b)continue;
 QUESTS.push({id:(el?'ae_':'a_')+mon,mon,arena:1,tier:0,elite:el?1:0,src:b.id,stars:b.stars,title:`Arena: ${el?withEl(MON[mon].name,mon):MON[mon].name}`,turns:b.turns,z:Math.round(b.z*.4),obj:b.obj,d:"A training fight in the Guild arena. Normal loot, reduced reward. Bonus objectives already completed no longer pay out."});}
MON_ORDER.push('gorgovire','pyroclaste','abyssaure');
const MR_Q=[['selenis',7,"The moon that never sets","An ancestral Selenis plunges the pass into dreamless sleep. No one wakes from its powder unscarred."],['gorgovire',7,"The blind frenzy","A blind dragon spreads its spores over the Crests: the monsters it touches go berserk. Overcome the Frenzy, or it will consume you."],
 ['herissaure',8,"The forest of thorns","An ancestral Bristlesaur has studded the plain with spines as tall as lances."],['nacrelle',8,"The tide of foam","An ancestral Nacrelle sets the whole lagoon dancing; its bubbles cover the horizon."],['pyroclaste',8,"Fists of basalt","A stone-fisted wyvern covers the Ashlands in explosive gel. Dodge to shake it off before it blows."],
 ['sismorak',9,"The eternal quake","An ancestral Sismorak shakes the whole tundra with every step."],['tranchelune',9,"The blood moon","An ancestral Moonreaver, faster than the eye, parries the blows of the finest hunters."],
 ['rapinoux',7,"The ageless thief","An ancestral Rapinoux, gray-furred and craftier than ever, raids Guild camps without ever getting caught."],['grakku',7,"The beak of the ancients","An ancestral Grakku, twice the size of its cousins, defends a stone nest at the top of the pass."],
 ['brontal',7,"The ancestral blaze","An ancestral Brontal has melted half the plain. Its blazing tail never stops burning."],
 ['velyra',7,"The thousand-year queen","An ancestral Velyra reigns over the peaks. Its venom eats through even Guild armor."],
 ['glacimorde',7,"The primeval frost","An ancestral Glacimaw has frozen the northern lakes to the bottom. The air freezes around it."],
 ['scoriak',7,"Heart of the volcano","An ancestral Scoriak has emerged from the crater. Its shell glows like a forge.",1],
 ['fulgor',8,"The wolf of a thousand storms","An ancestral Fulgor runs along the crests, carried by a storm that never leaves it."],
 ['boregor',8,"The primordial winter","An ancestral Boregor has buried the tundra under snow. It appears out of nowhere."],
 ['ferroi',8,"The ageless King","The ancestral Iron King, forged before the Citadel itself, has awoken beneath the ruins."],
 ['devoreur',8,"Hunger of the ages","An ancestral Devourer ravages Brume Valley, eating without end. Nothing escapes it.",1],
 ['bombardier',9,"The burning sky","An ancestral Bombardier carpets the Ashlands with explosive scales."],
 ['tempestaire',9,"The eternal hurricane","The ancestral Tempestar, the first of its line, unleashes a storm that has raged for centuries."],
 ['abyssaure',9,"The black sun","Deep in the Eclipse Crater, an elder dragon swallows the daylight. No hunter has come back to describe it.",1]];
MR_Q.forEach(([mon,tier,title,desc,urg],i)=>{const b=MON[mon],turns=72+2*b.rank;QUESTS.push({id:'m_'+mon,mon,elite:1,anc:1,tier,urgent:urg?1:0,final:mon==='abyssaure'?1:0,stars:9+Math.floor(tier/3),title,turns,z:7000+b.rank*1100,
 obj:[{id:'b:tete',n:"Break the head"},{id:i%2?'nofaint':'fast:'+Math.round(turns*.6),n:i%2?"No fainting":`Finish in under ${Math.round(turns*.6)} turns`}],
 d:desc+(mon==='abyssaure'?" In the Eclipse, you won’t see where it strikes: listen, or tear through the dark with a flash bomb.":b.mrOnly?'':" An ancestral monster chains its attacks far more often than a veteran one.")});});
for(const mon of MON_ORDER){const b=QUESTS.find(q=>q.id==='m_'+mon);if(!b)continue;
 QUESTS.push({id:'xa_'+mon,mon,explore:1,elite:1,anc:1,tier:0,stars:b.stars,title:`Encounter: ${monLabel(mon,1,1)}`,turns:45,z:Math.round(b.z*.5),obj:[],d:"An unexpected encounter during an expedition."});
 QUESTS.push({id:'aa_'+mon,mon,arena:1,tier:0,elite:1,anc:1,src:b.id,stars:b.stars,title:`Arena: ${monLabel(mon,1,1)}`,turns:b.turns,z:Math.round(b.z*.4),obj:b.obj,d:"A training fight in the Guild arena. Normal loot, reduced reward. Bonus objectives already completed no longer pay out."});}
QUESTS.push({id:'c7',mon:'glacimorde',elite:1,anc:1,tier:7,capture:1,ref:'m_glacimorde',title:"Capture: the frozen leviathan",d:"A live ancestral Glacimaw would make the Guild proud. Weaken it, trap it and tranq it: above all, don’t finish it off."});
QUESTS.push({id:'c8',mon:'velyra',elite:1,anc:1,tier:8,capture:1,ref:'m_velyra',title:"Capture: the thousand-year queen",d:"The alchemists want the venom of a live ancestral Velyra. Keep antidotes handy, and don’t kill it."});
QUESTS.push({id:'c9',mon:'boregor',elite:1,anc:1,tier:9,capture:1,ref:'m_boregor',title:"Capture: winter in a cage",d:"Capture an ancestral Boregor: no one has ever managed it. It bursts from the snow without warning."});
QUESTS.push({id:'d7',mon:'grakku',duo:'selenis',elite:1,anc:1,tier:7,opt:1,title:"Double hunt: the cursed pass",d:"An ancestral Grakku and an ancestral Selenis rule Brume Pass together. One after the other, no return to camp."});
QUESTS.push({id:'d8',mon:'herissaure',duo:'brontal',elite:1,anc:1,tier:8,opt:1,title:"Double hunt: the plain at war",d:"An ancestral Bristlesaur and an ancestral Brontal have turned the scorched plain into a battlefield. The second rushes in as soon as the first falls."});
QUESTS.push({id:'d9',mon:'sismorak',duo:'glacimorde',elite:1,anc:1,tier:9,opt:1,title:"Double hunt: the ancestral north",d:"An ancestral Sismorak shakes the tundra and wakes an ancestral Glacimaw beneath the ice. Hold out to the end."});
function qBase(m,el,anc){return QUESTS.find(x=>x.mon===m&&x.tier>0&&!!x.elite===!!el&&!!x.anc===!!anc&&!x.capture&&!x.duo&&!x.gather);}
for(const q of QUESTS){if(q.capture&&q.ref){const b=QUESTS.find(x=>x.id===q.ref);q.stars=b.stars;q.turns=b.turns+5;q.z=Math.round(b.z*1.3/50)*50;q.obj=[{id:'nofaint',n:"No fainting"}];}
 if(q.duo){const a=qBase(q.mon,q.elite,q.anc),b=qBase(q.duo,q.elite,q.anc);q.stars=Math.max(a.stars,b.stars);q.turns=Math.round((a.turns+b.turns)*.9);q.z=Math.round((a.z+b.z)*1.2/50)*50;q.obj=[{id:'nofaint',n:"No fainting"}];}}
const SP_IRON={q6:"The Iron King and the ballista",e6:"The veteran Iron King at the ballista",m_ferroi:"The ageless King at the ballista"};
for(const b of QUESTS.filter(q=>q.opt&&q.duo||SP_IRON[q.id]))QUESTS.push({id:'s_'+b.id,sp:1,src:b.id,mon:b.mon,duo:b.duo,elite:b.elite||0,anc:b.anc||0,tier:0,stars:b.stars,turns:b.turns,z:Math.round(b.z*.5/50)*50,obj:b.obj,
 title:b.duo?b.title:SP_IRON[b.id],d:b.duo?b.d+" A special fight: reduced reward, normal loot.":"Relive the Citadel assault: the Guild sets the ballista back up on the ramparts and hands you 3 bolts. Reduced reward, normal loot."});
const MON_SEQ=(()=>{const o=[];const add=m=>{if(m&&MON[m]&&!o.includes(m))o.push(m);};for(let t=1;t<=9;t++){const L=QUESTS.filter(q=>q.tier===t&&q.mon);for(const q of L.filter(q=>!q.urgent).concat(L.filter(q=>q.urgent))){add(q.mon);add(q.duo);}}for(const m in MON)if(m!=='pantin')add(m);return o;})();
function monSeq(m){const i=MON_SEQ.indexOf(m);return i<0?-1:i;}
{const ix=new Map(JEWELS.map((j,i)=>[j,i]));JEWELS.sort((a,b)=>a.sz-b.sz||monSeq(a.mon)-monSeq(b.mon)||ix.get(a)-ix.get(b));}
{const ix=new Map(SETS.map((s,i)=>[s,i]));SETS.sort((a,b)=>monSeq(a.mon)-monSeq(b.mon)||ix.get(a)-ix.get(b));}
const TRAIN_IDLE={id:'#train',n:"Training dummy",t:"It takes every hit without flinching. Test your attacks, charges and movement.",z:[],fx:'idle'};
const IDLE={id:'#idle',n:"Immobilized",t:"It can’t attack this turn. Hit hard!",z:[],fx:'idle'};

/* ---------- Sauvegarde ---------- */
const KEY='grande-traque-v1';
const PATCHES=[
 {v:'1.65',date:'2026-10-12',t:"English version",items:[
  "The game is now available in English. It follows your phone’s language, and a link at the bottom of the home screen lets you switch anytime.",
  "Minor text fixes."]},
 {v:'1.64',date:'2026-10-09',t:"Hotfix",items:[
  "On desktop, the start screen keeps its proportions instead of stretching to full width."]},
 {v:'1.63',date:'2026-10-06',t:"Special Fights",items:[
  "New start screen when you open the game.",
  "Gathering quests: the requested resource now appears in every sector of the zone, and comes back 3 h after being depleted. No more restarting a quest for lack of Pingrelots!",
  "New category on the home screen, below Free Expedition: <b>Special Fights</b>. Double hunts cleared on the Quest Board and the Iron King ballista assault can be replayed there, in their original zones.",
  "Patch notes: this window shows once after each update, and the full history is at the bottom of the home screen.",
  "Future updates install themselves when you open the game, or with a single tap if you’re mid-hunt."]},
 {v:'1.62',date:'2026-10-05',t:"First public release",items:[
  "The game installs on your phone’s home screen and works offline.",
  "Tutorial guided by Hilda for new hunters.",
  "Save export and import to switch devices."]}];
const MOIS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function patchDate(d){const[y,m,j]=d.split('-').map(Number);return`${j} ${MOIS[m-1]} ${y}`;}
function patchBody(p){return`<ul class="pnl">${p.items.map(x=>`<li>${x}</li>`).join('')}</ul>`;}
function openPatch(){const i=PATCHES.findIndex(p=>p.v===S.patch),L=PATCHES.slice(0,i<0?1:Math.max(1,i));S.patch=PATCHES[0].v;save();
 modal(`<div class="pnhead"><img class="emblem" src="img/ui/emblem.webp" alt=""><div><span class="urgtag pntag">Update</span><h2>What’s new</h2></div></div>${L.map(p=>`<h3 class="pnv">Version ${p.v} · ${esc(p.t)} <small>${patchDate(p.date)}</small></h3>${patchBody(p)}`).join('')}<button class="btn main wide" data-a="close" style="margin-top:12px">Got it!</button>`);}
function openPatchList(){const L=PATCHES.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.v.localeCompare(a.v,undefined,{numeric:true}));
 modal(`<h2>Patch notes</h2><p class="small muted" style="margin-top:0">All updates, newest first.</p><div class="pnlist">${L.map((p,i)=>`<details class="setcard pncard"${i?'':' open'}><summary><b>Version ${p.v}</b> · ${esc(p.t)}<small>${patchDate(p.date)}</small></summary>${patchBody(p)}</details>`).join('')}</div><button class="btn wide" data-a="close" style="margin-top:12px">Close</button>`);}
function newSave(){return{v:2,zenny:600,patch:PATCHES[0].v,alv:{},jewels:{},sock:{},
 items:{potion:10,mega:2,antidote:3,steak:2,grain:0,flash:2,piege:1,tranq:2},mats:{},
 weapons:WT_ORDER.map(t=>t+':fer'),armors:SLOTS.map(s=>s.id+':chasseur'),
 equip:{weapon:'gs:fer',tete:'tete:chasseur',torse:'torse:chasseur',bras:'bras:chasseur',taille:'taille:chasseur',jambes:'jambes:chasseur'},
 cleared:{},mon:{},tuto:false,tips:{},obj:{},res:{herbe:2,champi:2,fer:4}};}
function loadSave(){try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw),n=newSave();
 const z={};for(const k in ITEMS)z[k]=0;return Object.assign(n,s,{items:Object.assign(z,s.items||{}),equip:Object.assign(n.equip,s.equip||{}),res:s.res||n.res,alv:s.alv||{},jewels:s.jewels||{},sock:s.sock||{}});}}catch(e){}return newSave();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
let S=loadSave();
(function migrate(){if(S.exp&&S.exp.v!==2)S.exp=null;if(S.weapons&&!S.weapons.includes('bow:fer'))S.weapons.push('bow:fer');if(S.weapons&&!S.weapons.includes('lbg:fer'))S.weapons.push('lbg:fer');if(S.weapons&&!S.weapons.includes('hbg:fer'))S.weapons.push('hbg:fer');for(const t of['hh','lance','gl','sa','cb','ig'])if(S.weapons&&!S.weapons.includes(t+':fer'))S.weapons.push(t+':fer');if(!S.pal)setTimeout(()=>{try{const p=palS();let xp=0;for(const q of QUESTS)if(S.cleared[q.id])xp+=S.cleared[q.id]*(10+5*q.stars);palGainXP(xp);save();render();}catch(e){}},0);setTimeout(()=>{try{cleanSock();save();}catch(e){}},0);if(!S.alv)S.alv={};if(!S.jewels)S.jewels={};if(!S.sock)S.sock={};
 S.armors=S.armors.map(id=>{if(!id.endsWith('+'))return id;const b=id.slice(0,-1);const set=SETS.find(x=>x.id===b.split(':')[1]);S.alv[b]=armorMaxLv(set);return b;}).filter((v,i,a)=>a.indexOf(v)===i);
 for(const sl of SLOTS){const e=S.equip[sl.id];if(e&&e.endsWith('+'))S.equip[sl.id]=e.slice(0,-1);}})();
let H=null,R=null,screen='village',sub={};

/* ---------- Équipement ---------- */
function getWeaponSlots(id){return wSlots(LIN.find(l=>l.id===id.split(':')[1]));}
function getWeapon(id){const [type,lid]=id.split(':');const lin=LIN.find(l=>l.id===lid);
 const t=WT[type];const vb=lid.replace(/[234]$/,''),vr=VARS[type]?VARS[type][vb]:null;return{id,type,lin,var:vr,name:lid==='fer'?`Iron ${t.n}`:`${lin.name} ${t.n}`,atk:Math.round(lin.atk*t.am),aff:lin.aff||0,elem:lin.elem||null,ev:Math.round((lin.ev||0)*t.em),stat:lin.stat||null,sv:Math.round((lin.sv||0)*t.em),sharp:lin.sharp,total:sum(lin.sharp)};}
function getArmor(id){const [slot,sid]=id.split(':');const set=SETS.find(s=>s.id===sid);const i=SLOTS.findIndex(s=>s.id===slot);const lv=(S.alv&&S.alv[id])||0;
 return{id,slot,set,lv,maxLv:armorMaxLv(set),name:`${set.name} ${SLOTS[i].n}`,def:Math.min(defCap(),set.def+DEF_STEP*lv),pts:set.p[i],slots:set.sl[i]};}
function eliteOpen(){return!!S.cleared.q6;}
function sockOf(id){return(S.sock&&S.sock[id])||[];}
function computeStats(meal,wid,basic){const w=getWeapon(wid||S.equip.weapon);const raw={};for(const k in SKILLS)raw[k]=0;let def=0;
 const addJ=id=>{if(basic)return;for(const jid of sockOf(id)){const j=jid&&JEWELS.find(x=>x.id===jid);if(j)raw[j.sk]+=j.pts||1;}};
 for(const sl of SLOTS){if(basic){def+=SETS.find(x=>x.id==='chasseur').def;continue;}const a=getArmor(S.equip[sl.id]);def+=a.def;for(const k in a.pts)raw[k]+=a.pts[k];addJ(a.id);}addJ(w.id);
 const sk={};for(const k in raw)sk[k]=Math.min(raw[k],SKILLS[k].max);const m=meal||{};
 return{w,sk,raw,atk:w.atk+4*sk.attaque,aff:w.aff+5*sk.critique,def:Math.round((def+(m.def||0))*(w.type==='hbg'?1:WT[w.type].ranged?.65:1)),hp:100+15*sk.sante+(m.hp||0),st:100+15*sk.endurance+(m.st||0),atkPct:m.atkPct||0};}
function matId(mon,k){return mon+'.'+k;}
function matName(id){const [mon,k]=id.split('.');return(S.mon[mon]&&S.mon[mon].seen)?MON[mon].mats[k]:'???';}
function weaponRecipe(lin){const o=ZONE_ORE[lin.mon],hd=ZONE_HIDE[lin.mon];
 return lin.t4?{mats:{arare:1,aeca:3,tete:1},res:{[o]:4,dracite:2},z:600*lin.rank}:lin.t3?(MON[lin.mon].noElite?{mats:{rare:2,tete:1,queue:1},res:{[o]:3,dracite:1},z:400*lin.rank}:{mats:{xrare:1,xeca:2,tete:1},res:{[o]:3,dracite:1},z:400*lin.rank}):lin.up?{mats:{rare:1,ecaille:2,tete:1},res:{[o]:2,[hd]:2},z:300*lin.rank}:{mats:{ecaille:2,griffe:2,tete:1},res:{[o]:2},z:200*lin.rank};}
function armorRecipe(slot,set){return{mats:ARMOR_MATS[slot],res:set.mon?{[ZONE_HIDE[set.mon]]:1}:{},z:120*set.rank};}
function armorLvCost(a){const nd=Math.min(defCap(),a.def+DEF_STEP);return{res:nd>DEF_CAP?'spherea':nd>HARD_DEF?'sphered':'sphere',ore:ZONE_ORE[a.set.id]||'fer',z:80*(a.lv+1)+40*a.set.rank};}
function canLv(a){if(a.lv>=a.maxLv)return false;const c=armorLvCost(a);if(c.res==='sphered'&&!eliteOpen())return false;if(c.res==='spherea'&&!mrOpen())return false;return(S.res[c.res]||0)>=1&&(S.res[c.ore]||0)>=1&&S.zenny>=c.z;}
function moveSock(from,to){const js=(S.sock[from]||[]).filter(Boolean);delete S.sock[from];if(!js.length)return[];
 const slots=getWeaponSlots(to),arr=(S.sock[to]||slots.map(()=>null)).slice(0,slots.length);while(arr.length<slots.length)arr.push(null);
 const lost=[];js.sort((a,b)=>JEWELS.find(x=>x.id===b).sz-JEWELS.find(x=>x.id===a).sz);
 for(const jid of js){const sz=JEWELS.find(x=>x.id===jid).sz;let best=-1;slots.forEach((s,i)=>{if(!arr[i]&&s>=sz&&(best<0||s<slots[best]))best=i;});if(best>=0)arr[best]=jid;else lost.push(jid);}
 S.sock[to]=arr;return lost;}
function cleanSock(){for(const k of Object.keys(S.sock)){const isA=SLOTS.some(s=>k.startsWith(s.id+':'));if(isA?!S.armors.includes(k):!S.weapons.includes(k)){
  if(!isA){const[t,lid]=k.split(':');let L=LIN.find(x=>x.id===lid),n=null;while(L){const nx=LIN.find(x=>x.up===L.id);if(!nx)break;if(S.weapons.includes(t+':'+nx.id)){n=t+':'+nx.id;break;}L=nx;}if(n){moveSock(k,n);continue;}}
  delete S.sock[k];}}}
function jewelsUsed(){const u={};for(const k in S.sock)for(const j of S.sock[k])if(j)u[j]=(u[j]||0)+1;return u;}
function jewelFree(id){return(S.jewels[id]||0)-(jewelsUsed()[id]||0);}
function canPay(mon,r){if(S.zenny<r.z)return false;for(const k in r.mats)if((S.mats[matId(mon,k)]||0)<r.mats[k])return false;for(const k in(r.res||{}))if(((S.res&&S.res[k])||0)<r.res[k])return false;return true;}
function pay(mon,r){S.zenny-=r.z;for(const k in r.mats)S.mats[matId(mon,k)]-=r.mats[k];for(const k in(r.res||{}))S.res[k]-=r.res[k];}
const STAGE_N={1:"Low Rank ★1",2:"Low Rank ★2",3:"Low Rank ★3",4:"High Rank ★1",5:"High Rank ★2",6:"High Rank ★3",7:"Master Rank ★1",8:"Master Rank ★2",9:"Master Rank ★3"};
function tierQ(t,urg){return QUESTS.filter(q=>q.tier===t&&(urg==null||!!q.urgent===urg));}
function tierDone(t){return tierQ(t).every(q=>S.cleared[q.id]);}
function stageDone(t){return tierDone(t)||tierQ(t,true).some(q=>S.cleared[q.id]);}
function stageOpen(t){return t===1||(t>1&&stageDone(t-1));}
function unlocked(q){if(q.explore)return true;if(q.sp)return!!S.cleared[q.src];if(q.arena)return arenaOk(q);const t=q.tier;if(!t||!stageOpen(t))return false;
 return q.urgent?keyQ(t).every(x=>S.cleared[x.id]):true;}
function keyQ(t){return tierQ(t,false).filter(x=>!x.opt);}
function hr(){for(let t=1;t<=9;t++)if(!stageDone(t))return t;return 9;}
function hrLabel(){return STAGE_N[hr()]+(stageDone(9)?' ✓':'');}
function qStars(q){const t=q.tier||(q.sp&&(QUESTS.find(x=>x.id===q.src)||{}).tier)||0;return t?'★'.repeat(t>6?t-6:t>3?t-3:t):'★'.repeat(Math.min(3,q.stars));}
function qName(q){return q.gather?q.title:monLabel(q.mon,q.elite,q.anc)+(q.duo?' then '+monLabel(q.duo,q.elite,q.anc):'');}
function lockText(q){if(q.urgent)return`Urgent quest: first complete ${keyQ(q.tier).filter(x=>!S.cleared[x.id]).map(qName).join(', ')}.`;return"Locked.";}
function capBlock(q){return q.capture&&((S.items.piege||0)<1||(S.items.tranq||0)<2);}
function faintModal(f){if(!H||H.over||screen!=='hunt')return;const ex=H.q.explore;
 modal(`<div class="faintpop"><div class="fz">${uic('s_down','uic fzimg')}</div><h2>You fainted</h2>
 <p>The Griffus carried you back to camp. You return with full HP and stamina.</p>
 <ul class="small"><li>Time lost: <b>${f.rest} turn${f.rest!==1?'s':''}</b> (turn ${H.turn}/${H.max}).</li><li>Reward cut by <b>${Math.round(Math.min(.5,.25*H.faints)*100)}%</b> if you succeed.</li>${H.q.obj&&H.q.obj.some(o=>o.id==='nofaint')?"<li>“No fainting” objective failed.</li>":''}${ex?"<li>A third faint will end the expedition, and half the loot will be lost.</li>":"<li>On the third faint, the quest fails.</li>"}</ul>
 <div class="ftries">${[0,1,2].map(i=>`<i class="${i<H.faints?'x':''}"></i>`).join('')}<span>${f.left} attempt${f.left!==1?'s':''} left</span></div>
 <div style="display:flex;gap:8px"><button class="btn wide" data-a="faintflee">${ex?"Flee the fight":"Abandon the quest"}</button><button class="btn main wide" data-a="close">Continue</button></div>
 <p class="small muted" style="margin:8px 0 0">${ex?"Flee: you return to the expedition, and the monster is still roaming. You lose the fight’s time plus 2 hours fleeing.":"Abandon: no reward."}</p></div>`);}
function brisé(n){return'broken';}
function objKey(q){return q.src||q.id;}
function objGot(q){return(S.obj&&S.obj[objKey(q)])||[];}
function arenaOk(q){return q.anc?!!S.cleared['m_'+q.mon]:q.elite?eliteMet(q.mon):monMet(q.mon);}

/* ---------- Chasse ---------- */
function plate(d){const v=Math.round(d.hp*.055);return{hp:v,max:v,bare:0};}
function makeMonster(id,elite){const d=elite===2?ancDef(id):elite?eliteDef(id):MON[id];return{id,elite:!!elite,anc:elite===2,d,hp:d.hp,max:d.hp,
 parts:{tete:{dmg:0,cut:0,broken:false},flanc:{dmg:0,cut:0,broken:false},queue:{dmg:0,cut:0,broken:false,severed:false}},
 enraged:0,enrageAt:.75,sinceRage:0,stamina:100,exhausted:0,trapped:0,trapImm:0,ko:0,koAcc:0,koThr:d.ko,flinchAcc:0,flinched:false,flash:false,
 poisonAcc:0,poisonThr:d.poison,poisoned:0,flying:0,blind:0,flashes:0,topple:0,rock:0,rockHp:0,rockUses:0,charged:0,plates:d.plated?{tete:plate(d),flanc:plate(d),queue:plate(d)}:null,platesBroken:0,phase2:false,phaseQ:false,lava:null,chain:null,prep:null,tranq:0,open:0,forceRoar:false,lastMove:null,limp:false};}
function startHunt(qid,mealId,wid,basic){const q=QUESTS.find(x=>x.id===qid);const meal=MEALS.find(x=>x.id===mealId)||MEALS[0];
 if(S.zenny<meal.p)return;S.zenny-=meal.p;
 const felyne=(meal.id!=='none'&&rnd()<.5)?pick(FELYNE):null;
 const st=computeStats(meal,wid,basic);preloadMon(q.mon);
 if(!q.training){S.mon[q.mon]=S.mon[q.mon]||{seen:false,kills:0,caps:0};S.mon[q.mon].seen=true;if(q.elite&&!q.explore&&!q.anc)S.mon[q.mon].eseen=true;if(q.anc)S.mon[q.mon].aseen=true;save();}
 H={q,m:makeMonster(q.mon,q.anc?2:q.elite),turn:1,max:q.turns,faints:0,zone:'flanc',side:'g',moved:null,stats:st,meal,felyne,hp:st.hp,hpMax:st.hp,st:st.st,stMax:st.st,
  sharp:st.w.total,w:{charge:0,gauge:0,spirit:0,spiritT:0,demon:false,fcd:0},s:{burn:0,poison:0,gel:0,para:0,tet:0},
  used:{},atkBuff:0,defBuff:0,trap:false,freeItem:false,log:[],mark:0,fx:[],pend:[],over:false,breaks:[],guard:false,dodge:false,tackle:false,fore:false,fainted:false,intent:[],
  pal:palInit(),phase:'camp',sup:q.mon==='ferroi'&&(q.tier>0||q.sp)?{soin:2,baliste:3}:{soin:2},spots:[],harvest:[]};
 if(st.w.type==='gl'){H.w.shells=glCap();H.w.wf=0;if(st.w.var==='long')H.close=1;}
 if(st.w.type==='sa'){H.w.mode='axe';H.w.sw=100;}
 if(st.w.type==='ig'){H.w.ex={r:0,w:0,o:0};H.w.air=0;}
 if(st.w.type==='cb'){H.w.mode='sword';H.w.en=0;H.w.ph=0;H.w.shield=0;}
 if(isGun(st.w.type)){H.w.ammo='norm';H.w.mag=ammoCap('norm',st.w.type);H.w.siege=false;}
 const m=H.m;
 if(q.training){H.phase=null;H.pal=null;H.intent=[TRAIN_IDLE];m.aware=true;H.tr={tot:0,best:0,basic:!!basic};
  log("Training Grounds: the dummy never fights back. Unlimited items, nothing is used up. Tap “Help” to review your weapon’s mechanics.",'warn');
  H.log.push({m:"Turn 1",c:'sep',t:1});H.mark=0;saveHunt();go('hunt');trainHelp();return;}
 log(q.arena?`You enter the Guild arena. ${m.d.name} is circling on the far side of the gate, unaware of you.`:`You reach base camp. ${m.d.name} prowls ${HABN[m.d.hab]}, unaware of you.`,'warn');
 if(meal.id!=='none')log(`Meal: ${meal.n} (${meal.d}).`);
 if(felyne)log(`Canteen skill: ${felyne.n} (${felyne.d}).`,'good');
 log(q.mon==='ferroi'&&(q.tier>0||q.sp)?"The Guild provides 2 First-aid kits and 3 bolts for the rampart ballista.":"The Guild provides 2 First-aid kits.");
 H.mark=0;saveHunt();go('hunt');
 if(!S.tuto){S.tuto=true;save();if(S.tut==null)openGuide();}}
const UNAWARE={id:'#unaware',n:"Hasn’t seen you",t:"It’s searching the area, unaware of your presence.",z:[],fx:'unaware'};
function passive(mv){return mv&&(mv.fx==='idle'||mv.fx==='unaware');}
function engage(arg){const[z,sd]=String(arg||'flanc:g').split(':');if(!ZN[z])return;const m=H.m;
 H.phase=null;H.zone=z;if(z==='flanc')H.side=sd||'g';const where=z==='avant'?"from the front":z==='arriere'?"from the rear":"from the flank";
 if(z==='avant'){m.aware=true;H.intent=[introMove(m.d)];log(`You burst in ${where}: ${m.d.name} spots you at once!`,'warn');}
 else{m.aware=false;H.intent=[UNAWARE];log(`You creep in ${where}. ${m.d.name} hasn’t noticed you: surprise attack, +30% on your first hit!`,'good');
  tip('hold',"Hold your finger on an action button to see its full details.");
  tip('sneak',"Stealthy approach: your first action hits a monster that isn’t expecting you (+30%). It will roar afterward.");}
 tip('intent',"The banner below the arena shows the monster’s attack and the targeted zones (in red). You always act before it. A roar hits every zone: dodge it.");
 H.log.push({m:`Turn ${H.turn}`,c:'sep',t:H.turn});}
function spotsOf(){return H.q.arena?[]:(SPOTS[H.m.d.hab]||[]);}
function gather(i){const sp=spotsOf()[i];if(!sp||H.spots.includes(i))return false;const win=H.over&&R&&R.kind!=='fail';
 if(!(H.phase==='camp'||win))return false;
 if(H.phase==='camp'){if(H.turn>=H.max-5)return false;H.turn++;}
 H.spots.push(i);const n=2+(rnd()<.5?1:0)+(palS().voc==='collecte'?1:0);const got={};for(let k=0;k<n;k++){const r=wpick(sp.t);got[r]=(got[r]||0)+1;}
 S.res=S.res||{};for(const r in got){S.res[r]=(S.res[r]||0)+got[r];H.harvest.push([r,got[r]]);if(H.q.explore&&S.exp)S.exp.got[r]=(S.exp.got[r]||0)+got[r];}
 log(`🌿 ${sp.n}: ${Object.keys(got).map(r=>`${RES[r].n} ×${got[r]}`).join(', ')}${H.phase==='camp'?" (1 turn)":''}.`,'good');save();return true;}
/* ---------- Expédition libre ---------- */
const EXP_ADJ=[[1,2],[0,2,3],[0,1,4],[1,4],[2,3]];
const EXP_POS=[[150,160],[72,110],[228,110],[92,42],[208,42]];
const FILON={fer:"Iron vein",ardente:"Fire rock",boisdur:"Old stump",cristal:"Crystal vein",tonnerre:"Lightning-struck rock",dracite:"Dracite vein"};
function expZone(){return S.exp&&EXPZ.find(z=>z.id===S.exp.z);}
function monSeen(m){return!!(S.mon[m]&&S.mon[m].seen);}
function monMet(m){return QUESTS.some(q=>q.mon===m&&q.tier>0&&!q.elite&&S.cleared[q.id]);}
function eliteMet(m){return QUESTS.some(q=>q.mon===m&&q.tier>0&&q.elite&&!q.anc&&S.cleared[q.id]);}
function expOpen(z){return z===EXPZ[0]||(z.mr?mrOpen():monSeen(z.key));}
function expLockTxt(z){return z.mr?"Opens at Master Rank.":"Face this zone’s signature monster to unlock it.";}
function expOres(z){if(z.ores)return z.ores;return z.habs.map(h=>ZONE_ORE[MON_ORDER.find(m=>MON[m].hab===h)]);}
function expHides(z){return z.hides||z.mons.map(m=>ZONE_HIDE[m]);}
function canMeet(m){return MON[m].mrOnly?!!S.cleared['m_'+m]:monMet(m);}
function ancMet(m){return!!S.cleared['m_'+m];}
function expPool(z){const e=S.exp,b=(e&&e.beaten)||[];return z.mons.filter(m=>canMeet(m)&&!b.includes(m));}
function expTable(h,t){return t;}
function newExp(zid,qid){const z=EXPZ.find(x=>x.id===zid);const all=[];for(const h of z.habs)SPOTS[h].forEach((sp,k)=>all.push([h,k]));const ores=expOres(z),hides=expHides(z);
 const secs=z.secs.map((n,i)=>{const nodes=[];if(i===0){const[h,k]=pick(all);nodes.push({t:'g',h,s:k,u:1});return{n,nodes,seen:1};}
  const hb=z.habs[z.habs.length>1&&i>=3?1:0];const loc=all.filter(a=>a[0]===hb).sort(()=>rnd()-.5).slice(0,i>=3?1:2);for(const[h,k]of loc)nodes.push({t:'g',h,s:k,u:2});
  if(i>=3||rnd()<.6)nodes.push({t:'o',o:ores[Math.min(ores.length-1,i>=3?1:0)],u:2});
  nodes.push({t:'m',h:hides[Math.min(hides.length-1,i>=3?1:0)],u:1+Math.floor(rnd()*(i>=3?3:2.4))});
  return{n,nodes,seen:0};});
 const tr=1+Math.floor(rnd()*4);secs[tr].nodes.push({t:'c',u:1});
 const q=qid&&QUESTS.find(x=>x.id===qid);const max=q?q.hours:EXP_HOURS;
 if(q&&q.goal){const k=q.goal.k,hide=!!SMALL[k];secs.forEach((sc,i)=>{if(!i)return;let nd=sc.nodes.find(n=>hide?n.t==='m'&&n.h===k:n.t==='o'&&n.o===k);
  if(!nd){const at=sc.nodes.findIndex(n=>n.t===(hide?'m':'o'));nd=hide?{t:'m',h:k,u:2}:{t:'o',o:k,u:2};if(at>=0)sc.nodes.splice(at+1,0,nd);else sc.nodes.push(nd);}
  nd.u=Math.max(nd.u,2);nd.goal=1;});}
 return{v:2,z:zid,quest:q?q.id:null,h:0,max,sec:0,thr:0,secs,got:{},z0:0,kills:0,beaten:[],enc:null,log:[q?`Gathering quest: ${q.title}. Bring back ${RES[q.goal.k].n} ×${q.goal.n} within ${max} hours. No large monster roams here.`:`You set up camp: ${z.n}. ${max} hours until nightfall.`]};}
function expTF(){const e=S.exp;return(1-(palS().voc==='collecte'?.2:0)-(palHas('flair')?.15:0))*(e&&e.storm>e.h?1.5:1);}
const STORM_N={crete:"A storm breaks",glace:"A blizzard rises",lagon:"A squall sweeps the lagoon",plaine:"Ash rain is falling",foret:"An ill wind rises",col:"An ill wind rises",citadelle:"A storm breaks",eclipse:"An icy shadow covers the crater"};
const SHOP_OFF=()=>[['potion',3,120],['mega',2,300],['flash',2,150],['piege',1,250],eliteOpen()?['sphered',1,700]:['sphere',2,400]];
function expEvBan(e,ic,t,until){e.evb={ic,t,until};}
function expEvent(e,z,s,i){if(e.quest&&rnd()<.5)return;e.evn=e.evn||0;if(e.evn>=3||rnd()>.4)return;e.evn++;
 const seenM=z.mons.filter(monSeen),pool=[['orage',2],['brume',2],['gisement',2],['meute',2],['marchand',e.shopDone?0:1.5],['nid',e.quest?0:1.5],['carcasse',seenM.length?2:0]];
 const k=wpick(pool);const hb=z.habs[z.habs.length>1&&i>=3?1:0];
 if(k==='orage'){e.storm=e.h+4;expEvBan(e,elIcon('foudre'),(STORM_N[hb]||"The weather turns"),e.storm);expLog(`⛈️ ${STORM_N[hb]||"The weather turns"}: for 4 h, your tracks rise 50% faster.`);}
 else if(k==='brume'){e.thr=Math.max(0,e.thr-15);expEvBan(e,uic('s_elan'),"Thick fog: your tracks drop by 15",e.h+1);expLog("🌫️ A thick fog rolls over the zone: your tracks fade a little.");}
 else if(k==='gisement'){const o=eliteOpen()&&rnd()<.5?'dracite':expOres(z)[Math.min(expOres(z).length-1,i>=3?1:0)];s.nodes.push({t:'o',o,u:2,rich:1});expEvBan(e,icoImg('dracite','uic'),`Rich vein found: ${s.n}`,e.h+2);expLog(`💎 A rockslide has uncovered a rich vein: ${FILON[o]||RES[o].n}!`);}
 else if(k==='meute'){const hd=expHides(z)[Math.min(expHides(z).length-1,i>=3?1:0)],n=2+Math.floor(rnd()*2);e.h=Math.min(e.max,e.h+1);expGain(hd,n);e.kills+=n;expEvBan(e,itemIcon(hd,'uic'),`Pack repelled: ${RES[hd].n} ×${n}`,e.h+1);expLog(`🐺 A pack of ${SMALL[hd].n} jumps you! You fight it off (1 h): ${RES[hd].n} ×${n}.`);}
 else if(k==='marchand'){s.nodes.push({t:'ev',k:'shop',u:1});expEvBan(e,icoImg('sac','uic'),`A Peddler Griffu has set up shop: ${s.n}`,e.h+3);expLog("🐱 A Peddler Griffu has set up a stall here. It takes zenny.");}
 else if(k==='nid'){s.nodes.push({t:'ev',k:'nid',u:1});expEvBan(e,icoImg('nid','uic'),`Wyvern nest spotted: ${s.n}`,e.h+2);expLog("🥚 You spot a wyvern nest… with eggs still warm.");}
 else if(k==='carcasse'){s.nodes.push({t:'ev',k:'carc',m:pick(seenM),u:1});expEvBan(e,icoImg('carcasse','uic'),`Carcass to carve: ${s.n}`,e.h+2);expLog("🦴 A large monster’s carcass lies here: another predator didn’t finish it.");}}
function openShop(){const e=S.exp;if(!e)return;const off=SHOP_OFF();
 modal(`<h2>${icoImg('sac','uic')} Peddler Griffu</h2><p class="small muted">“Meow! Good gear, cheap, nya.” You have ${S.zenny} z. Buying takes no time.</p><div class="plist">${off.map(([k,n,p],i)=>{const nm=ITEMS[k]?ITEMS[k].n:RES[k].n,ok=S.zenny>=p;return`<div class="pick">${itemIcon(k,'iicon')}<span><b>${esc(nm)} ×${n}</b><small>${p} z</small></span><button class="btn sm ${ok?'go':''}" data-a="xbuy" data-v="${i}" ${ok?'':'disabled'}>Buy</button></div>`;}).join('')}</div><button class="btn wide" data-a="close" style="margin-top:10px">Leave</button>`);}
function expQ(){return S.exp&&S.exp.quest&&QUESTS.find(x=>x.id===S.exp.quest);}
function expGoal(){const e=S.exp,q=expQ();if(!q||e.qdone)return;if((e.got[q.goal.k]||0)>=q.goal.n){e.qdone=1;const first=!S.cleared[q.id];S.cleared[q.id]=(S.cleared[q.id]||0)+1;
 const zz=q.z;S.zenny+=zz;e.z0+=zz;S.res.sphere=(S.res.sphere||0)+2;e.got.sphere=(e.got.sphere||0)+2;palGainXP(10+5*q.tier).forEach(t=>expLog('🐱 '+t));
 expLog(`📜 Quest complete: ${q.title}! Reward ${zz} z and 2 armor spheres. Head back whenever you like.`);setTimeout(()=>sfx('win'),60);
 if(first&&hr()>q.tier&&!stageDone(hr()))e.rankUp=hr();}}
function expLog(m){const e=S.exp;e.log.push(m);if(e.log.length>30)e.log.splice(0,e.log.length-30);}
function expGain(k,n){const e=S.exp;S.res[k]=(S.res[k]||0)+n;e.got[k]=(e.got[k]||0)+n;}
function nodeInfo(z,nd){
 if(nd.t==='g'){const s=SPOTS[nd.h][nd.s];return{n:s.n,ic:spotIcon(s.k),sub:expTable(nd.h,s.t).map(e=>RES[e[0]].n).join(', '),btn:"Gather"};}
 if(nd.t==='ev'){if(nd.k==='shop')return{n:"Peddler Griffu",ic:icoImg('sac','iicon'),sub:"Potions, traps, spheres… for zenny",btn:"Trade",free:1};if(nd.k==='nid')return{n:"Wyvern nest",ic:icoImg('nid','iicon'),sub:"Eggs to sell… but the parent isn’t far",btn:"Take"};return{n:`${MON[nd.m].name} carcass`,ic:icoImg('carcasse','iicon'),sub:"Still fresh: a few materials to salvage",btn:"Carve"};}
 if(nd.t==='o')return{n:nd.rich?"Rich vein":FILON[nd.o],ic:itemIcon(nd.o,'iicon'),sub:RES[nd.o].n+(nd.o!=='dracite'&&eliteOpen()?", rarely dracite":''),btn:"Mine"};
 if(nd.t==='m'){const sm=SMALL[nd.h];return{n:`${sm.n}${nd.u>1?` ×${nd.u}`:''}`,ic:critterIcon(nd.h),sub:sm.d,btn:"Slay",mon:1};}
 return{n:"Buried chest",ic:chestIcon(),sub:"Something glints beneath the roots…",btn:"Open"};}
function expAct(kind,arg){const e=S.exp,z=expZone();if(!e||e.enc||e.ko||e.h>=e.max)return;const sec=e.secs[e.sec];
 if(kind==='move'){const to=+arg;if(!EXP_ADJ[e.sec].includes(to))return;e.h++;e.sec=to;const s=e.secs[to];const first=!s.seen;s.seen=1;
  if(to===0){if(e.omen){const dm=zDanger(z);if(!canMeet(dm)||rnd()<.5){e.omen=0;expLog(DANGER[dm].shake);}else expLog(DANGER[dm].stay);}e.thr=Math.floor(e.thr/2);expLog(e.quest?"Back at camp.":`Back at camp. You cover your tracks (tracks ${Math.round(e.thr)}%).`);sfx('steps');return expTick(true);}
  e.thr+=z.rate*.6*expTF();expLog(`You reach: ${s.n}${first?" (new sector)":''}.`);sfx('steps');if(first)expEvent(e,z,s,to);return expTick();}
 const nd=sec.nodes[+arg];if(!nd||nd.u<=0)return;if(nd.t==='ev'&&nd.k==='shop'){openShop();return;}e.h++;nd.u--;if(nd.goal&&nd.u<=0&&e.quest)nd.back=e.h+3;
 if(nd.t==='g'||nd.t==='o'){const tb=nd.t==='g'?expTable(nd.h,SPOTS[nd.h][nd.s].t):[[nd.o,6],['os',1]].concat(eliteOpen()&&nd.o!=='dracite'?[['dracite',.6]]:[]);
  const n=3+(rnd()<.5?1:0)+(nd.t==='g'&&palS().voc==='collecte'?1:0)+(palHas('pisteur')?1:0)+(nd.rich?2:0);const got={};for(let i=0;i<n;i++){const r=wpick(tb);got[r]=(got[r]||0)+1;}for(const r in got)expGain(r,got[r]);
  e.thr+=z.rate*expTF();expLog(`${nd.t==='g'?'🌿':'⛏️'} ${nodeInfo(z,nd).n}: ${Object.keys(got).map(r=>`${RES[r].n} ×${got[r]}`).join(', ')}.`);sfx('gather');}
 else if(nd.t==='m'){const hide=nd.h;const got={[hide]:1+(rnd()<.6?1:0)};if(rnd()<.4)got.viande=1;if(rnd()<.3)got.os=1;for(const r in got)expGain(r,got[r]);
  e.kills++;e.thr+=(z.rate+3)*expTF();expLog(`🗡️ You slay a ${SMALL[hide].n}: ${Object.keys(got).map(r=>`${RES[r].n} ×${got[r]}`).join(', ')}.`);sfx('cut');}
 else if(nd.t==='ev'&&nd.k==='nid'){const zz=(150+Math.round(rnd()*4)*50)*Math.max(1,Math.ceil(hr()/2));S.zenny+=zz;e.z0+=zz;e.thr+=25*expTF();expLog(`🥚 You take the eggs: they’ll fetch ${zz} z in the village. But the smell will draw company…`);sfx('coin');}
 else if(nd.t==='ev'&&nd.k==='carc'){const m=nd.m,got=[];for(let i=0;i<2;i++){const k=pick(['ecaille','peau','griffe']),id=matId(m,k);S.mats[id]=(S.mats[id]||0)+1;got.push(MON[m].mats[k]);}if(rnd()<.15){const id=matId(m,'rare');S.mats[id]=(S.mats[id]||0)+1;got.push(MON[m].mats.rare);}e.thr+=z.rate*expTF();expLog(`🦴 You carve the carcass: ${got.join(', ')}.`);sfx('cut');}
 else if(nd.t==='c'){const el=eliteOpen();const k=el&&rnd()<.5?'sphered':'sphere',n=k==='sphered'?1:2,zz=150+Math.round(rnd()*4)*50;expGain(k,n);S.zenny+=zz;e.z0+=zz;
  e.thr+=z.rate*expTF();expLog(`🎁 Buried chest: ${RES[k].n} ×${n} and ${zz} z!`);sfx('coin');}
 expTick();}
function expRegen(e){if(!e.quest)return;e.secs.forEach(sc=>sc.nodes.forEach(nd=>{if(nd.back&&e.h>=nd.back){nd.u=2;delete nd.back;expLog(nd.t==='m'?`🐾 The ${SMALL[nd.h].n} have returned: ${sc.n}.`:`⛏️ Fresh chunks have broken loose: ${sc.n}.`);}}));}
function expTick(safe){const e=S.exp,z=expZone();e.thr=Math.min(90,e.thr);expRegen(e);const pool=e.quest?[]:expPool(z);expGoal();
 if(!safe&&pool.length&&e.h<e.max&&e.thr>=10&&rnd()*100<e.thr*.22){const mon=pick(pool);const an=MON[mon].mrOnly||(ancMet(mon)&&rnd()<.2),el=!an&&eliteMet(mon)&&rnd()<.3;e.enc={mon,el:el?1:0,an:an?1:0};
  expLog(`⚠️ ${monLabel(mon,el,an&&!MON[mon].mrOnly)} appears!`);setTimeout(()=>sfx('roar'),60);}
 else if(!safe&&!e.quest&&e.h<e.max&&zDanger(z)&&!(e.beaten||[]).includes(zDanger(z))&&dangerRoll(e,z)){}
 else if(e.h>=e.max)expLog("🌙 Night falls: time to head back.");
 save();render();}
function dangerRoll(e,z){const dm=zDanger(z),D=DANGER[dm],hunted=canMeet(dm);if(!e.omen){if(e.thr>=(hunted?18:25)&&rnd()<(hunted?.07:.045)){e.omen=1;expLog(D.omen+" Head back to camp!");setTimeout(()=>sfx('roar'),60);return true;}return false;}
 if(rnd()<.35){e.omen=0;e.enc={mon:dm,el:0,an:MON[dm].mrOnly||(ancMet(dm)&&rnd()<.3)?1:0,danger:1};expLog(D.come);setTimeout(()=>sfx('roar'),60);return true;}return false;}
function expFight(){const e=S.exp;if(!e||!e.enc)return;const qid=(e.enc.an?'xa_':e.enc.el?'xe_':'x_')+e.enc.mon;const sec=e.secs[e.sec].n;
 startHunt(qid,'none');if(!H)return;const m=H.m;H.log=[];H.phase=null;H.zone='flanc';H.side='g';m.aware=true;H.intent=[introMove(m.d)];
 log(`${m.d.name} appears before you (${sec})! No time to plan an approach: it has spotted you.`,'warn');
 log(m.id==='ferroi'?"Expedition encounter: no meal, no ballista. Just 2 First-aid kits in your pouch.":"Expedition encounter: no meal, but the Guild left you 2 First-aid kits.",m.id==='ferroi'?'bad':'');
 H.log.push({m:`Turn ${H.turn}`,c:'sep',t:H.turn});H.mark=0;saveHunt();render();}
function expFlee(){const e=S.exp;if(!e||!e.enc)return;const nb=EXP_ADJ[e.sec];e.sec=pick(nb);e.secs[e.sec].seen=1;e.h=Math.min(e.max,e.h+2);e.thr=0;e.enc=null;
 expLog(`You flee to: ${e.secs[e.sec].n} (2 h). The monster loses your trail.`);sfx('dodge');save();render();}
function expOnHuntEnd(r){const e=S.exp;if(!e||!e.enc)return;e.enc=null;const ch=Math.max(1,Math.ceil((r.turns-1)/10)),fled=r.kind==='fail'&&!!r.fled;e.h=Math.min(e.max,e.h+ch+(fled?2:0));e.thr=0;
 if(r.kind!=='fail'){e.beaten.push(r.mon);expLog(`🏆 ${MON[r.mon].name} ${r.kind==='capture'?"captured":'slain'} (${ch} h of fighting).${expPool(expZone()).length?'':" The area is calm."}`);}
 else if(r.faints>=3){const lost={};for(const k in e.got){const l=Math.min(Math.floor(e.got[k]/2),S.res[k]||0);if(l>0){lost[k]=l;S.res[k]-=l;e.got[k]-=l;if(!e.got[k])delete e.got[k];}}
  e.ko=lost;expLog(`💀 Felled by ${MON[r.mon].name}. The Griffus carry you back to the village: half the loot is lost on the way.`);}
 else expLog(`${fled?`You flee the fight (${ch} h of fighting + 2 h fleeing)`:`The monster eventually wanders off (${ch} h of fighting)`}. ${MON[r.mon].name} is still roaming.`);
 if(e.h>=e.max)expLog("🌙 Night falls: time to head back.");}
function expAfterHunt(){H=null;R=null;save();go('explore');}
function expEnd(){const e=S.exp;if(!e)return;const z=expZone();const g=Object.keys(e.got);S.exp=null;H=null;R=null;save();go('village');if(!e.ko)sfx('coin');
 const lk=e.ko?Object.keys(e.ko):[];
 const q=e.quest&&QUESTS.find(x=>x.id===e.quest);
 modal(`<h2>${e.ko?"Brought back to the village":"Back from the expedition"}</h2>${q?(e.qdone?`<p class="small" style="color:var(--good)">📜 Quest complete: ${esc(q.title)}.</p>${e.rankUp?`<div class="finale"><b>Promotion: ${STAGE_N[e.rankUp]}!</b><span>New quests await you on the board.</span></div>`:''}`:`<p class="small" style="color:var(--danger)">Objective not met: ${esc(q.title)} stays on the Quest Board.</p>`):''}${e.ko?`<p class="small" style="color:var(--danger)">You were felled. ${lk.length?`Lost on the way: ${lk.map(k=>`${RES[k].n} ×${e.ko[k]}`).join(', ')}.`:"You had nothing to lose."}</p>`:''}<p>${esc(z.n)}: ${e.h} h in the field, ${e.kills} small monster${e.kills!==1?'s':''} slain${e.beaten.length?`, ${e.beaten.map(m=>esc(MON[m].name)).join(' and ')} defeated`:''}.</p>
 ${g.length?`<div class="skl">${g.map(k=>`<span class="tag">${itemIcon(k,'iicon sm')}${RES[k].n} ×${e.got[k]}</span>`).join('')}</div>`:"<p class=\"small muted\">You come home empty-handed.</p>"}
 ${e.z0?`<p class="small">Treasure: ${e.z0} z.</p>`:''}<button class="btn main wide" data-a="close">Close</button>`);}
function chestIcon(){return icoImg('coffre','iicon');}
const SMIMG=new Set(['c_rod','c_brou','c_lou','c_sal','c_kel','c_ping','c_volt','c_garg','c_pin']);
function critterIcon(h,cls='iicon'){if(SMIMG.has(h))return`<img class="${cls} crit" src="img/sm/${h}.webp" alt="" draggable="false">`;return'';}
function expMapSVG(){const e=S.exp,z=expZone(),h=HAB[z.hab]||HAB.col;const adj=e.enc||e.h>=e.max?[]:EXP_ADJ[e.sec];
 let s=`<svg class="xmap" viewBox="0 0 300 210" aria-label="Zone map: tap a neighboring sector to go there"><defs><clipPath id="xclip"><rect x="2" y="2" width="296" height="206" rx="14"/></clipPath><linearGradient id="xtg" x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stop-color="#fff"/><stop offset=".5" stop-color="#000"/></linearGradient><mask id="xtop"><rect x="0" y="0" width="300" height="210" fill="url(#xtg)"/></mask></defs>
 <g clip-path="url(#xclip)"><image href="img/map/${z.id}.webp" x="-7" y="0" width="314" height="210" preserveAspectRatio="xMidYMid slice"/></g>
 <rect x="2" y="2" width="296" height="206" rx="14" fill="var(--bg)" fill-opacity=".08" stroke="var(--line)"/>`;
 const done=new Set();EXP_ADJ.forEach((l,a)=>l.forEach(b=>{const key=Math.min(a,b)+'-'+Math.max(a,b);if(done.has(key))return;done.add(key);const[x1,y1]=EXP_POS[a],[x2,y2]=EXP_POS[b];
  const on=(a===e.sec&&adj.includes(b))||(b===e.sec&&adj.includes(a)),mx=(x1+x2)/2+(y2-y1)*.08,my=(y1+y2)/2-(x2-x1)*.08,d=`M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
  s+=`<path d="${d}" fill="none" stroke="rgba(20,14,8,.45)" stroke-width="${on?6.5:4.5}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${on?'#f3dfa8':'#d9c595'}" stroke-width="${on?3.2:2.2}" stroke-dasharray="${on?'7 5':'3 6'}" stroke-linecap="round" opacity="${on?1:.7}"/>`;}));
 e.secs.forEach((sc,i)=>{const[x,y]=EXP_POS[i],cur=i===e.sec,can=adj.includes(i);const left=sc.nodes.reduce((a,n)=>a+(n.u>0?1:0),0);const R=cur?27:23;
  s+=`<g class="xsec${cur?' cur':''}${can?' can':''}" ${can?`data-a="xmove" data-v="${i}"`:''}>${can?`<circle class="xring" cx="${x}" cy="${y}" r="${R+3}" fill="none" stroke="#f3dfa8" stroke-width="2.5"/>`:''}
  <image href="img/mark/${i===0?'camp':sc.seen?'disc':'fog'}.webp" x="${x-R-(i===0?6:0)}" y="${y-R-(i===0?6:0)}" width="${2*R+(i===0?12:0)}" height="${2*R+(i===0?12:0)}"/>
  ${i===0?'':cur?`<circle cx="${x+R-4}" cy="${y+R-6}" r="10" fill="#f3dfa8" stroke="#3a2a14" stroke-width="1.5"/><text x="${x+R-4}" y="${y+R-2}" text-anchor="middle" font-size="12" font-weight="800" fill="#3a2a14">${left||'✓'}</text>`:sc.seen?`<text x="${x}" y="${y+6}" text-anchor="middle" font-size="17" font-weight="800" fill="#3a2a14">${left||'✓'}</text>`:`<text x="${x}" y="${y+6}" text-anchor="middle" font-size="17" font-weight="700" fill="#e8e0cc">?</text>`}
  ${cur?`<image href="img/mark/pin.webp" x="${x-22}" y="${y-43}" width="44" height="44"/>`:''}${sc.nodes.some(n=>(n.t==='ev'||n.rich)&&n.u>0)?`<image href="img/mark/star.webp" x="${x-R-6}" y="${y-R-8}" width="20" height="20"/>`:''}${palHas('flair')&&sc.nodes.some(n=>n.t==='c'&&n.u>0)?`<text x="${x-19}" y="${y+24}" font-size="14" fill="var(--brass)" paint-order="stroke" stroke="var(--bg)" stroke-width="3">✦</text>`:''}
  <text x="${x}" y="${y+(i>=3?-31:i===0?42:39)}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff6e0" paint-order="stroke" stroke="rgba(20,14,8,.85)" stroke-width="3.2">${esc(sc.n)}</text></g>`;});
 if(e.omen&&!e.enc)s+=`<image href="img/mark/seal.webp" x="262" y="8" width="30" height="30"><title>Great danger</title></image>`;
 return s+'</svg>';}
function thrLabel(t){return t<15?"No tracks":t<35?"Old tracks":t<60?"Fresh tracks":"It is very close";}
function vExplore(){if(S.exp&&S.exp.ko)return`<div class="scenegap" style="height:110px"></div><h2>Felled</h2><p>The Griffus carried you back to the village. Half the expedition’s loot was lost on the way.</p><button class="btn main wide" data-a="xend-yes">Back to the village</button>`;if(!S.exp){return backBtn()+`<h2>Free Expedition</h2><p class="small muted" style="margin-top:0">Explore a zone with no quest and no turn limit: ${EXP_HOURS} hours to gather, mine and slay small monsters. Their materials feed the forge. But the more you stir things up, the more likely a large monster whose quest you’ve cleared will pick up your trail.</p><p class="small" style="color:var(--danger);margin:0 0 10px">☠️ Each zone has its <b>great danger</b>: a fearsome monster that can appear even early in your career. When an omen heralds it, return to camp.</p>
 <div class="qlist">${EXPZ.map(z=>{const ok=expOpen(z),met=z.mons.filter(canMeet);
  return`<button class="qcard xcard pcard ${ok?'':'locked'}"${pano(z.habs[0])} data-a="${ok?'xstart':'noop'}" data-v="${z.id}"><div class="qtxt"><b>${esc(z.n)}</b><span class="muted small">${esc(z.d)}.</span>
  ${ok?`<span class="xmons">${z.mons.map(m=>{const can=met.includes(m),seen=monSeen(m);return`<span class="xmon ${can?'':'off'}">${portrait(m,seen?(can&&ancMet(m)?'elite anc':can&&eliteMet(m)?'elite':''):'unk')}<i>${seen?esc(MON[m].name):'???'}${can&&ancMet(m)&&!MON[m].mrOnly?'<small class="xag anc">'+ancTag(m)+'</small>':can&&eliteMet(m)?'<small class="xag">'+elTag(m)+'</small>':''}</i></span>`;}).join('')}</span><span class="small muted">${met.length?"In color: monsters that can appear (you’ve cleared their quest).":"No quests cleared against the monsters here: explore in peace."}</span>`:`<span class="small">${expLockTxt(z)}</span>`}
  ${ok&&z.danger?(()=>{const dm=z.danger,sn=monSeen(dm);return`<span class="xdz">${portrait(dm,sn?'':'unk')}<span><b>Great danger: ${sn?esc(MON[dm].name):'???'}</b>${canMeet(dm)?"<small>You’ve beaten it: it roams more often and keeps on your trail.</small>":"<small>Flee at the first omen.</small>"}</span></span>`;})():''}
  ${ok?`<span class="xres">${[...new Set([...expOres(z),...expHides(z)])].map(k=>`<span class="tag">${itemIcon(k,'iicon sm')}${RES[k].n}</span>`).join('')}</span>`:''}</div></button>`;}).join('')}</div>`;}
 const e=S.exp,z=expZone(),sc=e.secs[e.sec],left=e.max-e.h,over=left<=0;
 const tc=e.thr<15?'var(--good)':e.thr<35?'var(--brass)':e.thr<60?'#e08a2a':'var(--danger)';
 const g=Object.keys(e.got);
 const enc=e.enc?`<div class="xenc">${portrait(e.enc.mon,e.enc.an?'elite anc':e.enc.el?'elite':'')}<div><b>${esc(monLabel(e.enc.mon,e.enc.el,e.enc.an&&!MON[e.enc.mon].mrOnly))} appears!</b><span class="small">${e.enc.danger?"<b style=\"color:var(--danger)\">Great danger.</b> This zone’s master, nearly unbeatable without the right gear. Fleeing now costs 2 hours; staying means risking everything.":"It caught your scent and blocks your path. The fight costs 1 hour per 10 turns; fleeing now costs 2 hours."}</span>
  <div class="xencb"><button class="btn main" data-a="xfight">Fight it</button><button class="btn" data-a="xflee">Flee (2 h)</button></div></div></div>`:'';
 const nodes=sc.nodes.map((nd,i)=>{const f=nodeInfo(z,nd),dis=nd.u<=0||over||!!e.enc;return`<button class="spot${f.mon?' xmon':''}${nd.t==='ev'||nd.rich?' xev':''}" data-a="xact" data-v="${i}" ${dis?'disabled':''}>${f.ic}<span><b>${esc(f.n)}</b><small>${nd.u<=0?(nd.back?`${nd.t==='m'?"Back":"Reforms"} in ${Math.max(1,nd.back-e.h)} h`:nd.t==='m'?"None left here":"Depleted"):esc(f.sub)}</small></span><em>${nd.u<=0?'✓':f.btn+(f.free?'':" · 1 h")}</em></button>`;}).join('');
 return`<div class="htop"><div><div class="qt">${expQ()?esc(expQ().title):esc(z.n)}</div><div class="muted small">${over?"Night has fallen":`${e.h} h elapsed, ${left} h until nightfall`}</div></div><div class="tbtns">${soundBtn()}<button class="btn ghost sm" data-a="xend">Head back</button></div></div>
 <div class="xgauges"><div class="brow"><span>Time</span>${bar(e.max-e.h,e.max,'st')}<em>${left} h</em></div>
 ${expQ()?(()=>{const q=expQ(),have=Math.min(q.goal.n,e.got[q.goal.k]||0);return`<div class="brow xthr"><span>Objective</span>${bar(have,q.goal.n,'hp')}<em>${e.qdone?"✓ Done":`${itemIcon(q.goal.k,'iicon sm')}${have}/${q.goal.n}`}</em></div>`;})():`<div class="brow xthr"><span>Tracks</span><div class="bar"><i style="width:${clamp(e.thr,0,100)}%;background:${tc}"></i></div><em>${expPool(z).length?thrLabel(e.thr):"Calm"}</em></div>`}</div>
 ${!e.enc&&e.evb&&e.h<e.evb.until?`<div class="xevent"><b>${e.evb.ic}</b><span><b>Event</b> · ${esc(e.evb.t)}${e.storm>e.h?` · tracks ×1.5 for ${e.storm-e.h} more h`:''}</span></div>`:''}${e.omen&&!e.enc&&zDanger(z)?`<div class="xomen"><img class="uic xseal" src="img/mark/seal.webp" alt="">${esc(DANGER[zDanger(z)].omen.replace(/^\S+\s/,''))} Return to camp to ${canMeet(zDanger(z))?"try to ":''}escape it.</div>`:''}${enc}<div class="xmapbox">${expMapSVG()}</div><p class="small muted xleg">Number: points of interest left. Tap a connected sector to go there (1 h).</p>
 <h3 class="xh">${esc(sc.n)}${e.sec===0&&!e.quest?" <span class=\"small muted\">· tracks halved when you come back here</span>":''}</h3>
 ${over?`<p class="small">It’s too dark to go on. Return to the village with your loot.</p><button class="btn main wide" data-a="xend">Back to the village</button>`:`<div class="spots">${nodes||"<p class=\"small muted\" style=\"margin:0\">Nothing to gather here. Tap a neighboring sector on the map (1 h).</p>"}</div>`}
 <div class="recap">${e.log.slice(-4).map((l,i,a)=>`<div class="le${i===a.length-1?' new':''}">${esc(l)}</div>`).join('')}</div>
 ${g.length?`<h3>Loot</h3><div class="skl">${g.map(k=>`<span class="tag">${itemIcon(k,'iicon sm')}${RES[k].n} ×${e.got[k]}</span>`).join('')}</div>`:''}`;}
function canCraft(rc){for(const k in rc.ins){const have=RES[k]?(S.res[k]||0):(S.items[k]||0);if(have<rc.ins[k])return false;}return true;}
const CRAFT_CAT=[['soins',"Healing",['potion','mega','antidote','steak']],['renfort',"Reinforcements",['grain','armure']],['chasse',"Hunting",['flash','piege','tranq']],['muni',"Ammo",['fiole_p','fiole_v','mun_perf','mun_el','mun_som']]];
const PREP_LIST=['potion','antidote','steak','flash'];
function craftBatches(rc){let n=1e9;for(const k in rc.ins){const have=RES[k]?(S.res[k]||0):(S.items[k]||0);n=Math.min(n,Math.floor(have/rc.ins[k]));}return n;}
function fillBatches(rc){const it=ITEMS[rc.out],need=Math.max(0,it.carry-(S.items[rc.out]||0));return Math.min(craftBatches(rc),Math.ceil(need/(rc.n||1)));}
function craftN(out,k){let d=0;for(let i=0;i<k;i++){if(!craft(out))break;d++;}return d;}
function rangedPrep(){const t=getWeapon(S.equip.weapon).type;return t==='bow'?['fiole_p']:isGun(t)?['mun_perf']:[];}
function prepSack(){const list=PREP_LIST.concat(rangedPrep());const done=[];
 for(const k of list){const rc=RECIPES.find(r=>r.out===k);if(!rc)continue;const b=fillBatches(rc);if(b>0){const n=craftN(k,b)*(rc.n||1);if(n)done.push(`${ITEMS[k].n} ×${n}`);}}return done;}
function craft(out){const rc=RECIPES.find(r=>r.out===out);if(!rc||!canCraft(rc))return false;
 for(const k in rc.ins){if(RES[k])S.res[k]-=rc.ins[k];else S.items[k]-=rc.ins[k];}S.items[out]=(S.items[out]||0)+(rc.n||1);save();return true;}
function introMove(d){return{id:'#intro',n:d.roar,t:"It has spotted you and rears up to its full height!",z:ALLZ,fx:'roar',intro:1};}
function roarMove(d){return{id:'#roar',n:d.roar,t:"It rears up, mad with rage!",z:ALLZ,fx:'roar'};}
function moveById(d,id){return id==='#train'?TRAIN_IDLE:id==='#idle'?IDLE:id==='#unaware'?UNAWARE:id==='#intro'?introMove(d):id==='#roar'?roarMove(d):d.moves.find(x=>x.id===id);}
const HKEY='grande-traque-chasse';
function saveHunt(){try{if(!H||H.over){localStorage.removeItem(HKEY);return;}
 const m=Object.assign({},H.m);delete m.d;
 const o=Object.assign({},H,{q:H.q.id,m,meal:H.meal.id,intent:(H.intent||[]).map(x=>x.id),fx:[],pend:[]});
 localStorage.setItem(HKEY,JSON.stringify(o));}catch(e){}}
function loadHunt(){try{const raw=localStorage.getItem(HKEY);if(!raw)return null;const o=JSON.parse(raw);
 o.q=QUESTS.find(x=>x.id===o.q);o.spots=o.spots||[];o.harvest=o.harvest||[];o.m.d=o.m.anc?ancDef(o.m.id):o.m.elite?eliteDef(o.m.id):MON[o.m.id];o.meal=MEALS.find(x=>x.id===o.meal)||MEALS[0];
 o.intent=o.intent.map(id=>moveById(o.m.d,id)).filter(Boolean);if(!o.q||!o.m.d||(!o.intent.length&&o.phase!=='camp'))return null;return o;}catch(e){return null;}}
function zAngle(z,side){return z==='avant'?0:z==='arriere'?180:(side==='d'?90:270);}
function afterZone(z,after){return after==='flip'?(z==='avant'?'arriere':z==='arriere'?'avant':'flanc'):after==='face'?'avant':z;}
function tip(k,txt){if(!S.tips)S.tips={};if(S.tips[k])return;S.tips[k]=1;log('💡 '+txt,'tip');}
function log(msg,c=''){H.log.push({m:msg,c,t:H.turn});}
function flush(){for(const p of H.pend)log(p[0],p[1]);H.pend=[];}
function sharpLevel(){let acc=0;const a=H.stats.w.sharp;if(H.sharp<=0)return 0;for(let i=0;i<a.length;i++){acc+=a[i];if(H.sharp<=acc)return i;}return a.length-1;}
function elemOf(mv){return mv.el||{burn:'fire',poison:'poison',gel:'ice',para:'bolt'}[mv.st]||'phys';}
function effZones(mv){if(mv.track)return[H.zone];let z=mv.z||[];if(mv.tail&&H.m.parts.queue.severed)z=z.filter(x=>x!=='flanc');if(z.length&&farAway(mv))return[];return z;}
function monDmg(mv,exact){const m=H.m;let d=mv.d;if(mv.tail&&m.parts.queue.severed)d*=.8;if(m.enraged>0)d*=1.25;if(m.charged>0)d*=1.3;if(m.exhausted>0)d*=.7;if(m.phase2)d*=1.15;return exact?d:d*(.9+rnd()*.2);}
function estDmg(mv){return Math.round(monDmg(mv,true)*100/(100+H.stats.def));}
function rollCost(){return dodgeCost()+5;}
function dodgeCost(){return Math.max(12,30-5*H.stats.sk.esquive-(H.w.demon?5:0)-(H.w.ex&&H.w.ex.w>0?6:0));}
function hz(pid,type){const m=H.m,p=m.d.parts[pid],st=m.parts[pid];let v=p[type];
 if(pid==='queue'&&st.severed)v=Math.round(v*.7);if(st.broken)v=Math.min(100,v+10);
 if(pid==='tete'&&m.rock>0)v=25;
 if(m.harden>0&&pid!=='tete')v=Math.round(v*(type==='blunt'?.8:.6));
 if(m.plates&&!m.phase2){const pl=m.plates[pid];if(pl.hp>0)v=type==='blunt'?48:34;else if(pl.bare>0)v=95;}
 if(m.phase2&&m.d.plated)v=Math.min(100,v+10);if(pid==='tete'&&m.charged>0)v=Math.min(100,v+15);return v;}

function calcDmg(h,pid,exp){if(h.fixed){const m=H.m,st=H.stats;let d=h.fixed*(1+H.atkBuff+st.atkPct+(H.song&&H.song.atk>0?.15:0)+(H.fren>0?.15:0))*(H.intent&&H.intent[0]&&H.intent[0].fx==='stance'?.35:1)*(1+.12*st.sk.artillerie);if(m.storm>0)d*=m.parts.tete.broken?.8:.65;if(m.open>0)d*=1.25;if(H.riposte>0)d*=1+GUARD.rip+GUARD.lv*st.sk.garde;if(m.flying)d*=.5;
  return{dmg:Math.max(1,exp?d:Math.round(d*(.97+rnd()*.06))),bounce:false,crit:false,weak:false};}
 const m=H.m,st=H.stats,W=st.w,RG=!!WT[W.type].ranged,SH=RG?{raw:1,el:1}:SHARP[sharpLevel()];
 const rage=m.enraged>0?st.sk.agitateur:0;const atkv=st.atk+5*rage;
 const z=hz(pid,h.type);const aff=st.aff+7*rage+(z>=70?15*st.sk.faiblesse:0);const cm=st.sk.crit_boost?1.4:1.25;let mul=h.mv/100*z/100*SH.raw;let bounce=false;
 if(!RG&&z/100*SH.raw<.42){bounce=true;mul*=.6;}
 let crit=false;
 if(exp)mul*=aff>=0?1+Math.min(1,aff/100)*(cm-1):1+aff/100*.25;
 else if(aff>0&&rnd()*100<aff){crit=true;mul*=cm;}else if(aff<0&&rnd()*100<-aff)mul*=.75;
 let raw=atkv*mul;if(W.type==='ls')raw*=[1,1.05,1.1,1.15][H.w.spirit];if(W.type==='sa'&&H.w.mode==='sword')raw*=W.var==='el'?1.05:1.2;if(W.type==='ig'&&H.w.ex){if(H.w.ex.r>0)raw*=1.1;if(triple())raw*=1.1;}raw*=1+H.atkBuff+st.atkPct+(palHas('meneur')&&H.pal&&!H.pal.ko?.05:0)+(H.song&&H.song.atk>0?.15:0)+(H.fren>0?.15:0);if(h.shot&&H.coat&&H.coat.k==='fiole_p')raw*=1.3;if(h.shot&&H.w.siege)raw*=1.5;if(h.shot)raw*=1+.06*st.sk.tir;
 let el=0;if(W.elem){const wk=m.d.weak[W.elem]||0;el=W.ev*(1+.08*st.sk.elem)*wk*(z>=60?1:.75)*SH.el*h.em;}
 let dmg=raw+el;if(m.flying&&!RG&&!h.air)dmg*=.5;if(m.storm>0)dmg*=m.parts.tete.broken?.8:.65;if(m.open>0)dmg*=1.25;if(H.elan>0)dmg*=1.2+.1*st.sk.esquive;if(H.riposte>0)dmg*=1+GUARD.rip+GUARD.lv*st.sk.garde;if(H.intent&&H.intent[0]&&H.intent[0].fx==='unaware')dmg*=1.3;if(H.intent&&H.intent[0]&&H.intent[0].fx==='stance')dmg*=.35;
 dmg=Math.max(1,exp?dmg:Math.round(dmg*(.95+rnd()*.1)));return{dmg,bounce,crit,weak:z>=70};}
function targetPart(){if(ranged())return H.aim||'tete';return H.m.flying?'flanc':ZPART[H.zone];}
function estHits(hits,pid0){const pid=pid0||targetPart();let t=0;for(const h of hits)t+=calcDmg(h,pid,true).dmg;return Math.round(t);}
function dealHit(h,pid){const m=H.m,st=H.stats,W=st.w;if(m.burrow>0){if(!H._bur){H._bur=1;H.pend.push([`❄️ ${m.d.name} is burrowed: your blows hit the snow.`,'warn']);}return{dmg:0,bounce:true,crit:false,weak:false};}const c=calcDmg(h,pid,false);const dmg=c.dmg,bounce=c.bounce,crit=c.crit;
 const ps=m.parts[pid],pd=m.d.parts[pid];
 if(pid==='tete'&&m.rock>0){m.rockHp-=dmg*(h.type==='blunt'?2:1);if(m.rockHp<=0){m.rock=0;m.topple=Math.max(m.topple,2);m.chain=null;H.pend.push(["🪨 The rock shatters! Grakku loses its balance.",'good']);}}
 m.hp-=dmg;ps.dmg+=dmg;if(h.type==='cut'&&!h.shot)ps.cut+=dmg;
 if(m.spikes>0&&(h.type==='blunt'||h.fixed)){m.spikeHp-=dmg;if(m.spikeHp<=0){m.spikes=0;m.spikeCd=4;m.flinched=true;H.pend.push(["🦔 Spines broken! It curls up, dazed.",'good']);}}
 if(h.shot&&H.coat&&H.coat.k==='fiole_v'&&!m.poisoned){m.poisonAcc+=13*(1+.2*st.sk.statut);if(m.poisonAcc>=m.poisonThr){m.poisoned=4;m.poisonAcc=0;m.poisonThr+=80;H.pend.push([`☠️ ${m.d.name} is poisoned!`,'good']);}}
 if(m.plates&&!m.phase2)hitPlate(pid,dmg*(h.type==='blunt'?1.6:1)*(h.fl||1));
 if(W.stat==='poison'&&!m.poisoned){m.poisonAcc+=W.sv*.5*h.em*(1+.2*st.sk.statut);if(m.poisonAcc>=m.poisonThr){m.poisoned=4;m.poisonAcc=0;m.poisonThr+=80;H.pend.push([`☠️ ${m.d.name} is poisoned!`,'good']);}}
 if(h.ko&&pid==='tete'&&!m.ko&&!m.flying){m.koAcc+=h.ko;if(m.koAcc>=m.koThr){m.ko=2;m.koAcc=0;m.koThr=Math.round(m.koThr*1.5);m.chain=null;H.pend.push([`💫 ${m.d.name} is stunned!`,'good']);discharge();}}
 if(h.type==='blunt')m.stamina-=h.ko?h.ko*.2:2;
 m.flinchAcc+=dmg*(h.fl||1);if(m.flinchAcc>=m.d.flinch){m.flinchAcc=0;m.flinched=true;}
 if(pd.brk&&!ps.broken&&ps.dmg>=pd.brk*m.max){ps.broken=true;m.flinched=true;H.breaks.push(pid);H.pend.push([`💥 ${pd.name} ${brisé(pd.name)}!`,'good']);if(pid==='tete')discharge();}
 if(pd.sever&&!ps.severed&&ps.cut>=.18*m.max){ps.severed=true;m.flinched=true;H.breaks.push('sever');H.pend.push([`✂️ ${pd.name} severed! Its reach shrinks.`,'good']);}
 for(let i=0;i<h.sh;i++){if(rnd()<.2*st.sk.tranchant)continue;H.sharp=Math.max(0,H.sharp-1);}
 return{dmg,bounce,crit,weak:c.weak};}
function hitPlate(pid,v){const m=H.m,pl=m.plates[pid];if(!pl||pl.hp<=0)return;pl.hp-=v;
 if(pl.hp<=0){pl.hp=0;pl.bare=5;m.platesBroken++;m.flinched=true;H.pend.push([`🛡️ Iron plate broken: ${m.d.parts[pid].name.toLowerCase()} exposed for 5 turns!`,'good']);
  tip('plate',"Plate broken: the flesh is exposed and hits land very hard. Strike fast, the iron reforms afterward. Blunt weapons and the ballista crack plates faster.");}}
function discharge(){const m=H.m;if(m.loot&&m.loot.length)giveBack(`${m.d.name} drops its loot`);if(m.charged>0){m.charged=0;H.pend.push(["⚡ Fulgor’s overcharge fades!",'good']);}}
function atk(label,hits,pidO){const m=H.m;let pid=pidO||targetPart();
 const pname=m.d.parts[pid].name;let tot=0,crit=false,bounce=false,weak=false;
 for(const h of hits){if(m.hp<=0)break;const r=dealHit(h,pid);tot+=r.dmg;crit=crit||r.crit;bounce=bounce||r.bounce;weak=weak||r.weak;}
 H.attacked=true;if(H.s.virus>0){H.virusD=(H.virusD||0)+tot;if(H.virusD>=m.max*.035){H.s.virus=0;H.fren=6;H.pend.push(["🦠 Frenzy overcome! +15% attack for 6 turns.",'good']);}}
 if(m.spikes>0&&!ranged()&&!H.q.training&&m.hp>0){const d=Math.max(1,Math.min(H.hp-1,Math.round(m.d.lv*.7*100/(100+H.stats.def))));if(d>0){H.hp-=d;H.fx.push({t:'hurt',v:d,z:H.zone,me:1});H.pend.push([`🦔 The spines hurt you: ${d} damage.`,'bad']);}}
 H.fx.push({t:weak?'weak':'dmg',v:tot,z:H.zone});if(H.tr){H.tr.tot+=tot;H.tr.best=Math.max(H.tr.best,tot);}
 let msg=`${label} on ${pname}: ${tot} damage`;if(crit)msg+=", critical!";if(bounce)msg+=" (bounce: sharpness too low)";if(m.flying&&!ranged())msg+=" (monster in flight)";
 checkObj();log(msg,'you');flush();H.elan=0;H.riposte=0;if(m.hp<=0)H.blow=`your ${label.charAt(0).toLowerCase()+label.slice(1)}`;
 if(sharpLevel()<=1)tip('sharp',"Your sharpness is low: your hits lose power and bounce off. Sharpen on a turn when the monster isn’t targeting you.");
 return true;}
function spend(c){if(H.st<c)return false;H.st-=c;return true;}

/* Définition pure des coups de chaque arme : sert à jouer ET à estimer les dégâts. */
function weaponMove(id,lvl){const T=H.stats.w.type,w=H.w,base=T==='hammer'||T==='hh'?'blunt':'cut';
 const hit=(mv,o={})=>({mv,type:o.type||base,ko:o.ko||0,sh:o.sh==null?1:o.sh,em:T==='db'?.6:T==='sa'&&w.mode==='sword'?(H.stats.w.var==='el'?1.7:1):1});
 const c=lvl==null?w.charge:lvl;
 switch(T+':'+id){
 case 'hbg:tir':case 'hbg:burst':{const a=w.ammo||'norm',n=id==='burst'?Math.max(1,w.mag):1,sh=(v,o={})=>Object.assign({mv:v,type:'cut',ko:0,sh:0,em:1,shot:1},o);const rep=(arr)=>{let r=[];for(let i=0;i<n;i++)r=r.concat(arr.map(x=>Object.assign({},x)));return r;};
  const lab=id==='burst'?`Full charge ×${n}`:null;
  if(a==='perf')return{label:lab||"Piercing shot",pierce:1,hits:rep([sh(40)]),burst:id==='burst'};
  if(a==='el')return{label:lab||"Elemental shot",hits:rep([sh(24,{em:3.2}),sh(24,{em:3.2})]),burst:id==='burst'};
  if(a==='som')return{label:lab||"Sleep shot",hits:rep([sh(14,{sleep:1})]),burst:id==='burst'};
  return{label:lab||"Heavy shot",hits:rep([sh(48),sh(48)]),burst:id==='burst'};}
 case 'lbg:tir':case 'lbg:roll':{const a=w.ammo||'norm',k=id==='roll'?.7:1,sh=(v,o={})=>Object.assign({mv:Math.round(v*k),type:'cut',ko:0,sh:0,em:1,shot:1},o);
  if(a==='perf')return{label:id==='roll'?"Piercing shot and roll":"Piercing shot",pierce:1,hits:[sh(30)],cost:id==='roll'?rollCost():0};
  if(a==='el')return{label:id==='roll'?"Elemental shot and roll":"Elemental shot",hits:[sh(18,{em:3.1}),sh(18,{em:3.1})],cost:id==='roll'?rollCost():0};
  if(a==='som')return{label:"Sleep shot",hits:[sh(10,{sleep:1})],cost:id==='roll'?rollCost():0};
  return{label:id==='roll'?"Shot and roll":"Shot",hits:[sh(37),sh(37)],cost:id==='roll'?rollCost():0};}
 case 'bow:tir':{const n=[3,3,4,5][c],v=[24,32,34,37][c],sh=()=>({mv:v,type:'cut',ko:0,sh:0,em:1,shot:1});return{label:c?`Charged shot Lv. ${c}`:"Shot",hits:Array.from({length:n},sh)};}
 case 'bow:disperse':{const k=1+.15*c,sh=v=>({mv:Math.round(v*k),type:'cut',ko:0,sh:0,em:1,shot:1});return{label:"Spread shot",hits:[sh(18),sh(18),sh(18)],extra:[sh(16),sh(16)],cost:20};}
 case 'hh:red':return{label:"Red strike ♪",hits:[hit(56,{ko:20})],note:'r'};
 case 'hh:blue':return{label:"Blue double strike ♪",hits:[hit(31,{ko:11}),hit(31,{ko:11})],note:'b'};
 case 'hh:yellow':return{label:"Yellow rising strike ♪",hits:[hit(66,{ko:28})],note:'y',cost:10};
 case 'hh:play':return{label:"Recital",hits:[hit(52,{ko:22})]};
 case 'ig:combo':return w.ex&&w.ex.r>0?{label:"Red combo",hits:[hit(22),hit(22),hit(24),hit(30)]}:{label:"Combo",hits:[hit(24),hit(24),hit(26)]};
 case 'ig:kin':return{label:"Strike and beetle",hits:[hit(22),H.stats.w.var==='lourd'?{mv:42,type:'blunt',ko:18,sh:0,em:1.2}:{mv:18,type:'cut',ko:0,sh:0,em:1.2}]};
 case 'ig:aerial':{const ai=o=>Object.assign(hit(o),{air:1});return{label:"Aerial attack",pid:'tete',hits:w.ex&&w.ex.r>0?[ai(34),ai(34),ai(30)]:[ai(36),ai(38)]};}
 case 'sa:axe':return{label:"Axe slash",hits:[hit(54)]};
 case 'sa:wild':return{label:"Wild swings",hits:[hit(26),hit(26),hit(28)],cost:14};
 case 'sa:morph':return w.mode==='axe'?{label:"Morph slash",hits:[hit(42)]}:{label:"Morph sweep",hits:[hit(44)]};
 case 'sa:slash':return{label:"Sword slash",hits:[hit(32),hit(34)]};
 case 'sa:zsd':return{label:"Element discharge",hits:[hit(28),hit(28),hit(28),Object.assign(hit(40+Math.round((w.sw||0)*.8)),{fl:1.6})],cost:15};
 case 'cb:slash':return{label:"Slash",hits:[hit(28),hit(30)]};
 case 'cb:morph':return w.mode==='sword'?{label:"Morph slash",hits:[hit(40)]}:{label:"Morph guard",hits:[hit(26)]};
 case 'cb:dis':return w.ph>0?{label:"Discharge",hits:[hit(40),{mv:0,fixed:phialDmg(),type:'blunt',ko:phialKo(14),sh:0,em:0,fl:1.2}]}:{label:"Axe strike",hits:[hit(46)]};
 case 'cb:saed':{const n=Math.max(1,w.ph||0);return{label:`Ultimate discharge ×${n}`,hits:[Object.assign(hit(60),{fl:1.5})].concat(Array.from({length:n},()=>({mv:0,fixed:Math.round(phialDmg()*1.2),type:'blunt',ko:phialKo(16),sh:0,em:0,fl:1.5}))),cost:15};}
 case 'gl:estoc':return{label:"Thrust",hits:[hit(28),hit(28)]};
 case 'gl:obus':return{label:"Shell shot",hits:[{mv:0,fixed:shellDmg(),type:'blunt',ko:0,sh:1,em:0,fl:1.2}]};
 case 'gl:salve':{const n=Math.max(1,w.shells||0);return{label:`Volley ×${n}`,hits:Array.from({length:n},()=>({mv:0,fixed:Math.round(shellDmg()*.95),type:'blunt',ko:0,sh:1,em:0,fl:1.2}))};}
 case 'gl:wf':return{label:"Cannon breath",hits:[{mv:0,fixed:wfDmg(),type:'blunt',ko:0,sh:3,em:0,fl:3}]};
 case 'lance:estoc':return{label:"Thrust",hits:[hit(27),hit(27)]};
 case 'lance:charge':return{label:"Lance charge",hits:[hit(30),hit(30),hit(42)],cost:22};
 case 'lance:counter':return{label:"Counter-thrust",hits:[hit(72)],cost:12};
 case 'gs:slash':return{label:"Vertical slash",hits:[hit(80)]};
 case 'gs:release':return c?{label:c===2?"True charged slash":"Charged slash",hits:[Object.assign(hit(c===2?300:190,{sh:2}),{em:c===2?3.2:2.1,fl:c===2?2:1.6})]}:null;
 case 'gs:tackle':return{label:"Shoulder charge",hits:[hit(30,{type:'blunt',ko:12})],cost:12};
 case 'ls:entaille':return{label:"Cut",hits:[hit(30),hit(26)]};
 case 'ls:esprit':return{label:"Spirit slashes",hits:[hit(26),hit(26),hit(34)],gauge:35};
 case 'ls:circ':return{label:"Spinning slash",hits:[hit(80)],gauge:60};
 case 'ls:fore':return{label:"Foresight counter",hits:[{mv:50,type:'cut',ko:0,sh:1,em:1}],cost:15};
 case 'sns:combo':return{label:"Slashing combo",hits:[hit(32),hit(34)]};
 case 'sns:shield':return{label:"Shield bash",hits:[hit(36,{type:'blunt',ko:30})]};
 case 'sns:leap':return{label:"Leaping slash",hits:[hit(70)],cost:15};
 case 'db:combo':return w.demon?{label:"Demon blades",hits:[hit(20),hit(20),hit(22),hit(24)]}:{label:"Combo",hits:[hit(20),hit(20),hit(24)]};
 case 'db:dance':return w.demon?{label:"Demon dance",hits:[hit(22),hit(22),hit(22),hit(22),hit(22),hit(40)],cost:30}:null;
 case 'db:demon':return{label:"Spin",hits:[hit(22),hit(22)]};
 case 'hammer:strike':return{label:"Hammer blow",hits:[hit(70,{ko:25})]};
 case 'hammer:release':return c?(c===2?{label:"Great spin",hits:[hit(58,{ko:25}),hit(58,{ko:25}),Object.assign(hit(66,{ko:30}),{fl:1.4})]}:{label:"Rising strike",hits:[Object.assign(hit(132,{ko:50}),{fl:1.4})]}):null;
 case 'hammer:bash':return{label:"Side strikes",hits:[hit(37,{ko:12}),hit(39,{ko:12})]};}
 return null;}
function weaponAct(id){const T=H.stats.w.type,w=H.w;
 if(id==='charge'&&(T==='gs'||T==='hammer')){if(w.charge>=2||!spend(chargeCost(T)))return false;w.charge++;
  log(T==='gs'?`You charge your blade (level ${w.charge}).`:`You wind up the hammer (level ${w.charge}).`,'you');return true;}
 if(id==='roll'&&T==='lbg'&&w.rcd>0)return false;
 if(id==='rreload'&&T==='lbg'){const a=w.ammo||'norm',cap=ammoCap(a),n=Math.min(cap,ammoLeft(a));if(w.rcd>0||n<=w.mag||!spend(dodgeCost()))return false;H.dodge=true;w.mag=n;w.rcd=2;log(`You roll and reload: ${AMMO[a].n} ×${n}.`,'you');return true;}
 if(id==='siege'&&T==='hbg'){if(w.siege)return false;w.siege=true;log("You set the Blunderbuss in siege mode: +50% damage, but no more dodging or moving.",'you');tip('siege',"Siege mode: your shots gain +50%, but you can’t dodge, move or back off. You can still guard. “Leave siege” is free: do it before a big hit.");return true;}
 if(id==='reload'&&isGun(T)){const a=w.ammo||'norm',cap=ammoCap(a),n=Math.min(cap,ammoLeft(a));if(n<=w.mag)return false;w.mag=n;log(`You reload: ${AMMO[a].n} ×${n}.`,'you');return true;}
 if(id==='charge'&&T==='bow'){if(w.charge>=3||!spend(chargeCost(T)))return false;w.charge++;log(`You draw your bow (level ${w.charge}).`,'you');return true;}
 if(id==='reload'&&T==='gl'){if(w.shells>=glCap())return false;w.shells=glCap();log(`You reload the Shell Lance: ${glCap()} shells.`,'you');return true;}
 if((id==='obus'||id==='salve')&&T==='gl'&&!(w.shells>0))return false;
 if(id==='wf'&&T==='gl'&&w.wf>0)return false;
 if(T==='gl'&&(id==='estoc'||id==='wf')&&ranged()&&!H.close)return false;
 if(T==='ig'){if(id==='vault'){if(H.s.tet>0||!spend(vaultCost()))return false;H.dodge=true;w.air=1;log("You vault off your glaive and leap into the air!",'you');tip('vault',"Airborne: you dodge this turn. Next turn, Aerial attack hits the head wherever you are and sets up a mount.");return true;}
  if(id==='aerial'&&!w.wasAir)return false;}
 if(T==='sa'){if(id==='morph'&&w.mode==='axe'&&w.sw<30)return false;if(id==='zsd'&&(w.mode!=='sword'||w.sw<40))return false;if(id==='slash'&&w.mode!=='sword')return false;if((id==='axe'||id==='wild')&&w.mode!=='axe')return false;}
 if(T==='cb'){if((id==='slash'||id==='charge')&&w.mode!=='sword')return false;if((id==='dis'||id==='saed')&&w.mode!=='axe')return false;if(id==='saed'&&!(w.ph>0))return false;
  if(id==='charge'){if(w.ph>=CB_PH){w.ph=0;w.shield=12+prolong();H.guard=true;log(`🛡️ You charge the shield behind your guard: stronger guard and +30% explosions for ${w.shield} turns.`,'good');tip('cbshield',"Shield charged: your guard blocks better and your phials explode 30% harder. Recharge phials and switch back to axe!");return true;}
   if(w.en<20)return false;const add=Math.min(CB_PH-w.ph,Math.floor(w.en/20));w.ph+=add;w.en=0;log(`You charge energy into the phials: ${w.ph}/${CB_PH}.`,'you');if(w.ph>=CB_PH)tip('cbfull',"Phials full! Switch to axe to detonate them, or charge the shield.");return true;}}
 if(id==='counter'&&T==='lance'){if(w.ccd>0||!spend(12))return false;w.ccd=2;H.counter=true;H.guard=true;log("You take a counter stance, lance leveled…",'you');return true;}
 if(id==='play'&&T==='hh'){const sg=songOf(w.notes);if(!sg)return false;atk("Recital",weaponMove('play').hits);w.notes=[];
  if(sg.id==='atk'){H.song=H.song||{};H.song.atk=6+prolong();log(`🎵 Might song: +15% attack for ${6+prolong()} turns.`,'good');}
  else if(sg.id==='def'){H.song=H.song||{};if(!H.song.def)H.stats.def+=25;H.song.def=6+prolong();log(`🎵 Bulwark song: +25 defense for ${6+prolong()} turns.`,'good');}
  else{const v=Math.min(25,H.hpMax-H.hp);H.hp+=v;if(v)H.fx.push({t:'heal',v,z:H.zone,me:1});if(H.pal&&!H.pal.ko)H.pal.hp=Math.min(H.pal.max,H.pal.hp+25);log(`🎵 Healing song: +${v} HP${H.pal?", and your Griffu perks up":''}.`,'good');}
  return true;}
 if(id==='fore'&&T==='ls'){if(w.fcd>0||!spend(15))return false;H.fore=true;w.fcd=4;log("You take the foresight stance…",'you');return true;}
 if(id==='demon'&&T==='db'){if(!w.demon){if(H.st<20)return false;w.demon=true;log("Furious Mode activated!",'good');}else{w.demon=false;log("You leave Furious Mode.",'you');}
  return atk("Spin",weaponMove('demon').hits);}
 const mv=weaponMove(id);if(!mv)return false;
 if(mv.gauge&&w.gauge<mv.gauge)return false;
 if(mv.cost&&!spend(mv.cost))return false;
 if(mv.gauge)w.gauge-=mv.gauge;
 if(id==='release')w.charge=0;
 if(isGun(T)&&(id==='tir'||id==='roll'||id==='burst')){if(!(w.mag>0))return false;const a=w.ammo||'norm',ai=AMMO[a].item,used=id==='burst'?w.mag:1;w.mag-=used;if(ai){H.used[ai]=(H.used[ai]||0)+used;if(!H.q.training)S.items[ai]=Math.max(0,(S.items[ai]||0)-used);}
  if(id==='burst'){H.m.flinchAcc+=H.m.d.flinch*.6;}
  if(id==='roll'){H.dodge=true;w.rcd=2;}
  if(mv.pierce){for(const p of['tete','flanc','queue']){if(H.m.hp<=0)break;atk(mv.label,mv.hits,p);}}else atk(mv.label,mv.hits);
  if(a==='som'&&H.m.hp>0){const m=H.m;m.sleepAcc=(m.sleepAcc||0)+100;const thr=m.sleepThr||m.d.ko*1.1;if(id==='burst')m.sleepAcc+=100*(used-1);if(m.sleepAcc>=thr&&!m.ko){m.ko=2;m.sleepAcc=0;m.sleepThr=Math.round(thr*1.6);m.chain=null;log(`💤 ${m.d.name} falls fast asleep! It won’t move for 2 turns.`,'good');}else if(!m.ko)log(`💤 ${m.d.name} is getting drowsy (sleep ${Math.min(99,Math.round(m.sleepAcc/thr*100))}%).`);}
  if(!w.mag)log("Magazine empty: reload.",'warn');return true;}
 if(T==='bow'&&(id==='tir'||id==='disperse')){w.charge=0;atk(mv.label,mv.hits);if(mv.extra&&H.m.hp>0){const ot=['tete','flanc','queue'].filter(p=>p!==targetPart());const p2=ot.find(p=>!H.m.parts[p].broken)||ot[0];atk("Spread volley",mv.extra,p2);}
  if(H.coat){H.coat.n--;if(H.coat.n<=0){log(`The ${ITEMS[H.coat.k].n.toLowerCase()} is used up.`,'warn');H.coat=null;}}return true;}
 if(id==='tackle')H.tackle=true;
 if(T==='gl'){if(id==='obus')w.shells--;else if(id==='salve')w.shells=0;else if(id==='wf'){w.wf=H.stats.sk.artillerie>=3?5:6;H.m.flinchAcc+=H.m.d.flinch*.8;}}
 if(T==='hh'&&mv.note){w.notes=(w.notes||[]).concat(mv.note).slice(-3);const sg=songOf(w.notes);if(sg)tip('song',`Melody ready: ${sg.n}. Tap “Recital” to strike and play it.`);}
 if(T==='sns'&&id==='shield'){H.guard=true;H.bashGuard=true;}
 atk(mv.label,mv.hits,mv.pid);
 if(T==='ig'){const W0=H.stats.w;if(id==='kin'){const k=extOf(targetPart()),e=w.ex;if(k==='o'&&!(e.o>0))H.stats.def+=20;const was=triple();e[k]=EXT_T+prolong()+(W0.var==='vif'?4:0);if(W0.var==='soin'){const v=Math.min(10,H.hpMax-H.hp);if(v>0){H.hp+=v;H.fx.push({t:'heal',v,z:H.zone,me:1});log(`🐞 The healer beetle restores ${v} HP.`,'good');}}log(`🐞 The beetle brings back a ${EXTR[k].n} extract (${k==='r'?"attack +10%, longer combo":k==='w'?"cheaper leap and dodge":"defense +20"}).`,'good');
   if(!was&&triple()){log("✨ Triple extract: an extra +10% attack!",'good');}tip('extract',"Each extract lasts 10 turns. Head: red. Arms: white. Back: orange. All three together grant the Triple extract.");}
  if(id==='aerial'&&H.m.hp>0){const m=H.m;m.mountAcc=(m.mountAcc||0)+(m.flying?2:1);const thr=m.mountThr||3;
   if(m.mountAcc>=thr){m.mountAcc=0;m.mountThr=Math.round(thr*1.6);m.flying=0;m.topple=Math.max(m.topple,2);m.chain=null;m.prep=null;log(`🐞 You mount ${m.d.name} and topple it: it’s down!`,'good');}
   else log(`Mount: ${m.mountAcc}/${thr}.`,'you');}}
 if(T==='ls'&&id==='entaille')w.gauge=Math.min(100,w.gauge+Math.round(20*conc()));
 if(T==='sa'){if(id==='axe')w.sw=Math.min(100,w.sw+Math.round(10*conc()));else if(id==='wild')w.sw=Math.min(100,w.sw+Math.round(20*conc()));else if(id==='slash')w.sw=Math.max(0,w.sw-12);
  else if(id==='zsd'){w.sw=0;w.mode='axe';log("The phial is empty: the weapon folds back into an axe.",'you');}
  else if(id==='morph'){w.mode=w.mode==='axe'?'sword':'axe';log(w.mode==='sword'?"The weapon unfolds into a sword.":"The weapon folds into an axe.",'you');if(w.mode==='sword')tip('samode',"Sword mode: your hits are stronger but drain the gauge. Around 40, Element discharge empties it in one go. Once the gauge is empty, the weapon folds back into an axe on its own.");}
  if(w.mode==='sword'&&w.sw<12){w.mode='axe';log("Phial gauge empty: the weapon folds back into an axe.",'warn');}}
 if(T==='cb'){if(id==='slash')w.en=Math.min(100,w.en+Math.round(34*conc()));else if(id==='dis'&&w.ph>0)w.ph--;
  else if(id==='saed'){w.ph=0;w.mode='sword';log("You fold the axe away: back to sword and shield.",'you');}
  else if(id==='morph'){w.mode=w.mode==='sword'?'axe':'sword';log(w.mode==='axe'?"You unfold the axe (no more guard).":"You fold the axe away: sword and shield.",'you');}}
 if(T==='ls'&&id==='circ'){if(w.spirit<3){w.spirit++;log(`Spirit level ${w.spirit}: your hits gain power.`,'good');}w.spiritT=0;}
 return true;}
function ammoLeft(k){const it=AMMO[k].item;return it?pouchLeft(it):1e9;}
function ammoOk(k){if(k==='el'&&!H.stats.w.elem)return false;return ammoLeft(k)>0;}
function pouchLeft(id){if(ITEMS[id].sup)return(H.sup&&H.sup[id])||0;if(H&&H.q&&H.q.training)return Math.max(0,ITEMS[id].carry-(H.used[id]||0))||ITEMS[id].carry;return Math.max(0,Math.min(S.items[id]||0,ITEMS[id].carry-(H.used[id]||0)));}
function inPouch(id){return ITEMS[id].sup||(H&&H.q&&H.q.training)?pouchLeft(id)>0:(S.items[id]||0)>0;}
function itemBlock(id){const m=H.m;
 if(id==='antidote'&&!H.s.poison)return"You are not poisoned";
 if(id.startsWith('fiole')&&H.stats.w.type!=='bow')return"Bow only";
 if(id.startsWith('mun_'))return isGun(H.stats.w.type)?"Load it with “Ammo” then “Reload”":"Blunderbuss only";
 if(id.startsWith('fiole')&&H.coat&&H.coat.k===id&&H.coat.n>=4)return"Coating already applied";
 if(H.phase==='camp'&&!CAMP_OK.includes(id))return"Usable during the fight";
 if(id==='grain'&&H.atkBuff)return"Already active";
 if(id==='armure'&&H.defBuff)return"Already active";
 if(id==='steak'&&H.stMax>=150&&H.st>=H.stMax)return"Stamina already full";
 if((id==='piege'||id==='tranq')&&m.d.elder)return"Elder dragons can’t be captured";
 if(id==='piege'&&(H.trap||m.trapped>0))return"A trap is already set";
 if(id==='tranq'&&!(m.trapped>0))return"The monster must be caught in a trap";
 if(id==='flash'&&(m.trapped>0||m.ko>0||m.topple>0))return"The monster is already immobilized";
 if((id==='potion'||id==='mega'||id==='soin')&&H.hp>=H.hpMax)return"HP already full";
 return null;}
function useItem(id){if(!ITEMS[id]||pouchLeft(id)<=0||itemBlock(id))return null;const m=H.m;
 if(ITEMS[id].sup)H.sup[id]--;else{H.used[id]=(H.used[id]||0)+1;
 if(H.q.training){}else if(H.felyne&&H.felyne.id==='econome'&&rnd()<.25)log("Thrifty Griffu: the item isn’t used up.",'good');else if(palHas('econome')&&rnd()<.15)log(`🐱 ${palS().name}, ever thrifty, hands you the item: it isn’t used up.`,'good');else S.items[id]--;}
 const it=ITEMS[id];
 if(id==='potion'||id==='mega'||id==='soin'){const v=Math.min(H.hpMax-H.hp,id==='mega'?70:id==='soin'?30:35);H.hp+=v;H.fx.push({t:'heal',v:Math.round(v),z:H.zone,me:1});log(`${it.n}: +${Math.round(v)} HP.`,'good');}
 else if(id==='antidote'){H.s.poison=0;log("Antidote: the poison is cured.",'good');}
 else if(id==='fiole_p'||id==='fiole_v'){H.coat={k:id,n:4+H.stats.sk.prolong};log(`${it.n} applied: ${id==='fiole_p'?"+30% damage":'poison'} on your next ${H.coat.n} shots.`,'good');}
 else if(id==='steak'){H.stMax=Math.min(150,H.stMax+25);H.st=H.stMax;log(`Well-done steak: max stamina ${H.stMax}.`,'good');}
 else if(id==='grain'){H.atkBuff=.1;log("Demon seed: +10% attack.",'good');}
 else if(id==='armure'){H.defBuff=20;H.stats.def+=20;log("Armor seed: +20 defense.",'good');}
 else if(id==='piege'){H.trap=true;log("🪤 You set a trap. The monster will fall in on its next action.",'you');}
 else if(id==='tranq'){if(m.hp<=m.max*.2)m.tranq++;
  if(m.hp>m.max*.2)log("💤 The monster is too vigorous: the bomb wears off. It must be limping to be captured.",'warn');
  else if(m.tranq>=2){log("💤 The monster falls fast asleep… Capture complete!",'good');save();endHunt('capture');return true;}
  else log("💤 The monster sways. One more tranq bomb!",'good');}
 else if(id==='baliste'){const pid=targetPart();const d=Math.round(m.max*.035*(m.open>0?1.25:1));m.hp-=d;m.parts[pid].dmg+=d;m.flinchAcc+=d*1.5;if(m.flinchAcc>=m.d.flinch){m.flinchAcc=0;m.flinched=true;}
  if(m.plates&&!m.phase2)hitPlate(pid,d*2);H.fx.push({t:'weak',v:d,z:H.zone});log(`🏹 Ballista shot on ${m.d.parts[pid].name}: ${d} damage!`,'you');flush();checkObj();if(m.hp<=0){H.blow="the rampart ballista";}}
 else if(id==='flash'){m.flashes++;
  if(m.eclipse>0){m.eclipse=0;m.eclCd=4;m.open=2;m.chain=null;log(`✨ The light pierces the Eclipse! ${m.d.name} is exposed for 2 turns.`,'good');}
  if(m.flying){m.flying=0;m.topple=2;m.chain=null;log("✨ Blinded mid-flight, the monster crashes to the ground!",'good');}
  else if(m.flashes>3){m.blind=1;log("✨ The monster has grown used to flashes; the effect is weak.",'warn');}
  else{m.blind=3;m.flash=true;m.chain=null;log("✨ The monster is blinded! It will often miss its target.",'good');}}
 save();
 if(H.phase==='camp')return false;
 if(id==='baliste')return true;
 if(id.startsWith('fiole'))return false;
 if(H.stats.w.type==='sns'&&!H.freeItem&&!H.over){H.freeItem=true;log("Sword & Shield: item used without losing the turn.",'good');return false;}
 return true;}

function act(id,arg){if(!H)return;
 if(id==='gather'){if(gather(+arg)){saveHunt();render();}return;}
 if(H.over)return;
 if(H.phase==='camp'){if(id==='engage'){engage(arg);H.mark=H.log.length-2;saveHunt();render();return;}
  if(id==='item'){const mk=H.log.length;if(useItem(arg)!==null){H.mark=mk;saveHunt();render();}}return;}
 if((H.s.para>0||H.grab>0)&&id!=='struggle')return;
 if(H.w&&H.w.siege&&(id==='move'||id==='dodge'||id==='reculer')){log("In siege mode you can’t move: leave siege first.",'warn');saveHunt();render();return;}
 if(id==='move'){let a0=String(arg),far=a0.startsWith('far:');if(far)a0=a0.slice(4);const[z,sd]=a0.split(':');if(!ZN[z])return;
  if(ranged()){if(far&&H.close){tip('farring',"The outer ring is range: to get back there from melee, use “Back off”.");log("You’re in melee: back off to regain your distance.",'warn');saveHunt();render();return;}
   const nowFar=!H.close;if(z===H.zone&&far===nowFar){if(z==='flanc'&&sd&&sd!==H.side){H.side=sd;H.moved=null;saveHunt();render();}return;}}
  else if(far)return;
  else if(z===H.zone){if(z==='flanc'&&sd&&sd!==H.side){H.side=sd;H.moved=null;saveHunt();render();}return;}}
 const W=H.stats.w,T=W.type;
 const keep=T==='gs'?['charge','release','tackle','guard','dodge']:T==='hammer'?['charge','release','move','dodge']:T==='bow'?['charge','tir','disperse','dodge','item','reculer']:null;
 const prevMark=H.log.length;
 if(keep&&H.w.charge>0&&!keep.includes(id)){H.w.charge=0;log("Your charge fades.",'you');}
 H.guard=H.dodge=H.tackle=H.fore=H.fainted=H.bashGuard=H.counter=false;H.fx=[];H.moved=null;H.asleep=false;H.attacked=false;
 if(T==='ig'){H.w.wasAir=H.w.air;H.w.air=0;}
 let ends=true;
 switch(id){
  case 'struggle':if(H.grab>0){if(H.st>=35){H.st-=35;H.grab=0;log("💪 You struggle with all your might and tear free of its maw! (−35 stamina)",'good');}else{H.st=Math.max(0,H.st-10);log("😣 You struggle, but you lack the stamina to break free…",'bad');}break;}{const w=H.s.why;H.s.para=0;H.s.why=null;if(w==='sleep'){H.asleep=true;log("💤 You are fast asleep…",'bad');}else if(w==='down')log("🌋 You struggle back to your feet…",'bad');else log("⚡ Paralyzed, you can’t act!",'bad');}break;
  case 'move':{let a0=String(arg),far=a0.startsWith('far:');if(far)a0=a0.slice(4);let[z,sd]=a0.split(':');if(H.s.bulle>0&&rnd()<.5){const alt=ALLZ.filter(x=>x!==z&&x!==H.zone);if(alt.length){z=pick(alt);log("🫧 You slip on the bubbles and end up elsewhere!",'warn');}}H.zone=z;if(z==='flanc')H.side=sd||H.side;
   if(ranged()&&!far&&!H.close){H.close=1;log(`You close in to melee: ${ZN[z]}.`,'you');}else log(`You move${ranged()?(H.close?" in melee":" at range"):''}: ${ZN[z]}.`,'you');break;}
  case 'charge':{if(T==='cb'&&H.w.mode==='sword'&&H.w.ph<CB_PH){if(!weaponAct('charge'))return;ends=false;break;}if(!weaponAct('charge'))return;break;}
  case 'unsiege':{if(!H.w.siege)return;H.w.siege=false;log("You leave siege mode.",'you');ends=false;break;}
  case 'ammo':{if(!isGun(T))return;const cur=AMMO_ORDER.indexOf(H.w.ammo||'norm');let nx=null;for(let i=1;i<=AMMO_ORDER.length;i++){const k=AMMO_ORDER[(cur+i)%AMMO_ORDER.length];if(ammoOk(k)){nx=k;break;}}if(!nx||nx===H.w.ammo)return;H.w.ammo=nx;H.w.mag=0;log(`Ammo: ${AMMO[nx].n}. Reload to load it.`,'you');ends=false;break;}
  case 'reculer':{if(!H.close)return;H.close=0;log("You back off and regain your distance.",'you');break;}
  case 'dodge':{const c=dodgeCost();if(H.st<c||H.s.tet>0)return;H.st-=c;H.dodge=true;if(H.s.bulle){H.s.bulle=0;log("🫧 You roll: the bubbles pop.",'good');}if(H.s.slime){H.s.slime=0;log("🟢 You roll on the ground: the gel comes off!",'good');}if(T==='bow'&&H.w.charge<3){H.w.charge++;log(`You stand ready to roll, bow drawn (level ${H.w.charge}).`,'you');}else log("You stand ready to roll.",'you');break;}
  case 'guard':if(!WT[T].g||(T==='cb'&&H.w.mode==='axe')||!spend(5))return;H.guard=true;log("You raise your guard.",'you');break;
  case 'sharpen':if(H.sharp>=W.total)return;H.sharp=W.total;log("You sharpen your weapon: sharpness restored.",'you');break;
  case 'item':{const r=useItem(arg);if(r===null)return;ends=r;break;}
  case 'baliste':{if(useItem('baliste')===null)return;ends=true;break;}
  default:if(!weaponAct(id))return;}
 if(!H.freeItemMark){H.mark=prevMark;}
 H.freeItemMark=!ends;
 if(ends&&!H.over)resolve();
 saveHunt();render();}

function capSave(){const m=H.m;if(H.q.capture&&m.hp<=0&&!H.spare){H.spare=1;m.hp=1;log(`🪤 ${m.d.name} staggers, exhausted! One more hit will finish it: set a trap and tranq it.`,'warn');}}
function resolve(){const m=H.m;
 capSave();if(m.hp<=0)return endHunt('kill');
 palico();
 capSave();if(m.hp<=0)return endHunt('kill');
 monsterPhase();
 if(H.over)return;
 capSave();if(m.hp<=0)return endHunt('kill');
 endTurn();}

function mineMove(m){const id=(m.mines&&m.mines.mv)||'explose';return m.d.moves.find(x=>x.id===id);}
function mineBlast(){const m=H.m,mn=m.mines;if(!mn)return;m.mines=null;const mv=mineMove(m);if(!mv)return;
 H.fx.push({t:'mfx',zones:mn.z.slice(),el:'fire',side:H.side});
 const bolt=mn.mv==='foudre_t';if(bolt)H.fx[H.fx.length-1].el='bolt';
 if(!mn.z.includes(H.zone)){log(bolt?`⚡ Lightning strikes ${mn.z.map(z=>ZN[z].toLowerCase()).join(', ')}. You got clear in time.`:`💥 The scales explode (${mn.z.map(z=>ZN[z].toLowerCase()).join(', ')}). You are out of reach.`,'good');return;}
 if(H.dodge){log(bolt?"⚡ Lightning strikes: you dive just in time, dodged!":"💥 The scales explode: you dive just in time, dodged!",'good');H.elan=2;return;}
 let d=monDmg(mv),guarded=false;const T=H.stats.w.type;
 if(H.guard){const cost=Math.round(4+d*GUARD.cost);if(H.st>=cost){H.st-=cost;guarded=true;d*=1-guardBlock('H',T);}}
 d=Math.max(1,Math.round(d*100/(100+H.stats.def)));hurt(d,bolt?`⚡ The storm’s lightning strikes you: you take ${d} damage${guarded?" (partly blocked)":''}.`:`💥 The scales explode under your feet: you take ${d} damage${guarded?" (partly blocked)":''}.`);
 if(!guarded&&!H.fainted&&!H.over&&!bolt)applyStatus('burn');}
function monsterPhase(){const m=H.m,nm=m.d.name;if(m.mines){mineBlast();if(H.over||H.fainted)return;}
 if(H.trap&&!m.flying&&!(m.trapped>0)&&!(m.ko>0)&&!(m.topple>0)){H.trap=false;
  if(m.trapImm>0)log(`${nm} sniffs out the trap and destroys it.`,'warn');
  else{m.trapped=2;m.trapImm=12;m.tranq=0;m.chain=null;if(m.burrow){m.burrow=0;log(`${nm} bursts from the snow… straight into your trap!`,'good');}m.flinched=false;m.flash=false;log(`🪤 ${nm} falls into the trap! Immobilized.`,'good');return;}}
 if(m.trapped>0){m.trapped--;log(`${nm} struggles in the trap.`);return;}
 if(m.ko>0){m.ko--;log(`💫 ${nm} is stunned.`);return;}
 if(m.topple>0){m.topple--;log(`${nm} is down and struggling!`);return;}
 const it=H.intent||[];
 if(m.flash){m.flash=false;m.flinched=false;m.chain=null;if(it.length&&!passive(it[0]))log(`${nm} writhes, blinded: its attack is canceled!`,'good');return;}
 if(m.flinched){m.flinched=false;m.chain=null;if(it.length&&!passive(it[0])){log(`${nm} flinches! Its action is interrupted.`,'good');tip('flinch',"Enough damage in one hit, a broken part or a KO makes the monster flinch: its announced attack is canceled.");}H.fore&&log("Your foresight stance had nothing to counter.");H.fore=false;H.counter&&log("Your counter had nothing to block.");H.counter=false;return;}
 for(const mv of it){if(H.over||H.fainted||m.hp<=0||m.topple>0||m.ko>0||m.trapped>0)break;execMove(mv);}
 if(H.fore&&!H.over){H.fore=false;log("Your foresight stance had nothing to counter.");}
 if(H.counter&&!H.over){H.counter=false;log("Your counter had nothing to block.");}}

function execMove(mv){const m=H.m,nm=m.d.name,sk=H.stats.sk;
 if(passive(mv))return;
 m.stamina-=(mv.c||8);m.lastMove=mv.id;
 if(mv.fx==='eat'){const i=(m.loot||[]).findIndex(k=>EDIBLE.includes(k));if(i<0)return;const k=m.loot.splice(i,1)[0];const v=Math.round(m.max*(k==='mega'?.08:.05));m.hp=Math.min(m.max,m.hp+v);log(`🐒 ${nm} devours your ${ITEMS[k].n.toLowerCase()} and regains strength (+${v} HP). The item is lost.`,'bad');return;}
 if(mv.fx==='rock'){m.rock=5;m.rockHp=Math.round(m.max*.08);m.rockUses++;log(`🪨 ${nm} brandishes a rock: its head is protected! (blunt damage breaks it faster)`,'warn');tip('rock',"Hit the rock (front) to break it: Grakku will fall down. Otherwise, aim elsewhere until it drops it.");return;}
 if(mv.fx==='fly'){m.flying=3;log(`🪽 ${nm} takes flight! Your hits only reach its legs. A flash bomb would bring ${pron(m.id)} down.`,'warn');tip('fly',"In flight, your hits deal half damage. A flash bomb makes it crash to the ground: two turns to strike wherever you want.");return;}
 if(mv.fx==='windup'){m.chain=mv.chain;log(`⚠️ ${nm}: ${mv.n}. A devastating attack is coming next turn!`,'warn');tip('windup',"Attack ready: it will hit hard next turn. Land a big hit (charge, dance…) to make it flinch and cancel it, or get out of reach.");return;}
 if(mv.fx==='plate'){for(const p in m.plates){const pl=m.plates[p];pl.hp=pl.max;pl.bare=0;}log(`🛡️ ${nm} fuses its plates back together: its whole body is armored again.`,'warn');return;}
 if(mv.fx==='phase'){m.phase2=true;m.phaseQ=false;m.enraged=Math.max(m.enraged,6);m.chain=null;for(const p in m.plates){m.plates[p].hp=0;m.plates[p].bare=0;}
  H.fx.push({t:'mfx',zones:ALLZ.slice(),el:'fire',side:H.side});log(`🔥 ${nm} ignites its forge heart! Its plates melt, but the arena floor turns molten.`,'bad');
  tip('lava',"Molten ground: each turn, one zone glows red (it is announced). Leave it before the turn ends: dodging won’t protect you from the heat of the ground.");
  const zz=ALLZ;if(zz.includes(H.zone)&&!H.dodge&&!H.guard&&!H.stats.sk.bouchons){H.s.tet=2;log("🙉 Stunned by the roar!",'bad');}return;}
 if(mv.fx==='burrow'){m.burrow=1;m.chain=null;log(`❄️ ${nm} burrows under the snow! Your hits can’t reach it: get ready to dodge, or set a trap.`,'warn');tip('burrow',"Burrowed monster: it will burst out under your feet next turn (tracking attack). Dodge, guard, or use the time to heal, sharpen or set a trap: it will fall in as it emerges.");return;}
 if(mv.id==='surgit')m.burrow=0;
 if(mv.id==='broyage'){if(!H.grab){log(`${nm}’s jaws snap shut on nothing: you broke free!`,'good');return;}H.grab=0;const d=Math.max(1,Math.round(monDmg(mv)*100/(100+H.stats.def)));hurt(d,`🦷 ${nm} crushes you in its jaws: ${d} damage! It spits you out onto the ground.`);return;}
 if(mv.fx==='harden'){m.harden=4;log(`🔥 ${nm} sets its shell ablaze! It repels your hits: aim for the jaw (front) or break the shell.`,'warn');tip('harden',"Molten shell: the flank and tail turn hard (blades bounce off). Hit the head, or break the shell with blunt damage to stop it for good.");return;}
 if(mv.fx==='bristle'){m.spikes=3;m.spikeHp=Math.round(m.max*.05);m.chain=null;log(`🦔 ${nm} bristles! For 3 turns, melee hits hurt you.`,'warn');tip('bristle',"Spines raised: each melee attack hurts you a little. Blunt damage and shells break them (stunning it); ranged shots are safe. You can also wait for them to go down.");return;}
 if(mv.fx==='stance'){m.stanceCd=4;if(H.attacked&&!H.dodge){const d=Math.max(1,Math.round(m.d.lv*TIER.H*.9*(H.guard?.5:1)*100/(100+H.stats.def)));H.fx.push({t:'matk',z:H.zone,side:H.side});hurt(d,`⚔️ ${nm} parries your attack and counters: ${d} damage${H.guard?" (partly blocked)":''}!`);}else{m.open=2;log(`🌙 ${nm} leaves its stance without parrying anything: it is exposed for 2 turns!`,'good');}return;}
 if(mv.fx==='eclipse'){m.eclipse=m.parts.tete.broken?2:4;m.chain=null;H.fx.push({t:'mfx',zones:ALLZ.slice(),el:'roar',side:H.side});
  log(`🌑 ${nm} swallows the light: the Eclipse falls for ${m.eclipse} turns! You can no longer see where it strikes.`,'warn');
  tip('eclipse',"Eclipse: you can no longer see the target of its attacks, only a sound, often right but not always. Guard, dodge at the right moment, or throw a flash bomb: it dispels the Eclipse and exposes it. Breaking its crystal horns shortens the Eclipse.");return;}
 if(mv.fx==='storm'){m.storm=m.parts.tete.broken?3:4;m.chain=null;H.fx.push({t:'mfx',zones:ALLZ.slice(),el:'roar',side:H.side});
  log(`🌪️ ${nm} summons the storm! For ${m.storm} turns, the wind pushes back your blades and lightning strikes your zone every turn.`,'warn');
  tip('storm',"Storm: your hits lose power and lightning strikes where you stand at the start of its turn. Change zones or dodge. When the sky clears, it is exposed: hit hard. Breaking its horns weakens the storm; poison shortens it.");return;}
 if(mv.fx==='mines'){const n=mv.all?3:m.parts.flanc.broken?1:2;const zs=[H.zone];for(const z of ALLZ.slice().sort(()=>rnd()-.5))if(zs.length<n&&!zs.includes(z))zs.push(z);m.mines={z:zs};m.chain=null;
  log(`💥 ${nm}: ${mv.n}. Explosive scales on ${zs.length===3?"the whole arena":zs.map(z=>ZN[z].toLowerCase()).join(' and ')}: they blow up next turn, before its action!`,'warn');
  tip('mines',"Explosive scales: they blow at the start of the monster’s next turn, before its attack. Leave the glowing zone or dodge. Breaking its wings reduces its drops.");return;}
 if(mv.fx==='charge'){m.charged=8;log(`⚡ ${nm} is overcharged! Faster and stronger, but its head is exposed.`,'warn');return;}
 const zones=effZones(mv),inZone=zones.includes(H.zone);
 if(mv.fx==='roar'){
  H.fx.push({t:'mfx',zones:ALLZ.slice(),el:'roar',side:H.side});
  if(!mv.intro){m.enraged=6;m.forceRoar=false;m.sinceRage=0;log(`😡 ${nm} becomes enraged! Its attacks are more powerful.`,'bad');tip('rage',"When enraged, the monster hits 25% harder for a few turns and, from rank 3, can chain two attacks. Be careful until it calms down.");}
  else log(`${nm} lets out a ${mv.n.toLowerCase()}!`,'warn');
  if(inZone){if(H.dodge)log("You dive to the ground: the roar doesn’t reach you.",'good');
   else if(sk.bouchons)log("Earplugs: the roar doesn’t affect you.",'good');
   else if(H.guard)log("You shelter behind your guard.",'good');
   else{H.s.tet=2;log("🙉 Stunned! You can’t dodge next turn.",'bad');}}
  return;}
 if(m.exhausted>0&&mv.d&&rnd()<.3){m.topple=1;m.flying=0;m.chain=null;log(`💧 ${nm} tries to attack but stumbles, exhausted!`,'good');return;}
 const label=`${nm}: ${mv.n}`;
 {const zz=effZones(mv);const tz=zz.includes(H.zone)?H.zone:zz[0];if(tz)H.fx.push({t:'matk',z:tz,side:H.side});H.fx.push({t:'mfx',zones:zz.slice(),el:elemOf(mv),side:H.side});}
 if(!inZone&&ranged()&&!H.close&&mv.d&&!reachOf(mv)&&(mv.z||[]).includes(H.zone)){H.close=1;log(`${label}. Too far to hit you, but ${nm} advances: now it’s in melee!`,'warn');tip('close',"In melee (inner ring), a gunner is exposed to bites, claws and tail strikes. Use “Back off” to return to the outer ring.");}
 else if(!inZone)log(`${label}. You are out of reach.`);
 else if(m.blind>0&&rnd()<.5)log(`${label}. Blinded, it misses you!`,'good');
 else if(H.counter&&mv.d){H.counter=false;H.guard=false;let pid=targetPart();const hits=weaponMove('counter').hits;let tot=0;for(const hh of hits){if(H.m.hp<=0)break;tot+=dealHit(hh,pid).dmg;}
  H.fx.push({t:'weak',v:tot,z:H.zone});log(`🛡️ Counter-thrust! You block its ${mv.n.toLowerCase()} and strike back: ${tot} damage.`,'good');if(H.m.hp<=0)H.blow="your Counter-thrust";checkObj();flush();H.riposte=2;}
 else if(H.fore){H.fore=false;H.dodge=true;H.w.gauge=Math.min(100,H.w.gauge+30);
  let pid=ZPART[H.zone];if(m.flying)pid='flanc';const r=dealHit(weaponMove('fore').hits[0],pid);
  H.fx.push({t:'weak',v:r.dmg,z:H.zone});log(`✨ Foresight Slash! You dodge ${mv.n.toLowerCase()} and counterattack: ${r.dmg} damage.`,'good');if(m.hp<=0)H.blow="your Foresight Slash";checkObj();flush();}
 else if(H.pal&&H.pal.lure&&mv.d){H.pal.lure=false;H._lured=true;palTakeHit(mv,monDmg(mv),true);log(`${label}: ${palS().name} deflects the blow, you are spared.`,'good');}
 else if(H.dodge){tip('elan',"A successful dodge gives you momentum: a bonus to your next attack.");if(!H.elan)log(`${label}. Dodged! Momentum: +${20+10*sk.esquive}% to your next attack.`,'good');else log(`${label}. Dodged!`,'good');H.elan=2;if(H.s.burn){H.s.burn=0;log("Rolling puts out the flames.",'good');}}
 else{let d=monDmg(mv),guarded=false;const T=H.stats.w.type;
  if(H.asleep){d*=1.5;H.asleep=false;log("💤 Rude awakening: +50% damage!",'bad');}
  let full=false;
  if(H.guard){const cost=Math.round(4+d*GUARD.cost);if(H.st>=cost){H.st-=cost;guarded=true;const b=guardBlock(mv.tier,T);d*=1-b;full=b>=1;H.sharp=Math.max(0,H.sharp-1);}else log("Not enough stamina: your guard breaks!",'bad');}
  if(H.tackle)d*=.5;
  d=full?0:Math.max(1,Math.round(d*100/(100+H.stats.def)));
  if(!guarded&&!H.tackle&&H.w.charge>0){H.w.charge=0;log("The blow breaks your charge!",'bad');}
  if(full)log(`${label}: fully blocked by your ${H.bashGuard?'shield':'guard'}!`,'good');
  else hurt(d,`${label}: you take ${d} damage${guarded?" (partly blocked)":''}${H.tackle?" (absorbed)":''}.`);
  if(guarded&&T==='cb')H.w.en=Math.min(100,(H.w.en||0)+Math.round(25*conc()));
  if(guarded&&!H.fainted&&!H.bashGuard){H.riposte=2;log(`🛡️ Guard held! Counter: +${Math.round((GUARD.rip+GUARD.lv*sk.garde)*100)}% to your next attack.`,'good');tip('riposte',"Guard held: your next attack gets a counter bonus. Guard against small hits, dodge the big ones.");}
  if(!guarded&&mv.st&&!H.fainted)applyStatus(mv.st);
  if(!guarded&&mv.steal&&!H.fainted&&!H.over)stealItem(mv.steal);
  if(!guarded&&mv.grab&&!H.fainted&&!H.over){H.grab=1;H.w.charge=0;log(`🦷 ${nm} seizes you in its maw! Struggle (35 stamina) before it crushes you.`,'bad');tip('grab',"Grabbed: next turn, it crushes you. Struggle: with at least 35 stamina, you break free. Your Griffu can also free you.");}}
 if(ranged()&&inZone&&mv.after&&!H.close&&!H.fainted&&!H.over){H.close=1;log(`↻ ${nm} swoops at you: now it’s in melee! Its close-range attacks can reach you.`,'bad');tip('close',"In melee (inner ring), a gunner is exposed to bites, claws and tail strikes. Use “Back off” to return to the outer ring.");}
 if(inZone&&mv.d&&!H._lured)palTakeHit(mv,monDmg(mv),false);H._lured=false;
 if(mv.ends){m.flying=0;log(`${nm} lands on the ground.`);}
 if(mv.after&&!H.fainted&&!H.over){const z0=H.zone;
  const s0=H.side,a0=zAngle(z0,s0);H.zone=afterZone(z0,mv.after);
  if(mv.after==='flip'&&z0==='flanc')H.side=s0==='g'?'d':'g';
  const a1=zAngle(H.zone,H.side);if(a1!==a0)H.moved={from:a0,to:a1};
  if(H.zone!==z0)log(`↻ ${nm} ${mv.after==='flip'?"crosses the arena":"turns toward you"}: you are now ${H.zone==='avant'?"to the front (head)":H.zone==='arriere'?"to the rear (tail)":"on the flank"}.`,'warn');
  else if(H.side!==s0)log(`↻ ${nm} moves past you: you are on its other flank.`,'warn');}
 if(mv.open){m.open=2;log("🎯 Opening! Damage +25% next turn.",'good');tip('open',"After certain attacks, the monster is left exposed: time to hit hard.");}}

function applyStatus(s){const sk=H.stats.sk;
 if(s==='burn'){if(sk.res_feu)return log("Fireproof: no burn.",'good');H.s.burn=3;log("🔥 You’re burning! A dodge puts out the flames.",'bad');}
 if(s==='poison'){if(sk.res_poison)return log("Anti-poison: immune.",'good');H.s.poison=5;log("☠️ You are poisoned! (antidote)",'bad');}
 if(s==='gel'){if(sk.res_glace)return log("Anti-frost: immune.",'good');H.s.gel=3;log("❄️ Frozen: your stamina recovers half as fast.",'bad');}
 if(s==='para'){if(sk.res_foudre)return log("Anti-paralysis: immune.",'good');H.s.para=1;H.s.why='para';log("⚡ Paralyzed! You lose your next turn.",'bad');}
 if(s==='sleep'){H.s.para=1;H.s.why='sleep';log("💤 Asleep! You lose your next turn, and a hit taken while asleep deals 50% more damage.",'bad');tip('sleep',"Asleep: you lose a turn, and the next hit taken during that turn wakes you with 50% more damage. Dodge or guard against the powder.");}
 if(s==='down'){H.s.para=1;H.s.why='down';log("🌋 Knocked down! You lose your next turn.",'bad');}
 if(s==='bulle'){H.s.bulle=3;log("🫧 Covered in bubbles: half your moves slip. A dodge clears them.",'bad');}
 if(s==='virus'&&!H.s.virus){H.s.virus=4;H.virusD=0;log("🦠 Frenzy! Deal heavy damage within 4 turns to overcome it (+15% attack), or it explodes.",'bad');tip('virus',"Frenzy: the gauge fills with your damage. Fill it before the countdown ends and you get +15% attack for 6 turns. Otherwise, it explodes and hurts you.");}
 if(s==='slime'){H.s.slime=2;log("🟢 Covered in explosive gel! Dodge next turn to shake it off, or it explodes.",'bad');tip('slime',"Explosive gel: it explodes at the end of the next turn. A dodge shakes it off. Guarding won’t protect you from the blast.");}}
function hurt(d,msg){H.hp-=d;H.fx.push({t:'hurt',v:d,z:H.zone,me:1});log(msg,'bad');if(H.hp<=0&&H.stats.sk.volonte&&!H.volUsed){H.hp=1;H.volUsed=true;log("🔩 Iron Will: you stay standing with 1 HP!",'good');return;}if(H.hp<=0&&palHas('rempart')&&H.pal&&!H.pal.ko&&!H.pal.wall&&!H.q.training){H.hp=1;H.pal.wall=1;log(`🐱 ${palS().name} jumps in and takes the hit: you stay standing with 1 HP!`,'good');return;}if(H.hp<=0)faint();else if(H.hp<H.hpMax*.4)tip('potion',"Low HP: drink a potion (Items) on a turn when the monster targets another zone.");}
function faint(){H.faints++;H.fainted=true;
 log("💀 You collapse! The Griffus carry you back to camp.",'bad');
 if(H.faints>=3)return endHunt('fail',"Three faints: the quest has failed.");
 H.hp=H.hpMax;H.st=H.stMax;H.s={burn:0,poison:0,gel:0,para:0,tet:0};H.w.charge=0;H.w.demon=false;H.zone='flanc';H.side='g';H.trap=false;const rest=palHas('sauveteur')?1:2;H.turn+=rest;H.faintPop={rest,left:3-H.faints};
 log(rest===1?`🐱 ${palS().name} rushes you back: you return after 1 turn of rest.`:"You return to the field after 2 turns of rest.",'warn');}

function endTurn(){const m=H.m,sk=H.stats.sk,nm=m.d.name;
 if(H.s.burn>0){H.s.burn--;hurt(5,"🔥 The burn deals 5 damage to you.");}
 if(H.over)return;
 if(H.s.poison>0){H.s.poison--;hurt(4,"☠️ The poison deals 4 damage to you.");}
 if(H.over)return;
 let regen=20+6*sk.endurance;if(H.s.gel>0){regen=Math.round(regen/2);H.s.gel--;}
 if(H.w.demon){H.st-=12-3*sk.endurance;if(H.st<=0){H.st=0;H.w.demon=false;log("Out of breath: Furious Mode ends.",'bad');}}
 else H.st=Math.min(H.stMax,H.st+regen);
 if(H.s.tet>0)H.s.tet--;if(H.s.bulle>0)H.s.bulle--;if(H.fren>0)H.fren--;
 if(H.s.slime>0&&!--H.s.slime&&!H.over){const d=Math.max(1,Math.round(m.d.lv*2*100/(100+H.stats.def)));hurt(d,`💥 The gel explodes on you: ${d} damage!`);}
 if(H.s.virus>0&&!H.over){if(!--H.s.virus){const d=Math.max(1,Math.round(m.d.lv*1.15*100/(100+H.stats.def)));hurt(d,`🦠 The Frenzy explodes: ${d} damage!`);}}
 if(H.elan>0)H.elan--;if(H.riposte>0)H.riposte--;
 if(H.song){if(H.song.atk>0&&!--H.song.atk)log("The song of might fades.");if(H.song.def>0&&!--H.song.def){H.stats.def-=25;log("The song of the bulwark fades.");}}
 if(H.w.fcd>0)H.w.fcd--;if(H.w.rcd>0)H.w.rcd--;if(H.w.ccd>0)H.w.ccd--;if(H.w.wf>0)H.w.wf--;if(H.w.shield>0&&!--H.w.shield)log("Your shield discharges.",'warn');
 if(H.w.ex){const wasT=triple();for(const k of['r','w','o'])if(H.w.ex[k]>0&&!--H.w.ex[k]){if(k==='o')H.stats.def-=20;log(`The ${EXTR[k].n} extract wears off.`,'warn');}}
 if(H.w.spirit>0&&++H.w.spiritT>=8){H.w.spirit--;H.w.spiritT=0;log("Your spirit level drops.",'warn');}
 if(m.poisoned>0){m.poisoned--;const d=Math.round(m.max*.025);m.hp-=d;log(`☠️ Poison eats at ${nm} (${d}).`,'good');capSave();if(m.hp<=0){H.blow="the poison";return endHunt('kill');}}
 if(m.enraged>0){m.enraged--;if(!m.enraged)log(`${nm} calms down.`);}else m.sinceRage++;
 if(m.open>0)m.open--;if(m.blind>0)m.blind--;if(m.trapImm>0)m.trapImm--;
 if(m.exhausted>0){m.exhausted--;if(!m.exhausted){m.stamina=100;log(`${nm} has caught its breath.`);}}
 else if(m.stamina<=0){m.exhausted=3;log(`💧 ${nm} is exhausted: it drools and its attacks weaken!`,'good');tip('exhaust',"When exhausted, the monster hits less hard and sometimes stumbles. Blunt hits exhaust it faster.");}
 if(m.charged>0){m.charged--;if(!m.charged)log("Fulgor’s overcharge subsides.");}
 if(m.stormCd>0)m.stormCd--;if(m.eclCd>0)m.eclCd--;if(m.stanceCd>0)m.stanceCd--;if(m.spikeCd>0)m.spikeCd--;
 if(m.spikes>0&&!--m.spikes){m.spikeCd=3;log(`${nm}’s spines go down.`);}
 if(m.eclipse>0){m.eclipse--;if(!m.eclipse){m.eclCd=4;m.open=2;log(`🌕 The light returns: ${nm} is dazzled for a moment, exposed for 2 turns!`,'good');}}
 if(m.storm>0){m.storm-=m.poisoned>0?2:1;if(m.poisoned>0&&m.storm>0)log("☠️ The poison disrupts the Tempestar: the storm weakens.",'good');if(m.storm<=0){m.storm=0;m.stormCd=3;m.open=2;m.mines=null;log(`🌤️ The storm dies down. ${nm} is exposed: damage +25% for 2 turns!`,'good');}}
 if(m.plates&&!m.phase2)for(const p in m.plates){const pl=m.plates[p];if(pl.bare>0){pl.bare--;if(!pl.bare){pl.hp=Math.round(pl.max*.6);log(`The iron reforms on the ${m.d.parts[p].name.toLowerCase()}.`,'warn');}}}
 if(m.lava&&!H.fainted){if(H.zone===m.lava){const d=Math.max(1,Math.round(m.d.lv*1.5*100/(100+H.stats.def)));hurt(d,`🔥 The molten ground burns you (${ZN[m.lava]}): ${d} damage.`);if(H.over)return;if(!H.fainted)applyStatus('burn');}m.lava=null;}
 if(m.rock>0){m.rock--;if(!m.rock)log("Grakku drops its rock.");}
 if(m.harden>0){if(m.parts.flanc.broken){m.harden=0;log("💥 The shattered shell can no longer hold the heat: it cools at once.",'good');}else if(!--m.harden)log(`${nm}’s shell cools down.`);}
 if(m.flying>1)m.flying--;
 m.flinched=false;m.flash=false;
 const r=m.hp/m.max;
 if(!m.enraged&&!m.exhausted&&!m.forceRoar&&(r<m.enrageAt||m.sinceRage>=14)){m.forceRoar=true;if(r<m.enrageAt)m.enrageAt-=.3;}
 if(m.d.phases&&!m.phase2&&!m.phaseQ&&r<.5)m.phaseQ=true;
 if(r<=.2&&!m.limp&&!m.d.elder){m.limp=true;log(`🦴 ${nm} is limping! It can be captured: trap, then two tranq bombs.`,'warn');tip('capture',"Capturing gives a bigger bounty and different rewards than carving. Set the trap when the monster isn’t targeting you.");}
 H.turn++;H._bur=0;H.freeItem=false;if(H.pal)H.pal.lure=false;
 if(H.turn>H.max)return endHunt('fail',"Time’s up: the monster has left the area.");
 chooseIntent();
 H.log.push({m:`Turn ${H.turn}`,c:'sep',t:H.turn});}

function chooseIntent(){chooseIntent0();const m=H.m;H.eHint=m.eclipse>0?(H.intent||[]).map(mv=>mv.track?'track':mv.d?(rnd()<.75?pick(effZones(mv).length?effZones(mv):ALLZ):pick(ALLZ)):null):null;}
function chooseIntent0(){const m=H.m,d=m.d;
 m.prep=null;if(H.q.training){H.intent=[TRAIN_IDLE];return;}if(m.storm>0&&!m.mines)m.mines={z:[H.zone],mv:'foudre_t'};
 if(m.trapped>0||m.ko>0||m.topple>0){H.intent=[IDLE];return;}
 if(m.burrow>0){const sm=d.moves.find(x=>x.id==='surgit');if(sm){H.intent=[sm];return;}m.burrow=0;}
 if(H.grab>0){const bm=d.moves.find(x=>x.id==='broyage');if(bm){H.intent=[bm];return;}H.grab=0;}
 if(m.aware===false){m.aware=true;H.intent=[introMove(d)];log(`${d.name} has spotted you!`,'warn');return;}
 if(m.phaseQ&&!m.phase2){m.chain=null;H.intent=[d.moves.find(x=>x.fx==='phase')];return;}
 if(m.chain){const mv=d.moves.find(x=>x.id===m.chain);m.chain=null;if(mv){m.prep=mv.id;H.intent=[mv];return;}}
 if(m.forceRoar&&!m.flying){H.intent=[roarMove(d)];return;}
 let pool;
 if(m.flying)pool=d.moves.filter(x=>x.fly&&(m.flying<=1?x.ends:x.id!=='atterrit'));
 else pool=d.moves.filter(x=>!x.fly&&x.w>0&&(!x.rage||m.enraged>0)&&(!x.chg||m.charged>0)&&(!x.p1||!m.phase2)&&(!x.p2||m.phase2)&&(!x.cond||x.cond(m,H)));
 if(m.exhausted>0)pool=pool.filter(x=>!x.fx);
 if(!pool.length)pool=d.moves.filter(x=>!x.fx&&!x.fly&&x.w>0);
 const wl=pool.map(x=>{let w=x.w;if(effZones(x).includes(H.zone))w*=2;if(ranged()&&!H.close&&reachOf(x))w*=1.6;if(x.id===m.lastMove)w*=.5;return[x,w];});
 const first=wpick(wl);H.intent=[first];
 if(first.track)tip('track',"Tracking attack: it follows you wherever you go. Only dodging and guarding protect you.");
 else if(first.tier==='L'&&effZones(first).includes(H.zone))tip('light',"Light hit: you can often take it and keep attacking, rather than waste your turn dodging.");
 else if(first.tier==='H'&&effZones(first).includes(H.zone))tip('heavy',"Heavy hit: dodge, guard or leave the zone. Taking it costs dearly.");
 if(m.phase2)m.lava=pick(ALLZ);
 if(!first.fx&&!m.exhausted&&!m.flying){const p2=(m.charged>0?.35:0)+(m.enraged>0&&d.rank>=3?.22:0)+(m.phase2?.12:0)+(d.elite?.15:0)+(d.anc?.15:0);
  if(rnd()<p2){const second=wpick(wl.filter(e=>!e[0].fx&&e[0].id!==first.id));if(second)H.intent.push(second);}}}

function objDone(o,kind){const m=H.m,[t,v]=o.id.split(':');
 if(t==='b')return v==='queue'?(m.parts.queue.broken||m.parts.queue.severed):m.parts[v].broken;
 if(t==='plates')return m.platesBroken>=+v;
 if(t==='capture')return kind==='capture';if(t==='fast')return kind&&kind!=='fail'&&H.turn-1<+v;if(t==='nofaint')return kind&&kind!=='fail'&&H.faints===0;return false;}
function checkObj(){for(const o of H.q.obj||[]){if(H.objLog&&H.objLog[o.id])continue;if((o.id.startsWith('b:')||o.id.startsWith('plates:'))&&objDone(o)){H.objLog=H.objLog||{};H.objLog[o.id]=1;H.pend.push([`🎯 Objective complete: ${o.n}!`,'good']);}}}
function lootMon(kind,m,res,nOk){const d=m.d,sk=H.stats.sk;const add=k=>{const id=matId(m.id,k);res.gain[id]=(res.gain[id]||0)+1;S.mats[id]=(S.mats[id]||0)+1;};
  const fel=H.felyne?H.felyne.id:'';
  if(kind==='kill'){const n=3+sk.depeceur+(fel==='depeceur'?1:0)+(palHas('depec')?1:0);for(let i=0;i<n;i++)add(wpick(CARVE));}
  else{const n=3+sk.capture;for(let i=0;i<n;i++)add(wpick(CAPT));}
  res.breaks=H.breaks.slice();
  for(const b of H.breaks)add(b==='tete'?'tete':b==='flanc'?'griffe':'queue');
  for(let i=0;i<Math.min(4,m.platesBroken);i++)add(i%2?'peau':'ecaille');
  const qn=2+(fel==='chance'?1:0)+(palHas('chance')?1:0);for(let i=0;i<qn;i++)add(wpick(CAPT));
  if(d.anc){const nx=2+(rnd()<.5?1:0)+Math.min(2,H.breaks.length);for(let i=0;i<nx;i++)add('aeca');if(rnd()<.35+.1*nOk)add('arare');}
  else if(d.elite){const nx=2+(rnd()<.5?1:0)+Math.min(2,H.breaks.length);for(let i=0;i<nx;i++)add('xeca');if(rnd()<.35+.1*nOk)add('xrare');}
}
function duoSwap(kind){const m=H.m,q=H.q;const r0={gain:{}};lootMon(kind,m,r0,0);H.duoGain=r0.gain;H.duo1={mon:m.id,kind};
 S.mon[m.id]=S.mon[m.id]||{seen:true,kills:0,caps:0};if(kind==='kill')S.mon[m.id].kills++;else S.mon[m.id].caps++;
 log(kind==='kill'?`🏆 ${m.d.name} collapses${H.blow?`, finished off by ${H.blow}`:''}!`:`🏆 ${m.d.name} is captured!`,'good');H.blow=null;
 const n=makeMonster(q.duo,q.anc?2:q.elite);H.m=n;preloadMon(q.duo);S.mon[q.duo]=S.mon[q.duo]||{seen:false,kills:0,caps:0};S.mon[q.duo].seen=true;if(q.anc)S.mon[q.duo].aseen=true;else if(q.elite)S.mon[q.duo].eseen=true;
 H.breaks=[];H.trap=false;H.spare=0;H.close=0;H.grab=0;H.eHint=null;H.zone='flanc';H.side='g';n.aware=true;H.intent=[introMove(n.d)];H.duo2=1;H.fx=[];
 log(`⚠️ Second target: ${n.d.name} appears, drawn by the commotion! ${H.max-H.turn+1} turns left.`,'warn');sfx('roar');save();}
function endHunt(kind,reason){if(H.over)return;if(kind!=='fail'&&H.m.loot&&H.m.loot.length){giveBack("On its remains");flush();}const q=H.q;if(kind==='kill'&&q.capture){kind='fail';reason=`${H.m.d.name} was killed: the Guild required a capture.`;}if(kind!=='fail'&&q.duo&&!H.duo2){duoSwap(kind);return;}H.over=true;const m=H.m,d=m.d,sk=H.stats.sk;
 const res={kind,reason,fled:!!H.fled,turns:H.turn,faints:H.faints,gain:{},zenny:0,mon:m.id,q,meal:H.meal&&H.meal.id};
 if(kind!=='fail'){const add=k=>{const id=matId(m.id,k);res.gain[id]=(res.gain[id]||0)+1;S.mats[id]=(S.mats[id]||0)+1;};
  const got0=objGot(q);res.obj=(q.obj||[]).map(o=>({n:o.n,id:o.id,ok:!!objDone(o,kind),old:got0.includes(o.id)}));const nOk=res.obj.filter(o=>o.ok&&!o.old).length;
  lootMon(kind,m,res,nOk);if(H.duoGain)for(const id in H.duoGain)res.gain[id]=(res.gain[id]||0)+H.duoGain[id];res.duo1=H.duo1||null;
  for(let i=0;i<nOk;i++)add(wpick(CAPT));
  S.obj=S.obj||{};const ok0=objKey(q);S.obj[ok0]=S.obj[ok0]||[];for(const o of res.obj)if(o.ok&&!S.obj[ok0].includes(o.id))S.obj[ok0].push(o.id);
  res.fpen=Math.min(.5,.25*H.faints);res.zenny=Math.round(q.z*((kind==='capture'?1.2:1)+.25*nOk)*(1-res.fpen));S.zenny+=res.zenny;
  S.mon[m.id]=S.mon[m.id]||{seen:true,kills:0,caps:0};
  if(kind==='kill')S.mon[m.id].kills++;else S.mon[m.id].caps++;if(q.elite&&!q.anc)S.mon[m.id].ewin=1;if(q.anc)S.mon[m.id].awin=1;
  const sp=q.anc?[['spherea',2+(nOk>0?1:0)],['sphered',1]]:q.elite?[['sphered',2+(nOk>0?1:0)],['sphere',1]]:[['sphere',1+Math.ceil(q.stars/2)+(nOk>1?1:0)]];res.spheres=sp;S.res=S.res||{};for(const[k,n]of sp)S.res[k]=(S.res[k]||0)+n;
  res.first=!S.cleared[q.id];const hr0=hr(),un0=QUESTS.filter(x=>x.tier>0&&!S.cleared[x.id]&&unlocked(x)).map(x=>x.id);S.cleared[q.id]=(S.cleared[q.id]||0)+1;res.rankUp=q.tier>0&&hr()>hr0&&!stageDone(hr())?hr():0;res.newQ=QUESTS.filter(x=>x.tier>0&&!S.cleared[x.id]&&unlocked(x)&&!un0.includes(x.id)).map(x=>x.title);}
 res.blow=H.blow||null;res.pil=H.palLoot||null;res.palxp=kind==='fail'?5:10+5*q.stars;res.palup=palGainXP(res.palxp);
 if(kind==='kill')log(`🏆 ${d.name} collapses${H.blow?`, finished off by ${H.blow}`:''}!`,'good');
 else if(kind==='capture')log(`🏆 ${d.name} is captured!`,'good');
 else log(`❌ ${reason||"Quest failed."}`,'bad');
 R=res;if(q.explore)expOnHuntEnd(res);save();saveHunt();}

/* ---------- Griffu compagnon ---------- */
const PAL_VOC={
 assaut:{n:"Assault",d:"Attacks often and throws barrel bombs.",i:'⚔️'},
 soin:{n:"Support",d:"Blows its healing horn and cures poison and burn.",i:'💚'},
 garde:{n:"Protection",d:"Waves a decoy to draw away hits aimed at you.",i:'🛡️'},
 collecte:{n:"Gathering",d:"Gathers extra, covers your tracks on expeditions and steals in combat.",i:'🧺'}};
const PAL_VOC_ORDER=['assaut','soin','garde','collecte'];
const PAL_W={fer:{n:"Iron claw",atk:10,type:'cut'},grakku:{n:"Beak hammer",atk:14,type:'blunt'},brontal:{n:"Ember blade",atk:17,type:'cut',el:'feu'},
 velyra:{n:"Venom stinger",atk:19,type:'cut',stat:'poison'},glacimorde:{n:"Frost mace",atk:21,type:'blunt',el:'glace'},scoriak:{n:"Lava pestle",atk:22,type:'blunt',el:'feu'},boregor:{n:"Snow claw",atk:24,type:'cut'},devoreur:{n:"Ravenous fang",atk:28,type:'cut',el:'dragon'},bombardier:{n:"Bomb hammer",atk:29,type:'blunt',el:'feu'},tempestaire:{n:"Wind claw",atk:31,type:'cut',el:'foudre'},rapinoux:{n:"Thieving claw",atk:13,type:'cut'},selenis:{n:"Lunar stinger",atk:18,type:'cut',el:'glace'},herissaure:{n:"Spiny mace",atk:21,type:'blunt'},nacrelle:{n:"Pearled claw",atk:27,type:'cut',el:'glace'},sismorak:{n:"Tusk hammer",atk:29,type:'blunt'},tranchelune:{n:"Moon blade",atk:31,type:'cut',el:'dragon'},gorgovire:{n:"Frenzied claw",atk:34,type:'cut'},pyroclaste:{n:"Basalt fist",atk:34,type:'blunt',el:'feu'},abyssaure:{n:"Obsidian claw",atk:36,type:'cut',el:'dragon'},fulgor:{n:"Thunder claw",atk:23,type:'cut',el:'foudre'},ferroi:{n:"King’s hammer",atk:26,type:'blunt',el:'dragon'}};
const PAL_A={fer:{n:"Iron outfit",def:0,hp:0},grakku:{n:"Rockbeak outfit",def:6,hp:10},brontal:{n:"Blaze outfit",def:10,hp:15},velyra:{n:"Venom outfit",def:14,hp:20},
 glacimorde:{n:"Frost outfit",def:18,hp:25},scoriak:{n:"Magma outfit",def:20,hp:28},boregor:{n:"Rime outfit",def:24,hp:34},devoreur:{n:"Ravenous outfit",def:30,hp:46},bombardier:{n:"Blast outfit",def:32,hp:48},tempestaire:{n:"Tempest outfit",def:34,hp:52},rapinoux:{n:"Pilferer outfit",def:5,hp:8},selenis:{n:"Pale Moon outfit",def:12,hp:18},herissaure:{n:"Thorned outfit",def:19,hp:27},nacrelle:{n:"Pearled outfit",def:29,hp:44},sismorak:{n:"Telluric outfit",def:32,hp:50},tranchelune:{n:"Moonblade outfit",def:33,hp:50},gorgovire:{n:"Frenzied outfit",def:37,hp:56},pyroclaste:{n:"Basalt outfit",def:37,hp:58},abyssaure:{n:"Eclipse outfit",def:39,hp:60},fulgor:{n:"Thunder outfit",def:22,hp:30},ferroi:{n:"King’s outfit",def:28,hp:40}};
const PAL_ORDER=['fer','rapinoux','grakku','brontal','selenis','velyra','glacimorde','scoriak','herissaure','fulgor','boregor','ferroi','devoreur','nacrelle','bombardier','sismorak','tempestaire','tranchelune','gorgovire','pyroclaste','abyssaure'];
const PAL_SK=[
 {id:'griffes',lv:1,n:"Sharpened claws",d:"+15% damage for your Griffu."},
 {id:'depec',lv:2,n:"Feline carver",d:"+1 carve draw."},
 {id:'econome',lv:3,n:"Thrifty",d:"15% chance not to use up an item."},
 {id:'endurant',lv:4,n:"Tireless",d:"+30 HP; gets back up in 2 turns instead of 3."},
 {id:'artificier',lv:5,n:"Demolitionist",d:"More frequent barrel bombs, whatever the calling."},
 {id:'chance',lv:6,n:"Lucky",d:"+1 quest reward."},
 {id:'piegeur',lv:7,n:"Trapper",d:"Sets a trap once per hunt when the monster is limping."},
 {id:'flair',lv:8,n:"Keen nose",d:"Tracks −15% on expeditions; spots the buried chest on the map."},
 {id:'sauveteur',lv:9,n:"Rescuer",d:"After fainting, you return in 1 turn instead of 2."},
 {id:'furie',lv:10,n:"Feline fury",d:"Strikes twice when the monster is down, trapped or stunned."},
 {id:'rempart',lv:12,n:"Feline bulwark",d:"Once per hunt, it jumps in front of a blow that would knock you out: you stay standing with 1 HP."},
 {id:'herbo',lv:14,n:"Herbalist",d:"Once per hunt, when your HP drops below 30%, it heals you for 40% of your max HP."},
 {id:'pisteur',lv:16,n:"Tracker",d:"+1 resource from each gathering spot and each vein on expeditions."},
 {id:'meneur',lv:18,n:"Pack leader",d:"+5% attack for you while your Griffu is standing."},
 {id:'legende',lv:20,n:"Legendary Griffu",d:"+25% damage for your Griffu, and its barrel bombs are more frequent."}];
const PAL_MAXLV=20;
function palSlots(lv){return lv>=15?5:lv>=9?4:lv>=6?3:lv>=3?2:1;}
function palNext(lv){return 20+15*lv;}
function newPal(){return{name:"Whiskers",lv:1,xp:0,voc:'assaut',w:'fer',a:'fer',ws:['fer'],as:['fer'],sk:['griffes']};}
function palS(){if(!S.pal)S.pal=newPal();return S.pal;}
function palHas(k){const p=palS();return p.sk.includes(k);}
function palStats(){const p=palS(),w=PAL_W[p.w]||PAL_W.fer,a=PAL_A[p.a]||PAL_A.fer;
 return{atk:Math.round(w.atk*(1+.04*Math.min(9,p.lv-1)+.02*Math.max(0,p.lv-10))*(palHas('griffes')?1.15:1)*(palHas('legende')?1.25:1)),w,a,def:a.def+2*(p.lv-1),hp:60+5*(p.lv-1)+a.hp+(palHas('endurant')?30:0)};}
function palRecipe(kind,lin){const o=ZONE_ORE[lin],hd=ZONE_HIDE[lin],r=MON[lin].rank;
 return kind==='w'?{mats:{griffe:1,ecaille:1},res:{[o]:1,[hd]:1},z:80*r}:{mats:{peau:1,ecaille:1},res:{[hd]:1},z:80*r};}
function palGainXP(n){const p=palS();const out=[];if(p.lv>=PAL_MAXLV)return out;p.xp+=n;
 while(p.lv<PAL_MAXLV&&p.xp>=palNext(p.lv)){p.xp-=palNext(p.lv);p.lv++;const sk=PAL_SK.find(s=>s.lv===p.lv);out.push(`${p.name} reaches level ${p.lv}${sk?` and learns “${sk.n}”`:''}${palSlots(p.lv)>palSlots(p.lv-1)?" — a skill slot opens":''}!`);
  if(sk&&p.sk.length<palSlots(p.lv))p.sk.push(sk.id);}
 if(p.lv>=PAL_MAXLV)p.xp=0;return out;}
/* En combat */
function palInit(){const st=palStats();return{hp:st.hp,max:st.hp,ko:0,cd:0,lure:false,pil:0,trap:0};}
function palHit(d,pid,type){const m=H.m,ps=m.parts[pid],pd=m.d.parts[pid];
 m.hp-=d;ps.dmg+=d;if(type==='cut')ps.cut+=d;if(m.plates&&!m.phase2)hitPlate(pid,d*(type==='blunt'?1.6:1));
 m.flinchAcc+=d;if(type==='blunt'&&pid==='tete'&&!m.ko&&!m.flying){m.koAcc+=d*.25;if(m.koAcc>=m.koThr){m.ko=2;m.koAcc=0;m.koThr=Math.round(m.koThr*1.5);m.chain=null;H.pend.push([`💫 ${m.d.name} is stunned!`,'good']);discharge();}}
 if(pd.brk&&!ps.broken&&ps.dmg>=pd.brk*m.max){ps.broken=true;m.flinched=true;H.breaks.push(pid);H.pend.push([`💥 ${pd.name} ${brisé(pd.name)}!`,'good']);if(pid==='tete')discharge();}
 if(pd.sever&&!ps.severed&&ps.cut>=.18*m.max){ps.severed=true;m.flinched=true;H.breaks.push('sever');H.pend.push([`✂️ ${pd.name} severed! Its reach shrinks.`,'good']);}}
function palAttack(mult,label){const m=H.m,st=palStats(),w=st.w;const pid=m.flying?'flanc':pick(['tete','flanc','queue']);
 let d=st.atk*(.85+rnd()*.3)*hz(pid,w.type)/100*(m.open>0?1.25:1)*(m.flying?.5:1)*(m.storm>0?.65:1)*mult;
 if(w.el)d+=st.atk*.35*(m.d.weak[w.el]||0)*mult;d=Math.max(1,Math.round(d));
 palHit(d,pid,w.type);H.fx.push({t:'pal',v:d,z:H.zone});
 if(w.stat==='poison'&&!m.poisoned){m.poisonAcc+=8*mult;if(m.poisonAcc>=m.poisonThr){m.poisoned=4;m.poisonAcc=0;m.poisonThr+=80;H.pend.push([`☠️ ${m.d.name} is poisoned!`,'good']);}}
 log(`🐱 ${palS().name} ${label} ${label.includes('bombe')?'':m.d.parts[pid].name.toLowerCase()+' '}(${d}).`);
 if(m.hp<=0)H.blow=`${palS().name}, your Griffu`;return d;}
function palico(){if(H.q.training)return;const m=H.m,p=palS();if(!H.pal)H.pal=palInit();const P=H.pal;if(H.grab>0&&!P.ko&&rnd()<(p.voc==='garde'?.7:.45)){H.grab=0;log(`🐱 ${p.name} bites ${m.d.name}’s maw: you’re free!`,'good');return;}if(m.burrow>0){if(P.cd>0)P.cd--;return;}
 if(P.cd>0)P.cd--;
 if(P.ko>0){P.ko--;if(!P.ko){P.hp=Math.round(P.max*.6);log(`🐱 ${p.name} returns to the fight.`,'good');}return;}
 const down=m.trapped>0||m.ko>0||m.topple>0;const voc=p.voc,r=rnd();
 if(palHas('herbo')&&!P.herb&&H.hp>0&&H.hp<H.hpMax*.3){P.herb=1;const v=Math.min(Math.round(H.hpMax*.4),H.hpMax-H.hp);H.hp+=v;H.fx.push({t:'heal',v,z:H.zone,me:1});log(`🐱 ${p.name} applies a herbal poultice: +${v} HP!`,'good');return;}
 if(palHas('piegeur')&&m.limp&&!P.trap&&!H.trap&&!m.trapped&&!m.d.elder){P.trap=1;H.trap=true;log(`🐱 ${p.name} sets a pitfall trap under ${m.d.name}’s feet!`,'good');return;}
 if(voc==='soin'){
  if((H.s.poison>0||H.s.burn>0)&&r<.45){H.s.poison=0;H.s.burn=0;log(`🐱 ${p.name} splashes you with a brew: poison and burn cured.`,'good');return;}
  if(H.hp<H.hpMax*.8&&r<.5){const v=Math.min(Math.round(15+2*p.lv),H.hpMax-H.hp);H.hp+=v;H.fx.push({t:'heal',v,z:H.zone,me:1});log(`🐱 ${p.name} blows its healing horn: +${v} HP.`,'good');return;}}
 if(voc==='garde'&&!P.cd&&!down){const it=(H.intent||[]).find(mv=>mv.d&&effZones(mv).includes(H.zone));if(it&&r<.45){P.lure=true;P.cd=4;log(`🐱 ${p.name} waves its decoy, yowling: ${m.d.name} turns toward it!`,'good');return;}}
 if(voc==='collecte'&&!P.pil&&rnd()<.08){P.pil=1;const k=wpick(CAPT),id=matId(m.id,k);S.mats[id]=(S.mats[id]||0)+1;H.palLoot=id;save();log(`🐱 ${p.name} steals a material: ${matName(id)}!`,'good');return;}
 const bombP=(voc==='assaut'?.12:.03)+(palHas('artificier')?.08:0)+(palHas('legende')?.05:0);
 if(rnd()<bombP){const d=Math.round(palStats().atk*(2.2+rnd()*.6)*(m.flying?.5:1));m.hp-=d;m.flinchAcc+=d*1.2;if(m.plates&&!m.phase2)hitPlate(pick(['tete','flanc','queue']),d*1.2);
  if(!m.ko&&!m.flying){m.koAcc+=d*.3;if(m.koAcc>=m.koThr){m.ko=2;m.koAcc=0;m.koThr=Math.round(m.koThr*1.5);m.chain=null;H.pend.push([`💫 ${m.d.name} is stunned!`,'good']);discharge();}}
  H.fx.push({t:'pal',v:d,z:H.zone});log(`🐱 ${p.name} throws a barrel bomb! (${d})`);if(m.hp<=0)H.blow=`${p.name}, your Griffu, with a barrel bomb`;flush();return;}
 const atkP=voc==='assaut'?.8:voc==='collecte'?.5:.6;
 if(down||rnd()<atkP){palAttack(1,'claws the');if(down&&palHas('furie')&&m.hp>0)palAttack(1,"follows up on the");}
 flush();}
function palTakeHit(mv,d0,lure){const P=H.pal,p=palS();if(!P||P.ko>0)return;const st=palStats();
 if(!lure&&rnd()<.4)return;
 const d=Math.max(1,Math.round(d0*(lure?.8:.55)*100/(100+st.def)));P.hp-=d;
 if(lure)log(`🐱 ${p.name} takes ${mv.n.toLowerCase()} in your place (${d}).`,'warn');
 if(P.hp<=0){P.hp=0;P.ko=palHas('endurant')?2:3;log(`🐱 ${p.name} is down! It withdraws to lick its wounds.`,'bad');}}
/* Rendu */
function palSVG(cls='palport',voc){const v0=voc||palS().voc;return`<img class="${cls} palimg" src="img/pal/${v0}.webp" alt="" draggable="false">`;}
function vPalico(){const p=palS(),st=palStats(),tab=sub.ptab||'voc';const back=sub.fromPrep?backBtn('prep',"Preparation"):backBtn();
 const nx=p.lv>=PAL_MAXLV?null:palNext(p.lv);
 const head=`<div class="palhead">${palSVG()}<div class="palinfo"><h2 style="margin:0">${esc(p.name)} <button class="btn ghost sm" data-a="palname">Rename</button></h2>
  <span class="small muted">Griffu companion · level ${p.lv}${nx?` · ${p.xp}/${nx} XP`:' (max)'}</span>${nx?bar(p.xp,nx,'st'):''}</div></div>
  <div class="stats four pstats"><div><small>Attack</small><b>${st.atk}</b></div><div><small>${st.w.el?"Element":st.w.stat?"Status":"Type"}</small><b>${st.w.el?elIcon(st.w.el)+' '+ELEM[st.w.el].n:st.w.stat?uic('st_poison')+" Poison":st.w.type==='blunt'?"Blunt":"Cutting"}</b></div><div><small>HP</small><b>${st.hp}</b></div><div><small>Defense</small><b>${st.def}</b></div></div>`;
 const tabs=`<div class="tabs">${[['voc',"Calling"],['eq',"Equipment"],['sk',"Skills"]].map(([k,n])=>`<button class="tab ${tab===k?'on':''}" data-a="ptab" data-v="${k}">${n}</button>`).join('')}</div>`;
 let body='';
 if(tab==='voc')body=`<p class="small muted" style="margin:0 0 6px">The calling decides what ${esc(p.name)} does during the hunt. You can change it freely in the village.</p><div class="pvocs">${PAL_VOC_ORDER.map(k=>{const v=PAL_VOC[k];return`<button class="pvoc ${p.voc===k?'on':''}" data-a="palvoc" data-v="${k}">${palSVG('pvocimg',k)}<b>${v.n}</b><span>${v.d}</span></button>`;}).join('')}</div>`;
 else if(tab==='eq'){const row=(kind,lin)=>{const D=kind==='w'?PAL_W[lin]:PAL_A[lin];const own=(kind==='w'?p.ws:p.as).includes(lin),cur=(kind==='w'?p.w:p.a)===lin;const seen=lin==='fer'||(S.mon[lin]&&S.mon[lin].seen);
   if(!seen)return`<div class="prow2 locked"><span><b>Unknown ${kind==='w'?"Weapon":"Outfit"}</b><small>Materials from an unknown monster</small></span></div>`;
   const stt=kind==='w'?`Attack ${D.atk}${D.el?`, ${elIcon(D.el)} ${ELEM[D.el].n}`:D.stat?', '+uic('st_poison')+" Poison":''}, ${D.type==='blunt'?'blunt':'cutting'}`:`Defense ${D.def}, HP +${D.hp}`;
   const r=lin==='fer'?null:palRecipe(kind,lin),ok=r&&canPay(lin,r);
   return`<div class="prow2 ${cur?'cur':''}"><span><b>${esc(D.n)}</b><small>${stt}</small>${!own&&r?recipeHTML(lin,r):''}</span>${cur?"<span class=\"tag\">Equipped</span>":own?`<button class="btn sm" data-a="palequip" data-v="${kind}|${lin}">Equip</button>`:`<button class="btn sm ${ok?'go':''}" data-a="palforge" data-v="${kind}|${lin}" ${ok?'':'disabled'}>Forge</button>`}</div>`;};
  body=`<h3>Weapon</h3><div class="plist">${PAL_ORDER.map(l=>row('w',l)).join('')}</div><h3>Outfit</h3><div class="plist">${PAL_ORDER.map(l=>row('a',l)).join('')}</div>`;}
 else{const ns=palSlots(p.lv);body=`<p class="small muted" style="margin:0 0 6px">${esc(p.name)} learns a skill at every level up to 10, then at levels 12, 14, 16, 18 and 20. Slots: ${p.sk.length}/${ns} (one more at levels 3, 6, 9 and 15). Tap a learned skill to equip or remove it.</p><div class="plist">${PAL_SK.map(s=>{const known=p.lv>=s.lv,on=p.sk.includes(s.id);
  return`<button class="pskill ${on?'on':''} ${known?'':'locked'}" data-a="${known?'palsk':'noop'}" data-v="${s.id}"><span><b>${esc(s.n)}</b><small>${known?esc(s.d):`Learned at level ${s.lv}`}</small></span><em>${on?"Active":known?'':'🔒'}</em></button>`;}).join('')}</div>`;}
 const toast=sub.toast;sub.toast=null;
 return back+(toast?`<div class="toast">🐱 ${esc(toast)}</div>`:'')+head+tabs+body;}
/* ---------- Dessin des monstres (vue de dessus, tête vers l'avant) ---------- */
const PAL={
 grakku:{base:'#c79b68',dark:'#6e4c2c',light:'#f0d8ad',acc:'#5f8aa6',acc2:'#efe2bd'},
 brontal:{base:'#924b36',dark:'#4a2217',light:'#dca17c',acc:'#f08a3c',acc2:'#f7d8b2'},
 velyra:{base:'#5d7c38',dark:'#2c401d',light:'#a9c26a',acc:'#cddc70',acc2:'#9a45b5'},
 glacimorde:{base:'#6d97b8',dark:'#2f4d66',light:'#cde4f3',acc:'#eef9fd',acc2:'#9fdcf2'},
 scoriak:{base:'#5b4b45',dark:'#231a17',light:'#9c867a',acc:'#ff7a2a',acc2:'#ffd27a'},
 devoreur:{base:'#4f5a3a',dark:'#1f2416',light:'#8a9468',acc:'#c8322a',acc2:'#efe6cc'},
 boregor:{base:'#c9d4dc',dark:'#56687a',light:'#f4f8fb',acc:'#7aa6c8',acc2:'#e9eef2'},
 fulgor:{base:'#40607f',dark:'#1b2b40',light:'#93b3d3',acc:'#f2d34a',acc2:'#e3e9f0'},
 pantin:{base:'#d8b878',dark:'#6a4a24',light:'#f0dca8',acc:'#c8322a',acc2:'#efe3c2'},
 tempestaire:{base:'#7f93ad',dark:'#2c3748',light:'#d8e6f4',acc:'#cfe4ff',acc2:'#6fb6ff'},
 rapinoux:{base:'#b0643a',dark:'#5a2e18',light:'#f0c890',acc:'#e8c07a',acc2:'#7a3a1a'},
 selenis:{base:'#b8c0e0',dark:'#4a4a80',light:'#eef0ff',acc:'#8a8ae0',acc2:'#ffffff'},
 herissaure:{base:'#c8a060',dark:'#6a4a20',light:'#f0dca8',acc:'#e8e0c8',acc2:'#8a2a1a'},
 nacrelle:{base:'#e8eef0',dark:'#4a7a80',light:'#ffffff',acc:'#3ac8c0',acc2:'#a8f0ec'},
 sismorak:{base:'#7f90a0',dark:'#2c3848',light:'#d8e6f0',acc:'#d8c8a0',acc2:'#a8d8f0'},
 tranchelune:{base:'#22262e',dark:'#0a0c10',light:'#5a6070',acc:'#c8ccd8',acc2:'#ff5a5a'},
 gorgovire:{base:'#2a2530',dark:'#0e0a12',light:'#5a4a66',acc:'#8a5aa0',acc2:'#c8a0e0'},
 pyroclaste:{base:'#2a3448',dark:'#0e1420',light:'#5a6a88',acc:'#b8e03a',acc2:'#e8ff8a'},
 abyssaure:{base:'#2e2838',dark:'#0e0b14',light:'#6a5a86',acc:'#b28cff',acc2:'#e8dcff'},
 bombardier:{base:'#6b3a34',dark:'#2a1512',light:'#b8806a',acc:'#ffb04a',acc2:'#ff6a1a'},
 ferroi:{base:'#4b4f58',dark:'#17191e',light:'#8e96a3',acc:'#b9c0ca',acc2:'#ff7a1a'}};
function monsterSVG(m,uid='a'){const d=m.d,p=PAL[m.id],P=m.parts,hb=P.tete.broken,fb=P.flanc.broken,sev=P.queue.severed;
 const G=`url(#mgb${uid})`,ol=`stroke="${p.dark}" stroke-width="1.6" stroke-linejoin="round"`;
 const eyeC=m.enraged?'#ff3b1f':(m.id==='fulgor'&&m.charged)?'#fff6a8':'#141414';
 const prep=m.prep;let g='';
 const defs=`<defs><radialGradient id="mgb${uid}" cx="42%" cy="34%" r="75%"><stop offset="0" stop-color="${p.light}"/><stop offset=".55" stop-color="${p.base}"/><stop offset="1" stop-color="${p.dark}"/></radialGradient>
 <radialGradient id="mglow${uid}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${m.id==='glacimorde'?'#e8fbff':'#ffd25a'}" stop-opacity=".95"/><stop offset="1" stop-color="${m.id==='glacimorde'?'#9fdcf2':'#ff5a1f'}" stop-opacity="0"/></radialGradient></defs>`;
 if(PIMG.has(m.id)){const sv=SIMG[m.id],alt=sv&&sv[0](m)?sv[1]:null;const fl=alt?'':m.harden>0?'drop-shadow(0 0 7px #ff7a1a)':m.charged>0?'drop-shadow(0 0 7px #ffe45a)':m.eclipse>0?'drop-shadow(0 0 6px #b28cff)':m.spikes>0?'drop-shadow(0 0 5px #e8e0c8)':'';
  g=`<image href="img/mon/${alt||m.id}.webp" x="66" y="72" width="168" height="168" preserveAspectRatio="xMidYMid meet"${m.burrow&&!alt?' opacity=".12"':''}${fl?` style="filter:${fl}"`:''}/>`;
  if(m.burrow&&!alt)g+=`<ellipse cx="150" cy="176" rx="62" ry="24" fill="#eef5fa" stroke="#9ab0c0" stroke-width="2"/><path d="M104,170 q12,-14 24,-2 q10,-14 22,-1 q12,-13 24,1 q10,-10 20,2" fill="none" stroke="#c8d8e4" stroke-width="3"/>`;
  if(m.rock>0&&!alt)g+=`<g><ellipse cx="98" cy="124" rx="22" ry="17" fill="#8e8a7e" stroke="#4a463c" stroke-width="2"/><path d="M84,120 L96,113 L110,122 M90,132 L104,128" stroke="#5e5a50" stroke-width="1.6" fill="none"/></g>`;
  if(m.plates&&!m.phase2){const n=Object.values(m.plates).filter(x=>x.hp>0).length;if(n)g+=`<g opacity=".85">${Array.from({length:n},(_,i)=>`<rect x="${128+i*16}" y="96" width="12" height="14" rx="2" fill="#9aa3ad" stroke="#3a3e46" stroke-width="1.5"/>`).join('')}</g>`;}}
 let over='';
 if(m.ko)over+=`<g class="spin"><image href="img/ui/s_ko.webp" x="138" y="64" width="24" height="24"/></g>`;
 if(m.poisoned)over+=`<circle cx="178" cy="126" r="4" fill="#9a45b5" opacity=".8"/><circle cx="184" cy="116" r="3" fill="#9a45b5" opacity=".6"/><circle cx="176" cy="108" r="2.3" fill="#9a45b5" opacity=".5"/>`;
 if(m.trapped)over+=`<path d="M108,116 L192,200 M192,116 L108,200 M104,158 L196,158 M150,108 L150,208" stroke="#9b7a42" stroke-width="2.2" opacity=".85"/>`;
 if(m.blind)over+=`<image href="img/ico/flash.webp" x="108" y="78" width="20" height="20"/>`;
 if(m.exhausted)over+=`<path d="M146,${m.id==='brontal'?76:94} q-2,10 1,14" stroke="#7fd0ff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
 if(!g){if(PIMG.has(m.id))g=`<image href="img/mon/${m.id}.webp" x="70" y="76" width="160" height="160" preserveAspectRatio="xMidYMid meet" class="monimg"/>`;
  else g=`<path d="M150,196 C160,214 158,232 150,244 C142,232 140,214 150,196 Z" fill="${p.base}" ${ol}/><ellipse cx="122" cy="142" rx="9" ry="14" fill="${p.dark}" transform="rotate(-30 122 142)"/><ellipse cx="178" cy="142" rx="9" ry="14" fill="${p.dark}" transform="rotate(30 178 142)"/><ellipse cx="124" cy="186" rx="9" ry="14" fill="${p.dark}" transform="rotate(25 124 186)"/><ellipse cx="176" cy="186" rx="9" ry="14" fill="${p.dark}" transform="rotate(-25 176 186)"/><ellipse cx="150" cy="162" rx="30" ry="42" fill="${p.base}" ${ol}/><ellipse cx="150" cy="160" rx="16" ry="26" fill="${p.light}" opacity=".5"/><circle cx="150" cy="110" r="18" fill="${p.base}" ${ol}/><path d="M138,98 L134,86 L144,94 M162,98 L166,86 L156,94" fill="${p.acc}" ${ol}/><circle cx="143" cy="106" r="2.6" fill="${eyeC}"/><circle cx="157" cy="106" r="2.6" fill="${eyeC}"/>`;}
 const down=m.ko||m.trapped||m.topple;
 let tr='';if(m.flying)tr=' transform="translate(150 150) scale(1.1) translate(-150 -158)"';else if(down)tr=' transform="rotate(16 150 156)"';
 const sh=m.flying?`<ellipse cx="150" cy="172" rx="42" ry="58" fill="rgba(0,0,0,.2)"/>`:`<ellipse cx="150" cy="162" rx="36" ry="52" fill="rgba(0,0,0,.08)"/>`;
 const cls='mon'+(m.enraged?' rage':'')+(uid==='a'&&H&&H.fx.some(f=>f.t==='dmg'||f.t==='weak')?' hit':'')+(()=>{if(uid!=='a'||!H)return'';const f=H.fx.find(f=>f.t==='matk');if(!f)return'';return' lunge-'+(f.z==='avant'?'n':f.z==='arriere'?'s':f.side==='d'?'e':'w');})();
 return`${defs}<g class="${cls}" pointer-events="none">${sh}<g${tr}><g class="breathe">${g}</g></g>${over}</g>`;}

/* ---------- Portraits, habitats, icônes ---------- */
const SIMG={grakku:[m=>m.rock>0,'grakku_rocher'],boregor:[m=>m.burrow>0,'boregor_enfoui'],scoriak:[m=>m.harden>0,'scoriak_ardent'],fulgor:[m=>m.charged>0,'fulgor_surcharge'],ferroi:[m=>!!m.phase2,'ferroi_brise'],velyra:[m=>m.flying>0,'velyra_vol'],bombardier:[m=>m.flying>0,'bombardier_vol'],tempestaire:[m=>m.storm>0,'tempestaire_tempete'],abyssaure:[m=>m.eclipse>0,'abyssaure_eclipse'],herissaure:[m=>m.spikes>0,'herissaure_epines'],tranchelune:[m=>!!(H&&!H.over&&H.intent&&H.intent[0]&&H.intent[0].fx==='stance'),'tranchelune_posture'],sismorak:[m=>itNow('cabre'),'sismorak_cabre'],pyroclaste:[m=>itNow('arme'),'pyroclaste_arme'],devoreur:[m=>itNow('souffle'),'devoreur_souffle'],nacrelle:[m=>itNow('aspire'),'nacrelle_aspire'],gorgovire:[m=>m.enraged>0,'gorgovire_frenesie'],rapinoux:[m=>!!(m.loot&&m.loot.length),'rapinoux_larcin']};
function itNow(id){return!!(H&&!H.over&&H.intent&&H.intent.some(x=>x&&x.id===id));}
function preloadMon(id){try{const s=SIMG[id];if(s&&typeof Image!=='undefined'){const i=new Image();i.src='img/mon/'+s[1]+'.webp';}}catch(e){}}
const PIMG=new Set(['pantin','rapinoux','selenis','herissaure','nacrelle','sismorak','tranchelune','gorgovire','pyroclaste','abyssaure','grakku','brontal','velyra','glacimorde','scoriak','fulgor','boregor','ferroi','devoreur','bombardier','tempestaire']);
function portrait(id,cls=''){if(PIMG.has(id))return`<img class="portrait pimg ${cls}" src="img/mon/${id}.webp" alt="" draggable="false">`;const d=MON[id];const m={id,d,hp:1,max:1,parts:{tete:{broken:false},flanc:{broken:false},queue:{broken:false,severed:false}},enraged:0,charged:0,rock:0,ko:0,trapped:0,topple:0,flying:0,poisoned:0,blind:0,exhausted:0,prep:null};
 const vb=d.shape==='dragon'?'58 46 184 222':d.shape==='wyvern'?'56 56 188 200':d.shape==='bird'?'78 58 144 190':'80 54 140 196';
 return`<svg class="portrait ${cls}" viewBox="${vb}" aria-hidden="true">${monsterSVG(m,'p'+id+cls.replace(/\W/g,''))}</svg>`;}
const HAB={citadelle:{f:'#5a4a44',d:'#2e2622',rock:'#8a7a70'},col:{f:'#7c8a5a',d:'#5b6642',rock:'#8b8a80'},plaine:{f:'#b8924e',d:'#8a6a33',rock:'#7a5a3a'},foret:{f:'#3f6b3a',d:'#2a4a27',rock:'#5b4a33'},glace:{f:'#b9deef',d:'#7fb2cf',rock:'#e8f6fc'},crete:{f:'#56607a',d:'#394057',rock:'#7a8196'}};
const PANO=h=>`img/pano/${h}.webp`,SOL=h=>`img/sol/${h}.webp`;
function qHab(q){if(!q)return null;if(q.arena)return'arene';if(q.gather){const z=EXPZ.find(x=>x.id===q.zone);return z?z.habs[0]:null;}return MON[q.mon]?MON[q.mon].hab:null;}
function expHab(){const e=S.exp,z=expZone();if(!e||!z)return null;return z.habs[z.habs.length>1&&e.sec>=3?1:0];}
function huntHab(){if(!H)return null;if(H.q.arena)return'arene';if(H.q.explore&&S.exp)return expHab()||H.m.d.hab;return H.m.d.hab;}
function pano(h){return h?` style="--pano:url(’${PANO(h)}’)"`:'';}
function sceneOf(){try{switch(screen){case 'prep':return[qHab(QUESTS.find(x=>x.id===sub.quest)),'prep'];case 'arena':return['arene','prep'];case 'special':return['citadelle','page'];
 case 'explore':return S.exp?(S.exp.ko?['echec','prep']:[expHab(),'xp']):['expe','page'];case 'quests':return['quetes','page'];case 'forge':return['forge','page'];case 'craft':return['atelier','page'];case 'shop':return['boutique','page'];case 'equip':return['equip','page'];case 'palico':return['palico','page'];case 'training':return['arene','page'];case 'notes':return['carnet','page'];case 'result':return R?[R.kind==='fail'?'echec':'victoire','res']:null;case 'hunt':return H?[huntHab(),H.phase==='camp'?'camp':'hunt']:null;}}catch(e){}return null;}
function groundSVG(h){return`<defs><clipPath id="gclip"><circle cx="150" cy="150" r="89"/></clipPath><radialGradient id="gvig"><stop offset="58%" stop-color="var(--bg)" stop-opacity="0"/><stop offset="100%" stop-color="var(--bg)" stop-opacity=".7"/></radialGradient></defs><image class="gtex" href="${SOL(h)}" x="10" y="10" width="280" height="280" preserveAspectRatio="xMidYMid slice" clip-path="url(#gclip)"/><circle cx="150" cy="150" r="89" fill="url(#gvig)" pointer-events="none"/>`;}
const LCOL={selenis:'#a8b0e8',herissaure:'#d0a860',nacrelle:'#5ad0c8',sismorak:'#90a8c0',tranchelune:'#b8bcc8',gorgovire:'#8a5aa0',pyroclaste:'#b8e03a',rapinoux:'#c8783a',abyssaure:'#9a6ae0',tempestaire:'#9fc3e8',bombardier:'#e0662a',ferroi:'#8a93a3',fer:'#a3adb3',grakku:'#c9a06c',brontal:'#e8803f',velyra:'#a857c4',glacimorde:'#8fd4ee',scoriak:'#c4462a',boregor:'#dbe6f0',devoreur:'#6a7a44',fulgor:'#f2cd3a'};
function weaponIcon(type,lin='fer'){const lb=lin.replace(/[234]$/,''),c=lb==='fer'?'transparent':LCOL[lb]||'transparent',tr=(lin.match(/[234]$/)||[''])[0];return`<i class="wicon wimg" style="--wc:${c}"><img src="img/wpn/${type}.webp" alt="" draggable="false">${tr?`<em class="wtier">${['','','II','III','IV'][+tr]}</em>`:''}</i>`;}
const ICO=new Set(['soin','potion','mega','antidote','steak','grain','armure','flash','piege','baliste','tranq','mun_perf','mun_el','mun_som','fiole_p','fiole_v','herbe','champi','amere','miel','viande','piment','noix','insecte','toile','os','soporif','sphere','sphered','spherea','fer','ardente','boisdur','cristal','tonnerre','dracite','c_rod','c_brou','c_kel','c_pin','c_ping','c_volt','c_sal','c_lou','c_garg']);
function icoImg(id,cls){return`<img class="${cls} ico" src="img/ico/${id}.webp" alt="" draggable="false">`;}
function itemIcon(id,cls='iicon'){if(ICO.has(id))return icoImg(id,cls);return'';}
function spotIcon(k){const m={herb:'herbe',hive:'miel',bone:'os',bush:'noix',shroom:'champi',web:'toile',ice:'noix',bug:'insecte'};return itemIcon(m[k]||'herbe','iicon');}

/* ---------- Chasseur, Griffu et effets d'attaque dans l'arène ---------- */
function felyneSVG(x,y){const v0=(S.pal&&S.pal.voc)||'assaut';return`<image href="img/ui/cat_${v0}.webp" x="${(x-12).toFixed(1)}" y="${(y-12).toFixed(1)}" width="24" height="24"/>`;}
function hunterSVG(x,y,ang){const ly=H.zone==='arriere'?-17:24;const W=H.stats.w,w=H.w;let ring='';
 if(w.charge)ring=`<circle r="${w.charge===2?17:15}" fill="none" stroke="var(--brass)" stroke-width="${w.charge===2?3:2}" class="pulse"/>`;
 if(w.demon)ring=`<circle r="16" fill="none" stroke="#e8594a" stroke-width="2.5" class="pulse"/>`;
 if(W.type==='ig'&&w.air)ring=`<circle r="16" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="2 3" class="pulse"/>`;
 if(W.type==='sa'&&w.mode==='sword')ring=`<circle r="16" fill="none" stroke="#5aa0e8" stroke-width="2.5" class="pulse"/>`;
 if(W.type==='cb'&&w.shield>0)ring=`<circle r="16" fill="none" stroke="#d8342a" stroke-width="2.5" stroke-dasharray="4 2"/>`;
 if(H.fore)ring=`<circle r="16" fill="none" stroke="var(--acc)" stroke-width="2.5" stroke-dasharray="3 3"/>`;
 let shield='';if(H.guard){const a=ang+180;shield=`<path d="${arcD(a-40,a+40,17)}" stroke="#d8dde4" stroke-width="4" fill="none" stroke-linecap="round"/>`;}
 const cls='hunter'+(H.dodge?' roll':'')+(H.fx.some(f=>f.t==='hurt')?' ouch':'');
 return`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="${cls}">${ring}${shield}<image href="img/ui/hunter.webp" x="-14" y="-14" width="28" height="28"/>
 </g><text y="${ly}" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--you)" paint-order="stroke" stroke="var(--bg)" stroke-width="3">You</text></g>`;}
function arcD(a1,a2,r){const t1=a1*Math.PI/180,t2=a2*Math.PI/180;return`M${(r*Math.sin(t1)).toFixed(1)},${(-r*Math.cos(t1)).toFixed(1)} A${r},${r} 0 0 1 ${(r*Math.sin(t2)).toFixed(1)},${(-r*Math.cos(t2)).toFixed(1)}`;}
function elGlyph(el,x,y){const f={fire:'el_feu',ice:'el_glace',bolt:'el_foudre',poison:'st_poison'}[el];if(!f)return'';return`<image href="img/ui/${f}.webp" x="${(x-8).toFixed(1)}" y="${(y-8).toFixed(1)}" width="16" height="16"/>`;}
function vfxSVG(f,idx){const out=[];const secs=[];
 for(const z of f.zones){if(z==='flanc'){secs.push(90,270);}else secs.push(z==='avant'?0:180);}
 const d=(idx*.1).toFixed(2);
 for(const a of secs){
  if(f.el==='fire')for(const o of[-30,-15,0,15,30]){const[x,y]=pt(a+o,o%30?122:110);out.push(`<circle class="vfx fire" style="animation-delay:${(idx*.1+Math.abs(o)/200).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${o?17:21}" fill="url(#vf-fire)"/>`);}
  else if(f.el==='ice')for(const o of[-24,-6,14,30]){const[x,y]=pt(a+o,116);out.push(`<path class="vfx ice" style="animation-delay:${d}s" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a+o})" d="M0,-14 L5,4 L0,9 L-5,4 Z" fill="#dff6ff" stroke="#6fbfe0" stroke-width="1.2"/>`);}
  else if(f.el==='bolt'){const[x1,y1]=pt(a-30,96),[x2,y2]=pt(a-10,140),[x3,y3]=pt(a+8,100),[x4,y4]=pt(a+30,140);
   out.push(`<path class="vfx bolt" style="animation-delay:${d}s" d="M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} L${x4.toFixed(1)},${y4.toFixed(1)}" fill="none" stroke="#fff6a0" stroke-width="3.5" stroke-linejoin="round"/>`);}
  else if(f.el==='poison')for(const o of[-24,-4,18]){const[x,y]=pt(a+o,118);out.push(`<circle class="vfx poison" style="animation-delay:${d}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="#a857c4" fill-opacity=".55" stroke="#d8a0ee" stroke-width="1.2"/>`);}
  else if(f.el==='roar')out.push(`<path class="vfx roar" style="animation-delay:${d}s" transform="translate(150 150)" d="${arcD(a-38,a+38,100)}" fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".7"/>`);
  else out.push(`<path class="vfx phys" style="animation-delay:${d}s" transform="translate(150 150)" d="${arcD(a-36,a+36,116)}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`);}
 return out.join('');}
const VFX_DEFS=`<defs><radialGradient id="vf-fire"><stop offset="0" stop-color="#fff2a0"/><stop offset=".45" stop-color="#ff9a2a" stop-opacity=".9"/><stop offset="1" stop-color="#e03a1a" stop-opacity="0"/></radialGradient></defs>`;

/* ---------- Interface ---------- */
function go(s){screen=s;render();try{window.scrollTo(0,0);}catch(e){}}
const NPC_N="Hilda, Guild Master";
function npcSay(t){return`<div class="npcq"><img src="img/npc/guilde.webp" alt="" draggable="false"><div><b>${NPC_N}</b><p>“${esc(t)}”</p></div></div>`;}
const TESTMODE=(()=>{try{return!/github\.io$/.test(location.hostname)||/[?&]test\b/.test(location.search);}catch(e){return true;}})();
function saveCode(){const j=JSON.stringify(S);return btoa(unescape(encodeURIComponent(j)));}
function openExport(){const c=saveCode();modal(`<h2>Export save</h2><p class="small">Copy this code and keep it safe: it contains all your progress. Paste it into “Import” on another device, or if your browsing data gets cleared.</p><textarea class="savebox" readonly rows="6">${c}</textarea><div style="display:grid;gap:8px;margin-top:8px"><button class="btn main wide" data-a="savecopy">Copy code</button><button class="btn wide" data-a="savedl">Download a file</button><button class="btn wide" data-a="close">Close</button></div>`);}
function openImport(msg){modal(`<h2>Import a save</h2><p class="small">Paste the code of an exported save. <b>Warning:</b> it will replace your current progress.</p>${msg?`<p class="small" style="color:var(--danger)">${esc(msg)}</p>`:''}<textarea class="savebox" id="impbox" rows="6" placeholder="Paste the code here"></textarea><label class="small" style="display:block;margin:6px 0">or a file: <input type="file" id="impfile" accept=".txt,text/plain"></label><div style="display:grid;gap:8px;margin-top:8px"><button class="btn main wide" data-a="saveimpgo">Import</button><button class="btn wide" data-a="close">Cancel</button></div>`);
 setTimeout(()=>{const f=document.getElementById('impfile');if(f)f.onchange=()=>{const r=new FileReader();r.onload=()=>{document.getElementById('impbox').value=String(r.result).trim();};if(f.files[0])r.readAsText(f.files[0]);};},0);}
function doImport(code){try{const j=JSON.parse(decodeURIComponent(escape(atob(code.trim()))));if(!j||typeof j!=='object'||!j.equip||!j.cleared)throw 0;localStorage.setItem(KEY,JSON.stringify(j));try{localStorage.removeItem(HKEY);}catch(e){}S=loadSave();H=null;R=null;closeModal();go('village');modal(`<h2>Save imported</h2><p class="small">Welcome back, hunter! Your progress has been restored.</p><button class="btn main wide" data-a="close">Got it</button>`);}catch(e){openImport("Invalid code: make sure it’s complete.");}}
/* ---------- Tutoriel guidé (Hilda) ---------- */
const TUT=[
 {scr:['village'],sel:'.board',t:"Welcome to Brume-Haute, hunter! I’m Hilda, I run the Guild. Let’s start with a real hunt: open the Quest Board.",done:()=>screen==='quests'||tutQ1()},
 {scr:['quests'],sel:'[data-a="quest"][data-v="q1"]',t:"A Grakku is raiding the nests on the pass: perfect game for a beginner. Tap its quest.",done:()=>(screen==='prep'&&sub.quest==='q1')||tutQ1()},
 {scr:['prep'],sel:'[data-a="depart"]',t:"This is where you prepare for the hunt: weapon, Griffu, a meal at the Canteen. Your Iron Great Sword will do against it. Head out when you’re ready.",done:()=>tutQ1()},
 {scr:['hunt'],sel:'[data-a="engage"][data-v="flanc:g"]',top:1,t:"Here you are at camp: the Grakku hasn’t seen you yet. You can gather around the camp (1 turn per spot). Then approach it from the flank or rear: you’ll strike first, with +30% on your first hit.",done:()=>(!!H&&H.q.id==='q1'&&H.phase!=='camp')||!!S.cleared.q1},
 {scr:['hunt'],top:1,btn:"Got it",t:"Each turn, the banner below the arena announces the monster’s attack, and the targeted zones light up red. You always act before it: if you’re in the red, dodge or change zones; otherwise, strike!",done:()=>!H&&!!S.cleared.q1},
 {scr:['hunt'],top:1,btn:"Got it",t:"The number on each attack is its estimated damage. Your weapon dulls with every hit: sharpen it when the sharpness gauge runs low. Your potions are under “Items”. The Grakku shields its head with a rock: aim elsewhere while it holds it.",done:()=>!H&&!!S.cleared.q1},
 {scr:['village','result','quests','prep'],t:()=>S.cleared.q1?"Well done, your first catch! Its materials are waiting for you. Head back to the village and open the Forge.":"No luck this time. Go back to the Quest Board and try the Grakku again: read the attack banner carefully.",sel:()=>S.cleared.q1?(screen==='village'?'[data-a="go"][data-v="forge"]':'[data-a="home"]'):(screen==='village'?'.board':null),done:()=>S.cleared.q1&&screen==='forge'},
 {scr:['forge'],btn:"Got it",t:"Each monster has its own weapon tree and armor. Tap a weapon to see what’s missing; armor pieces grant skills that stack with one another. Jewels go into slots.",done:()=>false},
 {scr:['village','forge'],btn:"Finish",t:"You still have your Griffu, the Workshop (potions, traps), the Free Expedition and the Arena to discover. The Hunter’s Guide in the village sums it all up. Good hunting, and come back to me in one piece!",done:()=>false}];
function tutQ1(){return(!!H&&H.q.id==='q1')||!!S.cleared.q1;}
const TUT_AWAY={village:"return to the village",quests:"open the Quest Board",prep:"open the Grakku quest",hunt:"resume the Grakku hunt",forge:"open the forge"};
function tutStep(){return S.tut==null?null:TUT[S.tut]||null;}
function tutAdvance(){if(S.tut==null)return;S.tut++;if(S.tut>=TUT.length){S.tut=null;}save();}
function tutRender(){try{tutRender0();}catch(e){}}
function tutRender0(){const old=document.getElementById('tutbox');if(old)old.remove();document.body.classList.remove('tuton');document.querySelectorAll('.tuthl').forEach(e=>e.classList.remove('tuthl'));
 let st=tutStep();let guard=0;while(st&&st.done()&&guard++<10){tutAdvance();st=tutStep();}
 if(!st)return;const away=!st.scr.includes(screen)&&!(screen==='hunt'&&H&&H.q.id!=='q1'&&false);
 if(away&&screen==='hunt')return;
 const t=away?`The tutorial is waiting: ${TUT_AWAY[st.scr[0]]||"return to the village"}. Take your time, there’s no rush.`:typeof st.t==='function'?st.t():st.t;const sel=typeof st.sel==='function'?st.sel():st.sel;
 if(sel&&!away){const el=document.querySelector(sel);if(el){el.classList.add('tuthl');const r=el.getBoundingClientRect();if(r.bottom>innerHeight-170||r.top<0)try{el.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}}}
 const d=document.createElement('div');d.id='tutbox';d.className='tutbox'+(st.top&&!away?' top':'')+(away?' away':'');
 d.innerHTML=`<img src="img/npc/guilde.webp" alt=""><div><b>${NPC_N}</b><p>${esc(t)}</p><span class="tutbtns">${st.btn&&!away?`<button class="btn sm main" data-a="tutnext">${st.btn}</button>`:''}<button class="linkbtn" data-a="tutskip">Skip tutorial</button></span></div>`;
 document.body.appendChild(d);if(!st.top||away)document.body.classList.add('tuton');}
function tutWelcome(){modal(`<div class="urgpop">${npcSay("Welcome to Brume-Haute! Monsters are swarming around the pass, and the Guild is short-handed. Shall I show you the ropes?")}</div><div style="display:grid;gap:8px"><button class="btn main wide" data-a="tutstart">Yes, guide me</button><button class="btn wide" data-a="tutno">I already know the trade</button></div>`);}
function checkUrgent(){if(screen!=='village'||SPLASH||$('#modal').innerHTML.trim())return;if(S.tut===undefined){if(Object.keys(S.cleared).length){S.tut=null;save();}else{tutWelcome();return;}}if(S.tut!=null&&S.tut<7)return;if(S.tut==null&&S.patch!==PATCHES[0].v){openPatch();return;}S.urgSeen=S.urgSeen||[];
 const q=QUESTS.find(q=>q.urgent&&q.tier>0&&!S.cleared[q.id]&&!S.urgSeen.includes(q.id)&&unlocked(q));if(!q)return;
 S.urgSeen.push(q.id);save();sfx('roar');
 modal(`<div class="urgpop"><span class="urgtag">⚠️ Urgent quest</span>${npcSay("Hunter, the Guild needs you, and fast. You’ve proven yourself: I wouldn’t trust this one to anyone else.")}${portrait(q.mon,(S.mon[q.mon]&&S.mon[q.mon].seen)?eCls(q):'unk')}<h2>${esc(q.title)}</h2><p class="small">${esc(q.d||'')}</p><p class="small muted">${STAGE_N[q.tier]} · ${q.turns} turns · ${q.z} z reward. Clear it to reach the next rank.</p></div><div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Later</button><button class="btn main wide" data-a="urg-go" data-v="${q.id}">Prepare the hunt</button></div>`);}
function bar(v,max,c){return`<div class="bar ${c}"><i style="width:${clamp(v/max*100,0,100)}%"></i></div>`;}
function sharpBar(arr,cur){let acc=0;return`<div class="sharp">${arr.map((n,i)=>{if(!n)return'';const s=acc;acc+=n;const f=clamp(cur-s,0,n)/n*100;
 return`<span style="flex:${n};background:linear-gradient(90deg,${SHARP[i].c} ${f}%,color-mix(in srgb,${SHARP[i].c} 22%,transparent) ${f}%)"></span>`;}).join('')}</div>`;}
function wStats(w){let s=`Attack ${w.atk}`;if(w.var)s+=` · ${varName(w)}`;if(w.elem)s+=`, ${elIcon(w.elem)} ${ELEM[w.elem].n} ${w.ev}`;if(w.stat)s+=`, ☠️ Poison ${w.sv}`;if(w.aff)s+=`, affinity ${w.aff>0?'+':''}${w.aff}%`;return s;}
function pips(v,max){return`<span class="pips2">${Array.from({length:max},(_,i)=>`<i class="${i<v?'on':''}${i>=max?' over':''}"></i>`).join('')}</span>`;}
function ptsText(p){return Object.keys(p).map(k=>`${SKILLS[k].n} +${p[k]}`).join(', ');}
function ptsChips(p,diff){const ks=Object.keys(p);if(!ks.length)return"<span class=\"nochip\">No skills</span>";return ks.map(k=>`<span class="kchip" title="${esc(skEffect(k,p[k]))}">${SKILLS[k].n} <b>${p[k]}</b></span>`).join('');}
function itemPts(a){const p=Object.assign({},a.pts);for(const jid of sockOf(a.id)){const j=jid&&JEWELS.find(x=>x.id===jid);if(j)p[j.sk]=(p[j.sk]||0)+(j.pts||1);}return p;}
function sgIcon(s,f,cls=''){return`<img class="sg gem${f?' f':''} ${cls}" src="img/ui/gem${s}.webp" alt="Size ${s} slot${f?", busy":", empty"}" title="Size ${s} slot" draggable="false">`;}
function slotGlyphs(sl,filled){return sl.map((s,i)=>sgIcon(s,filled&&filled[i])).join('');}
function skillTags(st){const t=Object.keys(st.raw).filter(k=>st.raw[k]>0).map(k=>`<span class="tag" title="${esc(SKILLS[k].d)}">${SKILLS[k].n} ${Math.min(st.raw[k],SKILLS[k].max)}/${SKILLS[k].max}</span>`);return t.length?t.join(''):"<span class=\"muted small\">No skills</span>";}
function backBtn(to='village',label="Village"){return`<div class="back"><button class="btn ghost sm" data-a="go" data-v="${to}">‹ ${label}</button></div>`;}
function stars(v){return v>=1?'★★★':v>=.5?'★★':v>=.25?'★':'✕';}
function hzStars(v){return v>=70?'★★★':v>=55?'★★':v>=40?'★':'·';}

function render(){const app=$('#app');if(!app)return;let h='';if(screen==='village')setTimeout(checkUrgent,0);setTimeout(tutRender,0);
 try{switch(screen){case 'village':h=vVillage();break;case 'quests':h=vQuests();break;case 'prep':h=vPrep();break;case 'hunt':h=vHunt();break;
  case 'result':h=vResult();break;case 'forge':h=vForge();break;case 'equip':h=vEquip();break;case 'shop':h=vShop();break;case 'craft':h=vCraft();break;case 'explore':h=vExplore();break;case 'arena':h=vArena();break;case 'special':h=vSpecial();break;case 'palico':h=vPalico();break;case 'notes':h=vNotes();break;case 'training':h=vTraining();break;}}
 catch(e){h=`<p>Display error: ${esc(e.message)}</p><button class="btn" data-a="go" data-v="village">Back to the village</button>`;}
 app.innerHTML=h;try{const sc=sceneOf();app.classList.toggle('scened',!!(sc&&sc[0]));if(sc&&sc[0]){app.style.setProperty('--scene',`url('${PANO(sc[0])}')`);app.dataset.sc=sc[1];if(sc[1]==='page'){const bk=app.querySelector(':scope>.back');if(bk&&!(bk.nextElementSibling&&bk.nextElementSibling.classList.contains('scenegap')))bk.insertAdjacentHTML('afterend','<div class="scenegap"></div>');}}else{app.style.removeProperty('--scene');delete app.dataset.sc;}}catch(e){}if(screen==='hunt'&&H&&H.faintPop&&!H.over){const f=H.faintPop;H.faintPop=null;setTimeout(()=>faintModal(f),350);}try{document.body.classList.toggle('hunting',screen==='hunt'&&!!H&&H.phase!=='camp');}catch(e){}if(screen==='hunt')afterHunt();audSync();}

function vVillage(){const st=computeStats(),W=st.w;const next=QUESTS.filter(q=>q.tier>0&&!S.cleared[q.id]&&unlocked(q)).sort((a,b)=>(a.urgent-b.urgent)||(a.stars-b.stars))[0];
 return`<header class="hero"><div class="heroimg" role="img" aria-label="The village of Brume-Haute at the foot of the mountains, watched by monsters"></div><div class="herotxt"><div class="titlebox"><img class="emblem" src="img/ui/emblem.webp" alt=""><h1 class="title"><small>The Hunters of</small>Brume-Haute</h1></div><p class="muted" style="margin:0">The Guild outpost at the foot of the pass, watched by monsters</p>
 <div class="purse"><span>${S.zenny} z</span><span>${hrLabel()}</span>${soundBtn()}</div></div></header>
 <button class="board" data-a="go" data-v="quests"><span class="pin"></span><span class="bt">Quest Board</span>
 <span class="bd">${next?`${next.urgent?"Urgent quest":"Next quest"}: ${esc(next.title)}${(()=>{const n=QUESTS.filter(q=>q.tier>0&&!S.cleared[q.id]&&unlocked(q)).length;return n>1?` (and ${n-1} other${n>2?'s':''})`:'';})()}`:"All quests complete. The Arena awaits whenever you need materials."}</span></button>
 ${(()=>{const n=QUESTS.filter(q=>q.arena&&arenaOk(q)).length;return`<button class="board aboard${n?'':' off'}" data-a="go" data-v="arena"><span class="at"><span class="bt">Arena</span><span class="bd">${n?"Rematch defeated monsters for their materials.":"Clear a quest to rematch its monster here."}</span></span></button>`;})()}
 <button class="board xboard" data-a="go" data-v="explore"><span class="bt">Free Expedition</span>
 <span class="bd">${S.exp?`In progress: ${esc(expZone().n)}, ${S.exp.max-S.exp.h} h until nightfall${S.exp.enc?'. A monster awaits you!':''}`:"Gather ore and hides, take down small monsters… and beware the big one."}</span></button>
 ${(()=>{const n=QUESTS.filter(q=>q.sp&&unlocked(q)).length;return`<button class="board sboard${n?'':' off'}" data-a="go" data-v="special"><span class="bt">Special Fights</span><span class="bd">${n?`${n} fight${n!==1?'s':''} to replay: double hunts and special-mechanic battles.`:"Clear a double hunt or the Iron King’s assault to replay them here."}</span></button>`;})()}
 <div class="loadout"><div><span>Weapon</span><b class="wline">${weaponIcon(W.type,W.lin.id)}${esc(W.name)}</b><span>${wStats(W)}</span></div><div><span>Armor</span><b>Defense ${st.def}</b><span>${Object.keys(st.raw).filter(k=>st.raw[k]).map(k=>SKILLS[k].n).join(', ')||"No skills"}</span></div></div>
 <nav class="menu">
 <button data-a="go" data-v="equip"><b>Equipment</b><span>Change weapon and armor, slot jewels, review skills</span></button>
 <button data-a="go" data-v="palico" class="palmenu">${palSVG('palmini')}<span><b>${esc(palS().name)}, your Griffu</b><span>Level ${palS().lv} · ${PAL_VOC[palS().voc].n} · gear, calling and skills</span></span></button>
 <button data-a="go" data-v="forge"><b>Forge${(()=>{const n=craftables().length;return n?` <i class="badge">${n} to forge</i>`:'';})()}</b><span>Forge weapons and armor from monster materials</span></button>
 <button data-a="go" data-v="craft"><b>Workshop${(()=>{const n=RECIPES.filter(canCraft).length;return n?` <i class="badge">${n} recipe${n!==1?'s':''} ready</i>`:'';})()}</b><span>Craft potions, bombs and traps from your gathered materials</span></button>
 <button data-a="go" data-v="shop"><b>Shop</b><span>Potions and antidotes, sell materials</span></button>
 <button data-a="go" data-v="notes"><b>Hunting Journal</b><span>Weaknesses and weak spots of the monsters you’ve hunted</span></button>
 <button data-a="go" data-v="training"><b>Training Grounds</b><span>Try every weapon on a dummy that never fights back</span></button>
 <button data-a="guide"><b>Hunter’s Guide</b><span>How a fight plays out</span></button></nav>
 <p class="foot muted small">Progress saved on this device. <button class="linkbtn" data-a="saveexp">Export</button> · <button class="linkbtn" data-a="saveimp">Import</button> · <button class="linkbtn" data-a="reset">Start over</button> · <button class="linkbtn" data-a="patches">Patch notes</button> · <button class="linkbtn" data-a="lang" data-v="${LANG==='en'?'fr':'en'}">${LANG_NAME[LANG==='en'?'fr':'en']}</button>${TESTMODE?" · <button class=\"linkbtn\" data-a=\"testmode\">Test mode</button>":''}</p>`;}

function qCard(q){const un=unlocked(q);
 if(q.gather){const z=EXPZ.find(x=>x.id===q.zone);return`<button class="qcard qgather pcard ${un?'':'locked'}"${pano(qHab(q))} data-a="${un?'gquest':'noop'}" data-v="${q.id}"><span class="gicon">${itemIcon(q.goal.k,'iicon')}</span><div class="qtxt"><span class="stars">${qStars(q)} <i class="gtag">Gathering</i></span><b>${esc(q.title)}</b>
  <span class="muted small">${esc(z.n)} · bring back ${RES[q.goal.k].n} ×${q.goal.n} within ${q.hours} h · ${q.z} z</span></div></button>`;}
 const ob=objGot(q);const seen=S.mon[q.mon]&&S.mon[q.mon].seen;
 return`<button class="qcard pcard ${un?'':'locked'}${q.elite?' qelite':''}${q.anc?' qanc':''}${q.urgent?' qurg':''}"${pano(qHab(q))} data-a="${un?'quest':'noop'}" data-v="${q.id}">${q.duo?`<span class="duop">${portrait(q.mon,seen?eCls(q):'unk')}${portrait(q.duo,S.mon[q.duo]&&S.mon[q.duo].seen?eCls(q):'unk')}</span>`:portrait(q.mon,seen?eCls(q):'unk')}<div class="qtxt"><span class="stars">${qStars(q)}${q.urgent?" <i class=\"urg\">Urgent quest</i>":''}${q.capture?" <i class=\"gtag\">Capture</i>":''}${q.duo?" <i class=\"gtag duo\">Double hunt</i>":''}${q.opt?" <i class=\"gtag opt\">Optional</i>":''}</span><b>${esc(q.title)}</b>
 <span class="muted small">${un?`Target: ${qName(q)}. ${q.turns} turns, ${q.z} z reward.`:esc(lockText(q))}</span>
 ${un&&q.obj.length?`<span class="objs">${q.obj.map(o=>`<i class="${ob.includes(o.id)?'ok':''}">${ob.includes(o.id)?'✓':'○'} ${esc(o.n)}</i>`).join('')}</span>`:''}</div></button>`;}
function vQuests(){const cur=hr();let h='';
 for(let t=1;t<=9;t++){const L=tierQ(t),left=L.filter(q=>!S.cleared[q.id]),open=stageOpen(t),done=!left.length;
  if(t===7&&!mrOpen()){h+=`<h2 class="rsh">Master Rank</h2><p class="small muted" style="margin:0 0 6px">Defeat the Tempestar to unlock Master Rank.</p>`;break;}
  if(t===7)h+=`<h2 class="rsh">Master Rank</h2>`;if(t===4)h+=`<h2 class="rsh">High Rank</h2>`;if(t===1)h+=`<h2 class="rsh">Low Rank</h2>`;
  const lab=STAGE_N[t].replace(/^(Low|High|Master) Rank /,'');
  h+=`<div class="rankh${t===cur&&!done?' cur':''}"><h3>${lab}</h3><span class="small ${done?'ok':'muted'}">${L.length-left.length}/${L.length}${done?' ✓':''}</span></div>`;
  if(done)h+=`<p class="small muted" style="margin:0 0 6px">All quests complete. Rematch defeated monsters in the Arena.</p>`;
  else if(!open)h+=`<p class="small muted" style="margin:0 0 6px">${stageOpen(t-1)?`Complete every ${STAGE_N[t-1].replace("Rank ",'Rank ')} quest to unlock it.`:"Locked."}</p>`;
  else{const keys=left.filter(q=>!q.urgent),urg=left.filter(q=>q.urgent&&unlocked(q)),hid=left.some(q=>q.urgent&&!unlocked(q));
   h+=`${t===cur?`<p class="small muted" style="margin:0 0 8px">${hid?"Complete the key quests: the Guild will then entrust you with an urgent mission.":urg.length?"The urgent quest will take you to the next rank.":"Complete the key quests."} Completed quests leave the board.</p>`:''}<div class="qlist">${keys.filter(q=>!q.opt).map(qCard).join('')}${urg.map(qCard).join('')}${keys.filter(q=>q.opt).map(qCard).join('')}</div>`;}}
 return backBtn()+`<h2>Quest Board</h2>${h}`;}
function vSpecial(){const L=QUESTS.filter(q=>q.sp),ok=L.filter(unlocked);const duo=ok.filter(q=>q.duo),iron=ok.filter(q=>!q.duo),lk=L.length-ok.length;
 const opt=q=>{const got=objGot(q),left=q.obj.filter(o=>!got.includes(o.id)).length;return`<button class="aopt${q.anc?' aanc':q.elite?' ael':''}" data-a="quest" data-v="${q.id}"><b>${q.anc?"Ancestral":q.elite?"Veteran":"Normal"}</b><small>${q.turns} turns · ${q.z} z</small><small class="${left?'':'ok'}">${q.obj.length?(left?`${left} bonus objective${left!==1?'s':''} left`:"✓ bonuses done"):''}</small></button>`;};
 return backBtn()+`<div class="scenegap"></div><h2>Special Fights</h2><p class="small muted" style="margin-top:0">Replay the extraordinary fights you’ve already won on the Quest Board, in their original zone: double hunts and special-mechanic battles. Usual preparation and canteen, normal loot, reduced reward. Bonus objectives you’ve already completed no longer pay out.</p>
 ${iron.length?`<h3>Special mechanics</h3><div class="qlist"><div class="qcard acard pcard"${pano(qHab(iron[0]))}>${portrait('ferroi',iron.some(q=>q.anc)?'elite anc':iron.some(q=>q.elite)?'elite':'')}<div class="qtxt"><b>The Iron King at the ballista</b><span class="muted small">The assault on the Citadel, with 3 ballista bolts on the ramparts.</span><div class="aopts">${iron.map(opt).join('')}</div></div></div></div>`:''}
 ${duo.length?`<h3>Double hunts</h3><div class="qlist">${duo.map(qCard).join('')}</div>`:''}
 ${!ok.length?"<p class=\"small muted\">No special fights yet. Clear a double hunt or the Iron King’s assault on the Quest Board: they’ll show up here, ready to replay.</p>":lk?`<p class="small muted">${lk} more fight${lk!==1?'s':''} to unlock on the Quest Board.</p>`:''}`;}
function vArena(){const L=QUESTS.filter(q=>q.arena);const ok=L.filter(arenaOk);
 return backBtn()+`<div class="scenegap"></div><h2>Arena</h2><p class="small muted" style="margin-top:0">Rematch monsters you’ve already defeated for their materials. Usual preparation and canteen, no gathering, reduced reward. The original quest’s bonus objectives can still be completed here; each pays out only once. Veteran versions are added once defeated in High Rank, ancestral ones in Master Rank.</p>
 ${ok.length?`<div class="qlist">${MON_ORDER.map(m=>{const n=ok.find(q=>q.mon===m&&!q.elite),e=ok.find(q=>q.mon===m&&q.elite&&!q.anc),a=ok.find(q=>q.mon===m&&q.anc);if(!n&&!e&&!a)return'';const b=n||e||a;
  const opt=q=>{const got=objGot(q),left=q.obj.filter(o=>!got.includes(o.id)).length;return`<button class="aopt${q.anc?' aanc':q.elite?' ael':''}" data-a="quest" data-v="${q.id}"><b>${q.anc?(MON[q.mon].mrOnly?"Master Rank":FEM[q.mon]?"Ancestral":"Ancestral"):q.elite?"Veteran":"Normal"}</b><small>${q.turns} turns · ${q.z} z</small><small class="${left?'':'ok'}">${q.obj.length?(left?`${left} bonus objective${left!==1?'s':''} left`:"✓ bonuses done"):''}</small></button>`;};
  return`<div class="qcard acard pcard"${pano('arene')}>${portrait(m,a?'elite anc':e?'elite':'')}<div class="qtxt"><b>${esc(MON[m].name)}</b><div class="aopts">${n?opt(n):''}${e?opt(e):''}${a?opt(a):''}</div></div></div>`;}).join('')}</div>`:"<p class=\"small muted\">No monsters defeated yet.</p>"}`;}
function vPrep(){const q=QUESTS.find(x=>x.id===sub.quest);const meal=MEALS.find(x=>x.id===sub.meal)||MEALS[0];const st=computeStats(meal),W=st.w;
 const pouch=ITEM_ORDER.filter(k=>!ITEMS[k].sup&&S.items[k]>0).map(k=>`<span class="tag">${itemIcon(k,'iicon sm')}${ITEMS[k].n} ×${Math.min(S.items[k],ITEMS[k].carry)}</span>`).join('')||"<span class=\"muted small\">Pouch empty: visit the Shop or the Workshop.</span>";
 const ob=objGot(q);
 return backBtn(q.arena?'arena':q.sp?'special':'quests',q.arena?"Arena":q.sp?"Special Fights":"Quests")+`<div class="scenegap"></div><div class="prephead">${q.duo?`<span class="duop">${portrait(q.mon,eCls(q))}${portrait(q.duo,eCls(q))}</span>`:portrait(q.mon,eCls(q))}<div><span class="star">${q.arena?(q.anc?"Master Rank":q.elite?"High Rank":"Low Rank"):q.sp?`Special fight ${qStars(q)}`:qStars(q)}${q.urgent?" <i class=\"urg\">Urgent quest</i>":''}</span><h2>${esc(q.title)}</h2></div></div><p>${esc(q.d)}</p>
 ${q.capture?`<p class="small" style="color:var(--danger)">Capture quest: killing the monster fails the quest.${capBlock(q)?` You need at least 1 pitfall trap and 2 tranq bombs to depart (you have ${S.items.piege||0} trap and ${S.items.tranq||0} bomb${(S.items.tranq||0)>1?'s':''}). Craft them at the Workshop.`:" You’re bringing your trap and tranq bombs."}</p>${capBlock(q)?"<button class=\"btn wide\" data-a=\"go\" data-v=\"craft\">Go to the Workshop</button>":''}`:''}
 ${q.obj.length?`<h3>Bonus objectives</h3><div class="objs big">${q.obj.map(o=>`<i class="${ob.includes(o.id)?'ok':''}">${ob.includes(o.id)?'✓':'○'} ${esc(o.n)}</i>`).join('')}</div><p class="small muted" style="margin-top:4px">Each objective completed for the first time: +25% reward and an extra prize.</p>`:''}
 ${q.duo?`<p class="small" style="color:var(--danger)">Double hunt: ${esc(monLabel(q.mon,q.elite,q.anc))}, then ${esc(monLabel(q.duo,q.elite,q.anc))} as soon as the first one falls. Turns, HP, stamina and items carry over from one target to the next. You collect loot from both.</p>`:''}${q.opt?"<p class=\"small muted\">Optional quest: not required to reach the next rank.</p>":''}
 <p class="small muted">Limit: ${q.turns} turns. You fail after 3 faints. Reward: ${q.z} z.</p>
 <h3>Your equipment</h3><div class="row"><div class="top"><span><b class="wline">${weaponIcon(W.type,W.lin.id)}${esc(W.name)}</b><br><span class="small muted">${wStats(W)}</span></span><button class="btn sm" data-a="equipfrom">Change</button></div>
 <div class="skl"><span class="tag">Defense ${st.def}</span><span class="tag">HP ${st.hp}</span><span class="tag">Stamina ${st.st}</span>${skillTags(st)}</div></div>
 <div class="row"><div class="top"><span class="iline">${palSVG('palmini')}<span><b>${esc(palS().name)}</b><span class="small muted">Lv. ${palS().lv} · ${PAL_VOC[palS().voc].n} · ${esc(palStats().w.n)}</span></span></span><button class="btn sm" data-a="palfrom">Change</button></div></div>
 <h3>Canteen</h3><div class="meals">${MEALS.map(x=>`<button class="meal ${x.id===meal.id?'on':''}" data-a="meal" data-v="${x.id}" ${S.zenny<x.p?'disabled':''}><div><b>${x.n}</b><span>${x.d}</span></div><b>${x.p?x.p+' z':''}</b></button>`).join('')}</div>
 <p class="small muted">A meal may awaken a random canteen skill (on top of your Griffu’s).</p>
 <h3>Pouch</h3><div class="skl">${pouch}</div><p class="small muted">${q.arena?"The Guild adds 2 First-aid kits. No gathering in the Arena: get ready, then choose how to approach the monster.":"The Guild adds 2 First-aid kits. You’ll start at base camp: get ready, gather, then choose how to approach the monster."}</p>
 <div style="margin-top:16px"><button class="btn main wide" data-a="depart" ${S.zenny<meal.p||capBlock(q)?'disabled':''}>Start the hunt${meal.p?` (${meal.p} z)`:''}</button></div>`;}

function vTraining(){const W=getWeapon(S.equip.weapon),st=computeStats();
 return backBtn()+`<h2>Training Grounds</h2><p class="small muted" style="margin-top:0">A Guild dummy that never fights back. Each weapon is tried in its iron version, with Hunter armor, to learn its mechanics; a card explains them when you arrive. Unlimited items, no rewards, and your equipment is never changed.</p>
 <div class="qlist"><div class="qcard tcardw tcur"><span class="gicon">${weaponIcon(W.type,W.lin.id)}</span><div class="qtxt"><b>With your equipment</b><span class="small muted">Test your current gear: ${esc(W.name)}, defense ${st.def}, jewels and skills included. Ideal for comparing builds.</span><button class="btn sm go" data-a="train" data-v="cur" style="margin-top:6px;align-self:flex-start">Train</button></div></div>
 ${WT_ORDER.map(t=>{const w=getWeapon(t+':fer');
  return`<div class="qcard tcardw"><span class="gicon">${weaponIcon(t,'fer')}</span><div class="qtxt"><b>${WT[t].n}</b>${wtRatings(t)}<span class="small muted">${esc(WT[t].d)}</span><span class="wttip">💡 ${esc(WT_TIP[t])}</span><span class="small">${esc(w.name)} · Hunter armor</span><button class="btn sm go" data-a="train" data-v="${t}" style="margin-top:6px;align-self:flex-start">Train</button></div></div>`;}).join('')}</div>`;}
function trainHelp(){if(!H)return;const W=H.stats.w,T=W.type,A=getActions();
 const rows=A.map(a=>{const[,long]=actInfo(a);return`<li><b>${esc(a.label)}</b> : ${esc(long||a.sub||'')}</li>`;}).join('');
 const extra=WT[T].ranged?"<li><b>Aim</b>: below your gauges, pick the head, arms or back, without losing a turn. The stars show effectiveness.</li><li><b>Range</b>: the arena’s outer ring is range, the inner ring is melee. In a real fight, melee attacks can’t reach you from afar, but charges, breath attacks and projectiles can. A monster that closes in pulls you back inside: only “Back off” puts you at range again.</li>"
  :"<li><b>Zones</b>: you hit the part in your zone (front: head, flank: arms, rear: back). Tap an arena zone to move there (1 turn).</li><li><b>Sharpness</b>: it drops with every hit; low sharpness makes your attacks bounce off hard parts.</li>";
 const modes=T==='sa'?"<li><b>Two modes</b>: “Morph” switches form while striking. Axe: slash (+10 gauge), wild swings (+20). Sword: sword slash (−12 gauge, boosted by the phial) and Element discharge (empties the gauge).</li>":T==='ig'?"<li><b>Extracts</b>: the beetle gathers extract from the part in your zone (10 turns). Head: red, arms: white, back: orange; all three give the Triple extract. Their dots light up below your gauges.</li><li><b>Leap</b>: a cheaper dodge that launches you into the air; Aerial attack then appears on the next turn.</li>":T==='cb'?"<li><b>Two modes</b>: “Morph” switches form while striking. Sword: slashes (+34 energy), guard (+25 energy if it blocks), charge the phials, then the shield. Axe: Discharge (1 phial) and Ultimate discharge (all of them).</li>":'';
 const vli=W.var?`<li><b>${esc(varName(W))}</b>: ${esc(VARD[T][W.var])} Each Forge tree has its own variant.</li>`:'';
 modal(`<h2>Training: ${esc(WT[T].n)}</h2><p class="small muted" style="margin:0">${H.tr&&H.tr.basic?`${esc(W.name)}, Hunter armor.`:`Your equipment: ${esc(W.name)}, defense ${H.stats.def}.`}</p><p>${esc(WT[T].d)}</p>${wtRatings(T)}<h3 class="mini">Your actions</h3><ul class="small">${rows}${modes}${vli}${extra}<li><b>Items</b>: unlimited here. Press and hold a button to see its details again.</li></ul>
 <p class="small muted">The counter under the dummy’s name shows your total damage, your average per turn and your best hit.</p><button class="btn main wide" data-a="close">Got it</button>`);}
function vTalents(){const st=computeStats();const f=sub.tfilter||'';
 const srcs=k=>{const pieces=[];for(const set of SETS)set.p.forEach((p,i)=>{if(p[k]){const id=SLOTS[i].id+':'+set.id,seen=!set.mon||(S.mon[set.mon]&&S.mon[set.mon].seen);pieces.push({id,own:S.armors.includes(id),seen,t:seen?`${set.name} ${SLOTS[i].n}`:"Unknown piece",n:p[k]});}});
  const jw=JEWELS.filter(j=>j.sk===k).map(j=>({j,own:(S.jewels[j.id]||0)>0,seen:S.mon[j.mon]&&S.mon[j.mon].seen}));return{pieces,jw};};
 const list=SK_ORDER.filter(k=>!f||(f==='act'?st.raw[k]>0:true)).map(k=>{const s=SKILLS[k],lv=Math.min(st.raw[k],s.max),{pieces,jw}=srcs(k),open=sub.topen===k;
  const lvls=Array.from({length:s.max},(_,i)=>`<li class="${i<lv?'on':''}"><b>Lv. ${i+1}</b> ${esc(skEffect(k,i+1))}</li>`).join('');
  return`<div class="tcard ${lv?'lit':''} ${skUseless(k,st.w.type)?'na':''}"><button class="thead" data-a="topen" data-v="${k}"><span><b>${s.n}</b><small>${esc(lv?skEffect(k,lv):skEffect(k,1))}</small></span>${pips(lv,s.max)}<em>${lv}/${s.max}</em></button>
  ${open?`<div class="tbody">${SK_WT[k]?`<p class="small muted" style="margin:0 0 6px">Weapon skill: ${esc(skWeapons(k))}.${skUseless(k,st.w.type)?" No effect with your current weapon.":''}</p>`:''}<ol class="tlv">${lvls}</ol><h4>Where to get it</h4><div class="tsrc">${pieces.map(p=>`<span class="src ${p.own?'own':''}">${p.own?'✓ ':''}${esc(p.t)} +${p.n}</span>`).join('')}${jw.map(x=>`<span class="src jw ${x.own?'own':''}">${sgIcon(x.j.sz,x.own)} ${x.seen?esc(x.j.n):"Unknown jewel"} +${x.j.pts||1}</span>`).join('')||''}</div></div>`:''}</div>`;}).join('');
 return`<div class="tabs"><button class="tab ${!f?'on':''}" data-a="tfilter" data-v="">All skills</button><button class="tab ${f==='act'?'on':''}" data-a="tfilter" data-v="act">Active</button></div>
 <p class="small muted" style="margin:0 0 8px">Tap a skill to see each level’s effect and the pieces or jewels that grant it (✓: owned). Weapon skills (Artillery, Focus, Extension, Extended Magazine, Expert Shot) only work with certain weapons: they’re grayed out when yours doesn’t benefit.</p><div class="tlist">${list||"<p class=\"small muted\">No active skills.</p>"}</div>`;}
function vEquip(){const etab=sub.etab2||'eq';const back=sub.fromPrep?backBtn('prep',"Preparation"):backBtn();
 const tabs=`<div class="tabs"><button class="tab ${etab==='eq'?'on':''}" data-a="etab2" data-v="eq">My equipment</button><button class="tab ${etab==='tal'?'on':''}" data-a="etab2" data-v="tal">Skills</button></div>`;
 if(etab==='tal')return back+`<h2>Equipment</h2>`+tabs+vTalents();
 const st=computeStats(),W=st.w;
 const sk=Object.keys(st.raw).filter(k=>st.raw[k]>0).sort((a,b)=>(skUseless(a,W.type)-skUseless(b,W.type))||(st.raw[b]-st.raw[a])).map(k=>{const v=st.raw[k],m=SKILLS[k].max;
  const na=skUseless(k,W.type);return`<div class="skrow ${na?'na':''}"><span>${SKILLS[k].n}</span>${pips(Math.min(v,m),m)}<em class="${v>m?'over':''}">${Math.min(v,m)}/${m}${v>m?` (+${v-m} wasted)`:''}</em><small>${na?"No effect with your weapon · ":''}${esc(skEffect(k,Math.min(v,m)))}</small></div>`;}).join('')||"<p class=\"small muted\">No skills. Forge armor and slot jewels.</p>";
 const ws=getWeaponSlots(W.id);
 const rows=`<button class="eqrow" data-a="eslot" data-v="weapon">${weaponIcon(W.type,W.lin.id)}<span><b>${esc(W.name)}</b><small>${wStats(W)}</small>${sockOf(W.id).some(Boolean)?`<span class="chips2">${ptsChips(itemPts({pts:{},id:W.id}))}</span>`:''}</span><span class="slots">${slotGlyphs(ws,sockOf(W.id))}</span></button>`+
  SLOTS.map(sl=>{const a=getArmor(S.equip[sl.id]);return`<button class="eqrow" data-a="eslot" data-v="${sl.id}"><i class="eqlab">${sl.n}</i><span><b>${esc(a.name)}${a.lv?` <em class="lv">Lv. ${a.lv}</em>`:''}</b><small>Defense ${a.def}</small><span class="chips2">${ptsChips(itemPts(a))}</span></span><span class="slots">${slotGlyphs(a.slots,sockOf(a.id))}</span></button>`;}).join('');
 return back+`<h2>Equipment</h2>${tabs}
 <div class="stats four"><div><small>Attack</small><b>${st.atk}</b></div><div><small>Affinity</small><b>${st.aff}%</b></div><div><small>Element</small><b>${W.elem?`${ELEM[W.elem].n} ${Math.round(W.ev*(1+.08*st.sk.elem))}`:W.stat?`Poison ${W.sv}`:'—'}</b></div><div><small>Defense</small><b>${st.def}</b></div></div>
 <h3>Active skills</h3><div class="sklist">${sk}</div>
 <h3>Your equipment</h3><p class="small muted" style="margin:0 0 6px">Tap a row to change pieces or slot jewels.</p><div class="eqlist">${rows}</div>
 ${(()=>{const n=Object.values(S.sock).reduce((a,arr)=>a+arr.filter(Boolean).length,0);return n?`<button class="btn wide" data-a="unsockask" style="margin-top:12px">Unequip all jewels (${n})</button>`:'';})()}`;}
function slotEditor(itemId,slots){const cur=sockOf(itemId);if(!slots.length)return"<p class=\"small muted\">No jewel slots.</p>";
 return`<div class="socks">${slots.map((s,i)=>{const j=cur[i]&&JEWELS.find(x=>x.id===cur[i]);return`<button class="sock" data-a="sockpick" data-v="${itemId}|${i}">${sgIcon(s,!!j)}<span>${j?`<b>${esc(j.n)}</b><small>${SKILLS[j.sk].n} +${j.pts||1}</small>`:`<b>Empty slot</b><small>Size ${s}: tap to slot a jewel</small>`}</span></button>`;}).join('')}</div>`;}
function openSlot(which){const st=computeStats();
 if(which==='weapon'){const W=st.w;const list=WT_ORDER.map(t=>{const own=S.weapons.filter(id=>id.startsWith(t+':')).sort((a,b)=>{const la=getWeapon(a).lin,lb=getWeapon(b).lin;return monSeq(linRoot(la).mon)-monSeq(linRoot(lb).mon)||lb.atk-la.atk;});if(!own.length)return'';
   return`<details class="wgrp" ${own.includes(W.id)?'open':''}><summary><b>${WT[t].n}</b><small>${own.length} weapon${own.length!==1?'s':''}${own.includes(W.id)?" · equipped":''}</small></summary>`+own.map(id=>{const w=getWeapon(id),on=id===W.id;const ws=getWeaponSlots(id);return`<div class="pick ${on?'on':''}">${weaponIcon(w.type,w.lin.id)}<span><b>${esc(w.name)}</b><small>${wStats(w)}</small>${jewelLine(id,'weapon')}</span>${ws.length?`<span class="slots">${slotGlyphs(ws,sockOf(id))}</span>`:''}${on?"<span class=\"tag\">Equipped</span>":`<button class="btn sm" data-a="equipw" data-v="${id}">Equip</button>`}</div>`;}).join('')+'</details>';}).join('');
  modal(`<h2>${esc(W.name)}</h2>${WT[W.type].ranged?'':sharpBar(W.sharp,W.total)}<button class="btn wide" data-a="toforge" style="margin:6px 0">🛠️ Upgrade at the forge</button><h3 class="mini">Jewels</h3>${slotEditor(W.id,getWeaponSlots(W.id))}<h3>Change weapon</h3>${list}<button class="btn wide" data-a="close" style="margin-top:10px">Close</button>`);return;}
 const sl=SLOTS.find(x=>x.id===which),a=getArmor(S.equip[which]);
 const own=S.armors.filter(id=>id.startsWith(which+':')).map(getArmor).sort((x,y)=>y.def-x.def);
 modal(`<h2>${esc(a.name)}</h2><p class="small muted" style="margin:0">Defense ${a.def}${a.lv?` (level ${a.lv}/${a.maxLv})`:''}</p><div class="chips2" style="margin-top:4px">${ptsChips(a.pts)}</div>
 <button class="btn wide" data-a="toforge" style="margin:6px 0">🛠️ Upgrade at the forge</button>
 <h3 class="mini">Jewels</h3>${slotEditor(a.id,a.slots)}
 <h3>Change ${sl.n.toLowerCase()}</h3>${own.map(x=>{const on=x.id===a.id;return`<div class="pick ${on?'on':''}"><span><b>${esc(x.name)}${x.lv?` <em class="lv">Lv. ${x.lv}</em>`:''}</b><small>Def. ${x.def} (${x.def>=a.def?'+':''}${x.def-a.def})</small><span class="chips2">${ptsChips(x.pts)}</span>${jewelLine(x.id,which)}</span><span class="slots">${slotGlyphs(x.slots,sockOf(x.id))}</span>${on?"<span class=\"tag\">Worn</span>":`<button class="btn sm" data-a="equipa" data-v="${x.id}">Wear</button>`}</div>`;}).join('')}
 <button class="btn wide" data-a="close" style="margin-top:10px">Close</button>`);}
function jewelLine(id,back){const js=sockOf(id).filter(Boolean);if(!js.length)return'';const worn=id===S.equip.weapon||Object.values(S.equip).includes(id);
 return`<small class="jline">${uic('gem2')} ${js.map(j=>esc(JEWELS.find(x=>x.id===j).n)).join(', ')}${worn?'':` · <button class="linkbtn" data-a="unsockall" data-v="${id}|${back}">Remove</button>`}</small>`;}
function openSockPick(v){const[itemId,i]=v.split('|');const idx=+i;const slots=itemId.includes(':')&&SLOTS.some(s=>itemId.startsWith(s.id+':'))?getArmor(itemId).slots:getWeaponSlots(itemId);const size=slots[idx];const cur=sockOf(itemId)[idx];
 const list=JEWELS.filter(j=>j.sz<=size&&(jewelFree(j.id)>0||j.id===cur)).map(j=>`<div class="pick ${j.id===cur?'on':''}">${sgIcon(j.sz,true)}<span><b>${esc(j.n)}</b><small>${SKILLS[j.sk].n} +${j.pts||1} · free: ${jewelFree(j.id)}</small><small>${esc(skEffect(j.sk,j.pts||1))}</small></span>${j.id===cur?"<span class=\"tag\">Slotted</span>":`<button class="btn sm" data-a="sockset" data-v="${itemId}|${idx}|${j.id}">Slot</button>`}</div>`).join('');
 modal(`<h2>Size ${size} slot</h2><p class="small muted" style="margin:0 0 8px">A jewel fits a slot of its size or larger. Removing it frees it up for another piece.</p>
 ${cur?`<button class="btn wide" data-a="sockset" data-v="${itemId}|${idx}|">Remove ${esc(JEWELS.find(x=>x.id===cur).n)}</button>`:''}
 <div class="picks">${list||"<p class=\"small muted\">No jewels available at this size. Craft some at the forge, Jewels tab.</p>"}</div>
 <button class="btn wide" data-a="back2slot" data-v="${itemId}" style="margin-top:10px">Back</button>`);}
const WT_TIP={gs:"Charge when nothing is targeting you, then release. Guarding or dodging keeps the charge; taking a hit breaks it.",
 ls:"Strike to fill the gauge, raise your spirit with Spinning slash, and save Foresight Slash for a telegraphed attack.",
 sns:"Guard as soon as an attack targets you: the shield fully blocks light hits. Safe, but you have to strike often.",
 db:"Target the monster’s elemental weakness. Furious Mode hits hard but drains stamina: leave it before you run dry.",
 hammer:"Aim for the head to stun. You can move and dodge without losing the charge.",
 hh:"Each hit plays a note: chain them, then use Recital to play the melody (attack, defense or healing).",
 lance:"Stay in melee and guard as soon as an attack targets you: its guard is the sturdiest. Counter strikes back instantly.",
 gl:"Shells ignore hardness: fire them at armored parts, reload when the magazine is empty, and guard against big hits.",
 sa:"Fill the phial in axe mode, switch to sword to hit harder, then finish with a Discharge.",
 cb:"In sword mode, build energy and charge your phials, then switch to axe for the Ultimate Discharge.",
 ig:"Send the beetle to the head, flank and tail: with all three extracts, you hit much harder.",
 bow:"Stay at range and charge your shots when nothing is targeting you. Back off as soon as the monster closes in.",
 lbg:"Aim for the weak part and switch ammo to suit the monster. Shot and roll dodges while firing, but not every turn.",
 hbg:"Siege mode hits very hard but roots you in place: leave it as soon as a big attack targets you. Guard when you can’t get away."};
function wtRatings(t){const r=WT[t].r,row=(n,v)=>`<span class="rt"><em>${n}</em>${[1,2,3,4,5].map(i=>`<i class="${i<=v?'on':''}"></i>`).join('')}</span>`;
 return`<div class="rts">${row("Might",r.p)}${row("Ease",r.f)}${row("Safety",r.s)}${r.e?row("Element",r.e):''}</div>`;}
function costText(mon,r){return[...Object.keys(r.mats).map(k=>`${MON[mon].mats[k]} ×${r.mats[k]}`),...Object.keys(r.res||{}).map(k=>`${RES[k].n} ×${r.res[k]}`),`${r.z} z`].join(', ');}
function recipeHTML(mon,r){const seen=S.mon[mon]&&S.mon[mon].seen;return`<div class="recipe">${Object.keys(r.mats).map(k=>{const have=S.mats[matId(mon,k)]||0,ok=have>=r.mats[k];
 return`<span class="${ok?'ok':'no'}">${seen?MON[mon].mats[k]:'???'} ${have}/${r.mats[k]}</span>`;}).join('')}${Object.keys(r.res||{}).map(k=>{const have=S.res[k]||0,ok=have>=r.res[k];return`<span class="${ok?'ok':'no'}">${itemIcon(k,'iicon sm')}${RES[k].n} ${have}/${r.res[k]}</span>`;}).join('')}<span class="${S.zenny>=r.z?'ok':'no'}">${r.z} z</span></div>`;}
function craftables(){const out=[];
 for(const t of WT_ORDER)for(const l of LIN)if(l.mon){const id=t+':'+l.id;if(S.weapons.includes(id))continue;
  if(l.t3&&!eliteOpen())continue;
  if(l.up?!S.weapons.includes(t+':'+l.up):(S.weapons.includes(id+'2')||S.weapons.includes(id+'3')))continue;if(canPay(l.mon,weaponRecipe(l)))out.push({k:'w',id,name:getWeapon(id).name});}
 for(const set of SETS)if(set.mon)for(const sl of SLOTS){const id=sl.id+':'+set.id;if(!S.armors.includes(id)&&canPay(set.mon,armorRecipe(sl.id,set)))out.push({k:'a',id,name:getArmor(id).name});}
 return out;}
function missing(mon,r){const out=[];for(const k in r.mats){const h=S.mats[matId(mon,k)]||0;if(h<r.mats[k])out.push(`${(S.mon[mon]&&S.mon[mon].seen)?MON[mon].mats[k]:'???'} ×${r.mats[k]-h}`);}for(const k in(r.res||{})){const h=S.res[k]||0;if(h<r.res[k])out.push(`${RES[k].n} ×${r.res[k]-h}`);}if(S.zenny<r.z)out.push(`${r.z-S.zenny} z`);return out;}
function linTiers(t,base){const a=[base];a.push(LIN.find(x=>x.up===base.id));a.push(LIN.find(x=>x.up===a[1].id));a.push(LIN.find(x=>x.up===a[2].id));return a.map(L=>({L,id:t+':'+L.id}));}
function linRoot(l){let L=l;while(L&&L.up)L=LIN.find(x=>x.id===L.up);return L;}
function vForgeWorn(){const W=getWeapon(S.equip.weapon),root=linRoot(W.lin);let wcard;
 if(!root||!root.mon)wcard=`<div class="fcard"><div class="fbody">${weaponIcon(W.type,W.lin.id)}<span><b>${esc(W.name)}</b><small>${wStats(W)}</small><small class="muted">The Iron weapon can’t be upgraded: forge a monster weapon.</small></span></div></div>`;
 else{const ti=linTiers(W.type,root),owned=ti.findIndex(x=>x.id===W.id),maxT=mrOpen()?3:eliteOpen()?2:1,next=owned<maxT?owned+1:-1;
  let st='';if(next<0)st=owned===3?"<em class=\"ok\">Max version</em>":`<em class="no">Version ${['II','III','IV'][owned]}: ${owned===2?"Master Rank":"elite hunts"}</em>`;
  else{const r=weaponRecipe(ti[next].L),nr=missing(root.mon,r);st=nr.length?`<em class="no">Missing: ${esc(nr.slice(0,2).join(', '))}${nr.length>2?'…':''}</em>`:"<em class=\"ok\">Materials ready</em>";}
  wcard=`<div class="fcard"><button class="fbody" data-a="wdetail" data-v="${W.type}|${root.id}">${weaponIcon(W.type,W.lin.id)}<span><b>${esc(W.name)}</b><small>${wStats(W)}</small><span class="tiers">${['I','II','III','IV'].map((x,i)=>`<i class="${i<=owned?'on':''}">${x}</i>`).join('')}${st}</span></span></button>${next>=0?`<button class="btn sm ${canPay(root.mon,weaponRecipe(ti[next].L))?'go':''}" data-a="wdetail" data-v="${W.type}|${root.id}">Upgrade</button>`:''}</div>`;}
 const arm=SLOTS.map(sl=>{const a=getArmor(S.equip[sl.id]);let st,btn='';
  if(a.lv>=a.maxLv)st=`<em class="ok">Max level (${a.def} def.)</em>`;
  else{const c=armorLvCost(a),ok=canLv(a),nd=Math.min(defCap(),a.def+DEF_STEP);st=`<em class="${ok?'ok':'no'}">Lv. ${a.lv} → ${a.lv+1}: def. ${a.def} → ${nd} · ${RES[c.res].n} ${S.res[c.res]||0}/1, ${RES[c.ore].n} ${S.res[c.ore]||0}/1, ${c.z} z</em>`;btn=`<button class="btn sm ${ok?'go':''}" data-a="alvq" data-v="${a.id}" ${ok?'':'disabled'}>+1 level</button>`;}
  return`<div class="fcard"><button class="fbody" data-a="adetail" data-v="${a.id}"><i class="eqlab">${sl.n}</i><span><b>${esc(a.name)}</b><span class="lvbar sm">${Array.from({length:a.maxLv},(_,i)=>`<i class="${i<a.lv?'on':''}"></i>`).join('')}</span><small>${st}</small></span></button>${btn}</div>`;}).join('');
 return`<p class="small muted" style="margin:0 0 8px">Your worn equipment. Tap a piece to see its details, or upgrade it directly.</p><h3 class="mini">Weapon</h3><div class="fcards">${wcard}</div><h3 class="mini">Armor</h3><div class="fcards">${arm}</div>`;}
function vForge(){const tab=sub.ftab||'porte';let body='';
 if(tab==='porte')body=vForgeWorn();
 else if(tab==='arme'){const t=sub.ftype||'gs';
  body=`<div class="wtgrid">${WT_ORDER.map(x=>`<button class="wtb ${x===t?'on':''}" data-a="ftype" data-v="${x}" aria-label="${WT[x].n}">${weaponIcon(x)}<span>${WT_SHORT[x]}</span></button>`).join('')}</div><h3 class="wtname">${WT[t].n}</h3>${wtRatings(t)}<p class="wttip">💡 ${esc(WT_TIP[t])}</p>`+
  `<div class="fcards">`+LIN.filter(l=>l.mon&&!l.up).sort((a,b)=>monSeq(a.mon)-monSeq(b.mon)).map(l=>{const seen=S.mon[l.mon]&&S.mon[l.mon].seen,ti=linTiers(t,l),owned=ti.findIndex(x=>S.weapons.includes(x.id));
   const maxT=mrOpen()?3:eliteOpen()?2:1,next=owned<0?0:owned<maxT?owned+1:-1,show=ti[owned>=0?owned:0],w=getWeapon(show.id);
   let act='';if(!seen)act="<span class=\"tag\">Unknown</span>";else if(next<0)act=`<span class="tag">${owned===3?"Max":owned===2?"IV: master":"III: elite"}</span>`;
   else{const r=weaponRecipe(ti[next].L),ok=canPay(l.mon,r);act=`<button class="btn sm ${ok?'go':''}" data-a="wdetail" data-v="${t}|${l.id}">${next?"Upgrade":"Forge"}</button>`;}
   const nr=next>=0&&seen?missing(l.mon,weaponRecipe(ti[next].L)):[];
   return`<div class="fcard"><button class="fbody" data-a="wdetail" data-v="${t}|${l.id}">${weaponIcon(t,show.L.id)}<span><b>${seen?esc(w.name):"Unknown weapon"}</b><small>${seen?wStats(w):`Unknown monster (${'★'.repeat(l.rank)})`}</small>
   <span class="tiers">${['I','II','III','IV'].map((x,i)=>`<i class="${i<=owned?'on':''}">${x}</i>`).join('')}${seen&&next>=0?(nr.length?`<em class="no">Missing: ${esc(nr.slice(0,2).join(', '))}${nr.length>2?'…':''}</em>`:"<em class=\"ok\">Materials ready</em>"):''}</span></span></button>${act}</div>`;}).join('')+`</div>`;}
 else if(tab==='armure')body=`<p class="small muted" style="margin:0 0 8px">Tap a piece to forge or upgrade it. Every piece goes up to ${defCap()} defense with armor spheres, so pick them for their skills.</p><div class="sets">`+SETS.map(set=>{const seen=!set.mon||(S.mon[set.mon]&&S.mon[set.mon].seen);
   if(!seen)return`<div class="setcard"><div class="sethead"><b>Unknown armor</b><small>Hunt the monster to discover it</small></div></div>`;
   const ids=SLOTS.map(sl=>sl.id+':'+set.id),nOwn=ids.filter(id=>S.armors.includes(id)).length,nReady=ids.filter((id,i)=>S.armors.includes(id)?canLv(getArmor(id)):set.mon&&canPay(set.mon,armorRecipe(SLOTS[i].id,set))).length,worn=ids.some(id=>Object.values(S.equip).includes(id));
   const open=sub.sets&&set.id in sub.sets?sub.sets[set.id]:(nReady>0||worn);
   return`<details class="setcard" ${open?'open':''}><summary class="sethead" data-a="setopen" data-v="${set.id}"><b>${esc(set.name)} Armor${worn?" <em class=\"worn\">worn</em>":''}</b><small>Defense ${set.def} → ${defCap()} · ${nOwn}/5 forged${nReady?` · <span class="rdy">${nReady} action${nReady!==1?'s':''} available</span>`:''}</small></summary>
   ${seen?`<div class="prows">${SLOTS.map((sl,i)=>{const id=sl.id+':'+set.id,own=S.armors.includes(id),a=getArmor(id);const ready=!own&&set.mon&&canPay(set.mon,armorRecipe(sl.id,set)),up=own&&canLv(a),worn=S.equip[sl.id]===id;
    const st=own?(a.lv>=a.maxLv?"Max":`Lv. ${a.lv}${up?' ↑':''}`):ready?"Forge":"To forge";
    return`<button class="prow ${own?'own':''} ${ready||up?'ready':''}" data-a="adetail" data-v="${id}"><i class="plab">${sl.n}</i><span class="chips2">${ptsChips(set.p[i])}</span><span class="slots">${slotGlyphs(set.sl[i])}</span><b class="pst">${worn?'✓ ':''}${st}</b></button>`;}).join('')}</div>`:''}</details>`;}).join('')+`</div>`;
 else{const used=jewelsUsed(),st=computeStats();
  const items=[S.equip.weapon,...SLOTS.map(sl=>S.equip[sl.id])];const free={1:0,2:0,3:0};
  for(const id of items){const sl=SLOTS.some(x=>id.startsWith(x.id+':'))?getArmor(id).slots:getWeaponSlots(id);const cur=sockOf(id);sl.forEach((z,i)=>{if(!cur[i])free[z]++;});}
  const stock=JEWELS.filter(j=>jewelFree(j.id)>0).map(j=>`${esc(j.n)} ×${jewelFree(j.id)}`);
  body=`<div class="jsum"><div><b>Free slots on your equipment</b><span>${[1,2,3].map(z=>free[z]?`${sgIcon(z,false)}×${free[z]}`:'').join(' ')||'<span class="muted">none</span>'}</span></div>${stock.length?`<div><b>Jewels in stock</b><span class="small">${stock.join(', ')}</span></div>`:''}</div>
  <p class="small muted" style="margin:0 0 4px">Jewels fit slots of the same size or larger (Equipment screen). The gauge shows the skill’s current level on your worn equipment.</p>`+
  (()=>{const sz=sub.jsz||1,only=!!sub.jrdy;const L=JEWELS.filter(j=>j.sz===sz),seenL=L.filter(j=>monSeen(j.mon)),unk=L.length-seenL.length;
   const can=j=>canPay(j.mon,jewelRecipe(j))&&(j.sz<3||eliteOpen());const cnt=z=>JEWELS.filter(j=>j.sz===z&&monSeen(j.mon)&&can(j)).length;
   const shown=only?seenL.filter(can):seenL;
   let h=`<div class="jtabs">${[1,2,3].map(z=>{const n=cnt(z);return`<button class="jtab ${z===sz?'on':''}" data-a="jsz" data-v="${z}">${sgIcon(z,false)} Size ${z}${n?`<em>${n}</em>`:''}</button>`;}).join('')}</div>
   <label class="jrdy"><input type="checkbox" data-a="jrdy" ${only?'checked':''}> Only those I can craft</label>`;
   if(sz===3&&!eliteOpen())h+="<p class=\"small muted\">Size 3 jewels can be crafted once you defeat the Iron King.</p>";
   let lastM=null;
   h+=shown.map(j=>{const r=jewelRecipe(j),ok=can(j);const cv=Math.min(st.raw[j.sk]||0,SKILLS[j.sk].max),mx=SKILLS[j.sk].max;
    const hd=j.mon!==lastM?`<h3 class="jh jm">${portrait(j.mon,'')}<span>${esc(MON[j.mon].name)}</span></h3>`:'';lastM=j.mon;
    return hd+`<div class="jrow"><span><span class="jtop"><b>${uic('gem'+j.sz,'uic jg')}${esc(j.n)}</b><span class="jcur ${cv>=mx?'max':''}">${pips(cv,mx)}<em>${cv>=mx?'max':`${cv}/${mx}`}</em></span></span><small>${SKILLS[j.sk].n} +${j.pts||1} (${esc(skEffect(j.sk,j.pts||1))}) · owned: ${S.jewels[j.id]||0}${used[j.id]?` (${used[j.id]} slotted)`:''}</small>
   ${j.sz===3&&!eliteOpen()?"<small>Elite hunts required</small>":recipeHTML(j.mon,r)}</span>
   <button class="btn sm ${ok?'go':''}" data-a="craftj" data-v="${j.id}" ${ok?'':'disabled'}>Craft</button></div>`;}).join('');
   if(only&&!shown.length)h+="<p class=\"small muted\">No jewels of this size can be crafted yet.</p>";
   if(unk)h+=`<p class="small muted junk">🔒 ${unk} more of this size to discover by hunting new monsters.</p>`;
   return h;})();}
 const sp=`<span class="tag">${itemIcon('sphere','iicon sm')}${S.res.sphere||0}</span>${eliteOpen()?`<span class="tag">${itemIcon('sphered','iicon sm')}${S.res.sphered||0}</span>`:''}${mrOpen()?`<span class="tag">${itemIcon('spherea','iicon sm')}${S.res.spherea||0}</span>`:''}`;
 const toast=sub.toast;sub.toast=null;
 return backBtn()+`<h2>Forge</h2>${toast?`<div class="toast">🛠️ ${esc(toast)}</div>`:''}<div class="fpurse"><span>${S.zenny} z</span>${sp}</div><div class="tabs"><button class="tab ${tab==='porte'?'on':''}" data-a="ftab" data-v="porte">Equipped</button><button class="tab ${tab==='arme'?'on':''}" data-a="ftab" data-v="arme">Weapons</button><button class="tab ${tab==='armure'?'on':''}" data-a="ftab" data-v="armure">Armor</button><button class="tab ${tab==='joyau'?'on':''}" data-a="ftab" data-v="joyau">Jewels</button></div>${body}`;}
function openWDetail(v){const[t,lid]=v.split('|');const l=LIN.find(x=>x.id===lid),ti=linTiers(t,l),owned=ti.findIndex(x=>S.weapons.includes(x.id));
 const rows=ti.map((x,i)=>{const w=getWeapon(x.id),r=weaponRecipe(x.L),own=owned===i,done=owned>i,locked=(i===2&&!eliteOpen())||(i===3&&!mrOpen());
  const can=!own&&!done&&!locked&&(i===0||owned===i-1)&&canPay(l.mon,r);
  return`<div class="wtier ${own?'on':''}"><div class="top"><span><b class="wline">${weaponIcon(t,x.L.id)}${esc(w.name)}</b><small>${wStats(w)}${getWeaponSlots(x.id).length?` · slots ${getWeaponSlots(x.id).join('-')}`:''}</small></span>
  ${own?"<span class=\"tag\">Owned</span>":done?"<span class=\"tag\">Superseded</span>":locked?`<span class="tag">${i===3?"Master Rank":"Elite"}</span>`:`<button class="btn sm ${can?'go':''}" data-a="craftw" data-v="${x.id}" ${can?'':'disabled'}>${i?"Upgrade":"Forge"}</button>`}</div>
  ${sharpBar(w.sharp,w.total)}${own||done?'':recipeHTML(l.mon,r)}</div>`;}).join('');
 modal(`<h2>${esc(l.name)} Line</h2><p class="small muted" style="margin:0 0 6px">${WT[t].n}. Each upgrade replaces the previous version. Version III is forged with elite materials, version IV with materials from Master Rank ancestral monsters.</p>${rows}<button class="btn wide" data-a="close" style="margin-top:10px">Close</button>`);}
function openADetail(id){const a=getArmor(id),own=S.armors.includes(id),set=a.set,r=armorRecipe(a.slot,set);let act='';
 if(!own){const ok=set.mon&&canPay(set.mon,r);act=`${set.mon?recipeHTML(set.mon,r):''}<button class="btn main wide" data-a="crafta" data-v="${id}" ${ok?'':'disabled'} style="margin-top:8px">Forge</button>`;}
 else if(a.lv<a.maxLv){const c=armorLvCost(a),ok=canLv(a),hard=c.res==='sphered';
  act=`<p class="small">Level ${a.lv} → ${a.lv+1}: defense ${a.def} → ${Math.min(defCap(),a.def+DEF_STEP)}. Cost: 1 ${RES[c.res].n} (${S.res[c.res]||0} in stock), 1 ${RES[c.ore].n} (${S.res[c.ore]||0}) and ${c.z} z.${hard&&!eliteOpen()?" Beyond 46 defense, you need hard spheres, earned on elite hunts.":''}${c.res==='spherea'?" Beyond 70 defense, you need ancestral spheres, earned in Master Rank.":''}</p><button class="btn main wide" data-a="alv" data-v="${id}" ${ok?'':'disabled'}>Upgrade</button>`;}
 else act="<p class=\"small\" style=\"color:var(--good)\">Max level reached.</p>";
 modal(`<h2>${esc(a.name)}</h2><p class="small muted" style="margin:0">Defense ${a.def}${own?` · level ${a.lv}/${a.maxLv}`:''} · ${ptsText(a.pts)||'no skills'} · slots ${a.slots.length?a.slots.join('-'):'none'}</p>
 <div class="lvbar">${Array.from({length:a.maxLv},(_,i)=>`<i class="${i<a.lv?'on':''}"></i>`).join('')}</div>${act}
 ${own&&S.equip[a.slot]!==id?`<button class="btn wide" data-a="equipa" data-v="${id}" style="margin-top:8px">Wear</button>`:''}<button class="btn wide" data-a="close" style="margin-top:8px">Close</button>`);}
const RES_PRICE={c_lou:45,c_sal:35,fer:15,boisdur:25,ardente:20,cristal:30,tonnerre:35,dracite:60,c_rod:20,c_kel:30,c_brou:25,c_ping:35,c_volt:40,c_garg:60};
function sellPrice(id){const [mon,k]=id.split('.');const r=MON[mon].rank;return k==='xrare'?400*r:k==='xeca'?60*r:k==='rare'?250*r:(k==='tete'||k==='queue')?35*r:20*r;}
function vCraft(){const own=RES_ORDER.filter(k=>S.res[k]>0);const t=sub.toast;sub.toast=null;
 const tagL=l=>`<div class="skl">${l.map(k=>`<span class="tag">${itemIcon(k,'iicon sm')}${RES[k].n} ×${S.res[k]}</span>`).join('')}</div>`;
 const forge=own.filter(k=>RES[k].ore||RES[k].hide||k==='sphere'||k==='sphered'||k==='spherea'),herbs=own.filter(k=>!forge.includes(k));
 const rg=WT[getWeapon(S.equip.weapon).type].ranged,cats=rg?[CRAFT_CAT[3],...CRAFT_CAT.slice(0,3)]:CRAFT_CAT;const tab=sub.ctab&&CRAFT_CAT.some(c=>c[0]===sub.ctab)?sub.ctab:cats[0][0];
 const cat=CRAFT_CAT.find(c=>c[0]===tab),list=RECIPES.filter(r=>cat[2].includes(r.out));
 const prepN=PREP_LIST.concat(rangedPrep()).filter(k=>{const rc=RECIPES.find(r=>r.out===k);return rc&&fillBatches(rc)>0;}).length;
 return backBtn()+`<h2>Workshop</h2>${t?`<div class="toast">🛠️ ${esc(t)}</div>`:''}<p class="small muted" style="margin:0 0 8px">Craft potions, bombs, traps and ammo from what you gather, here or at base camp.</p>
 <button class="btn wide${prepN?' main':''}" data-a="prepsack" ${prepN?'':'disabled'}>Prepare my pouch</button><p class="small muted" style="margin:4px 0 0">Fills up potions, antidotes, steaks and flash bombs${getWeapon(S.equip.weapon).type==='bow'?", and power coatings":isGun(getWeapon(S.equip.weapon).type)?", and piercing ammo":''} to the carry limit, as your resources allow.</p>
 ${(()=>{const ks=ITEM_ORDER.filter(k=>!ITEMS[k].sup&&(S.items[k]>0||PREP_LIST.includes(k)||(rg&&k==='fiole_p')));const lack=ks.filter(k=>(S.items[k]||0)<ITEMS[k].carry&&(PREP_LIST.includes(k)||rangedPrep().includes(k))).length;
  return`<details class="sackbox" ${sub.sackOpen?'open':''}><summary data-a="sacktog"><b>My pouch</b><small>${ks.filter(k=>S.items[k]>0).length} item${ks.filter(k=>S.items[k]>0).length!==1?'s':''}${lack?` · ${lack} to restock`:" · ready"}</small></summary><div class="skl">${ks.map(k=>{const n=S.items[k]||0,c=ITEMS[k].carry;return`<span class="tag sk${n>=c?' full':n?'':' none'}">${itemIcon(k,'iicon sm')}${ITEMS[k].n} ${n}/${c}</span>`;}).join('')}</div><p class="small muted" style="margin:4px 0 0">Stock / max carried per quest.</p></details>`;})()}
 <div class="tabs">${cats.map(([k,n,ids])=>{const c=RECIPES.filter(r=>ids.includes(r.out)&&canCraft(r)).length;return`<button class="tab ${k===tab?'on':''}" data-a="ctab" data-v="${k}">${n}${c?` <i class="tcnt">${c}</i>`:''}</button>`;}).join('')}</div>
 ${list.slice().sort((a,b)=>canCraft(b)-canCraft(a)).map(craftRow).join('')}
 <details class="lootbox resbox"><summary>My resources</summary>${herbs.length?`<h4 class="rsh4">Gathered</h4>${tagL(herbs)}`:"<p class=\"small muted\">Nothing gathered yet.</p>"}${forge.length?`<h4 class="rsh4">For the forge</h4>${tagL(forge)}`:''}</details>`;}
function vShop(){const tab=sub.stab||'achat';let body='';
 if(tab==='achat')body=ITEM_ORDER.filter(k=>ITEMS[k].shop).map(k=>{const it=ITEMS[k];const rc=RECIPES.find(r=>r.out===k);return`<div class="row"><div class="top"><span class="iline">${itemIcon(k,'iicon big')}<span><b>${it.n}</b> <span class="small muted">${S.items[k]||0} in stock · ${it.carry} max per quest</span><span class="small">${it.d}</span></span></span>
  <span style="display:flex;gap:6px"><button class="btn sm" data-a="buy" data-v="${k}" data-n="1" ${S.zenny<it.p?'disabled':''}>${it.p} z</button>${it.carry>1?`<button class="btn sm" data-a="buy" data-v="${k}" data-n="5" ${S.zenny<it.p*5?'disabled':''}>×5</button>`:''}</span></div></div>`;}).join('');
 else{const ids=Object.keys(S.mats).filter(id=>S.mats[id]>0);const rs=RES_ORDER.filter(k=>RES_PRICE[k]&&S.res[k]>0);
  const byMon=MON_ORDER.map(m=>[m,ids.filter(id=>id.startsWith(m+'.'))]).filter(x=>x[1].length);
  body=(byMon.length||rs.length)?byMon.map(([m,l])=>`<h3>${esc(MON[m].name)}</h3>`+l.map(id=>`<div class="row"><div class="top"><span><b>${esc(matName(id))}</b> <span class="muted small">×${S.mats[id]}</span></span><button class="btn sm" data-a="sell" data-v="${id}">Sell ${sellPrice(id)} z</button></div></div>`).join('')).join('')
   +(rs.length?`<h3>Ores and hides</h3>`+rs.map(k=>`<div class="row"><div class="top"><span class="iline">${itemIcon(k,'iicon')}<span><b>${RES[k].n}</b> <span class="muted small">×${S.res[k]}</span></span></span><button class="btn sm" data-a="sellr" data-v="${k}">Sell ${RES_PRICE[k]} z</button></div></div>`).join(''):'')
   :"<p class=\"muted\">Nothing to sell. Hunt and explore to gather materials.</p>";}
 if(tab==='achat')body+=`<p class="small muted">The Guild only sells the essentials. Mega Potions, steaks, seeds, bombs and traps are crafted at the Workshop from what you gather.</p><button class="btn wide" data-a="go" data-v="craft">Go to the Workshop</button>`;
 return backBtn()+`<h2>Shop</h2><p class="muted small" style="margin:0">${S.zenny} z</p><div class="tabs"><button class="tab ${tab==='achat'?'on':''}" data-a="stab" data-v="achat">Items</button><button class="tab ${tab==='vente'?'on':''}" data-a="stab" data-v="vente">Sell materials</button></div>${body}`;}

function pctOf(tab,k){const t=tab.reduce((a,e)=>a+e[1],0),e=tab.find(x=>x[0]===k);return e?e[1]/t:0;}
function fmtPct(p){return p?`${Math.round(p*100)} %`:'—';}
function lootHTML(id){const d=MON[id],P=d.parts;const keys=['ecaille','peau','griffe','tete','queue','rare'];
 const other=k=>k==='tete'?['b',P.tete.name.toLowerCase()]:k==='griffe'?['b',P.flanc.name.toLowerCase()]:k==='queue'?(P.queue.sever?['g',"sever the tail"]:['b',P.queue.name.toLowerCase()]):(d.plated&&(k==='ecaille'||k==='peau'))?['g',"broken plates"]:null;
 const rows=keys.map(k=>`<tr class="${k==='rare'?'rare':''}"><td><span class="mn">${esc(d.mats[k])}</span>${other(k)?`<span class="gar">${other(k)[0]==='b'?`Guaranteed on break: ${esc(other(k)[1])}`:`Guaranteed: ${esc(other(k)[1])}`}</span>`:''}</td><td>${fmtPct(pctOf(CARVE,k))}</td><td>${fmtPct(pctOf(CAPT,k))}</td></tr>`).join('');
 const pr=pctOf(CARVE,'rare'),atLeast=1-Math.pow(1-pr,5);
 let h=`<details class="lootbox"><summary>Loot table</summary><div class="lootwrap"><table class="hz loot"><tr><th>Material</th><th>Carving</th><th>Capture & rewards</th></tr>${rows}</table></div>
 <p class="small muted" style="margin:4px 0 0">Each successful hunt: 3 carve draws (slain) or 3 capture draws, plus 2 quest reward draws and 1 per secondary objective completed. Carver and Capture Master skills, Carver and Lucky Griffus: +1 draw each. Each broken part always yields its material.</p>
 <p class="small" style="margin:4px 0 0"><b>${esc(d.mats.rare)}</b>: about a ${Math.round(atLeast*100)}% chance of getting at least one per successful hunt, more with objectives.</p>`;
 if(eliteOpen())h+=`<p class="small muted" style="margin:4px 0 0">Veteran version: 2 to 3 ${esc(d.mats.xeca)} (+1 per broken part, 2 max) and ${esc(d.mats.xrare)} at 35% (+10% per objective), on top of the normal loot.</p>`;
 return h+'</details>';}
function monNotesHTML(id){const d=MON[id],rec=S.mon[id]||{};const known=(rec.kills||0)+(rec.caps||0)>0;
 if(!rec.seen)return`<div class="nhead">${portrait(id,'unk')}<div><h3>???</h3><p class="muted small">Monster never encountered.</p></div></div>`;
 let h=`<div class="nhead">${portrait(id)}<div><h3>${d.name}</h3><p class="small muted" style="margin:0">${d.kind}. Slain: ${rec.kills||0}, captured: ${rec.caps||0}.${QUESTS.some(q=>q.mon===id&&q.elite&&!q.anc&&q.tier>0&&S.cleared[q.id])?" Veteran version defeated.":''}${QUESTS.some(q=>q.mon===id&&q.anc&&q.tier>0&&S.cleared[q.id])?(MON[id].mrOnly?" Defeated in Master Rank.":" Ancestral version defeated."):''}</p></div></div><p class="small">${d.lore}</p>`;
 if(!known)return h+lootHTML(id)+"<p class=\"small muted\">Complete a hunt against this monster to record its weaknesses.</p>";
 h+=`<table class="hz hzel"><tr><th>Element</th>${Object.keys(ELEM).map(e=>`<th>${elIcon(e)}</th>`).join('')}</tr><tr><td>Effectiveness</td>${Object.keys(ELEM).map(e=>`<td class="star">${stars(d.weak[e])}</td>`).join('')}</tr></table>`;
 h+=`<table class="hz"><tr><th>Part</th><th>Zone</th><th>Cutting</th><th>Blunt</th><th>Special</th></tr>${['tete','flanc','queue'].map(p=>{const P=d.parts[p];
  return`<tr><td>${P.name}</td><td>${ZN[Object.keys(ZPART).find(z=>ZPART[z]===p)]}</td><td class="star">${hzStars(P.cut)}</td><td class="star">${hzStars(P.blunt)}</td><td>${[d.plated?"Iron-plated":'',P.sever?"Severable":P.brk?"Breakable":''].filter(Boolean).join(', ')}</td></tr>`;}).join('')}</table>`;
 h+=lootHTML(id);
 return h;}
function vNotes(){return backBtn()+`<h2>Hunting Journal</h2>`+MON_ORDER.map(monNotesHTML).join('');}

function vResult(){const r=R,win=r.kind!=='fail';const g=Object.keys(r.gain);
 return`<div class="resport ${r.kind}">${portrait(r.mon,eCls(r.q))}</div><div class="result-h ${win?'win':'lose'}">${r.kind==='kill'?"Hunt complete!":r.kind==='capture'?"Capture complete!":"Quest failed"}</div>
 <p>${win?`${MON[r.mon].name} ${r.kind==='kill'?"was slain":"was captured"} in ${r.turns-1} turns, with ${r.faints} faint${r.faints!==1?'s':''}.${r.kind==='kill'&&r.blow?` Finishing blow: ${esc(r.blow)}.`:''}`:esc(r.reason||'')}</p>
 ${win&&r.obj&&r.obj.length?`<h3>Objectives</h3><div class="objs big">${r.obj.map(o=>`<i class="${o.ok||o.old?'ok':''}">${o.ok||o.old?'✓':'○'} ${esc(o.n)}${o.old?" <small class=\"muted\">(already rewarded)</small>":o.ok?" <small>(+25% bounty and a reward)</small>":''}</i>`).join('')}</div>`:''}
 ${win?`<h3>Rewards</h3>${g.map(id=>`<div class="reward"><span>${esc(matName(id))}</span><b>×${r.gain[id]}</b></div>`).join('')}<div class="reward"><span>Bounty${r.fpen?` <small class="muted">(−${Math.round(r.fpen*100)}%: ${r.faints} faint${r.faints!==1?'s':''})</small>`:''}</span><b>${r.zenny} z</b></div>
 ${r.spheres?`<div class="reward"><span>${r.spheres.map(([k,n])=>`${RES[k].n} ×${n}`).join(', ')}</span><b>${itemIcon('sphere','iicon')}</b></div>`:''}
 ${H&&H.harvest&&H.harvest.length?`<h3>Gathering</h3><div class="skl">${Object.entries(H.harvest.reduce((a,[k,n])=>(a[k]=(a[k]||0)+n,a),{})).map(([k,n])=>`<span class="tag">${itemIcon(k,'iicon sm')}${RES[k].n} ×${n}</span>`).join('')}</div>`:''}
 ${r.pil?`<p class="small">🐱 ${esc(palS().name)} pilfered: ${esc(matName(r.pil))}.</p>`:''}
 ${r.breaks&&r.breaks.length?`<p class="small muted">Broken parts: ${r.breaks.map(b=>b==='sever'?"tail severed":MON[r.mon].parts[b].name.toLowerCase()).join(', ')}.</p>`:''}
 ${r.q.explore?'':(()=>{const c=craftables();return c.length?`<h3>Now forgeable</h3><p class="small">${c.slice(0,6).map(x=>esc(x.name)).join(', ')}${c.length>6?`, and ${c.length-6} other${c.length>7?'s':''}`:''}.</p><button class="btn wide" data-a="go" data-v="forge">Go to the forge</button>`:'';})()}
 ${r.first&&r.q.id==='m_abyssaure'?`<div class="finale"><b>The light has returned.</b><span>Deep in the Crater, the Abyssaur has fallen silent and the black sun has gone out. The Guild engraves your name at the very top of the masters’ board: there is nothing left above you.</span></div>`:''}${r.first&&r.q.id==='q11'?`<div class="finale"><b>The storm has fallen silent.</b><span>The sky over the Crests clears for the first time in centuries. The Guild proclaims you Storm Hunter, the highest rank in Brume-Haute. The Tempest weapons, with the Thunder element, await you at the forge.</span></div>`:''}${r.first&&r.q.final&&r.q.mon==='ferroi'?`<div class="finale"><b>The Iron King has fallen.</b><span>Brume-Haute can sleep in peace: the Guild engraves your name on the Hunters’ stele. The Iron King’s weapons, with the Dragon element, await you at the forge.</span></div>`:''}
 ${r.rankUp?`<div class="finale"><b>Promotion: ${STAGE_N[r.rankUp]}!</b><span>${r.rankUp===7?"Master Rank opens: ancestral monsters, older and deadlier, chain their attacks. Forge IV weapons and push your armor beyond 70.":r.rankUp===4?"High Rank opens: monsters return as veterans, and elite hunts begin.":"New quests await you on the board."}</span></div>`:r.newQ&&r.newQ.length?`<p class="small" style="color:var(--good)">New quest available: ${r.newQ.map(esc).join(', ')}.</p>`:''}`:"<p class=\"muted small\">No reward. Change your equipment or strategy and try again.</p>"}
 ${r.palxp?`<p class="small">🐱 ${esc(palS().name)} earns ${r.palxp} XP${palS().lv>=PAL_MAXLV?" (max level)":` (level ${palS().lv}, ${palS().xp}/${palNext(palS().lv)})`}.</p>${(r.palup||[]).map(t=>`<p class="small" style="color:var(--good)">⬆ ${esc(t)}</p>`).join('')}`:''}
 <div style="margin-top:18px;display:flex;flex-direction:column;gap:8px">${r.q.explore&&S.exp&&S.exp.ko?`<p class="small" style="color:var(--danger)">Three faints: the expedition is over and half your loot is lost.</p><button class="btn main wide" data-a="xend-yes">Return to the village</button>`:r.q.explore&&S.exp?`<button class="btn main wide" data-a="xresume">Resume the expedition</button>`:r.q.arena||r.q.sp?`<button class="btn main wide" data-a="retry">${win?"New fight":"Retry the fight"}: ${esc(qName(r.q))}</button><button class="btn wide" data-a="${r.q.sp?'tospecial':'toarena'}">Back ${r.q.sp?"to special fights":"to the arena"}</button><button class="btn wide" data-a="home">Back to the village</button>`:`<button class="btn main wide" data-a="home">Back to the village</button>${win?'':`<button class="btn wide" data-a="retry">Retry the quest</button>`}`}</div>`;}

/* ---------- Écran de chasse ---------- */
function pt(a,r){const t=a*Math.PI/180;return[150+r*Math.sin(t),150-r*Math.cos(t)];}
function secPath(a1,a2,R,r){const f=v=>v.toFixed(1);const[x1,y1]=pt(a1,R),[x2,y2]=pt(a2,R),[x3,y3]=pt(a2,r),[x4,y4]=pt(a1,r);
 return`M${f(x1)},${f(y1)} A${R},${R} 0 0 1 ${f(x2)},${f(y2)} L${f(x3)},${f(y3)} A${r},${r} 0 0 0 ${f(x4)},${f(y4)} Z`;}
const SECTS=[{z:'avant',a:0},{z:'flanc',a:90},{z:'arriere',a:180},{z:'flanc',a:270}];
function iconAt(id,x,y,sz){if(ICO.has(id))return`<image href="img/ico/${id}.webp" x="${(x-sz/2).toFixed(1)}" y="${(y-sz/2).toFixed(1)}" width="${sz}" height="${sz}"/>`;return`<svg x="${(x-sz/2).toFixed(1)}" y="${(y-sz/2).toFixed(1)}" width="${sz}" height="${sz}" viewBox="0 0 24 24">${itemIcon(id).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`;}
function rawZones(mv){if(mv.track)return[H.zone];let z=mv.z||[];if(mv.tail&&H.m.parts.queue.severed)z=z.filter(x=>x!=='flanc');return z;}
function arenaSVG(){const m=H.m,RG=ranged(),far=RG&&!H.close,danger={},delem={},dOut={};
 const add=(o,z,v)=>{o[z]=(o[z]||0)+v;};
 for(const mv of H.intent||[]){if(m.eclipse>0&&mv.d&&!mv.fx&&!H.over)continue;const v=mv.d?estDmg(mv):0,e=elemOf(mv);
  if(!RG){for(const z of effZones(mv)){add(danger,z,v);if(e!=='phys')delem[z]=e;}continue;}
  const rz=rawZones(mv),reach=reachOf(mv);
  for(const z of rz){if(!mv.track||!far)add(danger,z,v);if(reach&&(!mv.track||far))add(dOut,z,v);if(e!=='phys')delem[z]=e;}}
 if(m.mines&&!H.over&&mineMove(m))for(const z of m.mines.z){const v=estDmg(mineMove(m));add(danger,z,v);if(RG)add(dOut,z,v);delem[z]=m.mines.mv==='foudre_t'?'bolt':'fire';}
 const shown=far?dOut:danger,sr=far?165:106;
 let s=`<svg viewBox="${RG?'-34 -34 368 368':'0 0 300 300'}" aria-label="${H.phase==='camp'?"Arena: tap a zone to engage from that side":"Arena: tap a zone to move"}">${VFX_DEFS}`;
 for(const q of SECTS){const side=q.a===90?'d':q.a===270?'g':'';const here=q.z===H.zone&&(q.z!=='flanc'||side===H.side);
  const c=['sec'];if(m.lava===q.z&&!H.over)c.push('lava');if(m.mines&&m.mines.z.includes(q.z)&&!H.over)c.push(m.mines.mv==='foudre_t'?'bolt':'mine');if(H.phase!=='camp'){if(here)c.push('here');else if(q.z===H.zone)c.push('same');}if(q.z in danger)c.push('danger');
  if(RG&&H.phase!=='camp'){const k=c.indexOf('here');if(k>=0&&far){c.splice(k,1);c.push('same');}}
  s+=`<path class="${c.join(' ')}" d="${secPath(q.a-43,q.a+43,146,90)}" data-a="move" data-v="${q.z}${side?':'+side:''}"><title>${RG&&far?"Close in to melee: ":"Go: "}${ZN[q.z]}</title></path>`;
  if(RG){const o=['sec','far'];if(m.lava===q.z&&!H.over)o.push('lava');if(m.mines&&m.mines.z.includes(q.z)&&!H.over)o.push(m.mines.mv==='foudre_t'?'bolt':'mine');if(H.phase!=='camp'&&far&&here)o.push('here');if(q.z in dOut)o.push('danger');
   s+=`<path class="${o.join(' ')}" d="${secPath(q.a-43,q.a+43,182,151)}" data-a="move" data-v="far:${q.z}${side?':'+side:''}"><title>At range: ${ZN[q.z]}</title></path>`;}
  let lx,ly,px,py;if(side){[lx,ly]=pt(q.a,121);px=lx;ly-=4;py=ly+14;}else{[lx,ly]=pt(q.a,134);[px,py]=pt(q.a,120);ly+=4;py+=4;if(q.a===180){ly+=0;}}
  let pn=m.flying?`${m.d.parts.flanc.name} ½`:m.d.parts[ZPART[q.z]].name;const pl=m.plates&&!m.phase2?m.plates[ZPART[q.z]]:null;
  const pst=pl?(pl.hp>0?"plated":pl.bare>0?`exposed · ${pl.bare}`:''):'';
  s+=`<text class="slab" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}">${ZN[q.z]}</text><text class="spart${m.flying?' fly':''}" x="${px.toFixed(1)}" y="${py.toFixed(1)}">${esc(pn)}</text>${pst?`<text class="splate${pl.bare>0?' bare':''}" x="${(q.a===180?px+62:px).toFixed(1)}" y="${(q.a===180?py:py+(side?12:11)).toFixed(1)}">${pst}</text>`:''}`;
}
 s+=groundSVG(huntHab())+`<g class="${H.over&&R&&R.kind==='kill'?'dead':H.over&&R&&R.kind==='capture'?'caught':''}${m.d.anc?' elitemon ancmon':m.d.elite?' elitemon':''}">${monsterSVG(m)}</g>`;
 if(RG)s+=`<text class="slab farl" x="150" y="-20">At range</text>`;
 for(const q of SECTS)if(q.z in shown){const[dx,dy]=pt(q.a+24,sr);s+=`<text class="sdmg" x="${dx.toFixed(1)}" y="${(dy+4).toFixed(1)}" paint-order="stroke" stroke="var(--bg)" stroke-width="3">${shown[q.z]?'−'+shown[q.z]:'⚠'}</text>`;
  if(delem[q.z]){const[gx,gy]=pt(q.a+36,sr-2);s+=elGlyph(delem[q.z],gx,gy);}}
 if(m.eclipse>0&&!H.over)s+=`<g pointer-events="none"><circle cx="150" cy="150" r="${RG?182:146}" fill="#0a0612" opacity=".5"/><circle cx="150" cy="150" r="40" fill="none" stroke="#b28cff" stroke-width="2" opacity=".6"/></g>`;
 if(m.storm>0&&!H.over)s+=`<g pointer-events="none" opacity=".55"><circle cx="150" cy="150" r="93" fill="none" stroke="#9fc3e8" stroke-width="3" stroke-dasharray="26 18"><animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="7s" repeatCount="indefinite"/></circle><circle cx="150" cy="150" r="${RG?182:146}" fill="#6f8fb8" opacity=".14"/></g>`;
 if(m.mines&&m.mines.mv!=='foudre_t'&&!H.over)for(const q of SECTS)if(m.mines.z.includes(q.z))for(const o of[-30,-10,10,30]){const[mx,my]=pt(q.a+o,137+(o%20?0:-5));s+=`<g class="pulse" pointer-events="none"><path transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${q.a+o})" d="M0,-5 L4,0 L0,5 L-4,0 Z" fill="#ffb04a" stroke="#8a2a10" stroke-width="1"/></g>`;}
 if(m.lava&&!H.over)for(const q of SECTS)if(q.z===m.lava)for(const o of[-34,-17,17,34]){const[lx,ly]=pt(q.a+o,139);s+=`<g class="pulse">${elGlyph('fire',lx,ly)}</g>`;}
 if(m.flying)s+=`<g class="flytag" pointer-events="none"><rect x="0" y="2" width="74" height="22" rx="11" fill="#e8594a"/><text x="37" y="17" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">FLYING</text></g><circle cx="150" cy="150" r="84" fill="none" stroke="#e8594a" stroke-width="1.5" stroke-dasharray="4 6" opacity=".7" pointer-events="none"/>`;
 H.fx.forEach((f,i)=>{if(f.t==='mfx')s+=vfxSVG(f,i);});
 H.fx.forEach((f,i)=>{if(f.t!=='dmg'&&f.t!=='weak')return;const a=zAngle(f.z,H.side);const[sx,sy]=pt(a,66);
  s+=`<g class="slash" style="animation-delay:${i*.12}s" pointer-events="none"><path d="M${(sx-14).toFixed(1)},${(sy+10).toFixed(1)} L${(sx+14).toFixed(1)},${(sy-10).toFixed(1)}" stroke="${f.t==='weak'?'#ffb238':'#fff'}" stroke-width="3.5" stroke-linecap="round"/><path d="M${(sx-10).toFixed(1)},${(sy+15).toFixed(1)} L${(sx+12).toFixed(1)},${(sy-2).toFixed(1)}" stroke="${f.t==='weak'?'#ffb238':'#fff'}" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>`;});
 if(H.moved){const{from,to}=H.moved;let diff=((to-from)%360+360)%360;const sweep=diff<=180?1:0;const mr=far?165:106,[ax,ay]=pt(from-22,mr),[bx,by]=pt(to-22,mr);
  s+=`<defs><marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="var(--brass)"/></marker></defs>
  <path class="movearc" d="M${ax.toFixed(1)},${ay.toFixed(1)} A${mr},${mr} 0 0 ${sweep} ${bx.toFixed(1)},${by.toFixed(1)}" fill="none" stroke="var(--brass)" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#arr)"/>`;}
 if(H.phase!=='camp'&&ranged()&&!H.over){const p=targetPart(),a=p==='tete'?0:p==='queue'?180:(H.side==='d'?90:270),[ax,ay]=pt(a,p==='flanc'?40:60);
  s+=`<g pointer-events="none" transform="translate(${ax.toFixed(1)} ${ay.toFixed(1)})"><circle r="10" fill="none" stroke="var(--you)" stroke-width="2.2"/><path d="M-15,0 H-6 M6,0 H15 M0,-15 V-6 M0,6 V15" stroke="var(--you)" stroke-width="2.2" stroke-linecap="round"/></g>`;}
 if(H.phase!=='camp'){const ha=zAngle(H.zone,H.side);const[hx,hy]=pt(ha-22,far?166:106);const[cx,cy]=pt(ha-38,128);
 s+=`<g class="tok${H.moved?' moved':''}" pointer-events="none">${hunterSVG(hx,hy,ha-22)}${H.q.training?'':H.pal&&H.pal.ko?`<g opacity=".35">${felyneSVG(cx,cy)}</g>`:felyneSVG(cx,cy)}${H.trap?iconAt('piege',...pt(ha+34,126),20):''}</g>`;}
 return s+'</svg>';}
function monCond(m){if(H&&H.q&&H.q.training)return"Never fights back";if(H&&H.over&&R){if(R.kind==='kill')return"Slain";if(R.kind==='capture')return"Captured";}const r=m.hp/m.max;return r>.7?"Vigorous":r>.4?"Wounded":r>.2?"Weakened":m.d.elder?"Near death":"Limping, capturable";}
function monChips(m){const c=[];const P=m.parts,d=m.d;if(H&&H.tr){const n=Math.max(1,H.turn-1);c.push([`Σ ${H.tr.tot}`,'']);c.push([`${Math.round(H.tr.tot/n)}/turn`,'']);c.push([`Best ${H.tr.best}`,'good']);}
 if(m.loot&&m.loot.length)c.push([`${m.loot.map(k=>itemIcon(k,'uic')).join('')} stolen`,'bad']);if(m.enraged)c.push([uic('s_rage')+" Enraged",'bad']);if(m.storm)c.push([`${elIcon('foudre')} Tempest · ${m.storm}`,'bad']);if(m.eclipse)c.push([`${elIcon('dragon')} Eclipse · ${m.eclipse}`,'bad']);if(m.spikes)c.push([`${uic('s_warn')} Spines · ${m.spikes}`,'bad']);if(m.charged)c.push([elIcon('foudre')+" Overcharged",'bad']);if(m.harden)c.push([elIcon('feu')+" Molten shell",'bad']);if(m.burrow)c.push([elIcon('glace')+" Burrowed",'bad']);if(m.flying)c.push([uic('s_fly')+" In flight",'bad']);
 if(m.exhausted)c.push([uic('s_tired')+" Exhausted",'good']);if(m.trapped)c.push([icoImg('piege','uic')+" Trapped",'good']);if(m.ko)c.push([uic('s_ko')+" Stunned",'good']);if(m.topple)c.push(["Down",'good']);
 if(m.poisoned)c.push([uic('st_poison')+" Poisoned",'good']);if(m.blind)c.push([icoImg('flash','uic')+" Blinded",'good']);if(m.open)c.push([uic('s_open')+" Opening",'good']);if(m.rock)c.push([uic('s_plates')+" Rock",'']);
 if(m.prep)c.push([uic('s_warn')+" Attack ready",'bad']);
 if(m.phase2)c.push(["🔥 Forge heart",'bad']);else if(m.plates){const n=Object.values(m.plates).filter(p=>p.hp>0).length;c.push([`${uic('s_plates')} Plates ${n}/3`,n?'':'good']);}
 if(m.platesBroken)c.push([`Broken plates: ${m.platesBroken}`,'']);
 {const br=['tete','flanc','queue'].filter(p=>P[p].broken).map(p=>d.parts[p].name.toLowerCase());if(P.queue.severed)br.push("tail severed");if(br.length)c.push([`${uic('s_break')} ${br.join(', ')}`,'']);}
 return c.map(x=>`<span class="chip ${x[1]}">${x[0]}</span>`).join('');}
function minesHTML(){const m=H.m;if(!m.mines||!mineMove(m))return'';const on=m.mines.z.includes(H.zone),bolt=m.mines.mv==='foudre_t';
 if(bolt)return`<div class="irow lavarow"><div class="ih"><b>⚡ Storm lightning</b><span class="ic ${on?'bad':''}">${m.mines.z.map(x=>ZN[x]).join(' · ')}</span><span class="ic tier H">heavy ≈${estDmg(mineMove(m))}</span></div><span class="iz">It strikes this zone before its action: change zones or dodge. Wind: your hits ${m.parts.tete.broken?'−20':'−35'}%.</span></div>`;
 return`<div class="irow lavarow"><div class="ih"><b>💥 Explosive scales</b><span class="ic ${on?'bad':''}">${m.mines.z.length===3?'all zones':m.mines.z.map(x=>ZN[x]).join(' · ')}</span><span class="ic tier H">heavy ≈${estDmg(mineMove(m))}</span><span class="ic">burn</span></div><span class="iz">They explode before its action: leave the zone or dodge.</span></div>`;}
function intentHTML(){const it=H.intent||[];if(!it.length)return'';
 if(passive(it[0])){const mh=minesHTML();return`<div class="intent ${mh?(H.m.mines.z.includes(H.zone)?'':'safe'):'calm'}"><div class="ih"><b>${it[0].n}</b>${it[0].fx==='unaware'?"<span class=\"ic good\">surprise +30%</span>":''}</div><span class="it">${it[0].t}</span>${mh}</div>`;}
 const m=H.m,ecl=m.eclipse>0&&!H.over,hid=mv=>ecl&&mv.d&&!mv.fx;const hit=it.some(mv=>!hid(mv)&&effZones(mv).includes(H.zone));let zc=H.zone;
 const rows=it.map((mv,i)=>{const z=effZones(mv);const ch=[];let note='';
  if(hid(mv)){const hn=H.eHint&&H.eHint[i];ch.push(`<span class="ic tier ${mv.tier}">${TIERN[mv.tier]}</span>`);ch.push(hn==='track'?"<span class=\"ic bad\">it senses you</span>":hn?`<span class="ic">noise: ${ZN[hn]}</span>`:'<span class="ic">unknown zone</span>');
   return`<div class="irow dark"><div class="ih"><b>${i?"Then: ":''}A shadow in the dark</b>${ch.join('')}</div><span class="it">${hn==='track'?"You feel its gaze on you, somewhere in the darkness…":"You can only make out a movement, and a sound coming from somewhere…"}</span></div>`;}
  if(mv.fx==='windup')note="Devastating attack next turn: make it flinch or get out of its reach.";
  else if(mv.fx==='fly')note=FEM[H.m.id]?"It takes flight: your hits will be halved. Use a flash bomb to bring it down.":"It takes flight: your hits will be halved. Use a flash bomb to bring it down.";
  else if(mv.fx==='eat')note="It’s about to eat the stolen item and heal: make it flinch to stop it.";
  else if(mv.fx==='rock')note="It shields its head with a rock. No attack this turn.";
  else if(mv.fx==='bristle')note="It bristles: for 3 turns, melee hits hurt you. Blunt hits break the spines; ranged shots avoid them.";
  else if(mv.fx==='stance')note="Counter stance: if you attack this turn, it parries (−65%) and counters hard. Guard, move or sharpen: it will be exposed afterward.";
  else if(mv.fx==='eclipse')note="It plunges the arena into darkness: for a few turns, you won’t see where it strikes. A flash bomb dispels the Eclipse.";
  else if(mv.fx==='storm')note="It summons the storm: your hits will lose power and lightning will strike your zone every turn. Move!";
  else if(mv.fx==='mines')note=mv.all?"It covers the whole arena in scales: dodge next turn.":"It scatters scales that will explode next turn, before its action.";
  else if(mv.fx==='charge')note="It overcharges: stronger for 8 turns, head exposed. No attack this turn.";
  else if(mv.fx==='plate')note="Its plates reform. No attack: hit whatever is exposed.";
  else if(mv.fx==='phase')note="Roar across all zones, then the ground turns molten.";
  else if(mv.fx&&mv.fx!=='roar')note="No attack this turn: make the most of it.";
  else{if(mv.track)ch.push(`<span class="ic bad">follows you</span>`);else if(farAway(mv))ch.push(`<span class="ic good">in melee · out of reach</span>`);else ch.push(`<span class="ic ${z.includes(H.zone)?'bad':''}">${z.length===3?'all zones':z.map(x=>ZN[x]).join(' · ')}</span>`);
   if(mv.d)ch.push(`<span class="ic tier ${mv.tier}">${TIERN[mv.tier]} ≈${estDmg(mv)}</span>`);if(mv.st)ch.push(`<span class="ic">${STATN[mv.st]}</span>`);
   if(mv.fx==='roar')ch.push("<span class=\"ic\">stuns</span>");if(mv.open)ch.push('<span class="ic good">opening</span>');}
  let mvTxt='';if(mv.after&&!mv.fx){const nz=afterZone(zc,mv.after);if(nz!==zc)mvTxt=`<span class="iz mv">↻ You’ll end up ${nz==='avant'?"to the front":nz==='arriere'?"to the rear":"on the flank"}.</span>`;zc=nz;}
  return`<div class="irow"><div class="ih"><b>${i?"Then: ":''}${mv.n}</b>${ch.join('')}</div><span class="it">${mv.t}</span>${note?`<span class="iz">${note}</span>`:''}${mvTxt}</div>`;}).join('');
 const lava=m.lava?`<div class="irow lavarow"><div class="ih"><b>🔥 Molten ground</b><span class="ic ${m.lava===H.zone?'bad':''}">${ZN[m.lava]}</span><span class="ic">≈${Math.round(m.d.lv*1.5*100/(100+H.stats.def))} + burn</span></div><span class="iz">Leave the zone before the turn ends: dodging doesn’t protect you from the ground.</span></div>`:'';
 const mh=minesHTML(),onMine=!!(m.mines&&m.mines.z.includes(H.zone));const danger=hit||m.lava===H.zone||onMine;
 const stc=it.some(x=>x.fx==='stance');
 return`<div class="intent ${ecl&&it.some(hid)?'dark':danger||stc?'':'safe'}"><span class="verdict">${ecl&&it.some(hid)?"In the dark":stc?"Don’t strike":hit?"You are targeted":onMine?(m.mines.mv==='foudre_t'?"Lightning is targeting you":"Scales under you"):m.lava===H.zone?"Burning ground":"Out of reach"}</span>${rows}${mh}${lava}</div>`;}
function weaponGauge(){const W=H.stats.w,w=H.w;
 if(W.type==='ig')return`<div class="brow"><span>Extr.</span><div class="pips">${['r','w','o'].map(k=>`<i class="${w.ex[k]>0?'on':''}" style="${w.ex[k]>0?'background:'+EXTR[k].c+";box-shadow:inset 0 0 0 1px #0004":''}"></i>`).join('')}</div><em style="white-space:nowrap">${w.air?"Airborne":triple()?"Triple ✓":''}</em></div>`;
 if(W.type==='sa')return`<div class="brow"><span>${w.mode==='sword'?"Sword":"Axe"}</span>${bar(w.sw,100,'sp')}<em>Phial ${w.sw}</em></div>`;
 if(W.type==='cb')return`<div class="brow"><span>${w.mode==='sword'?"Sword":"Axe"}</span><div class="pips">${Array.from({length:CB_PH},(_,i)=>`<i class="${i<w.ph?'on':''}" style="${i<w.ph?'background:#d8342a':''}"></i>`).join('')}</div><em style="white-space:nowrap">En. ${w.en}</em></div>`;
 if(W.type==='gl')return`<div class="brow"><span>Shells</span><div class="pips">${Array.from({length:glCap()},(_,i)=>`<i class="${i<w.shells?'on':''}"></i>`).join('')}</div><em>${w.wf?"Fire "+w.wf:"Fire ✓"}</em></div>`;
 if(W.type==='hh'){const n=w.notes||[],sg=songOf(n);return`<div class="brow"><span>Notes</span><div class="pips">${[0,1,2].map(i=>`<i style="${n[i]?'background:'+NOTES[n[i]].c:''}"></i>`).join('')}</div><em>${sg?sg.n:''}</em></div>`;}
 if(isGun(W.type)){const a=w.ammo||'norm',cap=ammoCap(a);return`<div class="brow"><span>Mag.</span><div class="pips">${Array.from({length:cap},(_,i)=>`<i class="${i<w.mag?'on':''}"></i>`).join('')}</div><em>${AMMO[a].n.slice(0,5)}.</em></div>`;}
 if(W.type==='bow')return`<div class="brow"><span>Bow</span><div class="pips">${[1,2,3].map(i=>`<i class="${w.charge>=i?'on':''}"></i>`).join('')}</div><em>${w.charge?"Lv. "+w.charge:''}</em></div>`;
 if(W.type==='ls')return`<div class="brow"><span>Spirit</span>${bar(w.gauge,100,'sp')}<em>Lv. ${w.spirit}</em></div>`;
 if(W.type==='gs'||W.type==='hammer')return`<div class="brow"><span>Charge</span><div class="pips"><i class="${w.charge>=1?'on':''}"></i><i class="${w.charge>=2?'on':''}"></i></div><em>${w.charge?"Lv. "+w.charge:''}</em></div>`;
 if(W.type==='db')return`<div class="brow"><span>Fury</span><div class="pips"><i class="${w.demon?'on':''}" style="width:40px"></i></div><em>${w.demon?"Active":"Inactive"}</em></div>`;
 return'';}
function hunterChips(){const c=[],s=H.s;if(H.defBuff)c.push(["Defense +20",'good']);if(H.song&&H.song.atk>0)c.push([`${uic('s_song')} Might ${H.song.atk}`,'good']);if(H.song&&H.song.def>0)c.push([`${uic('s_song')} Bulwark ${H.song.def}`,'good']);
 if(s.bulle)c.push([`${uic('s_bulle')} Bubbles ${s.bulle}`,'bad']);if(s.slime)c.push([uic('s_warn')+" Gel: dodge!",'bad']);if(s.virus)c.push([`${uic('s_rage')} Frenzy ${s.virus} · ${Math.min(99,Math.round((H.virusD||0)/(H.m.max*.035)*100))}%`,'bad']);if(H.fren>0)c.push([`${uic('s_rage')} Overcome +15% · ${H.fren}`,'good']);if(s.burn)c.push([elIcon('feu')+" Burn",'bad']);if(s.poison)c.push([uic('st_poison')+" Poison",'bad']);if(s.gel)c.push([elIcon('glace')+" Frost",'bad']);if(s.tet)c.push([uic('s_deaf')+" Stunned",'bad']);if(s.para)c.push([s.why==='sleep'?uic('st_sleep')+" Asleep":s.why==='down'?uic('s_down')+" Knocked down":uic('st_para')+" Paralyzed",'bad']);
 if(H.atkBuff)c.push([icoImg('grain','uic')+" Attack +10%",'good']);if(H.elan>0)c.push([`${uic('s_elan')} Momentum +${20+10*H.stats.sk.esquive}%`,'good']);if(H.riposte>0)c.push([`${uic('s_riposte')} Counter +${Math.round((GUARD.rip+GUARD.lv*H.stats.sk.garde)*100)}%`,'good']);if(H.trap)c.push([icoImg('piege','uic')+" Trap set",'good']);if(H.w&&H.w.siege)c.push([uic('s_siege')+" Siege +50%",'good']);if(H.w&&H.w.shield>0)c.push([`${uic('s_plates')} Shield charged ${H.w.shield}`,'good']);if(H.coat)c.push([`${icoImg(H.coat.k,'uic')} ${H.coat.k==='fiole_p'?"Might":"Poison"} ×${H.coat.n}`,'good']);if(H.grab)c.push([uic('s_grab')+" Grabbed",'bad']);if(H.felyne)c.push([H.felyne.n,'']);if(H.pal){const P=H.pal;c.push([P.ko?`${uic('cat_'+palS().voc)} down (${P.ko})`:`${uic('cat_'+palS().voc)} ${Math.max(0,Math.round(P.hp))}/${P.max}${P.lure?" · decoy":''}`,P.ko?'bad':P.hp<P.max*.35?'bad':'']);}
 return c.map(x=>`<span class="chip ${x[1]}">${x[0]}</span>`).join('');}
function getActions(){const W=H.stats.w,T=W.type,w=H.w,st=H.st,A=[];const add=(id,label,sub,dis,cls)=>A.push({id,label,sub,dis,cls});
 if(T==='gs'){if(w.charge>0)add('release',w.charge===2?"True charged slash":"Charged slash",w.charge===2?"Max power, makes it flinch":"Strikes before the monster",false,'hot');else add('slash',"Vertical slash","Powerful blow");
  {const cc=chargeCost(T);if(w.charge<2)add('charge',w.charge?"Keep charging":"Charge",`${cc} stam. A hit taken cancels it, unless guarding`,st<cc);}
  add('tackle',"Shoulder charge","12 stam. Keeps the charge, takes ½ damage",st<12);}
 if(T==='ls'){add('entaille',"Cut","Fills the spirit gauge");add('esprit',"Spirit slashes","3 hits, gauge ≥ 35",w.gauge<35);
  add('circ',"Spinning slash","Gauge ≥ 60, spirit level +1",w.gauge<60,w.gauge>=60?'hot':'');
  add('fore',"Foresight Slash",w.fcd?`Ready in ${w.fcd} turn${w.fcd!==1?'s':''}`:"15 stam. Dodge and counter the incoming attack",w.fcd>0||st<15);}
 if(T==='sns'){add('combo',"Slashing combo",'2 quick hits');add('shield',"Shield bash","Strikes while guarding: blocks light and medium");add('leap',"Leaping slash","15 stam. Heavy blow",st<15);}
 if(T==='db'){if(!w.demon){add('combo',"Combo",'3 hits');add('demon',"Furious Mode","Stronger hits, −12 stam./turn",st<20);}
  else{add('combo',"Demon blades",'4 hits');add('dance',"Demon dance","30 stam. 6 hits",st<30,'hot');add('demon',"Leave Furious Mode","Exit spin");}}
 if(T==='hammer'){if(w.charge>0)add('release',w.charge===2?"Great spin":"Rising strike","Release: big head KO",false,'hot');else add('strike',"Hammer blow","Blunt, head KO");
  {const cc=chargeCost(T);if(w.charge<2)add('charge',w.charge?"Keep loading":"Load",`${cc} stam. Moving or dodging keeps the charge`,st<cc);}add('bash',"Side strikes",'2 quick hits');}
 if(T==='hh'){const sg=songOf(w.notes);add('red',"Strike ♪","Red note · head KO");add('blue',"Double strike ♪","Blue note · 2 hits");add('yellow',"Rising ♪","10 stam. · yellow note",st<10);add('play',"Recital",sg?`Plays: ${sg.n}`:"2 notes needed",!sg,sg?'hot':'');}
 if(T==='ig'){const red=w.ex.r>0,k=extOf(targetPart()),vc=vaultCost();if(w.air)add('aerial',"Aerial attack","Hits the head · mount",false,'hot');
  add('combo',red?"Red combo":"Combo",red?'4 hits':'3 hits');add('kin',"Beetle",`${EXTR[k].n[0].toUpperCase()+EXTR[k].n.slice(1)} extract${w.ex[k]>0?' ('+w.ex[k]+')':''}`,false,w.ex[k]>0?'':'hot');
  add('vault',"Leap",`${vc} stam. · dodge, airborne`,st<vc||H.s.tet>0,'def');}
 if(T==='sa'){if(w.mode==='axe'){add('axe',"Axe slash","+10 gauge");add('wild',"Wild swings","14 stam. · +20 gauge",st<14);add('morph',"Morph",w.sw>=30?"→ sword":"Gauge ≥ 30",w.sw<30,w.sw>=70?'hot':'');}
  else{add('slash',"Sword slash",H.stats.w.var==='el'?"−12 gauge · elem. phial":"−12 gauge · +20%");add('zsd',"Discharge",w.sw>=40?"15 stam. · empty":"Gauge ≥ 40",w.sw<40||st<15,w.sw>=70?'hot':'');add('morph',"Morph","→ axe");}}
 if(T==='cb'){if(w.mode==='sword'){add('slash',"Slash","+34 energy");if(w.ph>=CB_PH)add('charge',"Charge shield",`Guarding · ${12+prolong()} turns`,false,'hot');else{const n=Math.min(CB_PH-w.ph,Math.floor(w.en/20));add('charge',"Charge phials",n>0?`Free · +${n} phial${n!==1?'s':''}`:"Energy ≥ 20",n<=0,w.en>=80?'hot':'');}add('morph',"Morph",w.ph?"→ axe":"→ axe, no phial");}
  else{add('dis',w.ph?"Discharge":"Axe strike",w.ph?'1 phial explodes':"No phials left");add('saed',"Ult. discharge",w.ph?`15 stam. · ${w.ph} phial${w.ph!==1?'s':''}`:"No phials",!w.ph||st<15,w.ph>=CB_PH?'hot':'');add('morph',"Morph","→ sword and guard");}}
 if(T==='gl'){add('estoc',"Thrust",'2 hits');add('obus',"Shell shot",w.shells?`Shells ${w.shells}/${glCap()} · fixed damage`:"No shells left",!w.shells);add('salve',"Volley",w.shells>1?`${w.shells} shells at once`:'2 shells minimum',w.shells<2);
  add('reload',"Reload",w.shells>=glCap()?"Shells full":`→ ${glCap()} shells`,w.shells>=glCap(),w.shells?'':'hot');add('wf',"Cannon breath",w.wf?`Cooling: ${w.wf} turn${w.wf!==1?'s':''}`:"Explosion, makes it flinch",w.wf>0,w.wf?'':'hot');
  if(ranged()){const far=!H.close;for(const a of A)if((a.id==='estoc'||a.id==='wf')&&far){a.dis=true;a.cls='';a.sub="Melee only";}if(H.close)add('reculer',"Back off","Regain your distance",false,'def');}}
 if(T==='lance'){add('estoc',"Thrust",'2 hits');add('charge',"Lance charge","22 stam. · 3 hits",st<22);add('counter',"Counter",w.ccd>0?"Recovers: 1 turn":"12 stam. · block and counter",st<12||w.ccd>0,'def');}
 if(T==='hbg'){const a=w.ammo||'norm',cap=ammoCap(a),left=ammoLeft(a);add('tir',a==='norm'?"Heavy shot":`${AMMO[a].n.toLowerCase()} shot`,w.mag?`Magazine ${w.mag}/${cap}`:"Magazine empty",!w.mag,w.siege?'hot':'');
  add('burst',"Full charge",w.mag>=2?`${w.mag} shots at once`:"Magazine too low",w.mag<2,w.mag>=cap&&cap>1?'hot':'');
  add('reload',"Reload",left<=w.mag?(left?"Magazine full":"No ammo left"):`→ ${Math.min(cap,left)} ${AMMO[a].n.toLowerCase()} ammo`,Math.min(cap,left)<=w.mag,w.mag?'':'hot');
  if(w.siege)add('unsiege',"Leave siege","Free",false,'def');else add('siege',"Siege mode","+50% damage, motionless",false,'');
  const ci=AMMO_ORDER.indexOf(a),nx=[1,2,3].map(i=>AMMO_ORDER[(ci+i)%AMMO_ORDER.length]).filter(k=>ammoOk(k));add('ammo',"Ammo ▸",nx.length?`${AMMO[a].n} → ${AMMO[nx[0]].n}`:AMMO[a].n,!nx.length);if(H.close)add('reculer',"Back off",w.siege?"Impossible in siege":"Regain your distance",w.siege,'def');}
 if(T==='lbg'){const a=w.ammo||'norm',cap=ammoCap(a),left=ammoLeft(a);add('tir',a==='norm'?"Fire":`${AMMO[a].n.toLowerCase()} shot`,w.mag?`Magazine ${w.mag}/${cap}`:"Magazine empty",!w.mag,'');
  add('reload',"Reload",left<=w.mag?(left?"Magazine full":"No ammo left"):`→ ${Math.min(cap,left)} ${AMMO[a].n.toLowerCase()} ammo`,Math.min(cap,left)<=w.mag,w.mag?'':'hot');
  {const rc=rollCost(),dc=dodgeCost(),cd=w.rcd>0;if(w.mag||Math.min(cap,left)<=w.mag)add('roll',"Shot and roll",cd?"Recovers: 1 turn":`${rc} stam. Shoot and dodge`,!w.mag||st<rc||H.s.tet>0||cd,'def');else add('rreload',"Roll and reload",cd?"Recovers: 1 turn":`${dc} stam. Dodge and reload`,st<dc||H.s.tet>0||cd,'def');}
  const ci=AMMO_ORDER.indexOf(a),nx=[1,2,3].map(i=>AMMO_ORDER[(ci+i)%AMMO_ORDER.length]).filter(k=>ammoOk(k));add('ammo',"Ammo ▸",nx.length?`${AMMO[a].n} → ${AMMO[nx[0]].n}`:AMMO[a].n,!nx.length);if(H.close)add('reculer',"Back off","Regain your distance",false,'def');}
 if(T==='bow'){const c=w.charge;add('tir',c?`Charged shot Lv. ${c}`:"Shot",c?"Releases the charge":"Arrow volley",false,c>=2?'hot':'');
  {const cc=chargeCost(T);if(c<3)add('charge',c?"Keep drawing":"Draw the bow",`${cc} stam. Next shot is stronger`,st<cc);}
  add('disperse',"Spread shot","20 stam. Hits 2 parts",st<20);if(H.close)add('reculer',"Back off","Regain your distance",false,'def');}
 const dc=dodgeCost();add('dodge',"Dodge",H.w.siege?"Impossible in siege":H.s.tet?"Impossible: stunned":`${dc} stam. Avoids everything this turn`,st<dc||H.s.tet>0||!!H.w.siege,'def');
 if(WT[T].g&&!(T==='cb'&&w.mode==='axe')){const it=H.m.eclipse>0?null:(H.intent||[]).find(x=>x.tier&&effZones(x).includes(H.zone));const b=it?Math.round(guardBlock(it.tier,T)*100):null;H._gb=b==null?(T==='sns'?'lm':'l'):b;
  add('guard',"Guard",`${b==null?(T==='sns'?"Blocks light and medium":"Blocks light hits"):b>=100?"Blocks this hit entirely":`Blocks ${b}% of this hit`}, then counter +${Math.round((GUARD.rip+GUARD.lv*H.stats.sk.garde)*100)}%`,st<5,'def');}
 if(!WT[T].ranged)add('sharpen',"Sharpen","Sharpness at maximum",H.sharp>=W.total);
 if(H.sup&&H.sup.baliste>0)add('baliste',"Ballista",`Heavy shot, cracks plates (×${H.sup.baliste})`,false,'hot');
 return A;}
const ACT_INFO={
 'gs:slash':["Heavy blow","Powerful vertical strike, no wind-up. Useful when you have no time to charge."],
 'gs:release':["Release","Releases the stored charge. Level 2: huge damage, boosted element (×3.2) and a high chance to make the monster flinch, canceling its attack."],
 'gs:charge':["10 stam.","Builds one charge level (max 2). A hit taken breaks the charge. Guarding, dodging or the shoulder charge keep it."],
 'gs:tackle':["12 stam. · ½ damage","Blunt shoulder charge that keeps your charge. If the monster hits you this turn, you take only half damage."],
 'ls:entaille':["+ spirit","Two quick cuts that fill the spirit gauge by 20."],
 'ls:esprit':['gauge 35',"Three spirit-fueled slashes. Uses 35 gauge."],
 'ls:circ':["gauge 60 · lv. +1","Uses 60 gauge and raises your spirit level (max 3): each level adds 5% damage. The level drops after 8 turns without a spinning slash."],
 'ls:fore':["15 stam. · counter","Counter stance: if the monster targets you this turn, you dodge and counter automatically, and the spirit gauge fills. 4-turn cooldown."],
 'sns:combo':['2 hits',"Two quick slashes."],
 'sns:shield':["guard · KO","Blunt shield bash that stuns at the head. You guard at the same time: light and medium hits are blocked."],
 'sns:leap':["15 stam.","Leaping slash, the Sword & Shield’s heaviest hit."],
 'db:combo':['flurry',"A chain of quick hits, ideal for applying element. In Furious Mode: 4 stronger hits."],
 'db:demon':["−12 stam./turn","Enters or leaves Furious Mode: stronger hits and the demon dance, but stamina drops every turn. The mode ends at 0 stamina."],
 'db:dance':["30 stam. · 6 hits","Demon dance: six hits, the best way to apply element. Furious Mode only."],
 'hammer:strike':["head KO","Blunt hit. On the head, it builds up stun: a stunned monster can’t act for 2 turns."],
 'hammer:release':["Release · KO","Level 1: rising strike, big stun. Level 2: great spin in three hits. Both easily make it flinch."],
 'hammer:charge':["8 stam.","Loads the hammer (2 levels). You can move and dodge without losing the charge."],
 'hammer:bash':['2 hits',"Two quick side strikes, with a little stun."],
 'lbg:tir':['1 volley',"Fires a volley of the loaded ammo at the targeted part. Normal: 2 rounds. Piercing: hits the head, arms and tail. Elemental: amplifies the weapon’s element. Sleep: puts the monster to sleep over time."],
 'lbg:reload':["1 turn","Fills the magazine with the chosen ammo. Normal ammo is unlimited; the others are crafted at the Workshop (Ammo tab)."],
 'lbg:roll':["dodge · every other turn","A slightly weaker volley (−30%), then a roll: you dodge everything targeting you this turn. Costs 5 more stamina than a dodge, and you need a turn to recover before rolling again."],
 'lbg:rreload':["dodge · every other turn","Magazine empty: you roll while reloading. You dodge everything targeting you this turn and the magazine is full next turn. Costs the same as a dodge, and you need a turn to recover before rolling again."],
 'hbg:tir':['1 volley',"A heavy volley at the targeted part (2 powerful rounds with normal ammo). In siege mode: +50%."],
 'hbg:burst':["whole magazine","Empties the whole magazine in one burst at the targeted part and often makes the monster flinch, canceling its announced attack. Ideal against a readied attack."],
 'hbg:reload':["1 turn","Refills the magazine (smaller than the Light Blunderbuss’s)."],
 'hbg:siege':["1 turn","You dig in: +50% damage on all your shots, but no dodging, moving or backing off. You can still guard."],
 'unsiege':['free',"Leaves siege mode without using your turn: you can then dodge or move."],
 'hbg:ammo':['free',"Switches to the next available ammo without using your turn. The magazine is emptied: reload afterward."],
 'lbg:ammo':['free',"Switches to the next available ammo without using your turn. The magazine is emptied: reload afterward."],
 'hh:red':['red note',"Blunt strike that stuns at the head. Plays a red note."],
 'hh:blue':['blue note',"Two quick hits. Plays a blue note."],
 'hh:yellow':["10 stam. · yellow note","Powerful rising strike, heavy stun. Plays a yellow note."],
 'hh:play':["melody","Strikes, then plays the melody of your last two notes. Red + blue: Might (+15% attack, 6 turns). Blue + yellow: Bulwark (+25 defense, 6 turns). Yellow + red: Heal (+25 HP, Griffu included)."],
 'ig:combo':['3 hits',"A quick combo. With the red extract: 4 hits, and +10% attack."],
 'ig:kin':['extract',"Strikes and sends the beetle at the part in your zone: it brings back an extract for 10 turns. Head: red (attack +10%, longer combo). Arms: white (cheaper leap and dodge). Back: orange (defense +20). All three: Triple extract, an extra +10% attack."],
 'ig:vault':["dodge · airborne","You vault off your glaive: like a dodge, nothing hits you this turn, for less stamina. Next turn, you can use Aerial attack."],
 'ig:aerial':["head · mount","Right after a leap: hits the head from any zone, with no penalty against a flying monster. Each aerial attack builds toward a mount; after a few, you mount the monster and it falls (2 turns down)."],
 'sa:axe':["+10 gauge","A big axe swing. Fills the phial gauge by 10."],
 'sa:wild':["14 stam. · +20 gauge","Three wild axe swings: they fill the phial gauge by 20."],
 'sa:morph':["switches mode","Strikes while changing form. Axe → sword: gauge ≥ 30. Sword → axe: always possible. In sword form, your hits are boosted by the phial (power: +20%; element: element ×1.7), but drain the gauge."],
 'sa:slash':["−12 gauge","Two sword slashes boosted by the phial (power: +20%; element: element ×1.7). Uses 12 gauge; when the gauge is empty, the weapon folds back into an axe."],
 'sa:zsd':["empties the gauge","Element discharge: you plant the blade and unleash the whole phial. The fuller the gauge, the stronger the final explosion; it often makes the monster flinch. The weapon then reverts to axe form."],
 'cb:slash':["+34 energy","Two sword slashes that build 25 energy. Blocking a hit while guarding also grants 15."],
 'cb:charge':["energy → phials","Converts energy into phials (1 per 20, max 5) without using your turn. With full phials, you charge the shield while guarding (you guard that turn). For 12 turns, your guard is stronger and your phials explode 30% harder."],
 'cb:morph':["switches mode","Strikes while changing form. Sword: guard and energy. Axe: no guard, but discharges detonate the phials."],
 'cb:dis':['1 phial',"An axe strike that detonates a phial: fixed damage (ignores part hardness and sharpness) and stun at the head. Without a phial, a plain axe strike."],
 'cb:saed':["all phials","Ultimate discharge: a huge strike that blows all your phials at once (fixed damage, stuns at the head, makes it flinch). You then switch back to sword."],
 'gl:estoc':['2 hits',"Two quick thrusts."],
 'gl:obus':["fixed damage","Fires a shell: fixed damage based on your attack, ignoring part hardness and sharpness. Ideal against a carapace, an iron plate or with worn sharpness."],
 'gl:salve':["whole magazine","Fires all your shells at once (slightly less per shell)."],
 'gl:reload':["1 turn","Reloads all your shells (5 normal, 3 long or 2 wide depending on the weapon)."],
 'gl:wf':["cools 6 turns","Cannon breath: a huge fixed-damage blast that makes the monster flinch (often canceling its attack). The Shell Lance must then cool for 6 turns."],
 'lance:estoc':['2 hits',"Two quick thrusts."],
 'lance:charge':["22 stam. · 3 hits","A three-hit charge, the lance’s biggest combo."],
 'lance:counter':["12 stam. · every other turn","Counter stance: if the monster targets you this turn, you fully block the hit and counter hard (and your next attack gets the counter bonus). Otherwise, the counter is wasted. You need a turn to get back into stance."],
 'bow:tir':["volley","A volley of arrows at the targeted part. When drawn, the bow fires more arrows, harder (level 3: 5 powerful arrows). Arrows don’t sever the tail but do break parts."],
 'bow:charge':["10 stam.","Draws the bow one level (max 3). A hit taken releases the tension; a dodge, however, draws the bow one more level."],
 'bow:disperse':["20 stam. · 2 parts","Three arrows at the targeted part and two at another part, preferably unbroken. Also benefits from the charge level."],
 'reculer':['distance',"You back off to the outer ring: melee hits can no longer reach you. It’s the only way to leave melee."],
 'dodge':[null,"Dodges everything targeting you this turn. A successful dodge grants momentum: +20% on your next attack. Impossible while stunned."],
 'guard':[null,"Guard: fully blocks light hits (and medium ones with a shield), reduces the rest. Blocking sets up a counter on your next attack. Dodging is still better against heavy hits."],
 'sharpen':['max sharpness',"Restores full sharpness. Low sharpness reduces damage and makes hits bounce off hard parts."],
 'baliste':[null,"Fire the rampart ballista: heavy damage on the part in your zone, and it cracks iron plates. Limited bolts."],
 'struggle':["turn lost","Paralyzed: you can’t do anything this turn."]};
function actInfo(a){const T=H.stats.w.type;return ACT_INFO[T+':'+a.id]||ACT_INFO[a.id]||[null,a.sub||''];}
function shortOf(a){const[s]=actInfo(a);const w=H.w;if(a.id==='charge'&&['gs','hammer','bow'].includes(H.stats.w.type))return`${chargeCost(H.stats.w.type)} stam.`;if(H.stats.w.type==='ig'&&['kin','vault'].includes(a.id)&&!a.dis)return a.id==='vault'?`${vaultCost()} stam. · dodge`:a.sub;if((H.stats.w.type==='sa'&&['morph','zsd'].includes(a.id))||(H.stats.w.type==='cb'&&['charge','dis','saed','morph'].includes(a.id)))return a.sub;if(H.stats.w.type==='gl'&&['obus','salve','reload','wf','estoc'].includes(a.id)&&(a.id!=='estoc'||a.dis))return a.sub;if(H.stats.w.type==='hh'&&a.id==='play')return a.sub;if(isGun(H.stats.w.type)&&['tir','reload','ammo','burst','unsiege'].includes(a.id))return a.sub;
 if(a.dis){if(a.id==='dodge'&&H.w.siege)return"in siege";if(a.id==='dodge'&&H.s.tet)return"stunned";if(a.id==='fore'&&w.fcd)return`in ${w.fcd} turn${w.fcd!==1?'s':''}`;if(a.id==='sharpen')return"already sharp";if(a.id==='esprit'||a.id==='circ')return`gauge ${Math.round(w.gauge)}`;return'stamina';}
 if(a.id==='dodge')return`${dodgeCost()} stam.`;if(a.id==='guard'){const g=H._gb;return g==='lm'?"light, medium":(g==='l'||g==null)?"light hits":g>=100?'blocks all':`blocks ${g}%`;}
 if(a.id==='baliste')return`×${H.sup.baliste}`;return s||'';}
function withEst(A){const T=H.stats.w.type,w=H.w;for(const a of A){
 if(a.id==='charge'){const nx=weaponMove(T==='bow'?'tir':'release',w.charge+1);if(nx)a.est='→ '+estHits(nx.hits);continue;}
 if(['reculer','ammo','reload','rreload','siege','unsiege'].includes(a.id))continue;
 if(a.id==='wf'&&H.w.wf)continue;
 if(a.id==='disperse'){const mv=weaponMove('disperse');a.est='≈ '+(estHits(mv.hits)+estHits(mv.extra));continue;}
 if(['dodge','guard','sharpen'].includes(a.id))continue;if(a.id==='baliste'){a.est='≈ '+Math.round(H.m.max*.035*(H.m.open>0?1.25:1));continue;}const mv=weaponMove(a.id);if(mv)a.est='≈ '+(mv.pierce?['tete','flanc','queue'].reduce((t,p)=>t+mv.hits.reduce((s,hh)=>s+calcDmg(hh,p,true).dmg,0),0)|0:estHits(mv.hits,mv.pid));}return A;}
function actionsHTML(){if(H.grab>0)return`<button class="act wide hot" data-a="h" data-v="struggle" data-lp="struggle"><b>Struggle!</b><small>${H.st>=35?"Enough stamina to break free (−35)":"Stamina too low: count on your Griffu"}</small></button>`;if(H.s.para>0)return`<button class="act wide hot" data-a="h" data-v="struggle" data-lp="struggle"><b>${H.s.why==='sleep'?"Asleep…":H.s.why==='down'?"Knocked down…":"Paralyzed…"}</b><small>${H.s.why==='sleep'?"You lose this turn. A hit taken will deal +50% damage.":"You lose this turn"}</small></button>`;
 const m=H.m;const fl=m.flying&&pouchLeft('flash')>0&&!itemBlock('flash')?`<button class="act wide hot flashq" data-a="use" data-v="flash">${itemIcon('flash','iicon big')}<span><b>Throw a flash bomb</b><small>Makes it crash to the ground: 2 turns to strike (×${pouchLeft('flash')})</small></span></button>`:'';
 H._acts=withEst(getActions());
 return fl+H._acts.map(a=>`<button class="act ${a.cls||''}${a.dis?' off':''}" data-a="h" data-v="${a.id}" data-lp="${a.id}" ${a.dis?'aria-disabled="true"':''}>${a.est?`<i class="est">${a.est}</i>`:''}<b>${a.label}</b><small class="sh">${esc(shortOf(a))}</small></button>`).join('')+
 `<button class="act" data-a="pouch" data-lp="pouch"><b>Items</b><small class="sh">${H.stats.w.type==='sns'&&!H.freeItem?'1 free':'pouch'}</small></button>`;}
function openActDetail(id){if(!H)return;if(id==='pouch'){modal(`<h2>Items</h2><p>Opens the pouch: potions, antidotes, bombs, traps. Using an item takes your turn${H.stats.w.type==='sns'?", except the first one each turn with the Sword & Shield":''}.</p><button class="btn wide" data-a="close">Close</button>`);return;}
 const a=(H._acts||[]).find(x=>x.id===id)||{id,label:id,sub:''};const[,long]=actInfo(a);
 modal(`<h2>${esc(a.label)}</h2>${a.est?`<p class="adest">Estimated damage: <b>${esc(a.est.replace('≈ ','≈ ').replace('→ ',"after charge: "))}</b> on ${esc(H.m.d.parts[targetPart()].name.toLowerCase())}</p>`:''}
 ${a.sub?`<p class="adsub">${esc(a.sub)}</p>`:''}<p>${esc(long)}</p>${a.dis?`<p class="small" style="color:var(--danger)">Unavailable for now: ${esc(shortOf(a))}.</p>`:''}
 <div style="display:flex;gap:8px;margin-top:10px"><button class="btn wide" data-a="close">Close</button>${a.dis?'':`<button class="btn main wide" data-a="h" data-v="${a.id}">Use</button>`}</div>`);}
function logHTML(){const L=H.log;let o='';for(let i=Math.max(0,L.length-80);i<L.length;i++){const e=L[i];o+=`<div class="le ${e.c} ${i>=H.mark?'new':''}">${esc(e.m)}</div>`;}return o;}
function recapHTML(){const L=H.log.slice(H.mark).filter(e=>e.c!=='sep');if(!L.length)return'';const show=L.slice(-6);
 return`<div class="recap">${L.length>show.length?'<div class="le muted">…</div>':''}${show.map(e=>`<div class="le new ${e.c}">${esc(e.m)}</div>`).join('')}</div>`;}
function aimHTML(){const m=H.m,rec=S.mon[m.id]||{},known=(rec.kills||0)+(rec.caps||0)>0||H.q.training,tp=targetPart();
 return`<div class="aimrow"><span>Aim</span>${['tete','flanc','queue'].map(p=>`<button class="aimb ${p===tp?'on':''}" data-a="aim" data-v="${p}">${esc(m.d.parts[p].name)}${known?` <i>${hzStars(hz(p,'cut'))}</i>`:''}</button>`).join('')}</div>`;}
function targetHTML(){const m=H.m,W=H.stats.w;if(ranged())return`<div class="target">${H.close?"<b style=\"color:var(--danger)\">↔ In melee</b>":"At range"}${m.parts.tete&&targetPart()==='tete'&&m.rock>0?", head protected":''}</div>`;let pid=ZPART[H.zone];if(m.flying)pid='flanc';const P=m.d.parts[pid];
 const type=(W.type==='hammer'||W.type==='hh')?'blunt':'cut';const rec=S.mon[m.id]||{};const known=(rec.kills||0)+(rec.caps||0)>0||H.q.training;
 let t=`Target: <b>${esc(P.name)}</b>`;if(m.flying)t+=" (in flight, reduced damage)";
 if(pid==='tete'&&m.rock>0)t+=", shielded by the rock";
 if(known)t+=` <span class="star" title="${type==='cut'?'Cutting':'Blunt'} effectiveness">${hzStars(hz(pid,type))}</span>`;
 else t+=" <span class=\"muted\">(unknown effectiveness)</span>";
 return`<div class="target">${t}</div>`;}
function endPanelHTML(){const r=R;if(!r)return'';const nm=H.m.d.name;
 const title=r.kind==='kill'?`${nm} is slain!`:r.kind==='capture'?`${nm} is captured!`:"Quest failed";
 const detail=r.kind==='kill'?(r.blow?`Finishing blow: ${esc(r.blow)}.`:''):r.kind==='capture'?"The tranq bombs took effect.":esc(r.reason||'');
 const left=r.kind!=='fail'?spotsOf().map((sp,i)=>[sp,i]).filter(([sp,i])=>!H.spots.includes(i)):[];
 const gath=left.length?`<span class="small">Calm returns. You can gather before leaving, with no time limit:</span><div class="spots endspots">${left.map(([sp,i])=>`<button class="spot" data-a="gather" data-v="${i}">${spotIcon(sp.k)}<span><b>${esc(sp.n)}</b><small>${sp.t.map(e=>RES[e[0]].n).join(', ')}</small></span></button>`).join('')}</div>`:'';
 return`<div class="endpanel ${r.kind==='fail'?'lose':'win'}"><b>${title}</b><span>${detail}</span>${gath}<button class="btn main wide" data-a="go" data-v="result">${r.kind==='fail'?"See the summary":"See the rewards"}</button></div>`;}
function resLine(ins){return Object.keys(ins).map(k=>{const have=RES[k]?(S.res[k]||0):(S.items[k]||0);const n=RES[k]?RES[k].n:ITEMS[k].n;return`<span class="${have>=ins[k]?'ok':'no'}">${itemIcon(k,'iicon sm')}${n} ${have}/${ins[k]}</span>`;}).join('');}
function craftRow(rc){const it=ITEMS[rc.out],own=S.items[rc.out]||0,ok=canCraft(rc),fb=fillBatches(rc),full=own>=it.carry;
 return`<div class="row crow${ok?'':' cno'}"><div class="top"><span class="iline">${itemIcon(rc.out,'iicon big')}<span><b>${it.n}${rc.n>1?` ×${rc.n}`:''}</b><span class="small muted">owned: ${own} / ${it.carry}${full?" · pouch full":''}</span><span class="small cdesc">${esc(it.d)}</span></span></span>
 <span class="cbtns"><button class="btn sm${ok?' go':''}" data-a="craft" data-v="${rc.out}" ${ok?'':'disabled'}>Craft</button>${fb>1?`<button class="btn sm" data-a="craftall" data-v="${rc.out}">All (×${fb*(rc.n||1)})</button>`:''}</span></div><div class="recipe">${resLine(rc.ins)}</div></div>`;}
function craftRows(onlyReady){const list=RECIPES.filter(rc=>!onlyReady||canCraft(rc));if(!list.length)return"<p class=\"small muted\">Nothing to craft with your current resources. Gather first.</p>";
 return list.slice().sort((a,b)=>canCraft(b)-canCraft(a)).map(craftRow).join('');}
function vCamp(){const m=H.m,q=H.q;const left=H.max-H.turn;
 const items=ITEM_ORDER.filter(k=>inPouch(k)&&CAMP_OK.includes(k)&&(!['soin','potion','mega'].includes(k)||H.hp<H.hpMax)).map(k=>{const blk=itemBlock(k),it=ITEMS[k];
  return`<button class="item" data-a="use" data-v="${k}" ${blk?'disabled':''}><span class="iline">${itemIcon(k,'iicon big')}<span><b>${it.n}</b><span>${blk||it.d}</span></span></span><b>×${pouchLeft(k)}</b></button>`;}).join('');
 const spots=spotsOf().map((sp,i)=>{const used=H.spots.includes(i);return`<button class="spot" data-a="gather" data-v="${i}" ${used||left<=5?'disabled':''}>${spotIcon(sp.k)}<span><b>${esc(sp.n)}</b><small>${used?"Already gathered":sp.t.map(e=>RES[e[0]].n).join(', ')}</small></span><em>${used?'✓':"1 turn"}</em></button>`;}).join('');
 const own=RES_ORDER.filter(k=>S.res[k]>0&&CRAFT_IN.has(k)).map(k=>`<span class="tag">${itemIcon(k,'iicon sm')}${RES[k].n} ×${S.res[k]}</span>`).join('');
 return`<div class="htop"><div><div class="qt">${esc(q.title)}</div><div class="muted small">Turn ${H.turn} / ${H.max}</div></div><div class="tbtns">${soundBtn()}<button class="btn ghost sm" data-a="abandon">Abandon</button></div></div>
 <div class="mhead"><div><h2 class="mname">Base Camp</h2><div class="muted small">${m.d.name} prowls ${HABN[m.d.hab]}.</div></div><button class="btn ghost sm" data-a="monnotes">Journal</button></div>
 <div class="arena">${arenaSVG()}</div>
 ${recapHTML()}
 <div class="intent calm"><b>It hasn’t spotted you yet</b><span class="it">At camp, using an item or crafting takes no time. Only gathering costs a turn.</span><span class="iz">Tap a zone of the arena to engage from there. From the flank or rear, you strike first (+30%). From the front, it sees you coming.</span></div>
 <div class="engage"><button class="btn main" data-a="engage" data-v="flanc:g">Approach from the flank</button><button class="btn" data-a="engage" data-v="arriere">From the rear</button><button class="btn" data-a="engage" data-v="avant">From the front</button></div>
 <h3>Preparations</h3>${items?`<div class="items">${items}</div>`:"<p class=\"small muted\">No camp-usable items in your pouch.</p>"}
 <p class="small muted">Steak, seeds and potions can be used here without losing a turn. Bombs and the trap are used during the fight.</p>
 <h3>Gathering</h3><div class="spots">${spots}</div>${left<=5?"<p class=\"small muted\">Not enough time left to gather.</p>":''}
 <h3>Crafting</h3>${own?`<div class="skl">${own}</div>`:''}${craftRows(true)}
 <details class="journal"><summary>Hunt log</summary><div class="log">${logHTML()}</div></details>`;}
function vHunt(){if(H.phase==='camp'&&!H.over)return vCamp();if(H.over&&H.phase==='camp')H.phase=null;const m=H.m,W=H.stats.w,hurtNow=H.fx.some(f=>f.t==='hurt');if(H.over&&H.intent)H.intent=[];
 const hpPct=Math.max(0,Math.ceil(H.hp));
 return`<div class="hs">
 <div class="hbar"><div class="hq"><b class="qt">${esc(H.q.title)}</b><span class="muted small">Turn ${H.turn}${H.q.training?'':'/'+H.max}</span></div>
  ${H.q.training?'':`<div class="faints" title="Faints: ${H.faints} of 3">${[0,1,2].map(i=>`<i class="${i<H.faints?'x':''}"></i>`).join('')}</div>`}
  <div class="tbtns">${soundBtn()}${H.q.training?"<button class=\"btn ghost sm\" data-a=\"trainhelp\">Help</button>":"<button class=\"btn ghost sm\" data-a=\"journal\">Log</button>"}${H.q.training?"<button class=\"btn sm trquit\" data-a=\"abandon\">Quit</button>":H.over?'':'<button class="btn ghost sm" data-a="abandon" aria-label="Abandon the quest">✕</button>'}</div></div>
 <div class="mbar"><button class="mtitle" data-a="monnotes"><b>${m.d.name}</b><span>${monCond(m)}</span></button>${(()=>{const c=monChips(m),n=(c.match(/class="chip/g)||[]).length;return`<div class="chips1${n>2?' wide':''}">${c}</div>`;})()}</div>
 <div class="arenabox"><div class="arena">${arenaSVG()}</div></div>
 <div class="infobox">${H.over?'':intentHTML()}${recapHTML()}</div>
 <div class="dock">${H.over?endPanelHTML():`
  <div class="hpanel ${hurtNow?'hurt':''}">
   <div class="bars"><div class="brow"><span>HP</span>${bar(H.hp,H.hpMax,'hp')}<em>${hpPct}</em></div>
   <div class="brow"><span>Stam.</span>${bar(H.st,H.stMax,'st')}<em>${Math.round(H.st)}</em></div>
   ${WT[W.type].ranged?`<div class="brow"><span>Def.</span><em class="left">${H.stats.def}</em></div>`:`<div class="brow"><span>Sharp.</span>${sharpBar(W.sharp,H.sharp)}<em>${SHARP[sharpLevel()].n}</em></div>`}
   ${weaponGauge()||`<div class="brow"><span>Def.</span><em class="left">${H.stats.def}</em></div>`}</div>${ranged()?aimHTML():''}
   <div class="hline">${targetHTML()}${(()=>{const c=hunterChips(),n=(c.match(/class="chip/g)||[]).length;return`<div class="chips1${n>2?' wide':''}">${c}</div>`;})()}</div></div>
  <div class="actions">${actionsHTML()}</div>`}
 </div></div>`;}
function openJournal(){modal(`<h2>Hunt log</h2><div class="log">${logHTML()}</div><button class="btn wide" data-a="close" style="margin-top:10px">Close</button>`);const lg=document.querySelector('#modal .log');if(lg)lg.scrollTop=lg.scrollHeight;}
function afterHunt(){const ar=document.querySelector('.arena');if(!ar||!H)return;let i=0;turnSounds(H.fx);
 for(const f of H.fx){if(!['dmg','weak','hurt','heal','pal'].includes(f.t))continue;const el=document.createElement('span');el.className='float '+f.t;
  el.textContent=f.t==='hurt'?'−'+f.v:f.t==='heal'?'+'+f.v:String(f.v);
  const a=f.me?zAngle(H.zone,H.side):zAngle(f.z,H.side);const[x,y]=f.me?pt(a-22,76):f.t==='pal'?pt(a+28,48):pt(a,60);
  el.style.left=(x/3)+'%';el.style.top=(y/3)+'%';el.style.animationDelay=(i++*.18)+'s';ar.appendChild(el);}
 H.fx=[];const lg=document.querySelector('.log');if(lg)lg.scrollTop=lg.scrollHeight;}

/* ---------- Modales ---------- */
function modal(html){$('#modal').innerHTML=`<div class="backdrop" data-a="close"><div class="sheet" data-a="noop" role="dialog">${html}</div></div>`;}
function closeModal(){$('#modal').innerHTML='';if(screen==='village')setTimeout(checkUrgent,0);}
function openPouch(){const list=ITEM_ORDER.filter(k=>inPouch(k)).map(k=>{const it=ITEMS[k],left=pouchLeft(k),blk=left<=0?"Quest limit reached":itemBlock(k);
 return`<button class="item" data-a="use" data-v="${k}" ${blk?'disabled':''}><span class="iline">${itemIcon(k,'iicon big')}<span><b>${it.n}</b><span>${blk||it.d}</span></span></span><b>×${left}</b></button>`;}).join('');
 const flh=H.stats.w.type==='bow'&&!inPouch('fiole_p')&&!inPouch('fiole_v')?"<p class=\"small muted\">No bow coatings: craft some at the Workshop (Ammo tab).</p>":'';
 modal(`<h2>Pouch</h2>${flh}${H.stats.w.type==='sns'&&!H.freeItem?"<p class=\"small\" style=\"color:var(--good)\">Sword & Shield: your first item this turn doesn’t use up your action.</p>":"<p class=\"small muted\">Using an item takes your turn: the monster acts next.</p>"}
 <div class="items">${list||"<p class=\"muted\">Pouch empty.</p>"}</div><div style="margin-top:12px"><button class="btn wide" data-a="close">Close</button></div>`);}
function openGuide(){modal(`<h2>Hunter’s Guide</h2><ul>
<li><b>At base camp</b>, the monster hasn’t spotted you yet: grab steak and seeds without wasting time, gather (1 turn per spot), craft, then choose how to approach it. From the flank or rear, you strike first.</li>
<li><b>Every turn, the monster announces its attack</b>: the banner describes its move and the targeted zones light up red. You act first, then it strikes.</li>
<li><b>Three zones</b> surround the monster: the front (head), the flank and the rear (tail). You hit the part in your zone. Tap a zone to move there: it takes your turn.</li>
<li><b>Dodging</b> avoids everything that turn, costs stamina, and builds momentum. <b>Guarding</b> (Sword & Shield, Great Sword, Lance, Shell Lance, Shield Axe, Heavy Blunderbuss) fully blocks light hits (and medium ones with a shield), reduces big hits, costs little stamina and sets up a counter. Against heavy hits, dodging is still your best bet.</li>
<li><b>↻ Repositioning</b>: rushes, slides and leaps move the monster, and so your position relative to it. The banner warns you ahead of time and an arrow shows where you’ll land.</li>
<li><b>Making it flinch</b>: dealing heavy damage in one blow, breaking a part or stunning the monster interrupts its announced attack. That’s the key against prepared attacks.</li>
<li><b>Sharpness</b>: your weapon dulls with every hit. Sharpen it, or your blows will bounce off hard parts.</li>
<li><b>Parts</b>: breaking the head or legs, or severing the tail, yields extra materials.</li>
<li><b>Capture</b>: when the monster limps, set a trap, then throw two tranq bombs. Different rewards and a bigger bounty.</li>
<li><b>Fainting</b>: you return to camp (2 turns lost) and the final bounty drops by 25% (50% at most). On the third faint, the quest fails; same if time runs out.</li>
<li>Your hunt is saved every turn: you can close the page and pick up later.</li>
<li><b>The Iron King</b> (★6) is covered in plates: break them, strike the bare flesh, and get off the molten ground in its second phase. The rampart ballista helps you.</li>
<li><b>The Bow</b> fires from afar: pick the targeted part under your gauges, without losing a turn. Melee hits can’t reach you, but charges, breaths, projectiles and arena-wide attacks can, and your defense is reduced. The arena’s outer ring is range, the inner ring is melee; zones turn red according to the attack’s reach. A melee hit aimed at you or a rush pulls you back inside: only “Back off” returns you to range. Draw the bow (a dodge draws it too) and apply coatings crafted at the Workshop.</li>
<li><b>The Light Blunderbuss</b> fires like the bow, from range, but with a magazine: fire, then reload (1 turn). “Ammo ▸” switches ammo without losing a turn. Shot and roll fires and dodges at once. Piercing, elemental and sleep ammo are crafted at the Workshop.</li>
<li><b>The Heavy Blunderbuss</b> uses the light one’s ammo but can’t roll: it has a guard, a siege mode (+50% damage, motionless; leaving it is free) and Full charge, which empties the magazine in one blast and makes the monster flinch.</li>
<li><b>The Hunting Horn</b> stuns like the hammer; each hit plays a note, and Recital plays the melody of the last two: Might, Bulwark or Heal. <b>The Beetle Glaive</b> gathers extracts with its beetle (head: red, arms: white, back: orange), leaps to dodge and strikes the head from the air until it mounts the monster. <b>The Blade Axe</b> switches between axe (fills the phial gauge) and sword (stronger, drains the gauge, Element discharge). <b>The Shield Axe</b> charges phials in sword-and-shield form, then detonates them in axe form (fixed damage, stuns). <b>The Shell Lance</b> guards like the lance and fires fixed-damage shells (ignoring part hardness), plus Cannon breath. <b>The Lance</b> has the sturdiest guard and a Counter that blocks the incoming hit, then strikes back.</li>
<li><b>The Tempestar</b> (High Rank ★3), elder dragon of the Crests, summons storms: the wind weakens your blows and lightning strikes your zone every turn. Keep moving, then hit hard when the sky clears. Breaking its horns and poisoning it weaken its storms.</li>
<li><b>Elite hunts</b>: after the Iron King, every monster returns as a veteran. Its shards and gems go into III weapons and size-3 jewels; its hard spheres upgrade armor beyond 46 defense.</li>
<li><b>Ranks and quests</b>: Low Rank, High Rank, then Master Rank, each with three star levels. Complete a level’s key quests (hunts, captures and gathering): the Guild then gives you an urgent quest against a fiercer monster, which unlocks the next level. Double hunts (two monsters back to back, no return to camp) are optional. A capture quest fails if the monster dies: when it staggers, worn out, set a trap. A completed quest leaves the board; defeated monsters can be fought again in the Arena, and successful double hunts and the Iron King ballista assault can be replayed in Special Fights. Mix armor pieces from several monsters to combine their skills.</li>
<li><b>Master Rank</b>: ancestral monsters chain their attacks. Their materials forge IV weapons, and ancestral spheres raise armor up to 100 defense.</li>
<li><b>Great danger</b>: each zone has its master (the Devourer in the Valley, the Pyroclast in the Ashlands, the Sismorak in the Tundra, the Gorgovire in the Crests, the Tempestar in the Lagoon, the Abyssaur in the Crater). It can show up even early in your career. An omen heralds it: return to camp to escape it. Once you complete its quest, it grows more persistent: it prowls more often and loses your trail at camp only half the time.</li><li><b>Events</b>: when you discover a sector, you may run into a storm (faster tracks), mist (tracks erased), a rich vein, a pack of small monsters, a carcass to carve, a nest of eggs to sell or a Peddler Griffu.</li>
<li><b>Your Griffu</b> joins you on every hunt. Choose its calling (Assault, Support, Protection, Gathering), forge it a weapon and outfit from monster materials, and activate the skills it learns as it levels up. It can be knocked down: it comes back after a few turns.</li>
<li><b>Free Expedition</b>: ${EXP_HOURS} hours in a zone, with no quest. Moving, gathering, mining or slaying a small monster takes 1 h. Every action leaves tracks: the higher the gauge, the likelier a large monster of the zone shows up, but only those whose quest you’ve completed (and their veteran version, once its elite hunt is done). Returning to camp halves them. Ores and small-monster hides are used at the Forge. Against a large monster, fleeing costs time; being defeated (3 faints) ends the expedition and loses half the loot.</li>
<li><b>Gathering and crafting</b>: herbs, mushrooms, honey, bones… Gather at camp or after a successful hunt, then craft potions, bombs and traps at the Workshop. The Shop only sells potions and antidotes: everything else is crafted from what you gather at camp and on expeditions.</li>
<li>In the village, forge weapons and armor from materials. Each armor piece grants a skill. Check the Hunting Journal for weaknesses.</li></ul>
<button class="btn main wide" data-a="close">Got it, let’s hunt!</button><p class="small muted" style="text-align:center"><button class="linkbtn" data-a="tipsreset">Show tips again during hunts</button> · <button class="linkbtn" data-a="tutagain">Replay the tutorial</button></p>`);}


/* ---------- Audio : musiques et bruitages ---------- */
const AKEY='grande-traque-son';
const AUD={cfg:{music:.5,sfx:.8,mute:false},ctx:null,master:null,mus:null,sfx:null,started:false,cur:null,tracks:{},noiseBuf:null,
 src:{village:'audio/village.mp3',camp:'audio/camp.mp3',combat:'audio/combat.mp3',boss:'audio/boss.mp3'},
 names:{village:'Sunlight on Cedar',camp:'Steps Through the Ferns',combat:"Threshold of the Iron King",boss:"Iron Vows at World’s End"}};
try{Object.assign(AUD.cfg,JSON.parse(localStorage.getItem(AKEY)||'{}'));}catch(e){}
function audSave(){try{localStorage.setItem(AKEY,JSON.stringify(AUD.cfg));}catch(e){}}
function audUnlock(){if(!AUD.ctx){try{const C=window.AudioContext||window.webkitAudioContext;if(C){AUD.ctx=new C();
  AUD.master=AUD.ctx.createGain();AUD.master.connect(AUD.ctx.destination);
  AUD.mus=AUD.ctx.createGain();AUD.mus.connect(AUD.master);AUD.sfx=AUD.ctx.createGain();AUD.sfx.connect(AUD.master);audGains();}}catch(e){AUD.ctx=null;}}
 if(AUD.ctx&&AUD.ctx.state==='suspended')AUD.ctx.resume().catch(()=>{});
 if(!AUD.started){AUD.started=true;audSync();}}
function audGains(){if(!AUD.ctx)return;const t=AUD.ctx.currentTime,m=AUD.cfg.mute?0:1;
 AUD.mus.gain.setTargetAtTime(AUD.cfg.music*m,t,.05);AUD.sfx.gain.setTargetAtTime(AUD.cfg.sfx*m,t,.05);
 for(const k in AUD.tracks){const tr=AUD.tracks[k];if(!tr.g)tr.el.volume=(k===AUD.cur?1:0)*AUD.cfg.music*m;}}
function audTrack(k){if(AUD.tracks[k])return AUD.tracks[k];const el=new Audio(AUD.src[k]);el.loop=true;el.preload='auto';const tr={el,g:null};
 if(AUD.ctx){try{const s=AUD.ctx.createMediaElementSource(el);tr.g=AUD.ctx.createGain();tr.g.gain.value=0;s.connect(tr.g);tr.g.connect(AUD.mus);}catch(e){tr.g=null;}}
 if(!tr.g)el.volume=0;AUD.tracks[k]=tr;return tr;}
function audFade(tr,to,dur,after){if(tr.g){const t=AUD.ctx.currentTime;tr.g.gain.cancelScheduledValues(t);tr.g.gain.setValueAtTime(tr.g.gain.value,t);tr.g.gain.linearRampToValueAtTime(to,t+dur);
  if(after)setTimeout(after,dur*1000+50);return;}
 const v0=tr.el.volume,target=to*AUD.cfg.music*(AUD.cfg.mute?0:1),n=Math.max(1,Math.round(dur*20));let i=0;clearInterval(tr.iv);
 tr.iv=setInterval(()=>{i++;tr.el.volume=clamp(v0+(target-v0)*i/n,0,1);if(i>=n){clearInterval(tr.iv);after&&after();}},50);}
function audWanted(){if(screen==='hunt'&&H&&H.q.training)return'camp';if(screen==='explore'&&S.exp)return'camp';if(screen==='hunt'&&H){const f=H.m.d.elder?'boss':'combat';if(H.phase==='camp')return'camp';if(H.over)return R&&R.kind!=='fail'?'camp':f;return f;}return'village';}
function audSync(){if(!AUD.started)return;const want=AUD.cfg.mute||AUD.cfg.music<=0?null:audWanted();if(want===AUD.cur)return;
 const old=AUD.cur?AUD.tracks[AUD.cur]:null;AUD.cur=want;
 if(old)audFade(old,0,1.2,()=>{if(AUD.cur!==Object.keys(AUD.tracks).find(k=>AUD.tracks[k]===old))old.el.pause();});
 if(want){const tr=audTrack(want);if((want==='combat'||want==='boss')&&tr.el.paused)try{tr.el.currentTime=0;}catch(e){}
  const p=tr.el.play();if(p&&p.catch)p.catch(()=>{});audFade(tr,1,1.4);}}
document.addEventListener('visibilitychange',()=>{if(!AUD.ctx)return;if(document.hidden)AUD.ctx.suspend().catch(()=>{});else AUD.ctx.resume().catch(()=>{});});
['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,audUnlock,{capture:true,passive:true}));

/* Bruitages synthétisés */
function sfxOk(){return AUD.ctx&&AUD.started&&!AUD.cfg.mute&&AUD.cfg.sfx>0;}
function tone(o){const c=AUD.ctx,t=c.currentTime+(o.t||0),d=o.d||.2;const os=c.createOscillator(),g=c.createGain();os.type=o.type||'sine';
 os.frequency.setValueAtTime(o.f||440,t);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+d);if(o.det)os.detune.value=o.det;
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v||.2,t+(o.a||.005));g.gain.exponentialRampToValueAtTime(.0001,t+d);
 let out=g;if(o.lp){const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;g.connect(f);out=f;}
 os.connect(g);out.connect(AUD.sfx);os.start(t);os.stop(t+d+.05);}
function noise(o){const c=AUD.ctx,t=c.currentTime+(o.t||0),d=o.d||.2;
 if(!AUD.noiseBuf){const b=c.createBuffer(1,c.sampleRate,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;AUD.noiseBuf=b;}
 const s=c.createBufferSource();s.buffer=AUD.noiseBuf;s.loop=true;const f=c.createBiquadFilter();f.type=o.ft||'bandpass';f.Q.value=o.q||1;
 f.frequency.setValueAtTime(o.f||1000,t);if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+d);
 const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v||.3,t+(o.a||.005));g.gain.exponentialRampToValueAtTime(.0001,t+d);
 s.connect(f);f.connect(g);g.connect(AUD.sfx);s.start(t,Math.random()*.5);s.stop(t+d+.05);}
const SFX={
 click:t=>tone({t,f:880,d:.05,v:.05}),
 cut:t=>{noise({t,f:3000,f2:700,d:.13,v:.5,q:.9});tone({t,f:190,f2:70,type:'triangle',d:.14,v:.3});},
 blunt:t=>{tone({t,f:130,f2:42,d:.28,v:.6});noise({t,ft:'lowpass',f:900,d:.1,v:.45});},
 weak:t=>tone({t:t+.03,f:1250,f2:1500,d:.18,v:.1}),
 crit:t=>{tone({t:t+.02,f:1900,f2:2600,d:.14,v:.1});tone({t:t+.08,f:2600,d:.2,v:.07});},
 hurt:t=>{tone({t,f:150,f2:55,type:'sawtooth',d:.24,v:.18,lp:900});noise({t,ft:'lowpass',f:700,d:.2,v:.45});},
 dodge:t=>noise({t,f:350,f2:2600,q:.7,d:.3,v:.35,a:.09}),
 block:t=>{tone({t,f:620,type:'square',d:.22,v:.07});tone({t,f:931,type:'triangle',d:.35,v:.12});noise({t,ft:'highpass',f:3000,d:.07,v:.25});},
 swing:t=>noise({t,f:300,f2:1100,q:.8,d:.32,v:.3,a:.1}),
 roar:t=>{tone({t,f:98,f2:72,type:'sawtooth',d:1.15,v:.2,a:.12,lp:700});tone({t,f:101,f2:70,type:'sawtooth',d:1.15,v:.16,a:.15,lp:600,det:15});noise({t,ft:'lowpass',f:500,f2:250,d:1.1,v:.5,a:.15});},
 fire:t=>{noise({t,ft:'lowpass',f:2200,f2:300,d:.65,v:.45,a:.06});for(let i=0;i<5;i++)noise({t:t+.05+i*.09,ft:'highpass',f:4000,d:.03,v:.2});},
 ice:t=>{[2093,2637,3136,2349].forEach((f,i)=>tone({t:t+i*.045,f,d:.28,v:.07}));noise({t,ft:'highpass',f:5500,d:.18,v:.18});},
 bolt:t=>{tone({t,f:1800,f2:110,type:'sawtooth',d:.2,v:.13});noise({t,f:3200,d:.26,v:.35,q:.6});tone({t:t+.02,f:55,type:'square',d:.3,v:.12,lp:300});},
 poison:t=>{for(let i=0;i<4;i++)tone({t:t+i*.07,f:260+i*40,f2:520+i*60,d:.08,v:.12});},
 heal:t=>[523,659,784,1047].forEach((f,i)=>tone({t:t+i*.07,f,d:.35,v:.1})),
 eat:t=>{for(let i=0;i<3;i++)noise({t:t+i*.11,ft:'lowpass',f:900,d:.07,v:.3});},
 flash:t=>{noise({t,ft:'highpass',f:2200,d:.4,v:.4});tone({t,f:3200,f2:1400,d:.35,v:.1});},
 trap:t=>{noise({t,f:1500,d:.05,v:.5});tone({t,f:220,f2:80,type:'triangle',d:.22,v:.3});noise({t:t+.12,f:900,d:.05,v:.35});},
 capture:t=>[784,659,523,392].forEach((f,i)=>tone({t:t+i*.2,f,type:'triangle',d:.6,v:.13})),
 win:t=>[523,659,784,1047].forEach((f,i)=>{tone({t:t+i*.13,f,type:'triangle',d:i===3?.9:.3,v:.16});tone({t:t+i*.13,f:f*2,d:i===3?.7:.2,v:.05});}),
 fail:t=>[392,330,262].forEach((f,i)=>tone({t:t+i*.22,f,type:'triangle',d:.55,v:.14})),
 faint:t=>tone({t,f:420,f2:90,d:1,v:.18,type:'triangle'}),
 charge:(t,l=1)=>tone({t,f:260+l*140,f2:560+l*260,type:'triangle',d:.28,v:.14}),
 brk:t=>{noise({t,f:1300,d:.16,v:.6,q:.7});tone({t,f:280,f2:85,type:'square',d:.14,v:.1});},
 flinch:t=>tone({t,f:520,f2:240,type:'triangle',d:.14,v:.12}),
 gather:t=>{for(let i=0;i<3;i++)noise({t:t+i*.06,f:3200,q:2,d:.1,v:.22});tone({t:t+.2,f:900,f2:1300,d:.08,v:.1});},
 craft:t=>{tone({t,f:1320,type:'triangle',d:.5,v:.14});tone({t,f:1760,d:.4,v:.07});noise({t,ft:'highpass',f:3500,d:.05,v:.25});},
 coin:t=>{tone({t,f:1568,d:.12,v:.1});tone({t:t+.07,f:2093,d:.28,v:.1});},
 steps:t=>{for(let i=0;i<3;i++)noise({t:t+i*.17,ft:'lowpass',f:450,d:.09,v:.3});},
 demon:t=>{tone({t,f:180,f2:360,type:'sawtooth',d:.35,v:.1,lp:1400});noise({t,f:900,f2:2400,d:.3,v:.2});}};
function sfx(name,t=0,arg){if(!sfxOk()||!SFX[name])return;try{SFX[name](t,arg);}catch(e){}}
/* Bruitages d'un tour, dans l'ordre du journal */
function turnSounds(fx){if(!H)return;const from=Math.max(H.mark,H._snd||0);H._snd=H.log.length;if(!sfxOk())return;const lines=H.log.slice(from).map(e=>e.m);const mfx=fx.filter(f=>f.t==='mfx');
 const W=H.stats.w;let t=0,n=0;const at=(name,a)=>{if(n>=7)return;sfx(name,t,a);t+=.17;n++;};
 for(const m of lines){
  if(/^💡|^Turn \d/.test(m))continue;
  if(/: \d+ damage/.test(m)&&!/you take/.test(m)){const blunt=W.type==='hammer'||/shield|shoulder/i.test(m);at(blunt?'blunt':'cut');if(/critical/.test(m))sfx('crit',t-.17);continue;}
  if(/charge your blade|wind up the hammer/.test(m)){at('charge',H.w.charge||1);continue;}
  if(/Furious Mode activated/.test(m)){at('demon');continue;}
  if(/You sharpen/.test(m)){at('craft');continue;}
  if(/You move/.test(m)){at('steps');continue;}
  if(/Potion|First-aid|healing horn/.test(m)&&/HP/.test(m)){at('heal');continue;}
  if(/steak|seed/i.test(m)){at('eat');continue;}
  if(/flash bomb|blinded/i.test(m)&&/✨/.test(m)){at('flash');continue;}
  if(/You set a trap|falls into the trap/.test(m)){at('trap');continue;}
  if(/lets out a|becomes enraged/.test(m)){at('roar');continue;}
  const f=/you take|Dodged|out of reach|blocked|misses you|Foresight Slash!/.test(m)?mfx.shift():null;
  if(f){const el=f.el==='phys'?'swing':f.el;if(el!=='roar')at(el);t-=.1;}
  if(/you take/.test(m)){at('hurt');continue;}
  if(/Dodged|You dive/.test(m)){at('dodge');continue;}
  if(/blocked|Guard held/.test(m)){at('block');continue;}
  if(/broken|severed|shatters/.test(m)){at('brk');continue;}
  if(/flinches|canceled/.test(m)){at('flinch');continue;}
  if(/^🏆.*captured/.test(m)){at('capture');continue;}
  if(/^🏆.*collapses/.test(m)){at('win');continue;}
  if(/You collapse/.test(m)){at('faint');continue;}
  if(/^❌/.test(m)){at('fail');continue;}
  if(/^🌿/.test(m)){at('gather');continue;}
}}
function speakerIcon(){const on=!AUD.cfg.mute;return`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>${on?'<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>':'<path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'}</svg>`;}
function soundBtn(){return`<button class="btn ghost sm snd" data-a="sound" aria-label="Sound settings">${speakerIcon()}</button>`;}
function openSound(){const c=AUD.cfg,now=AUD.cur?AUD.names[AUD.cur]:null;
 modal(`<h2>Sound</h2>
 <label class="srow"><span>Mute all</span><input type="checkbox" id="snd-mute" ${c.mute?'checked':''}></label>
 <label class="srow"><span>Music</span><input type="range" id="snd-music" min="0" max="1" step="0.05" value="${c.music}"></label>
 <label class="srow"><span>Effects</span><input type="range" id="snd-sfx" min="0" max="1" step="0.05" value="${c.sfx}"></label>
 <p class="small muted">${now?`Now playing: ${now}.`:"Music starts on first tap."} Village: Sunlight on Cedar. Camp: Steps Through the Ferns. Combat: Threshold of the Iron King. Iron King: Iron Vows at World’s End.</p>
 <button class="btn main wide" data-a="close">Close</button>`);}
document.addEventListener('input',e=>{const id=e.target&&e.target.id;if(!id||!id.startsWith('snd-'))return;
 if(id==='snd-mute')AUD.cfg.mute=e.target.checked;if(id==='snd-music')AUD.cfg.music=+e.target.value;if(id==='snd-sfx'){AUD.cfg.sfx=+e.target.value;}
 audSave();audGains();audSync();if(id==='snd-sfx')sfx('cut');
 document.querySelectorAll('.snd').forEach(b=>b.innerHTML=speakerIcon());});
/* ---------- Événements ---------- */
let LP={t:null,x:0,y:0,fired:false};
document.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-lp]');if(!el)return;LP.fired=false;LP.x=e.clientX;LP.y=e.clientY;clearTimeout(LP.t);
 LP.t=setTimeout(()=>{LP.fired=true;try{navigator.vibrate&&navigator.vibrate(12);}catch(_){}openActDetail(el.dataset.lp);},430);});
['pointerup','pointercancel','pointerleave'].forEach(ev=>document.addEventListener(ev,()=>clearTimeout(LP.t),true));
document.addEventListener('pointermove',e=>{if(LP.t&&Math.hypot(e.clientX-LP.x,e.clientY-LP.y)>10)clearTimeout(LP.t);},{passive:true});
document.addEventListener('contextmenu',e=>{if(e.target.closest('#app,#modal'))e.preventDefault();});
document.addEventListener('click',e=>{if(LP.fired){LP.fired=false;e.preventDefault();e.stopPropagation();return;}const el=e.target.closest('[data-a]');if(!el||el.disabled||el.getAttribute('aria-disabled')==='true')return;const a=el.dataset.a,v=el.dataset.v;
 if(['go','quest','meal','etab','ftab','ftype','stab','equipw','equipa','pouch','guide','monnotes','close','home','retry','toarena','tospecial','depart','equipfrom'].includes(a))sfx('click');
 switch(a){
 case 'noop':return;
 case 'sound':openSound();break;
 case 'train':{sfx('click');if(v==='cur'){startHunt('train','none');break;}if(!WT[v])break;startHunt('train','none',v+':fer',true);break;}
 case 'trainhelp':trainHelp();break;
 case 'aim':if(H&&!H.over&&['tete','flanc','queue'].includes(v)){H.aim=v;saveHunt();render();}break;
 case 'close':closeModal();break;
 case 'go':if(v==='equip'||v==='palico')sub.fromPrep=false;go(v);break;
 case 'palfrom':sfx('click');sub.fromPrep=true;go('palico');break;
 case 'ptab':sfx('click');sub.ptab=v;render();break;
 case 'palvoc':if(PAL_VOC[v]){sfx('click');palS().voc=v;save();render();}break;
 case 'palequip':{const[k,l]=v.split('|'),p=palS();if((k==='w'?p.ws:p.as).includes(l)){sfx('click');if(k==='w')p.w=l;else p.a=l;save();render();}break;}
 case 'palforge':{const[k,l]=v.split('|'),p=palS(),list=k==='w'?p.ws:p.as;const r=palRecipe(k,l);if(!list.includes(l)&&canPay(l,r)){pay(l,r);list.push(l);if(k==='w')p.w=l;else p.a=l;save();sfx('craft');sub.toast=`Forged and equipped: ${(k==='w'?PAL_W:PAL_A)[l].n}. Used: ${costText(l,r)}.`;render();}break;}
 case 'palsk':{const p=palS(),sk=PAL_SK.find(x=>x.id===v);if(!sk||p.lv<sk.lv)break;if(p.sk.includes(v))p.sk=p.sk.filter(x=>x!==v);else if(p.sk.length<palSlots(p.lv))p.sk.push(v);else{sub.toast=`Slots full (${palSlots(p.lv)}): remove a skill first.`;render();break;}sfx('click');save();render();break;}
 case 'palname':modal(`<h2>Rename your Griffu</h2><input id="palname" class="tin" maxlength="16" value="${esc(palS().name)}" autocomplete="off"><div style="display:flex;gap:8px;margin-top:10px"><button class="btn wide" data-a="close">Cancel</button><button class="btn main wide" data-a="palname-ok">Confirm</button></div>`);setTimeout(()=>{const i=$('#palname');if(i){i.focus();i.select&&i.select();}},50);break;
 case 'palname-ok':{const i=$('#palname');const n=i&&i.value.trim().replace(/[<>]/g,'').slice(0,16);if(n){palS().name=n;save();}closeModal();render();break;}
 case 'home':if(R&&R.q.explore&&S.exp){if(S.exp.ko)expEnd();else expAfterHunt();break;}H=null;R=null;go('village');break;
 case 'xresume':sfx('click');expAfterHunt();break;
 case 'xstart':if(!S.exp){const z=EXPZ.find(x=>x.id===v);if(z&&expOpen(z)){sfx('steps');S.exp=newExp(v);save();go('explore');}}break;
 case 'xmove':expAct('move',v);break;
 case 'xact':expAct('node',v);break;
 case 'xbuy':{const o=SHOP_OFF()[+v];if(!o||!S.exp||S.zenny<o[2])break;S.zenny-=o[2];if(ITEMS[o[0]])S.items[o[0]]=(S.items[o[0]]||0)+o[1];else{S.res[o[0]]=(S.res[o[0]]||0)+o[1];S.exp.got[o[0]]=(S.exp.got[o[0]]||0)+o[1];}S.exp.shopDone=1;sfx('coin');expLog(`🐱 You buy ${ITEMS[o[0]]?ITEMS[o[0]].n:RES[o[0]].n} ×${o[1]} from the peddler.`);save();render();openShop();break;}
 case 'xfight':sfx('click');expFight();break;
 case 'xflee':expFlee();break;
 case 'xend':if(!S.exp)break;if(S.exp.h<S.exp.max&&!S.exp.enc)modal(`<h2>Return to the village?</h2><p>You have ${S.exp.max-S.exp.h} h of exploring left. Your loot is already safe in your pouch.</p><div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Keep going</button><button class="btn main wide" data-a="xend-yes">Return</button></div>`);else expEnd();break;
 case 'xend-yes':closeModal();expEnd();break;
 case 'retry':{const q=R&&R.q;if(!q||q.explore){H=null;R=null;go('village');break;}const ml=(q.arena||q.sp)&&R.meal&&S.zenny>=((MEALS.find(x=>x.id===R.meal)||{}).p||0)?R.meal:'none';H=null;R=null;sub.quest=q.id;sub.meal=ml;go('prep');break;}
 case 'toarena':H=null;R=null;go('arena');break;case 'tospecial':H=null;R=null;go('special');break;
 case 'quest':sub.quest=v;sub.meal='none';go('prep');break;
 case 'urg-go':$('#modal').innerHTML='';sub.quest=v;sub.meal='none';go('prep');break;
 case 'gquest':{const q=QUESTS.find(x=>x.id===v);if(!q)break;const z=EXPZ.find(x=>x.id===q.zone);sfx('click');
  modal(`<h2>${esc(q.title)}</h2><p>${esc(q.d)}</p><p class="small">Location: ${esc(z.n)} · ${q.hours} hours · goal: ${itemIcon(q.goal.k,'iicon sm')}${RES[q.goal.k].n} ×${q.goal.n}. No large monster roams during a gathering quest.</p><p class="small muted">Reward: ${q.z} z and 2 armor spheres. You keep everything you gather.</p>${S.exp?"<p class=\"small\" style=\"color:var(--danger)\">An expedition is already underway: finish it first.</p>":''}<div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Later</button><button class="btn main wide" data-a="gstart" data-v="${q.id}" ${S.exp?'disabled':''}>Depart</button></div>`);break;}
 case 'gstart':{const q=QUESTS.find(x=>x.id===v);if(!q||S.exp||!unlocked(q))break;closeModal();sfx('steps');S.exp=newExp(q.zone,q.id);save();go('explore');break;}
 case 'equipfrom':sub.fromPrep=true;go('equip');break;
 case 'meal':sub.meal=v;render();break;
 case 'depart':{const q=QUESTS.find(x=>x.id===sub.quest);if(q&&!capBlock(q))startHunt(sub.quest,sub.meal);break;}
 case 'h':closeModal();act(v);break;
 case 'move':if(H&&H.phase==='camp'){sfx('steps');act('engage',String(v).replace(/^far:/,''));break;}if(H&&!H.over&&v!==H.zone){closeModal();act('move',v);}break;
 case 'engage':sfx('steps');act('engage',v);break;
 case 'gather':act('gather',v);break;
 case 'ctab':sub.ctab=v;render();break;
 case 'sacktog':{const d=el.closest('details');if(d)sub.sackOpen=!d.open;return;}
 case 'craftall':{const rc=RECIPES.find(r=>r.out===v);if(!rc)break;const k=fillBatches(rc);const d=craftN(v,k);if(d){sfx('craft');const n=ITEMS[v].n,q=d*(rc.n||1);if(H&&H.phase==='camp'){H.mark=H.log.length;log(`🛠️ You craft: ${n} ×${q} (owned: ${S.items[v]}).`,'good');saveHunt();}else sub.toast=`Crafted: ${n} ×${q} (owned: ${S.items[v]}).`;render();}break;}
 case 'prepsack':{const d=prepSack();if(d.length){sfx('craft');sub.toast=`Pouch packed: ${d.join(', ')}.`;}else sub.toast="Nothing to craft: pouch already full or not enough resources.";render();break;}
 case 'craft':if(craft(v)){sfx('craft');const n=ITEMS[v].n;if(H&&H.phase==='camp'){H.mark=H.log.length;log(`🛠️ You craft: ${n} (owned: ${S.items[v]}).`,'good');saveHunt();}else sub.toast=`Crafted: ${n} (owned: ${S.items[v]}).`;render();}break;
 case 'pouch':openPouch();break;
 case 'use':closeModal();act('item',v);break;
 case 'monnotes':if(H&&H.q.training){trainHelp();break;}modal(`<h3>Quest objectives</h3><div class="objs big">${(H.q.obj||[]).map(o=>{const ok=objDone(o);return`<i class="${ok?'ok':''}">${ok?'✓':'○'} ${esc(o.n)}</i>`;}).join('')}</div>`+monNotesHTML(H.m.id)+`<p class="small muted">Parts: ${['tete','flanc','queue'].map(p=>`${H.m.d.parts[p].name} (${ZN[Object.keys(ZPART).find(z=>ZPART[z]===p)].toLowerCase()})`).join(', ')}.</p><button class="btn wide" data-a="close">Close</button>`);break;
 case 'abandon':if(H&&H.q.training){H=null;R=null;try{localStorage.removeItem(HKEY);}catch(e){}closeModal();go('training');break;}modal(H&&H.q.explore?`<h2>Flee the fight?</h2><p>You retreat with no reward; the expedition goes on.</p><div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Keep hunting</button><button class="btn main wide" data-a="abandon-yes">Flee</button></div>`:`<h2>Abandon the quest?</h2><p>You’ll return to the village with no reward at all.</p><div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Keep hunting</button><button class="btn main wide" data-a="abandon-yes">Abandon</button></div>`);break;
 case 'faintflee':closeModal();if(H&&!H.over){H.fled=1;endHunt('fail',H.q.explore?"You fled the fight.":"Quest abandoned.");render();}break;
 case 'abandon-yes':closeModal();if(H&&!H.over){const cmp=H.phase==='camp';endHunt('fail',H.q.explore?"You fled the fight.":"Quest abandoned.");if(cmp){H.phase=null;go('result');}else render();}break;
 case 'etab':sub.etab=v;render();break;
 case 'ftab':sub.ftab=v;render();break;
 case 'ftype':sub.ftype=v;render();break;
 case 'stab':sub.stab=v;render();break;
 case 'craftw':{sfx('craft');const fromDetail=!!document.querySelector('#modal .wtier');const w=getWeapon(v),r=weaponRecipe(w.lin);const base=w.lin.up?w.type+':'+w.lin.up:null;const higher=LIN.filter(l=>l.up===w.lin.id||(l.up&&LIN.find(x=>x.id===l.up)&&LIN.find(x=>x.id===l.up).up===w.lin.id)).some(l=>S.weapons.includes(w.type+':'+l.id));if(!higher&&!S.weapons.includes(v)&&canPay(w.lin.mon,r)&&(!base||S.weapons.includes(base))){pay(w.lin.mon,r);
  let lostJ=[];if(base){S.weapons=S.weapons.filter(x=>x!==base);if(S.equip.weapon===base)S.equip.weapon=v;}S.weapons.push(v);if(base)lostJ=moveSock(base,v);save();modal(`<div class="forged">${weaponIcon(w.type,w.lin.id)}</div><h2>${esc(w.name)}</h2><p>${base?"Upgraded":"Forged"}! ${wStats(w)}.</p><p class="small muted">Used: ${esc(costText(w.lin.mon,r))}.</p>${base&&sockOf(v).some(Boolean)?`<p class="small" style="color:var(--good)">Jewels kept: ${sockOf(v).filter(Boolean).map(j=>esc(JEWELS.find(x=>x.id===j).n)).join(', ')}.</p>`:''}${lostJ.length?`<p class="small muted">Removed for lack of slots: ${lostJ.map(j=>esc(JEWELS.find(x=>x.id===j).n)).join(', ')} (returned to your stock).</p>`:''}<div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Later</button><button class="btn main wide" data-a="equipw" data-v="${v}">Equip</button></div>`);render();}break;}
 case 'crafta':{sfx('craft');const ar=getArmor(v),r=armorRecipe(ar.slot,ar.set);if(!S.armors.includes(v)&&ar.set.mon&&canPay(ar.set.mon,r)){pay(ar.set.mon,r);S.armors.push(v);save();modal(`<h2>${esc(ar.name)}</h2><p>Forged! Defense ${ar.def}${Object.keys(ar.pts).length?', '+ptsText(ar.pts):''}.</p><p class="small muted">Used: ${esc(costText(ar.set.mon,r))}.</p><div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Later</button><button class="btn main wide" data-a="equipa" data-v="${v}">Wear</button></div>`);render();}break;}
 case 'equipw':if(S.weapons.includes(v)){sfx('click');S.equip.weapon=v;save();const inEq=screen==='equip';closeModal();render();if(inEq)openSlot('weapon');}break;
 case 'equipa':if(S.armors.includes(v)){sfx('click');const sl=v.split(':')[0];S.equip[sl]=v;save();const inEq=screen==='equip';closeModal();render();if(inEq)openSlot(sl);}break;
 case 'eslot':openSlot(v);break;
 case 'journal':openJournal();break;
 case 'etab2':sub.etab2=v;render();break;
 case 'tfilter':sub.tfilter=v;render();break;
 case 'topen':sub.topen=sub.topen===v?null:v;render();break;
 case 'unsockask':{const worn=new Set([S.equip.weapon,...SLOTS.map(sl=>S.equip[sl.id])]);let nw=0,no=0;for(const[id,arr]of Object.entries(S.sock)){const c=arr.filter(Boolean).length;if(worn.has(id))nw+=c;else no+=c;}
  modal(`<h2>Unslot jewels</h2><p>Removed jewels go back to your stock, ready to be slotted elsewhere.</p><div style="display:flex;flex-direction:column;gap:8px">${no?`<button class="btn wide" data-a="unsockdo" data-v="off">Unworn gear only (${no})</button>`:''}<button class="btn main wide" data-a="unsockdo" data-v="all">All jewels, worn gear included (${nw+no})</button><button class="btn wide" data-a="close">Cancel</button></div>`);break;}
 case 'unsockdo':{const worn=new Set([S.equip.weapon,...SLOTS.map(sl=>S.equip[sl.id])]);let n=0;for(const id of Object.keys(S.sock)){if(v==='off'&&worn.has(id))continue;n+=S.sock[id].filter(Boolean).length;S.sock[id]=S.sock[id].map(()=>null);}save();sfx('craft');closeModal();render();break;}
 case 'unsockall':{const[id,back]=v.split('|');if(S.sock[id]){S.sock[id]=S.sock[id].map(()=>null);save();sfx('craft');render();openSlot(back);}break;}
 case 'sockpick':openSockPick(v);break;
 case 'back2slot':{const sl=SLOTS.find(s=>v.startsWith(s.id+':'));openSlot(sl?sl.id:'weapon');break;}
 case 'sockset':{const[item,i,jid]=v.split('|');const slots=SLOTS.some(s=>item.startsWith(s.id+':'))?getArmor(item).slots:getWeaponSlots(item);const arr=(S.sock[item]||slots.map(()=>null)).slice(0,slots.length);while(arr.length<slots.length)arr.push(null);
  if(jid){const j=JEWELS.find(x=>x.id===jid);if(!j||j.sz>slots[+i]||(jewelFree(jid)<=0&&arr[+i]!==jid))break;}arr[+i]=jid||null;S.sock[item]=arr;save();sfx('craft');render();const sl=SLOTS.find(s=>item.startsWith(s.id+':'));openSlot(sl?sl.id:'weapon');break;}
 case 'wdetail':openWDetail(v);break;
 case 'adetail':openADetail(v);break;
 case 'alvq':{const a=getArmor(v);if(S.armors.includes(v)&&canLv(a)){const c=armorLvCost(a);S.res[c.res]--;S.res[c.ore]--;S.zenny-=c.z;S.alv[v]=a.lv+1;save();sfx('craft');render();}break;}
 case 'jsz':sub.jsz=+v;render();break;
 case 'jrdy':sub.jrdy=!sub.jrdy;render();break;
 case 'toforge':closeModal();sub.ftab='porte';go('forge');break;
 case 'alv':{const a=getArmor(v);if(S.armors.includes(v)&&canLv(a)){const c=armorLvCost(a);S.res[c.res]--;S.res[c.ore]--;S.zenny-=c.z;S.alv[v]=a.lv+1;save();sfx('craft');render();openADetail(v);}break;}
 case 'craftj':{const j=JEWELS.find(x=>x.id===v);const r=jewelRecipe(j);if(j&&canPay(j.mon,r)&&(j.sz<3||eliteOpen())){pay(j.mon,r);S.jewels[v]=(S.jewels[v]||0)+1;save();sfx('craft');sub.toast=`Crafted: ${j.n} (owned: ${S.jewels[v]}). Used: ${costText(j.mon,r)}.`;render();}break;}
 case 'buy':{const it=ITEMS[v],n=+el.dataset.n||1;if(it&&it.shop&&S.zenny>=it.p*n){sfx('coin');S.zenny-=it.p*n;S.items[v]=(S.items[v]||0)+n;save();render();}break;}
 case 'sellr':if((S.res[v]||0)>0&&RES_PRICE[v]){sfx('coin');S.res[v]--;S.zenny+=RES_PRICE[v];save();render();}break;
 case 'setopen':{const d=el.closest('details');if(d){sub.sets=sub.sets||{};sub.sets[v]=!d.open;}return;}
 case 'sell':if(S.mats[v]>0){sfx('coin');S.mats[v]--;S.zenny+=sellPrice(v);save();render();}break;
 case 'guide':openGuide();break;
 case 'saveexp':openExport();break;case 'patches':openPatchList();break;case 'lang':{try{localStorage.setItem('grande-traque-lang',v);}catch(e){}save();location.replace(location.pathname+'?lang='+v);break;}
 case 'saveimp':openImport();break;
 case 'savecopy':{const c=saveCode();const done=()=>{const b=document.querySelector('[data-a="savecopy"]');if(b)b.textContent="Copied ✓";};try{navigator.clipboard.writeText(c).then(done,()=>{const t=document.querySelector('.savebox');t.select();document.execCommand('copy');done();});}catch(e){const t=document.querySelector('.savebox');t.select();document.execCommand('copy');done();}break;}
 case 'savedl':{try{const bl=new Blob([saveCode()],{type:'text/plain'});const u=URL.createObjectURL(bl);const a=document.createElement('a');a.href=u;a.download='brume-haute-save.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);}catch(e){}break;}
 case 'saveimpgo':{const t=document.getElementById('impbox');if(t&&t.value.trim())doImport(t.value);break;}
 case 'tutstart':S.tut=0;S.tuto=true;save();closeModal();render();break;
 case 'tutno':S.tut=null;save();closeModal();break;
 case 'tutnext':tutAdvance();render();break;
 case 'tutskip':S.tut=null;save();render();break;
 case 'tutagain':S.tut=0;save();closeModal();go('village');break;
 case 'tipsreset':S.tips={};save();closeModal();break;
 case 'reset':modal(`<h2>Start over from scratch?</h2><p>All your gear, materials and progress will be erased.</p><div style="display:flex;gap:8px"><button class="btn wide" data-a="close">Cancel</button><button class="btn main wide" data-a="reset-yes">Erase everything</button></div>`);break;
 case 'testmode':modal(`<h2>Test mode</h2><p class="small">For quick testing: all resources, materials and items go to 99, and you get 1,000,000 z. You can also unlock every rank at once.</p><div style="display:grid;gap:8px"><button class="btn main wide" data-a="test-go" data-v="0">Resources ×99 + 1M z</button><button class="btn wide" data-a="test-go" data-v="1">All that + every rank unlocked</button><button class="btn wide" data-a="close">Cancel</button></div>`);break;
 case 'test-go':{for(const k in RES)S.res[k]=99;for(const m in MON){if(m==='pantin')continue;for(const k in MON[m].mats)S.mats[matId(m,k)]=99;S.mon[m]=S.mon[m]||{seen:false,kills:0,caps:0};S.mon[m].seen=true;}
  for(const k in ITEMS)if(!ITEMS[k].sup)S.items[k]=99;S.zenny=1000000;S.tut=null;
  if(v==='1'){for(const q of QUESTS)if(q.tier>0)S.cleared[q.id]=1;S.urgSeen=QUESTS.filter(q=>q.urgent).map(q=>q.id);S.tuto=true;}
  save();go('village');modal(`<h2>Test mode on</h2><p class="small">${v==='1'?"All ranks are unlocked, ":''}resources, materials and items at 99, 1,000,000 z in your pocket. Happy forging!</p><button class="btn main wide" data-a="close">Got it</button>`);break;}
 case 'reset-yes':S=newSave();save();closeModal();go('village');break;}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='palname'){e.preventDefault();const b=document.querySelector('[data-a="palname-ok"]');b&&b.click();}});
document.documentElement.lang=LANG;try{document.title="The Hunters of Brume-Haute";}catch(e){}
try{if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')&&!/claude\.(ai|site|com)|claudeusercontent/.test(location.hostname))navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}
var SPLASH=false;
// Mise à jour automatique : compare la version du serveur à celle chargée
var _updLast=0;
function checkUpdate(){try{if(typeof BUILD_ID==='undefined'||!BUILD_ID||!window.fetch||Date.now()-_updLast<30000)return;_updLast=Date.now();
 fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{if(!j||!j.v||j.v===BUILD_ID)return;let tried=null;try{tried=sessionStorage.getItem('bh_upd');}catch(e){}
  const go=()=>{try{sessionStorage.setItem('bh_upd',j.v);}catch(e){}const nav=()=>location.replace(location.pathname+'?v='+j.v);
   try{navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{}).then(()=>setTimeout(nav,300));}catch(e){nav();}};
  if(tried!==j.v&&screen!=='hunt'&&!SPLASH&&!$('#modal').innerHTML.trim()){go();return;}
  if(document.getElementById('updbar'))return;const b=document.createElement('button');b.id='updbar';b.className='updbar';b.innerHTML="<b>New version available</b><span>Tap to update</span>";b.addEventListener('click',ev=>{ev.stopPropagation();go();});document.body.appendChild(b);}).catch(()=>{});}catch(e){}}
try{document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkUpdate();});}catch(e){}
function splashRun(){const el=document.getElementById('splash');if(!el||!el.classList)return;let skip=false;try{skip=(!!navigator.webdriver&&!/[?&]splash/.test(location.search))||/[?&]nosplash/.test(location.search);}catch(e){}
 if(skip){el.remove();return;}try{el.querySelector('.sptitle .title').innerHTML="<small>The Hunters of</small>Brume-Haute";el.querySelector('.sptap').textContent="Tap the screen to continue";}catch(e){}SPLASH=true;el.hidden=false;const a=el.querySelector('.sp1'),b=el.querySelector('.sp2');let st=0,T=[];const at=(f,ms)=>T.push(setTimeout(f,ms));
 const end=()=>{if(st>=3)return;st=3;T.forEach(clearTimeout);el.classList.add('out');setTimeout(()=>{el.remove();SPLASH=false;if(screen==='village')checkUrgent();},520);};
 const two=()=>{if(st>=2)return;st=2;T.forEach(clearTimeout);T=[];a.classList.remove('on');setTimeout(()=>b.classList.add('on'),st===2?350:0);at(end,4600);};
 el.addEventListener('click',ev=>{ev.stopPropagation();ev.preventDefault();if(st<2)two();else if(st===2)end();});
 requestAnimationFrame(()=>{st=1;a.classList.add('on');});at(()=>a.classList.remove('on'),2100);at(two,2650);}
const _resume=loadHunt();if(_resume){H=_resume;screen='hunt';}
render();try{splashRun();}catch(e){SPLASH=false;}
setTimeout(checkUpdate,1500);
