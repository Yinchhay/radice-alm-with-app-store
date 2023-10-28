/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./lucia.ts").Auth;
	type IAuthUserPreferences = import("../types/index.js").IAuthUserPreferences;
	type DatabaseUserAttributes = {
		username: string,
		email: string,
		preferences: IAuthUserPreferences,
	};
	type DatabaseSessionAttributes = {};
}