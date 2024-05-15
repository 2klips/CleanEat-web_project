var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.500716, 127.036539), // 초기 지도 중심 좌표
        level: 3 // 지도 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
var geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환 객체 생성

function createInfoWindowContent(title, address, phone, rating) {
    return `
        <div class="custom-info-window" onclick="location.href='./more.html';">
            <h4 class="info-title">${title}</h4>
            <div class="info-address">${address}</div>
            <div class="info-phone">${phone}</div>
            <div class="info-rating">${rating}</div>
            <img class="info-marker-icon" src="./css/images/bookmark-full.svg" alt="마커 아이콘" style="width: 25px" />
        </div>
    `;
}

var positions = [
    {
        title: '캘리포니아 피자키친',
        latlng: new kakao.maps.LatLng(37.500049, 127.036743),
        content: createInfoWindowContent('캘리포니아 피자키친', '서울시 강남구 논현로 85길 43', '02-043-0000', '⭐⭐⭐')
    },
    {
        title: '즐거운돈까스',
        latlng: new kakao.maps.LatLng(37.500816, 127.035493),
        content: createInfoWindowContent('즐거운돈까스', '서울시 강남구 논현로 85길 43', '02-043-0000', '⭐⭐⭐')
    },
    {
        title: '수제팔도찹쌀순대', 
        latlng: new kakao.maps.LatLng(37.500739, 127.034283),
        content: createInfoWindowContent('수제팔도찹쌀순대', '서울시 강남구 논현로 85길 43', '02-043-0000', '⭐⭐⭐')
    },
    {
        title: '오사무식당',
        latlng: new kakao.maps.LatLng(37.499788, 127.034834),
        content: createInfoWindowContent('오사무식당', '서울시 강남구 논현로 85길 43', '02-043-0000', '⭐⭐⭐', 'path/to/your/image1.jpg')
    }
];

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

function searchAndDisplayAddress(address) {
    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });
            var infowindow = new kakao.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;">검색한 위치</div>'
            });
            infowindow.open(map, marker);
            map.setCenter(coords);
        }
    });
}

// 예시로 검색 함수 호출
searchAndDisplayAddress('제주특별자치도 제주시 첨단로 242');