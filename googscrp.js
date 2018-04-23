(function () {

    const areas = {
        "Agege": {
            latLng: {},
            sub: {}
        },
        "Ajah": {
            latLng: {},
            sub: {}
        },
        "Ajaokuta": {
            latLng: {},
            sub: {}
        },
        "Alagbado": {
            latLng: {},
            sub: {}
        },
        "Alimosho": {
            latLng: {},
            sub: {}
        },
        "Amuwo Odofin": {
            latLng: {},
            sub: {}
        },
        "Apapa": {
            latLng: {},
            sub: {}
        },
        "Atlantic City": {
            latLng: {},
            sub: {}
        },
        "Badagry": {
            latLng: {},
            sub: {}
        },
        "Ebute Metta": {
            latLng: {},
            sub: {}
        },
        "Egbe Idimu": {
            latLng: {},
            sub: {}
        },
        "Egbeda": {
            latLng: {},
            sub: {}
        },
        "Ejigbo": {
            latLng: {},
            sub: {}
        },
        "Epe": {
            latLng: {},
            sub: {}
        },
        "Gbagada": {
            latLng: {},
            sub: {}
        },
        "Ijaiye": {
            latLng: {},
            sub: {}
        },
        "Ibeju Lekki": {
            latLng: {},
            sub: {}
        },
        "Idi Araba": {
            latLng: {},
            sub: {}
        },
        "Idimu": {
            latLng: {},
            sub: {}
        },
        "Iganmu": {
            latLng: {},
            sub: {}
        },
        "Iju": {
            latLng: {},
            sub: {}
        },
        "Ikeja": {
            latLng: {},
            sub: {}
        },
        "Ikorodu": {
            latLng: {},
            sub: {}
        },
        "Ikotun": {
            latLng: {},
            sub: {}
        },
        "Ikotun Igando": {
            latLng: {},
            sub: {}
        },
        "Ikoyi": {
            latLng: {},
            sub: {}
        },
        "Ilaje": {
            latLng: {},
            sub: {}
        }
    };

    const input = document.getElementById('query-input');
    const queryBtn = document.getElementById('geocode-button');

    const areaNames = Object.keys(areas);

    function* GetLatLng(areas) {
        for (let i=0; i<areas.length; i++) {
            yield new Promise((resolve, reject) => {
                let timeout;

                input.value = areas[i]+', Lagos, Nigeria';
                queryBtn.click();

                $('#status-display-div').find('strong').text('wait');

                const ig = () => {
                    let status = $('#status-display-div').find('strong').text();
                    if (status !=='wait' && status === 'OK') {
                        const location = $($('#results-display-div').find('.result-location')[0]).text().trim().replace(/Location:\W+/, '');
                        const locWords = location.split(',');
                        clearInterval(timeout);
                        resolve({ area: areas[i], lat: Number(locWords[0]), lng: Number(locWords[1]) });
                        return;
                    }

                    if (status !=='wait' && status !== 'OK') {
                        clearInterval(timeout);
                        resolve({ area: areas[i], lat: 0, lng: 0 });
                        return;
                    }
                }
                
                timeout = setInterval(ig, 5000);
            });
        }
    }

    const getLatLng = GetLatLng(areaNames);
    const addressLatLng = [];

    function etr() {
        const latLng = getLatLng.next();

        if (latLng.done) {
            console.log(addressLatLng);
            console.log(JSON.stringify(areas));
            return;
        }

        latLng.value.then((d) => {
            console.log(d);
            addressLatLng.push(d);
            areas[d.area].latLng = { lat: d.lat, lng: d.lng };
            etr();
        });
    }

    etr();
})();