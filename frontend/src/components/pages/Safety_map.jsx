import React, { useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import mapMarker from '../../assets/final_logo.png'
import './SafetyMap.css'
import L from "leaflet";

import 'leaflet/dist/leaflet.css'; 
import osm from "../osm-providers.js";
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Override the default icon for ALL markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: mapMarker,
    iconRetinaUrl: mapMarker,
    shadowUrl: markerShadow,
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [0, -50],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
})

export const Safety_map = ({ approvedStories = [] }) => {
    const [center, setCenter] = useState({ lat: 14.412687356644929, lng: 120.98123147922286 })
    const ZOOM_LEVEL = 20; // Zoomed out a bit to see multiple markers
    const mapRef = useRef();

    // Filter stories that have location data
    const storiesWithLocation = approvedStories.filter(story => story.location);

    return (
        <>
            <div className='safetyMap'>
                <h2>Safety Map</h2>
                {/* <p className='showIncidents'>
                    Approved safety incidents: {storiesWithLocation.length} 
                </p> */}
                
                <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={ZOOM_LEVEL}
                    ref={mapRef}
                    style={{ height: '600px', width: '80%', margin: '0 auto', border: 'black 2px solid'}}
                    dragging={true}
                    scrollWheelZoom={true}
                    doubleClickZoom={true}
                    touchZoom={true}
                    keyboard={true}
                    zoomControl={true}
                >
                    <TileLayer
                        url={osm.mapTiler.url}
                        attribution={osm.mapTiler.attribution}
                    />
                    
                    {/* Render markers for approved stories */}
                    {storiesWithLocation.map((story) => (
                        <Marker 
                            key={story.id} 
                            position={[story.location.lat, story.location.lng]}
                        >
                            <Popup maxWidth={300} minWidth={200}>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: 'black' }}>
                                        Story Incident
                                    </h4>
                                    <p style={{ 
                                        margin: '8px 0', 
                                        lineHeight: '1.4',
                                        fontSize: '14px'
                                    }}>
                                        {story.text}
                                    </p>
                                    <hr style={{ margin: '10px 0', border: '0.5px solid #eee' }} />
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        <p style={{ margin: '4px 0' }}>
                                            <strong>Location:</strong> {story.location.lat.toFixed(6)}, {story.location.lng.toFixed(6)}
                                        </p>
                                        <p style={{ margin: '4px 0' }}>
                                            <strong>Reported:</strong> {new Date(story.submittedAt).toLocaleDateString()}
                                        </p>
                                        <p style={{ 
                                            margin: '8px 0 0 0', 
                                            padding: '4px 8px',
                                            backgroundColor: '#e8f5e8',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            color: '#2e7d32'
                                        }}>
                                            Verified Report
                                        </p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Legend/Info Box */}
                {/* <div style={{
                    maxWidth: '80%',
                    margin: '20px auto',
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Map Legend</h3>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundImage: `url(${mapMarker})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            marginRight: '10px'
                        }}></div>
                        <span style={{ fontSize: '14px' }}>Safety incident location (admin verified)</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: '10px 0 0 0' }}>
                        Click on any marker to view incident details. All reports have been reviewed and approved by administrators.
                    </p>
                </div> */}

                {/* {storiesWithLocation.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        <h3>No incidents to display</h3>
                        <p>No approved safety incidents with locations are currently available.</p>
                    </div>
                )} */}
            </div>
        </>
    )
}