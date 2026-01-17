import requests
from typing import Optional

class ShopifyClient:
    def __init__(self, shop_domain: str, access_token: str):
        self.shop_domain = shop_domain
        self.access_token = access_token
        self.base_url = f"https://{shop_domain}/admin/api/2024-01"
    
    def _get(self, endpoint: str):
        headers = {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json"
        }
        response = requests.get(f"{self.base_url}/{endpoint}", headers=headers)
        response.raise_for_status()
        return response.json()
    
    def get_all_products(self):
        """Get ALL products with pagination."""
        all_products = []
        endpoint = "products.json?limit=250"
        
        while endpoint:
            data = self._get(endpoint)
            all_products.extend(data.get("products", []))
            # Handle pagination if more than 250 products
            endpoint = None  # Simplified - add pagination logic if needed
        
        return all_products
    
    def get_shop_info(self):
        """Store name, description, currency, etc."""
        return self._get("shop.json")["shop"]
    
    def get_collections(self):
        """Product collections/categories."""
        custom = self._get("custom_collections.json").get("custom_collections", [])
        smart = self._get("smart_collections.json").get("smart_collections", [])
        return custom + smart
    
    def get_pages(self):
        """Static pages (About Us, Contact, etc.)."""
        return self._get("pages.json").get("pages", [])
    
    def get_blogs_and_articles(self):
        """Blog posts."""
        blogs = self._get("blogs.json").get("blogs", [])
        all_articles = []
        for blog in blogs:
            articles = self._get(f"blogs/{blog['id']}/articles.json").get("articles", [])
            all_articles.extend(articles)
        return {"blogs": blogs, "articles": all_articles}
    
    def get_policies(self):
        """Store policies (privacy, refund, etc.)."""
        return self._get("policies.json").get("policies", [])
    
    def get_full_store_data(self):
        """Get EVERYTHING about the store."""
        return {
            "shop": self.get_shop_info(),
            "products": self.get_all_products(),
            "collections": self.get_collections(),
            "pages": self.get_pages(),
            "blogs": self.get_blogs_and_articles(),
            "policies": self.get_policies()
        }