var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new kakao.maps.LatLng(37.500716, 127.036539), 
        level: 3
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 드래그 기능을 활성화합니다
map.setDraggable(true);

// 인포윈도우의 내용을 생성하는 함수
function createInfoWindowContent(title, address, phone, rating) {
    return `
        <div class="custom-info-window">
            <h4 class="info-title">${title}</h4>
            <div class="info-address">${address}</div>
            <div class="info-phone">${phone}</div>
            <div class="info-rating">${rating}</div>
            <img class="info-marker-icon" src="./css/images/bookmark-full.svg" alt="마커 아이콘" style="width: 25px" />
        </div>
    `;
}

{/* <img class="info-image" src="${imageSrc}" alt="Your Image" /> */}

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

var infowindows = [];

positions.forEach(function(position) {
    var markerImage = new kakao.maps.MarkerImage("./css/images/location-outline.svg", new kakao.maps.Size(50, 50)); // 원하는 이미지 경로와 크기로 수정하세요.

    var marker = new kakao.maps.Marker({
        map: map,
        position: position.latlng,
        title: position.title,
        image: markerImage // 커스텀 마커 이미지 설정
    });

    var customOverlay = new kakao.maps.CustomOverlay({
        content: position.content,
        position: marker.getPosition(),
        yAnchor: 1.5 // 인포윈도우를 마커 이미지의 아래에 위치하도록 조정
    });

    infowindows.push(customOverlay);

    // 모든 인포윈도우를 열어줍니다.
    customOverlay.setMap(map);

    // 마커 클릭 이벤트에 대한 핸들러
    kakao.maps.event.addListener(marker, 'click', function() {
        infowindows.forEach(function(infowindow) {
            infowindow.setMap(null); // 모든 인포윈도우를 닫음
        });
        customOverlay.setMap(map); // 해당 마커의 인포윈도우를 엶
        map.setCenter(marker.getPosition()); // 마커 위치로 지도 중심을 이동
        map.setLevel(2); // 지도 레벨 조정
    });

});
