import { ref } from "vue";
import { defineStore } from "pinia";

import Leaflet from "leaflet";

export const useMapMarkersStore = defineStore("mapMarkers", () => {
    const map = ref(null);
    const markers = ref([]);

    const setMap = (value) => {
        map.value = value;
    };

    const appendMarker = ({ name, location }) => {
        const markerInstance = Leaflet.marker(location);
        markerInstance.addTo(map.value);
        map.value.setView(location);
        markers.value.push({
            id: Date.now(),
            name,
            location,
            instance: markerInstance,
            selected: false,
        });
    };

    const isIndexSelected = (index) => markers.value?.[index]?.selected === true;

    const selectIndex = (index) => {
        if (markers.value?.[index]) {
            markers.value[index].selected = !markers.value[index].selected;
        }
    };

    const deleteSelectedIndexes = () => {
        markers.value.forEach(({ selected, instance }) => {
            if (selected === true) {
                instance.remove();
            }
        });
        markers.value = [...markers.value].filter(({ selected }) => !selected);
    };

    return {
        markers,
        appendMarker,
        isIndexSelected,
        selectIndex,
        deleteSelectedIndexes,
        setMap,
    };
});
