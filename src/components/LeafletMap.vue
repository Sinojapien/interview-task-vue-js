<script setup>
    import { onMounted, defineProps, toRef } from "vue";

    import "leaflet/dist/leaflet.css";
    import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
    import iconUrl from "leaflet/dist/images/marker-icon.png";
    import shadowUrl from "leaflet/dist/images/marker-shadow.png";
    import Leaflet from "leaflet";

    import { useMapMarkersStore } from "../stores/mapMarkers";

    const props = defineProps(["center"]);
    const center = toRef(props, "center");

    const { setMap } = useMapMarkersStore();

    onMounted(() => {
        // Map Initialization

        // Fix leaflet marker on production
        Leaflet.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

        const map = Leaflet.map("mapContainer").setView(center.value, 13);
        Leaflet.tileLayer(import.meta.env.VITE_MAP_TILE_URL, {
            maxZoom: 19,
            attribution: `&copy; <a href="${import.meta.env.VITE_MAP_TILE_CREDIT_URL}">${
                import.meta.env.VITE_MAP_TILE_NAME
            }</a>`,
        }).addTo(map);

        setMap(map);
    });
</script>

<template>
    <div id="mapContainer" />
</template>

<style scoped>
    #mapContainer {
        width: 100%;
        height: 360px;
    }
</style>
