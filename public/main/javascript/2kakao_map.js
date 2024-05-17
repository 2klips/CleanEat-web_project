// kakao_map.js

// localStorage에서 주소 데이터를 가져옵니다.
const addresses = JSON.parse(localStorage.getItem('addresses')) || [];

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 


var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566535, 126.97796919999996), // 초기 지도의 중심좌표 (서울시청)
        level: 3 // 지도의 확대 레벨
    };  



// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 여러 개의 주소에 대해 마커를 표시합니다
addresses.forEach(location => {
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(location.address, function(result, status) {

        // 정상적으로 검색이 완료됐으면 
        if (status === kakao.maps.services.Status.OK) {

            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
                content: `<div style="width:150px;text-align:center;padding:6px 0;">${location.name}</div>`
            });

            kakao.maps.event.addListener(marker, 'click', function() {
                closeAllInfoWindows();
                infowindow.open(map, marker);
            });

            infowindows.push(infowindow);

        } 
    });    
});

