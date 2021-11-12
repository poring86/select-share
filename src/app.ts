import axios from "axios";

const form = <HTMLFormElement>document.querySelector("form")!;
const addressInput = <HTMLInputElement>document.getElementById("address")!;

const GOOGLE_API_KEY = "YOUR_API_KEY";

type GoogleGeocodingResponse = {
	results: { geometry: { location: { lat: number; lng: number } } }[];
	status: "OK" | "ZERO_RESULTS";
};
function seartchAddressHandler(event: Event) {
	event.preventDefault();
	const enteredAddress = addressInput.value;

	axios
		.get<GoogleGeocodingResponse>(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
				enteredAddress
			)},
    +Mountain+View,+CA&key=${GOOGLE_API_KEY}`
		)
		.then((response) => {
			if (response.data.status !== "OK") {
				throw new Error("Could fetch location!");
			}
			const coordinates = response.data.results[0].geometry.location;

			const mapDiv = document.querySelector<HTMLDivElement>("#map");

			if (mapDiv) {
				const map = new google.maps.Map(mapDiv, {
					center: coordinates,
					zoom: 16,
				});

				new google.maps.Marker({ position: coordinates, map: map });
			}
		})
		.catch((err) => {
			alert(err.message);
			console.log(err);
		});
}

form.addEventListener("submit", seartchAddressHandler);
