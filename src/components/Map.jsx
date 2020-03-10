import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import miso from './mapData/miso.json';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';

mapboxgl.accessToken =
  'pk.eyJ1IjoidGZpdHpnZTEzNCIsImEiOiJjazdma3dma3IwM3p0M2RvMHlld2hoZ3JsIn0.qrSPDs1oe9j87_My6LrYTA';

class Map extends Component {
  state = {
    lng: -94.4266,
    lat: 41.3424,
    zoom: 3.4,
    features: []
  };

  // call api here to /api/miso
  handleGetFeatures = () => {
    fetch(
      'https://api.misoenergy.org/MISORTWDDataBroker/DataBrokerServices.asmx?messageType=getlmpconsolidatedtable&returnType=json'
    )
      .then(res => res.json())
      .then(misoPrice => {
        //console.log('miso', miso);
        //console.log('misoPrice', misoPrice.LMPData.FiveMinLMP.PricingNode);
        const { PricingNode } = misoPrice.LMPData.FiveMinLMP;
        let features = [];
        miso.filter(m => {
          PricingNode.filter(p => {
            if (m.nodeid === p.name) {
              const { nodeid, city, state, lat, long } = m;
              const { LMP } = p;
              let obj = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [long, lat]
                },
                properties: {
                  nodeid,
                  city,
                  icon: 'monument',
                  state,
                  lat,
                  long,
                  price: `$${LMP}`
                }
              };

              features.push(obj);
            }
          });
        });

        this.setState({ features: features });
      });
    console.log('oik');
    const minutes = 5,
      the_interval = minutes * 60 * 1000;
    setTimeout(this.handleGetFeatures, the_interval);
  };

  handlePageReload = () => {
    const minutes = 5.2,
      the_interval = minutes * 60 * 1000;
    setInterval(() => {
      window.location.reload();
    }, the_interval);
  };

  componentDidMount() {
    this.handleGetFeatures();
    this.handlePageReload();

    setTimeout(() => {
      const map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.state.lng, this.state.lat],
        zoom: this.state.zoom
      });

      map.on('move', () => {
        this.setState({
          lng: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2)
        });
      });

      const nodesSource = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: this.state.features
        }
      };

      map.on('load', function() {
        map.addSource('nodes', nodesSource);
        map.addLayer({
          id: 'points',
          type: 'symbol',
          source: 'nodes',
          layout: {
            // get the icon name from the source's "icon" property
            // concatenate the name to get an icon from the style's sprite sheet
            'icon-image': ['concat', ['get', 'icon'], '-15'],
            // get the title name from the source's "title" property
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'
          }
        });
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'points', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'points', function() {
          map.getCanvas().style.cursor = '';
        });
        map.on('click', 'points', function(e) {
          console.log('lciekd on nodes');
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.nodeid;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
              `<h1>${description}</h1><h3>Price: ${e.features[0].properties.price}</h3>`
            )
            .addTo(map);
        });
      });
    }, 1000);
  }

  render() {
    return (
      <div className="map-wrap">
        <Navbar />
        <div className="map">
          <div className="left-side"></div>
          <div className="right-side">
            <div className="sidebarStyle">
              <div>
                Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{' '}
                {this.state.zoom}
              </div>
            </div>
            <div
              ref={el => (this.mapContainer = el)}
              className="mapContainer"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
