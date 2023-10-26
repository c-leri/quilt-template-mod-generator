<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let label: string;
	export let checked: Writable<boolean>;
</script>

<div class="field">
	<div class="control">
		<label class="checkbox">
			<input type="checkbox" bind:checked={$checked} />
			{label}
		</label>
	</div>
</div>
