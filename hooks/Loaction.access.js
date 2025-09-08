import * as Location from "expo-location"

async function locationAccess(setUserDetails) {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});

        if (location.coords.latitude && location.coords.longitude) {
            setUserDetails((prev) => ({
                ...prev,
                lat: location.coords.latitude,
                lon: location.coords.longitude
            }))
        }
        return true;

    }
    catch (err) {
        console.error('Error getting user location:', err.message);
        return null;
    }
}

export default locationAccess;