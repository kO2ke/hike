<template>
  <div class="home">
    <HaikuListView/>
  </div>
</template>

<script>
// @ is an alias to /src
import HaikuListView from '@/components/HaikuListView'

export default {
  name: 'Home',
  components: {
    HaikuListView
  }
}
</script>
