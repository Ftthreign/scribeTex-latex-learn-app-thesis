<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: string
  id: string
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between" v-if="label">
      <label :for="id" class="text-sm font-bold text-text-primary font-sans">
        {{ label }}
      </label>
      <slot name="label-right" />
    </div>
    
    <div class="relative group">
      <div v-if="$slots.icon" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
        <slot name="icon" />
      </div>
      
      <input
        :id="id"
        :type="type || 'text'"
        :value="modelValue"
        @input="onInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'w-full bg-surface-alt border rounded-xl py-3.5 pr-4 text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans',
          $slots.icon ? 'pl-12' : 'pl-4',
          error ? 'border-error focus:ring-error/20 focus:border-error' : 'border-border'
        ]"
      />
      
      <div v-if="$slots.right" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <slot name="right" />
      </div>
    </div>
    
    <p v-if="error" class="text-xs text-error font-medium font-sans">
      {{ error }}
    </p>
  </div>
</template>
