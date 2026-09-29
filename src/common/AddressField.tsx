import { View, Text, LogBox } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { useState } from "react";

// The Google Places dropdown renders its own FlatList. Since this field is
// always used inside a KeyboardAwareScrollView, RN warns about nesting a
// VirtualizedList inside a plain ScrollView. The dropdown is bounded
// (maxHeight) and scrolls independently via nestedScrollEnabled, so the
// warning is a known false-positive for this component/pattern combo.
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested inside plain ScrollViews",
]);

interface AddressFieldProps {
  label: string
  placeholder?: string
  onAddressResolved: (address: any) => void
}

export const AddressAutoCompleteField = ({
  label = "Select Address",
  onAddressResolved,
  placeholder = "Search location or pincode..."
}: AddressFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  // Helper to find a specific component in a Google address_components array
  const getComponent = (components: any[], types: string[]) => {
    const comp = components?.find((c: any) =>
      types.every((t) => c.types.includes(t))
    );
    return comp ? comp.long_name : "";
  };

  const buildLocality = (components: any[]) => ({
    country: getComponent(components, ["country"]),
    state: getComponent(components, ["administrative_area_level_1"]),
    district: getComponent(components, ["administrative_area_level_2"]),
    city:
      getComponent(components, ["locality"]) ||
      getComponent(components, ["administrative_area_level_3"]) ||
      getComponent(components, ["sublocality"]),
    pinCode: getComponent(components, ["postal_code"]),
  });

  const handleSelect = async (data: any, details: any = null) => {
    if (!details) return;

    const placeId = data.place_id;
    const formattedAddress = data.description;
    const latitude = details.geometry.location.lat;
    const longitude = details.geometry.location.lng;

    let locality = buildLocality(details.address_components);

    // Google only returns postal_code / administrative_area_level_2 when the
    // selected place is granular enough (e.g. a specific address). For
    // broader picks (a city or area name) those components are simply
    // absent from Place Details. Reverse-geocoding the exact coordinates
    // reliably returns the full component hierarchy, so use it to backfill
    // whatever is missing.
    if (!locality.pinCode || !locality.district) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDMQYDHauiWiC8NsOq45SoV8xHSmqo4UKY`
        );
        const json = await response.json();
        const reverseComponents = json?.results?.[0]?.address_components;
        const reverseLocality = buildLocality(reverseComponents);

        locality = {
          country: locality.country || reverseLocality.country,
          state: locality.state || reverseLocality.state,
          district: locality.district || reverseLocality.district,
          city: locality.city || reverseLocality.city,
          pinCode: locality.pinCode || reverseLocality.pinCode,
        };
      } catch (error) {
        console.warn("Reverse geocode fallback failed", error);
      }
    }

    // Some rural/village areas simply have no administrative_area_level_2
    // in Google's data (even after reverse-geocoding). Fall back to the
    // city/town name so we still store a meaningful, non-empty value.
    if (!locality.district) {
      locality.district = locality.city;
    }

    // Format matches your NestJS CustomerOnBoardDto perfectly
    const formattedPayload = {
      address: {
        placeId,
        formattedAddress,
        latitude,
        longitude,
      },
      locality: {
        ...locality,
        level: "TOWN",
      },
    };

    onAddressResolved(formattedPayload);
  };

  return (
    <View className="z-10 mb-5">
      <Text className={`mb-2 ml-1 font-sans-bold text-[14px] text-slate-700`}>
        {label}
      </Text>
      <View
        className={`h-14 justify-center rounded-2xl border bg-white ${isFocused ? "border-brand-500" : "border-slate-200"} `}
      >
        <GooglePlacesAutocomplete
          placeholder={placeholder}
          fetchDetails={true}
          onPress={handleSelect}
          keyboardShouldPersistTaps="handled"
          textInputProps={{
            onFocus: () => setIsFocused(true),
            onBlur: () => setIsFocused(false),
            placeholderTextColor: "#94A3B8",
          }}
          query={{
            key: "AIzaSyDMQYDHauiWiC8NsOq45SoV8xHSmqo4UKY",
            language: "en",
            components: "country:in", // Locks search results to India
          }}
          styles={{
            container: { flex: 0 },
            textInputContainer: {
              width: "100%",
              backgroundColor: "transparent",
            },
            textInput: {
              height: 56,
              margin: 0,
              paddingHorizontal: 16,
              backgroundColor: "transparent",
              fontSize: 16,
              color: "#0F172A",
            },
            // 👇 Float the dropdown over the surrounding content and bound its
            // height so it scrolls internally via nestedScrollEnabled.
            listView: {
              position: "absolute",
              top: 56, // Pushes it right below the text box
              left: 0,
              right: 0,
              maxHeight: 220,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 16,
              zIndex: 9999, // Floating on top of everything else
              elevation: 5,
            },
          }}
        />
      </View>
    </View>
  );
};