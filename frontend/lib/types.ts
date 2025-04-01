export interface Listing {
	id: number | string;
	title: string;
	property_type: string;
	location: string;
	price_per_night: string;
	currency: string;
	cleaning_fee: string;
	service_fee: string;
	total_price: string;
	image_urls: string[];
	ratings: string;
	description: string;
	reviews: Review[];
	number_of_reviews: number;
	review_tags: ReviewTag[];
	amenities: string[];
	total_amenities_count: number;
	amenities_metadata: {
		total_count: number;
		extracted_count: number;
	};
	host: string;
}

export interface Review {
	rating: number;
	review_date: string;
	review_text: string;
	reviewer_name: string;
}

export interface ReviewTag {
	tag: string;
	count: number;
}
