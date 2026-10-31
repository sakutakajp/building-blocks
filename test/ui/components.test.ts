// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { BbBadge, BbButton, BbCard, BbDialog, BbSelect, BbSelectionGroup, BbTabs, BbTextField, BbTheme } from '../../src/ui/index.js';

afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); });
describe('theme and display primitives', () => {
  it('uses a default theme, forwards attrs, and supports slots', () => {
    const wrapper = mount(BbTheme, { attrs: { id: 'theme' }, slots: { default: () => h(BbBadge, { variant: 'success' }, () => 'Ready') } });
    expect(wrapper.attributes('data-bb-theme')).toBe('glassmorphism');
    expect(wrapper.attributes('id')).toBe('theme');
    expect(wrapper.get('.bb-badge--success').text()).toBe('Ready');
  });
  it('renders a structured card', () => {
    const wrapper = mount(BbCard, { props: { title: 'Account', description: 'Settings' }, slots: { default: 'Content', footer: 'Actions' } });
    expect(wrapper.get('h2').text()).toBe('Account');
    expect(wrapper.get('footer').text()).toBe('Actions');
  });
  it('defaults to a non-submit button and disables while loading', async () => {
    const click = vi.fn();
    const wrapper = mount(BbButton, { attrs: { onClick: click }, slots: { default: 'Save' } });
    expect(wrapper.attributes('type')).toBe('button');
    await wrapper.trigger('click'); expect(click).toHaveBeenCalledOnce();
    await wrapper.setProps({ loading: true });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.text()).toBe('Save');
  });
});
describe('native labeled form controls', () => {
  it('associates label, description, error and consumer descriptions with the input', async () => {
    const wrapper = mount(BbTextField, { props: { label: 'Email', modelValue: 'old', description: 'Work address', error: 'Required' }, attrs: { name: 'email', autocomplete: 'email', 'aria-describedby': 'external' } });
    const input = wrapper.get('input');
    const id = input.attributes('id');
    expect(wrapper.get('label').attributes('for')).toBe(id);
    expect(input.attributes('aria-describedby')).toBe(`external ${id}-description ${id}-error`);
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('name')).toBe('email');
    await input.setValue('new');
    expect(wrapper.emitted('update:modelValue')).toEqual([['new']]);
    expect(wrapper.props('modelValue')).toBe('old');
    await wrapper.setProps({ modelValue: 'accepted', disabled: true });
    expect((input.element as HTMLInputElement).value).toBe('accepted');
    expect(input.attributes('disabled')).toBeDefined();
  });
  it('creates distinct ids and supports native select options', async () => {
    const wrapper = mount({ render: () => h('div', [h(BbTextField, { label: 'One' }), h(BbTextField, { label: 'Two' })]) });
    const inputs = wrapper.findAll('input');
    expect(inputs[0]!.attributes('id')).not.toBe(inputs[1]!.attributes('id'));
    const select = mount(BbSelect, { props: { label: 'Plan', placeholder: 'Choose', options: [{ value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro', disabled: true }] } });
    await select.get('select').setValue('basic');
    expect(select.emitted('update:modelValue')).toEqual([['basic']]);
    expect(select.findAll('option')[2]!.attributes('disabled')).toBeDefined();
    expect(select.get('label').attributes('for')).toBe(select.get('select').attributes('id'));
  });
  it.each(['checkbox', 'switch'] as const)('uses array models for %s groups', async type => {
    const wrapper = mount(BbSelectionGroup, { props: { type, label: 'Notifications', modelValue: ['a'], options: [{ value: 'a', label: 'Email' }, { value: 'b', label: 'SMS' }] } });
    expect(wrapper.get('legend').text()).toBe('Notifications');
    await wrapper.findAll('input')[1]!.setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']]);
    await wrapper.findAll('input')[0]!.setValue(false);
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([[]]);
    if (type === 'switch') expect(wrapper.get('input').attributes('role')).toBe('switch');
  });
  it('uses a string model and shared name for radio groups, respects disabled options', async () => {
    const wrapper = mount(BbSelectionGroup, { props: { type: 'radio', label: 'Plan', name: 'plan', modelValue: 'a', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C', disabled: true }] } });
    await wrapper.findAll('input')[1]!.setValue(true);
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']]);
    expect(wrapper.findAll('input').map(input => input.attributes('name'))).toEqual(['plan', 'plan', 'plan']);
    expect(wrapper.findAll('input')[2]!.attributes('disabled')).toBeDefined();
  });
});
describe('tabs', () => {
  const tabs = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta', disabled: true }, { value: 'c', label: 'Gamma' }];
  it('links real panels and supports roving focus, disabled skipping, wrapping, Home and End', async () => {
    const wrapper = mount(BbTabs, { attachTo: document.body, props: { modelValue: 'a', tabs }, slots: { 'panel-a': 'Alpha content', 'panel-c': 'Gamma content' } });
    const buttons = wrapper.findAll('[role=tab]');
    const panels = wrapper.findAll('[role=tabpanel]');
    expect(buttons[0]!.attributes('aria-controls')).toBe(panels[0]!.attributes('id'));
    expect(panels[0]!.text()).toBe('Alpha content');
    expect(panels[2]!.attributes('hidden')).toBeDefined();
    await buttons[0]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[2]!.element);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c']);
    await wrapper.setProps({ modelValue: 'c' });
    expect(buttons[2]!.attributes('tabindex')).toBe('0');
    expect(buttons[0]!.attributes('tabindex')).toBe('-1');
    expect(panels[2]!.attributes('hidden')).toBeUndefined();
    await buttons[2]!.trigger('keydown', { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[0]!.element);
    await buttons[0]!.trigger('keydown', { key: 'End' });
    expect(document.activeElement).toBe(buttons[2]!.element);
    await buttons[2]!.trigger('keydown', { key: 'Home' });
    expect(document.activeElement).toBe(buttons[0]!.element);
    await buttons[0]!.trigger('keydown', { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(buttons[2]!.element);
    wrapper.unmount();
  });
  it('selects an enabled fallback if the model no longer exists', () => {
    const wrapper = mount(BbTabs, { props: { modelValue: 'missing', tabs } });
    expect(wrapper.findAll('[role=tab]')[0]!.attributes('aria-selected')).toBe('true');
    expect(wrapper.findAll('[tabindex="0"][role=tab]')).toHaveLength(1);
  });
});
describe('native modal dialog', () => {
  beforeAll(() => {
    for (const method of ['showModal', 'close'] as const) {
      if (!HTMLDialogElement.prototype[method]) Object.defineProperty(HTMLDialogElement.prototype, method, { configurable: true, writable: true, value() {} });
    }
  });
  beforeEach(() => {
    // jsdom has no top-layer implementation; real browser verifies modal focus trapping.
    vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function (this: HTMLDialogElement) { this.open = true; });
    vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function (this: HTMLDialogElement) { this.open = false; this.dispatchEvent(new Event('close')); });
  });
  it('opens modally, associates title, requests controlled dismissal and restores focus', async () => {
    const opener = document.createElement('button'); document.body.append(opener); opener.focus();
    const wrapper = mount(BbDialog, { attachTo: document.body, props: { title: 'Confirm', description: 'Please review', open: true }, slots: { default: 'Details', footer: 'Actions' } });
    const dialog = wrapper.get('dialog');
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();
    expect(dialog.attributes('aria-labelledby')).toBe(wrapper.get('h2').attributes('id'));
    expect(wrapper.get('footer').text()).toBe('Actions');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
    expect((dialog.element as HTMLDialogElement).open).toBe(true);
    await wrapper.setProps({ open: false }); await nextTick();
    expect((dialog.element as HTMLDialogElement).open).toBe(false);
    expect(document.activeElement).toBe(opener);
    await wrapper.setProps({ open: true }); await nextTick();
    const cancel = new Event('cancel', { cancelable: true }); dialog.element.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false]);
    wrapper.unmount(); expect(document.activeElement).toBe(opener);
  });
  it('stays closed initially and preserves its theme ancestor', () => {
    const wrapper = mount(BbTheme, { props: { theme: 'cyberpunk' }, slots: { default: () => h(BbDialog, { title: 'Closed' }) } });
    expect(wrapper.get('dialog').element.closest('[data-bb-theme]')).toBe(wrapper.element);
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});

describe('edge cases', () => {
  it('renders safely on the server without opening a modal', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(BbTheme, null, { default: () => [
      h(BbDialog, { title: 'Server-rendered dialog', open: true }), h(BbTextField, { label: 'Name' }),
    ] }) }));
    expect(html).toContain('Server-rendered dialog');
    expect(html).toContain('data-bb-theme="glassmorphism"');
    expect(html).not.toContain('<dialog open');
  });
  it('handles an empty or fully disabled tab list without a keyboard exception', async () => {
    const wrapper = mount(BbTabs, { props: { modelValue: 'a', tabs: [{ value: 'a', label: 'A', disabled: true }] } });
    await wrapper.get('[role=tab]').trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.get('[role=tab]').attributes('tabindex')).toBe('-1');
    await wrapper.setProps({ tabs: [] });
    expect(wrapper.findAll('[role=tab]')).toHaveLength(0);
  });
  it('requires at least one checkbox, rather than every checkbox', async () => {
    const wrapper = mount(BbSelectionGroup, { props: { label: 'Interests', required: true, options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] } });
    expect(wrapper.findAll('input[required]')).toHaveLength(1);
    await wrapper.setProps({ modelValue: ['b'] });
    expect(wrapper.findAll('input[required]')).toHaveLength(0);
  });
});

describe('required disabled-option regression', () => {
  it('does not let a disabled selected checkbox satisfy a required group', () => {
    const wrapper = mount(BbSelectionGroup, { props: { label: 'Interests', required: true, modelValue: ['a'], options: [{ value: 'a', label: 'A', disabled: true }, { value: 'b', label: 'B' }] } });
    const inputs = wrapper.findAll('input');
    expect(inputs[0]!.attributes('required')).toBeUndefined();
    expect(inputs[1]!.attributes('required')).toBeDefined();
    expect((inputs[1]!.element as HTMLInputElement).checkValidity()).toBe(false);
  });
});
