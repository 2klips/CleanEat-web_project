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

            console.log('Creating marker at:', coords);

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

            console.log('Marker created:', marker);

            var infowindowContent = createInfoWindowContent(data.name, data.addr, data.tel, data.rank); // 커스텀 인포윈도우 내용 생성

            var customOverlay = new kakao.maps.CustomOverlay({
                position: coords,
                content: infowindowContent,
                yAnchor: 0.7 // 인포윈도우의 Y축 앵커 조정
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