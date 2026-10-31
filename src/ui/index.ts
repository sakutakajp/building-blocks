import { defineComponent, h, mergeProps, nextTick, onBeforeUnmount, onMounted, ref, useId, watch, type PropType } from 'vue';

export type BbThemeName = 'glassmorphism' | 'memphis' | 'cyberpunk';
export interface BbOption { value: string; label: string; disabled?: boolean }
export interface BbTab extends BbOption {}
const fieldProps = {
  id: String, label: { type: String, required: true }, description: String, error: String,
  disabled: Boolean, required: Boolean,
} as const;
const descriptionIds = (id: string, description: string | undefined, error: string | undefined, external: unknown) =>
  [external, description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
const messages = (id: string, description?: string, error?: string) => [
  description ? h('p', { id: `${id}-description`, class: 'bb-field__description' }, description) : null,
  error ? h('p', { id: `${id}-error`, class: 'bb-field__error', role: 'alert' }, error) : null,
];

export const BbTheme = /* #__PURE__ */ defineComponent({
  name: 'BbTheme', props: { theme: { type: String as PropType<BbThemeName>, default: 'glassmorphism' } },
  setup: (props, { slots }) => () => h('div', { class: 'bb-theme', 'data-bb-theme': props.theme }, slots.default?.()),
});
export const BbButton = /* #__PURE__ */ defineComponent({
  name: 'BbButton', inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'primary' | 'secondary' | 'danger' | 'ghost'>, default: 'primary' },
    size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
    disabled: Boolean, loading: Boolean,
    type: { type: String as PropType<'button' | 'submit' | 'reset'>, default: 'button' },
  },
  setup: (props, { attrs, slots }) => () => h('button', mergeProps(attrs, {
    class: ['bb-button', `bb-button--${props.variant}`, `bb-button--${props.size}`],
    type: props.type, disabled: props.disabled || props.loading, 'aria-busy': props.loading || undefined,
  }), [props.loading ? h('span', { class: 'bb-button__spinner', 'aria-hidden': 'true' }) : null, slots.default?.()]),
});
export const BbTextField = /* #__PURE__ */ (() => defineComponent({
  name: 'BbTextField', inheritAttrs: false,
  props: { ...fieldProps, modelValue: { type: String, default: '' }, type: { type: String, default: 'text' } },
  emits: { 'update:modelValue': (_value: string) => true },
  setup(props, { attrs, emit }) {
    const generatedId = useId();
    return () => {
      const id = props.id ?? `bb-field-${generatedId}`;
      return h('div', { class: ['bb-field', props.error && 'bb-field--invalid'] }, [
        h('label', { class: 'bb-field__label', for: id }, props.label),
        h('input', mergeProps(attrs, { id, class: 'bb-input', value: props.modelValue, type: props.type,
          disabled: props.disabled, required: props.required, 'aria-invalid': props.error ? true : undefined,
          'aria-describedby': descriptionIds(id, props.description, props.error, attrs['aria-describedby']),
          onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLInputElement).value),
        })), ...messages(id, props.description, props.error),
      ]);
    };
  },
}))();
export const BbSelect = /* #__PURE__ */ (() => defineComponent({
  name: 'BbSelect', inheritAttrs: false,
  props: { ...fieldProps, modelValue: { type: String, default: '' }, placeholder: String,
    options: { type: Array as PropType<readonly BbOption[]>, default: () => [] } },
  emits: { 'update:modelValue': (_value: string) => true },
  setup(props, { attrs, emit }) {
    const generatedId = useId();
    return () => {
      const id = props.id ?? `bb-select-${generatedId}`;
      return h('div', { class: ['bb-field', props.error && 'bb-field--invalid'] }, [
        h('label', { class: 'bb-field__label', for: id }, props.label),
        h('select', mergeProps(attrs, { id, class: 'bb-select', value: props.modelValue,
          disabled: props.disabled, required: props.required, 'aria-invalid': props.error ? true : undefined,
          'aria-describedby': descriptionIds(id, props.description, props.error, attrs['aria-describedby']),
          onChange: (event: Event) => emit('update:modelValue', (event.target as HTMLSelectElement).value),
        }), [props.placeholder ? h('option', { value: '', disabled: true }, props.placeholder) : null,
          ...props.options.map(option => h('option', { key: option.value, value: option.value, disabled: option.disabled }, option.label))]),
        ...messages(id, props.description, props.error),
      ]);
    };
  },
}))();
export const BbCard = /* #__PURE__ */ defineComponent({
  name: 'BbCard', props: { title: String, description: String },
  setup: (props, { slots }) => () => h('section', { class: 'bb-card' }, [
    slots.header || props.title || props.description ? h('header', { class: 'bb-card__header' }, slots.header?.() ?? [
      props.title ? h('h2', { class: 'bb-card__title' }, props.title) : null,
      props.description ? h('p', { class: 'bb-card__description' }, props.description) : null,
    ]) : null,
    h('div', { class: 'bb-card__body' }, slots.default?.()),
    slots.footer ? h('footer', { class: 'bb-card__footer' }, slots.footer()) : null,
  ]),
});
export const BbBadge = /* #__PURE__ */ defineComponent({
  name: 'BbBadge', props: { variant: { type: String as PropType<'neutral' | 'success' | 'warning' | 'danger'>, default: 'neutral' } },
  setup: (props, { slots }) => () => h('span', { class: ['bb-badge', `bb-badge--${props.variant}`] }, slots.default?.()),
});

export const BbTabs = /* #__PURE__ */ defineComponent({
  name: 'BbTabs',
  props: { modelValue: { type: String, required: true }, tabs: { type: Array as PropType<readonly BbTab[]>, required: true },
    label: { type: String, default: 'Tabs' } },
  emits: { 'update:modelValue': (_value: string) => true },
  setup(props, { emit, slots }) {
    const id = `bb-tabs-${useId()}`;
    const buttons = new Map<string, HTMLButtonElement>();
    const activeValue = () => props.tabs.find(tab => tab.value === props.modelValue && !tab.disabled)?.value
      ?? props.tabs.find(tab => !tab.disabled)?.value;
    function onKeydown(event: KeyboardEvent, value: string) {
      const enabled = props.tabs.filter(tab => !tab.disabled);
      const index = enabled.findIndex(tab => tab.value === value);
      let target: BbTab | undefined;
      if (event.key === 'Home') target = enabled[0];
      else if (event.key === 'End') target = enabled[enabled.length - 1];
      else if (event.key === 'ArrowRight') target = enabled[(index + 1) % enabled.length];
      else if (event.key === 'ArrowLeft') target = enabled[(index - 1 + enabled.length) % enabled.length];
      if (target) { event.preventDefault(); emit('update:modelValue', target.value); buttons.get(target.value)?.focus(); }
    }
    return () => h('div', { class: 'bb-tabs' }, [
      h('div', { class: 'bb-tabs__list', role: 'tablist', 'aria-label': props.label }, props.tabs.map((tab, index) => h('button', {
        key: tab.value, ref: (element: unknown) => { if (element) buttons.set(tab.value, element as HTMLButtonElement); else buttons.delete(tab.value); },
        type: 'button', class: 'bb-tabs__tab', role: 'tab', id: `${id}-tab-${index}`,
        'aria-controls': `${id}-panel-${index}`, 'aria-selected': activeValue() === tab.value,
        tabindex: activeValue() === tab.value ? 0 : -1, disabled: tab.disabled,
        onClick: () => emit('update:modelValue', tab.value), onKeydown: (event: KeyboardEvent) => onKeydown(event, tab.value),
      }, tab.label))),
      ...props.tabs.map((tab, index) => h('div', { key: tab.value, class: 'bb-tabs__panel', role: 'tabpanel',
        id: `${id}-panel-${index}`, 'aria-labelledby': `${id}-tab-${index}`, tabindex: 0, hidden: activeValue() !== tab.value,
      }, slots[`panel-${tab.value}`]?.())),
    ]);
  },
});

export const BbSelectionGroup = /* #__PURE__ */ (() => defineComponent({
  name: 'BbSelectionGroup', inheritAttrs: false,
  props: { ...fieldProps, name: String,
    modelValue: { type: [String, Array] as PropType<string | readonly string[]>, default: () => [] },
    options: { type: Array as PropType<readonly BbOption[]>, required: true },
    type: { type: String as PropType<'checkbox' | 'radio' | 'switch'>, default: 'checkbox' },
  },
  emits: { 'update:modelValue': (_value: string | string[]) => true },
  setup(props, { emit, attrs }) {
    const generatedId = useId();
    const selected = (value: string) => typeof props.modelValue === 'string' ? props.modelValue === value : props.modelValue.includes(value);
    function change(value: string, checked: boolean) {
      if (props.type === 'radio') emit('update:modelValue', value);
      else {
        const current = typeof props.modelValue === 'string' ? [props.modelValue] : props.modelValue;
        emit('update:modelValue', checked ? [...new Set([...current, value])] : current.filter(item => item !== value));
      }
    }
    return () => {
      const id = props.id ?? `bb-selection-${generatedId}`;
      return h('fieldset', mergeProps(attrs, { id, class: ['bb-selection', `bb-selection--${props.type}`], disabled: props.disabled,
        'aria-describedby': descriptionIds(id, props.description, props.error, attrs['aria-describedby']), 'aria-invalid': props.error ? true : undefined,
      }), [h('legend', { class: 'bb-selection__legend' }, props.label),
        ...props.options.map((option, index) => h('label', { key: option.value, class: 'bb-selection__option', for: `${id}-${index}` }, [
          h('input', { id: `${id}-${index}`, class: 'bb-selection__input', type: props.type === 'radio' ? 'radio' : 'checkbox',
            role: props.type === 'switch' ? 'switch' : undefined, name: props.name ?? id, value: option.value,
            checked: selected(option.value), disabled: props.disabled || option.disabled,
            required: props.required && (props.type === 'radio' || (!props.options.some(item => !item.disabled && selected(item.value)) && option === props.options.find(item => !item.disabled))),
            'aria-checked': props.type === 'switch' ? selected(option.value) : undefined,
            onChange: (event: Event) => change(option.value, (event.target as HTMLInputElement).checked),
          }), h('span', { class: 'bb-selection__label' }, option.label),
        ])), ...messages(id, props.description, props.error),
      ]);
    };
  },
}))();

export const BbDialog = /* #__PURE__ */ defineComponent({
  name: 'BbDialog', inheritAttrs: false,
  props: { open: Boolean, title: { type: String, required: true }, description: String,
    closeLabel: { type: String, default: 'Close dialog' } },
  emits: { 'update:open': (_value: boolean) => true },
  setup(props, { attrs, emit, slots }) {
    const id = `bb-dialog-${useId()}`;
    const dialog = ref<HTMLDialogElement>();
    let previousFocus: HTMLElement | null = null;
    let mounted = false;
    const restoreFocus = () => { if (previousFocus?.isConnected) previousFocus.focus(); previousFocus = null; };
    const sync = () => {
      const element = dialog.value;
      if (!mounted || !element) return;
      if (props.open && !element.open) {
        previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        element.showModal();
      } else if (!props.open && element.open) { element.close(); restoreFocus(); }
    };
    onMounted(() => { mounted = true; sync(); });
    watch(() => props.open, () => { void nextTick(sync); });
    onBeforeUnmount(() => { mounted = false; if (dialog.value?.open) dialog.value.close(); restoreFocus(); });
    return () => h('dialog', mergeProps(attrs, { ref: dialog, class: 'bb-dialog', 'aria-labelledby': `${id}-title`,
      'aria-describedby': descriptionIds(id, props.description, undefined, attrs['aria-describedby']),
      onCancel: (event: Event) => { event.preventDefault(); emit('update:open', false); },
      onClose: () => { if (dialog.value?.open) return; if (props.open && mounted) emit('update:open', false); restoreFocus(); },
    }), [
      h('header', { class: 'bb-dialog__header' }, [h('h2', { id: `${id}-title`, class: 'bb-dialog__title' }, props.title),
        h('button', { type: 'button', class: 'bb-dialog__close', 'aria-label': props.closeLabel, onClick: () => emit('update:open', false) }, '×')]),
      props.description ? h('p', { id: `${id}-description`, class: 'bb-dialog__description' }, props.description) : null,
      h('div', { class: 'bb-dialog__body' }, slots.default?.()),
      slots.footer ? h('footer', { class: 'bb-dialog__footer' }, slots.footer()) : null,
    ]);
  },
});
