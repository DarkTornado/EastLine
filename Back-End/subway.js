const fs = require('fs');

function init() {
    /* 기본 */
    var stas = ['부전', '거제해맞이', '거제', '교대', '동래', '안락', '부산원동', '재송', '센텀', '벡스코', '신해운대', '송정', '오시리아', '기장', '일광', '좌천', '월내', '서생', '남창', '망양', '덕하', '개운포', '태화강'];
    var result = [];
    stas.forEach((e) => {
        result.push({
            sta: e,
            up: null,
            down: null
        });
    });

    /* 타임 존 한국으로 변경 */
    process.env.TZ = 'Asia/Seoul';

    /* 원활한 시간 비교를 위해 초 단위로 변환 */
    var date = new Date();
    var now = 60 * 60 * date.getHours() + 60 * date.getMinutes() + date.getSeconds();

    /* 열차별 운행 정보 시간표 */
    var data = fs.readFileSync('./time_table/weekday_202211105.json').toString(); //일단 평일용
    data = JSON.parse(data);

    for (var train in data) {
        var time = data[train];

        /* 운행중이지 않은 열차 필터링 */
        var tym = timeToSec(time.at(-1).arrival);
        if (tym < now) continue;
        tym = timeToSec(time[0].departure);
        if (now < tym) continue;

        /* 상/하행 구분 및 위치 가지고 옴 */
        var num = Number(train[train.length - 1]);
        var ud = num % 2 == 0 ? 'up' : 'down';
        var info = getTrainLocation(time, now);
        var index = stas.indexOf(info.station);
        console.log(index, info);
        result[index][ud] = [train, info.status];
    }

    return result;
}

/* 시간 기반으로 열차의 위치를 가지고 옴 */
function getTrainLocation(time, now) {
    for (var n = 1; n < time.length; n++) { //0 접근, 1 도착
        var arrival = timeToSec(time[n].arrival);
        if (now < arrival) return {
            'station': time[n].station,
            'status': 0
        };
        var departure = timeToSec(time[n].departure);
        if (now < departure) return {
            'station': time[n].station,
            'status': 1
        };
    }
    return 0;
}

/* 원활한 시간 비교를 위해 초 단위로 변환해주는 함수 */
function timeToSec(time) {
    var t = time.split(':');
    return Number(t[0]) * 60 * 60 + Number(t[1]) * 60 + Number(t[2]);
}

module.exports.createData = init;

