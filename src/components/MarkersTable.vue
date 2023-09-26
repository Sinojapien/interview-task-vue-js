<script setup>
    import { computed, ref, toRef } from "vue";
    import { useMapMarkersStore } from "../stores/mapMarkers";

    const perPage = 10.0;

    const mapMarkersStore = useMapMarkersStore();
    const markers = toRef(mapMarkersStore, "markers");
    const { isIndexSelected, selectIndex, deleteSelectedIndexes } = mapMarkersStore;

    const page = ref(0);

    const hasSelectedIndexes = computed(
        () => markers.value.filter(({ selected }) => selected).length > 0,
    );

    const onPreviousPage = () => {
        page.value = Math.max(page.value - 1, 0);
    };

    const onNextPage = () => {
        page.value = Math.min(page.value + 1, Math.floor((markers.value.length - 1) / perPage));
    };
</script>

<template>
    <table class="table border my-4">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Location</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="(item, index) in markers.slice(page * perPage, (page + 1) * perPage)"
                v-bind:key="`${item.id}`"
            >
                <td>
                    <input
                        class="form-check-input"
                        type="checkbox"
                        v-bind:checked="isIndexSelected(index + page * perPage)"
                        v-on:change="() => selectIndex(index + page * perPage)"
                    />
                </td>
                <td>
                    <p style="font-size: 0.8rem">{{ item.name }}</p>
                </td>

                <td>
                    <p class="text-muted" style="font-size: 0.8rem">
                        {{ `${item.location[0]}, ${item.location[1]}` }}
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="hstack gap-2">
        <button
            class="btn btn-outline-primary"
            title="Previous page"
            v-bind:disabled="page <= 0"
            v-on:click="onPreviousPage"
        >
            <i class="fa fa-angle-left" />
        </button>
        <span>{{ page + 1 }}</span>
        <button
            class="btn btn-outline-primary"
            title="Next page"
            v-bind:disabled="markers.length < (page + 1) * perPage + 1"
            v-on:click="onNextPage"
        >
            <i class="fa fa-angle-right" />
        </button>
        <div class="ms-auto" />
        <button
            class="btn btn-outline-primary"
            title="Delete button"
            v-bind:disabled="!hasSelectedIndexes"
            v-on:click="deleteSelectedIndexes"
        >
            <i class="fa fa-trash" />
        </button>
    </div>
</template>

<style scoped></style>
