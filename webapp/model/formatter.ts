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
}