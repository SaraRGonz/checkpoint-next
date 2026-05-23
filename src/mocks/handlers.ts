import { http, HttpResponse } from 'msw';

export const handlers = [
    http.get(/\/api\/library/, () => {
        return HttpResponse.json({
            data: [
                { id: '1', title: 'Cyberpunk 2077', status: 'Wishlist', genres: [], platform: 'PC' },
                { id: '2', title: 'Hollow Knight', status: 'Playing', genres: [], platform: 'PC' }
            ]
        });
    }),
    
    http.post(/\/api\/games\/.*\/playthroughs/, () => {
        return HttpResponse.json({
            id: 'new-p-1',
            status: 'Queue',
            startDate: new Date().toISOString()
        }, { status: 201 });
    })
];