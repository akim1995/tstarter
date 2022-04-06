/* eslint-disable */
;(function() {
    // GLOBAL_FILIALS_DATA from global_addresses.js file !!!
    const placemarksData = GLOBAL_FILIALS_DATA.concat(GLOBAL_FRANCHISE_DATA);
    const mobileResolution = '768px';
    let myMap = null;
    const mapEl = document.getElementById('map');
    const optionsMapObserver = {
      rootMargin: '200px',
      threshold: 1.0
    };
    function initMapObserver (entries) {
        if(myMap !== null) return;
        entries.forEach(entry => {
            if( entry.isIntersecting ) {
                ymaps.ready(init);
            }
        })
    };
    const observer = new IntersectionObserver(initMapObserver, optionsMapObserver);
    observer.observe(mapEl);
    function init() {
      // ymaps.geolocation.get({provider: 'yandex',
      //     mapStateAutoApply: true}).then(result =>{myMap.geoObjects.add(result.geoObjects);
      // myMap.geoObjects.remove(result.geoObjects);
      // console.log(result.geoObjects);});
      const mapId = document.getElementById("map");
      myMap = new ymaps.Map(mapId, {
        center: [54.24801290964209,37.773155011718764],
        zoom: 4,
        controls: []
      });
      const mapCluster = new ymaps.Clusterer({
        preset: 'islands#darkGreenClusterIcons',
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        hasBalloon: false,
        hasBalloon: false,
        zoomMargin: document.documentElement.clientWidth > 768 ? 190 : 130
      });
      var geolocationLayout = ymaps.templateLayoutFactory.createClass(`
                <div class="ya-maps__zoom-control">
                    <svg  class="ya-maps__zoom-svg-icon"  style="left: 46%; width: 33px;"viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.81905 15.1705L28.6062 2.4232L20.8704 30.7352L16.0521 19.5546L15.8683 19.1281L15.424 18.9934L2.81905 15.1705Z" stroke="white" stroke-width="2"/>
                    </svg>
                </div>`
      );
      var ZoomLayout = ymaps.templateLayoutFactory.createClass(`
                    <div>
                        <div id="zoom-in" class="ya-maps__zoom-control">
                            <svg  class="ya-maps__zoom-svg-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="15" width="32" height="2" fill="white"/>
                            <rect x="17" width="32" height="2" transform="rotate(90 17 0)" fill="white"/>
                            </svg>
                        </div>
                    <div id="zoom-out" class="ya-maps__zoom-control">
                        <div style="width:32px; height:2px; position: absolute; top: 50%; left: 50%; background: white; transform: translateX(-50%) translateY(-50%);"> </div>
                    </div>
                    </div>
                `, {
          build: function () {
            ZoomLayout.superclass.build.call(this);
            this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
            this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);
            document.getElementById('zoom-in').addEventListener('click', this.zoomInCallback);
            document.getElementById('zoom-out').addEventListener('click', this.zoomOutCallback);
          },
          clear: function () { },
          zoomIn: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
          },
          zoomOut: function () {
            var map = this.getData().control.getMap();
            map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
          }
        });
      var zoomControl = new ymaps.control.ZoomControl({ options: { layout: ZoomLayout } });
      var geolocationControl = new ymaps.control.GeolocationControl({ options: { layout: geolocationLayout } });
      myMap.controls.add(geolocationControl, {
        position: {
          top: '80px',
          right: '30px'
        }
      });
      myMap.controls.add(zoomControl, {
        position: {
          top: '150px',
          right: '30px'
        }
      });
      myGeoObject = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: myMap.getCenter()
        },
        properties: { iconColor: '#3b5998', }
      }, {});
      function Placemark(coords = myMap.getCenter(), address = "", tel = "") {
        let telTemplate = '';
        const phonelist = address.phones.map( phone => `<li>${phone}</li>` ).join('');
        if (Array.isArray(tel)) {
          let template = '';
          tel.forEach(singleTel => { template += `<div class="ya-maps__phone"><span class="ya-maps__phone-link" >${singleTel}</span></div>` })
          telTemplate = template;
        } else { telTemplate = `<div class="ya-maps__phone"><span class="ya-maps__phone-link" >${tel}</span></div>` } const placemark = new ymaps.Placemark(coords, null, {
          iconLayout: 'default#image',
          iconImageHref: 'https://res.cloudinary.com/duz1yo4sl/image/upload/v1553700558/ui/map_pin.png',
          iconImageSize: [48, 64],
          iconImageOffset: [-24, -64]
        });
        const hintContent = `
                    <div class="hint-container">
                        <div class="ya-maps__company">
                          ${address.company}
                        </div>
                        <div class="ya-maps__header">Адрес офиса:</div>
                        ${address.address}
                        <ul class="ya-maps__phonelist">
                          ${phonelist}
                        </ul>
                    </div>
                        <!-- <a class="ya-maps__email" href="malito:alice@tstarter.ru">alice@tstarter.ru </a> -->
                        <!--<div class="ya-maps__person">
                            <div class="ya-maps__face" style="background-image:url('https://res.cloudinary.com/duz1yo4sl/image/upload/v1553510444/woman_face_1.png');"></div>
                            <div>
                                <div class="ya-maps__person-name">Алиса Сидоренко</div>
                                <div class="ya-maps__person-position">Руководитель головного офиса компании<br> «Транс Стартер» </div>
                            </div>
                        </div> -->
                    </div>
                `;
        const balloonContentBody = `
                <div class="baloonContentBody">
                    <div class="ya-maps">
                        <div class="ya-maps__header">Адрес офиса</div>
                        ${address.address}
                        <ul class="ya-maps__phonelist">
                          ${phonelist}
                        </ul>
                        <a class="ya-maps__email" href="//${address.website}">${address.website}</a>
                        <!--<div class="ya-maps__person">
                            <div class="ya-maps__face" style="background-image:url('https://res.cloudinary.com/duz1yo4sl/image/upload/v1553510444/woman_face_1.png');"></div>
                            <div>
                                <div class="ya-maps__person-name">Алиса Сидоренко</div>
                                <div class="ya-maps__person-position">Руководитель головного офиса компании<br> «Транс Стартер» </div>
                            </div>
                        </div> -->
                    </div>
                </div>
                `;
        placemark.properties.set({ balloonContentBody, hintContent, address, tel });
        function animateMapInfo() {
          const mapInfoBlock = document.querySelector('.map-info');
          const animationDurationMilliseconds = 400;
          mapInfoBlock.style.animationDuration = animationDurationMilliseconds + "ms";
          mapInfoBlock.style.animationName = "blink";
          setTimeout(() => { mapInfoBlock.style.animationName = ""; }, animationDurationMilliseconds)
        }
        placemark.events.add('click', function (e) {
          document.getElementsByClassName('map-info__body')[0].style.display = "block";
          const phoneList = document.getElementById("phone-list");
          e.stopPropagation();
          const { address, tel } = placemark.properties.getAll();
          const mapAsideAddress = document.getElementById('mapAsideAddress');
          const mobileList = document.getElementById('phone-list');
          const mobile = window.matchMedia(`(max-width: ${mobileResolution})`).matches;
          const companySiteEl = document.getElementById('company-site');
          if(companySiteEl && address.website !== '') {
            companySiteEl.innerHTML = "";
            const link = document.createElement("a");
            link.href = `//${address.website}`;
            link.innerHTML = address.website;
            link.target = "_blank";
            companySiteEl.appendChild(link);
          }
          if (!mobile) {
            placemark.properties.set({ balloonContentBody: null });
            animateMapInfo();
          } else { placemark.properties.set({ balloonContentBody }); } mapAsideAddress.textContent = address.address;
          if (typeof address.phones !== 'undefined' && Array.isArray(address.phones)) {
          phoneList.innerHTML = "";
          address.phones.forEach((singleTel) => {
              const li = document.createElement("li");
              li.textContent = singleTel;
              phoneList.appendChild(li);
            });
          }
        })
        return placemark;
      }
      //*-------------------  Cluster of YMap ---------------------*//
      const points = placemarksData.map( point => point[0] );
      const geoObjects = [];
      placemarksData.forEach( marker => {
        geoObjects.push( Placemark( marker[0], marker[1]) );
      });
      mapCluster.add(geoObjects);
      myMap.geoObjects.add(mapCluster);
      myMap.setBounds(mapCluster.getBounds(), {
        zoomMargin: 50
      });
    /*-------------------------- End Cluster ---------------------------*/
      const mapSelector = document.querySelector(".desktop-city-select");
      const mapSelectorMobile = document.querySelector(".mobile-city-select");
      mapSelector.addEventListener('change', e => { setMapPosition(e) });
      mapSelectorMobile.addEventListener('change', e => { setMapPosition(e) });
      function setMapPosition(e) {
        document.getElementsByClassName('map-info__body')[0].style.display = "none";
        switch (e.target.value) {
          case 'default': {
            myMap.setCenter([58.057765855189736, -2.335747242274284]);
            myMap.setZoom(3);
            break;
          } case 'Kaliningrad': {
            myMap.setCenter([54.704528907978, 20.473791500000015]);
            myMap.setZoom(12);
            break;
          } case 'Moscow': {
            myMap.setCenter([55.584222181163646, 37.38552449999999]);
            myMap.setZoom(9);
            break;
          } case 'Astrakhan': {
            myMap.setCenter([46.34647366903166, 48.03767646826173]);
            myMap.setZoom(12);
            break;
          } case 'Arkhangelsk': {
            myMap.setCenter([64.56272891354934, 40.55266499999995]);
            myMap.setZoom(10);
            break;
          } case 'Krasnodar': {
            myMap.setCenter([45.06165537048585, 38.962197500000016]);
            myMap.setZoom(12);
            break;
          } case 'Leningrad': {
            myMap.setCenter([59.91807704072416, 30.304899499999895]);
            myMap.setZoom(10);
            break;
          } case 'Yekaterinburg': {
            myMap.setCenter([56.78875104810377, 60.60157099999987]);
            myMap.setZoom(10);
            break;
          } case 'Orenburg': {
            myMap.setCenter([51.7933427886505, 55.197472000000005]);
            myMap.setZoom(11);
            break;
          } case 'Perm': {
            myMap.setCenter([58.02283310604378, 56.2294204999999]);
            myMap.setZoom(11);
            break;
          } case 'Almaty': {
            myMap.setCenter([43.221309640757674, 76.95543649999995]);
            myMap.setZoom(11);
            break;
          } case 'Kyiv': {
            myMap.setCenter([50.40239488870545, 30.532734499999968]);
            myMap.setZoom(11);
            break;
          } case 'Novosibirsk': {
            myMap.setCenter([55.000665013597725, 82.95603900000002]);
            myMap.setZoom(10);
            break;
          }
           case 'Berezovski': {
            myMap.setCenter([56.90658036621604,60.82641536949153]);
            myMap.setZoom(13);
            break;
          }
           case 'Serov': {
            myMap.setCenter([59.60633329588266,60.580495999999975]);
            myMap.setZoom(12);
            break;
          } case 'Omsk': {
            myMap.setCenter([55.070792258316466,73.34821759765622]);
            myMap.setZoom(12);
            break;
          } case 'Saratov': {
            myMap.setCenter([51.53920339085138,46.007006499999896]);
            myMap.setZoom(12);
            break;
          } case 'Kirov': {
            myMap.setCenter([58.565420065904114,49.608258]);
            myMap.setZoom(15);
            break;
          }
        }
      }// myMap.geoObjects.add(myPlacemark);
      myMap.behaviors.disable('scrollZoom');
    }
  }())