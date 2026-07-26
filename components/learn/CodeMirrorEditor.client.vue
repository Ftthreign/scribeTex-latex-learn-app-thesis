<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { StreamLanguage, syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { stex } from '@codemirror/legacy-modes/mode/stex'

const props = defineProps<{
  modelValue: string
  readonly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)
let view: EditorView | null = null

// Skema Warna Syntax Highlighting khusus LaTeX berstandar Dark Academic DESIGN.md
const latexHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#79c0ff', fontWeight: 'bold' },
  { tag: tags.atom, color: '#ffa657' },
  { tag: tags.number, color: '#d2a8ff' },
  { tag: tags.string, color: '#a5d6ff' },
  { tag: tags.variableName, color: '#ffa657' },
  { tag: tags.comment, color: '#8b949e', fontStyle: 'italic' },
  { tag: tags.bracket, color: '#7ee787' },
  { tag: tags.meta, color: '#d29922' },
  { tag: tags.escape, color: '#d29922' },
])

// Custom Dark Academic Theme sesuai DESIGN.md (JetBrains Mono, #0d1117 bg)
const academicDarkTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--color-code-bg, #0d1117)',
    color: 'var(--color-code-text, #e6edf3)',
    fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
    fontSize: '13px',
    height: '100%',
    minHeight: '380px',
    borderRadius: '0.5rem',
  },
  '.cm-scroller': {
    overflow: 'auto !important',
    minHeight: '380px !important',
  },
  '.cm-content': {
    caretColor: '#58a6ff',
    padding: '12px 0',
    color: '#e6edf3 !important',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#58a6ff',
    borderLeftWidth: '2px',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'rgba(88, 166, 255, 0.25)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--color-code-surface, #161b22)',
    color: '#8b949e',
    borderRight: '1px solid var(--color-code-border, #30363d)',
    borderTopLeftRadius: '0.5rem',
    borderBottomLeftRadius: '0.5rem',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(110, 118, 129, 0.1)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: '#e6edf3',
  },
  '.cm-line': {
    padding: '0 12px',
    color: '#e6edf3',
  },
})

onMounted(() => {
  if (!editorRef.value) return

  try {
    const state = EditorState.create({
      doc: props.modelValue || '',
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        StreamLanguage.define(stex), // Bahasa sintaks spesifik LaTeX (TeX / sTeX)
        syntaxHighlighting(latexHighlightStyle), // Ekstensi Pewarnaan Sintaks LaTeX
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        academicDarkTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = update.state.doc.toString()
            emit('update:modelValue', content)
          }
        }),
        EditorView.editable.of(!props.readonly),
      ],
    })

    view = new EditorView({
      state,
      parent: editorRef.value,
    })
  } catch (err) {
    console.error('[CodeMirrorEditor] Error initializing CodeMirror 6 with sTeX LaTeX mode:', err)
  }
})

onUnmounted(() => {
  if (view) {
    view.destroy()
    view = null
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (view && newValue !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: newValue || '' },
      })
    }
  }
)
</script>

<template>
  <div class="relative w-full h-full min-h-[380px] rounded-lg overflow-hidden border border-border">
    <div ref="editorRef" class="w-full h-full"></div>
  </div>
</template>
