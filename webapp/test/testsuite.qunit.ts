export default {
	name: "QUnit test suite for the UI5 Application: de.kernich.icon.preview",
	defaults: {
		page: "ui5://test-resources/de/kernich/icon/preview/Test.qunit.html?testsuite={suite}&test={name}",
		qunit: {
			version: 2
		},
		sinon: {
			version: 4
		},
		ui5: {
			language: "EN",
			theme: "sap_horizon"
		},
		coverage: {
			only: "de/kernich/icon/preview/",
			never: "test-resources/de/kernich/icon/preview/"
		},
		loader: {
			paths: {
				"de/kernich/icon/preview": "../"
			}
		}
	},
	tests: {
		"unit/unitTests": {
			title: "Unit tests for de.kernich.icon.preview"
		},
		"integration/opaTests": {
			title: "Integration tests for de.kernich.icon.preview"
		}
	}
};
