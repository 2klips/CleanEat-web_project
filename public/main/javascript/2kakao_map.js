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
    
    if (tel.includes('*')) {
        tel = '';
    } else if (tel.startsWith('02')) {
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

function clearMarkersAndOverlays() {
    markers.forEach(marker => marker.setMap(null));
    overlays.forEach(overlay => overlay.setMap(null));
    markers = [];
    overlays = [];
}

function searchAndDisplayAddress(data) {
    if (!data.addr || data.addr.trim() === "") {
        console.error('Invalid address:', data.addr);
        return;
    }
    geocoder.addressSearch(data.addr, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            var imageSrc = './css/images/map_marker.svg',
                imageSize = new kakao.maps.Size(44, 49),
                imageOption = { offset: new kakao.maps.Point(27, 69) };

            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            var marker = new kakao.maps.Marker({
                map: map,
                position: coords,
                image: markerImage,
                title: data.name
            });
            markers.push(marker);

            var infowindowContent = createInfoWindowContent(data.name, data.addr, data.tel, data.rank);

            var customOverlay = new kakao.maps.CustomOverlay({
                position: coords,
                content: infowindowContent,
                yAnchor: 0.9
            });
            overlays.push(customOverlay);
            customOverlay.setMap(map);
            map.setCenter(coords);
        } else {
            console.error('Failed to search address:', data.addr, status);
        }
    });
}

window.searchAndDisplayAddress = searchAndDisplayAddress;
window.clearMarkersAndOverlays = clearMarkersAndOverlays;

let currentLocation = null;

var currentLocationOverlay = new kakao.maps.CustomOverlay({
    position: new kakao.maps.LatLng(0, 0),
    content: '<div id="current-location-circle"></div>',
    yAnchor: 0.5,
    xAnchor: 0.5
});

currentLocationOverlay.setMap(map);

function recenterMap() {
    if (currentLocation) {
        map.setCenter(currentLocation);
    } else {
        console.error('Current location is not available.');
    }
}

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
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: Infinity
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

document.getElementById('recenter-btn').addEventListener('click', recenterMap);

watchCurrentLocation();

kakao.maps.event.addListener(map, 'zoom_changed', updateLocationOverlay);
kakao.maps.event.addListener(map, 'center_changed', updateLocationOverlay);

function updateLocationOverlay() {
    var lat = parseFloat(currentLocationOverlay.getPosition().Ma);
    var lng = parseFloat(currentLocationOverlay.getPosition().La);
    var locPosition = new kakao.maps.LatLng(lat, lng);

    currentLocationOverlay.setPosition(locPosition);
}

// 추가된 부분

function getMapCenter() {
    return map.getCenter();
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat) / 2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

function sortResultsByDistance(results, center) {
    return results.sort((a, b) => {
        const distanceA = calculateDistance(center.getLat(), center.getLng(), a.lat, a.lng);
        const distanceB = calculateDistance(center.getLat(), center.getLng(), b.lat, b.lng);
        return distanceA - distanceB;
    });
}

const MAX_MARKERS = 10; // 출력할 최대 마커 수

async function displayData(datas) {
    const container = document.getElementById('slide');
    container.innerHTML = ''; // 이전 데이터를 지웁니다.
    const empty = document.createElement('div')
    empty.id = 'slide-empty'
    container.appendChild(empty);

    // 새로운 검색 시 기존 마커들과 인포윈도우를 제거
    clearMarkersAndOverlays();

    // 카카오맵에 보낼 주소 저장
    const addresses = [];

    if (datas && Array.isArray(datas)) {
        datas.forEach(item => {
            if (!item || Object.keys(item).length === 0) {
                return;
            }

            if (item.addr) {
                addresses.push({
                    addr: item.addr,
                    name: item.name || '',
                    rank: item.rank || '',
                    tel: item.tel || '',
                    lat: item.lat, // 위도 추가
                    lng: item.lng  // 경도 추가
                });
            }
        });

        // 지도 중심 좌표 가져오기
        const center = getMapCenter();
        // 검색 결과를 거리 기준으로 정렬
        const sortedAddresses = sortResultsByDistance(addresses, center);
        // 최대 마커 수만큼 잘라내기
        const limitedAddresses = sortedAddresses.slice(0, MAX_MARKERS);

        // localStorage에 주소 저장
        localStorage.setItem('addresses', JSON.stringify(limitedAddresses));
        addMarkers(limitedAddresses);
    } else {
        console.error('데이터가 없습니다.');
    }
}

function addMarkers(addressData) {
    clearMarkersAndOverlays(); // 기존 마커와 오버레이 제거
    addressData.forEach(data => {
        searchAndDisplayAddress(data);
    });
}
