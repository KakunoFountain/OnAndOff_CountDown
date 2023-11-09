/* セレクトボックス関係の関数 */


//optionタグを増殖させる
function ElementAppender(parentElement, name, max, st=1) {  //in init, DaySelecter
	//parentElement:document.getElementByIdメソッドを入れる
	//name:optionタグのvalue名および表示名を入れる
	//max:for文の試行回数を入れる
	//st: ステップ
	for (let i = 0; i < max; i=i+st) {
		const newElement = document.createElement("option");  //新しいoption要素作成
		newElement.setAttribute("value", `${name+i}`);  //パラメータ名指定
		const range = document.createTextNode(`${name+i}`);  //optionの中身
		newElement.appendChild(range);  //optionにrangeを追加
		parentElement.appendChild(newElement);  //親要素の子としてnewElementを追加
	}
}


//日付のmax値分岐
function DaySelecter(ispre=0, id=selid) {  //in Init
	// ispre=1:初回
	const parentElement = document.getElementById(id.d.id);  //親要素
	let pre_seled = parentElement.selectedIndex;
	if (ispre == 0) {
		while (parentElement.firstChild) {
			parentElement.removeChild(parentElement.firstChild);
		}
	}

	//max値分岐
	let max = 31;
	let gyear = now_year + id.y.selectedIndex;
	let gmon = id.mo.selectedIndex + 1

	if (gmon == 2) {
		if ((gyear%4 == 0 && gyear%100 != 0) || (gyear%400 == 0)) {
			max = 29;  //閏年
		} else {
			max = 28;  //平年
		}
	} else if (gmon == 4 || gmon == 6 || gmon == 9 || gmon == 11) {
		max = 30;
	}

	ElementAppender(parentElement, name=1, max);  //日のセレクトメニュー作成
	parentElement.selectedIndex = pre_seled;
}


//セレクトボックスのバリュー指定
function SelectValue(id, seledInd) {  //in Init, AddMenu, ApplyRegularSet
	id.y.selectedIndex = seledInd[0] - now_year;
	id.mo.selectedIndex = seledInd[1] - 1;
	id.d.selectedIndex = seledInd[2] - 1;
	id.h.selectedIndex = seledInd[3];
	id.mi.selectedIndex = seledInd[4];
}


//終了日時初回セレクトメニューを作成
function Init(id, seledInd) {  //in PresetTimer
	ElementAppender(parentElement=document.getElementById(id.y.id), name=now_year, max=11);  //年  ※name:現在の年取得結果
	ElementAppender(parentElement=document.getElementById(id.mo.id), name=1, max=12);  //月
	DaySelecter(ispre=1, id);  //日
	ElementAppender(parentElement=document.getElementById(id.h.id), name=0, max=24);  //時
	ElementAppender(parentElement=document.getElementById(id.mi.id), name=0, max=60, st=1);  //分

	SelectValue(id, seledInd);
}

//セレクトメニューで指定した日時の値を格納(終了日時変更ならstr型enddate更新、pause期間変更なら2次元str配列pause更新)
function InputSelectedDate(id) {  //in Init, ReSelected, ApplyRegularSet, SaveMyTimer
	let Re_seled =[];
	let Re_Indnum = [];
	let i = 0;

	switch (id) {
	
		case selid:
		case rstid:
		case renid:
			i = 0;
			for (const key in id) {  //id[key] = selectオブジェクト
				Re_Indnum[i] = id[key].selectedIndex;
				Re_seled[i] = id[key].options[Re_Indnum[i]].value;
				i++;
			}
			const date = `${Re_seled[0]}/${Re_seled[1]}/${Re_seled[2]} ${Re_seled[3]}:${Re_seled[4]}:00`;

			if (id == selid) enddate = date;
			else if (id == rstid) rstdate = date;
			else if (id == renid) rendate = date;

			break;
			

		case pau0copyid:  //pau0copyid = [pau0id, ...]
			for (let j=0; j<id.length; j++) {
				Re_Indnum[j] = [];
				
				let i = 0;
				for (const key in id[j]) {
					Re_Indnum[j][i] = id[j][key].selectedIndex;
					Re_seled[i] = id[j][key].options[Re_Indnum[j][i]].value;

					id[j][key].addEventListener("change", function() {
						pau1copyid[j][key].selectedIndex = id[j][key].selectedIndex;

						//格納
						pause[j][1] = `${pau1copyid[j].y.options[pau1copyid[j].y.selectedIndex].value}/` +
										`${pau1copyid[j].mo.options[pau1copyid[j].mo.selectedIndex].value}/` +
										`${pau1copyid[j].d.options[pau1copyid[j].d.selectedIndex].value} ` +
										`${pau1copyid[j].h.options[pau1copyid[j].h.selectedIndex].value}:` +
										`${pau1copyid[j].mi.options[pau1copyid[j].mi.selectedIndex].value}:00`;
					});

					i++;
				}

				//pause期間格納
				pause[j][0] = `${Re_seled[0]}/${Re_seled[1]}/${Re_seled[2]} ${Re_seled[3]}:${Re_seled[4]}:00`;
			}
			break;
		

		case pau1copyid:
			for (let j=0; j<id.length; j++) {
				Re_Indnum[j] = [];

				let i = 0;
				for (const key in id[j]) {
					Re_Indnum[j][i] = id[j][key].selectedIndex;
					Re_seled[i] = id[j][key].options[Re_Indnum[j][i]].value;
					i++;
				}

				pause[j][1] = `${Re_seled[0]}/${Re_seled[1]}/${Re_seled[2]} ${Re_seled[3]}:${Re_seled[4]}:00`;
			}
			break;


		default:
			console.log("サポート外id");
			break;
	}

	return Re_Indnum;

}



/* タイマー動作関係の関数 */


//初期タイマーの日時設定
function PresetTimer() {

	now.setHours(now_hour + 1);
	const nowpl_ar = [now_year, now_mon, now.getDate(), now.getHours(), 0];
	//今から1時間(弱)後(ただし時刻は0分)
	const nowpl_str = `${nowpl_ar[0]}/${nowpl_ar[1]}/${nowpl_ar[2]} ${nowpl_ar[3]}:${nowpl_ar[4]}:00`;
	const pause = [[nowpl_str, nowpl_str]];
	
	now.setDate(now_day + 1);  now.setHours(0);  now.setMinutes(0);
	const tomorrow_0h0m = [now.getFullYear(), now.getMonth()+1, now.getDate(), now.getHours(), now.getMinutes()];
	//翌日の0:00
	const enddate = `${tomorrow_0h0m[0]}/${tomorrow_0h0m[1]}/${tomorrow_0h0m[2]} ${tomorrow_0h0m[3]}:${tomorrow_0h0m[4]}:00`;

	//定期的な開始日時
	const seminow = [now_year, now_mon, now_day, now_hour, 0];
	const rstdate = `${seminow[0]}/${seminow[1]}/${seminow[2]} ${seminow[3]}:${seminow[4]}:00`;

	//定期的な終了日時
	const rendate = enddate;

	//定期的な稼働期間、停止期間
	const runpart = 0;
	const pausepart = 0;
	

	let CDm = CountDown_move(enddate, pause);


	//セレクトボックス作成
	Init(selid, tomorrow_0h0m);
	Init(pau0id, nowpl_ar);
	Init(pau1id, nowpl_ar);
	Init(rstid, seminow);
	Init(renid, tomorrow_0h0m);
	//ElementAppender(parentElement=document.getElementById("runpart"), name=0, max=60, st=1);  //定期的稼働
	//ElementAppender(parentElement=document.getElementById("pausepart"), name=0, max=60, st=1);  //定期的停止


	return {
		tom: tomorrow_0h0m, 
		seminow: seminow,
		nowpl_ar: nowpl_ar, 
		nowpl_str: nowpl_str, 
		pause: pause, 
		enddate: enddate, 
		rstdate: rstdate,
		rendate: rendate,
		runpart: runpart,
		pausepart: pausepart,
		CDm: CDm
	};
}


//タイマー初期化
function TimerResetter(set=CDm.set) {  //in CountDown, ReSelected
	clearInterval(set);
}


//タイマー非動作中の合図(バックグラウンドカラー変更)
function BgColorChanger(BgColor="#ec4542", TxColor="#eeede3") {  //in CountDown
	const Class_time = document.getElementsByClassName("time");
	for (let i=0; i<Class_time.length; i++) {
		Class_time[i].style.backgroundColor = BgColor;
		Class_time[i].style.color = TxColor;
	}
}


//タイマー表示、pause日時のミリ秒(2次元配列)取得
function CountDown(enddate, pause=[["1970/1/1 00:00:00", "1970/1/1 00:00:00"]])  {  //in CountDown_move
	
	//初期設定
	BgColorChanger("#eeede3", "#03adad");
	document.getElementById("time-container").innerHTML = 
		"<p class='time'><span id='hour'></span>hrs</p>" +
		"<p class='time'><span id='min'></span>min</p>" +
		"<p class='time'><span id='sec'></span>sec</p>";
	isend = false;
	AlarmOnChange(isend);


	//html内id名と紐づけ(定数)
	const hour = document.getElementById("hour");
	const min = document.getElementById("min");
	const sec = document.getElementById("sec");


	//指定日時をミリ秒に変換、格納
	const now = new Date().getTime(); // 現在時刻を取得(ミリ秒)
	const end = new Date(enddate).getTime(); // 終わりの日時を取得(ミリ秒)

	//配列初期化
	let Pause = [];  //以下for文でpause要素をミリ秒変換、格納、2次元配列化
	let pause_range = [];  //各pause期間(1次元配列) 単位：ミリ秒

	for (let i=0; i<pause.length; i++) {
		Pause[i] = [];

		for (let j=0; j<pause[i].length; j++) {  //pause[i].length=2
			Pause[i][j] = new Date(pause[i][j]).getTime();  //格納
		}

		if (Pause[i][0] < now) {
			Pause[i][0] = now;  //今よりも前のpause期間を換算しない

			if (Pause[i][1] < now) {
				Pause[i][1] = now;
			}
		}
		
			
		pause_range[i] = Pause[i][1] - Pause[i][0];  //格納
	}


	let pause_sum = pause_range.reduce(function(a,b) {
		return a + b;
	});  //pause期間の合計ミリ秒


	let diff = end - now - pause_sum;  //断続的な残り時間
	console.log('pause_sum:', pause_sum)

	// ミリ秒から単位を修正
	const calcHour = Math.floor(diff / 1000 / 60 / 60);
	const calcMin = Math.floor(diff / 1000 / 60) % 60;
	const calcSec = Math.floor(diff / 1000) % 60;


	// 取得した時間を表示（2桁表示）(if文)
	hour.innerHTML = calcHour >= 0 && calcHour < 10 ? '0' + calcHour : calcHour;
	min.innerHTML = calcMin >= 0 && calcMin < 10 ? '0' + calcMin : calcMin;
	sec.innerHTML = calcSec >= 0 && calcSec < 10 ? '0' + calcSec : calcSec;


	//pause期間の処理
	for (let i=0; i<Pause.length; i++) {
		if (Pause[i][0] <= now && now < Pause[i][1]) {
			console.log('pause期間')
			//TimerResetter();
			BgColorChanger();
			break;
		}
	}


	//終了時刻を超過したときの処理
	if (diff <= 2000) {   //音声再生にラグがあるため
		isend = true;
		AlarmOnChange(isend);
	}

	if (diff <= 1000) {
		TimerResetter();

		//終了の合図
		hour.innerHTML = "TI";
		min.innerHTML = "ME";
		sec.innerHTML = "UP";
		BgColorChanger();
	}

	return Pause;
}


//カウントダウン動作
function CountDown_move(enddate, pause=[["1970/1/1 00:00:00", "1970/1/1 00:00:00"]]) {  //in ReSelected, PresetTimer
	const Pause = CountDown(enddate, pause);
	const set = setInterval(CountDown,1000,enddate,pause);

	return {
		Pause: Pause,
		set: set
	};
}


//セレクト日時が更新されたときにタイマーを再定義
function ReSelected(id=selid, fromsavedata=false) {  //in ApplyRegularSet
	//id: selidはオブジェクト、pau0copyid,pau1copyidはオブジェクトが要素の1次元配列
	TimerResetter();

	InputSelectedDate(id);

	CDm = CountDown_move(enddate, pause);


	//pauseの有無と不可能な値の組入力時の処理
	if (fromsavedata == false) {

		const now = new Date().getTime(); // 現在時刻を取得(ミリ秒)
		const end = new Date(enddate).getTime(); // 終わりの日時を取得(ミリ秒)

		for (let i=0; i<pause.length; i++) {

			if (now <= CDm.Pause[i][0] && CDm.Pause[i][0] <= CDm.Pause[i][1] && CDm.Pause[i][1] <= end) ;
			else if (end < now) {
				alert("現在日時よりも先を終了日時に設定してください。");
			}
			else if (end < CDm.Pause[i][0]) {
				pause[i][0] = enddate;
				pause[i][1] = enddate;
				pau0copyid[i].y.selectedIndex = selid.y.selectedIndex
				pau0copyid[i].mo.selectedIndex = selid.mo.selectedIndex
				pau0copyid[i].d.selectedIndex = selid.d.selectedIndex
				pau0copyid[i].h.selectedIndex = selid.h.selectedIndex
				pau0copyid[i].mi.selectedIndex = selid.mi.selectedIndex
	
				pau1copyid[i].y.selectedIndex = selid.y.selectedIndex
				pau1copyid[i].mo.selectedIndex = selid.mo.selectedIndex
				pau1copyid[i].d.selectedIndex = selid.d.selectedIndex
				pau1copyid[i].h.selectedIndex = selid.h.selectedIndex
				pau1copyid[i].mi.selectedIndex = selid.mi.selectedIndex
				alert("一時停止日時、再開日時を終了日時と一致させました。");
			}
			else if (CDm.Pause[i][1] < CDm.Pause[i][0]) {
				pause[i][1] = pause[i][0];
				pau1copyid[i].y.selectedIndex = pau0copyid[i].y.selectedIndex
				pau1copyid[i].mo.selectedIndex = pau0copyid[i].mo.selectedIndex
				pau1copyid[i].d.selectedIndex = pau0copyid[i].d.selectedIndex
				pau1copyid[i].h.selectedIndex = pau0copyid[i].h.selectedIndex
				pau1copyid[i].mi.selectedIndex = pau0copyid[i].mi.selectedIndex
				//alert("再開日時を一時停止日時と一致させました。");
			}
			else if (end < CDm.Pause[i][1]) {
				pause[i][1] = enddate;
				pau1copyid[i].y.selectedIndex = selid.y.selectedIndex
				pau1copyid[i].mo.selectedIndex = selid.mo.selectedIndex
				pau1copyid[i].d.selectedIndex = selid.d.selectedIndex
				pau1copyid[i].h.selectedIndex = selid.h.selectedIndex
				pau1copyid[i].mi.selectedIndex = selid.mi.selectedIndex
				alert("再開日時を終了日時と一致させました。");
			}
		}

		TimerResetter();
		CDm = CountDown_move(enddate, pause);
	}


	console.log("停止期間：", pause);
	console.log("終了時間：", enddate);
}



/* ボタン関係の関数 */


//pause期間を削除
function PauseNodeInitialize() {  //in ApplyRegularSet, ImportMyTimer
	for (let i=2; i<2*pau0copyid.length; i++) {
		const pauseNode = document.getElementById("pauseNode");
		pauseNode.children[2].remove();
	}
	for (let i=2; i<pau0copyid.length; i++) {
		pause.pop();
	}
	addnum = 0;
	pau0copyid = [pau0id];  pau1copyid = [pau1id];
}

//pause日時セレクトメニューを作成
function AddMenu() {  //in ApplyRegularSet
	addnum++;
	
	//複製ノード要素格納
	const parent = document.getElementById("pauseNode");
	const id = [pau0id, pau1id];
	const cid = [pau0copyid, pau1copyid];

	for (let n=0; n<id.length; n++) {
		const pauNode = document.getElementById(`pau${n}`);
		const pNcopy = pauNode.cloneNode(true);

		const y = pNcopy.children[1].children[0];
		const mo = pNcopy.children[1].children[1];
		const d = pNcopy.children[1].children[2];
		const h = pNcopy.children[1].children[3];
		const mi = pNcopy.children[1].children[4];
		y.id = `${id[n].y.id}_` + addnum;
		mo.id = `${id[n].mo.id}_` + addnum;
		d.id = `${id[n].d.id}_` + addnum;
		h.id = `${id[n].h.id}_` + addnum;
		mi.id = `${id[n].mi.id}_` + addnum;
		
		const id_individual = {y:y, mo:mo, d:d, h:h, mi:mi};
		cid[n].push(id_individual);
		SelectValue(id_individual, nowpl_ar);

		//id="add_btn" の前に複製
		parent.append(pNcopy);
	}
	
	pause[addnum] = [nowpl_str, nowpl_str];

}


//定期的な稼働時間を適用
function ApplyRegularSet() {
	runpartm = Number(runid.id.value);  //入力されたminutes値
	pausepartm = Number(pauseid.id.value);

	if (runpartm !=0 && pausepartm != 0) {

		//初期化
		PauseNodeInitialize();

		//各項目値を更新、格納
		InputSelectedDate(rstid);  //rstdate値更新
		InputSelectedDate(renid);  //rendate値更新
		let rstm = new Date(rstdate);  //Dateオブジェクト化
		let renm = new Date(rendate);
		//定期的な稼働間隔の、開始日時の配列[年,月,日,時,分]
		let rglr_plusArr = [rstm.getFullYear(), rstm.getMonth()+1, rstm.getDate(), rstm.getHours(), rstm.getMinutes()];


		//enddateと同期
		enddate = rendate;
		for (const key in selid) {
			selid[key].selectedIndex = renid[key].selectedIndex;
		}


		//pause期間更新
		SelectValue(id=pau0id, seledInd=[now_year, 1, 1, 0, 0]);
		SelectValue(id=pau1id, seledInd=rglr_plusArr);

		let i = 1;
		while(rstm.getTime() < renm.getTime()) {

			if (i > 49) {
				alert("稼働、停止時間の組は50以上作れません。");
				break;

			} else {
				AddMenu();

				rstm.setMinutes(rstm.getMinutes() + runpartm);  //稼働
				rglr_plusArr = [rstm.getFullYear(), rstm.getMonth()+1, rstm.getDate(), rstm.getHours(), rstm.getMinutes()];
				SelectValue(pau0copyid[i], rglr_plusArr);
	
				rstm.setMinutes(rstm.getMinutes() + pausepartm);  //停止
				rglr_plusArr = [rstm.getFullYear(), rstm.getMonth()+1, rstm.getDate(), rstm.getHours(), rstm.getMinutes()];
				SelectValue(id=pau1copyid[i], seledInd=rglr_plusArr);

				InputSelectedDate(id=selid);
				InputSelectedDate(id=pau0copyid);
				ReSelected(id=pau1copyid, fromsavedata=false);

				i++;
			}
		}

	}
}



/* 保存関係の関数 */


//変数値を記憶
function SaveMyTimer() { //in DLMyTimer

	const Mindp0 = InputSelectedDate(id=pau0copyid).flat();
	const Mindp1 = InputSelectedDate(id=pau1copyid).flat();
	const Mendt = InputSelectedDate(id=selid);
	const Madn = addnum;  //add_btnが押された回数

	const d = [ Mindp0, 
				Mindp1, 
				Mendt, 
				Madn ];
	
	const txt = d[0] + "\n" + d[1] + "\n" + d[2] + "\n" + d[3];


	return {
		Myd: d,
        txt: txt
	};
}


//変数値の記録されたcsvファイルをダウンロード
function DLMyTimer() {

    const txt = SaveMyTimer().txt;
    const blob = new Blob([txt], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MyOnAndOffCountdownTimer.csv";
    a.click();
    URL.revokeObjectURL(url);
        
}


//csv保存されたデータを実際に適用
function ImportMyTimer(data) {  //in selectFile
	//初期化
	PauseNodeInitialize();

	//データ割当
	const Madn = data[3][0];
	const Mendt = data[2];


	//save時点でadd_btnが押された分押す
	for (let i=0; i<Madn; i++) AddMenu();

	//selectedIndexも適用
	//終了時間
	selid.y.selectedIndex = Mendt[0];
	selid.mo.selectedIndex = Mendt[1];
	selid.d.selectedIndex = Mendt[2];
	selid.h.selectedIndex = Mendt[3];
	selid.mi.selectedIndex = Mendt[4];

	//停止期間
	for (let i=0; i<2; i++) {  //i:一時停止日時か再開日時かを選ぶ
		const id = [pau0copyid, pau1copyid];

		for (let j = 0; j < Madn+1; j++) {
			//j:一時停止日時と再開日時の組数まで増やす & csvデータ内でselectedIndexの格納セルを1つ1つ指定

			id[i][j].y.selectedIndex = data[i][5*j];
			id[i][j].mo.selectedIndex = data[i][5*j+1];
			id[i][j].d.selectedIndex = data[i][5*j+2];
			id[i][j].h.selectedIndex = data[i][5*j+3];
			id[i][j].mi.selectedIndex = data[i][5*j+4];

		}
	}

	InputSelectedDate(id=selid);
	InputSelectedDate(id=pau0copyid);
	ReSelected(id=pau1copyid, fromsavedata=true);
}


//csv保存されたデータを読み込む → 整形 → ImportMyTimerに渡す
function selectFile() {
	// FileListオブジェクト取得
	const selectFiles = document.getElementById("select-file").files;

	// Fileオブジェクト取得
	const file = selectFiles[0];

	// FileReaderオブジェクト取得
	const reader = new FileReader();
	reader.readAsBinaryString(file);

	// ファイル読み込み完了時の処理
	reader.onload = () => {
		//csvデータを整形(配列化、要素の数値化)
		const lineArr = reader.result.split("\n");
		const itemArr = [];

		for (let i=0; i<lineArr.length; i++) {

			itemArr[i] = lineArr[i].split(",");

			for (let j=0; j<itemArr[i].length; j++) {
				itemArr[i][j] = Number(itemArr[i][j]);
			}

		}

		ImportMyTimer(itemArr);
	}

	// ファイル読み込みエラー時の処理
	reader.onerror = () => {
		console.log("ファイル読み込みエラー");
	}

}



/* 通知音関係の関数 */


//アラームシステム
function AlarmOnChange(isend) {

	switch (isend) {
		case true:
			if (alm_chk.checked) {
				sound.play();
				sound.loop = true;
			} else {
				sound.pause();
				sound.currentTime = 0;
			}
			break;
		
		case false:
			sound.pause();
			sound.currentTime = 0;
			break;	
	}
}



/* ピクチャインピクチャ関係の関数 */



//ピクチャインピクチャシステム
function PIP() {
	const pip_btn = document.getElementById("pip_btn");
	const canvasEl = document.getElementById("canvas");
    const canvasCtx = canvasEl.getContext('2d');

	/*
	const pEl = document.createElement("p");
	const spanEl = document.createElement("span");

	pEl.class = "time";
	pEl.textContent = "hrrrs";
	pEl.appendChild(spanEl);
	*/
	

	//ピクチャインピクチャウィンドウを開いたとき
	pip_btn.addEventListener('click', async () => {

		const video = document.createElement('video');
		video.muted = true;
		video.srcObject = canvasEl.captureStream(60);
		video.play();
		video.addEventListener('loadedmetadata', () => {
        	video.requestPictureInPicture();
		});


		canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		canvasCtx.fillStyle = '#ffffff';
		canvasCtx.fillText(Date.now(), 50, 20);

	});
}


/*
//ピクチャインピクチャシステム
function PIP() {

	const pip_btn = window.document.getElementById("pip_btn");


	//ピクチャインピクチャウィンドウを開いたとき
	pip_btn.addEventListener('click', async () => {

		//タイマー本体をpipウィンドウに移植
		const maintimer = document.getElementById("time-container");
		const pipWindow = await documentPictureInPicture.requestWindow({
			width: maintimer.width,
			height: maintimer.height,
			copyStyleSheets: true,
		});
		pipWindow.document.body.append(maintimer);


		//デザインを適用
		const script = document.createElement("script");
		const link = document.createElement("link");

		script.src = "js/style.js";
		link.rel = "stylesheet";
		link.href = "css/index_CD.css";

		pipWindow.document.head.append(link);
		pipWindow.document.body.append(script);


		//タイマーを動かす
		//const data = SaveMyTimer().Myd;
		//ImportMyTimer(data);


		//ピクチャインピクチャウィンドウを閉じたとき
		pipWindow.addEventListener("unload", (event) => {
			const pipPlayer = event.target.querySelector("#time-container");
			document.getElementById("sentence").after(pipPlayer);
		});

	});

}
*/