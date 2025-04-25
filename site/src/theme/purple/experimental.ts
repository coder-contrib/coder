import type { NewTheme } from "../experimental";
import tw from "../tailwindColors";

const experimental: NewTheme = {
	panel: {
		backgroundStrong: tw.zinc[800],
		backgroundLight: tw.zinc[800],
		border: tw.zinc[700],
		divider: tw.zinc[700],
	},
};

export default experimental;
