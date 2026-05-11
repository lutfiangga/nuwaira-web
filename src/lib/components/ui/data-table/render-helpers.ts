import type { Component, Snippet } from "svelte";

export class RenderComponentConfig<P extends Record<string, any> = any> {
	component: Component<P>;
	props?: P;

	constructor(component: Component<P>, props?: P) {
		this.component = component;
		this.props = props;
	}
}

export class RenderSnippetConfig<P extends Record<string, any> = any> {
	snippet: Snippet<[P]>;
	params: P;

	constructor(snippet: Snippet<[P]>, params: P) {
		this.snippet = snippet;
		this.params = params;
	}
}

export function renderComponent<P extends Record<string, any>>(
	component: Component<P>,
	props?: P
): RenderComponentConfig<P> {
	return new RenderComponentConfig(component, props);
}

export function renderSnippet<P extends Record<string, any>>(
	snippet: Snippet<[P]>,
	params: P
): RenderSnippetConfig<P> {
	return new RenderSnippetConfig(snippet, params);
}
