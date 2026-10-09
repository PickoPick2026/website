# Product Link API

The product link API accepts a product page URL and returns a best-effort product name, preview image, matching Pick O Pick catalog items, and links to search the major stores. It can be called from another company project using the public `pickopick.com` endpoint.

## GET request

Use the product page URL as the `url` query parameter. URL-encode the complete product URL:

```text
GET https://pickopick.com/api/analyze-link?url=https%3A%2F%2Fwww.amazon.in%2Fsome-product-name%2Fdp%2FB0EXAMPLE1
```

Example in a browser project:

```js
const productUrl = "https://www.amazon.in/dp/EXAMPLE123";
const endpoint = new URL("https://pickopick.com/api/analyze-link");
endpoint.searchParams.set("url", productUrl);

const response = await fetch(endpoint);
const product = await response.json();

if (!response.ok) {
  throw new Error(product.error || "Product lookup failed");
}

console.log(product.identified, product.image, product.results);
```

The endpoint allows cross-origin GET requests, so a browser app on another company domain can call it directly. It can also be called from a server. No API key is currently required.

## POST compatibility

The original POST format remains available for existing integrations:

```http
POST https://pickopick.com/api/analyze-link
Content-Type: application/json
```

```json
{
  "link": "https://www.amazon.in/dp/EXAMPLE123"
}
```

The JSON body also accepts `url` in place of `link`. GET accepts either `url` or `link` as the query parameter; use `url` for new integrations.

## Successful response

```json
{
  "source": "universal",
  "identified": "some product name",
  "image": "https://images.example.com/product.jpg",
  "results": [
    {
      "id": "link-universal-0",
      "name": "some product name",
      "price": "Check Store",
      "store": "Amazon India",
      "source": "amazon",
      "image": "https://images.example.com/product.jpg",
      "category": "E-commerce",
      "inStock": true,
      "url": "https://www.amazon.in/s?k=some%20product%20name",
      "description": "View some product name details on Amazon India"
    },
    {
      "id": "link-universal-1",
      "name": "some product name",
      "price": "Check Store",
      "store": "Flipkart",
      "source": "flipkart",
      "image": "https://images.example.com/product.jpg",
      "category": "E-commerce",
      "inStock": true,
      "url": "https://www.flipkart.com/search?q=some%20product%20name",
      "description": "View some product name details on Flipkart"
    },
    {
      "id": "link-universal-2",
      "name": "some product name",
      "price": "Check Store",
      "store": "Google Shopping",
      "source": "google",
      "image": "https://images.example.com/product.jpg",
      "category": "E-commerce",
      "inStock": true,
      "url": "https://www.google.com/search?q=some%20product%20name+buy+online+india",
      "description": "View some product name details on Google Shopping"
    }
  ]
}
```

`source` is `mixed` when the Pick O Pick catalog has matching items, otherwise it is `universal`. Catalog results appear first, followed by generated Amazon India, Flipkart, and Google Shopping search links. The generated marketplace links are search pages, not direct product URLs.

## How lookup works

The API extracts a product name from the URL path. It then makes a short best-effort request to the product page for an Open Graph, Twitter, or other supported preview image, searches the Pick O Pick catalog for matching names and descriptions, and builds marketplace search links. This does not read live marketplace prices, stock, options, or full product details. A page may block preview-image extraction, in which case `image` can be an empty string or a catalog image.

The homepage now calls this API for URL-based product-name extraction and uses its local URL parser as a fallback. It also displays store-specific category, weight, and size defaults; those are estimates, not confirmed marketplace data.

## Supported URL hosts

The API accepts HTTPS product URLs from these stores and their subdomains: Amazon India, Amazon.com, Flipkart, Myntra, Ajio, Nykaa, Tata CLiQ, Meesho, FirstCry, Fabindia, Bewakoof, JioMart, and Croma. Other hosts, non-HTTPS URLs, malformed URLs, and URLs with embedded credentials return HTTP 400.

## Errors

Errors are JSON objects with an `error` field:

```json
{ "error": "Use an HTTPS link from a supported Indian store." }
```

Common status codes are `400` for missing or unsupported URLs, `405` for unsupported HTTP methods, and `500` for an unexpected lookup failure.
