
import BaseController from "./BaseController";
import IconPool from "sap/ui/core/IconPool";
import JSONModel from "sap/ui/model/json/JSONModel";
import { Select$ChangeEvent } from "sap/m/Select";
import Theming from "sap/ui/core/Theming";
import Filter from "sap/ui/model/Filter";
import ListBinding from "sap/ui/model/ListBinding";
import FilterOperator from "sap/ui/model/FilterOperator";
import Formatter from "../model/formatter";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import SidePanel from "sap/f/SidePanel";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace de.kernich.icon.preview.controller
 */
export default class Main extends BaseController {

	formatter = Formatter;

	icons: {icon: string, collection: string, src: string}[] = [];
	collections: {name: string, key: string}[] = [{
		name: "All",
		key: "all"
	}];
	viewData: {
		count: number,
		search: string,
		selectedCollection: string,
		selectedTheme: string,
		selectedIcon: {
			icon: string,
			collection: string,
			src: string
		}
	} = {
		count: 0,
		search: "",
		selectedCollection: "all",
		selectedTheme: "sap_horizon",
		selectedIcon: {
			icon: "",
			collection: "",
			src: ""
		}
	};

	onInit(): void {
		const viewData = new JSONModel(this.viewData);
		this.getView().setModel(viewData, "viewData");
		const iconModel = new JSONModel(this.icons);
		iconModel.setSizeLimit(10000);
		this.getView().setModel(iconModel, "icons");
		const collections = IconPool.getIconCollectionNames();
		const collectionModel = new JSONModel(this.collections);
		this.getView().setModel(collectionModel, "collections");
		for(const collection of collections) {
			const icons = IconPool.getIconNames(collection as string);
			for (const icon of icons) {
				let src = "sap-icon://";
				if(collection && collection !== "undefined") {
					src += collection +  "/";
				}
				src += icon;
				this.icons.push({icon: icon as string, collection: collection as string, src: src});
			}
			this.collections.push({name: collection as string, key: collection as string});

		}
		this.viewData.count = this.icons.length;
		iconModel.refresh(true);
		collectionModel.refresh(true);
		this.getView()?.getModel("viewData")?.refresh(true);
	}

	private filter(): void {
		const search = this.viewData.search;
		const collection = this.viewData.selectedCollection;
		const gridList = this.getView().byId("IdGridList");
		const filter: Filter[] = [];

		if(search) {
			filter.push(new Filter("icon", FilterOperator.Contains, search));
		}

		if(collection &&collection !== "all") {
			filter.push(new Filter("collection", FilterOperator.EQ, collection));
		}

		(gridList.getBinding("items") as ListBinding).filter(filter);

		const count = (gridList.getBinding("items") as ListBinding).getLength();
		this.viewData.count = count;
		this.getView()?.getModel("viewData")?.refresh(true);
	}

	public onCollectionChange() {
		this.filter();
	}

	public onSearchChange() {
		this.filter();
	}

	public onThemeChange(event: Select$ChangeEvent): void {
		const theme = event.getSource().getSelectedKey();
		if(!theme) {
			return;
		}
		Theming.setTheme(theme);
	}

	public async onIconPress(event: ListItemBase$PressEvent) {
		const icon = event.getSource().getBindingContext("icons").getObject() as {icon: string, collection: string, src: string};
		this.viewData.selectedIcon = icon;
		(this.getView().byId("IdSidePanel") as SidePanel).setActionBarExpanded(true);
		this.getView()?.getModel("viewData")?.refresh(true);
		//const info = await IconPool.getIconInfo(icon.src);
	}

	public async onCopyIconFromSidePanel() {
		const icon = this.viewData.selectedIcon;
		await navigator.clipboard.writeText(icon.src);
		MessageToast.show("Icon copied to clipboard");
	}

	public async onCopySymbolIconFromSidePanel() {
		const icon = this.viewData.selectedIcon;
		await navigator.clipboard.writeText(icon.icon);
		MessageToast.show("Symbol copied to clipboard");
	}
}
