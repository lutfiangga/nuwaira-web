<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	let {
		open = $bindable(false),
		id,
		action = '?/delete',
		resourceName = 'item',
		title = 'Are you sure?',
		description = 'This action cannot be undone. This will permanently delete the item.'
	}: {
		open: boolean;
		id: string;
		action?: string;
		resourceName?: string;
		title?: string;
		description?: string;
	} = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{description.replace('item', resourceName)}
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer>
			<Dialog.Close>
				<Button variant="ghost">Cancel</Button>
			</Dialog.Close>

			<form
				method="post"
				{action}
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							open = false;
							await update();
						}
					};
				}}
			>
				<input type="hidden" name="id" value={id} />
				<Button type="submit" variant="destructive">Delete</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
