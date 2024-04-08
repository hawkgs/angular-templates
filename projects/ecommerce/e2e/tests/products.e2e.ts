import { setupBrowserHooks, getBrowserState } from './utils';

describe('Products', function () {
  setupBrowserHooks('products');

  it('should add a product to the card', async function () {
    const { page } = getBrowserState();

    // Get the target product name
    const firstProductName = await page.evaluate(
      () => document.querySelector('ec-product-item .product-name')?.innerHTML,
    );

    // Open target product details page
    await Promise.all([
      page.evaluate(() => {
        (
          document.querySelector('ec-product-item > a') as HTMLAnchorElement
        ).click();
      }),
      await page.waitForNavigation(),
    ]);

    // Press "Add to Cart" button
    await page.evaluate(() => {
      (
        document.querySelector(
          'button[data-name="add-to-cart"]',
        ) as HTMLButtonElement
      ).click();
    });

    // Go to cart
    await Promise.all([
      page.evaluate(() => {
        (document.querySelector('a.cart') as HTMLAnchorElement).click();
      }),
      await page.waitForNavigation(),
    ]);

    // Take the name of the product in the cart (should be the only one)
    const addedProductName = await page.evaluate(
      () => document.querySelector('ec-cart-item span.name')?.innerHTML,
    );

    // Compare
    expect(addedProductName).toEqual(firstProductName?.trim());
  });
});
