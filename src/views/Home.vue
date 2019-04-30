<template>
  <div class="home">
    <pic-view :src="require('@/assets/pic.jpg')"></pic-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import picView from '@/components/picView.vue'; // @ is an alias to /src

@Component({
  components: {
    picView,
  },
})
export default class Home extends Vue {}
</script>
