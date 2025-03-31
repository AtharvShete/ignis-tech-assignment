import scrapy
from scrapy_playwright.page import PageMethod
from airbnb_scraper.items import AirbnbItem

class AirbnbSpider(scrapy.Spider):
    name = "airbnb"
    allowed_domains = ["airbnb.co.in"]
    
    def __init__(self, location="India", checkin="2025-04-01", checkout="2025-04-05", guests="2", *args, **kwargs):
        super(AirbnbSpider, self).__init__(*args, **kwargs)
        self.start_urls = [
            f"https://www.airbnb.co.in/s/{location}/homes?checkin={checkin}&checkout={checkout}&adults={guests}"
        ]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"},
                meta={
                    "playwright": True,
                    "playwright_include_page": True, 
                    "playwright_page_methods": [
                        PageMethod("wait_for_selector", "a[href*='/rooms/']"),
                        PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight)"),
                        PageMethod("wait_for_timeout", 3000),
                        PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight)"),
                        PageMethod("wait_for_timeout", 3000)
                    ],
                    "errback": self.errback,
                },
                callback=self.parse_listings
            )

    async def parse_listings(self, response):
        page = response.meta.get("playwright_page")
        if page:
            await page.close()

        for a_tag in response.css("a[href*='/rooms/']"):
            href = a_tag.attrib.get("href")
            if href:
                with open("urls.txt", "w") as f:
                    f.write(href.strip() + "\n")
                # Construct the full URL using response.urljoin
                room_url = response.urljoin(href.strip())
                room_responce = scrapy.Request(
                    room_url,
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"},
                    meta={
                        "playwright": True,
                        "playwright_include_page": True,
                        "playwright_page_methods": [
                            PageMethod("wait_for_selector", "h1"),
                            PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/3)"),
                            PageMethod("wait_for_timeout", 1000),
                            PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/3)"),
                            PageMethod("wait_for_timeout", 1000),
                            PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/3)"),
                            PageMethod("wait_for_timeout", 1000)
                        ],
                        "errback": self.errback,
                    },
                    callback=self.parse_room
                )

                with open('sample.html', 'w', encoding="utf-8") as f:
                    f.write(response.text)

                yield room_responce
                break

        # Handle pagination
        next_page = response.css('a[aria-label="Next"]::attr(href)').get()
        if next_page:
            yield response.follow(next_page, callback=self.parse_listings, meta={
                "playwright": True,
                "playwright_include_page": True,
                "playwright_page_methods": [
                    PageMethod("wait_for_selector", "a[href*='/rooms/']"),
                    PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/3)"),
                    PageMethod("wait_for_timeout", 1000),
                    PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/3)"),
                    PageMethod("wait_for_timeout", 1000),
                    PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/3)"),
                    PageMethod("wait_for_timeout", 1000)
                ],
                "errback": self.errback,
            })

    async def parse_room(self, response):
        page = response.meta.get("playwright_page")
        if page:
            await page.close()
        
        
        
        item = AirbnbItem()
        item['title'] = response.css('h1::text').get(default="").strip()

        # Location
        location_texts = response.css('h2.hpipapi::text').getall()
        location = ""
        for text in location_texts:
            if "nights" in text:
                location = text.split("in")[1].strip()
                break
        item['location'] = location


        # Extract price
        price_text = response.css('span.a8jt5op::text').getall()
        price = ""
        for text in price_text:
            if "per" in text:
                price = text.split("per")[0].strip()
                break
        item['price_per_night'] = price
        item['currency'] = price[0] if price else ""


        item['total_price'] = response.css('span._1qs94rc::text').get(default="").strip()

        all_image_urls = response.css('img::attr(src)').getall()
        item['image_urls'] = [url for url in all_image_urls if 'mapsresources-pa.googleapis.com' not in url]

        ratings_text = response.css('span.a8jt5op::text').getall()

        for text in ratings_text:
            if "Rated" in text:
                rating_text = text.split(" ")
                break

        item['ratings'] = rating_text[1] if len(rating_text) > 1 else None

        item['description'] = response.css('div.d1isfkwk::text').get(default="").strip()

        reviews_text =''

        item['reviews'] = reviews_text
        item['number_of_reviews'] = reviews_text[6] if len(reviews_text) > 6 else None


        reviews_text = response.css('span[data-testid="reviews-count"]::text').get(default="")
        item['amenities'] = response.css('div[data-testid="amenities"] *::text').getall()
        item['host'] = response.css('span[data-testid="host-name"]::text').get(default="").strip()

        item['property_type'] = response.css('div.t1kjrihn::text').get(default="").strip()
        
        yield item

    async def errback(self, failure):
        page = failure.request.meta.get("playwright_page")
        if page:
            await page.close()
