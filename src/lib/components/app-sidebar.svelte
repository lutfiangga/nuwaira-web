<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { page } from '$app/stores';
	import { Zap } from '@lucide/svelte';

	interface RouteItem {
		title: string;
		url: string;
		icon: any;
	}

	export let routes: RouteItem[] = [];
</script>

<Sidebar.Root>
	<Sidebar.Header class="max-h-36 max-w-36 mx-auto w-full">
		<div class="flex items-center gap-2 font-extrabold text-xl tracking-tight pt-4 uppercase">
			<div
				class="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground"
			>
				<Zap class="h-5 w-5 fill-current" />
			</div>
			Zvelkit
		</div>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>

			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each routes as item (item.title)}
						{@const active = $page.url.pathname === item.url}

						<Sidebar.MenuItem>
							<Sidebar.MenuButton data-active={active}>
								{#snippet child({ props })}
									<a
										href={item.url}
										class={`flex items-center gap-2 ${active ? 'text-primary font-semibold' : ''}`}
										{...props}
									>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>Hello Word</Sidebar.Footer>
</Sidebar.Root>
