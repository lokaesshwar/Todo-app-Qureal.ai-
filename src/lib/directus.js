import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('https://testapi.qureal.com').with(rest());
directus.auth.static('oEXnjo9D2551NQc-w7z96TQsYD9I6Hyg');

export default directus;
