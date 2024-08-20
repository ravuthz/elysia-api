import { describe, expect, it } from 'bun:test'

import { apiCall } from '@/utils/test';

const dataTest = () => {
    const id = Date.now();
    return { firstName: 'test', lastName: 'test', email: `test-${id}@gm.com`, password: 'test' };
};

const newPostId = async () => {
    const res = await apiCall('api/users', 'POST', dataTest());
    return res.id;
};

describe('Api Posts', () => {
    it('GET /api/users return data', async () => {
        const res = await apiCall('api/users')
        expect(res).toBeTruthy();
    })

    it('GET /api/users/1 return item', async () => {
        const res = await apiCall('api/users/1')
        expect(res).toBeTruthy();
    })

    it('GET /api/users/9999 return 404', async () => {
        const res = await apiCall('api/users/9999')
        expect(res.status).toEqual(404);
        expect(res).toMatchObject({
            status: 404,
            message: "User not found."
        });
    })

    it('POST /api/users/ return item', async () => {
        // const input = dataTest();
        // const res = await apiCall('api/users', 'POST', input)
        // expect(res).toMatchObject(input);

        const res1 = await apiCall('api/users', 'POST', {})
        console.log(res1)
    })

    it('PATCH /api/users/1 return item', async () => {
        const input = dataTest();
        const res = await apiCall('api/users/1', 'PATCH', input)
        expect(res).toMatchObject(input);
    })

    it(`DELETE /api/users/ return null`, async () => {
        const dataId = await newPostId();
        const res = await apiCall(`api/users/${dataId}`, 'DELETE')
        expect(res).toEqual({});
    })

    it('DELETE /api/users/9999 return 404', async () => {
        const res = await apiCall('api/users/9999', 'DELETE')
        expect(res.status).toEqual(404);
        expect(res).toEqual({
            status: 404,
            message: "User not found."
        });
    })
})
