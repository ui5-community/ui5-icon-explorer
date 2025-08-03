import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";

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

		this.setModel(models.createDeviceModel(), "device");

		this.getRouter().initialize();
	}
}
