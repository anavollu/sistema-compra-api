module.exports = {
	"extends": ["airbnb-base", "plugin:jest/recommended"],
	"plugins": [
		"import",
	],
	"rules": {
		"no-console": "off",
		"no-param-reassign": [2, {
			"props": false
		}],
		"object-curly-newline": 0,
		"no-underscore-dangle": ["error", {"allow": ["__", "_id", "_", "_source", "_scroll_id", "_embedded"]}],
		"max-len": ["error", { "code": 100, "ignoreComments": true }],
		"no-unused-vars": ["error", {"allow": ["should|expect"]}],
	},
	"globals": {},
	"env": {
		"mocha": true,
	},
};
