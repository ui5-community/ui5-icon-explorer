import Core from "sap/ui/core/Core";
import Lib from "sap/ui/core/Lib";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace de.kernich.icon.preview
 */
export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
		interfaces: ["sap.ui.core.IAsyncContentCreation"]
	};

	public init(): void {
		super.init();

		this.getRouter().initialize();
	}
}
