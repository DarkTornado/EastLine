const fs = require('fs');
const http = require('http');
http.createServer((req, res) => {
res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8;',
    'Access-Control-Allow-Origin': '*'
});

/* 원활한 시간 비교를 위해 초 단위로 변환 */
var date = new Date();
var now = 60*60*date.getHours() + 60*date.getMinutes() + date.getSeconds();

/* 열차별 운행 정보 시간표 */
var data = fs.readFileSync('time_table_20220401_0.json').toString();
data = JSON.parse(data);

var stas = ['부전', '거제해맞이', '거제', '교대', '동래', '안락', '부산원동', '재송', '센텀', '벡스코', '신해운대', '송정', '오시리아', '기장', '일광', '좌천', '월내', '서생', '남창', '망양', '덕하', '개운포', '태화강'];
var result = [];
stas.forEach((e, i) => {
result[i] = {
sta: e,
up: '',
down: ''
};
});
for(var train in data) {
var time = data[train];

/* 운행중이지 않은 열차 필터링 */
var tym = timeToSec(time.at(-1).time);
if(tym < now) continue;
tym = timeToSec(time[0].time);
if(now < tym) continue;

/* 상/하행 구분 및 위치 가지고 옴 */
var num = Number(train[train.length-1]);
var ud = num%2==0?'up':'down';
var sta = getTrainLocation(time);
var index = stas.indexOf(sta);
result[index][ud] = train;
}
res.write(JSON.stringify(result, null, 4));
res.end();
}).listen(80);

/* 시간 기반으로 열차의 위치를 가지고 옴 */
function getTrainLocation(time) {
for (n = time.length - 1; n >= 0; n--) {
var tym = timeToSec(time[n].time);
if(now==tym) return time[n].station;
if(tym < now) return time[n + 1].station;
}
return 0;
}

/* 원활한 시간 비교를 위해 초 단위로 변환해주는 함수 */
function timeToSec(time) {
var t = time.split(':');
return Number(t[0])*60*60 + Number(t[1])*60 + Number(t[2]);
}

