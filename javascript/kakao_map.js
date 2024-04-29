var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), 
        level: 3 
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 드래그 기능을 활성화합니다
map.setDraggable(true);

var positions = [
    {
        title: '카카오', 
        latlng: new kakao.maps.LatLng(33.450705, 126.570677),
        content: '<div style="padding:5px;">카카오 오피스<br><a href="https://map.kakao.com/link/map/33.450705,126.570677" target="_blank">지도보기</a></div>'
    },
    {
        title: '생태연못', 
        latlng: new kakao.maps.LatLng(33.450936, 126.569477),
        content: '<div style="padding:5px;">생태연못<br><a href="https://map.kakao.com/link/map/33.450936,126.569477" target="_blank">지도보기</a></div>'
    },
    {
        title: '텃밭', 
        latlng: new kakao.maps.LatLng(33.450879, 126.569940),
        content: '<div style="padding:5px;">텃밭<br><a href="https://map.kakao.com/link/map/33.450879,126.569940" target="_blank">지도보기</a></div>'
    },
    {
        title: '근린공원',
        latlng: new kakao.maps.LatLng(33.451393, 126.570738),
        content: '<div style="padding:5px;">근린공원<br><a href="https://map.kakao.com/link/map/33.451393,126.570738" target="_blank">지도보기</a></div>'
    }
];

var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 

var lastOpenedInfoWindow = null;

for (var i = 0; i < positions.length; i++) {
    var imageSize = new kakao.maps.Size(24, 35);
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map,
        position: positions[i].latlng,
        title: positions[i].title,
        image: markerImage
    });

    var infowindow = new kakao.maps.InfoWindow({
        content: positions[i].content
    });

    // 기본적으로 인포윈도우를 열어둡니다
    infowindow.open(map, marker);  // 마커 생성 후 바로 인포윈도우 열기

    kakao.maps.event.addListener(marker, 'click', (function(infowindow, marker) {
        return function() {
            if (lastOpenedInfoWindow && lastOpenedInfoWindow === infowindow) {
                // 같은 인포윈도우 클릭 시 닫기
                infowindow.close();
                lastOpenedInfoWindow = null;
            } else {
                // 다른 인포윈도우 열기 전에 기존 인포윈도우 닫기
                if (lastOpenedInfoWindow) {
                    lastOpenedInfoWindow.close();
                }
                infowindow.open(map, marker); // 새로운 인포윈도우 열기
                lastOpenedInfoWindow = infowindow; // 현재 열린 인포윈도우 업데이트
            }
             // 지도 중심을 클릭된 마커의 위치로 이동
            map.setCenter(marker.getPosition());
            // 지도의 줌 레벨을 설정 (예: 5로 설정)
            map.setLevel(1);
        };
    })(infowindow, marker));
}