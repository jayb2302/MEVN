import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AboutView from '../../views/AboutView.vue';

const wrapper = mount(AboutView);

test('Aboutview renders a h1',() => {
    expect(wrapper.find('h1').exists()).toBe(true);  
});

test('AboutView count functionality', async () => {
  const getCount = () => {
    return Number(wrapper.find('[data-testid="count"]').text().replace('Count: ', ''));
  };
  expect(getCount()).toBe(0);

  // Increment the count
  await wrapper.find('[data-testid="increment"]').trigger('click');
  expect(getCount()).toBe(1);

  // Decrement the count
  await wrapper.find('[data-testid="decrement"]').trigger('click');
  expect(getCount()).toBe(0);

  // Add 2 counts, then reset to 0
  await wrapper.find('[data-testid="increment"]').trigger('click');
  await wrapper.find('[data-testid="increment"]').trigger('click');
  expect(getCount()).toBe(2);
  await wrapper.find('[data-testid="reset"]').trigger('click');
  expect(getCount()).toBe(0);
})

