import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Circle, Marker } from "@react-google-maps/api";
import MDBox from "components/MDBox";
import FormField from "layouts/applications/wizard/components/FormField";
import { Grid } from "@mui/material";
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const mapStyles = {
  height: "400px",
  width: "100%",
};

const defaultCenter = {
  lat: -25.0945,
  lng: -50.1633,
};

const geocodeLatLng = async (lat: number, lng: number, apiKey: string) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].formatted_address;
  }
  return "Endereço não encontrado";
};

export const Location = ({ formData }: any): JSX.Element => {
  const [center, setCenter] = useState(defaultCenter);
  const [radius, setRadius] = useState(1000);
  const [address, setAddress] = useState<string | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { formField, values } = formData;
  const { lat, lng } = formField;
  useEffect(() => {
    if (address !== null) {
      formData.values.location = address;
    }
    formData.values.radius = radius;
  }, [address, radius, formData.values]);

  const handlePlaceSelected = useCallback(async () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(newCenter);

        const foundAddress = await geocodeLatLng(newCenter.lat, newCenter.lng, API_KEY);
        setAddress(foundAddress);
      }
    }
  }, []);

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(event.target.value));
  };

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newCenter = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setCenter(newCenter);

      const foundAddress = await geocodeLatLng(newCenter.lat, newCenter.lng, API_KEY);
      setAddress(foundAddress);
    }
  }, []);

  return (
    <MDBox style={{ marginTop: "10px" }}>
      <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
        <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={center} onClick={handleMapClick}>
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceSelected}
          >
            <FormField
              label=""
              type="text"
              style={{
                boxSizing: "border-box",
                border: "1px solid transparent",
                width: "240px",
                height: "32px",
                padding: "0 12px",
                borderRadius: "3px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                fontSize: "14px",
                outline: "none",
                textOverflow: "ellipses",
                position: "absolute",
                left: "50%",
                marginLeft: "-120px",
                top: "10px",
              }}
            />
          </Autocomplete>
          <Marker position={center} />
          <Circle
            center={center}
            radius={radius}
            options={{
              fillColor: "#2196f3",
              fillOpacity: 0.2,
              strokeColor: "#2196f3",
              strokeOpacity: 0.5,
              strokeWeight: 2,
              clickable: false,
              editable: true,
              draggable: false,
            }}
          />
        </GoogleMap>
      </LoadScript>
      <MDBox style={{ marginTop: "10px" }}>
        <Grid>Raio de alcance (metros): </Grid>
        <FormField label="Raio" type="number" value={radius} onChange={handleRadiusChange} />
      </MDBox>
      {address && <p>Endereço selecionado: {address}</p>}
    </MDBox>
  );
};
