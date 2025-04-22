import { test, expect, vi } from 'vitest';
import { useProducts } from '../../modules/useProducts';

const mockProduct = [{
  _id: '1',
  name: 'Product 1',
  description: 'Description 1',
  imageURL: 'https://picsum.photos/500/500',
  price: 10,
  stock: 100,
  discount: false,
  discountPct: 0,
  isHidden: false,
}]

test('Fetch products', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockProduct,
  })
  
  const { fetchProductById } = useProducts();
  const result = await fetchProductById('1');
  expect(result).toEqual(mockProduct);
})

test('Fetch products with error', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
    statusText: 'Not Found',
    json: async () => ({}),
  })

  const { fetchProductById } = useProducts();
  const result = await fetchProductById('bad-id');
  expect(result).toBeNull();
})
