import type { Listing } from "./types";

export async function searchListings(
	params: Record<string, string>,
): Promise<Listing[]> {
	try {
		const queryParams = new URLSearchParams();
		if (params.location) {
			queryParams.append("location", params.location);
		}
		if (params.checkIn) {
			queryParams.append("checkIn", params.checkIn);
		}
		if (params.checkOut) {
			queryParams.append("checkOut", params.checkOut);
		}
		if (params.guests) {
			queryParams.append("guests", params.guests);
		}

		const response = await fetch(
			`http://localhost:8000/api/listings?${queryParams.toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`);
		}

		const data = await response.json();
		return Array.isArray(data) ? data : [];
	} catch (error) {
		console.error("Error fetching listings from API:", error);
		await new Promise((resolve) => setTimeout(resolve, 800));
		return [];
	}
}

export async function getListingById(
	id: string | number,
): Promise<Listing | null> {
	try {
		const response = await fetch(`http://localhost:8000/api/listings/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`);
		}

		const data = await response.json();
		return data || null;
	} catch (error) {
		console.error("Error fetching listing details from API:", error);
		// Fallback to mock data if API fails
		await new Promise((resolve) => setTimeout(resolve, 800));
		return null;
	}
}
