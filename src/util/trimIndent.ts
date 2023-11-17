import rawString from "./rawString";

const FIRST_LINES = /^(?<firstLines>[\r\n]*)/;
const FIRST_SPACES_OR_TABS = /^(?<indent>([ ]+|[\t]+))/;
const LAST_LINES = /(?<lastLines>[\r\n]*)$/;
const LAST_WHITESPACE = /[\r\n\s\t]*$/;

function trimEnd(line: string) {
	return line.replace(LAST_WHITESPACE, "");
}

export function trimIndent(
	template: TemplateStringsArray,
	...args: unknown[]
): string;
export function trimIndent(content: string): string;
export function trimIndent(
	content: string | TemplateStringsArray,
	...args: unknown[]
): string {
	let str = typeof content === "string" ? content : rawString(content, ...args);
	console.log("Trimming indent on");
	console.log(str);
	console.log("Trimmed");
	const firstLines = str.match(FIRST_LINES)?.groups?.firstLines || "";
	const lastLines = str.match(LAST_LINES)?.groups?.lastLines || "";
	str = trimEnd(
		str.substring(firstLines.length, str.length - lastLines.length),
	);
	let smallestIndent: undefined | string;
	for (const line of str.split("\n")) {
		const indent = line.match(FIRST_SPACES_OR_TABS)?.groups?.indent;
		if (indent && !smallestIndent) {
			smallestIndent = indent;
		} else if (
			typeof indent === "string" &&
			typeof smallestIndent === "string" &&
			indent.length < smallestIndent.length
		) {
			smallestIndent = indent;
		}
	}
	if (smallestIndent === undefined) return str;
	return str
		.split("\n")
		.map((line) =>
			trimEnd(
				line.startsWith(smallestIndent as string)
					? line.substring((smallestIndent as string).length)
					: line,
			),
		)
		.join("\n");
}

export default trimIndent;

process.stdout.write(
	trimIndent`
		❌ Error: Title is not up to standards.
		
		Title must be formatted as follows:
		
		\`\`\`
		<type>: <summary>
		<type>!: <summary>
		<type>(<scope>): <summary>
		<type>(<scope>)!: <summary>
		\`\`\`
	`,
);

process.stdout.write(
	`
		❌ Error: Title is not up to standards.
		
		Title must be formatted as follows:
		
		\`\`\`
		<type>: <summary>
		<type>!: <summary>
		<type>(<scope>): <summary>
		<type>(<scope>)!: <summary>
		\`\`\`
	`,
);
