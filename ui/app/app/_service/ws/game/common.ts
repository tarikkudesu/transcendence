interface JsonProps {
	message: string;
	target: unknown;
}

export function Json({ message, target }: JsonProps) {
	const json = JSON.parse(message);
	const properties = Object.getOwnPropertyNames(json);
	Object.getOwnPropertyNames(target).forEach((property) => {
		if (properties.some((ele) => ele === property) === false) throw new Error('Invalid JSON ' + message + JSON.stringify(target));
	});
	return json;
}
