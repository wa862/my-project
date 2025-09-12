<template>
  <div class="editor-container">
    <div ref="editor" class="editor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
//import E from 'wangeditor'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = ref()
const instance = ref<E | null>(null)

onMounted(() => {
  instance.value = new E(editor.value)

  instance.value.config.zIndex = 1
  instance.value.config.placeholder = '请输入内容...'
  instance.value.config.onchange = (html: string) => {
    emit('update:modelValue', html)
  }

  instance.value.create()
  instance.value.txt.html(props.modelValue)
})

onBeforeUnmount(() => {
  instance.value?.destroy()
  instance.value = null
})

watch(() => props.modelValue, (newVal) => {
  if (newVal !== instance.value?.txt.html()) {
    instance.value?.txt.html(newVal)
  }
})
</script>

<style scoped lang="scss">
.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  .editor {
    text-align: left;
  }
}
</style>
