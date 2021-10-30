
const loadStuff=async () =>await import( "./example/example.js")
import App from './App.svelte';
loadStuff();

const app = new App({
	target: document.body,
	props: {
		name: '2.0.0'
	}
});

export default app;