import scrapy
import re
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
        # Default user agent
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"

    def start_requests(self):
        """Generate initial requests for search results pages"""
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                headers={"User-Agent": self.user_agent},
                meta={
                    "playwright": True,
                    "playwright_include_page": True, 
                    "playwright_page_methods": [
                        # Wait for listings to appear
                        PageMethod("wait_for_selector", "a[href*='/rooms/']"),
                        # Scroll to load more content
                        PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/2)"),
                        PageMethod("wait_for_timeout", 2000),
                        PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight)"),
                        PageMethod("wait_for_timeout", 3000)
                    ],
                    "errback": self.errback,
                },
                callback=self.parse_listings
            )

    async def parse_listings(self, response):
        """Parse listing URLs from search results and follow each listing"""
        # Close playwright page to free resources
        page = response.meta.get("playwright_page")
        if page:
            await page.close()

        # Extract and follow each listing URL
        listing_links = response.css("a[href*='/rooms/']")
        self.logger.info(f"Found {len(listing_links)} listings on page")
        
        for a_tag in listing_links:
            href = a_tag.attrib.get("href")
            if href:
                room_url = response.urljoin(href.strip())
                # Only process each URL once
                if '/rooms/' in room_url and '?' in room_url:
                    
                    yield scrapy.Request(
                        room_url,
                        headers={"User-Agent": self.user_agent},
                        meta={
                            "playwright": True,
                            "playwright_include_page": True,
                            "playwright_page_methods": [
                                PageMethod("wait_for_selector", "h1"),
                                PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/4)"),
                                PageMethod("wait_for_timeout", 1000),
                                PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/4)"),
                                PageMethod("wait_for_timeout", 1000),
                                PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/4)"),
                                PageMethod("wait_for_timeout", 1000),
                                PageMethod("evaluate", "window.scrollBy(0, document.body.scrollHeight/4)"),
                                PageMethod("wait_for_timeout", 1000)
                            ],
                            "errback": self.errback,
                        },
                        callback=self.parse_room
                    )
                    
        # Handle pagination
        next_page = response.css('a[aria-label="Next"]::attr(href)').get()
        if next_page:
            self.logger.info(f"Following next page: {next_page}")
            yield response.follow(
                next_page, 
                callback=self.parse_listings, 
                headers={"User-Agent": self.user_agent},
                meta={
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
                }
            )

    async def parse_room(self, response):
        page = response.meta.get("playwright_page")
        if page:
            await page.close()
        
        self.logger.info(f"Parsing room details: {response.url}")
        
        item = AirbnbItem()
        try:
            item['id'] = response.url.split("/rooms/")[1].split("?")[0]
        except (IndexError, KeyError):
            item['id'] = None
            self.logger.warning(f"Could not extract ID from URL: {response.url}")
        
        # Extract title
        item['title'] = response.css('h1::text').get(default="").strip()

        # Extract property type and location
        property_type_text = response.css('div.t1kjrihn h2.hpipapi::text').get()
        
        if property_type_text:
            property_type_full = property_type_text.strip()
            
            if " in " in property_type_full:
                property_type = property_type_full.split(" in ")[0].strip()
                location = property_type_full.split(" in ")[1].strip()
                
                item['property_type'] = property_type 
                item['location'] = location       
            else:
                item['property_type'] = property_type_full
        else:
            item['property_type'] = response.css('div.t1kjrihn::text').get(default="").strip()
            
            location_texts = response.css('h2.hpipapi::text').getall()
            location = ""
            for text in location_texts:
                if "nights" in text and "in" in text:
                    try:
                        location = text.split("in")[1].strip()
                        break
                    except IndexError:
                        continue
            item['location'] = location

        # Enhanced price extraction logic
        # 1. Price per night
        price_per_night = None
        currency = None
        
        # Strategy 1: From the summary display
        price_element = response.css('div._jczto5 ._hb913q::text, span._1qgfaxb1 ._hb913q::text').get()
        if price_element:
            price_match = re.search(r'([₹$€£¥])\s*([\d,]+)', price_element)
            if price_match:
                currency = price_match.group(1)
                price_per_night = price_match.group(2).replace(',', '')
        
        # Strategy 2: From booking section
        if not price_per_night:
            price_rows = response.css('div._14omvfj')
            for row in price_rows:
                label = row.css('div.l1x1206l::text').get('')
                if 'nights' in label:
                    price = row.css('span._1k4xcdh::text').get('')
                    if price:
                        price_match = re.search(r'([₹$€£¥])\s*([\d,]+)', price)
                        if price_match:
                            currency = price_match.group(1)
                            per_stay_price = price_match.group(2).replace(',', '')
                            # Extract number of nights to calculate per night price
                            nights_match = re.search(r'x\s*(\d+)\s*nights', label)
                            if nights_match:
                                nights = int(nights_match.group(1))
                                price_per_night = str(int(per_stay_price) // nights)
                            break
        
        # Strategy 3: From any text with "night" in it
        if not price_per_night:
            night_texts = response.xpath('//*[contains(text(), "night")]//text()').getall()
            for text in night_texts:
                price_match = re.search(r'([₹$€£¥])\s*([\d,]+)\s*(?:per|\/|a)\s*night', text)
                if price_match:
                    currency = price_match.group(1)
                    price_per_night = price_match.group(2).replace(',', '')
                    break
                    
        # Fallback to original method if all strategies fail
        if not price_per_night:
            price_text = response.css('span.a8jt5op::text').getall()
            price = ""
            for text in price_text:
                if "per" in text:
                    price = text.split("per")[0].strip()
                    break
            price_per_night = price
            currency = price[0] if price else ""
        
        item['price_per_night'] = price_per_night
        item['currency'] = currency
        
        # 2. Extract cleaning fee
        cleaning_fee = None
        fee_rows = response.css('div._14omvfj')
        for row in fee_rows:
            label = row.css('div.l1x1206l::text').get('').strip()
            if "Cleaning fee" in label:
                fee_text = row.css('span._1k4xcdh::text').get('').strip()
                fee_match = re.search(r'([₹$€£¥])\s*([\d,]+)', fee_text)
                if fee_match:
                    cleaning_fee = fee_match.group(2).replace(',', '')
                    break
        
        item['cleaning_fee'] = cleaning_fee
        
        # 3. Extract service fee
        service_fee = None
        for row in fee_rows:
            label = row.css('div.l1x1206l::text').get('').strip()
            if "service fee" in label.lower():
                fee_text = row.css('span._1k4xcdh::text').get('').strip()
                fee_match = re.search(r'([₹$€£¥])\s*([\d,]+)', fee_text)
                if fee_match:
                    service_fee = fee_match.group(2).replace(',', '')
                    break
        
        item['service_fee'] = service_fee
        
        # 4. Extract total price
        total_price = None
        total_element = response.css('span._1qs94rc ._j1kt73::text').get()
        if total_element:
            price_match = re.search(r'([₹$€£¥])\s*([\d,]+)', total_element)
            if price_match:
                total_price = price_match.group(2).replace(',', '')
        
        if not total_price:  # Fallback to original method
            total_price = response.xpath('//span[contains(@class, "_1qs94rc")]/span/span/text()').get()
            
        item['total_price'] = total_price

        # Extract images
        all_image_urls = response.css('img::attr(src)').getall()
        item['image_urls'] = [url for url in all_image_urls if url and 'a0.muscache.com/im/pictures' in url]

        # Extract ratings more robustly
        ratings_text = response.css('span.a8jt5op::text').getall()
        item['ratings'] = None
        rating_text = []
        
        for text in ratings_text:
            if "Rated" in text:
                rating_text = text.split(" ")
                try:
                    for part in rating_text:
                        if part and part[0].isdigit():
                            item['ratings'] = part
                            break
                except (IndexError, AttributeError):
                    pass
                break

        # Extract description with multiple fallback methods
        description = None

        # Method 1: Extract from the "About this place" section (most common)
        about_section = response.xpath('//section[./h2[contains(text(), "About this") or contains(text(), "About the")]]')
        if about_section:
            # Try to get the full text content from spans
            description_spans = about_section.css('div[data-section-id="DESCRIPTION_DEFAULT"] span::text').getall()
            if description_spans:
                description = ' '.join([span.strip() for span in description_spans if span.strip()])
            
            # If that fails, try another common structure
            if not description:
                description_spans = about_section.css('div.d1isfkwk span::text, div._1qsawv5 span::text').getall()
                if description_spans:
                    description = ' '.join([span.strip() for span in description_spans if span.strip()])

        # Method 2: Look for description in any div with content classes
        if not description:
            description_candidates = response.css('div.d1isfkwk span::text, div._1qsawv5 span::text, div._1hs1tf5 span::text').getall()
            if description_candidates:
                description = ' '.join([text.strip() for text in description_candidates if text.strip()])

        # Method 3: More generic approach - look for text in any description-like container
        if not description:
            # Try to find sections that might contain description
            desc_sections = response.xpath('//section[.//div[contains(@class, "bmwtyu7") or contains(@class, "_1ks8cgb")]]')
            for section in desc_sections:
                desc_texts = section.css('span::text').getall()
                if desc_texts and len(''.join(desc_texts)) > 100:  # Likely a description if text is substantial
                    description = ' '.join([text.strip() for text in desc_texts if text.strip()])
                    break

        # Method 4: Look for any paragraph content after the title section
        if not description:
            title_section = response.css('div.t1kjrihn').xpath('./ancestor::section')
            if title_section:
                next_sections = title_section.xpath('./following-sibling::*')
                for section in next_sections:
                    paragraphs = section.css('span::text').getall()
                    if paragraphs and len(''.join(paragraphs)) > 100:
                        description = ' '.join([p.strip() for p in paragraphs if p.strip()])
                        break

        # Method 5: Use the meta description as fallback
        if not description:
            meta_description = response.xpath('//meta[@property="og:description"]/@content').get()
            if meta_description:
                description = meta_description.strip()

        # Cleanup the description
        if description:
            # Remove excessive whitespace and line breaks
            description = re.sub(r'\s+', ' ', description).strip()
            # Remove any common prefix text like "About this space" from the description
            prefixes_to_remove = ["About this space", "About this place", "About this property", "About this home"]
            for prefix in prefixes_to_remove:
                if description.startswith(prefix):
                    description = description[len(prefix):].strip()

        item['description'] = description

        # Extract reviews
        reviews = []
        review_items = response.css('div[role="listitem"]._b7zir4z')
        
        for review_item in review_items:
            try:
                reviewer_name = review_item.css('h3.hpipapi::text').get(default="").strip()
                review_date_elements = review_item.css('div.s78n3tv::text').getall()
                review_date = review_date_elements[-1].strip() if review_date_elements else ""
                review_text = review_item.css('span.l1h825yc::text').get(default="").strip()
                review_rating = len(review_item.css('svg path[fill-rule="evenodd"]'))
                
                if reviewer_name or review_text:
                    reviews.append({
                        'reviewer_name': reviewer_name,
                        'review_date': review_date,
                        'review_text': review_text,
                        'rating': review_rating
                    })
            except Exception as e:
                self.logger.warning(f"Error extracting review: {e}")
        
        # Extract review tags (features mentioned in reviews)
        review_tags = []
        for tag in response.css('div.ifu6v81'):
            try:
                tag_name = tag.css('span::text').get(default="").strip()
                tag_count_text = tag.css('span.bqy9953::text').get(default="0")
                tag_count = int(''.join(filter(str.isdigit, tag_count_text)))
                
                if tag_name:
                    review_tags.append({
                        'tag': tag_name,
                        'count': tag_count
                    })
            except (ValueError, AttributeError) as e:
                self.logger.warning(f"Error extracting review tag: {e}")
        
        item['reviews'] = reviews
        item['number_of_reviews'] = len(reviews) if reviews else None
        item['review_tags'] = review_tags

        # Extract amenities
        amenities = []
        
        # Try multiple selectors for amenities
        amenities_section = response.xpath('//h2[contains(text(), "What this place offers")]/ancestor::section')
        
        if amenities_section:
            for amenity_item in amenities_section.css('div._19xnuo97'):
                amenity_text = amenity_item.css('div.iikjzje div::text').get(default="").strip()
                if amenity_text:
                    amenities.append(amenity_text)
        
        # Fallback amenities extraction
        if not amenities:
            for amenity_item in response.css('div.iikjzje, div._1pje60h'):
                amenity_text = amenity_item.css('::text').get(default="").strip()
                if amenity_text:
                    amenities.append(amenity_text)
        
        # Get total amenities count from "Show all" button
        show_all_btn = response.xpath('//button[contains(., "Show all")]//text()').getall()
        total_amenities_count = None
        if show_all_btn:
            show_all_text = ' '.join(show_all_btn)
            count_text = ''.join(filter(str.isdigit, show_all_text))
            if count_text:
                total_amenities_count = int(count_text)
        else:
            total_amenities_count = len(amenities) if amenities else 0
        
        item['amenities'] = amenities
        item['total_amenities_count'] = total_amenities_count
        
        # Save additional metadata in the amenities_metadata field
        item['amenities_metadata'] = {
            'total_count': total_amenities_count,
            'extracted_count': len(amenities)
        }
        
        # Extract host info
        host = response.css('div.t1pxe1a4::text').get(default="")
        item['host'] = host.replace("Hosted by", "").strip() if host else None
        
        yield item

    async def errback(self, failure):
        self.logger.error(f"Request failed: {failure}")
        page = failure.request.meta.get("playwright_page")
        if page:
            await page.close()