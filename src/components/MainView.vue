<script setup>
    import { ref } from "vue";

    import { useMapMarkersStore } from "../stores/mapMarkers";

    import LeafletMap from "./LeafletMap.vue";
    import TimeLabel from "./TimeLabel.vue";
    import MarkersTable from "./MarkersTable.vue";

    const submitButtonRef = ref(null);

    const search = ref("");
    const { appendMarker } = useMapMarkersStore();
    // const center = ref([0, 0]);
    let center = [0, 0];

    const loading = ref(false);

    const onGetCurrentLocation = async () => {
        try {
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not avaiable in your browser");
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    maximumAge: 0,
                    enableHighAccuracy: true,
                });
            });
            const { display_name: displayName } = await (
                await fetch(
                    `${import.meta.env.VITE_MAP_REVERSE_GEOCODE_API_URL}?lat=${
                        position.coords.latitude
                    }&lon=${position.coords.longitude}`,
                )
            ).json();

            search.value = displayName;
        } catch (error) {
            alert(error.message);
        }
    };

    const onSubmit = async () => {
        loading.value = true;
        try {
            const [cloestLocation] = await (
                await fetch(
                    `${import.meta.env.VITE_MAP_GEOCODE_API_URL}?q=${encodeURIComponent(
                        search.value,
                    )}`,
                )
            ).json();

            if (!cloestLocation) {
                throw new Error("No result was found.");
            }

            // center.value = [cloestLocation.lat, cloestLocation.lon];
            center = [cloestLocation.lat, cloestLocation.lon];

            appendMarker({
                name: cloestLocation.display_name,
                location: [cloestLocation.lat, cloestLocation.lon],
            });
        } catch (error) {
            alert(error.message);
        }
        loading.value = false;
        search.value = "";
    };

    const onInputEnter = (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        submitButtonRef.value.click();
    };
</script>

<template>
    <div class="bg-light">
        <div class="container">
            <div
                class="row gap-3"
                style="min-height: 100vh; padding-top: 24px; padding-bottom: 24px"
            >
                <div class="col-lg input-container-wrapper">
                    <div class="input-container">
                        <div class="row g-2 row-gap-2">
                            <div class="col-sm">
                                <input
                                    class="form-control"
                                    placeholder="Enter address here..."
                                    aria-label="Enter address here..."
                                    v-model="search"
                                    v-on:keyup="onInputEnter"
                                />
                            </div>
                            <div class="col-sm-auto">
                                <div class="btn-group d-flex" role="group">
                                    <button
                                        ref="submitButtonRef"
                                        class="btn btn-primary"
                                        v-bind:disabled="search.length <= 0 || loading"
                                        v-on:click="onSubmit"
                                    >
                                        Search
                                    </button>
                                    <button
                                        class="btn btn-outline-primary"
                                        v-bind:disabled="loading"
                                        v-on:click="onGetCurrentLocation"
                                    >
                                        <i class="fa fa-map-marker" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <MarkersTable />
                    </div>
                </div>

                <div class="col-lg" style="display: flex; align-items: center">
                    <div class="map-container">
                        <TimeLabel v-bind:center="center" />
                        <hr class="hr" />
                        <LeafletMap v-bind:center="center" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .input-container-wrapper {
        order: 1;
        @media screen and (max-width: 990px) {
            order: 0;
        }
    }
    .input-container {
        height: 100%;

        background-color: white;
        padding: 16px;
        border-radius: 16px;

        display: flex;
        flex-direction: column;
    }
    .input-container:deep() > table:first-of-type {
        display: block;
        overflow-y: auto;

        height: 360px;
        flex-grow: 1;
    }
    .input-container:deep() > table:first-of-type > thead {
        position: sticky;
        top: 0;
    }
    .map-container {
        width: 100%;

        background-color: white;
        padding: 16px;
        border-radius: 16px;
    }
</style>
