const fs = require('fs');

/* 원활한 시간 비교를 위해 초 단위로 변환 */
var date = new Date();
var now = 60*60*date.getHours() + 60*date.getMinutes() + date.getSeconds();

/* 열차별 운행 정보 시간표 */
var data = fs.readFileSync('time_table_20220401_0.json').toString();
data = JSON.parse(data);

var stas = ["태화강","개운포","덕하","망양","남창","서생","월내","좌천","일광","기장","오시리아","송정","신해운대","벡스코","센텀","재송","부산원동","안락","동래","교대","거제","거제해맞이","부전"];
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
var ud = 'up';
var index = getTrainLocation(time);
if(num%2==0) {
ud = 'down';
index = stas.length - index - 1;
}

result[index][ud] = train;
}
fs.writeFileSync('result.json', JSON.stringify(result, null, 4));

/* 시간 기반으로 열차의 위치를 가지고 옴 */
function getTrainLocation(time) {
for (n = time.length - 1; n >= 0; n--) {
var tym = timeToSec(time[n].time);
if(now==tym) return n;
if(now > tym) return n + 1;
}
return 0;
}

/* 원활한 시간 비교를 위해 초 단위로 변환해주는 함수 */
function timeToSec(time) {
var t = time.split(':');
return Number(t[0])*60*60 + Number(t[1])*60 + Number(t[2]);
}

