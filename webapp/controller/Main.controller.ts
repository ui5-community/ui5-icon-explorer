
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
import Controller from "sap/ui/core/mvc/Controller";
import { Button$PressEvent } from "sap/m/Button";
import Lib from "sap/ui/core/Lib";
import MessageBox from "sap/m/MessageBox";

type IconRecord = {
	icon: string,
	collection: string,
	src: string,
	fav: boolean
}

/**
 * @namespace de.kernich.icon.preview.controller
 */
export default class Main extends Controller {
	formatter = Formatter;

	icons: IconRecord[] = [];
	collections: {name: string, key: string}[] = [{
		name: "All",
		key: "all"
	}];
	viewData: {
		count: number,
		search: string,
		selectedCollection: string,
		selectedTheme: string,
		selectedIcon: IconRecord
	} = {
		count: 0,
		search: "",
		selectedCollection: "all",
		selectedTheme: "sap_horizon",
		selectedIcon: {
			icon: "",
			collection: "",
			src: "",
			fav: false
		}
	};

	onInit(): void {
		void this.initAsync();
	}

	private initAsync(): void {
		const maxRetries = 20;
		const retryDelay = 500;
		let retries = 0;

		const checkLibraryLoaded = async () => {
			if (Lib.isLoaded("fontawesome.icons.lib") && IconPool.getIconCollectionNames().includes("fa-solid")) {
				this.initData();
			} else if (retries < maxRetries) {
				await new Promise(resolve => setTimeout(resolve, retryDelay));
				retries++;
				await checkLibraryLoaded();
			} else {
				MessageBox.error("fontawesome.icons.lib not loaded");
			}
		};
		void checkLibraryLoaded();
	}

	private initData(): void {
		const viewData = new JSONModel(this.viewData);
		this.getView().setModel(viewData, "viewData");

		const iconModel = new JSONModel(this.icons);
		iconModel.setSizeLimit(10000);
		this.getView().setModel(iconModel, "icons");

		const collections = IconPool.getIconCollectionNames();
		const collectionModel = new JSONModel(this.collections);
		this.getView().setModel(collectionModel, "collections");

		const favs = this.getLocalStorageFavs();

		for(const collection of collections) {
			const icons = IconPool.getIconNames(collection as string);
			for (const icon of icons) {
				let src = "sap-icon://";
				if(collection && collection !== "undefined") {
					src += collection +  "/";
				}
				src += icon;
				this.icons.push({icon: icon as string, collection: collection as string, src: src, fav: favs.includes(src)});
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

	public onIconPress(event: ListItemBase$PressEvent) {
		const icon = event.getSource().getBindingContext("icons").getObject() as IconRecord;
		this.viewData.selectedIcon = icon;
		(this.getView().byId("IdSidePanel") as SidePanel).setActionBarExpanded(true);
		this.getView()?.getModel("viewData")?.refresh(true);
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

	public async onCopy(event: Button$PressEvent) {
		const icon = event.getSource().getBindingContext("icons").getObject() as IconRecord;
		await navigator.clipboard.writeText(icon.src);
		MessageToast.show("Icon copied to clipboard");
	}

	public onToggleIconFav(event: Button$PressEvent) {
		const icon = event.getSource().getBindingContext("icons").getObject() as IconRecord;
		icon.fav = !icon.fav;
		this.getView()?.getModel("icons")?.refresh(true);
		this.setFavValue(icon.src, icon.fav);
	}

	public getLocalStorageFavs(): string[] {
		const favs = localStorage.getItem("favs");
		if(!favs) {
			return [];
		}
		return JSON.parse(favs) as string[];
	}

	public setFavValue(iconSrc: string, fav: boolean): void {
		const favs = this.getLocalStorageFavs();
		if(fav) {
			if(!favs.includes(iconSrc)) {
				favs.push(iconSrc);
			}
		} else {
			favs.splice(favs.indexOf(iconSrc), 1);
		}
		localStorage.setItem("favs", JSON.stringify(favs));
	}
}
