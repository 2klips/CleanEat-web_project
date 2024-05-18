// 기존 kakao_map.js 내용 임시 저장


var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.500716, 127.036539), // 초기 지도 중심 좌표
        level: 3 // 지도 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
var geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

var positions = [];

positions.forEach(function(position) {
    var marker = new kakao.maps.Marker({
        map: map,
        position: position.latlng,
        title: position.title
    });

    var customOverlay = new kakao.maps.CustomOverlay({
        content: position.content,
        position: marker.getPosition(),
        yAnchor: 1.5
    });

    customOverlay.setMap(map);

    kakao.maps.event.addListener(marker, 'click', function() {
        // 모든 커스텀 오버레이를 제거하고, 현재 마커에 해당하는 오버레이만 표시
        positions.forEach(p => p.customOverlay && p.customOverlay.setMap(null));
        customOverlay.setMap(map);
    });
});

var markers = []; // 기존 마커들을 저장할 배열
var overlays = []; // 기존 커스텀 오버레이를 저장할 배열

// 인포윈도우 내용 생성
function createInfoWindowContent(name, addr, tel, rank) {
    // rank 값에 따라 텍스트를 변경합니다.
    let rankText;
    switch (rank) {
        case '매우우수':
            rankText = '매우 우수 ⭐⭐⭐';
            break;
        case '우수':
            rankText = '우수 ⭐⭐';
            break;
        case '좋음':
            rankText = '좋음 ⭐';
            break;
        default:
            rankText = '';
    }
    
    // tel에 * 기호가 포함되어 있으면 공백으로 대체
    if (tel.includes('*')) {
        tel = '';
    } else if (tel.startsWith('02')) {
        // 02로 시작하는 경우 포맷 변경
        tel = tel.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }


    return `
        <div class="custom-info-window" onclick="location.href='./more.html';">
            <h4 class="info-title">${name}</h4>
            <div class="info-address">${addr}</div>
            <div class="info-phone">${tel}</div>
            <div class="info-rating">${rankText}</div>
        </div>
    `;
}
{/* <img class="info-marker-icon" src="./css/images/bookmark-full.svg" alt="마커 아이콘" style="width: 25px" /> */}

// 기존 마커와 인포윈도우를 제거하는 함수
function clearMarkersAndOverlays() {
    markers.forEach(marker => marker.setMap(null));
    overlays.forEach(overlay => overlay.setMap(null));
    markers = [];
    overlays = [];
}

// 검색된 주소를 지도에 표시하는 함수
function searchAndDisplayAddress(data) {
    if (!data.addr || data.addr.trim() === "") {
        console.error('Invalid address:', data.addr);
        return;
    }
    geocoder.addressSearch(data.addr, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 마커 이미지 설정
            var imageSrc = './css/images/map_marker.svg', // 마커 이미지 URL
                imageSize = new kakao.maps.Size(44, 49), // 마커 이미지 크기
                imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커 이미지의 좌표와 일치할 위치

            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            var marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage, // 마커 이미지 설정
                title: data.name // 마커의 타이틀 설정
            });
            markers.push(marker); // 마커를 배열에 저장

            var infowindowContent = createInfoWindowContent(data.name, data.addr, data.tel, data.rank); // 커스텀 인포윈도우 내용 생성

            var customOverlay = new kakao.maps.CustomOverlay({
                position: coords,
                content: infowindowContent,
                yAnchor: 0.9 // 인포윈도우의 Y축 앵커 조정
            });
            overlays.push(customOverlay); // 커스텀 오버레이를 배열에 저장
            customOverlay.setMap(map);
            map.setCenter(coords);
        } else {
            console.error('Failed to search address:', data.addr, status);
        }
    });
}


// searchAndDisplayAddress 함수를 전역으로 노출
window.searchAndDisplayAddress = searchAndDisplayAddress;
window.clearMarkersAndOverlays = clearMarkersAndOverlays;


//--------------------------------------------------------------------------
// 현재 위치를 저장할 변수
let currentLocation = null;

// 현재 위치를 표시할 원 요소 생성 및 스타일 설정
var currentLocationOverlay = new kakao.maps.CustomOverlay({
    position: new kakao.maps.LatLng(0, 0),
    content: '<div id="current-location-circle"></div>',
    yAnchor: 0.5,
    xAnchor: 0.5
});

// 지도에 오버레이를 추가
currentLocationOverlay.setMap(map);

// 현재 위치를 지도 중심으로 다시 잡아주는 함수
function recenterMap() {
    if (currentLocation) {
        map.setCenter(currentLocation);
    } else {
        console.error('Current location is not available.');
    }
}

// 현재 위치를 지도에 표시하고 실시간으로 업데이트하는 함수
function watchCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            currentLocation = new kakao.maps.LatLng(lat, lng);

            currentLocationOverlay.setPosition(currentLocation);
            map.setCenter(currentLocation);
        }, function(error) {
            console.error('Error occurred. Error code: ' + error.code);
        }, {
            enableHighAccuracy: true, // 높은 정확도로 위치를 가져옵니다.
            maximumAge: 0, // 캐시된 위치 정보를 사용하지 않습니다.
            timeout: Infinity // 위치 정보를 가져올 때까지 무한정 대기합니다.
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// 버튼 클릭 시 지도 중심을 현재 위치로 이동
document.getElementById('recenter-btn').addEventListener('click', recenterMap);

watchCurrentLocation(); // 실시간 위치 추적 시작

// 버튼 클릭 시 지도 중심을 현재 위치로 이동
document.getElementById('recenter-btn').addEventListener('click', recenterMap);


kakao.maps.event.addListener(map, 'zoom_changed', updateLocationOverlay);
kakao.maps.event.addListener(map, 'center_changed', updateLocationOverlay);

// 위치 오버레이 업데이트 함수
function updateLocationOverlay() {
    var lat = parseFloat(currentLocationOverlay.getPosition().Ma);
    var lng = parseFloat(currentLocationOverlay.getPosition().La);
    var locPosition = new kakao.maps.LatLng(lat, lng);

    currentLocationOverlay.setPosition(locPosition);
}