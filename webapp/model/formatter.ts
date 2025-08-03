/**
 * @namespace de.kernich.icon.preview.model
 */
export default class Formatter {
	public static formatCollectionName(collection: string): string {
		if(collection === "undefined") {
			return "built-in";
		}
		return collection;
	}

	public static formatFavIcon(fav: boolean): string {
		return fav ? "sap-icon://fa-solid/star" : "sap-icon://fa-regular/star";
	}
}