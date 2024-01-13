import { loading } from '$lib/translations';
import type { LayoutLoad } from './$types';

import 'virtual:uno.css';

export const load: LayoutLoad = async () => {
	await loading.toPromise();
};

export const prerender = true;
