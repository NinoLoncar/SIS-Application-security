const Ajv = require("ajv");

const registrationSchema = {
	type: "object",
	properties: {
		email: {
			type: "string",
			pattern:
				"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$",
			maxLength: 320,
		},
		name: { type: "string" },
		surname: { type: "string" },
		password: { type: "string", minLength: 8 },
		postal: { type: "string", pattern: "^[0-9]{5}$" },
		address: { type: "string" },
		countries_id: { type: "integer" },
	},
	required: [
		"email",
		"name",
		"surname",
		"password",
		"postal",
		"address",
		"countries_id",
	],
};

exports.validateRegistratonData = function (data) {
	const ajv = new Ajv();
	const validate = ajv.compile(registrationSchema);

	return validate(data);
};
