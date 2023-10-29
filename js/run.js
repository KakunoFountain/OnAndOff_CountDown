const now = new Date()
const now_year = now.getFullYear();
const now_mon = now.getMonth() + 1;
const now_day = now.getDate();
const now_hour = now.getHours();
const now_min = now.getMinutes();

//id名
const selid =  {y:sel_year, mo:sel_mon, d:sel_day, h:sel_hour, mi:sel_min};
const pau0id = {y:pau0_year, mo:pau0_mon, d:pau0_day, h:pau0_hour, mi:pau0_min};
const pau1id = {y:pau1_year, mo:pau1_mon, d:pau1_day, h:pau1_hour, mi:pau1_min};
const rstid = {y:rst_year, mo:rst_mon, d:rst_day, h:rst_hour, mi:rst_min};
const renid = {y:ren_year, mo:ren_mon, d:ren_day, h:ren_hour, mi:ren_min};
const runid = {id: runpart};
const pauseid = {id: pausepart};

//pause複製id名
let pau0copyid = [pau0id];  let pau1copyid = [pau1id];  //オブジェクトが入る1次元配列

//アラーム
const alm_chk = document.getElementById("alarm_chk");
const sound = new Audio('js/alarm.mp3');

//各定数、変数の宣言
let addnum = 0;
let isend = false;
const p = PresetTimer();
const tom = p.tom;  const seminow = p.seminow; const nowpl_ar = p.nowpl_ar;  const nowpl_str = p.nowpl_str;
let CDm = p.CDm;  let pause = p.pause;  let enddate = p.enddate;
let rstdate = p.rstdate;  let rendate = p.rendate;  let runpartm = p.runpart;  let pausepartm = p.pausepart;


//PIP();

