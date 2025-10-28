import { getSessionUser } from '$lib/api/auth';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const user = await getSessionUser(event.cookies);
    
    // Redireciona usuário autenticado tentando acessar login
    if (event.url.pathname.startsWith('/login') && user) {
        return new Response(null, {
            status: 302,
            headers: { 'Location': '/dashboard' }
        });
    }
    
    // Redireciona usuário não autenticado tentando acessar rotas protegidas
    if (event.route.id?.startsWith('/(app)') && !user) {
        return new Response(null, {
            status: 302,
            headers: { 'Location': '/login' }
        });
    }
    
    // Anexa usuário em event.locals se autenticado
    event.locals.user = user;
    
    return await resolve(event);
}