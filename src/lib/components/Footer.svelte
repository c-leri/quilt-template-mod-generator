<script lang="ts">
	import Button from './Button.svelte';

	// prettier-ignore
	const buttons = [
		{ title: "Discord", style: "is-discord", href: "https://discord.quiltmc.org", icon: "i-fa6-brands-discord" },
		{ title: "Forum", style: "is-gradle", href: "https://forum.quiltmc.org", icon: "i-fa6-brands-discourse" },
		{ title: "GitHub", style: "is-github", href: "https://github.com/QuiltMC", icon: "i-fa6-brands-github" },
		{ title: "Twitter", style: "is-twitter", href: "https://twitter.com/quilt_mc", icon: "i-fa6-brands-twitter" },
		{ title: "Mastodon", style: "is-mastodon", href: "https://tech.lgbt/@quiltmc", icon: "i-fa6-brands-mastodon" },
		{ title: "Twitch", style: "is-primary", href: "https://twitch.tv/quiltmc", icon: "i-fa6-brands-twitch" },
		{ title: "RSS", style: "is-rss", href: "https://quiltmc.org/feed.xml", icon: "i-fa6-solid-rss" },
	];
</script>

<footer class="footer">
	<div class="content">
		<div class="columns">
			<div class="column is-half is-offset-one-quarter">
				<div class="button-grid">
					{#each buttons as button}
						<Button {...button} />
					{/each}
				</div>

				<br />

				<div class="has-text-centered">
					<p>
						<strong>Copyright &copy; {new Date().getFullYear()} c-leri</strong>
					</p>

					<p>I am not affiliated with the Quilt Project or Mojang Studios.</p>

					<p>
						Quilt is not an official Minecraft product, and is not approved by or associated with
						Mojang Studios. "Minecraft" is a trademark of Mojang AB and any usage of the Minecraft
						brand on this site is used in accordance with Mojang Studios'
						<a href="https://www.minecraft.net/en-us/terms#terms-brand_guidelines" target="_blank"
							>Brand and Asset Guidelines</a
						>.
					</p>

					<p>All logos used on this site are the property of their respective owners.</p>

					<p>
						Made with <img
							src="https://quiltmc.org/assets/img/pineapple.png"
							alt=":pineapple:"
							title="Pineapple"
							width="24"
							height="24"
							class="pineapple"
						/>,
						<a href="https://bulma.io">Bulma</a> and
						<a href="https://github.com/CreativeBulma">the CreativeBulma extensions</a>.
					</p>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer,
	.pineapple {
		margin-bottom: -5px;
	}
</style>
