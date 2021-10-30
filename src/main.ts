import App from './App.svelte';
const loadStuff=async () =>await import( "./example/example.js")

loadStuff();

const app = new App({
	target: document.body,
	props: {
		name: 'world2'
	}
});

export default app;