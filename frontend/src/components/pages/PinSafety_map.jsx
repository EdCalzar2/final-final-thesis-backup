import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from "react-leaflet";
import mapMarker from '../../assets/final_logo.png'
import './SafetyMap.css'
import './PinSafety_map.css'
import L from "leaflet";

import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css'; 
import 'leaflet-draw/dist/leaflet.draw.css'
import osm from "../osm-providers.js";
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Override the default icon for ALL markers (including drawing tools)
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

export default function PinSafety_map({ tempStory, onSubmitStoryWithLocation }) {
    const [center, setCenter] = useState({ lat: 14.412687356644929, lng: 120.98123147922286 })
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [currentStory, setCurrentStory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [markerPlaced, setMarkerPlaced] = useState(false);
    const ZOOM_LEVEL = 20;
    const mapRef = useRef();
    const navigate = useNavigate();

    // Get story from props or sessionStorage
    useEffect(() => {
        console.log('PinSafety_map mounted with tempStory:', tempStory);
        
        let storyToUse = tempStory;
        
        // If no tempStory prop, try sessionStorage
        if (!storyToUse) {
            console.log('No tempStory prop, checking sessionStorage...');
            const storedStory = sessionStorage.getItem('tempStory');
            if (storedStory) {
                try {
                    storyToUse = JSON.parse(storedStory);
                    console.log('Found story in sessionStorage:', storyToUse);
                } catch (e) {
                    console.error('Error parsing stored story:', e);
                }
            }
        }
        
        if (storyToUse) {
            console.log('Using story:', storyToUse);
            setCurrentStory(storyToUse);
            setIsLoading(false);
        } else {
            console.log('No story found anywhere');
            setError('');
            setIsLoading(false);
            setTimeout(() => {
                navigate('/story');
            }, 3000);
        }
    }, [tempStory, navigate]);

    const _created = (e) => {
        if (markerPlaced) return;
        const layer = e.layer;
        if (layer instanceof L.Marker) {
            setSelectedLocation(layer.getLatLng());
            setMarkerPlaced(true);
        }
    };

    const _deleted = (e) => {
        setMarkerPlaced(false);
        setSelectedLocation(null);
    };

    const handleSubmitStoryWithLocation = () => {
        console.log('Submitting story with location:', { currentStory, selectedLocation });
        
        if (!selectedLocation) {
            setError('Please pin a location on the map first.');
            return;
        }

        if (!currentStory) {
            setError('No story data found.');
            return;
        }

        // Submit story with location
        onSubmitStoryWithLocation(selectedLocation);
        
        setSuccessMessage('Your story has been submitted with location and is pending approval!');
        setError('');
        
        // Navigate back to story page after successful submission
        setTimeout(() => {
            navigate('/story');
        }, 2000);
    };

    const handleCancel = () => {
        // Clear sessionStorage if it exists
        sessionStorage.removeItem('tempStory');
        navigate('/story');
    };

    if (isLoading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Loading...</h2>
                <p>Preparing your story for location selection...</p>
            </div>
        );
    }

    return (
        <>
            <div className='safetyMap'>
                <h2>Pin Your Story Location</h2>
                {/* Instructions */}
                <div className='instruction'>
                    <p>Click the marker tool (📍) on the map to pin your location, then click Submit.</p>
                    
                </div>

                <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={ZOOM_LEVEL}
                    ref={mapRef}
                    style={{ height: '500px', width: '70%', margin: '0 auto' }}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    keyboard={false}
                    zoomControl={false}
                >
                    <FeatureGroup>
                        <EditControl
                            position='topright'
                            onCreated={_created}
                            onDeleted={_deleted}
                            draw={{
                                rectangle: false,
                                circle: false,
                                circlemarker: false,
                                polygon: false,
                                polyline: false,
                                marker: !markerPlaced // Enable marker tool only if markerPlaced is false
                            }}
                        />
                    </FeatureGroup>
                    <TileLayer
                        url={osm.mapTiler.url}
                        attribution={osm.mapTiler.attribution}
                    />
                </MapContainer>
                
                {/* Story Preview */}
                <div className='story-preview'>
                    <h6>ACCOUNT STATUS</h6>
                    <h3>Account Activity Report</h3>
                    <h3>Username: </h3>
                    <h3>Story Description: </h3>
                    <p>"{currentStory.text}"</p>
                    {selectedLocation && (
                        <small>
                            <b>Marked Location:</b> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)} <br/>
                        </small>
                    )}

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}    
                
                {/* Action Buttons */}
                <div style={{ 
                    marginTop: '40px',
                    textAlign: 'center', 
                    margin: '20px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    
                    <button 
                        onClick={handleSubmitStoryWithLocation}
                        style={{                          
                            padding: '12px 24px',
                            backgroundColor: selectedLocation ? '#28a745' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: selectedLocation ? 'pointer' : 'not-allowed',
                            fontSize: '16px'
                        }}
                        disabled={!selectedLocation}
                    >
                        Submit Story & Location
                    </button>
                    <button 
                        onClick={handleCancel}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Cancel
                    </button>
                </div>                                
                </div>

                {/* Status Messages */}
                {error && (
                    <div style={{ 
                        color: 'red', 
                        textAlign: 'center', 
                        margin: '10px 0',
                        padding: '10px',
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '5px',
                        maxWidth: '80%',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        {error}
                    </div>
                )}
                
                
            </div>
        </>
    )
}