import { test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ProductDetails from "../../views/ProductDetails.vue";

const mockProduct = [{
  _id: "1",
  name: "Product 1",
  description: "Description 1",
  imageURL: "https://picsum.photos/500/500",
  price: 10,
  stock: 100,
  discount: false,
  discountPct: 0,
  isHidden: false,
}];

vi.mock('../../modules/useProducts', () => ({
  useProducts: () => ({
    fetchProductById: vi.fn().mockResolvedValue(mockProduct),
  }),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: "1" },
  }),
}));

test('Renders product details', async () => {
  const wrapper = mount(ProductDetails);

  await new Promise(resolve => setTimeout(resolve, 0));
  
  expect(wrapper.text()).toContain("Product 1");
  expect(wrapper.text()).toContain("Description 1");
  expect(wrapper.text()).toContain("Stock: 100");

  expect(wrapper.find('img').attributes('src')).toBe('https://picsum.photos/500/500');
})
