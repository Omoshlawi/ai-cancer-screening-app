import { useHealthFacilities } from "@/hooks/useHealthFacilities";
import { useLocation } from "@/hooks/useLocation";
import React, { useMemo } from "react";
import { StyleSheet, Alert, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Spinner } from "../ui/spinner";

const FacilityMapView = () => {
  const { healthFacilities, error, isLoading } = useHealthFacilities();
  const { coordinates: userLocation, isLoading: isLocationLoading } = useLocation();

  // Calculate initial region based on facilities or user location
  const initialRegion = useMemo<Region | undefined>(() => {
    if (healthFacilities.length === 0) {
      // Default to user location or a default location (e.g., Kenya)
      if (userLocation) {
        return {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
      }
      // Default to Nairobi, Kenya if no location
      return {
        latitude: -1.2921,
        longitude: 36.8219,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }

    // Calculate region to fit all facilities
    const latitudes = healthFacilities.map((f) => f.coordinates.latitude);
    const longitudes = healthFacilities.map((f) => f.coordinates.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = (maxLat - minLat) * 1.5 || 0.1;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.1;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.1),
      longitudeDelta: Math.max(lngDelta, 0.1),
    };
  }, [healthFacilities, userLocation]);

  if (isLoading || isLocationLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const handleMarkerPress = (facility: typeof healthFacilities[0]) => {
    Alert.alert(
      facility.name,
      `${facility.address}\n${facility.phoneNumber}\n${facility.email}`,
      [{ text: "OK" }]
    );
  };

  return (
    <Box className="flex-1">
      {initialRegion ? (
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={!!userLocation}
          showsMyLocationButton={true}
          showsCompass={true}
          toolbarEnabled={false}
        >
          {healthFacilities.map((facility) => (
            <Marker
              key={facility.id}
              coordinate={{
                latitude: facility.coordinates.latitude,
                longitude: facility.coordinates.longitude,
              }}
              title={facility.name}
              description={facility.address}
              onPress={() => handleMarkerPress(facility)}
            />
          ))}
        </MapView>
      ) : (
        <EmptyState message="Unable to load map" />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default FacilityMapView;