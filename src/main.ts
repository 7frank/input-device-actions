import App from './App.svelte';
import "./example/example.js"


const app = new App({
	target: document.body,
	props: {
		name: 'world2'
	}
});

export default app;