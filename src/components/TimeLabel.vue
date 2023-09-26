<script setup>
    import { defineProps, watch, reactive, toRef } from "vue";
    import moment from "moment-timezone";
    import timeZoneLookup from "tz-lookup";

    const props = defineProps(["center"]);
    const center = toRef(props, "center");

    const data = reactive({
        timezone: " - ",
        localTime: " - ",
    });

    watch(center, (value) => {
        const timezone = timeZoneLookup(value[0], value[1]);
        data.timezone = `${timezone}`;
        data.localTime = moment()
            .tz(timeZoneLookup(value[0], value[1]))
            .format("YYYY-MM-DD HH:mm:SS");
    });
</script>

<template>
    <h5>{{ `Timezone: ${data.timezone}` }}</h5>
    <h6>{{ `Local Time: ${data.localTime}` }}</h6>
</template>

<style scoped></style>
